import { connectToDatabase } from '@/utils/mongodb/mongodb';
import { NextRequest } from 'next/server';
import { parse } from 'url';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { db } = await connectToDatabase();
  const { query } = parse(request.url!, true);
  const timeFrame = (query.timeFrame as string) || '7d';
  const id = Number(params.id);

  const now = new Date();
  let startDate = new Date();

  switch (timeFrame) {
    case '24h': startDate.setDate(now.getDate() - 1); break;
    case '7d': startDate.setDate(now.getDate() - 7); break;
    case '30d': startDate.setMonth(now.getMonth() - 1); break;
    case '90d': startDate.setMonth(now.getMonth() - 3); break;
    case '1y': startDate.setFullYear(now.getFullYear() - 1); break;
    case 'all': startDate = new Date(0); break;
    default: startDate.setDate(now.getDate() - 7);
  }

  const data = await db
    .collection('historicalquotes')
    .find({
      coin_id: id,
      timestamp: { $gte: startDate.toISOString() }
    })
    .sort({ timestamp: 1 })
    .toArray();

  return new Response(JSON.stringify(data), { status: 200 });
}
