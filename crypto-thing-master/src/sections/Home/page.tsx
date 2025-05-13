/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { DateTimeField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import Performers from "./Performers";
import Transactions from "./Transactions";
import Assets from "./Assets";
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

const HomePage: React.FC = () => {
  const { user, isInitialized } = useStytchUser();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [dexPairs, setDexPairs] = useState<DexPair[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<any>({
    allTimeProfit: undefined,
    bestPerformer: undefined,
    worstPerformer: undefined,
    // todayCondition: undefined,
  });
  const [loading, setLoading] = useState({
    coins: true,
    transactions: true,
    userDetails: true,
    dexPairs: true,
    portfolioStats: true,
  });

  const [itemTypeTab, setItemTypeTab] = useState(0); // 0 = Coin, 1 = DEX Pair
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [pricePerCoin, setPricePerCoin] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = ["Assets", "Transactions"];
  const isAddTransactionDisabled =
    !selectedCoin || !quantity || !pricePerCoin || !dateTime;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleTabChange = (e: React.SyntheticEvent, newValue: number) =>
    setSelectedTab(newValue);
  const handleModalTabChange = (e: React.SyntheticEvent, newValue: number) =>
    setModalTab(newValue);
  const handleAssetBuySell = (asset: AssetData) => {
    (
      // 1) select the "Coin" tab
      setItemTypeTab(0)
    );

    (
      // 2) force the modal into "Buy" or "Sell" if you like:
      setModalTab(0)
    ); // 0 = Buy

    (
      // 3) prefill the dropdown and inputs:
      setSelectedCoin(String(asset.coin_id))
    ); // this drives your <TextField select value=…
    setPricePerCoin(String(asset.current_price ?? 0));
    setQuantity(String(asset.holding_amount ?? ""));

    (
      // 4) reset date/time if you want
      setDateTime(new Date())
    );

    (
      // 5) open the modal
      setIsModalOpen(true)
    );
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
      // const [allTimeProfit, bestPerformer, todayCondition, worstPerformer] =
      const [allTimeProfit, bestPerformer, worstPerformer] = await Promise.all([
        getAllTimeProfit(userId),
        getBestPerformer(userId),
        // getTodayCondition(userId),
        getWorstPerformer(userId),
      ]);

      setPortfolioStats({
        allTimeProfit: allTimeProfit.results,
        bestPerformer: bestPerformer.results,
        worstPerformer: worstPerformer.results,
        // todayCondition: todayCondition.results,
      });
    } catch (err) {
      console.error("Error fetching portfolio stats:", err);
    } finally {
      setLoading((prev) => ({ ...prev, portfolioStats: false }));
    }
  }, []);

  // Combined data fetching function
  const fetchAllData = useCallback(async () => {
    if (!user?.user_id || !isInitialized) return;

    // Fetch static data that doesn't depend on user
    const [coinsData, dexData] = await Promise.all([
      fetchCoins(),
      fetchDexPairs(),
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

  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    if (itemTypeTab === 0) {
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
        setSelectedCoin(String(parseInt(selected, 10) || ""));
        setPricePerCoin(dexPairObj.price);
      }
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
      !selectedCoin ||
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
            ? selectedCoin !== null
              ? String(selectedCoin)
              : null
            : null,
        contract_address:
          itemTypeTab === 1
            ? selectedCoin !== null
              ? String(selectedCoin)
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
      setSelectedCoin("");
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
        {selectedTab === 0 ? (
          <Assets onBuySellClick={handleAssetBuySell} />
        ) : (
          <Transactions
            data={formattedTransactions}
            onTransactionDeleted={() => fetchTransactions(user?.user_id || "")}
          />
        )}

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
                value={selectedCoin}
                onChange={handleCoinChange}
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
