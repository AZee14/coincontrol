import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Define interface for type safety
interface UserDetails {
  user_id: string;
  first_name: string;
  last_name: string;
  total_value_now: number;
}

export async function GET(req: Request) {
  // Create a Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: { schema: "cryptothing" }
  }
);

  // Extract userId from the query parameters
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  try {
    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    // First try using RPC if the function exists in Supabase
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_details', {
      user_id_param: userId
    });
    
    if (!rpcError && rpcData) {
      return NextResponse.json({ results: rpcData });
    }
    
    // If RPC fails or doesn't exist, use Supabase query builder
    console.log("RPC failed or not found, using query builder:", rpcError?.message);
    
    // Query user details with a join
    const { data, error } = await supabase
      .from('users')
      .select(`
        user_id,
        first_name,
        last_name,
        current_portfolio(total_value_now)
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    // Format the response to match the expected structure
    const formattedData = {
      user_id: data.user_id,
      first_name: data.first_name,
      last_name: data.last_name,
      total_value_now: data.current_portfolio?.[0]?.total_value_now || 0
    };
    
    return NextResponse.json({ results: [formattedData] });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}