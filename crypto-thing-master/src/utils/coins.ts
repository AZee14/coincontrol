export const getAllCoins = async () => {
  try {
    const response = await fetch(`/api/coins`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error getting coin data:", error);
  }
};

const fetchCoins = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CORS_URL}https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": `${process.env.NEXT_PUBLIC_CMC_API_KEY}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getAllDataOnCoins = async () => {
  try {
    const response = await fetch(`/api/coins/allData`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error getting coin data:", error);
  }
};

export const updateCoins = async () => {
  try {
    const coinsData = await fetchCoins();
    console.log(coinsData);
    const response = await fetch(`/api/coins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coinsData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Coins saved:", data);
  } catch (error) {
    console.error("Error sending coin data:", error);
  }
};
