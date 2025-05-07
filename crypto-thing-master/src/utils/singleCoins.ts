export const getCoinDetails = async (userId: string, coinId: string) => {
  const response = await fetch(
    `/api/singleCoin/coinDetails?userId=${userId}&coinId=${coinId}`
  );
  const data = await response.json();
  return data;
};

export const getCoinTransactions = async (userId: string, coinId: string) => {
  const response = await fetch(
    `/api/singleCoin/transactions?userId=${userId}&coinId=${coinId}`
  );
  const data = await response.json();
  return data;
};
