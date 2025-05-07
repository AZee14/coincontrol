export const mockTransactions = [
    {
      transactionId:'1',
      type: "Buy",
      coinName: "Bitcoin",
      shorthand: "BTC",
      dateTime: "Mar 2, 2024, 4:30 PM",
      price: 60000,
      amount: 2.3,
      valueInUSD: 5000,
    },
    {
      transactionId:'2',
      type: "Sell",
      coinName: "Ethereum",
      shorthand: "ETH",
      dateTime: "Apr 15, 2024, 10:45 AM",
      price: 4000,
      amount: -3.5, // Negative value for sell transactions
      valueInUSD: -14000, // Negative value for sell transactions
    },
    // Add more mock transactions as needed
  ];
    