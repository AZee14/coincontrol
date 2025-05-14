interface CoinItem {
  coin_id: string;
  coin_name:string;
  symbol:string;
  marketprice: string;
  marketcap: number;
  last_updated: string;
  trading_volume_24h:number;
  volume1h: number;
  volume24h: number;
  volume7d: number;
  circulatingsupply: number;
}

interface DexPairItem {
  name: string;
  dex_id: string;
  dex_name:string;
  contract_address: string;
  liquidity: number;
  last_updated: string;
  price:number;
  volume_24h:number;
  percent_change_1h:number;
  percent_change_24h:number;
}

interface DexExchange {
  exchange_id: string;
  name:string;
  slug:string;
  last_updated: string;
  volume_24h: number;
  percent_change_volume_24h: number;
  num_transactions_24h: number;
  num_market_pairs: number;
}