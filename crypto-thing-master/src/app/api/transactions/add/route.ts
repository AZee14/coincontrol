import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const requestData = await req.json();
  const {
    type,
    coin,
    contract_address,
    quantity,
    pricePerCoin,
    dateTime,
    total,
  } = requestData;

  // if (
  //   (!coin_id && !contract_address) ||
  //   !quantity ||
  //   !pricePerCoin ||
  //   !dateTime
  // ) {
  //   return NextResponse.json(
  //     { message: "Missing required fields" },
  //     { status: 400 }
  //   );
  // }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "cryptothing" },
    }
  );

  // Extract userId from query
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Get portfolio_id from Current_Portfolio
    const { data: portfolioData, error: portfolioError } = await supabase
      .from("current_portfolio")
      .select("portfolio_id")
      .eq("user_id", userId)
      .single();

    if (portfolioError || !portfolioData) {
      throw new Error("Failed to fetch portfolio ID");
    }

    const portfolioId = portfolioData.portfolio_id;

    // Format fields for insertion
    const date = new Date(dateTime)
      .toISOString()
      .replace("T", " ")
      .replace("Z", "");

    const amount = quantity;
    const value = total;
    // const amount = type === "Buy" ? quantity : -quantity;
    // const value = type === "Buy" ? total : -total;

    // Insert into transaction_history
    const { data: transactionResult, error: insertError } = await supabase
      .from("transaction_history")
      .insert([
        {
          transaction_type: type,
          coin_id: coin || null, // Insert coin_id if present
          contract_address: contract_address || null, // Insert contract_address if present
          portfolio_id: portfolioId,
          date: date,
          amount: amount,
          value: value,
          price_per_coin: pricePerCoin,
        },
      ])
      .select("*");

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(
      { message: "Transaction added successfully", result: transactionResult },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
