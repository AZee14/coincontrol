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
Paper,
Skeleton,
Fade,
useTheme,
useMediaQuery,
Chip
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
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
const isTablet = useMediaQuery(theme.breakpoints.down('md'));
const [selectedTab, setSelectedTab] = useState(0);
const [topCoins, setTopCoins] = useState<TopCoin[]>([]);
const [featuredCoin, setFeaturedCoin] = useState<TopCoin | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [chartLoaded, setChartLoaded] = useState(false);
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
    const bitcoin = data.find((coin: TopCoin) => coin.symbol === 'BTC') || data[0];
    setFeaturedCoin(bitcoin);
    
    // Simulate chart loading
    setTimeout(() => setChartLoaded(true), 800);
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
<Fade in={selectedTab === 2} timeout={500}>
<div className="w-full mt-6">
<section className="mb-12">
{isLoading ? (
<Paper elevation={3} className="w-full overflow-hidden rounded-xl">
<Box p={4}>
<Skeleton variant="text" width="40%" height={40} />
<Box mt={2} mb={4}>
<Skeleton variant="rectangular" width="100%" height={400} />
</Box>
<Box display="grid" gridTemplateColumns={{xs: '1fr', md: 'repeat(3, 1fr)'}} gap={3}>
{[...Array(3)].map((_, i) => (
<Box key={i}>
<Skeleton variant="text" width="60%" height={28} />
<Skeleton variant="text" width="80%" height={40} />
</Box>
))}
</Box>
</Box>
</Paper>
) : featuredCoin ? (
<Paper
elevation={3}
className="overflow-hidden rounded-xl transition-all duration-300 hover"
sx={{
background: 'linear-gradient(145deg, #ffffff, #f0f7ff)',
border: '1px solid rgba(210, 225, 245, 0.5)',
position: 'relative',
}}
>
<Box p={isMobile ? 2 : 4}>
<Box
display="flex"
flexDirection={isTablet ? "column" : "row"}
justifyContent="space-between"
alignItems={isTablet ? "flex-start" : "center"}
mb={3}
>
<Box display="flex" alignItems="center" mb={isTablet ? 2 : 0}>
<Typography variant="h4" fontWeight="700" sx={{
background: 'linear-gradient(90deg, #1a2c50, #0074e4)',
backgroundClip: 'text',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent',
mr: 2
}}>
{featuredCoin.name}
</Typography>
<Chip
label={featuredCoin.symbol}
size="small"
sx={{
fontWeight: 600,
backgroundColor: 'rgba(0, 116, 228, 0.1)',
color: '#0074e4',
}}
/>
</Box>
<Button
component={Link}
href={`/coin/${featuredCoin.coin_id}`}
variant="outlined"
size="small"
sx={{
borderRadius: '8px',
borderColor: '#0074e4',
color: '#0074e4',
'&': {
borderColor: '#005bb7',
backgroundColor: 'rgba(0, 116, 228, 0.04)',
}
}}
>
View Detailed Analysis
</Button>
</Box>
            {/* CHART CONTAINER - MODIFIED FOR SPACING */}
            <Box 
              className="relative" 
              height={450} // Increased height to accommodate the stats below
              mb={10} // Added more bottom margin to prevent overlap
              sx={{
                opacity: chartLoaded ? 1 : 0.4,
                transition: 'opacity 0.5s ease-in-out',
              }}
            >
              <CoinChart 
                coinId={featuredCoin.coin_id} 
                coinSymbol={featuredCoin.symbol}
                timeFrame="7d"
                height={350} // Reduced chart height to leave room for stats
                showMarketCap={true}
                showVolume={true}
              />

              {!chartLoaded && (
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  sx={{
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                  }}
                >
                  <Typography variant="body1" fontWeight={500} color="text.secondary">
                    Loading chart data...
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* STATS CARDS - POSITIONED BELOW THE CHART WITH ABSOLUTE POSITIONING */}
            <Box 
              display="grid" 
              gridTemplateColumns={{xs: '1fr', sm: 'repeat(3, 1fr)'}} 
              gap={3}
              sx={{
                position: 'relative',
                mt: -8, // Pull up to reduce excessive spacing
                zIndex: 5, // Ensure it's above the chart
                '& > div': {
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                  }
                }
              }}
            >
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'linear-gradient(145deg, #ffffff, #f5f9ff)'
                }}
              >
                <Typography color="text.secondary" variant="subtitle2" fontWeight={500} gutterBottom>
                  Current Price
                </Typography>
                <Typography variant="h5" fontWeight={700} color="#1a2c50">
                  ${featuredCoin.price.toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Typography>
              </Paper>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'linear-gradient(145deg, #ffffff, #f5f9ff)'
                }}
              >
                <Typography color="text.secondary" variant="subtitle2" fontWeight={500} gutterBottom>
                  Market Cap
                </Typography>
                <Typography variant="h5" fontWeight={700} color="#1a2c50">
                  ${(featuredCoin.market_cap / 1e9).toFixed(2)}B
                </Typography>
              </Paper>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  background: 'linear-gradient(145deg, #ffffff, #f5f9ff)'
                }}
              >
                <Typography color="text.secondary" variant="subtitle2" fontWeight={500} gutterBottom>
                  24h Volume
                </Typography>
                <Typography variant="h5" fontWeight={700} color="#1a2c50">
                  ${(featuredCoin.volume_24h / 1e9).toFixed(2)}B
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            backgroundColor: '#fff1f0',
            border: '1px solid #ffccc7'
          }}
        >
          <Typography color="error">Failed to load featured coin data.</Typography>
        </Paper>
      )}
    </section>

    <section>
      <Box 
        display="flex" 
        flexDirection={isMobile ? "column" : "row"} 
        justifyContent="space-between" 
        alignItems={isMobile ? "flex-start" : "center"} 
        mb={3}
      >
        <Typography 
          variant="h5" 
          fontWeight={700} 
          mb={isMobile ? 1 : 0}
          sx={{ 
            color: '#1a2c50',
          }}
        >
          Top Cryptocurrencies
        </Typography>
        <Button
          component={Link}
          href="/coins"
          endIcon={<span>→</span>}
          sx={{
            color: '#0074e4',
            '&:hover': {
              backgroundColor: 'rgba(0, 116, 228, 0.04)',
            }
          }}
        >
          View All Markets
        </Button>
      </Box>
      
      {isLoading ? (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box p={2}>
            <Skeleton variant="rectangular" height={40} />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={60} sx={{ mt: 1 }} />
            ))}
          </Box>
        </Paper>
      ) : (
        // Enhanced table section for LandingPage.tsx
// Replace the existing table section with this code

// Enhanced table section for LandingPage.tsx
// Replace the existing table section with this code

<Paper 
  elevation={2} 
  sx={{ 
    borderRadius: 2, 
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
    }
  }}
