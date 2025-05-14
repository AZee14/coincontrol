/* eslint-disable react/no-unescaped-entities */
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
  SelectChangeEvent,
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
import MarketTab from "./MarketTab";
import TransactionModal from "./TransactionModal";

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
    assets: [] as AssetData[], // Add this line
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
  // In the loading state object
  const [loading, setLoading] = useState({
    initial: true,
    transactions: true,
    userDetails: true,
    portfolioStats: true,
    assets: true, // Add this line
    chartLoaded: false,
  });

  const tabs = ["Assets", "Transactions", "Market"];

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

      // Inside fetchData function, add this to the fetchPromises array
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
      // Inside refreshUserData function, update the Promise.all to include assets
      const [transactions, userDetails, assets] = await Promise.all([
        getTransactions(user.user_id),
        getUserDetails(user.user_id),
        getAssets(user.user_id).then((data) => data.results || []),
      ]);

      // Then update the setData call
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

  const handleMarketCoinChange = (event: SelectChangeEvent<string>) => {
    const coinId = event.target.value as string;
    const coin = data.topCoins.find((c) => c.coin_id.toString() === coinId);
    if (coin) {
      setSelectedCoin(coin);
      setChartLoaded(false);
      setTimeout(() => setChartLoaded(true), 300);
    }
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
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h5">Loading portfolio data...</Typography>
      </Container>
    );
  }

  function handleViewDetailedAnalysis(asset: AssetData): void {
    router.push(
      `/coin/${asset.coin_id}?data=${encodeURIComponent(JSON.stringify(asset))}`
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Grid container>
          <Grid item xs={6}>
            <Box textAlign="left">
              <Typography
                fontWeight={500}
                sx={{ color: "#616e85", fontSize: "24px" }}
              >
                {data.userDetails?.first_name} {data.userDetails?.last_name}'s
                Portfolio
              </Typography>
              <Typography fontWeight={700} sx={{ fontSize: "32px" }}>
                ${data.userDetails?.total_value_now?.toFixed(2) || "0.00"}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #6366f1, #3b82f6)",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                ":hover": {
                  background: "linear-gradient(to right, #4f46e5, #2563eb)",
                },
              }}
              startIcon={<Add />}
              onClick={handleOpenModal}
            >
              Add Transaction
            </Button>
          </Grid>
        </Grid>

        <Performers
          allTimeProfit={data.portfolioStats.allTimeProfit}
          bestPerformer={data.portfolioStats.bestPerformer}
          worstPerformer={data.portfolioStats.worstPerformer}
        />
        <Divider sx={{ width: "100%", mt: 2 }} />

        <Tabs value={selectedTab} onChange={handleTabChange}>
          {tabs.map((tab, i) => (
            <Tab key={i} label={tab} />
          ))}
        </Tabs>

        {selectedTab === 0 && (
          <Assets
            onBuySellClick={handleAssetBuySell}
            onViewDetailedAnalysis={handleViewDetailedAnalysis}
            assets={data.assets}
            loading={loading.assets}
          />
        )}
        {selectedTab === 1 && (
          <Transactions
            data={formattedTransactions}
            onTransactionDeleted={refreshUserData}
          />
        )}
        {selectedTab === 2 && (
          <MarketTab
            selectedTab={selectedTab}
            loading={!dataCache.topCoins}
            selectedCoin={selectedCoin}
            isMobile={isMobile}
            isTablet={isTablet}
            handleMarketCoinChange={handleMarketCoinChange}
            topCoins={data.topCoins}
            chartLoaded={chartLoaded}
          />
        )}
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
