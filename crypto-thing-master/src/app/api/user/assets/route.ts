import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Define interfaces for type safety
interface AssetData {
  name: string;
  shorthand: string;
  current_price: number;
  hourly_change: number;
  daily_change: number;
  weekly_change: number;
  coin_amount: number;
  coin_value: number;
  avg_buy_price: number;
  profit_loss_amount: number;
  profit_loss_percentage: number;
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

    // First, try using RPC if the function exists in Supabase
    const { data, error } = await supabase.rpc('get_user_assets', {
      user_id_param: userId
    });
    
    if (!error && data) {
      return NextResponse.json({ results: data });
    }
    
    // If RPC fails or doesn't exist, use raw SQL query through Supabase's built-in postgres function
    if (error) {
      console.log("RPC failed, using direct query:", error.message);
      
      // Using PostgreSQL's built-in function from Supabase
      const { data: rawData, error: rawError } = await supabase.from('Assets')
        .select(`
          Portfolio_ID,
          Coin_ID,
          Amount,
          Value
        `)
        .order('Coin_ID');
        
      if (rawError) throw rawError;
      
      // Get the user's portfolio ID
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('current_portfolio')
        .select('portfolio_id')
        .eq('user_id', userId)
        .single();
        
      if (portfolioError) throw portfolioError;
      
      // Filter assets by portfolio ID
      const userAssets = rawData?.filter(asset => 
        asset.Portfolio_ID === portfolioData?.portfolio_id
      );
      
      // Get coin IDs from user assets
      const coinIds = [...new Set(userAssets?.map(asset => asset.Coin_ID) || [])];
      
      // Fetch coin data
      const { data: coinsData, error: coinsError } = await supabase
        .from('Coins')
        .select('Coin_ID, Coin_Name, Symbol, MarketPrice, Volume1H, Volume24H, Volume7D')
        .in('Coin_ID', coinIds);
        
      if (coinsError) throw coinsError;
      
      // Create coin info map for lookup
      const coinMap = new Map();
      coinsData?.forEach(coin => {
        coinMap.set(coin.Coin_ID, {
          name: coin.Coin_Name,
          shorthand: coin.Symbol,
          current_price: coin.MarketPrice,
          hourly_change: coin.Volume1H,
          daily_change: coin.Volume24H,
          weekly_change: coin.Volume7D
        });
      });
      
      // Get transaction history for calculating average buy price
      const { data: transactionData, error: transactionError } = await supabase
        .from('Transaction_History')
        .select('Portfolio_ID, Coin_ID, Transaction_Type, Price_per_Coin, Amount')
        .eq('portfolio_id', portfolioData?.portfolio_id)
        .in('Coin_ID', coinIds)
        .eq('Transaction_Type', 'Buy');
        
      if (transactionError) throw transactionError;
      
      // Calculate average buy price for each coin
      const avgBuyPriceMap = new Map();
      coinIds.forEach(coinId => {
        const buyTransactions = transactionData?.filter(tx => 
          tx.Coin_ID === coinId && tx.Transaction_Type === 'Buy'
        );
        
        if (buyTransactions && buyTransactions.length > 0) {
          const totalCost = buyTransactions.reduce((sum, tx) => 
            sum + (tx.Price_per_Coin * tx.Amount), 0);
          const totalAmount = buyTransactions.reduce((sum, tx) => 
            sum + tx.Amount, 0);
          avgBuyPriceMap.set(coinId, totalCost / totalAmount);
        } else {
          avgBuyPriceMap.set(coinId, 0);
        }
      });
      
      // Combine data to create final result
      const formattedData = userAssets?.map(asset => {
        const coinInfo = coinMap.get(asset.Coin_ID) || {};
        const avgBuyPrice = avgBuyPriceMap.get(asset.Coin_ID) || 0;
        const profitLossAmount = asset.Value - (asset.Amount * avgBuyPrice);
        const profitLossPercentage = avgBuyPrice > 0 
          ? (profitLossAmount / (asset.Amount * avgBuyPrice)) * 100 
          : 0;
        
        return {
          ...coinInfo,
          coin_amount: asset.Amount,
          coin_value: asset.Value,
          avg_buy_price: avgBuyPrice,
          profit_loss_amount: profitLossAmount,
          profit_loss_percentage: profitLossPercentage
        };
      });
      
      return NextResponse.json({ results: formattedData });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}