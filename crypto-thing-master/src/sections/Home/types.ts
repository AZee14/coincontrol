type coin = {name:string,shorthand:string}
type coins = {name:string,shorthand:string}[]

interface UserDetails {
    user_id: string;
    first_name: string;
    last_name: string;
    total_value_now: number | null;
  }
  
  interface Transaction {
    id:String;
    Type: string;
    Name_of_Coin: string;
    Shorthand_Notation: string;
    Date_and_Time_of_Transaction: string;
    Price_at_Transaction: string;
    Amount_of_Coin: string;
    Value_in_Dollars: string;
  }

  interface Coin {
    coin_id:String;
    coin_name: string;
    marketprice: string;
    symbol: string;
  }