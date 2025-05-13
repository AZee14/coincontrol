import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/utils/mongodb/mongodb';

// Interfaces for type safety
interface Coin {
  coin_id: string;
  price: number;
  market_cap: number;
  timestamp: string;
  [key: string]: any;
}

interface PreviousData {
  price: number;
  timestamp: string;
}

interface ResultCoin extends Coin {
  price_change_24h: number | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 10;

  try {
    const { db } = await connectToDatabase();

    // Step 1: Get the latest timestamp in the collection
    const latestEntry = await db
      .collection('historicalquotes')
      .find()
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    if (latestEntry.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    const latestTimestamp: string = latestEntry[0].timestamp;

    // Step 2: Get the latest snapshot of all coins by market cap
    const latestQuotes = await db
      .collection('historicalquotes')
      .find({ timestamp: latestTimestamp })
      .sort({ market_cap: -1 })
      .limit(limit)
      .toArray() as unknown as Coin[];

    // Step 3: Calculate 24h price change for each coin
    const result: ResultCoin[] = await Promise.all(
      latestQuotes.map(async (coin: Coin): Promise<ResultCoin> => {
        const yesterday = new Date(new Date(latestTimestamp).getTime() - 24 * 60 * 60 * 1000);

        const previousData = await db
          .collection('historicalquotes')
          .find({
            coin_id: coin.coin_id,
            timestamp: { $lte: yesterday.toISOString() },
          })
          .sort({ timestamp: -1 })
          .limit(1)
          .toArray() as unknown as PreviousData[];

        let price_change_24h: number | null = null;

        if (previousData.length > 0) {
          const previousPrice = previousData[0].price;
          price_change_24h = ((coin.price - previousPrice) / previousPrice) * 100;
        }

        return {
          ...coin,
          price_change_24h,
        };
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching top coins:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
