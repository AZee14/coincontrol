import axios from "axios";
import { flattenFirstLevel } from "./general";

const API_URL = "/api/dex";
const CMC_BASE =
  `${process.env.NEXT_PUBLIC_CORS_URL}https://pro-api.coinmarketcap.com`;
const CMC_KEY = process.env.NEXT_PUBLIC_CMC_API_KEY!;

// Helper to call CMC DEX Exchanges endpoint
async function fetchDexExchangesFromCMC() {
  const res = await axios.get(`${CMC_BASE}/v4/dex/listings/quotes`, {
    headers: { "X-CMC_PRO_API_KEY": CMC_KEY },
  });
  return res.data.data;
}

// Helper to call CMC DEX Networks endpoint
// async function fetchNetworkIDsFromCMC() {
//   const res = await axios.get(`${CMC_BASE}/v4/dex/networks/list`, {
//     headers: { "X-CMC_PRO_API_KEY": CMC_KEY },
//   });
//   return res.data.data;
// }

// Fetch valid exchanges and networks mapping
async function fetchExchangesNetworksMapping() {
  try {
    const response = await axios.get("/api/exchanges-networks");
    return response.data;
  } catch (error) {
    console.error("Error fetching exchanges-networks mapping:", error);
    throw error;
  }
}

export async function fetchValidDexPairs() {
  try {
    // Fetch exchanges networks mapping
    const exchangesNetworks = await fetchExchangesNetworksMapping();
    console.log(exchangesNetworks);

    // Fetch DEX pairs from CoinMarketCap for each exchange-network pair
    const pairsPromises = exchangesNetworks.map(async (item: any) => {
      try {
        const res = await axios.get(`${CMC_BASE}/v4/dex/spot-pairs/latest`, {
          headers: { "X-CMC_PRO_API_KEY": CMC_KEY },
          params: {
            network_id: item.network_id,
            dex_id: item.exchange_id,
          },
        });
        return res.data.data;
      } catch (error) {
        console.error(
          `Error fetching pairs for network ${item.network_id} and exchange ${item.exchange_id}:`,
          error
        );
        return []; // Return empty array instead of throwing to continue processing other pairs
      }
    });

    // Wait for all promises to resolve
    const allPairs = await Promise.all(pairsPromises);

    const arrayOfPairs = flattenFirstLevel(allPairs)
    console.log(arrayOfPairs)

    return arrayOfPairs;
  } catch (error) {
    console.error("Error fetching valid DEX pairs:", error);
    throw error;
  }
}

// Fetch and POST all exchanges into our API
export async function updateDexExchanges() {
  try {
    const exchanges = await fetchDexExchangesFromCMC();
    const response = await axios.post(`${API_URL}/exchanges`, exchanges, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status !== 201) {
      throw new Error(`Error posting exchanges: ${response.statusText}`);
    }
    console.log("DEX Exchanges saved:", response.data);
  } catch (error) {
    console.error("Error updating DEX exchanges:", error);
  }
}

// Fetch and POST all pairs for a specific exchange
export async function updateDexPairs() {
  try {
    const pairs = await fetchValidDexPairs();
    const response = await axios.post(`${API_URL}/pairs`, pairs, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status !== 201) {
      throw new Error(`Error posting pairs: ${response.statusText}`);
    }
    console.log(`DEX Pairs saved:`, response.data);
  } catch (error) {
    console.error(`Error updating DEX pairs:`, error);
  }
}

// For transactions, user input is required; we simply call existing addDexTransaction
export async function addDexTransaction(tx: any) {
  const res = await axios.post(`${API_URL}/transactions`, tx);
  return res.data;
}

export async function getDexExchanges() {
  const res = await axios.get(`${API_URL}/exchanges`);
  return res.data;
}

export async function getDexPairs() {
  const res = await axios.get(`${API_URL}/pairs`);
  return res.data;
}

export async function getDexTransactions() {
  const res = await axios.get(`${API_URL}/transactions`);
  return res.data;
}
