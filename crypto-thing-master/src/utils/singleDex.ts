export const getDexDetails = async (
  userId: string,
  contractAddress: string
) => {
  const res = await fetch(
    `/api/singleDex/dexDetails?userId=${userId}&contractAddress=${contractAddress}`
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch DEX details");
  }
  return res.json();
};

export const getDexTransactions = async (
  userId: string,
  contractAddress: string
) => {
  const res = await fetch(
    `/api/singleDex/transactions?userId=${userId}&contractAddress=${contractAddress}`
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch DEX transactions");
  }
  return res.json();
};
