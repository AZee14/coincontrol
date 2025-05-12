import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: { schema: "cryptothing" },
  }
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("coins")
      .select("coin_id, coin_name, symbol, marketprice");

    if (error) throw error;

    return NextResponse.json({ results: data });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const requestData = await req.json();

  try {
    const updates = requestData.data.map((item: any) => {
      const { name, symbol, last_updated, circulating_supply, id } = item;
      const {
        price,
        market_cap,
        percent_change_1h,
        percent_change_24h,
        percent_change_7d,
      } = item.quote.USD;

      return {
        coin_id: id,
        coin_name: name,
        symbol,
        marketprice: price,
        marketcap: market_cap,
        last_updated,
        volume24h: percent_change_24h,
        volume1h: percent_change_1h,
        volume7d: percent_change_7d,
        circulatingsupply: circulating_supply,
      };
    });

    for (const coin of updates) {
      const { error } = await supabase.from("coins").upsert(coin, {
        onConflict: "coin_id",
      });
      if (error) throw error;
    }

    return NextResponse.json(
      { message: "Coins added successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
