// File: /pages/api/dex/pairs.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "cryptothing" } }
);

export async function GET() {
  // We SELECT only the columns we need, plus the joined dex_exchanges.name
  const { data, error } = await supabase
    .from("dex_pairs")
    .select(
      `
      name,
      contract_address,
      liquidity,
      price,
      volume_24h,
      percent_change_price_1h,
      percent_change_price_24h,
      dex_exchanges!inner (
        name
      )
    `
    )
    .order("volume_24h", { ascending: false });
  if (error) {
    console.error("Error fetching dex pairs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map to the shape you want
  const results = data.map((row: any) => ({
    name: row.name,
    dex_name: row.dex_exchanges.name,
    contract_address: row.contract_address,
    liquidity: Number(row.liquidity),
    price: Number(row.price),
    volume_24h: Number(row.volume_24h),
    percent_change_1h: Number(row.percent_change_price_1h),
    percent_change_24h: Number(row.percent_change_price_24h),
  }));

  return NextResponse.json({ results });
}
