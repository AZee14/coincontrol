// app/api/test/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';

export async function GET() {
  const { data, error } = await supabase.from('users').select('*').limit(1);

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
