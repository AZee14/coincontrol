import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId          = url.searchParams.get("userId");
  const contractAddress = url.searchParams.get("contractAddress");

  if (!userId || !contractAddress) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "cryptothing" } }
  );

  try {
    // 1) Fetch the user's name
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("user_id", userId)
      .single();
    if (userErr || !userData) throw userErr || new Error("User not found");

    // 2) Get the portfolio ID
    const { data: portData, error: portErr } = await supabase
      .from("current_portfolio")
      .select("portfolio_id")
      .eq("user_id", userId)
      .single();
    if (portErr || !portData) throw portErr || new Error("Portfolio not found");
    const portfolioId = portData.portfolio_id;

    // 3) Fetch the asset + DEX pair metadata
    const { data: assetData, error: assetErr } = await supabase
      .from("assets")
      .select(`
        amount,
        value,
        avgbuyprice,
        profit_loss,
        dex_pairs!inner (
          symbol
        )
      `)
      .eq("portfolio_id",     portfolioId)
      .eq("contract_address", contractAddress)
      .single();
    if (assetErr || !assetData) throw assetErr || new Error("Asset not found");

    const { profit_loss, value, dex_pairs } = assetData;
    const dex = Array.isArray(dex_pairs) ? dex_pairs[0] : dex_pairs;

    // 4) Calculate absolute loss and percentage
    const absPL     = Math.abs(profit_loss);
    const pct       = value
      ? ((profit_loss / value) * 100).toFixed(2)
      : "0.00";
    const signedPct = profit_loss >= 0 ? `+${pct}%` : `-${pct}%`;

    // 5) Respond
    return NextResponse.json({
      results: {
        User_Name:                 `${userData.first_name} ${userData.last_name}`,
        DEX_Symbol:                dex.symbol,
        total_profit_loss_amount:  absPL,
        Percentage_profit_loss:    signedPct,
      },
    });
  } catch (err: any) {
    console.error("Error fetching DEX transactions:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
