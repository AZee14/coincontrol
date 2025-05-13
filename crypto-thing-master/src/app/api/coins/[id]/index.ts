// src/pages/api/coins/[id]/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/utils/mongodb/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const { db } = await connectToDatabase();

    // Find the latest data for the coin
    const latestData = await db
      .collection('coin_history')
      .find({ coin_id: Number(id) })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    if (latestData.length === 0) {
      return res.status(404).json({ message: 'Coin not found' });
    }

    const coinData = latestData[0];
    
    // Calculate price changes for different time periods
    const now = new Date(coinData.timestamp);
    
    // Calculate 24h price change
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Fetch historical data for price change calculations
    const [oneDayData, sevenDayData, thirtyDayData] = await Promise.all([
      db.collection('coin_history')
        .find({ 
          coin_id: Number(id),
          timestamp: { $lte: oneDayAgo.toISOString() }
        })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray(),
      
      db.collection('coin_history')
        .find({ 
          coin_id: Number(id),
          timestamp: { $lte: sevenDaysAgo.toISOString() }
        })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray(),
      
      db.collection('coin_history')
        .find({ 
          coin_id: Number(id),
          timestamp: { $lte: thirtyDaysAgo.toISOString() }
        })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray()
    ]);
    
    // Calculate price changes
    let price_change_24h = null;
    let price_change_7d = null;
    let price_change_30d = null;
    
    if (oneDayData.length > 0) {
      price_change_24h = ((coinData.price - oneDayData[0].price) / oneDayData[0].price) * 100;
    }
    
    if (sevenDayData.length > 0) {
      price_change_7d = ((coinData.price - sevenDayData[0].price) / sevenDayData[0].price) * 100;
    }
    
    if (thirtyDayData.length > 0) {
      price_change_30d = ((coinData.price - thirtyDayData[0].price) / thirtyDayData[0].price) * 100;
    }
    
    // Add price changes to coin data
    const enrichedCoinData = {
      ...coinData,
      price_change_24h,
      price_change_7d,
      price_change_30d
    };
    
    return res.status(200).json(enrichedCoinData);
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}