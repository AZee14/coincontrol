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
    // 1) fetch portfolio_id
    const { data: port, error: portErr } = await supabase
      .from("current_portfolio")
      .select("portfolio_id")
      .eq("user_id", userId)
      .single();
    if (portErr || !port) throw portErr || new Error("Portfolio not found");
    const portfolioId = port.portfolio_id;

    // 2) fetch the dex‐asset + its metadata
    const { data, error } = await supabase
      .from("assets")
      .select(`
        amount,
        value,
        avgbuyprice,
        profit_loss,
        dex_pairs!inner (
          name,
          price
        )
      `)
      .eq("portfolio_id",     portfolioId)
      .eq("contract_address", contractAddress)
      .single();
    if (error || !data) throw error || new Error("DEX asset not found");

    const { dex_pairs, amount, value, avgbuyprice, profit_loss } = data;
    const dex = Array.isArray(dex_pairs) ? dex_pairs[0] : dex_pairs;

    // 3) calculate percentage loss/gain
    const profitLossPct =
      avgbuyprice && amount
        ? parseFloat(((profit_loss / (amount * avgbuyprice)) * 100).toFixed(2))
        : 0;

    return NextResponse.json({
      results: {
        name:                           dex.name,
        shorthand_notation:             contractAddress,
        amount,
        current_value_in_dollars:       value,
        avg_buy_price:                  avgbuyprice,
        total_profit_loss_amount:       profit_loss,
        total_profit_loss_percentage:   profitLossPct,
      },
    });
  } catch (err: any) {
    console.error("Error fetching DEX pair data:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
