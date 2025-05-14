import { PortfolioTransaction } from "@/types";
import { sendTransactionData } from "@/utils/transactions";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import React, { ChangeEvent, useMemo, useCallback } from "react";
import { textFieldInputProps, textFieldSx } from "./styles";
import dayjs from "dayjs";

// Define proper types for the component props
interface TransactionModalProps {
  quantity: string;
  pricePerCoin: string;
  dateTime: Date;
  setModalTab: (tab: number) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  itemTypeTab: number;
  coins: any[];
  dexPairs: any[];
  setPricePerCoin: (price: string) => void;
  setQuantity: (quantity: string) => void;
  modalTab: number;
  user: any;
  fetchTransactions: (userId: string) => Promise<void>;
  fetchUserDetails: (userId: string) => Promise<void>;
  setDateTime: (date: Date) => void;
  isModalOpen: boolean;
  setItemTypeTab: (tab: number) => void;
}

function TransactionModal({
  quantity,
  pricePerCoin,
  dateTime,
  setModalTab,
  setIsModalOpen,
  itemTypeTab,
  coins,
  dexPairs,
  setPricePerCoin,
  setQuantity,
  modalTab,
  user,
  fetchTransactions,
  fetchUserDetails,
  setDateTime,
  isModalOpen,
  setItemTypeTab,
}: TransactionModalProps) {
  // Use React state from parent component instead of local state
  const selectedCoinId = useMemo(() => {
    // Extract the selected coin ID from the available data
    if (itemTypeTab === 0 && coins.length > 0) {
      // Find a coin that matches the current price
      const matchedCoin = coins.find((c) => c.marketprice === pricePerCoin);
      return matchedCoin ? String(matchedCoin.coin_id) : "";
    } else if (itemTypeTab === 1 && dexPairs.length > 0) {
      // Find a DEX pair that matches the current price
      const matchedPair = dexPairs.find((d) => d.price === pricePerCoin);
      return matchedPair ? matchedPair.contract_address : "";
    }
    return "";
  }, [itemTypeTab, coins, dexPairs, pricePerCoin]);

  // Computed value instead of state
  const isAddTransactionDisabled =
    !selectedCoinId || !quantity || !pricePerCoin || !dateTime;

  // Calculate total amount once
  const totalAmount = useMemo(() => {
    return (Number(quantity) * Number(pricePerCoin)).toFixed(4);
  }, [quantity, pricePerCoin]);

  // Event handlers with useCallback to prevent unnecessary re-renders
  const handleModalTabChange = useCallback(
    (e: React.SyntheticEvent, newValue: number) => {
      setModalTab(newValue);
    },
    [setModalTab]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const handleCoinChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.value;

      // Update price per coin based on the selected item type
      if (itemTypeTab === 0) {
        const coinObj = coins.find((c) => String(c.coin_id) === selected);
        if (coinObj) {
          setPricePerCoin(coinObj.marketprice);
        }
      } else {
        const dexPairObj = dexPairs.find(
          (d) => d.contract_address === selected
        );
        if (dexPairObj) {
          setPricePerCoin(dexPairObj.price);
        }
      }
    },
    [itemTypeTab, coins, dexPairs, setPricePerCoin]
  );

  // const handleCoinChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  //   // e: React.ChangeEvent<HTMLInputElement> | null = null,
  //   // selected: string | null = null
  // ) => {
  //   // let tab = itemTypeTab;
  //   // if (selected && !parseInt(selected, 10)) {
  //   //   tab = 1;
  //   //   setItemTypeTab(tab);
  //   // } else if (selected) {
  //   //   tab = 0;
  //   //   setItemTypeTab(tab);
  //   // } else selected = e!.target.value;
  //   // if (tab === 0) {
  //   //   const coinObj = coins.find((c) => c.coin_id === selected);
  //   //   if (coinObj) {
  //   //     setSelectedCoin(
  //   //       itemTypeTab === 0 ? String(parseInt(selected, 10) || "") : selected
  //   //     );
  //   //     setPricePerCoin(coinObj.marketprice);
  //   //   }
  //   // } else {
  //   //   const dexPairObj = dexPairs.find((d) => d.contract_address === selected);
  //   //   if (dexPairObj) {
  //   //     setSelectedCoin(dexPairObj);
  //   //     setPricePerCoin(dexPairObj.price);
  //   //   }
  //   // }
  //   const selected = e.target.value;
  //   setSelectedCoinId(selected); // Set the selectedCoinId correctly

  //   // Update price per coin based on the selected item type
  //   if (itemTypeTab === 0) {
  //     const coinObj = coins.find((c: any) => c.coin_id === selected);
  //     if (coinObj) {
  //       setPricePerCoin(coinObj.marketprice);
  //     }
  //   } else {
  //     const dexPairObj = dexPairs.find(
  //       (d: any) => d.contract_address === selected
  //     );
  //     if (dexPairObj) {
  //       setPricePerCoin(dexPairObj.price);
  //     }
  //   }
  // };

  const handleQuantityChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (/^\d*\.?\d*$/.test(val)) setQuantity(val);
    },
    [setQuantity]
  );

  const handlePricePerCoinChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (/^\d*\.?\d*$/.test(val)) setPricePerCoin(val);
    },
    [setPricePerCoin]
  );

  const handleItemTypeChange = useCallback(
    (_: any, value: number) => {
      setItemTypeTab(value);
      // Reset selection when switching type
      setPricePerCoin("");
    },
    [setItemTypeTab, setPricePerCoin]
  );

  // In TransactionModal.tsx, modify the handleAddTransaction function:

  const handleAddTransaction = useCallback(async () => {
    if (!selectedCoinId || !quantity || !pricePerCoin || !dateTime) return;

    // Close modal immediately
    handleCloseModal();

    try {
      const transactionData: PortfolioTransaction = {
        type: modalTab === 0 ? "Buy" : "Sell",
        coin: itemTypeTab === 0 ? selectedCoinId : null,
        contract_address: itemTypeTab === 1 ? selectedCoinId : null,
        quantity: parseFloat(quantity),
        pricePerCoin: parseFloat(pricePerCoin),
        dateTime: dateTime.toISOString(),
        total: parseFloat(quantity) * parseFloat(pricePerCoin),
      };

      // Reset form
      setPricePerCoin("");
      setQuantity("");
      setDateTime(new Date());

      // Process transaction in the background
      await sendTransactionData(transactionData, user.user_id);

      // Refresh only necessary data after adding a transaction
      await Promise.all([
        fetchTransactions(user.user_id),
        fetchUserDetails(user.user_id),
      ]);
    } catch (err) {
      console.error("Error adding transaction:", err);
      // Consider adding a toast notification here to inform the user if the transaction failed
    }
  }, [
    selectedCoinId,
    quantity,
    pricePerCoin,
    dateTime,
    modalTab,
    itemTypeTab,
    user.user_id,
    fetchTransactions,
    fetchUserDetails,
    handleCloseModal,
    setPricePerCoin,
    setQuantity,
    setDateTime,
  ]);

  // Memoize dropdown options
  const dropdownOptions = useMemo(() => {
    if (itemTypeTab === 0) {
      return coins.map((c) => (
        <MenuItem key={c.coin_id} value={String(c.coin_id)}>
          {`${c.coin_name} (${c.symbol})`}
        </MenuItem>
      ));
    } else {
      return dexPairs.map((p) => (
        <MenuItem key={p.contract_address} value={p.contract_address}>
          {p.name}
        </MenuItem>
      ));
    }
  }, [itemTypeTab, coins, dexPairs]);

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      keepMounted={false} // Improve performance by unmounting when closed
    >
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
            onChange={handleItemTypeChange}
            variant="fullWidth"
          >
            <Tab label="Coin" />
            <Tab label="DEX Pair" />
          </Tabs>
          <TextField
            select
            label={itemTypeTab === 0 ? "Select Coin" : "Select DEX Pair"}
            value={selectedCoinId}
            onChange={handleCoinChange}
            fullWidth
            sx={textFieldSx}
            InputProps={textFieldInputProps}
          >
            {dropdownOptions}
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
              ${totalAmount}
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
  );
}

export default React.memo(TransactionModal);
