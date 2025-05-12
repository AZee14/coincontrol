import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "cryptothing" } }
);

interface User {
  first_name: string;
  last_name: string;
}

interface PortfolioData {
  total_value_now: number | null;
  total_investment: number | null;
  users: User;
}

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
    // Fetch portfolio summary with user details
    const { data, error } = await supabase
      .from("current_portfolio")
      .select(
        `
          total_value_now,
          total_investment,
          users!inner(
            first_name,
            last_name
          )
        `
      )
      .eq("user_id", userId)
      .single();
    
    if (error) throw error;

    if (!data) {
      return NextResponse.json({ results: [] });
    }

    const { total_value_now, total_investment, users } = data as unknown as PortfolioData;

    // Calculate all-time profit and percentage
    const profit = (total_value_now ?? 0) - (total_investment ?? 0);
    const percentage = total_investment
      ? (profit / total_investment) * 100
      : 0;

    const result = {
      name: `${users.first_name} ${users.last_name}`.trim(),
      total_profit: profit.toFixed(3),
      percentage_profit: percentage.toFixed(2),
    };

    return NextResponse.json({ results: result });
  } catch (err: any) {
    console.error("Error fetching data:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
