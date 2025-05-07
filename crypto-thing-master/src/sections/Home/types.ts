type coin = {name:string,shorthand:string}
type coins = {name:string,shorthand:string}[]

interface UserDetails {
    User_ID: string;
    First_Name: string;
    Last_Name: string;
    Total_Value_Now: number | null;
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
    marketPrice: string;
    symbol: string;
  }