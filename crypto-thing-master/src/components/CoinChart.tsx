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
        const response = await fetch(`/api/coins/${coinId}/history?timeFrame=${timeFrame}`);
        if (!response.ok) {
          throw new Error('Failed to fetch coin data');
        }
        const data = await response.json();
        
        // Format the data for the chart
        const formattedData = data.map((item: any) => ({
          timestamp: new Date(item.timestamp).toLocaleDateString(),
          price: item.price,
          market_cap: item.market_cap,
          volume_24h: item.volume_24h
        }));
        
        setChartData(formattedData);
      } catch (err) {
        console.error('Error fetching coin data:', err);
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoinData();
  }, [coinId, timeFrame]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading chart data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{coinSymbol} Price Chart</h2>
        <div className="flex space-x-2">
          <button className={`px-3 py-1 rounded ${timeFrame === '24h' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => timeFrame = '24h'}>24H</button>
          <button className={`px-3 py-1 rounded ${timeFrame === '7d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => timeFrame = '7d'}>7D</button>
          <button className={`px-3 py-1 rounded ${timeFrame === '30d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => timeFrame = '30d'}>30D</button>
          <button className={`px-3 py-1 rounded ${timeFrame === '90d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => timeFrame = '90d'}>90D</button>
          <button className={`px-3 py-1 rounded ${timeFrame === '1y' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => timeFrame = '1y'}>1Y</button>
          <button className={`px-3 py-1 rounded ${timeFrame === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => timeFrame = 'all'}>ALL</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }} 
          />
          <YAxis 
            yAxisId="price"
            domain={['auto', 'auto']}
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
          />
          {(showVolume || showMarketCap) && (
            <YAxis 
              yAxisId="secondary"
              orientation="right"
              tickFormatter={formatLargeNumber}
              tick={{ fontSize: 12 }}
            />
          )}
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'Price') return formatCurrency(value);
              return formatLargeNumber(value);
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
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
    </div>
  );
};

export default CoinChart;