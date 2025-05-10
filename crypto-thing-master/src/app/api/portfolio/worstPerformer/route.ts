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
    return NextResponse.json({ error: "userId parameter is required" }, { status: 400 });
  }

  try {
    // Step 1: fetch portfolio_id for the user
    const { data: portfolio, error: portErr } = await supabase
      .from("current_portfolio")
      .select("portfolio_id")
      .eq("user_id", userId)
      .single();
    if (portErr || !portfolio) throw portErr || new Error("Portfolio not found");

    const portfolioId = portfolio.portfolio_id;

    // Step 2: fetch worst asset (lowest profit_loss) for that portfolio
    const { data: worstAsset, error: assetErr } = await supabase
      .from("assets")
      .select("coin_id, profit_loss, amount, avgbuyprice")
      .eq("portfolio_id", portfolioId)
      .order("profit_loss", { ascending: true })
      .limit(1)
      .single();
    if (assetErr || !worstAsset) throw assetErr || new Error("No assets found");

    const { coin_id, profit_loss, amount, avgbuyprice } = worstAsset;

    // Step 3: fetch coin name
    const { data: coinData, error: coinErr } = await supabase
      .from("coins")
      .select("coin_name")
      .eq("coin_id", coin_id)
      .single();
    if (coinErr) throw coinErr;

    const coinName = coinData?.coin_name || "Unknown Coin";

    // Step 4: calculate metrics
    const loss = profit_loss ?? 0;
    const investment = (amount ?? 0) * (avgbuyprice ?? 0);
    const percentageLoss = investment > 0 ? (loss / investment) * 100 : 0;

    const result = {
      coin_id,
      coin_name: coinName,
      total_loss: loss,
      percentage_loss: Number(percentageLoss.toFixed(2)),
    };

    return NextResponse.json({ results: result });
  } catch (err: any) {
    console.error("Error fetching worst-performing coin:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
