import { connectToDatabase } from '@/utils/mongodb/mongodb';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const coinId = Number(params.id);

    if (isNaN(coinId)) {
      return new Response(JSON.stringify({ message: 'Invalid coin ID' }), {
        status: 400,
      });
    }

    // Get the latest document for this coin
    const latestData = await db
      .collection('historicalquotes')
      .find({ coin_id: coinId })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    if (latestData.length === 0) {
      return new Response(JSON.stringify({ message: 'Coin not found' }), {
        status: 404,
      });
    }

    const coinData = latestData[0];
    const now = new Date(coinData.timestamp);

    const getHistoricalData = async (daysAgo: number) => {
      const date = new Date(now);
      date.setDate(now.getDate() - daysAgo);

      const historical = await db
        .collection('historicalquotes')
        .find({
          coin_id: coinId,
          timestamp: { $lte: date.toISOString() },
        })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

      return historical.length > 0 ? historical[0].price : null;
    };

    const [price24h, price7d, price30d] = await Promise.all([
      getHistoricalData(1),
      getHistoricalData(7),
      getHistoricalData(30),
    ]);

    const calculateChange = (previous: number | null) => {
      if (previous && coinData.price) {
        return ((coinData.price - previous) / previous) * 100;
      }
      return null;
    };

    const enrichedCoinData = {
      ...coinData,
      price_change_24h: calculateChange(price24h),
      price_change_7d: calculateChange(price7d),
      price_change_30d: calculateChange(price30d),
    };

    return new Response(JSON.stringify(enrichedCoinData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
}
