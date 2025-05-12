// app/api/exchanges-networks/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabasePairs = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "cryptothing" } }
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exchangeId = searchParams.get('exchange_id');

  let query = supabasePairs.from("exchanges_networks").select("*");
  
  if (exchangeId) {
    query = query.eq('exchange_id', exchangeId);
  }

  const { data, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data);
}