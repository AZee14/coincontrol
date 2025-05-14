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
      .select(
        "coin_id, coin_name, symbol, marketprice,marketcap,trading_volume_24h,volume24h,volume1h,volume7d,circulatingsupply"
      );

    if (error) throw error;

    return NextResponse.json({ results: data });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
