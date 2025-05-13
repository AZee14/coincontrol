require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

// --- MongoDB Schema ---
const HistoricalQuoteSchema = new mongoose.Schema({
  coin_id: Number,
  name: String,
  symbol: String,
  interval: String,
  timestamp: Date,
  price: Number,
  volume_24h: Number,
  market_cap: Number,
  circulating_supply: Number,
  total_supply: Number
});

// --- Indexes ---
HistoricalQuoteSchema.index({ coin_id: 1 });
HistoricalQuoteSchema.index({ interval: 1 });
HistoricalQuoteSchema.index({ timestamp: 1 });
HistoricalQuoteSchema.index({ coin_id: 1, interval: 1, timestamp: 1 }, { unique: true });

const HistoricalQuote = mongoose.model('HistoricalQuote', HistoricalQuoteSchema);

// --- Config ---
const COIN_IDS = [1, 1027, 825, 1839, 2010, 5426, 3408, 52, 5805, 74];
const INTERVALS = ['1h', 'daily'];
const API_KEY = process.env.CMC_API_KEY_HISTORICAL;
const MONGO_URI = process.env.MONGODB_URI;
const ONE_MONTH_LIMIT = 30 * 24 * 60 * 60; // 30 days in seconds

// --- Fetch and store historical data in chunks ---
const fetchAndStoreHistorical = async (coinId, interval) => {
  const now = Math.floor(Date.now() / 1000);
  const chunkSizeDays = interval === '1h' ? 7 : 30;
  const oneDay = 24 * 60 * 60;
  const numChunks = Math.ceil(30 / chunkSizeDays); // only fetch up to 30 days back

  for (let i = 0; i < numChunks; i++) {
    let chunkStart = now - ((i + 1) * chunkSizeDays * oneDay);
    let chunkEnd = now - (i * chunkSizeDays * oneDay);

    if ((now - chunkStart) > ONE_MONTH_LIMIT) {
      console.log(`⏭ Skipping data older than 1 month for coin ID ${coinId}`);
      continue;
    }

    try {
      const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical', {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY
        },
        params: {
          id: coinId,
          interval,
          time_start: chunkStart,
          time_end: chunkEnd
        }
      });

      const coinData = response.data.data;
      const quotes = coinData?.quotes || [];

      if (!quotes.length) {
        console.warn(`⚠ No ${interval} data for coin ID ${coinId}`);
        continue;
      }

      const operations = quotes.map(q => ({
        updateOne: {
          filter: {
            coin_id: coinData.id,
            interval,
            timestamp: new Date(q.timestamp)
          },
          update: {
            $set: {
              name: coinData.name,
              symbol: coinData.symbol,
              price: q.quote.USD.price,
              volume_24h: q.quote.USD.volume_24h,
              market_cap: q.quote.USD.market_cap,
              circulating_supply: q.quote.USD.circulating_supply,
              total_supply: q.quote.USD.total_supply
            }
          },
          upsert: true
        }
      }));

      await HistoricalQuote.bulkWrite(operations);
      console.log(`✔ Stored ${quotes.length} ${interval} records for ${coinData.symbol}`);
    } catch (error) {
      const errMsg = error.response?.data || error.message || error;
      console.error(`❌ Failed ${interval} fetch for coin ${coinId}:`, errMsg);
    }
  }
};

// --- Main ---
const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const coinId of COIN_IDS) {
      for (const interval of INTERVALS) {
        await fetchAndStoreHistorical(coinId, interval);
      }
    }
  } catch (err) {
    console.error('❌ MongoDB connection failed or script crashed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

run();
