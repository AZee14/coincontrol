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
    // 1) Get the user's portfolio
    const { data: portfolio, error: pErr } = await supabase
      .from("current_portfolio")
      .select("portfolio_id")
      .eq("user_id", userId)
      .single();
    if (pErr || !portfolio) throw pErr || new Error("Portfolio not found");
    const portfolioId = portfolio.portfolio_id;

    // 2) Fetch the worst asset for that portfolio
    const { data: asset, error: aErr } = await supabase
      .from("assets")
      .select("coin_id, contract_address, amount, avgbuyprice, profit_loss")
      .eq("portfolio_id", portfolioId)
      .order("profit_loss", { ascending: true })
      .limit(1)
      .single();
    if (aErr || !asset) throw aErr || new Error("No assets found");

    const {
      coin_id,
      contract_address,
      amount = 0,
      avgbuyprice = 0,
      profit_loss = 0,
    } = asset;

    // 3) Fetch the human‐readable name
    let name = "Unknown";
    if (coin_id) {
      const { data: coin, error: cErr } = await supabase
        .from("coins")
        .select("coin_name")
        .eq("coin_id", coin_id)
        .single();
      if (cErr) throw cErr;
      name = coin?.coin_name ?? name;
    } else if (contract_address) {
      const { data: dex, error: dErr } = await supabase
        .from("dex_pairs")
        .select("name")
        .eq("contract_address", contract_address)
        .single();
      if (dErr) throw dErr;
      name = dex?.name ?? name;
    }

    // 4) Compute metrics
    const loss = profit_loss;
    const investment = amount * avgbuyprice;
    const percentageLoss =
      investment > 0 ? (-profit_loss / investment) * 100 : 0;

    const result = {
      coin_id: coin_id ?? contract_address,
      coin_name: name,
      total_loss: loss,
      percentage_loss: Number(percentageLoss.toFixed(2)),
    };

    return NextResponse.json({ results: result });
  } catch (err: any) {
    console.error("Error fetching worst-performing asset:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
