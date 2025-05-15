// src/app/coin/[id]/page.tsx
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
  Divider,
  Fade,
  CircularProgress
} from "@mui/material";
import CoinChart from '@/components/CoinChart';
import Link from 'next/link';

// Icons (using simple emoji avatars for consistency with About page)
const MarketCapIcon = () => (
  <Avatar sx={{ bgcolor: 'rgba(0, 116, 228, 0.1)', color: '#0074e4', width: 48, height: 48 }}>
    <span style={{ fontSize: '20px' }}>📊</span>
  </Avatar>
);

const VolumeIcon = () => (
  <Avatar sx={{ bgcolor: 'rgba(0, 116, 228, 0.1)', color: '#0074e4', width: 48, height: 48 }}>
    <span style={{ fontSize: '20px' }}>📈</span>
  </Avatar>
);

const PriceChangeIcon = () => (
  <Avatar sx={{ bgcolor: 'rgba(0, 116, 228, 0.1)', color: '#0074e4', width: 48, height: 48 }}>
    <span style={{ fontSize: '20px' }}>💹</span>
  </Avatar>
);

const InfoIcon = () => (
  <Avatar sx={{ bgcolor: 'rgba(0, 116, 228, 0.1)', color: '#0074e4', width: 48, height: 48 }}>
    <span style={{ fontSize: '20px' }}>ℹ️</span>
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

interface CoinPageProps {
  params: {
    id: string;
  };
}

export default function CoinPage({ params }: CoinPageProps) {
  const { id } = params;
  
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
        const response = await fetch(`/api/coins/${id}/index`);
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

  const getPriceChangeClass = (change?: number) => {
    if (!change) return '#58667e';
    return change > 0 ? '#16c784' : '#ea3943';
  };

  if (isLoading) {
    return (
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 4 }, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#0074e4', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#58667e', fontWeight: 500 }}>
            Loading coin data...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!coinData) {
    return (
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
        <Paper 
          elevation={2}
          sx={{
            background: 'rgba(234, 57, 67, 0.05)',
            borderRadius: '16px',
            padding: { xs: '1.5rem', sm: '2rem' },
            maxWidth: '1400px',
            mx: 'auto',
            mb: 6,
            border: '1px solid rgba(234, 57, 67, 0.2)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#ea3943',
              mb: 1,
              textAlign: 'center'
            }}
          >
            Unable to Load Data
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#58667e',
              textAlign: 'center'
            }}
          >
            Failed to load coin data. Please try again later.
          </Typography>
        </Paper>
      </Container>
    );
  }

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
      
      {/* Hero Section */}
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
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'rgba(0, 116, 228, 0.1)', 
                    color: '#0074e4', 
                    width: 64, 
                    height: 64,
                    mr: 2,
                    boxShadow: '0 4px 14px rgba(0, 116, 228, 0.15)'
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
                    {coinData.symbol.slice(0, 3)}
                  </Typography>
                </Avatar>
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
                  }}
                >
                  {coinData.name} <span style={{ fontWeight: 400, opacity: 0.7 }}>({coinData.symbol})</span>
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#1a2c50',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                ${coinData.price.toLocaleString(undefined, { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
                {coinData.price_change_24h && (
                  <Typography
                    variant="body1"
                    sx={{
                      ml: 2,
                      color: getPriceChangeClass(coinData.price_change_24h),
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {coinData.price_change_24h > 0 ? '↑' : '↓'} 
                    {Math.abs(coinData.price_change_24h).toFixed(2)}%
                  </Typography>
                )}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#58667e', mb: 3 }}
              >
                Last updated: {new Date(coinData.timestamp).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Fade in={true} timeout={800}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    justifyContent: { xs: 'flex-start', md: 'flex-end' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ color: '#58667e', fontWeight: 500, mb: 0.5 }}>
                      Market Cap
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#1a2c50', fontWeight: 700 }}>
                      ${(coinData.market_cap / 1e9).toFixed(2)}B
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#58667e', fontWeight: 500, mb: 0.5 }}>
                      24h Volume
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#1a2c50', fontWeight: 700 }}>
                      ${(coinData.volume_24h / 1e9).toFixed(2)}B
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#58667e', fontWeight: 500, mb: 0.5 }}>
                      Circulating Supply
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#1a2c50', fontWeight: 700 }}>
                      {(coinData.circulating_supply / 1e6).toFixed(2)}M
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Chart Card */}
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
            Price Chart
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                px: 2, 
                py: 1, 
                borderRadius: '8px',
                bgcolor: 'rgba(0, 116, 228, 0.05)', 
                border: '1px solid rgba(0, 116, 228, 0.1)'
              }}
            >
              <input
                type="checkbox"
                id="showMarketCap"
                checked={showMarketCap}
                onChange={() => setShowMarketCap(!showMarketCap)}
                style={{ 
                  accentColor: '#0074e4', 
                  width: '16px', 
                  height: '16px' 
                }}
              />
              <Typography component="label" htmlFor="showMarketCap" 
                sx={{ 
                  ml: 1, 
                  color: '#58667e', 
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Show Market Cap
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                px: 2, 
                py: 1, 
                borderRadius: '8px',
                bgcolor: 'rgba(0, 116, 228, 0.05)', 
                border: '1px solid rgba(0, 116, 228, 0.1)'
              }}
            >
              <input
                type="checkbox"
                id="showVolume"
                checked={showVolume}
                onChange={() => setShowVolume(!showVolume)}
                style={{ 
                  accentColor: '#0074e4', 
                  width: '16px', 
                  height: '16px' 
                }}
              />
              <Typography component="label" htmlFor="showVolume" 
                sx={{ 
                  ml: 1, 
                  color: '#58667e', 
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Show Volume
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
            <CoinChart 
              coinId={coinData.coin_id}
              coinSlug={id}
              coinSymbol={coinData.symbol}
              timeFrame={timeFrame}
              showMarketCap={showMarketCap}
              showVolume={showVolume}
              height={500}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            {(['24h', '7d', '30d', '90d', '1y', 'all'] as const).map((tf) => (
              <Button
                key={tf}
                onClick={() => setTimeFrame(tf)}
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
      
      {/* Stats Section */}
      <Grid container spacing={4} sx={{ maxWidth: '1400px', mx: 'auto', mb: 4 }}>
        {/* Market Stats */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={600}>
            <Paper
              elevation={2}
              sx={{
                background: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '100%',
                border: '1px solid rgba(210, 225, 245, 0.5)',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                borderBottom: '1px solid rgba(210, 225, 245, 0.5)',
                p: { xs: 2, sm: 3 },
                gap: 2
              }}>
                <MarketCapIcon />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2c50' }}>
                  Market Stats
                </Typography>
              </Box>
              
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  py: 2,
                  borderBottom: '1px solid rgba(210, 225, 245, 0.5)'
                }}>
                  <Typography sx={{ color: '#58667e', fontWeight: 500 }}>Market Cap</Typography>
                  <Typography sx={{ color: '#1a2c50', fontWeight: 700 }}>
                    ${(coinData.market_cap / 1e9).toFixed(2)}B
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  py: 2,
                  borderBottom: '1px solid rgba(210, 225, 245, 0.5)'
                }}>
                  <Typography sx={{ color: '#58667e', fontWeight: 500 }}>24h Trading Volume</Typography>
                  <Typography sx={{ color: '#1a2c50', fontWeight: 700 }}>
                    ${(coinData.volume_24h / 1e9).toFixed(2)}B
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  py: 2,
                  borderBottom: '1px solid rgba(210, 225, 245, 0.5)'
                }}>
                  <Typography sx={{ color: '#58667e', fontWeight: 500 }}>Circulating Supply</Typography>
                  <Typography sx={{ color: '#1a2c50', fontWeight: 700 }}>
                    {coinData.circulating_supply.toLocaleString()} {coinData.symbol}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  py: 2
                }}>
                  <Typography sx={{ color: '#58667e', fontWeight: 500 }}>Total Supply</Typography>
                  <Typography sx={{ color: '#1a2c50', fontWeight: 700 }}>
                    {coinData.total_supply.toLocaleString()} {coinData.symbol}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Grid>
        
        {/* Price Change */}
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={800}>
            <Paper
              elevation={2}
              sx={{
                background: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '100%',
                border: '1px solid rgba(210, 225, 245, 0.5)',
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
                  Price Change
                </Typography>
              </Box>
              
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  py: 2,
                  borderBottom: '1px solid rgba(210, 225, 245, 0.5)'
                }}>
                  <Typography sx={{ color: '#58667e', fontWeight: 500 }}>24h Change</Typography>
                  <Typography sx={{ 
                    fontWeight: 700,
                    color: getPriceChangeClass(coinData.price_change_24h)
                  }}>
                    {coinData.price_change_24h 
                      ? `${coinData.price_change_24h > 0 ? '+' : ''}${coinData.price_change_24h.toFixed(2)}%` 
                      : 'N/A'
                    }
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  py: 2,
                  borderBottom: '1px solid rgba(210, 225, 245, 0.5)'
                }}>
                  <Typography sx={{ color: '#58667e', fontWeight: 500 }}>7d Change</Typography>
                  <Typography sx={{ 
                    fontWeight: 700,
                    color: getPriceChangeClass(coinData.price_change_7d)
                  }}>
                    {coinData.price_change_7d 
                      ? `${coinData.price_change_7d > 0 ? '+' : ''}${coinData.price_change_7d.toFixed(2)}%` 
                      : 'N/A'
                    }
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  py: 2
                }}>
                  <Typography sx={{ color: '#58667e', fontWeight: 500 }}>30d Change</Typography>
                  <Typography sx={{ 
                    fontWeight: 700,
                    color: getPriceChangeClass(coinData.price_change_30d)
                  }}>
                    {coinData.price_change_30d 
                      ? `${coinData.price_change_30d > 0 ? '+' : ''}${coinData.price_change_30d.toFixed(2)}%` 
                      : 'N/A'
                    }
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
      
      {/* About Section */}
      <Paper
        elevation={2}
        sx={{
          background: 'linear-gradient(145deg, #ffffff, #f5f9ff)',
          borderRadius: '16px',
          overflow: 'hidden',
          maxWidth: '1400px',
          mx: 'auto',
          mb: 6,
          border: '1px solid rgba(210, 225, 245, 0.5)',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          borderBottom: '1px solid rgba(210, 225, 245, 0.5)',
          p: { xs: 2, sm: 3 },
          gap: 2
        }}>
          <InfoIcon />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2c50' }}>
            About {coinData.name}
          </Typography>
        </Box>
        
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="body1"
            sx={{
              color: '#58667e',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              mb: 2
            }}
          >
            {coinData.name} ({coinData.symbol}) is a cryptocurrency with a current price of ${coinData.price.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}. It has a market capitalization of ${(coinData.market_cap / 1e9).toFixed(2)} billion and a 24-hour trading volume of ${(coinData.volume_24h / 1e9).toFixed(2)} billion.
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: '#58667e',
              fontSize: '1.05rem',
              lineHeight: 1.8
            }}
          >
            With a circulating supply of {coinData.circulating_supply.toLocaleString()} {coinData.symbol} and a total supply of {coinData.total_supply.toLocaleString()} {coinData.symbol}, it ranks among the world&#39;s leading cryptocurrencies.
          </Typography>
        </Box>
      </Paper>
      
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