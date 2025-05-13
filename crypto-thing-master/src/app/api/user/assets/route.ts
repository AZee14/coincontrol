import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "cryptothing" } }
);

export async function GET(req: Request) {
  interface AssetData {
    name: string;
    shorthand: string;
    current_price: number;
    hourly_change: number;
    daily_change: number;
    weekly_change: number;
    holding_amount: number;
    holding_value: number;
    avg_buy_price: number;
    profit_loss_amount: number;
    profit_loss_percentage: number;
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    const { data: p, error: pErr } = await supabase
      .from("current_portfolio")
      .select("portfolio_id")
      .eq("user_id", userId)
      .single();
    if (pErr || !p) throw pErr || new Error("Portfolio not found");
    const portfolioId = p.portfolio_id;

    const { data: assetRows, error: aErr } = await supabase
      .from("assets")
      .select("coin_id, contract_address, amount, value")
      .eq("portfolio_id", portfolioId);
    if (aErr) throw aErr;

    const coinAssets = assetRows.filter((r) => r.coin_id);
    const dexAssets = assetRows.filter((r) => r.contract_address);

    const coinIds = [...new Set(coinAssets.map((a) => a.coin_id))];
    const dexAddrs = [...new Set(dexAssets.map((a) => a.contract_address))];

    let buyTxs: any[] = [];

    if (coinIds.length > 0) {
      const { data: coinBuys = [], error: coinBuyErr } = await supabase
        .from("transaction_history")
        .select("coin_id, price_per_coin, amount")
        .eq("transaction_type", "Buy")
        .in("coin_id", coinIds);
      if (coinBuyErr) throw coinBuyErr;
      buyTxs = buyTxs.concat(coinBuys);
    }

    if (dexAddrs.length > 0) {
      const { data: dexBuys = [], error: dexBuyErr } = await supabase
        .from("transaction_history")
        .select("contract_address, price_per_coin, amount")
        .eq("transaction_type", "Buy")
        .in("contract_address", dexAddrs);
      if (dexBuyErr) throw dexBuyErr;
      buyTxs = buyTxs.concat(dexBuys);
    }

    const avgBuyMap = new Map<string, number>();
    const allKeys = [...coinIds, ...dexAddrs];

    allKeys.forEach((key) => {
      const relevant = buyTxs.filter(
        (tx) => tx.coin_id === key || tx.contract_address === key
      );
      if (relevant.length) {
        const totalCost = relevant.reduce(
          (sum, tx) => sum + tx.price_per_coin * tx.amount,
          0
        );
        const totalAmt = relevant.reduce((sum, tx) => sum + tx.amount, 0);
        avgBuyMap.set(key, totalCost / totalAmt);
      } else {
        avgBuyMap.set(key, 0);
      }
    });

    // Further processing for metadata, assembling final response, etc.

    // Fetch metadata for coins and dex pairs
    const [coinsData, dexData] = await Promise.all([
      supabase
        .from("coins")
        .select(
          "coin_id, coin_name, symbol, marketprice, volume1h, volume24h, volume7d"
        )
        .in("coin_id", coinIds),
      supabase
        .from("dex_pairs")
        .select(
          "contract_address, name, base_asset_symbol, price, percent_change_price_1h, percent_change_price_24h"
        )
        .in("contract_address", dexAddrs),
    ]);

    const metaMap = new Map<string, any>();

    // Map coin metadata
    coinsData.data?.forEach((coin) => {
      metaMap.set(coin.coin_id, {
        name: coin.coin_name,
        shorthand: coin.symbol,
        current_price: coin.marketprice,
        hourly_change: coin.volume1h,
        daily_change: coin.volume24h,
        weekly_change: coin.volume7d,
      });
    });

    // Map DEX metadata
    dexData.data?.forEach((dex) => {
      metaMap.set(dex.contract_address, {
        name: dex.name,
        shorthand: dex.base_asset_symbol,
        current_price: dex.price,
        hourly_change: dex.percent_change_price_1h,
        daily_change: dex.percent_change_price_24h,
        weekly_change: dex.percent_change_price_24h, // Placeholder for weekly
      });
    });

    const results: AssetData[] = assetRows.map((asset) => {
      const key = asset.coin_id ?? asset.contract_address;
      const meta = metaMap.get(key) || {};
      const avgBuy = avgBuyMap.get(key) || 0;
      const holdingValue = asset.amount * meta.current_price;
      const profitLossAmount = holdingValue - asset.amount * avgBuy;
      const profitLossPercentage =
        avgBuy > 0 ? (profitLossAmount / (asset.amount * avgBuy)) * 100 : 0;

      return {
        name: meta.name || "Unknown",
        shorthand: meta.shorthand || "N/A",
        current_price: meta.current_price.toFixed(5) || 0,
        hourly_change: meta.hourly_change || 0,
        daily_change: meta.daily_change || 0,
        weekly_change: meta.weekly_change || 0,
        holding_amount: asset.amount,
        holding_value: holdingValue,
        avg_buy_price: Number(avgBuy.toFixed(3)),
        profit_loss_amount: Number(profitLossAmount.toFixed(3)),
        profit_loss_percentage: Number(profitLossPercentage.toFixed(2)),
      };
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
