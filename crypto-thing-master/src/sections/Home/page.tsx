/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
  MenuItem,
  Divider,
  CircularProgress,
  Paper,
  Skeleton,
  Fade,
  useTheme,
  useMediaQuery,
  Chip,
  FormControl,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { DateTimeField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import Performers from "./Performers";
import Transactions from "./Transactions";
import Assets from "./Assets";
import CoinChart from "@/components/CoinChart";
import { textFieldInputProps, textFieldSx } from "./styles";
import { sendTransactionData } from "@/utils/transactions";
import { getTransactions, getUserDetails } from "@/utils/user";
import { useStytchUser } from "@stytch/nextjs";
import { getAllCoins } from "@/utils/coins";
import { PortfolioTransaction, Coin, UserDetails } from "@/types";
import type { AssetData } from "./Assets";
import {
  getAllTimeProfit,
  getBestPerformer,
  getTodayCondition,
  getWorstPerformer,
} from "@/utils/portfolio";
import { getDexPairs } from "@/utils/dex";

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

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { user, isInitialized } = useStytchUser();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [dexPairs, setDexPairs] = useState<any[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<any>({
    allTimeProfit: undefined,
    bestPerformer: undefined,
    worstPerformer: undefined,
  });
  const [loading, setLoading] = useState({
    coins: true,
    transactions: true,
    userDetails: true,
    dexPairs: true,
    portfolioStats: true,
    topCoins: true,
    chartLoaded: false,
  });

  // New states for Market tab
  const [topCoins, setTopCoins] = useState<TopCoin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<TopCoin | null>(null);
  const [chartLoaded, setChartLoaded] = useState(false);

  const [itemTypeTab, setItemTypeTab] = useState(0); // 0 = Coin, 1 = DEX Pair
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState(0);
  const [selectedCoinId, setSelectedCoinId] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [pricePerCoin, setPricePerCoin] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = ["Assets", "Transactions", "Market"];
  const isAddTransactionDisabled =
    !selectedCoinId || !quantity || !pricePerCoin || !dateTime;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleTabChange = (e: React.SyntheticEvent, newValue: number) =>
    setSelectedTab(newValue);
  const handleModalTabChange = (e: React.SyntheticEvent, newValue: number) =>
    setModalTab(newValue);
  const handleAssetBuySell = (asset: AssetData) => {
    // 1) select the "Coin" tab
    setItemTypeTab(0);

    // 2) force the modal into "Buy" or "Sell" if you like:
    setModalTab(0); // 0 = Buy

    // 3) prefill the dropdown and inputs:
    handleCoinChange(null, String(asset.coin_id ?? asset.contract_address)); // this drives your <TextField select value=…
    setPricePerCoin(String(asset.current_price ?? 0));
    setQuantity(String(asset.holding_amount ?? ""));

    // 4) reset date/time if you want
    setDateTime(new Date());

    // 5) open the modal
    setIsModalOpen(true);
  };

  // Memoize fetch functions to prevent unnecessary re-creation
  const fetchTransactions = useCallback(async (userId: string) => {
    setLoading((prev) => ({ ...prev, transactions: true }));
    try {
      const res = await getTransactions(userId);
      setTransactions(res || []);
      return res;
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }));
    }
  }, []);

  const fetchUserDetails = useCallback(async (userId: string) => {
    setLoading((prev) => ({ ...prev, userDetails: true }));
    try {
      const details = await getUserDetails(userId);
      setUserDetails(details);
      return details;
    } catch (err) {
      console.error("Error fetching user details:", err);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, userDetails: false }));
    }
  }, []);

  const fetchCoins = useCallback(async () => {
    setLoading((prev) => ({ ...prev, coins: true }));
    try {
      const data = await getAllCoins();
      setCoins(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching coins:", err);
      setCoins([]);
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, coins: false }));
    }
  }, []);

  const fetchDexPairs = useCallback(async () => {
    setLoading((prev) => ({ ...prev, dexPairs: true }));
    try {
      const data = await getDexPairs();
      setDexPairs(data || []);
      return data;
    } catch (err) {
      console.error("Error fetching dex pairs:", err);
      setDexPairs([]);
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, dexPairs: false }));
    }
  }, []);

  const fetchPortfolioStats = useCallback(async (userId: string) => {
    setLoading((prev) => ({ ...prev, portfolioStats: true }));
    try {
      const [allTimeProfit, bestPerformer, worstPerformer] = await Promise.all([
        getAllTimeProfit(userId),
        getBestPerformer(userId),
        getWorstPerformer(userId),
      ]);

      setPortfolioStats({
        allTimeProfit: allTimeProfit.results,
        bestPerformer: bestPerformer.results,
        worstPerformer: worstPerformer.results,
      });
    } catch (err) {
      console.error("Error fetching portfolio stats:", err);
    } finally {
      setLoading((prev) => ({ ...prev, portfolioStats: false }));
    }
  }, []);

  // New function to fetch top coins for Market tab
  const fetchTopCoins = useCallback(async () => {
    setLoading((prev) => ({ ...prev, topCoins: true }));
    try {
      const response = await fetch("/api/coins/top");
      if (!response.ok) {
        throw new Error("Failed to fetch top coins");
      }
      const data = await response.json();
      setTopCoins(data);

      // Set Bitcoin as the default selected coin
      const bitcoin =
        data.find((coin: TopCoin) => coin.symbol === "BTC") || data[0];
      setSelectedCoin(bitcoin);

      // Simulate chart loading
      setTimeout(() => {
        setChartLoaded(true);
        setLoading((prev) => ({ ...prev, chartLoaded: true }));
      }, 800);

      return data;
    } catch (err) {
      console.error("Error fetching top coins:", err);
      setTopCoins([]);
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, topCoins: false }));
    }
  }, []);

  // Combined data fetching function
  const fetchAllData = useCallback(async () => {
    if (!user?.user_id || !isInitialized) return;

    // Fetch static data that doesn't depend on user
    const [coinsData, dexData, topCoinsData] = await Promise.all([
      fetchCoins(),
      fetchDexPairs(),
      fetchTopCoins(),
    ]);

    // Fetch user-specific data
    const [txData, userData] = await Promise.all([
      fetchTransactions(user.user_id),
      fetchUserDetails(user.user_id),
    ]);

    // Once we have transactions, fetch portfolio stats
    if (txData && txData.length > 0) {
      await fetchPortfolioStats(user.user_id);
    }
  }, [
    user,
    isInitialized,
    fetchCoins,
    fetchDexPairs,
    fetchTransactions,
    fetchUserDetails,
    fetchPortfolioStats,
    fetchTopCoins,
  ]);

  // Initial data load
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Refresh portfolio stats when transactions change
  useEffect(() => {
    if (user?.user_id && transactions.length > 0) {
      fetchPortfolioStats(user.user_id);
    }
  }, [user?.user_id, transactions, fetchPortfolioStats]);

  const handleCoinChange = (
    e: React.ChangeEvent<HTMLInputElement> | null = null,
    selected: string | null = null
  ) => {
    let tab = itemTypeTab;
    if (selected && !parseInt(selected, 10)) {
      tab = 1;
      setItemTypeTab(tab);
    } else if (selected) {
      tab = 0;
      setItemTypeTab(tab);
    } else selected = e!.target.value;
    if (tab === 0) {
      const coinObj = coins.find((c) => c.coin_id === selected);
      if (coinObj) {
        setSelectedCoin(
          itemTypeTab === 0 ? String(parseInt(selected, 10) || "") : selected
        );
        setPricePerCoin(coinObj.marketprice);
      }
    } else {
      const dexPairObj = dexPairs.find((d) => d.contract_address === selected);
      if (dexPairObj) {
        setSelectedCoin(dexPairObj);
        setPricePerCoin(dexPairObj.price);
      }
    }
  };

  // Handler for changing selected coin in Market tab
  const handleMarketCoinChange = (event: SelectChangeEvent<string>) => {
    const coinId = event.target.value as string;
    const coin = topCoins.find((c) => c.coin_id.toString() === coinId);
    if (coin) {
      setSelectedCoin(coin);
      setChartLoaded(false);
      setTimeout(() => setChartLoaded(true), 800);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) setQuantity(val);
  };

  const handlePricePerCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) setPricePerCoin(val);
  };

  const handleAddTransaction = async () => {
    if (
      !user?.user_id ||
      !selectedCoinId ||
      !quantity ||
      !pricePerCoin ||
      !dateTime
    )
      return;

    try {
      const transactionData: PortfolioTransaction = {
        type: modalTab === 0 ? "Buy" : "Sell",
        coin:
          itemTypeTab === 0
            ? selectedCoinId !== null
              ? String(selectedCoinId)
              : null
            : null,
        contract_address:
          itemTypeTab === 1
            ? selectedCoinId !== null
              ? String(selectedCoinId)
              : null
            : null,
        quantity: parseFloat(quantity),
        pricePerCoin: parseFloat(pricePerCoin),
        dateTime: dateTime.toISOString(),
        total: parseFloat(quantity) * parseFloat(pricePerCoin),
      };

      await sendTransactionData(transactionData, user.user_id);

      // Refresh only necessary data after adding a transaction
      await fetchTransactions(user.user_id);
      await fetchUserDetails(user.user_id);

      handleCloseModal();
      setSelectedCoinId("");
      setQuantity("");
      setPricePerCoin("");
      setDateTime(new Date());
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const formattedTransactions: any[] = Array.isArray(transactions)
    ? transactions.map((tx) => {
        const coin = coins.find((c) => c.coin_id === tx.coin_id);
        const dex = dexPairs.find(
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
      })
    : [];

  // Render Market tab content
  const renderMarketContent = () => (
    <Fade in={selectedTab === 2} timeout={500}>
      <div className="w-full mt-6">
        <section className="mb-12">
          {loading.topCoins ? (
            <Paper elevation={3} className="w-full overflow-hidden rounded-xl">
              <Box p={4}>
                <Skeleton variant="text" width="40%" height={40} />
                <Box mt={2} mb={4}>
                  <Skeleton variant="rectangular" width="100%" height={400} />
                </Box>
                <Box
                  display="grid"
                  gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
                  gap={3}
                >
                  {[...Array(3)].map((_, i) => (
                    <Box key={i}>
                      <Skeleton variant="text" width="60%" height={28} />
                      <Skeleton variant="text" width="80%" height={40} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          ) : selectedCoin ? (
            <Paper
              elevation={3}
              className="overflow-hidden rounded-xl transition-all duration-300 hover"
              sx={{
                background: "linear-gradient(145deg, #ffffff, #f0f7ff)",
                border: "1px solid rgba(210, 225, 245, 0.5)",
                position: "relative",
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
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 180,
                        mr: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          background: "rgba(0, 116, 228, 0.05)",
                          "&.Mui-focused fieldset": {
                            borderColor: "#0074e4",
                          },
                        },
                      }}
                    >
                      <Select
                        value={selectedCoin.coin_id.toString()}
                        onChange={handleMarketCoinChange}
                        displayEmpty
                        renderValue={() => (
                          <Box display="flex" alignItems="center">
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              sx={{
                                background:
                                  "linear-gradient(90deg, #1a2c50, #0074e4)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mr: 1,
                              }}
                            >
                              {selectedCoin.name}
                            </Typography>
                            <Chip
                              label={selectedCoin.symbol}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                backgroundColor: "rgba(0, 116, 228, 0.1)",
                                color: "#0074e4",
                              }}
                            />
                          </Box>
                        )}
                      >
                        {topCoins.map((coin) => (
                          <MenuItem
                            key={coin._id}
                            value={coin.coin_id.toString()}
                          >
                            <Box display="flex" alignItems="center">
                              <Typography
                                variant="body1"
                                fontWeight="600"
                                sx={{
                                  color: "#1a2c50",
                                  mr: 1,
                                }}
                              >
                                {coin.name}
                              </Typography>
                              <Chip
                                label={coin.symbol}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "rgba(0, 116, 228, 0.1)",
                                  color: "#0074e4",
                                  height: "20px",
                                }}
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {/* Chart Container */}
                <Box
                  className="relative"
                  height={450}
                  mb={10}
                  sx={{
                    opacity: chartLoaded ? 1 : 0.4,
                    transition: "opacity 0.5s ease-in-out",
                  }}
                >
                  {selectedCoin && (
                    <CoinChart
                      coinId={selectedCoin.coin_id}
                      coinSymbol={selectedCoin.symbol}
                      timeFrame="7d"
                      height={350}
                      showMarketCap={true}
                      showVolume={true}
                    />
                  )}

                  {!chartLoaded && (
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      sx={{
                        transform: "translate(-50%, -50%)",
                        zIndex: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        color="text.secondary"
                      >
                        Loading chart data...
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Stats Cards */}
                <Box
                  display="grid"
                  gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }}
                  gap={3}
                  sx={{
                    position: "relative",
                    mt: -8,
                    zIndex: 5,
                    "& > div": {
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                      },
                    },
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: "linear-gradient(145deg, #ffffff, #f5f9ff)",
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      fontWeight={500}
                      gutterBottom
                    >
                      Current Price
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#1a2c50">
                      $
                      {selectedCoin.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: "linear-gradient(145deg, #ffffff, #f5f9ff)",
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      fontWeight={500}
                      gutterBottom
                    >
                      Market Cap
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#1a2c50">
                      ${(selectedCoin.market_cap / 1e9).toFixed(2)}B
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      background: "linear-gradient(145deg, #ffffff, #f5f9ff)",
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      fontWeight={500}
                      gutterBottom
                    >
                      24h Volume
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#1a2c50">
                      ${(selectedCoin.volume_24h / 1e9).toFixed(2)}B
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
                backgroundColor: "#fff1f0",
                border: "1px solid #ffccc7",
              }}
            >
              <Typography color="error">
                Failed to load featured coin data.
              </Typography>
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
                color: "#1a2c50",
              }}
            >
              Top Cryptocurrencies
            </Typography>
          </Box>

          {loading.topCoins ? (
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Box p={2}>
                <Skeleton variant="rectangular" height={40} />
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={60}
                    sx={{ mt: 1 }}
                  />
                ))}
              </Box>
            </Paper>
          ) : (
            <Paper
              elevation={2}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              <Box sx={{ overflowX: "auto" }}>
                <table className="min-w-full" style={{ tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "17%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "17%" }} />
                    <col style={{ width: "18%" }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">
                        #
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">
                        Name
                      </th>
                      <th className="py-4 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">
                        Price
                      </th>
                      <th className="py-4 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">
                        24h %
                      </th>
                      <th className="py-4 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">
                        Market Cap
                      </th>
                      <th className="py-4 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b-2 border-blue-100">
                        Volume (24h)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {topCoins.map((coin, index) => (
                      <tr
                        key={coin._id}
                        className="transition-colors hover:bg-blue-50"
                        style={{
                          backgroundColor:
                            index % 2 === 0
                              ? "rgba(0, 116, 228, 0.02)"
                              : "transparent",
                        }}
                      >
                        <td className="py-4 px-6 text-center">
                          <Box
                            component="span"
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              backgroundColor:
                                index < 3
                                  ? "rgba(0, 116, 228, 0.1)"
                                  : "transparent",
                              color: index < 3 ? "#0074e4" : "inherit",
                              fontWeight: index < 3 ? 700 : 500,
                              margin: "0 auto",
                            }}
                          >
                            {index + 1}
                          </Box>
                        </td>
                        <td className="py-4 px-6">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              "&:hover": { opacity: 0.85 },
                            }}
                          >
                            <Box
                              component="div"
                              sx={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(0, 116, 228, 0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0074e4",
                                fontWeight: 700,
                                fontSize: "14px",
                                mr: 2,
                              }}
                            >
                              {coin.symbol.charAt(0)}
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 600,
                                  color: "#1a2c50",
                                  fontSize: "15px",
                                }}
                              >
                                {coin.name}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  color: "#58667e",
                                  fontWeight: 500,
                                }}
                              >
                                {coin.symbol}
                              </Typography>
                            </Box>
                          </Box>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: "#1a2c50",
                              fontSize: "15px",
                            }}
                          >
                            $
                            {coin.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {coin.price_change_24h ? (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  coin.price_change_24h > 0
                                    ? "rgba(22, 163, 74, 0.1)"
                                    : "rgba(220, 38, 38, 0.1)",
                                color:
                                  coin.price_change_24h > 0
                                    ? "#16a34a"
                                    : "#dc2626",
                                fontWeight: 600,
                                borderRadius: "4px",
                                padding: "4px 8px",
                                fontSize: "14px",
                                margin: "0 auto",
                                width: "fit-content",
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  "&::before": {
                                    content: '""',
                                    display: "inline-block",
                                    width: "0",
                                    height: "0",
                                    marginRight: "4px",
                                    borderLeft: "4px solid transparent",
                                    borderRight: "4px solid transparent",
                                    borderBottom:
                                      coin.price_change_24h > 0
                                        ? "6px solid #16a34a"
                                        : "none",
                                    borderTop:
                                      coin.price_change_24h <= 0
                                        ? "6px solid #dc2626"
                                        : "none",
                                  },
                                }}
                              >
                                {coin.price_change_24h > 0 ? "+" : ""}
                                {coin.price_change_24h.toFixed(2)}%
                              </Box>
                            </Box>
                          ) : (
                            <Typography
                              sx={{
                                color: "#58667e",
                                fontWeight: 500,
                                textAlign: "center",
                              }}
                            >
                              N/A
                            </Typography>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: "#1a2c50",
                              fontSize: "15px",
                            }}
                          >
                            ${(coin.market_cap / 1e9).toFixed(2)}B
                          </Typography>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: "#1a2c50",
                              fontSize: "15px",
                            }}
                          >
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Grid container>
          <Grid item xs={6}>
            <Box textAlign="left">
              <Typography
                fontWeight={500}
                sx={{ color: "#616e85", fontSize: "24px" }}
              >
                {userDetails?.first_name} {userDetails?.last_name}'s Portfolio
              </Typography>
              <Typography fontWeight={700} sx={{ fontSize: "32px" }}>
                ${userDetails?.total_value_now?.toFixed(2) || "0.00"}
              </Typography>
              {/* <Typography
                                      fontWeight={500}
                                      sx={{
                                        color:
                                          portfolioStats.todayCondition?.net_change_24h ===
                                            undefined ||
                                          portfolioStats.todayCondition?.net_change_24h < 0
                                            ? "#ea3943"
                                            : "#16c784",
                                        fontSize: "16px",
                                      }}
                                    >
                                      {portfolioStats.todayCondition?.net_change_24h?.toFixed(2)}${" "}
                                      {portfolioStats.todayCondition?.percentage_change_24h}% (24h)
                                    </Typography> */}
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
          allTimeProfit={portfolioStats.allTimeProfit}
          bestPerformer={portfolioStats.bestPerformer}
          worstPerformer={portfolioStats.worstPerformer}
        />
        <Divider sx={{ width: "100%", mt: 2 }} />

        <Tabs value={selectedTab} onChange={handleTabChange}>
          {tabs.map((tab, i) => (
            <Tab key={i} label={tab} />
          ))}
        </Tabs>

        {selectedTab === 0 && <Assets onBuySellClick={handleAssetBuySell} />}
        {selectedTab === 1 && (
          <Transactions
            data={formattedTransactions}
            onTransactionDeleted={() => fetchTransactions(user?.user_id || "")}
          />
        )}
        {selectedTab === 2 && renderMarketContent()}

        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "27rem" },
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: "15px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" fontWeight={600}>
                Add Transaction
              </Typography>
              <IconButton onClick={handleCloseModal}>
                <Close />
              </IconButton>
            </Box>

            <Tabs
              value={modalTab}
              onChange={handleModalTabChange}
              variant="fullWidth"
            >
              <Tab label="Buy" />
              <Tab label="Sell" />
            </Tabs>

            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              <Tabs
                value={itemTypeTab}
                onChange={(_, v) => setItemTypeTab(v)}
                variant="fullWidth"
              >
                <Tab label="Coin" />
                <Tab label="DEX Pair" />
              </Tabs>
              <TextField
                select
                label={itemTypeTab === 0 ? "Select Coin" : "Select DEX Pair"}
                value={selectedCoinId} // Changed from selectedCoin to selectedCoinId
                onChange={(e) =>
                  handleCoinChange(e as ChangeEvent<HTMLInputElement>, null)
                }
                fullWidth
                sx={textFieldSx}
                InputProps={textFieldInputProps}
              >
                {itemTypeTab === 0
                  ? coins.map((c) => (
                      <MenuItem key={c.coin_id} value={String(c.coin_id)}>
                        {`${c.coin_name} (${c.symbol})`}
                      </MenuItem>
                    ))
                  : dexPairs.map((p) => (
                      <MenuItem
                        key={p.contract_address}
                        value={p.contract_address}
                      >
                        {p.name}
                      </MenuItem>
                    ))}
              </TextField>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    fullWidth
                    sx={textFieldSx}
                    InputProps={textFieldInputProps}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Price per Coin"
                    value={pricePerCoin}
                    onChange={handlePricePerCoinChange}
                    fullWidth
                    sx={textFieldSx}
                    InputProps={textFieldInputProps}
                  />
                </Grid>
              </Grid>

              <DemoItem>
                <DateTimeField
                  label="Transaction Date & Time"
                  value={dayjs(dateTime)}
                  onChange={(val) => setDateTime(val?.toDate() || new Date())}
                  sx={textFieldSx}
                  InputProps={textFieldInputProps}
                />
              </DemoItem>

              <Box
                sx={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "12px",
                  p: 2,
                  mt: 1,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
                  {modalTab === 0 ? "Total Spent ($)" : "Total Received ($)"}
                </Typography>
                <Typography
                  sx={{ fontSize: "24px", fontWeight: 700, color: "#0f172a" }}
                >
                  ${(Number(quantity) * Number(pricePerCoin)).toFixed(4)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                disabled={isAddTransactionDisabled}
                onClick={handleAddTransaction}
                sx={{
                  height: "3rem",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "16px",
                  backgroundColor: "#3b82f6",
                  ":hover": {
                    backgroundColor: "#2563eb",
                  },
                }}
              >
                Add Transaction
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </LocalizationProvider>
  );
};

export default HomePage;
