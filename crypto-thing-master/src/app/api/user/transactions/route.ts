import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/supabase-js';

// Define proper types
interface CoinData {
  Coin_Name: string;
  Symbol: string;
}

interface TransactionData {
  Type: string;
  id: number;
  Date: string;
  Price_at_Transaction: number;
  Amount_of_Coin: number;
  Value_in_Dollars: number;
  Coins?: CoinData;
}

interface FormattedTransaction {
  Type: string;
  id: number;
  Name_of_Coin?: string;
  Shorthand_Notation?: string;
  Date_and_Time_of_Transaction: string;
  Price_at_Transaction: number;
  Amount_of_Coin: number;
  Value_in_Dollars: number;
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
    const { data, error } = await supabase.rpc('get_user_transactions', {
      user_id_param: userId
    });
    
    if (!error && data) {
      // Format dates for the RPC result
      const formattedData = data.map((item: any) => ({
        ...item,
        Date_and_Time_of_Transaction: formatDate(item.date || item.Date),
        Date: undefined
      }));
      
      return NextResponse.json({ results: formattedData });
    }
    
    // Fallback to raw SQL query if RPC fails
    if (error) {
      console.log("RPC failed, using raw SQL query:", error.message);
      
      // Using raw SQL query with PostgreSQL
      const { data: rawData, error: rawError } = await supabase.from('Transaction_History')
        .select(`
          Transaction_Type,
          transaction_id,
          Date,
          Price_per_Coin,
          Amount,
          Value,
          Coin_ID
        `)
        .eq('User_ID', userId)
        .order('transaction_id', { ascending: false });
        
      if (rawError) throw rawError;
      
      // If we need to join with Coins table, we'll do separate queries
      // Get all coin IDs from transactions
      const coinIds = [...new Set(rawData?.map(item => item.Coin_ID) || [])];
      
      // Fetch coin data
      const { data: coinsData, error: coinsError } = await supabase
        .from('Coins')
        .select('Coin_ID, Coin_Name, Symbol')
        .in('Coin_ID', coinIds);
        
      if (coinsError) throw coinsError;
      
      // Create a map for quick coin lookup
      const coinMap = new Map();
      coinsData?.forEach(coin => {
        coinMap.set(coin.Coin_ID, {
          Name_of_Coin: coin.Coin_Name,
          Shorthand_Notation: coin.Symbol
        });
      });
      
      // Format data with coin information
      const formattedData = rawData?.map(item => {
        const coinInfo = coinMap.get(item.Coin_ID) || {};
        return {
          Type: item.Transaction_Type,
          id: item.transaction_id,
          ...coinInfo,
          Date_and_Time_of_Transaction: formatDate(item.Date),
          Price_at_Transaction: item.Price_per_Coin,
          Amount_of_Coin: item.Amount,
          Value_in_Dollars: item.Value
        };
      });
      
      return NextResponse.json({ results: formattedData });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// Helper function to format date in the required format: Mar 2, 2024, 4:30 PM
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Return the original string if parsing fails
      return dateString;
    }
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
}