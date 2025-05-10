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
      .from("transaction_history")
      .select(
        `
          transaction_type,
          transaction_id,
          date,
          price_per_coin,
          amount,
          value,
          coin_id,
          current_portfolio(user_id)
        `
      )
      .eq("current_portfolio.user_id", userId)
      .order("transaction_id", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ results: data });
  } catch (err: any) {
    console.error("Error fetching data:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
