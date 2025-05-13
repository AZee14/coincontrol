"use client"
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Link from "next/link";
import CoinChart from '@/components/CoinChart';
import Assets from "../Home/Assets";
import Transactions from "../Home/Transactions";

interface TopCoin {
  _id: string;
  coin_id: number;
  name: string;
  symbol: string;
  price: number;
  market_cap: number;
  circulating_supply: number;
  volume_24h: number;
  price_change_24h?: number;
}

export default function LandingPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [topCoins, setTopCoins] = useState<TopCoin[]>([]);
  const [featuredCoin, setFeaturedCoin] = useState<TopCoin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = ["Assets", "Transactions", "Market"];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const response = await fetch('/api/coins/top');
        if (!response.ok) {
          throw new Error('Failed to fetch top coins');
        }
        const data = await response.json();
        setTopCoins(data);
        
        // Set Bitcoin as the featured coin (or the first coin in the list)
        const bitcoin: TopCoin = data.find((coin: TopCoin) => coin.symbol === 'BTC') || data[0];
        setFeaturedCoin(bitcoin);
      } catch (error) {
        console.error('Error fetching top coins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopCoins();
  }, []);

  // Market tab content
  const renderMarketContent = () => (
    <div className="w-full mt-6">
      <section className="mb-12">
        {isLoading ? (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            Loading...
          </div>
        ) : featuredCoin ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {featuredCoin.name} ({featuredCoin.symbol}) Price Chart
              </h2>
              <Link href={`/coin/${featuredCoin.coin_id}`}>
                <span className="text-blue-500 hover:underline">View Details</span>
              </Link>
            </div>
            
            <CoinChart 
              coinId={featuredCoin.coin_id} 
              coinSymbol={featuredCoin.symbol}
              timeFrame="7d"
              height={400}
            />
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-500 font-medium">Current Price</h3>
                <p className="text-2xl font-bold">
                  ${featuredCoin.price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-500 font-medium">Market Cap</h3>
                <p className="text-2xl font-bold">
                  ${(featuredCoin.market_cap / 1e9).toFixed(2)}B
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-500 font-medium">24h Volume</h3>
                <p className="text-2xl font-bold">
                  ${(featuredCoin.volume_24h / 1e9).toFixed(2)}B
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            Failed to load featured coin data.
          </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Top Cryptocurrencies</h2>
          <Link href="/coins">
            <span className="text-blue-500 hover:underline">View All</span>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">24h %</th>
                  <th className="py-3 px-4 text-right">Market Cap</th>
                  <th className="py-3 px-4 text-right">Volume (24h)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topCoins.map((coin, index) => (
                  <tr key={coin._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">{index + 1}</td>
                    <td className="py-4 px-4">
                      <Link href={`/coin/${coin.coin_id}`}>
                        <div className="flex items-center">
                          <span className="font-medium">{coin.name}</span>
                          <span className="ml-2 text-gray-500">{coin.symbol}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-right">
                      ${coin.price.toLocaleString(undefined, { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className={`py-4 px-4 text-right ${coin.price_change_24h && coin.price_change_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.price_change_24h ? `${coin.price_change_24h > 0 ? '+' : ''}${coin.price_change_24h.toFixed(2)}%` : 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      ${(coin.market_cap / 1e9).toFixed(2)}B
                    </td>
                    <td className="py-4 px-4 text-right">
                      ${(coin.volume_24h / 1e9).toFixed(2)}B
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );

  return (
    <Container
      sx={{
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        borderRadius: "16px",
        padding: "2rem",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        maxWidth: { xs: "100%", lg: "1200px" },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
        <Typography
          sx={{
            color: "#333",
            fontSize: "2.5rem",
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          Crypto Coin Control
        </Typography>
        <Typography
          sx={{
            color: "#58667e",
            fontSize: "1.2rem",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          Track cryptocurrency prices, market caps, and keep track of your portfolio valuation with our
          easy-to-use platform.
        </Typography>
        <Box>
          <Button
            variant="contained"
            sx={{
              borderRadius: "8px",
              width: "12rem",
              height: "3.5rem",
              paddingX: "1.5rem",
              mt: 2,
              background: "linear-gradient(90deg, #007bff, #0056b3)",
              boxShadow: "0px 4px 10px rgba(0, 123, 255, 0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #0056b3, #003f7f)",
              },
            }}
          >
            <Typography
              sx={{
                textTransform: "none",
                fontWeight: "600",
                fontSize: "16px",
                lineHeight: "1.5rem",
                color: "#fff",
              }}
            >
              <Link href="/login" style={{ textDecoration: "none", color: "inherit" }}>
                Log In / Sign Up
              </Link>
            </Typography>
          </Button>
        </Box>
      </Box>
      <Divider sx={{ width: "100%", mt: 4, mb: 2 }} />
      
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          "& .MuiTab-root": {
            color: "gray",
            fontWeight: "600",
            fontSize: "1rem",
          },
          "& .Mui-selected": {
            color: "#007bff",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#007bff",
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} wrapped={false} label={tab} />
        ))}
      </Tabs>
      
      {selectedTab === 0 && <Assets />}
      {selectedTab === 1 && <Transactions data={[]} />}
      {selectedTab === 2 && renderMarketContent()}
      
      {(selectedTab === 0 || selectedTab === 1) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 4,
            padding: "1rem",
            background: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            sx={{
              color: "#58667e",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            Log In to see Your Data here
          </Typography>
        </Box>
      )}
    </Container>
  );
}