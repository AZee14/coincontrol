'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface PriceData {
  timestamp: number;
  price?: number;
  market_cap?: number;
  volume?: number;
}

interface ComparisonChartProps {
  coin1: {
    id: number;
    slug: string;
    symbol: string;
    color: string;
  };
  coin2: {
    id: number;
    slug: string;
    symbol: string;
    color: string;
  };
  timeFrame: '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
  compareBy: 'price' | 'market_cap' | 'volume';
  percentageMode: boolean;
  height: number;
}

export default function ComparisonChart({
  coin1,
  coin2,
  timeFrame,
  compareBy,
  percentageMode,
  height
}: ComparisonChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [res1, res2] = await Promise.all([
          fetch(`/api/coins/${coin1.slug}/history?timeframe=${timeFrame}`),
          fetch(`/api/coins/${coin2.slug}/history?timeframe=${timeFrame}`)
        ]);

        if (!res1.ok || !res2.ok) {
          throw new Error('Failed to fetch one or both coins');
        }

        const [data1, data2]: [PriceData[], PriceData[]] = await Promise.all([
          res1.json(),
          res2.json()
        ]);

        // Create timestamp map
        const coin2Map = new Map(data2.map(d => [d.timestamp, d]));

        const merged = [];
        let base1: number | null = null;
        let base2: number | null = null;

        for (const point1 of data1) {
          const point2 = coin2Map.get(point1.timestamp);
          if (!point2) continue;

          const val1 = point1[compareBy];
          const val2 = point2[compareBy];

          if (val1 === undefined || val2 === undefined) continue;

          if (base1 === null) base1 = val1;
          if (base2 === null) base2 = val2;

          const normalized1 = percentageMode ? ((val1 - base1) / base1) * 100 : val1;
          const normalized2 = percentageMode ? ((val2 - base2) / base2) * 100 : val2;

          const date = new Date(point1.timestamp);
          let label = '';
          if (timeFrame === '24h') {
            label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else if (timeFrame === '7d') {
            label = date.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' });
          } else {
            label = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            if (timeFrame === '1y' || timeFrame === 'all') {
              label = `${date.toLocaleDateString([], { month: 'short' })} ${date.getFullYear()}`;
            }
          }

          merged.push({
            date: label,
            timestamp: point1.timestamp,
            [`${coin1.symbol}_${compareBy}`]: normalized1,
            [`${coin2.symbol}_${compareBy}`]: normalized2,
            rawValue1: val1,
            rawValue2: val2
          });
        }

        // Downsample if too many points
        merged.sort((a, b) => a.timestamp - b.timestamp);
        const maxPoints = isMobile ? 25 : 50;
        const reduced = merged.length > maxPoints
          ? merged.filter((_, idx) => idx % Math.ceil(merged.length / maxPoints) === 0)
          : merged;

        setData(reduced);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coin1, coin2, timeFrame, compareBy, percentageMode, isMobile]);

  const formatYAxisTick = (value: number) => {
    if (percentageMode) return `${value.toFixed(1)}%`;

    const abs = Math.abs(value);
    if (compareBy === 'price') return `$${value.toFixed(2)}`;
    if (compareBy === 'market_cap') {
      if (abs >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
      if (abs >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
      if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
      return `$${value.toFixed(0)}`;
    }
    if (compareBy === 'volume') {
      if (abs >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
      if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
      return `$${value.toFixed(0)}`;
    }

    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, boxShadow: 3, border: '1px solid #ccc' }}>
        <Typography fontWeight={600} mb={1}>{label}</Typography>
        {payload.map((entry: any, index: number) => {
          const isFirst = entry.dataKey.startsWith(coin1.symbol);
          const color = isFirst ? coin1.color : coin2.color;
          const symbol = isFirst ? coin1.symbol : coin2.symbol;
          const raw = isFirst ? payload[0].payload.rawValue1 : payload[0].payload.rawValue2;

          return (
            <Box key={index} mb={1}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '50%', mr: 1 }} />
                <Typography fontWeight={600} color={color}>{symbol}</Typography>
              </Box>
              <Typography pl={2}>
                {percentageMode
                  ? `Change: ${entry.value.toFixed(2)}%`
                  : compareBy === 'price'
                    ? `Price: $${raw.toFixed(2)}`
                    : compareBy === 'market_cap'
                      ? `Market Cap: $${(raw / 1e9).toFixed(2)}B`
                      : `Volume: $${(raw / 1e6).toFixed(2)}M`}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <Typography>No comparable data available for selected timeframe.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={formatYAxisTick} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {percentageMode && (
            <ReferenceLine y={0} stroke="gray" strokeDasharray="4" />
          )}
          <Line
            type="monotone"
            dataKey={`${coin1.symbol}_${compareBy}`}
            stroke={coin1.color}
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey={`${coin2.symbol}_${compareBy}`}
            stroke={coin2.color}
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