>
  <Box sx={{ overflowX: 'auto' }}>
    <table className="min-w-full" style={{ tableLayout: 'fixed' }}>
      <colgroup>
        <col style={{ width: '8%' }} />
        <col style={{ width: '25%' }} />
        <col style={{ width: '17%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '17%' }} />
        <col style={{ width: '18%' }} />
      </colgroup>
      <thead>
        <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">#</th>
          <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">Name</th>
          <th className="py-4 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">Price</th>
          <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">24h %</th>
          <th className="py-4 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">Market Cap</th>
          <th className="py-4 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">Volume (24h)</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {topCoins.map((coin, index) => (
          <tr 
            key={coin._id} 
            className="transition-colors hover:bg-blue-50"
            style={{
              backgroundColor: index % 2 === 0 ? 'rgba(0, 116, 228, 0.02)' : 'transparent'
            }}
          >
            <td className="py-4 px-6 text-center">
              <Box component="span" sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: index < 3 ? 'rgba(0, 116, 228, 0.1)' : 'transparent',
                color: index < 3 ? '#0074e4' : 'inherit',
                fontWeight: index < 3 ? 700 : 500,
                margin: '0 auto'
              }}>
                {index + 1}
              </Box>
            </td>
            <td className="py-4 px-6">
              <Link 
                href={`/coin/${coin.coin_id}`}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  '&:hover': { opacity: 0.85 }
                }}>
                  <Box 
                    component="div" 
                    sx={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 116, 228, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0074e4',
                      fontWeight: 700,
                      fontSize: '14px',
                      mr: 2
                    }}
                  >
                    {coin.symbol.charAt(0)}
                  </Box>
                  <Box>
                    <Typography 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1a2c50',
                        fontSize: '15px'
                      }}
                    >
                      {coin.name}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '12px', 
                        color: '#58667e',
                        fontWeight: 500
                      }}
                    >
                      {coin.symbol}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </td>
            <td className="py-4 px-6 text-right">
              <Typography sx={{ 
                fontWeight: 600, 
                color: '#1a2c50',
                fontSize: '15px'
              }}>
                ${coin.price.toLocaleString(undefined, { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Typography>
            </td>
            <td className="py-4 px-6 text-center">
              {coin.price_change_24h ? (
                <Box 
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: coin.price_change_24h > 0 ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                    color: coin.price_change_24h > 0 ? '#16a34a' : '#dc2626',
                    fontWeight: 600,
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '14px',
                    margin: '0 auto',
                    width: 'fit-content'
                  }}
                >
                  <Box 
                    component="span" 
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      '&::before': {
                        content: '""',
                        display: 'inline-block',
                        width: '0',
                        height: '0',
                        marginRight: '4px',
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderBottom: coin.price_change_24h > 0 ? '6px solid #16a34a' : 'none',
                        borderTop: coin.price_change_24h <= 0 ? '6px solid #dc2626' : 'none',
                      }
                    }}
                  >
                    {coin.price_change_24h > 0 ? '+' : ''}{coin.price_change_24h.toFixed(2)}%
                  </Box>
                </Box>
              ) : (
                <Typography sx={{ color: '#58667e', fontWeight: 500, textAlign: 'center' }}>N/A</Typography>
              )}
            </td>
            <td className="py-4 px-6 text-right">
              <Typography sx={{ 
                fontWeight: 600, 
                color: '#1a2c50',
                fontSize: '15px'
              }}>
                ${(coin.market_cap / 1e9).toFixed(2)}B
              </Typography>
            </td>
            <td className="py-4 px-6 text-right">
              <Typography sx={{ 
                fontWeight: 600, 
                color: '#1a2c50',
                fontSize: '15px'
              }}>
                ${(coin.volume_24h / 1e9).toFixed(2)}B
              </Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Box>
