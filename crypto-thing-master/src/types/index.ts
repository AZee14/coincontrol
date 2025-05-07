// Create a shared types file: src/types/index.ts

// Define the shared Transaction interface
export interface Transaction {
    id: string;
    Type: "Buy" | "Sell";
    Name_of_Coin: string;
    Shorthand_Notation: string;
    Date_and_Time_of_Transaction: string;
    Price_at_Transaction: number;
    Value_in_Dollars: number;
    Amount_of_Coin: number;
  }
  
  // Other shared interfaces
  export interface Coin {
    coin_id: string;
    coin_name: string;
    symbol: string;
    marketPrice: string;
  }
  
  export interface PortfolioTransaction {
    id?: string | number;
    type: "Buy" | "Sell";
    coin: string;
    quantity: number;
    pricePerCoin: number;
    dateTime: string;
    total: number;
  }
  
  export interface CoinMetadata {
    coin_id: string;
    coin_name: string;
    symbol: string;
  }
  
  export interface UserDetails {
    First_Name?: string;
    Last_Name?: string;
    Total_Value_Now?: number;
  }