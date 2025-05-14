import { connectToDatabase } from '@/utils/mongodb/mongodb';
import { NextRequest } from 'next/server';
import { parse } from 'url';

// Slug → numeric CoinMarketCap ID
const coinSlugToId: Record<string, number> = {
  bitcoin: 1,
  litecoin: 2,
  xrp: 52,
  dogecoin: 74,
  monero: 328,
  stellar: 512,
  tether: 825,
  ethereum: 1027,
  'ethereum-classic': 1321,
  maker: 1518,
  iota: 1720,
  eos: 1765,
  'bitcoin-cash': 1831,
  bnb: 1839,
  tron: 1958,
  decentraland: 1966,
  chainlink: 1975,
  cardano: 2010,
  'kucoin-token': 2087,
  filecoin: 2280,
  'theta-network': 2416,
  'xdc-network': 2634,
  nexo: 2694,
  vechain: 3077,
  quant: 3155,
  usdc: 3408,
  cronos: 3635,
  'fetch-ai': 3773,
  cosmos: 3794,
  okb: 3897,
  'unus-sed-leo': 3957,
  algorand: 4030,
  gatetoken: 4269,
  flow: 4558,
  hedera: 4642,
  'pax-gold': 4705,
  stacks: 4847,
  dai: 4943,
  'tether-gold': 5176,
  solana: 5426,
  'render-token': 5690,
  avalanche: 5805,
  'shiba-inu': 5994,
  'the-sandbox': 6210,
  'near-protocol': 6535,
  'curve-dao-token': 6538,
  polkadot: 6636,
  'the-graph': 6719,
  gala: 7080,
  uniswap: 7083,
  pancakeswap: 7186,
  injective: 7226,
  aave: 7278,
  dexe: 7326,
  flare: 7950,
  'lido-dao': 8000,
  jasmycoin: 8425,
  raydium: 8526,
  'internet-computer': 8916,
  immutable: 10603,
  floki: 10804,
  'bitget-token': 11092,
  toncoin: 11419,
  optimism: 11840,
  arbitrum: 11841,
  worldcoin: 13502,
  'ethereum-name-service': 13855,
  'bittorrent-new': 16086,
  aptos: 21794,
  ondo: 21159,
  kaspa: 20396,
  sui: 20947,
  celestia: 22861,
  bittensor: 22974,
  bonk: 23095,
  sei: 23149,
  core: 23254,
  four: 23635,
  pepe: 24478,
  'first-digital-usd': 26081,
  mantle: 27075,
  'paypal-usd': 27772,
  spx6900: 28081,
  pol: 28321,
  dogwifhat: 28752,
  jupiter: 29210,
  'virtuals-protocol': 29420,
  'ethena-usde': 29470,
  'brett-based': 29743,
  ethena: 30171,
  hyperliquid: 32196,
  sonic: 32684,
  kaia: 32880,
  fartcoin: 33597,
  'pudgy-penguins': 34466,
  'official-trump': 35336,
  story: 35626,
  pi: 35697,
  walrus: 36119,
  'world-liberty-financial-usd': 36148,
  'bitcoin-sv': 3602
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
