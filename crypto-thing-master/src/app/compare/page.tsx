'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  Stack,
  Divider,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import Link from 'next/link';
import ComparisonChart from '../../components/ComparisonChart';

// Icons
const CompareIcon = () => (
  <Avatar sx={{ bgcolor: 'rgba(0, 116, 228, 0.1)', color: '#0074e4', width: 48, height: 48 }}>
    <span style={{ fontSize: '20px' }}>⚖️</span>
  </Avatar>
);

const PriceChangeIcon = () => (
  <Avatar sx={{ bgcolor: 'rgba(0, 116, 228, 0.1)', color: '#0074e4', width: 48, height: 48 }}>
    <span style={{ fontSize: '20px' }}>💹</span>
  </Avatar>
);

interface CoinData {
  _id: string;
  coin_id: number;
  name: string;
  symbol: string;
  slug: string;
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
export default function ComparePage() {
  const [selectedCoin1, setSelectedCoin1] = useState(AVAILABLE_COINS[0]);
  const [selectedCoin2, setSelectedCoin2] = useState(AVAILABLE_COINS[1]);
  const [coin1Data, setCoin1Data] = useState<CoinData | null>(null);
  const [coin2Data, setCoin2Data] = useState<CoinData | null>(null);
  const [isLoadingCoin1, setIsLoadingCoin1] = useState(false);
  const [isLoadingCoin2, setIsLoadingCoin2] = useState(false);
  const [timeFrame, setTimeFrame] = useState<'24h' | '7d' | '30d' | '90d' | '1y' | 'all'>('7d');
  const [compareBy, setCompareBy] = useState<'price' | 'market_cap' | 'volume'>('price');
  const [percentageMode, setPercentageMode] = useState(true);


  // Fetch coin 1 data when selected
  useEffect(() => {
    interface FetchDataFn {
      (
      coin: { slug: string },
      setData: React.Dispatch<React.SetStateAction<CoinData | null>>,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>
      ): Promise<void>;
    }

    const fetchData: FetchDataFn = async (coin, setData, setLoading) => {
      setLoading(true);
      try {
      const resp = await fetch(`/api/coins/${coin.slug}/history` +
        `?timeFrame=7d&interval=daily`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data: CoinData = await resp.json();
      setData(data);
      } catch (err) {
      console.error(err);
      setData(null);
      } finally {
      setLoading(false);
      }
    };
    if (selectedCoin1) fetchData(selectedCoin1, setCoin1Data, setIsLoadingCoin1);
  }, [selectedCoin1]);

  useEffect(() => {
    interface FetchDataFn {
      (
      coin: { slug: string },
      setData: React.Dispatch<React.SetStateAction<CoinData | null>>,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>
      ): Promise<void>;
    }

    const fetchData: FetchDataFn = async (
      coin,
      setData,
      setLoading
    ) => {
      setLoading(true);
      try {
      const resp = await fetch(
        `/api/coins/${coin.slug}/history` + `?timeFrame=7d&interval=daily`
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data: CoinData = await resp.json();
      setData(data);
      } catch (err) {
      console.error(err);
      setData(null);
      } finally {
      setLoading(false);
      }
    };
    if (selectedCoin2) fetchData(selectedCoin2, setCoin2Data, setIsLoadingCoin2);
  }, [selectedCoin2]);


interface CoinOption {
  slug: string;
  symbol: string;
  name: string;
}

interface CoinSelectEvent {
  target: {
    value: CoinOption;
  };
}

const handleCoin1Change = (event: any) => {
  const slug = event.target.value;
  const coin = AVAILABLE_COINS.find(c => c.slug === slug);
  if (coin) setSelectedCoin1(coin);
};

const handleCoin2Change = (event: any) => {
  const slug = event.target.value;
  const coin = AVAILABLE_COINS.find(c => c.slug === slug);
  if (coin) setSelectedCoin2(coin);
};

  const handleTimeFrameChange = (newTimeFrame: '24h' | '7d' | '30d' | '90d' | '1y' | 'all') => {
    setTimeFrame(newTimeFrame);
  };

  const handleCompareByChange = (event: any) => {
    setCompareBy(event.target.value);
  };

  const handleDisplayModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: boolean | null,
  ) => {
    if (newMode !== null) {
      setPercentageMode(newMode);
    }
  };

  const getPriceChangeClass = (change?: number) => {
    if (!change) return '#58667e';
    return change > 0 ? '#16c784' : '#ea3943';
  };

  const renderComparisonSummary = () => {
    if (!coin1Data || !coin2Data) return null;
    
    // Helper function to get percentage difference
    const getPercentageDiff = (value1: number, value2: number) => {
      const diff = ((value1 - value2) / value2) * 100;
      return diff.toFixed(2);
    };
    
    // Helper function to format large numbers
    const formatLargeNumber = (num: number) => {
      if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
      if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
      if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
      return `$${num.toFixed(2)}`;
    };
    
    return (
      <Paper
        elevation={2}
        sx={{
          background: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(210, 225, 245, 0.5)',
          mb: 4
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          borderBottom: '1px solid rgba(210, 225, 245, 0.5)',
          p: { xs: 2, sm: 3 },
          gap: 2
        }}>
          <CompareIcon />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2c50' }}>
            Comparison Summary
          </Typography>
        </Box>
        
        <Grid container sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid item xs={12} md={4} sx={{ borderRight: { md: '1px solid rgba(210, 225, 245, 0.5)' }, p: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2c50', mb: 1 }}>
                Price Comparison
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 1 }}>
  <Typography variant="body2" sx={{ color: '#1a2c50', mb: 0.5 }}>
  Price: ${coin1Data.price ? coin1Data.price.toLocaleString(undefined, { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : '0.00'}
  {coin1Data.price_change_24h && (
    <span style={{ color: getPriceChangeClass(coin1Data.price_change_24h), marginLeft: '8px' }}>
      ({coin1Data.price_change_24h > 0 ? '+' : ''}{coin1Data.price_change_24h.toFixed(2)}%)
    </span>
  )}
</Typography>
<Typography variant="body2" sx={{ color: '#1a2c50', mb: 0.5 }}>
  Price: ${coin2Data.price ? coin2Data.price.toLocaleString(undefined, { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : '0.00'}
  {coin2Data.price_change_24h && (
    <span style={{ color: getPriceChangeClass(coin2Data.price_change_24h), marginLeft: '8px' }}>
      ({coin2Data.price_change_24h > 0 ? '+' : ''}{coin2Data.price_change_24h.toFixed(2)}%)
    </span>
  )}
</Typography>
              </Box>
              <Typography 
                sx={{ 
                  color: coin1Data.price > coin2Data.price ? '#16c784' : '#ea3943',
                  fontWeight: 600
                }}
              >
                {coin1Data.price > coin2Data.price ? 
                  `${coin1Data.symbol} is ${getPercentageDiff(coin1Data.price, coin2Data.price)}% higher` : 
                  `${coin1Data.symbol} is ${Math.abs(Number(getPercentageDiff(coin1Data.price, coin2Data.price)))}% lower`
                }
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ borderRight: { md: '1px solid rgba(210, 225, 245, 0.5)' }, p: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2c50', mb: 1 }}>
                Market Cap Comparison
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 1 }}>
  <Typography variant="body2" sx={{ color: '#58667e' }}>
  Market Cap: ${coin1Data.market_cap ? (coin1Data.market_cap / 1e9).toFixed(2) : '0.00'}B
</Typography>
  <Typography variant="body2" sx={{ color: '#58667e' }}>
  Market Cap: ${coin2Data.market_cap ? (coin2Data.market_cap / 1e9).toFixed(2) : '0.00'}B
</Typography>
              </Box>
              <Typography 
                sx={{ 
                  color: coin1Data.market_cap > coin2Data.market_cap ? '#16c784' : '#ea3943',
                  fontWeight: 600
                }}
              >
                {coin1Data.market_cap > coin2Data.market_cap ? 
                  `${coin1Data.symbol} is ${getPercentageDiff(coin1Data.market_cap, coin2Data.market_cap)}% larger` : 
                  `${coin1Data.symbol} is ${Math.abs(Number(getPercentageDiff(coin1Data.market_cap, coin2Data.market_cap)))}% smaller`
                }
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ p: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2c50', mb: 1 }}>
                24h Volume Comparison
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 1 }}>
                <Typography sx={{ color: '#0074e4', fontWeight: 600 }}>
                  {coin1Data.symbol}: {formatLargeNumber(coin1Data.volume_24h)}
                </Typography>
                <Typography sx={{ color: '#7b61ff', fontWeight: 600 }}>
                  {coin2Data.symbol}: {formatLargeNumber(coin2Data.volume_24h)}
                </Typography>
              </Box>
              <Typography 
                sx={{ 
                  color: coin1Data.volume_24h > coin2Data.volume_24h ? '#16c784' : '#ea3943',
                  fontWeight: 600
                }}
              >
                {coin1Data.volume_24h > coin2Data.volume_24h ? 
                  `${coin1Data.symbol} has ${getPercentageDiff(coin1Data.volume_24h, coin2Data.volume_24h)}% higher volume` : 
                  `${coin1Data.symbol} has ${Math.abs(Number(getPercentageDiff(coin1Data.volume_24h, coin2Data.volume_24h)))}% lower volume`
                }
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const renderPerformanceComparison = () => {
    if (!coin1Data || !coin2Data) return null;
    
    return (
      <Paper
        elevation={2}
        sx={{
          background: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(210, 225, 245, 0.5)',
          mb: 4
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          borderBottom: '1px solid rgba(210, 225, 245, 0.5)',
          p: { xs: 2, sm: 3 },
          gap: 2
        }}>
          <PriceChangeIcon />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2c50' }}>
            Performance Comparison
          </Typography>
        </Box>
        
        <Grid container sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid item xs={12} md={6} sx={{ borderRight: { md: '1px solid rgba(210, 225, 245, 0.5)' }, p: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0074e4', mb: 1 }}>
                {coin1Data.name} ({coin1Data.symbol})
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#58667e' }}>24h Change:</Typography>
                <Typography sx={{ color: getPriceChangeClass(coin1Data.price_change_24h), fontWeight: 600 }}>
                  {coin1Data.price_change_24h ? `${coin1Data.price_change_24h > 0 ? '+' : ''}${coin1Data.price_change_24h.toFixed(2)}%` : 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#58667e' }}>7d Change:</Typography>
                <Typography sx={{ color: getPriceChangeClass(coin1Data.price_change_7d), fontWeight: 600 }}>
                  {coin1Data.price_change_7d ? `${coin1Data.price_change_7d > 0 ? '+' : ''}${coin1Data.price_change_7d.toFixed(2)}%` : 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#58667e' }}>30d Change:</Typography>
                <Typography sx={{ color: getPriceChangeClass(coin1Data.price_change_30d), fontWeight: 600 }}>
                  {coin1Data.price_change_30d ? `${coin1Data.price_change_30d > 0 ? '+' : ''}${coin1Data.price_change_30d.toFixed(2)}%` : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ p: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#7b61ff', mb: 1 }}>
                {coin2Data.name} ({coin2Data.symbol})
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#58667e' }}>24h Change:</Typography>
                <Typography sx={{ color: getPriceChangeClass(coin2Data.price_change_24h), fontWeight: 600 }}>
                  {coin2Data.price_change_24h ? `${coin2Data.price_change_24h > 0 ? '+' : ''}${coin2Data.price_change_24h.toFixed(2)}%` : 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ color: '#58667e' }}>7d Change:</Typography>
                <Typography sx={{ color: getPriceChangeClass(coin2Data.price_change_7d), fontWeight: 600 }}>
                  {coin2Data.price_change_7d ? `${coin2Data.price_change_7d > 0 ? '+' : ''}${coin2Data.price_change_7d.toFixed(2)}%` : 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#58667e' }}>30d Change:</Typography>
                <Typography sx={{ color: getPriceChangeClass(coin2Data.price_change_30d), fontWeight: 600 }}>
                  {coin2Data.price_change_30d ? `${coin2Data.price_change_30d > 0 ? '+' : ''}${coin2Data.price_change_30d.toFixed(2)}%` : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ p: 3, borderTop: '1px solid rgba(210, 225, 245, 0.5)' }}>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#58667e', fontStyle: 'italic' }}>
            {coin1Data.price_change_7d && coin2Data.price_change_7d ? (
              coin1Data.price_change_7d > coin2Data.price_change_7d ? 
                `${coin1Data.symbol} has outperformed ${coin2Data.symbol} by ${(coin1Data.price_change_7d - coin2Data.price_change_7d).toFixed(2)}% over the last 7 days.` : 
                `${coin2Data.symbol} has outperformed ${coin1Data.symbol} by ${(coin2Data.price_change_7d - coin1Data.price_change_7d).toFixed(2)}% over the last 7 days.`
            ) : 'Insufficient data to compare 7-day performance.'}
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 4 } }}>
      {/* Navigation */}
      <Box sx={{ mt: 3, mb: 4, maxWidth: '1400px', mx: 'auto' }}>
        <Button
          variant="contained"
          sx={{
            borderRadius: "10px",
            minWidth: { xs: '140px', sm: '160px' },
            height: { xs: '42px', sm: '48px' },
            px: { xs: 2, sm: 3 },
            background: 'linear-gradient(90deg, #0074e4, #005bb7)',
            boxShadow: '0 4px 14px rgba(0, 116, 228, 0.2)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(90deg, #005bb7, #004a94)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(0, 116, 228, 0.3)',
            },
          }}
          component={Link}
          href="/"
        >
          <Typography
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: '14px', sm: '15px' },
            }}
          >
            ← Back to Home
          </Typography>
        </Button>
      </Box>
      
      {/* Page Title */}
      <Paper
        elevation={4}
        sx={{
          background: 'linear-gradient(135deg, #f8faff 0%, #e9f1ff 100%)',
          borderRadius: { xs: '16px', md: '24px' },
          padding: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          position: 'relative',
          maxWidth: '1400px',
          mx: 'auto',
          mb: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(0, 116, 228, 0.08) 0%, rgba(0, 116, 228, 0) 70%)',
            zIndex: 0,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              fontWeight: 800,
              letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg, #1a2c50, #0074e4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Coin Comparison
          </Typography>
          <Typography variant="body1" sx={{ color: '#58667e', maxWidth: '800px' }}>
            Compare the performance of two cryptocurrencies side by side. Select the coins you want to compare and analyze their price movements, market capitalization, and trading volume over different time periods.
          </Typography>
        </Box>
      </Paper>
      
      {/* Coin Selection */}
      <Paper
        elevation={2}
        sx={{
          background: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          maxWidth: '1400px',
          mx: 'auto',
          mb: 4,
          border: '1px solid rgba(210, 225, 245, 0.5)',
        }}
      >
        <Box
          sx={{
            borderBottom: '1px solid rgba(210, 225, 245, 0.5)',
            p: { xs: 2, sm: 3 }
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2c50' }}>
            Select Coins to Compare
          </Typography>
        </Box>
        
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {false ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#0074e4' }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="coin1-select-label">First Coin</InputLabel>
<Select
  labelId="coin1-select-label"
  id="coin1-select"
  value={selectedCoin1.slug}
  onChange={handleCoin1Change}
  label="First Coin"
  sx={{
    borderRadius: '10px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 116, 228, 0.3)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 116, 228, 0.5)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#0074e4',
    }
  }}
>
  {AVAILABLE_COINS.map((coin) => (
    <MenuItem key={coin.slug} value={coin.slug}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar 
          sx={{ 
            width: 28, 
            height: 28, 
            bgcolor: 'rgba(0, 116, 228, 0.1)', 
            color: '#0074e4',
            mr: 1,
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          {coin.symbol.slice(0, 3)}
        </Avatar>
        <Typography>
          {coin.name} ({coin.symbol})
        </Typography>
      </Box>
    </MenuItem>
  ))}
</Select>
                </FormControl>
                
                {isLoadingCoin1 && selectedCoin1 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <CircularProgress size={20} sx={{ color: '#0074e4', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#58667e' }}>
                      Loading coin data...
                    </Typography>
                  </Box>
                )}
                
                {coin1Data && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0, 116, 228, 0.05)', borderRadius: '10px' }}>
                    <Typography variant="h6" sx={{ color: '#0074e4', fontWeight: 600, mb: 1 }}>
                      {coin1Data.name} ({coin1Data.symbol})
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1a2c50', mb: 0.5 }}>
                      Price: ${coin1Data.price ? coin1Data.price.toLocaleString(undefined, { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }):'0.00'}
                      {coin1Data.price_change_24h && (
                        <span style={{ color: getPriceChangeClass(coin1Data.price_change_24h), marginLeft: '8px' }}>
                          ({coin1Data.price_change_24h > 0 ? '+' : ''}{coin1Data.price_change_24h.toFixed(2)}%)
                        </span>
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#58667e' }}>
                      Market Cap: ${(coin1Data.market_cap / 1e9).toFixed(2)}B
                    </Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 116, 228, 0.1)',
                  color: '#0074e4',
                  fontWeight: 700,
                  fontSize: '20px'
                }}>
                  VS
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <FormControl fullWidth variant="outlined">
<Select
  labelId="coin2-select-label"
  id="coin2-select"
  value={selectedCoin2.slug}
  onChange={handleCoin2Change}
  label="Second Coin"
  sx={{
    borderRadius: '10px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(123, 97, 255, 0.3)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(123, 97, 255, 0.5)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#7b61ff',
    }
  }}
>
  {AVAILABLE_COINS.map((coin) => (
    <MenuItem key={coin.slug} value={coin.slug}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar 
          sx={{ 
            width: 28, 
            height: 28, 
            bgcolor: 'rgba(123, 97, 255, 0.1)', 
            color: '#7b61ff',
            mr: 1,
            fontSize: '0.75rem',
            fontWeight: 600
          }}
        >
          {coin.symbol.slice(0, 3)}
        </Avatar>
        <Typography>
          {coin.name} ({coin.symbol})
        </Typography>
      </Box>
    </MenuItem>
  ))}
</Select>
                </FormControl>
                
                {isLoadingCoin2 && selectedCoin2 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <CircularProgress size={20} sx={{ color: '#7b61ff', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: '#58667e' }}>
                      Loading coin data...
                    </Typography>
                  </Box>
                )}
                
                {coin2Data && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(123, 97, 255, 0.05)', borderRadius: '10px' }}>
                    <Typography variant="h6" sx={{ color: '#7b61ff', fontWeight: 600, mb: 1 }}>
                      {coin2Data.name} ({coin2Data.symbol})
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1a2c50', mb: 0.5 }}>
                      Price: ${coin2Data.price? coin2Data.price.toLocaleString(undefined, { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }) : '0.00'}
                      {coin2Data.price_change_24h && (
                        <span style={{ color: getPriceChangeClass(coin2Data.price_change_24h), marginLeft: '8px' }}>
                          ({coin2Data.price_change_24h > 0 ? '+' : ''}{coin2Data.price_change_24h.toFixed(2)}%)
                        </span>
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#58667e' }}>
                      Market Cap: ${(coin2Data.market_cap / 1e9).toFixed(2)}B
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
      
      {/* Comparison Options */}
      {coin1Data && coin2Data && (
        <Paper
          elevation={2}
          sx={{
            background: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            maxWidth: '1400px',
            mx: 'auto',
            mb: 4,
            border: '1px solid rgba(210, 225, 245, 0.5)',
          }}
        >
          <Box
            sx={{
              borderBottom: '1px solid rgba(210, 225, 245, 0.5)',
              p: { xs: 2, sm: 3 }
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2c50' }}>
              Comparison Options
            </Typography>
          </Box>
          
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="compare-by-label">Compare By</InputLabel>
                  <Select
                    labelId="compare-by-label"
                    id="compare-by-select"
                    value={compareBy}
                    onChange={handleCompareByChange}
                    label="Compare By"
                    sx={{
                      borderRadius: '10px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 116, 228, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 116, 228, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0074e4',
                      }
                    }}
                  >
                    <MenuItem value="price">Price</MenuItem>
                    <MenuItem value="market_cap">Market Cap</MenuItem>
                    <MenuItem value="volume">Trading Volume</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: { xs: 'flex-start', md: 'center' } 
                }}>
                  <Typography variant="body1" sx={{ color: '#58667e', mr: 2 }}>
                    Display Mode:
                  </Typography>
                  <ToggleButtonGroup
                    value={percentageMode}
                    exclusive
                    onChange={handleDisplayModeChange}
                    sx={{ 
                      '& .MuiToggleButton-root': {
                        px: 2,
                        py: 0.5,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: 'rgba(0, 116, 228, 0.3)',
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(0, 116, 228, 0.1)',
                          color: '#0074e4',
                          borderColor: '#0074e4',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 116, 228, 0.15)',
                          }
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(0, 116, 228, 0.05)',
                        }
                      }
                    }}
                  >
                    <ToggleButton value={true}>
                      Percentage
                    </ToggleButton>
                    <ToggleButton value={false}>
                      Absolute
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: '10px',
                      px: 2,
                      py: 1,
                      borderColor: 'rgba(0, 116, 228, 0.3)',
                      color: '#58667e',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#0074e4',
                        backgroundColor: 'rgba(0, 116, 228, 0.05)',
                      }
                    }}
                    component={Link}
                    href={`/coin/${selectedCoin1}`}
                  >
                    {coin1Data.symbol} Details
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: '10px',
                      px: 2,
                      py: 1,
                      borderColor: 'rgba(123, 97, 255, 0.3)',
                      color: '#58667e',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#7b61ff',
                        backgroundColor: 'rgba(123, 97, 255, 0.05)',
                      }
                    }}
                    component={Link}
                    href={`/coin/${selectedCoin2}`}
                  >
                    {coin2Data.symbol} Details
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
      
      {/* Comparison Chart */}
      {coin1Data && coin2Data && (
        <Paper
          elevation={2}
          sx={{
            background: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            maxWidth: '1400px',
            mx: 'auto',
            mb: 4,
            border: '1px solid rgba(210, 225, 245, 0.5)',
          }}
        >
          <Box
            sx={{
              borderBottom: '1px solid rgba(210, 225, 245, 0.5)',
              p: { xs: 2, sm: 3 },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2c50' }}>
              {compareBy === 'price' 
                ? 'Price Comparison' 
                : compareBy === 'market_cap' 
                  ? 'Market Cap Comparison' 
                  : 'Volume Comparison'}
            </Typography>
            
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: '#0074e4', 
                  mr: 1 
                }} />
                <Typography variant="body2" sx={{ color: '#58667e', fontWeight: 500 }}>
                  {coin1Data.symbol}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: '#7b61ff', 
                  mr: 1 
                }} />
                <Typography variant="body2" sx={{ color: '#58667e', fontWeight: 500 }}>
                  {coin2Data.symbol}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              bgcolor: '#f8faff', 
              borderRadius: '12px', 
              p: { xs: 1, sm: 2 }, 
              mb: 3 
            }}>
              <ComparisonChart 
                coin1={{
                  id: coin1Data.coin_id,
                  slug: selectedCoin1.slug || '',
                  symbol: coin1Data.symbol,
                  color: '#0074e4'
                }}
                coin2={{
                  id: coin2Data.coin_id,
                  slug: selectedCoin2.slug || '',
                  symbol: coin2Data.symbol,
                  color: '#7b61ff'
                }}
                timeFrame={timeFrame}
                compareBy={compareBy}
                percentageMode={percentageMode}
                height={500}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1.5 }}>
              {(['24h', '7d', '30d', '90d', '1y', 'all'] as const).map((tf) => (
                <Button
                  key={tf}
                  onClick={() => handleTimeFrameChange(tf)}
                  variant={timeFrame === tf ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: '10px',
                    minWidth: { xs: '60px', sm: '80px' },
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.5, sm: 0.75 },
                    ...(timeFrame === tf ? {
                      background: 'linear-gradient(90deg, #0074e4, #005bb7)',
                      boxShadow: '0 4px 10px rgba(0, 116, 228, 0.2)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #005bb7, #004a94)',
                      }
                    } : {
                      color: '#58667e',
                      borderColor: 'rgba(88, 102, 126, 0.3)',
                      '&:hover': {
                        borderColor: '#58667e',
                        backgroundColor: 'rgba(88, 102, 126, 0.05)'
                      }
                    })
                  }}
                >
                  <Typography sx={{ 
                    textTransform: 'none', 
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    {tf === 'all' ? 'ALL' : tf.toUpperCase()}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Box>
        </Paper>
      )}
      
      {/* Comparison Summary */}
      {coin1Data && coin2Data && renderComparisonSummary()}
      
      {/* Performance Comparison */}
      {coin1Data && coin2Data && renderPerformanceComparison()}
      
      {/* Footer */}
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          maxWidth: '1400px',
          mx: 'auto',
        }}
      >
        <Typography variant="body2" sx={{ color: '#58667e', mb: 1 }}>
          © {new Date().getFullYear()} Crypto Coin Control. All rights reserved.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
          <Link href="/" style={{ color: '#0074e4', textDecoration: 'none' }}>Home</Link>
          <Link href="/about" style={{ color: '#0074e4', textDecoration: 'none' }}>About</Link>
          <Link href="/login" style={{ color: '#0074e4', textDecoration: 'none' }}>Login</Link>
        </Box>
      </Box>
    </Container>
  );
}