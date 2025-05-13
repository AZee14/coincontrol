type coin = { name: string; shorthand: string };
type coins = { name: string; shorthand: string }[];

interface UserDetails {
  user_id: string;
  first_name: string;
  last_name: string;
  total_value_now: number | null;
}

interface Transaction {
  id: String;
  Type: string;
  Name_of_Coin: string;
  Shorthand_Notation: string;
  Date_and_Time_of_Transaction: string;
  Price_at_Transaction: string;
  Amount_of_Coin: string;
  Value_in_Dollars: string;
}

interface Coin {
  coin_id: String;
  coin_name: string;
  marketprice: string;
  symbol: string;
}

interface DexPair {
  contract_address: string;
  base_asset_symbol: string;
  price: string;
  name: string;
}

interface AllTimeProfits {
  name: string;
  percentage_profit: string;
  total_profit: number;
}
interface BestPerformer {
  coin_id: string;
  coin_name: string;
  total_profit: number;
  percentage_profit: number;
}
interface WorstPerformer {
  coin_id: string;
  coin_name: string;
  total_loss: number;
  percentage_loss: number;
}
interface TodayCondition {
  net_change_24h: number;
  percentage_change_24h: number;
  total_value_now: number;
  total_investment: number;
}
