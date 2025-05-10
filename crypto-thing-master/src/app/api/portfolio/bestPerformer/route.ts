import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "cryptothing" } }
);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId parameter is required" },
      { status: 400 }
    );
  }

  try {
    // 1) Get the user's portfolio ID
    const { data: portfolio, error: portfolioError } = await supabase
      .from("current_portfolio")
      .select("portfolio_id")
      .eq("user_id", userId)
      .single();
    if (portfolioError || !portfolio) throw portfolioError || new Error("Portfolio not found");

    const portfolioId = portfolio.portfolio_id;

    // 2) Fetch all assets for that portfolio
    const { data: assets, error: assetsError } = await supabase
      .from("assets")
      .select("coin_id, amount, avgbuyprice, profit_loss")
      .eq("portfolio_id", portfolioId);
    if (assetsError) throw assetsError;

    if (!assets || assets.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // 3) Fetch coin names for these assets
    const coinIds = assets.map((a) => a.coin_id);
    const { data: coins, error: coinsError } = await supabase
      .from("coins")
      .select("coin_id, coin_name")
      .in("coin_id", coinIds);
    if (coinsError) throw coinsError;

    const coinMap = new Map(coins?.map((c) => [c.coin_id, c.coin_name]));

    // 4) Compute profit metrics per asset
    const profitData = assets.map((asset: any) => {
      const name = coinMap.get(asset.coin_id) || "Unknown Coin";
      const profit = asset.profit_loss ?? 0;
      const investment = (asset.amount ?? 0) * (asset.avgbuyprice ?? 0);
      const percentage = investment > 0 ? (profit / investment) * 100 : 0;
      return {
        coin_id: asset.coin_id,
        coin_name: name,
        total_profit: profit,
        percentage_profit: Number(percentage.toFixed(2)),
      };
    });

    // 5) Find the best-performing coin
    const best = profitData.reduce((prev, curr) =>
      curr.total_profit > prev.total_profit ? curr : prev,
      profitData[0]
    );

    return NextResponse.json({ results: best });
  } catch (err: any) {
    console.error("Error fetching best-performing coin:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