</Paper>
      )}
    </section>
  </div>
</Fade>
);
return (
<Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 4 } }}>
<Paper
elevation={4}
sx={{
background: 'linear-gradient(135deg, #f8faff 0%, #e9f1ff 100%)',
borderRadius: { xs: '16px', md: '24px' },
padding: { xs: '1.5rem', sm: '2rem', md: '3rem' },
boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
overflow: 'hidden',
position: 'relative',
maxWidth: '1400px',
mx: 'auto',
mb: 6,
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
<Box
sx={{
display: "flex",
flexDirection: "column",
gap: 3,
alignItems: "center",
textAlign: "center",
mb: 6
}}
>
<Typography
variant="h2"
sx={{
fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
fontWeight: 800,
letterSpacing: '-0.5px',
background: 'linear-gradient(90deg, #1a2c50, #0074e4)',
backgroundClip: 'text',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent',
mb: 1
}}
>
Crypto Coin Control
</Typography>
<Typography
variant="h5"
sx={{
color: '#58667e',
fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
fontWeight: 400,
maxWidth: '700px',
lineHeight: 1.5,
mb: 2
}}
>
Track cryptocurrency prices, manage your portfolio, and stay ahead
of market trends with our professional analytics platform.
</Typography>
<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
<Button
variant="contained"
sx={{
borderRadius: "10px",
minWidth: { xs: '140px', sm: '180px' },
height: { xs: '48px', sm: '56px' },
px: { xs: 3, sm: 4 },
background: 'linear-gradient(90deg, #0074e4, #005bb7)',
boxShadow: '0 4px 14px rgba(0, 116, 228, 0.4)',
transition: 'all 0.2s ease-in-out',
'&': {
background: 'linear-gradient(90deg, #005bb7, #004a94)',
transform: 'translateY(-2px)',
boxShadow: '0 6px 20px rgba(0, 116, 228, 0.5)',
},
}}
component={Link}
href="/login"
>
<Typography
sx={{
textTransform: "none",
fontWeight: 600,
fontSize: { xs: '15px', sm: '16px' },
}}
>
Get Started
</Typography>
</Button>
<Button
variant="outlined"
sx={{
borderRadius: "10px",
minWidth: { xs: '140px', sm: '180px' },
height: { xs: '48px', sm: '56px' },
px: { xs: 3, sm: 4 },
borderColor: '#0074e4',
color: '#0074e4',
transition: 'all 0.2s ease-in-out',
'&': {
borderColor: '#005bb7',
backgroundColor: 'rgba(0, 116, 228, 0.04)',
transform: 'translateY(-2px)',
},
}}
component={Link}
href="/about"
>
<Typography
sx={{
textTransform: "none",
fontWeight: 600,
fontSize: { xs: '15px', sm: '16px' },
}}
>
Learn More
</Typography>
</Button>
</Box>
</Box>
      <Divider 
        sx={{ 
          my: 4,
          '&::before, &::after': {
            borderColor: 'rgba(0, 116, 228, 0.2)',
          }
        }}
      />
      
      <Box sx={{ mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: '#58667e',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              textTransform: 'none',
              transition: 'all 0.2s ease',
              minHeight: '56px',
              '&:hover': {
                color: '#0074e4',
                backgroundColor: 'rgba(0, 116, 228, 0.04)',
              }
            },
            '& .Mui-selected': {
              color: '#0074e4 !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#0074e4',
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab} />
          ))}
        </Tabs>
      </Box>
      
      <Box sx={{ mt: 3, minHeight: '400px' }}>
        {selectedTab === 0 && (
          <Fade in={selectedTab === 0} timeout={500}>
            <div><Assets /></div>
          </Fade>
        )}
        
        {selectedTab === 1 && (
          <Fade in={selectedTab === 1} timeout={500}>
            <div><Transactions data={[]} /></div>
          </Fade>
        )}
        
        {selectedTab === 2 && renderMarketContent()}
        
        {(selectedTab === 0 || selectedTab === 1) && (
          <Fade in={selectedTab === 0 || selectedTab === 1} timeout={500}>
            <Paper
              elevation={1}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 4,
                padding: "2rem",
                background: 'linear-gradient(145deg, #ffffff, #f5f9ff)',
                borderRadius: "12px",
                border: '1px solid rgba(210, 225, 245, 0.5)',
                textAlign: 'center',
                gap: 2
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#1a2c50',
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Sign in to view your personal dashboard
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#58667e',
                  mb: 2,
                  maxWidth: '500px'
                }}
              >
                Create an account to track your portfolio, set price alerts, and access personalized analytics.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                href="/login"
                sx={{
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  background: 'linear-gradient(90deg, #0074e4, #005bb7)',
                  boxShadow: '0 4px 10px rgba(0, 116, 228, 0.3)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #005bb7, #004a94)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign In Now
                </Typography>
              </Button>
            </Paper>
          </Fade>
        )}
      </Box>
    </Box>
  </Paper>
</Container>
);
}