// src/components/CoinChart.tsx
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export interface CoinDataPoint {
  timestamp: string;
  price: number;
  market_cap: number;
  volume_24h: number;
}

// Supported coins list
  const AVAILABLE_COINS = [
  { slug: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { slug: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
  { slug: 'xrp', symbol: 'XRP', name: 'XRP'},
  { slug: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin'},
  { slug: 'monero', symbol: 'XMR', name: 'Monero' },
  { slug: 'stellar', symbol: 'XLM', name: 'Stellar'},
  { slug: 'tether', symbol: 'USDT', name: 'Tether USDt'},
  { slug: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { slug: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic' },
  { slug: 'maker', symbol: 'MKR', name: 'Maker' },
  { slug: 'iota', symbol: 'IOTA', name: 'IOTA'},
  { slug: 'eos', symbol: 'EOS', name: 'EOS' },
  { slug: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash' },
  { slug: 'bnb', symbol: 'BNB', name: 'BNB'},
  { slug: 'tron', symbol: 'TRX', name: 'TRON' },
  { slug: 'decentraland', symbol: 'MANA', name: 'Decentraland' },
  { slug: 'chainlink', symbol: 'LINK', name: 'Chainlink'},
  { slug: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { slug: 'kucoin-token', symbol: 'KCS', name: 'KuCoin Token'},
  { slug: 'filecoin', symbol: 'FIL', name: 'Filecoin' },
  { slug: 'theta-network', symbol: 'THETA', name: 'Theta Network'},
  { slug: 'xdc-network', symbol: 'XDC', name: 'XDC Network' },
  { slug: 'nexo', symbol: 'NEXO', name: 'Nexo' },
  { slug: 'vechain', symbol: 'VET', name: 'VeChain' },
  { slug: 'quant', symbol: 'QNT', name: 'Quant'},
  { slug: 'usdc', symbol: 'USDC', name: 'USDC' },
  { slug: 'cronos', symbol: 'CRO', name: 'Cronos'},
  { slug: 'fetch-ai', symbol: 'FET', name: 'Artificial Superintelligence Alliance' },
  { slug: 'cosmos', symbol: 'ATOM', name: 'Cosmos'},
  { slug: 'okb', symbol: 'OKB', name: 'OKB'},
  { slug: 'unus-sed-leo', symbol: 'LEO', name: 'UNUS SED LEO' },
  { slug: 'algorand', symbol: 'ALGO', name: 'Algorand' },
  { slug: 'gatetoken', symbol: 'GT', name: 'GateToken' },
  { slug: 'flow', symbol: 'FLOW', name: 'Flow'},
  { slug: 'hedera', symbol: 'HBAR', name: 'Hedera'},
  { slug: 'pax-gold', symbol: 'PAXG', name: 'PAX Gold'},
  { slug: 'stacks', symbol: 'STX', name: 'Stacks' },
  { slug: 'dai', symbol: 'DAI', name: 'Dai'},
  { slug: 'tether-gold', symbol: 'XAUt', name: 'Tether Gold'},
  { slug: 'solana', symbol: 'SOL', name: 'Solana' },
  { slug: 'render-token', symbol: 'RENDER', name: 'Render' },
  { slug: 'avalanche', symbol: 'AVAX', name: 'Avalanche'},
  { slug: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu'},
  { slug: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox' },
  { slug: 'near-protocol', symbol: 'NEAR', name: 'NEAR Protocol'},
  { slug: 'curve-dao-token', symbol: 'CRV', name: 'Curve DAO Token' },
  { slug: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { slug: 'the-graph', symbol: 'GRT', name: 'The Graph' },
  { slug: 'gala', symbol: 'GALA', name: 'Gala' },
  { slug: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
  { slug: 'pancakeswap', symbol: 'CAKE', name: 'PancakeSwap'},
  { slug: 'injective', symbol: 'INJ', name: 'Injective' },
  { slug: 'aave', symbol: 'AAVE', name: 'Aave'},
  { slug: 'dexe', symbol: 'DEXE', name: 'DeXe'},
  { slug: 'flare', symbol: 'FLR', name: 'Flare' },
  { slug: 'lido-dao', symbol: 'LDO', name: 'Lido DAO'},
  { slug: 'jasmycoin', symbol: 'JASMY', name: 'JasmyCoin' },
  { slug: 'raydium', symbol: 'RAY', name: 'Raydium' },
  { slug: 'internet-computer', symbol: 'ICP', name: 'Internet Computer'},
  { slug: 'immutable', symbol: 'IMX', name: 'Immutable' },
  { slug: 'floki', symbol: 'FLOKI', name: 'FLOKI' },
  { slug: 'bitget-token', symbol: 'BGB', name: 'Bitget Token' },
  { slug: 'toncoin', symbol: 'TON', name: 'Toncoin' },
  { slug: 'optimism', symbol: 'OP', name: 'Optimism' },
  { slug: 'arbitrum', symbol: 'ARB', name: 'Arbitrum' },
  { slug: 'worldcoin', symbol: 'WLD', name: 'Worldcoin'},
  { slug: 'ethereum-name-service', symbol: 'ENS', name: 'Ethereum Name Service' },
  { slug: 'bittorrent-new', symbol: 'BTT', name: 'BitTorrent [New]'},
  { slug: 'aptos', symbol: 'APT', name: 'Aptos' },
  { slug: 'ondo', symbol: 'ONDO', name: 'Ondo'},
  { slug: 'kaspa', symbol: 'KAS', name: 'Kaspa'},
  { slug: 'sui', symbol: 'SUI', name: 'Sui' },
  { slug: 'celestia', symbol: 'TIA', name: 'Celestia' },
  { slug: 'bittensor', symbol: 'TAO', name: 'Bittensor' },
  { slug: 'bonk', symbol: 'BONK', name: 'Bonk' },
  { slug: 'sei', symbol: 'SEI', name: 'Sei' },
  { slug: 'core', symbol: 'CORE', name: 'Core'},
  { slug: 'four', symbol: 'FORM', name: 'Four' },
  { slug: 'pepe', symbol: 'PEPE', name: 'Pepe' },
  { slug: 'first-digital-usd', symbol: 'FDUSD', name: 'First Digital USD'},
  { slug: 'mantle', symbol: 'MNT', name: 'Mantle' },
  { slug: 'paypal-usd', symbol: 'PYUSD', name: 'PayPal USD' },
  { slug: 'spx6900', symbol: 'SPX', name: 'SPX6900' },
  { slug: 'pol', symbol: 'POL', name: 'POL (prev. MATIC)' },
  { slug: 'dogwifhat', symbol: 'WIF', name: 'dogwifhat' },
  { slug: 'jupiter', symbol: 'JUP', name: 'Jupiter' },
  { slug: 'virtuals-protocol', symbol: 'VIRTUAL', name: 'Virtuals Protocol'},
  { slug: 'ethena-usde', symbol: 'USDe', name: 'Ethena USDe'},
  { slug: 'brett-based', symbol: 'BRETT', name: 'Brett (Based)' },
  { slug: 'ethena', symbol: 'ENA', name: 'Ethena'},
  { slug: 'hyperliquid', symbol: 'HYPE', name: 'Hyperliquid'},
  { slug: 'sonic', symbol: 'S', name: 'Sonic (prev. FTM)' },
  { slug: 'kaia', symbol: 'KAIA', name: 'Kaia' },
  { slug: 'fartcoin', symbol: 'FARTCOIN', name: 'Fartcoin' },
  { slug: 'pudgy-penguins', symbol: 'PENGU', name: 'Pudgy Penguins'},
  { slug: 'official-trump', symbol: 'TRUMP', name: 'OFFICIAL TRUMP' },
  { slug: 'story', symbol: 'IP', name: 'Story' },
  { slug: 'pi', symbol: 'PI', name: 'Pi'},
  { slug: 'walrus', symbol: 'WAL', name: 'Walrus' },
  { slug: 'world-liberty-financial-usd', symbol: 'USD1', name: 'World Liberty Financial USD' },
  { slug: 'bitcoin-sv', symbol: 'BSV', name: 'Bitcoin SV'}
];


interface CoinChartProps {
  coinId: number;
  coinSymbol: string;
  timeFrame: '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
  showMarketCap: boolean;
  showVolume: boolean;
  height: number;
}

const CoinChart: React.FC<CoinChartProps> = ({
  timeFrame = '7d',
  showVolume = false,
  showMarketCap = false,
  height = 400
}) => {
  const [selectedCoin, setSelectedCoin] = useState(AVAILABLE_COINS[0]); // default to Bitcoin (index 0)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrame);
  const [chartData, setChartData] = useState<CoinDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // sync prop → state
  useEffect(() => {
    setSelectedTimeFrame(timeFrame);
  }, [timeFrame]);

  // fetch when coin or timeframe changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = `/api/coins/${selectedCoin.slug}/history`
          + `?timeFrame=${selectedTimeFrame}&interval=daily`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data: any[] = await resp.json();

        // if no data for this frame, auto-switch to ALL once
        if (data.length === 0 && selectedTimeFrame !== 'all') {
          setSelectedTimeFrame('all');
          return;
        }

        const formatted = data.map(item => ({
          timestamp: new Date(item.timestamp).toLocaleDateString(),
          price:     item.price,
          market_cap:item.market_cap,
          volume_24h:item.volume_24h
        }));

        setChartData(formatted);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load chart data');
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedCoin, selectedTimeFrame]);

  // currency formatter
  const fmtCurr = (v: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(v);

  // large number formatter
  const fmtLarge = (v: number) => {
    if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
    if (v >= 1e9)  return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6)  return `$${(v / 1e6).toFixed(2)}M`;
    return fmtCurr(v);
  };

  // coerce any → number
  const toNumber = (value: any): number =>
    typeof value === 'number' ? value : parseFloat(value);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-700">
        Loading chart…
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-600 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow text-gray-900">
      {/* Coin selector */}
      <div className="flex items-center space-x-2 mb-4">
        <label htmlFor="coin-select" className="font-medium">Coin:</label>
        <select
          id="coin-select"
          value={selectedCoin.slug}
          onChange={e => {
            const sel = AVAILABLE_COINS.find(c => c.slug === e.target.value)!;
            setSelectedCoin(sel);
          }}
          className="border rounded px-2 py-1"
        >
          {AVAILABLE_COINS.map(c => (
            <option key={c.slug} value={c.slug}>
              {c.name} ({c.symbol})
            </option>
          ))}
        </select>
      </div>

      {/* Header & timeframe */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {selectedCoin.name} ({selectedCoin.symbol}) Price Chart
        </h2>
        <div className="flex space-x-2">
          {(['24h','7d','30d','90d','1y','all'] as const).map(tf => (
            <button
              key={tf}
              className={`px-3 py-1 rounded ${
                selectedTimeFrame === tf
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => setSelectedTimeFrame(tf)}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Chart or fallback */}
      {chartData.length === 0 ? (
        <div className="text-center text-gray-500">
          No historical data available for &quot;{selectedTimeFrame}&quot;.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top:5, right:30, left:20, bottom:5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis
              dataKey="timestamp"
              tick={{ fill: '#1F2937', fontSize: 12 }}
            />
            <YAxis
              yAxisId="price"
              tickFormatter={val => fmtCurr(toNumber(val))}
              tick={{ fill: '#1F2937', fontSize: 12 }}
            />
            {(showVolume || showMarketCap) && (
              <YAxis
                yAxisId="secondary"
                orientation="right"
                tickFormatter={val => fmtLarge(toNumber(val))}
                tick={{ fill: '#1F2937', fontSize: 12 }}
              />
            )}
            <Tooltip
              formatter={(value: any, name: any) => {
                const num = toNumber(value);
                const formatted = name === 'Price'
                  ? fmtCurr(num)
                  : fmtLarge(num);
                return [formatted, name];
              }}
              labelFormatter={label => `Date: ${label}`}
              contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc' }}
              itemStyle={{ color: '#1F2937' }}
              labelStyle={{ color: '#111827' }}
            />
            <Legend />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="price"
              name="Price"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            {showMarketCap && (
              <Line
                yAxisId="secondary"
                type="monotone"
                dataKey="market_cap"
                name="Market Cap"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}
            {showVolume && (
              <Line
                yAxisId="secondary"
                type="monotone"
                dataKey="volume_24h"
                name="Volume (24h)"
                stroke="#6366F1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CoinChart;