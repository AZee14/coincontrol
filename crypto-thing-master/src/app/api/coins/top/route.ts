import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 10;

    const { db } = await connectToDatabase();

    // Step 1: Get the latest timestamp in the collection
    const latestEntry = await db
      .collection('historicalquotes')
      .find()
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    if (latestEntry.length === 0) {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }

    const latestTimestamp: string = latestEntry[0].timestamp;

    // Step 2: Get the latest snapshot of all coins by market cap
    const latestQuotes = await db
      .collection('historicalquotes')
      .find({ timestamp: latestTimestamp })
      .sort({ market_cap: -1 })
      .limit(limit)
      .toArray();

    // Step 3: Calculate 24h price change for each coin
    const result = await Promise.all(
      latestQuotes.map(async (coin) => {
        const yesterday = new Date(new Date(latestTimestamp).getTime() - 24 * 60 * 60 * 1000);

        const previousData = await db
          .collection('historicalquotes')
          .find({
            coin_id: coin.coin_id,
            timestamp: { $lte: yesterday.toISOString() },
          })
          .sort({ timestamp: -1 })
          .limit(1)
          .toArray();

        let price_change_24h = null;

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

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching top coins:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}