// app/api/coins/top/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb/mongodb';

export async function GET(request: NextRequest) {
  try {
    // 1. Parse ?limit= (default 10)
    const url = new URL(request.url);
    const limit = url.searchParams.has('limit')
      ? parseInt(url.searchParams.get('limit')!, 10)
      : 10;

    const { db } = await connectToDatabase();

    // 2. Find the most recent daily timestamp we have
    const latestDocs = await db
      .collection('historicalquotes')
      .find({ interval: 'daily' })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    if (latestDocs.length === 0) {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }
    const latestTimestamp: Date = latestDocs[0].timestamp;

    // 3. Fetch that snapshot for all coins, ordered by market_cap desc
    const topSnapshot = await db
      .collection('historicalquotes')
      .find({
        interval: 'daily',
        timestamp: latestTimestamp
      })
      .sort({ market_cap: -1 })
      .limit(limit)
      .toArray();

    // 4. For each coin, compute 24h price change
    const result = await Promise.all(
      topSnapshot.map(async (doc) => {
        const { coin_id, price, name, symbol, market_cap, volume_24h } = doc;

        // 24h ago
        const yesterday = new Date(latestTimestamp.getTime() - 24 * 60 * 60 * 1000);

        // Find the most recent daily doc at or before 'yesterday'
        const prevDocs = await db
          .collection('historicalquotes')
          .find({
            interval: 'daily',
            coin_id,
            timestamp: { $lte: yesterday }
          })
          .sort({ timestamp: -1 })
          .limit(1)
          .toArray();

        let price_change_24h: number | null = null;
        if (prevDocs.length > 0) {
          const prevPrice = prevDocs[0].price;
          price_change_24h = ((price - prevPrice) / prevPrice) * 100;
        }

        // Only return the fields we need
        return {
          coin_id,
          name,
          symbol,
          price,
          market_cap,
          volume_24h,
          price_change_24h
        };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching top coins:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
