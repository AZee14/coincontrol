import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 1) Create Supabase client with 'cryptothing' as the default schema
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "cryptothing" } }
);

export async function GET(req: Request) {
  // Define AssetData interface locally for TS
  interface AssetData {
    name: string;
    shorthand: string;
    current_price: number;
    hourly_change: number;
    daily_change: number;
    weekly_change: number;
    holding_amount: number;
    holding_value: number;
    avg_buy_price: number;
    profit_loss_amount: number;
    profit_loss_percentage: number;
  }

  try {
    // 2) Pull userId from query params
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId parameter is required" }, { status: 400 });
    }

    // 3) Fetch this user’s portfolio ID
    const { data: portfolioData, error: portfolioError } = await supabase
      .from("current_portfolio")
      .select("portfolio_id")
      .eq("user_id", userId)
      .single();
    if (portfolioError || !portfolioData) throw portfolioError || new Error("Portfolio not found");
    const portfolioId = portfolioData.portfolio_id;

    // 4) Fetch assets for that portfolio (amount, value, and profit_loss)
    const { data: assetRows, error: assetError } = await supabase
      .from("assets")
      .select("coin_id, amount, value, avgbuyprice, profit_loss")
      .eq("portfolio_id", portfolioId)
      .order("coin_id", { ascending: true });
    if (assetError) throw assetError;
    const coinIds = assetRows?.map(a => a.coin_id) || [];

    // 5) Fetch all transactions for these coins to compute oldest date per coin
    const { data: allTx, error: txAllError } = await supabase
      .from("transaction_history")
      .select("coin_id, date")
      .eq("portfolio_id", portfolioId)
      .in("coin_id", coinIds);
    if (txAllError) throw txAllError;
    const ageMap = new Map<any, number>();
    // initialize with large value
    coinIds.forEach(id => ageMap.set(id, Infinity));
    allTx?.forEach(tx => {
      const txDate = new Date(tx.date).getTime();
      const prev = ageMap.get(tx.coin_id) ?? Infinity;
      if (txDate && txDate < prev) ageMap.set(tx.coin_id, txDate);
    });
    // convert to hours since
    ageMap.forEach((ts, coin) => {
      const ms = ts === Infinity ? 0 : Date.now() - ts;
      ageMap.set(coin, ms / (1000 * 60 * 60));
    });

    // 6) Fetch coin metadata
    const { data: coinsData, error: coinsError } = await supabase
      .from("coins")
      .select("coin_id, coin_name, symbol, marketprice, volume1h, volume24h, volume7d")
      .in("coin_id", coinIds);
    if (coinsError) throw coinsError;

    // 7) Fetch buy transactions to compute avg buy price
    const { data: txData, error: txError } = await supabase
      .from("transaction_history")
      .select("coin_id, transaction_type, price_per_coin, amount")
      .eq("transaction_type", "Buy")
      .in("coin_id", coinIds);
    if (txError) throw txError;

    // 8) Build lookup maps for coins and avg prices
    const coinMap = new Map<any, any>();
    coinsData?.forEach(c => {
      coinMap.set(c.coin_id, {
        name: c.coin_name,
        shorthand: c.symbol,
        current_price: c.marketprice,
        hourly_change: c.volume1h,
        daily_change: c.volume24h,
        weekly_change: c.volume7d
      });
    });
    const avgBuyMap = new Map<any, number>();
    coinIds.forEach(id => {
      const buys = txData?.filter(t => t.coin_id === id) || [];
      if (buys.length) {
        const totalCost = buys.reduce((sum, t) => sum + t.price_per_coin * t.amount, 0);
        const totalAmt = buys.reduce((sum, t) => sum + t.amount, 0);
        avgBuyMap.set(id, totalCost / totalAmt);
      } else {
        avgBuyMap.set(id, 0);
      }
    });

    // 9) Compose final response including dynamic change based on each coin's age
    const results: AssetData[] = (assetRows || []).map(a => {
      const info = coinMap.get(a.coin_id) || {};
      const avg = avgBuyMap.get(a.coin_id) || 0;
      const profit = a.value - a.amount * avg;
      const profitPct = avg > 0 ? (profit / (a.amount * avg)) * 100 : 0;
      const ageHours = ageMap.get(a.coin_id) ?? 0;
      let daily = info.daily_change;
      let weekly = info.weekly_change;
      if (ageHours < 24) {
        daily = info.hourly_change;
        weekly = info.hourly_change;
      } else if (ageHours < 72) {
        weekly = info.daily_change;
      }
      return {
        name: info.name! as string,
        shorthand: info.shorthand! as string,
        current_price: info.current_price! as number,
        hourly_change: info.hourly_change! as number,
        daily_change: daily as number,
        weekly_change: weekly as number,
        holding_amount: a.amount as number,
        holding_value: a.value as number,
        avg_buy_price: avg.toFixed(3) as unknown as number,
        profit_loss_amount: profit.toFixed(3) as unknown as number,
        profit_loss_percentage: Number(profitPct.toFixed(2)) as number,
      };
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
