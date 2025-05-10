import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: { schema: "cryptothing" },
  }
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
    const { data, error } = await supabase
      .from("current_portfolio")
      .select(
        `
        users (
          first_name,
          last_name
        ),
        assets (
          coin_id,
          coins (
            coin_name
          )
        ),
        total_value_now,
        total_investment
      `
      )
      .eq("user_id", userId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const profitData = data.map((entry) => {
      // Handle array cases safely
      const user = Array.isArray(entry.users) ? entry.users[0] : entry.users;
      const asset = Array.isArray(entry.assets)
        ? entry.assets[0]
        : entry.assets;
      const coin = Array.isArray(asset?.coins) ? asset.coins[0] : asset.coins;

      const totalNow = entry.total_value_now || 0;
      const totalInvestment = entry.total_investment || 1; // Avoid division by 0
      const profit = totalNow - totalInvestment;
      const percentage = (profit / totalInvestment) * 100;

      return {
        name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
        coin: coin?.coin_name || "Unknown Coin",
        total_profit: profit,
        percentage_profit: percentage.toFixed(2),
      };
    });

    // Find the coin with the maximum profit
    const maxProfitCoin = profitData.reduce((prev, current) =>
      current.total_profit > prev.total_profit ? current : prev
    );

    return NextResponse.json({ results: maxProfitCoin });
  } catch (err: any) {
    console.error("Error fetching data:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
