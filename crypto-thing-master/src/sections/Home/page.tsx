"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  Fade,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Performers from "./Performers";
import Transactions from "./Transactions";
import Assets from "./Assets";
import { getAssets, getTransactions, getUserDetails } from "@/utils/user";
import { useStytchUser } from "@stytch/nextjs";
import { getAllCoins } from "@/utils/coins";
import { Coin, UserDetails } from "@/types";
import type { AssetData } from "./Assets";
import { useRouter } from "next/navigation";
import {
  getAllTimeProfit,
  getBestPerformer,
  getWorstPerformer,
} from "@/utils/portfolio";
import { getDexPairs } from "@/utils/dex";
import TransactionModal from "./TransactionModal";
import SkeletonPortfolio from "./SkeletonPortfolio";

// Define a TopCoin interface for market data
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

// Global state and cache (outside component to persist between renders)
const dataCache = {
  coins: null as Coin[] | null,
  dexPairs: null as any[] | null,
  topCoins: null as TopCoin[] | null,
};

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { user, isInitialized } = useStytchUser();
  const router = useRouter();

  // Main state
  const [data, setData] = useState({
    transactions: [] as any[],
    userDetails: null as UserDetails | null,
    coins: [] as Coin[],
    dexPairs: [] as any[],
    topCoins: [] as TopCoin[],
    assets: [] as AssetData[],
    portfolioStats: {
      allTimeProfit: undefined,
      bestPerformer: undefined,
      worstPerformer: undefined,
    },
  });
  // UI state
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState<TopCoin | null>(null);
  const [chartLoaded, setChartLoaded] = useState(false);
  const [itemTypeTab, setItemTypeTab] = useState(0); // 0 = Coin, 1 = DEX Pair

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [pricePerCoin, setPricePerCoin] = useState("");
  const [dateTime, setDateTime] = useState(new Date());

  // Loading state - single object to reduce re-renders
  const [loading, setLoading] = useState({
    initial: true,
    transactions: true,
    userDetails: true,
    portfolioStats: true,
    assets: true,
    chartLoaded: false,
  });

  const tabs = ["Assets", "Transactions"];

  // API fetch functions
  const fetchData = useCallback(async () => {
    if (!user?.user_id || !isInitialized) return;

    try {
      // Start all fetches in parallel
      const fetchPromises = [];

      // 1. Fetch static data (if not cached)
      if (!dataCache.coins) {
        fetchPromises.push(
          getAllCoins().then((coins) => {
            dataCache.coins = coins;
            setData((prev) => ({ ...prev, coins: coins || [] }));
          })
        );
      } else {
        setData((prev) => ({ ...prev, coins: dataCache.coins || [] }));
      }

      if (!dataCache.dexPairs) {
        fetchPromises.push(
          getDexPairs().then((pairs) => {
            dataCache.dexPairs = pairs;
            setData((prev) => ({ ...prev, dexPairs: pairs || [] }));
          })
        );
      } else {
        setData((prev) => ({ ...prev, dexPairs: dataCache.dexPairs || [] }));
      }

      if (!dataCache.topCoins) {
        fetchPromises.push(
          fetch("/api/coins/top")
            .then((res) => res.json())
            .then((coins) => {
              dataCache.topCoins = coins;
              setData((prev) => ({ ...prev, topCoins: coins }));

              // Set Bitcoin as default selected coin
              const bitcoin =
                coins.find((coin: TopCoin) => coin.symbol === "BTC") ||
                coins[0];
              setSelectedCoin(bitcoin);

              // Simulate chart loading
              setTimeout(() => {
                setChartLoaded(true);
                setLoading((prev) => ({ ...prev, chartLoaded: true }));
              }, 800);
            })
        );
      } else {
        setData((prev) => ({ ...prev, topCoins: dataCache.topCoins || [] }));
        const bitcoin =
          dataCache.topCoins?.find((coin) => coin.symbol === "BTC") ||
          dataCache.topCoins?.[0];
        setSelectedCoin(bitcoin || null);

        setTimeout(() => {
          setChartLoaded(true);
          setLoading((prev) => ({ ...prev, chartLoaded: true }));
        }, 100);
      }

      // 2. Fetch user-specific data
      fetchPromises.push(
        getTransactions(user.user_id).then((transactions) => {
          setData((prev) => ({ ...prev, transactions: transactions || [] }));
          setLoading((prev) => ({ ...prev, transactions: false }));

          // Only fetch portfolio stats if we have transactions
          if (transactions && transactions.length > 0) {
            return Promise.all([
              getAllTimeProfit(user.user_id),
              getBestPerformer(user.user_id),
              getWorstPerformer(user.user_id),
            ]).then(([allTimeProfit, bestPerformer, worstPerformer]) => {
              setData((prev) => ({
                ...prev,
                portfolioStats: {
                  allTimeProfit: allTimeProfit.results,
                  bestPerformer: bestPerformer.results,
                  worstPerformer: worstPerformer.results,
                },
              }));
              setLoading((prev) => ({ ...prev, portfolioStats: false }));
            });
          }
          return null;
        })
      );

      fetchPromises.push(
        getUserDetails(user.user_id).then((details) => {
          setData((prev) => ({ ...prev, userDetails: details }));
          setLoading((prev) => ({ ...prev, userDetails: false }));
        })
      );

      fetchPromises.push(
        getAssets(user.user_id)
          .then((data) => {
            setData((prev) => ({ ...prev, assets: data.results || [] }));
            setLoading((prev) => ({ ...prev, assets: false }));
          })
          .catch((err) => {
            console.error("Error fetching assets:", err);
            setData((prev) => ({ ...prev, assets: [] }));
            setLoading((prev) => ({ ...prev, assets: false }));
          })
      );

      // Wait for all fetches to complete
      await Promise.all(fetchPromises);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading((prev) => ({ ...prev, initial: false }));
    }
  }, [user, isInitialized]);

  // Refresh data function - for after adding transactions
  const refreshUserData = useCallback(async () => {
    if (!user?.user_id) return;

    try {
      const [transactions, userDetails, assets] = await Promise.all([
        getTransactions(user.user_id),
        getUserDetails(user.user_id),
        getAssets(user.user_id).then((data) => data.results || []),
      ]);

      setData((prev) => ({
        ...prev,
        transactions: transactions || [],
        userDetails,
        assets: assets || [],
      }));

      // Only fetch portfolio stats if we have transactions
      if (transactions && transactions.length > 0) {
        const [allTimeProfit, bestPerformer, worstPerformer] =
          await Promise.all([
            getAllTimeProfit(user.user_id),
            getBestPerformer(user.user_id),
            getWorstPerformer(user.user_id),
          ]);

        setData((prev) => ({
          ...prev,
          portfolioStats: {
            allTimeProfit: allTimeProfit.results,
            bestPerformer: bestPerformer.results,
            worstPerformer: worstPerformer.results,
          },
        }));
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  }, [user]);

  // Initial data load - with debounce to prevent multiple calls
  useEffect(() => {
    if (user?.user_id && isInitialized) {
      fetchData();
    }
  }, [fetchData, user, isInitialized]);

  // Event handlers
  const handleOpenModal = () => setIsModalOpen(true);

  const handleTabChange = (e: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleAssetBuySell = (asset: AssetData) => {
    setItemTypeTab(0);
    setModalTab(0);
    setPricePerCoin(String(asset.current_price ?? 0));
    setQuantity(String(asset.holding_amount ?? ""));
    setDateTime(new Date());
    setIsModalOpen(true);
  };

  // Process transactions for display
  const formattedTransactions = data.transactions.map((tx) => {
    const coin = data.coins.find((c) => c.coin_id === tx.coin_id);
    const dex = data.dexPairs.find(
      (d) => d.contract_address === tx.contract_address
    );
    return {
      id: String(tx.transaction_id || ""),
      Type: tx.transaction_type,
      Name_of_Coin: coin?.coin_name || dex?.name,
      Shorthand_Notation: coin?.symbol || dex?.base_asset_symbol,
      Date_and_Time_of_Transaction: tx.date,
      Price_at_Transaction: tx.price_per_coin,
      Value_in_Dollars: tx.value,
      Amount_of_Coin: tx.amount,
    };
  });

  // Show loading state if initial data isn't ready
  if (loading.initial) {
    return <SkeletonPortfolio/>
  }

  function handleViewDetailedAnalysis(asset: AssetData): void {
    router.push(
      `/coin/${asset.coin_id}?data=${encodeURIComponent(JSON.stringify(asset))}`
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            {/* Header section with portfolio value and add transaction button */}
            <Grid
              container
              spacing={3}
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 4 }}
            >
              <Grid item xs={12} sm={7}>
                <Box textAlign={{ xs: "center", sm: "left" }}>
                  <Typography
                    sx={{
                      color: "#58667e",
                      fontWeight: 500,
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                      mb: 1,
                    }}
                  >
                    {data.userDetails?.first_name} {data.userDetails?.last_name}&#39;s Portfolio
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                      fontWeight: 800,
                      letterSpacing: "-0.5px",
                      background: "linear-gradient(90deg, #1a2c50, #0074e4)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ${data.userDetails?.total_value_now}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={5}
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-end" },
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
                  startIcon={<Add />}
                  onClick={handleOpenModal}
                >
                  <Typography
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: { xs: "15px", sm: "16px" },
                    }}
                  >
                    Add Transaction
                  </Typography>
                </Button>
              </Grid>
            </Grid>

            {/* Performers Cards */}
            <Performers
              allTimeProfit={data.portfolioStats.allTimeProfit}
              bestPerformer={data.portfolioStats.bestPerformer}
              worstPerformer={data.portfolioStats.worstPerformer}
            />

            <Divider
              sx={{
                my: 4,
                "&::before, &::after": {
                  borderColor: "rgba(0, 116, 228, 0.2)",
                },
              }}
            />

            {/* Tabs Navigation */}
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

            {/* Tab Content */}
            <Box sx={{ mt: 3, minHeight: "400px" }}>
              {selectedTab === 0 && (
                <Fade in={selectedTab === 0} timeout={500}>
                  <div>
                    <Assets
                      onBuySellClick={handleAssetBuySell}
                      onViewDetailedAnalysis={handleViewDetailedAnalysis}
                      assets={data.assets}
                      loading={loading.assets}
                    />
                  </div>
                </Fade>
              )}
              
              {selectedTab === 1 && (
                <Fade in={selectedTab === 1} timeout={500}>
                  <div>
                    <Transactions
                      data={formattedTransactions}
                      onTransactionDeleted={refreshUserData}
                    />
                  </div>
                </Fade>
              )}
            </Box>
          </Box>
        </Paper>
        
        <TransactionModal
          quantity={quantity}
          pricePerCoin={pricePerCoin}
          dateTime={dateTime}
          setModalTab={setModalTab}
          setIsModalOpen={setIsModalOpen}
          itemTypeTab={itemTypeTab}
          coins={data.coins}
          dexPairs={data.dexPairs}
          setPricePerCoin={setPricePerCoin}
          setQuantity={setQuantity}
          modalTab={modalTab}
          user={user}
          fetchTransactions={refreshUserData}
          fetchUserDetails={refreshUserData}
          setDateTime={setDateTime}
          isModalOpen={isModalOpen}
          setItemTypeTab={setItemTypeTab}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default HomePage;