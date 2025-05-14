import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "cryptothing" } }
);

// GET /api/dex/exchanges
export async function GET(req: Request) {
  const { data, error } = await supabase
    .from("dex_exchanges")
    .select("exchange_id, name, volume_24h, percent_change_volume_24h, num_transactions_24h, num_market_pairs");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/dex/exchanges
export async function POST(req: Request) {
  const body = await req.json();
  const input = Array.isArray(body) ? body : [body];

  // Map CMC payload to table schema
  const rows = input.map((ex: any) => ({
    exchange_id: ex.id.toString(),
    name: ex.name,
    slug: ex.slug,
    last_updated: ex.last_updated,
    num_market_pairs: ex.num_market_pairs,
    volume_24h: ex.quote[0].volume_24h,
    percent_change_volume_24h: ex.quote[0].percent_change_volume_24h,
    num_transactions_24h: ex.quote[0].num_transactions_24h,
  }));

  const { data, error } = await supabase
    .from("dex_exchanges")
    .upsert(rows)
    .select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
