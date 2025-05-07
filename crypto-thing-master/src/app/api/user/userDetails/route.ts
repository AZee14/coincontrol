import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Define interface for type safety
interface UserDetails {
  User_ID: string;
  First_Name: string;
  Last_Name: string;
  Total_Value_Now: number;
}

export async function GET(req: Request) {
  // Create a Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
      .from('Users')
      .select(`
        User_ID,
        First_Name,
        Last_Name,
        Current_Portfolio(Total_Value_Now)
      `)
      .eq('User_ID', userId)
      .single();
    
    if (error) throw error;
    
    // Format the response to match the expected structure
    const formattedData = {
      User_ID: data.User_ID,
      First_Name: data.First_Name,
      Last_Name: data.Last_Name,
      Total_Value_Now: data.Current_Portfolio?.[0]?.Total_Value_Now || 0
    };
    
    return NextResponse.json({ results: [formattedData] });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}