import { connectToDatabase } from '@/utils/mongodb/mongodb';
import { NextRequest } from 'next/server';
import { parse } from 'url';

// Slug → numeric CoinMarketCap ID
const coinSlugToId: Record<string, number> = {
  bitcoin: 1,
  ethereum: 1027,
  dogecoin: 74,
  cardano: 2010,
  binancecoin: 1839,
  // add more…
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { db } = await connectToDatabase();
  const { query } = parse(request.url!, true);
  const timeFrame = (query.timeFrame as string) || '7d';

  // resolve slug or numeric string
  const slug = params.id.toLowerCase();
  const coinId = coinSlugToId[slug] ?? Number(slug);
  if (isNaN(coinId)) {
    return new Response(
      JSON.stringify({ error: 'Invalid coin ID or slug' }),
      { status: 400 }
    );
  }

  // compute startDate
  const now = new Date();
  let startDate = new Date();
  switch (timeFrame) {
    case '24h': startDate.setDate(now.getDate() - 1); break;
    case '7d':  startDate.setDate(now.getDate() - 7); break;
    case '30d': startDate.setMonth(now.getMonth() - 1); break;
    case '90d': startDate.setMonth(now.getMonth() - 3); break;
    case '1y':  startDate.setFullYear(now.getFullYear() - 1); break;
    case 'all': startDate = new Date(0); break;
    default:    startDate.setDate(now.getDate() - 7);
  }

  try {
    const data = await db
      .collection('historicalquotes')
      .find({
        coin_id:    coinId,
        interval:   'daily',
        // compare Date against Date, not string:
        timestamp: { $gte: startDate }
      })
      .sort({ timestamp: 1 })
      .toArray();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error('Error fetching historical data:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch historical data.' }),
      { status: 500 }
    );
  }
}
