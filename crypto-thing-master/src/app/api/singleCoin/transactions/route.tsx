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
    // Fetch the user's name
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("user_id", userId)
      .single();

    if (userError || !userData) {
      throw new Error("User not found");
    }

    // Get the portfolio ID for this user
    const { data: portfolioData, error: portfolioError } = await supabase
      .from("current_portfolio")
      .select("portfolio_id")
      .eq("user_id", userId)
      .single();

    if (portfolioError || !portfolioData) {
      throw new Error("Portfolio not found");
    }

    const portfolioId = portfolioData.portfolio_id;

    // Get the asset and related coin symbol
    const { data: assetData, error: assetError } = await supabase
      .from("assets")
      .select(
        `
        amount,
        value,
        avgbuyprice,
        profit_loss,
        coins!inner (
          symbol
        )
      `
      )
      .eq("portfolio_id", portfolioId)
      .eq("coin_id", coinId)
      .single();

    if (assetError || !assetData) {
      throw new Error("Asset not found");
    }

    const { profit_loss, value, coins } = assetData;
    const coin = Array.isArray(coins) ? coins[0] : coins;

    const absProfitLoss = Math.abs(profit_loss);

    const percentage =
      value && value !== 0 ? ((profit_loss / value) * 100).toFixed(2) : "0.00";

    const signedPercentage =
      profit_loss >= 0 ? `+${percentage}%` : `-${percentage}%`;

    return NextResponse.json({
      results: {
        User_Name: `${userData.first_name} ${userData.last_name}`,
        Coin_Symbol: coin.symbol,
        profit_loss: absProfitLoss,
        Percentage_profit_loss: signedPercentage,
      },
    });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
