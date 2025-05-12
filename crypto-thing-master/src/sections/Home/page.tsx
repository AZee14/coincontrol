/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
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
import {
  Transaction,
  PortfolioTransaction,
  Coin,
  CoinMetadata,
  UserDetails,
} from "@/types";
import {
  getAllTimeProfit,
  getBestPerformer,
  getTodayCondition,
  getWorstPerformer,
} from "@/utils/portfolio";

const HomePage: React.FC = () => {
  const { user, isInitialized } = useStytchUser();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState({
    coins: true,
    transactions: true,
    userDetails: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerCoin, setPricePerCoin] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState(0);
  const [allTimeProfit, setAllTimeProfit] = useState<AllTimeProfits>();
  const [bestPerformer, setBestPerformer] = useState<BestPerformer>();
  const [worstPerformer, setWorstPerformer] = useState<WorstPerformer>();
  const [todayCondition, setTodayCondition] = useState<TodayCondition>();

  useEffect(() => {
    const fetchData = async () => {
      const data1 = await getAllTimeProfit(user!.user_id);
      setAllTimeProfit(data1.results);
      const data2 = await getBestPerformer(user!.user_id);
      setBestPerformer(data2.results);
      const data3 = await getTodayCondition(user!.user_id);
      setTodayCondition(data3.results);
      const data4 = await getWorstPerformer(user!.user_id);
      setWorstPerformer(data4.results);
    };
    fetchData();
  }, [user, coins, transactions]);

  const tabs = ["Assets", "Transactions"];
  const isAddTransactionDisabled =
    !selectedCoin || !quantity || !pricePerCoin || !dateTime;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleTabChange = (e: React.SyntheticEvent, newValue: number) =>
    setSelectedTab(newValue);
  const handleModalTabChange = (e: React.SyntheticEvent, newValue: number) =>
    setModalTab(newValue);

  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    const coinObj = coins.find((c) => c.coin_id === selected);
    if (coinObj) {
      setSelectedCoin(selected);
      setPricePerCoin(coinObj.marketprice);
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
        coin: selectedCoin,
        quantity: parseFloat(quantity),
        pricePerCoin: parseFloat(pricePerCoin),
        dateTime: dateTime.toISOString(),
        total: parseFloat(quantity) * parseFloat(pricePerCoin),
      };

      await sendTransactionData(transactionData, user.user_id);

      const updatedTxs = await getTransactions(user.user_id);
      setTransactions(updatedTxs || []); // 🛠️ Safe fallback

      const updatedDetails = await getUserDetails(user.user_id);
      setUserDetails(updatedDetails);

      handleCloseModal();
      setSelectedCoin("");
      setQuantity("");
      setPricePerCoin("");
      setDateTime(new Date());
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.user_id) return;
      try {
        setLoading((prev) => ({ ...prev, userDetails: true }));
        const data = await getUserDetails(user.user_id);
        setUserDetails(data);
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setLoading((prev) => ({ ...prev, userDetails: false }));
      }
    };
    if (isInitialized) fetchUserDetails();
  }, [isInitialized, user?.user_id]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.user_id) return;
      try {
        setLoading((prev) => ({ ...prev, transactions: true }));
        const res = await getTransactions(user.user_id);
        setTransactions(res || []); // 🛠️ Safe fallback
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setTransactions([]); // 🛠️ Safe fallback
      } finally {
        setLoading((prev) => ({ ...prev, transactions: false }));
      }
    };
    if (isInitialized) fetchTransactions();
  }, [isInitialized, user?.user_id]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading((prev) => ({ ...prev, coins: true }));
        const data = await getAllCoins();
        setCoins(data || []);
      } catch (err) {
        console.error("Error fetching coins:", err);
        setCoins([]);
      } finally {
        setLoading((prev) => ({ ...prev, coins: false }));
      }
    };
    fetchCoins();
  }, []);

  const formattedTransactions: any[] = Array.isArray(transactions)
    ? transactions.map((tx) => {
        const coin = coins.find((c) => c.coin_id === tx.coin_id);
        return {
          id: String(tx.transaction_id || ""),
          Type: tx.transaction_type,
          Name_of_Coin: coin?.coin_name,
          Shorthand_Notation: coin?.symbol,
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
              <Typography
                fontWeight={500}
                sx={{
                  color:
                    todayCondition?.net_change_24h === undefined ||
                    todayCondition?.net_change_24h < 0
                      ? "#ea3943"
                      : "#16c784",
                  fontSize: "16px",
                }}
              >
                {todayCondition?.net_change_24h}${" "}
                {todayCondition?.percentage_change_24h}% (24h)
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
              sx={{ backgroundColor: "primary.main", borderRadius: "10px" }}
              startIcon={<Add />}
              onClick={handleOpenModal}
            >
              Add transaction
            </Button>
          </Grid>
        </Grid>

        <Performers
          allTimeProfit={allTimeProfit}
          bestPerformer={bestPerformer}
          worstPerformer={worstPerformer}
        />
        <Divider sx={{ width: "100%", mt: 2 }} />

        <Tabs value={selectedTab} onChange={handleTabChange}>
          {tabs.map((tab, i) => (
            <Tab key={i} label={tab} />
          ))}
        </Tabs>

        {selectedTab === 0 ? (
          <Assets />
        ) : (
          <Transactions data={formattedTransactions} />
        )}

        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "27rem",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "15px",
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
              <TextField
                select
                label="Select Coin"
                value={selectedCoin}
                onChange={handleCoinChange}
                fullWidth
                sx={textFieldSx}
                InputProps={textFieldInputProps}
                disabled={loading.coins}
              >
                {loading.coins ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : coins.length > 0 ? (
                  coins.map((coin) => (
                    <MenuItem key={coin.coin_id} value={coin.coin_id}>
                      {`${coin.coin_name} (${coin.symbol})`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No coins available</MenuItem>
                )}
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
                sx={{ backgroundColor: "#eff2f5", borderRadius: "10px", p: 2 }}
              >
                <Typography sx={{ color: "#616e85", fontSize: "14px" }}>
                  {modalTab === 0 ? "Total Spent ($)" : "Total Received ($)"}
                </Typography>
                <Typography sx={{ fontSize: "24px", fontWeight: 700 }}>
                  ${(Number(quantity) * Number(pricePerCoin)).toFixed(4)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                disabled={isAddTransactionDisabled}
                onClick={handleAddTransaction}
                sx={{ height: "3rem", borderRadius: "10px" }}
              >
                <Typography variant="subtitle1" fontWeight={500}>
                  Add Transaction
                </Typography>
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </LocalizationProvider>
  );
};

export default HomePage;
