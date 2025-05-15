// src/sections/CoinPage/page.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CoinChart from '@/components/CoinChart';
import Link from 'next/link';

interface CoinData {
  _id: string;
  coin_id: number;
  name: string;
  symbol: string;
  price: number;
  market_cap: number;
  circulating_supply: number;
  total_supply: number;
  volume_24h: number;
  price_change_24h?: number;
  price_change_7d?: number;
  price_change_30d?: number;
  timestamp: string;
}

export default function CoinPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [timeFrame, setTimeFrame] = useState<'24h' | '7d' | '30d' | '90d' | '1y' | 'all'>('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [showMarketCap, setShowMarketCap] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchCoinData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/coins/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch coin data');
        }
        const data = await response.json();
        setCoinData(data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          Loading coin data...
        </div>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Failed to load coin data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link href="/">
          <span className="text-blue-500 hover:underline">← Back to Home</span>
        </Link>
      </nav>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              {coinData.name} ({coinData.symbol})
            </h1>
            <p className="text-2xl font-bold mt-2">
              ${coinData.price.toLocaleString(undefined, { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              {coinData.price_change_24h && (
                <span className={`ml-2 text-sm ${coinData.price_change_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coinData.price_change_24h > 0 ? '↑' : '↓'} {Math.abs(coinData.price_change_24h).toFixed(2)}%
                </span>
              )}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <span className="text-gray-500">Last updated: </span>
            <span className="font-medium">
              {new Date(coinData.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex flex-wrap items-center mb-4 space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showMarketCap"
                checked={showMarketCap}
                onChange={() => setShowMarketCap(!showMarketCap)}
                className="h-4 w-4"
              />
              <label htmlFor="showMarketCap" className="text-sm">Show Market Cap</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showVolume"
                checked={showVolume}
                onChange={() => setShowVolume(!showVolume)}
                className="h-4 w-4"
              />
              <label htmlFor="showVolume" className="text-sm">Show Volume</label>
            </div>
          </div>

          
          <div className="flex space-x-2 mt-4">
            <button 
              className={`px-3 py-1 rounded ${timeFrame === '24h' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setTimeFrame('24h')}
            >
              24H
            </button>
            <button 
              className={`px-3 py-1 rounded ${timeFrame === '7d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setTimeFrame('7d')}
            >
              7D
            </button>
            <button 
              className={`px-3 py-1 rounded ${timeFrame === '30d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setTimeFrame('30d')}
            >
              30D
            </button>
            <button 
              className={`px-3 py-1 rounded ${timeFrame === '90d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setTimeFrame('90d')}
            >
              90D
            </button>
            <button 
              className={`px-3 py-1 rounded ${timeFrame === '1y' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setTimeFrame('1y')}
            >
              1Y
            </button>
            <button 
              className={`px-3 py-1 rounded ${timeFrame === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setTimeFrame('all')}
            >
              ALL
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Market Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Market Cap</span>
              <span className="font-medium">${(coinData.market_cap / 1e9).toFixed(2)}B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">24h Trading Volume</span>
              <span className="font-medium">${(coinData.volume_24h / 1e9).toFixed(2)}B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Circulating Supply</span>
              <span className="font-medium">{coinData.circulating_supply.toLocaleString()} {coinData.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Supply</span>
              <span className="font-medium">{coinData.total_supply.toLocaleString()} {coinData.symbol}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Price Change</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">24h Change</span>
              <span className={`font-medium ${coinData.price_change_24h && coinData.price_change_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coinData.price_change_24h ? `${coinData.price_change_24h > 0 ? '+' : ''}${coinData.price_change_24h.toFixed(2)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">7d Change</span>
              <span className={`font-medium ${coinData.price_change_7d && coinData.price_change_7d > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coinData.price_change_7d ? `${coinData.price_change_7d > 0 ? '+' : ''}${coinData.price_change_7d.toFixed(2)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">30d Change</span>
              <span className={`font-medium ${coinData.price_change_30d && coinData.price_change_30d > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coinData.price_change_30d ? `${coinData.price_change_30d > 0 ? '+' : ''}${coinData.price_change_30d.toFixed(2)}%` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">About {coinData.name}</h2>
        <div className="prose max-w-none">
          <p>
            {coinData.name} ({coinData.symbol}) is a cryptocurrency with a current price of ${coinData.price.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}. It has a market capitalization of ${(coinData.market_cap / 1e9).toFixed(2)} billion and a 24-hour trading volume of ${(coinData.volume_24h / 1e9).toFixed(2)} billion.
          </p>
          <p className="mt-4">
            With a circulating supply of {coinData.circulating_supply.toLocaleString()} {coinData.symbol} and a total supply of {coinData.total_supply.toLocaleString()} {coinData.symbol}, it ranks among the world&#39;s leading cryptocurrencies.
          </p>
        </div>
      </div>
    </div>
  );
}