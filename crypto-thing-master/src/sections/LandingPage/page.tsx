"use client";
import React, { useEffect, useState } from "react";
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
  Chip,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import Link from "next/link";
import CoinChart from "@/components/CoinChart";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedTab, setSelectedTab] = useState(0);
  const [topCoins, setTopCoins] = useState<TopCoin[]>([]);
  const [featuredCoin, setFeaturedCoin] = useState<TopCoin | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<TopCoin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartLoaded, setChartLoaded] = useState(false);

  const tabs = ["Assets", "Transactions"];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleCoinChange = (event: SelectChangeEvent<string>) => {
    const coinId = event.target.value;
    const coin = topCoins.find((c) => c.coin_id.toString() === coinId);
    if (coin) {
      setSelectedCoin(coin);
      setChartLoaded(false);
      setTimeout(() => setChartLoaded(true), 800);
    }
  };

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const response = await fetch("/api/coins/top");
        if (!response.ok) {
          throw new Error("Failed to fetch top coins");
        }
        const data = await response.json();
        setTopCoins(data);

        // Set Bitcoin as the featured coin (or the first coin in the list)
        const bitcoin =
          data.find((coin: TopCoin) => coin.symbol === "BTC") || data[0];
        setFeaturedCoin(bitcoin);
        setSelectedCoin(bitcoin);

        // Simulate chart loading
        setTimeout(() => setChartLoaded(true), 800);
      } catch (error) {
        console.error("Error fetching top coins:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopCoins();
  }, []);

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 4 } }}>
      <Paper
        elevation={4}
        sx={{
          background: "linear-gradient(135deg, #f8faff 0%, #e9f1ff 100%)",
          borderRadius: { xs: "16px", md: "24px" },
          padding: { xs: "1.5rem", sm: "2rem", md: "3rem" },
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          position: "relative",
          maxWidth: "1400px",
          mx: "auto",
          mb: 6,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            background:
              "radial-gradient(circle at top right, rgba(0, 116, 228, 0.08) 0%, rgba(0, 116, 228, 0) 70%)",
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
              textAlign: "center",
              mb: 6,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" },
                fontWeight: 800,
                letterSpacing: "-0.5px",
                background: "linear-gradient(90deg, #1a2c50, #0074e4)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Crypto Coin Control
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#58667e",
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                fontWeight: 400,
                maxWidth: "700px",
                lineHeight: 1.5,
                mb: 2,
              }}
            >
              Track cryptocurrency prices, manage your portfolio, and stay ahead
              of market trends with our professional analytics platform.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  borderRadius: "10px",
                  minWidth: { xs: "140px", sm: "180px" },
                  height: { xs: "48px", sm: "56px" },
                  px: { xs: 3, sm: 4 },
                  background: "linear-gradient(90deg, #0074e4, #005bb7)",
                  boxShadow: "0 4px 14px rgba(0, 116, 228, 0.4)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    background: "linear-gradient(90deg, #005bb7, #004a94)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0, 116, 228, 0.5)",
                  },
                }}
                component={Link}
                href="/login"
              >
                <Typography
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: { xs: "15px", sm: "16px" },
                  }}
                >
                  Get Started
                </Typography>
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "10px",
                  minWidth: { xs: "140px", sm: "180px" },
                  height: { xs: "48px", sm: "56px" },
                  px: { xs: 3, sm: 4 },
                  borderColor: "#0074e4",
                  color: "#0074e4",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "#005bb7",
                    backgroundColor: "rgba(0, 116, 228, 0.04)",
                    transform: "translateY(-2px)",
                  },
                }}
                component={Link}
                href="/about"
              >
                <Typography
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: { xs: "15px", sm: "16px" },
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
              "&::before, &::after": {
                borderColor: "rgba(0, 116, 228, 0.2)",
              },
            }}
          />

          <Box sx={{ mb: 2 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  color: "#58667e",
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  textTransform: "none",
                  transition: "all 0.2s ease",
                  minHeight: "56px",
                  "&:hover": {
                    color: "#0074e4",
                    backgroundColor: "rgba(0, 116, 228, 0.04)",
                  },
                },
                "& .Mui-selected": {
                  color: "#0074e4 !important",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#0074e4",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab} />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ mt: 3, minHeight: "400px" }}>
            {selectedTab === 0 && (
              <Fade in={selectedTab === 0} timeout={500}>
                <div>
                  <Assets
                    assets={[]} // TODO: Replace with actual assets data if available
                    loading={false} // TODO: Replace with actual loading state if needed
                    onBuySellClick={(asset) =>
                      console.log("Buy/Sell clicked for:", asset)
                    }
                    onViewDetailedAnalysis={(asset) =>
                      console.log("View Detailed Analysis clicked for:", asset)
                    }
                  />
                </div>
              </Fade>
            )}

            {selectedTab === 1 && (
              <Fade in={selectedTab === 1} timeout={500}>
                <div>
                  <Transactions data={[]} />
                </div>
              </Fade>
            )}

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
                    background: "linear-gradient(145deg, #ffffff, #f5f9ff)",
                    borderRadius: "12px",
                    border: "1px solid rgba(210, 225, 245, 0.5)",
                    textAlign: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1a2c50",
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    Sign in to view your personal dashboard
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#58667e",
                      mb: 2,
                      maxWidth: "500px",
                    }}
                  >
                    Create an account to track your portfolio, set price alerts,
                    and access personalized analytics.
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    href="/login"
                    sx={{
                      borderRadius: "8px",
                      px: 3,
                      py: 1,
                      background: "linear-gradient(90deg, #0074e4, #005bb7)",
                      boxShadow: "0 4px 10px rgba(0, 116, 228, 0.3)",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        background: "linear-gradient(90deg, #005bb7, #004a94)",
                        transform: "translateY(-2px)",
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
