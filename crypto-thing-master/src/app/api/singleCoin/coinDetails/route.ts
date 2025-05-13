import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const coinId = url.searchParams.get("coinId");

  if (!userId || !coinId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "cryptothing" },
    }
  );

  try {
    // Get the portfolio_id for this user
    const { data: portfolioData, error: portfolioError } = await supabase
      .from("current_portfolio")
      .select("portfolio_id")
      .eq("user_id", userId)
      .single();

    if (portfolioError || !portfolioData) {
      throw new Error("Portfolio not found for user");
    }

    const portfolioId = portfolioData.portfolio_id;

    // Fetch asset and related coin
    const { data, error } = await supabase
      .from("assets")
      .select(
        `
        amount,
        value,
        avgbuyprice,
        profit_loss,
        coins!inner (
          coin_name,
          symbol
        )
      `
      )
      .eq("portfolio_id", portfolioId)
      .eq("coin_id", coinId)
      .single();

    if (error || !data) {
      throw new Error("Coin asset not found for this user");
    }

    const { coins, amount, value, avgbuyprice, profit_loss } = data;

    const coin = Array.isArray(coins) ? coins[0] : coins;

    const profitLossPercentage =
      avgbuyprice && amount
        ? parseFloat(((profit_loss / (amount * avgbuyprice)) * 100).toFixed(2))
        : 0;

    return NextResponse.json({
      results: {
        name: coin.coin_name,
        shorthand_notation: coin.symbol,
        amount: amount,
        value_in_dollars: value,
        avg_buy_price: avgbuyprice,
        total_profit_loss_amount: profit_loss,
        total_profit_loss_percentage: profitLossPercentage,
      },
    });
  } catch (error: any) {
    console.error("Error fetching coin data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
