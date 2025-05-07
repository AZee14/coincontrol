export const sendTransactionData = async (
  transactionData: {
    type: "Buy" | "Sell";
    coin: string;
    quantity: number;
    pricePerCoin: number;
    dateTime: string;
    total: number;
  },
  userId: string
) => {
  try {
    const response = await fetch(`/api/transactions/add?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Transaction saved:", data);
  } catch (error) {
    console.error("Error sending transaction data:", error);
  }
};

export const deleteTransaction = async (
  transactionId: string
) => {
  try {
    const response = await fetch(`/api/transactions/delete?transactionId=${transactionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Transaction deleted:", data);
  } catch (error) {
    console.error("Error sending transaction data:", error);
  }
};
