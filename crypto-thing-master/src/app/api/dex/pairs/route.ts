import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const supabasePairs = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "cryptothing" } }
);

export async function GET(req: Request) {
  const { data, error } = await supabasePairs.from("dex_pairs").select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const input = Array.isArray(body) ? body : [body];

  // Map CMC DEX Pairs payload to table schema
  const rows = input.map((p: any) => ({
    dex_id: p.dex_id,
    network_id: p.network_id,
    contract_address: p.contract_address,
    name: p.name, // using name as symbol (e.g. "WBERA/HONEY")
    quote_asset_id: p.quote_asset_id,
    base_asset_id: p.base_asset_id,
    base_asset_symbol: p.base_asset_symbol,
    quote_asset_symbol: p.quote_asset_symbol,
    price: p.quote[0]?.price,
    volume_24h: p.quote[0]?.volume_24h,
    liquidity: p.quote[0]?.liquidity,
    last_updated: p.last_updated,
  }));

  const { data, error } = await supabasePairs
    .from("dex_pairs")
    .upsert(rows)
    .select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
