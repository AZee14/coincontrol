import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 1) Create Supabase client with 'cryptothing' as the default schema
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: { schema: "cryptothing" }
  }
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

    // 4) Fetch assets for that portfolio (amount and value)
    const { data: assetRows, error: assetError } = await supabase
      .from("assets")
      .select("coin_id, amount, value")
      .eq("portfolio_id", portfolioId)
      .order("coin_id", { ascending: true });
    if (assetError) throw assetError;

    // 5) Fetch coin metadata
    const coinIds = assetRows?.map(a => a.coin_id) || [];
    const { data: coinsData, error: coinsError } = await supabase
      .from("coins")
      .select("coin_id, coin_name, symbol, marketprice, volume1h, volume24h, volume7d")
      .in("coin_id", coinIds);
    if (coinsError) throw coinsError;

    // 6) Fetch buy transactions to compute avg buy price
    const { data: txData, error: txError } = await supabase
      .from("transaction_history")
      .select("coin_id, transaction_type, price_per_coin, amount")
      .eq("transaction_type", "Buy")
      .in("coin_id", coinIds);
    if (txError) throw txError;

    // 7) Build lookup maps
    const coinMap = new Map<any, Partial<AssetData>>();
    coinsData?.forEach(c => coinMap.set(c.coin_id, {
      name: c.coin_name,
      shorthand: c.symbol,
      current_price: c.marketprice,
      hourly_change: c.volume1h,
      daily_change: c.volume24h,
      weekly_change: c.volume7d,
    }));

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

    // 8) Compose final response including quantity and value
    const results: AssetData[] = (assetRows || []).map(a => {
      const info = coinMap.get(a.coin_id) || {};
      const avg = avgBuyMap.get(a.coin_id) || 0;
      const profit = a.value - a.amount * avg;
      const profitPct = avg > 0 ? (profit / (a.amount * avg)) * 100 : 0;
      return {
        name: info.name!,
        shorthand: info.shorthand!,
        current_price: info.current_price!,
        hourly_change: info.hourly_change!,
        daily_change: info.daily_change!,
        weekly_change: info.weekly_change!,
        holding_amount: a.amount,
        holding_value: a.value,
        avg_buy_price: avg,
        profit_loss_amount: profit,
        profit_loss_percentage: Number(profitPct.toFixed(2)),
      };
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
