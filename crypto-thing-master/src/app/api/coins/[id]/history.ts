// src/pages/api/coins/[id]/history.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/utils/mongodb/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, timeFrame = '7d' } = req.query;

  try {
    const { db } = await connectToDatabase();
    
    // Convert timeFrame to a date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeFrame) {
      case '24h':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '90d':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        // No start date filter for 'all'
        startDate = new Date(0); // Jan 1, 1970
        break;
      default:
        startDate.setDate(now.getDate() - 7); // Default to 7d
    }

    // Query the database
    const data = await db
      .collection('coin_history')
      .find({
        coin_id: Number(id),
        timestamp: { $gte: startDate.toISOString() }
      })
      .sort({ timestamp: 1 })
      .toArray();

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching coin history:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}