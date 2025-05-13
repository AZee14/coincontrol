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
    // 1) Find the user's current portfolio
    const { data: portfolio, error: pe } = await supabase
      .from("current_portfolio")
      .select("portfolio_id")
      .eq("user_id", userId)
      .single();
    if (pe || !portfolio) throw pe || new Error("Portfolio not found");
    const portfolioId = portfolio.portfolio_id;

    // 2) Fetch all assets for that portfolio
    const { data: assets, error: ae } = await supabase
      .from("assets")
      .select("coin_id, contract_address, amount, avgbuyprice, profit_loss")
      .eq("portfolio_id", portfolioId);
    if (ae) throw ae;
    if (!assets || assets.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // 3) Gather IDs & addresses
    const coinIds = Array.from(
      new Set(assets.filter(a => a.coin_id).map(a => a.coin_id))
    );
    const contractAddrs = Array.from(
      new Set(assets.filter(a => a.contract_address).map(a => a.contract_address))
    );

    // 4) Fetch names in parallel
    const [
      { data: coins, error: coinsError },
      { data: dexes, error: dexError }
    ] = await Promise.all([
      supabase
        .from("coins")
        .select("coin_id, coin_name")
        .in("coin_id", coinIds),
      supabase
        .from("dex_pairs")
        .select("contract_address, name")
        .in("contract_address", contractAddrs)
    ]);
    if (coinsError) throw coinsError;
    if (dexError)   throw dexError;

    // 5) Build a lookup map: key can be coin_id or contract_address
    const nameMap = new Map<string, string>();
    coins?.forEach(c => {
      if (c.coin_id) nameMap.set(c.coin_id, c.coin_name);
    });
    dexes?.forEach(d => {
      if (d.contract_address)
        nameMap.set(d.contract_address, d.name);
    });

    // 6) Compute profit metrics per asset
    const profitData = assets.map((a: any) => {
      // choose key & fallback
      const key   = a.coin_id || a.contract_address;
      const name  = nameMap.get(key) || "Unknown";
      const profit     = Number(a.profit_loss) || 0;
      const investment = (Number(a.amount) || 0) * (Number(a.avgbuyprice) || 0);
      const percentage = investment > 0 ? (profit / investment) * 100 : 0;
      return {
        coin_id: key,
        coin_name:name,
        total_profit: profit,
        percentage_profit: Number(percentage.toFixed(2)),
      };
    });

    // 7) Pick the best performer
    const best = profitData.reduce((prev, curr) =>
      curr.total_profit > prev.total_profit ? curr : prev,
      profitData[0]
    );

    return NextResponse.json({ results: best });
  } catch (err: any) {
    console.error("Error fetching best-performing asset:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
