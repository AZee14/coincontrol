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
    // 1) Get the user's portfolio
    const { data: portfolio, error: portError } = await supabase
      .from("current_portfolio")
      .select("portfolio_id, total_investment, total_value_now")
      .eq("user_id", userId)
      .single();
    if (portError || !portfolio) throw portError || new Error("Portfolio not found");

    const { portfolio_id, total_investment, total_value_now } = portfolio;

    // 2) Fetch transactions in the last 24h for this portfolio
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: txs, error: txError } = await supabase
      .from("transaction_history")
      .select("transaction_type, value")
      .eq("portfolio_id", portfolio_id)
      .gte("date", since);
    if (txError) throw txError;

    // 3) Compute net transaction value: buys positive, sells negative
    const netTxValue24h = txs
      ? txs.reduce((sum, tx) => sum + (tx.transaction_type === "Buy" ? tx.value : -tx.value), 0)
      : 0;

    // 4) Compute percentage relative to total investment
    const percentage24h = total_investment
      ? (netTxValue24h / total_investment) * 100
      : 0;

    const result = {
      net_change_24h: netTxValue24h,
      percentage_change_24h: Number(percentage24h.toFixed(2)),
      total_value_now,
      total_investment,
    };

    return NextResponse.json({ results: result });
  } catch (err: any) {
    console.error("Error fetching 24h portfolio change:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
