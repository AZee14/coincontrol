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
  coinId: string | number;
  coinSymbol: string;
  timeFrame?: '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
  showVolume?: boolean;
  showMarketCap?: boolean;
  height?: number;
}

const CoinChart: React.FC<CoinChartProps> = ({
  coinId,
  coinSymbol,
  timeFrame = '7d',
  showVolume = false,
  showMarketCap = false,
  height = 400
}) => {
  const [chartData, setChartData] = useState<CoinDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      setIsLoading(true);
      try {
        console.log(`Fetching /api/coins/${coinId}/history?timeFrame=${timeFrame}&interval=daily`);
        const response = await fetch(
          `/api/coins/${coinId}/history?timeFrame=${timeFrame}&interval=daily`
        );
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Status ${response.status}: ${errText}`);
        }
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          setChartData([]);
          setError('No historical data available for this time frame.');
        } else {
          const formattedData = data.map((item: any) => ({
            timestamp: new Date(item.timestamp).toLocaleDateString(),
            price: item.price,
            market_cap: item.market_cap,
            volume_24h: item.volume_24h
          }));
          setChartData(formattedData);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching coin data:', err);
        setError(err.message || 'Failed to load chart data');
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoinData();
  }, [coinId, timeFrame]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-700">
        Loading chart data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 text-gray-900">
      <h2 className="text-xl font-bold mb-2 text-gray-900">
        {coinSymbol.toUpperCase()} Price Chart ({timeFrame.toUpperCase()})
      </h2>

      {chartData.length === 0 ? (
        <div className="text-center text-gray-600">
          No data available for this time frame.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="timestamp"
              tick={{ fill: '#1F2937', fontSize: 12 }}
            />
            <YAxis
              yAxisId="price"
              domain={['auto', 'auto']}
              tickFormatter={formatCurrency}
              tick={{ fill: '#1F2937', fontSize: 12 }}
            />
            {(showVolume || showMarketCap) && (
              <YAxis
                yAxisId="secondary"
                orientation="right"
                tickFormatter={formatLargeNumber}
                tick={{ fill: '#1F2937', fontSize: 12 }}
              />
            )}
            <Tooltip
              formatter={(value: number, name: string) =>
                name === 'Price' ? formatCurrency(value) : formatLargeNumber(value)
              }
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc' }}
              itemStyle={{ color: '#1F2937' }}
              labelStyle={{ color: '#1F2937' }}
            />
            <Legend wrapperStyle={{ color: '#1F2937', fontSize: 12 }} />

            <Line
              yAxisId="price"
              type="monotone"
              dataKey="price"
              name="Price"
              stroke="#2563eb"
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
                stroke="#10b981"
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
                stroke="#6366f1"
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