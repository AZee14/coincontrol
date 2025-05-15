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

interface CoinChartProps {
  coinId: number;
  coinSlug: string;
  coinSymbol: string;
  timeFrame: '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
  showMarketCap: boolean;
  showVolume: boolean;
  height: number;
}

const CoinChart: React.FC<CoinChartProps> = ({
  coinSlug,
  coinSymbol,
  timeFrame = '7d',
  showVolume = false,
  showMarketCap = false,
  height = 400
}) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrame);
  const [chartData, setChartData] = useState<CoinDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // sync prop → state
  useEffect(() => {
    setSelectedTimeFrame(timeFrame);
  }, [timeFrame]);

  // fetch when timeframe changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = `/api/coins/${coinSlug}/history`
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
  }, [coinSlug, selectedTimeFrame]);

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
      {/* Header & timeframe */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Price Chart ({coinSymbol})
        </h2>

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