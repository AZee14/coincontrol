import { PortfolioTransaction } from "@/types";
import { sendTransactionData } from "@/utils/transactions";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Tab,
  Tabs,
  Typography,
  useTheme,
  useMediaQuery,
  Autocomplete,
  TextField,
} from "@mui/material";
import { DateTimeField } from "@mui/x-date-pickers";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import React, { ChangeEvent, useState, useMemo, useCallback } from "react";
import { textFieldInputProps, textFieldSx } from "./styles";
import dayjs from "dayjs";

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

const TransactionModal: React.FC<TransactionModalProps> = React.memo(({ 
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
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // Local state to keep selected option stable
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Update selectedItem if pricePerCoin or itemTypeTab changes externally
  useMemo(() => {
    if (itemTypeTab === 0) {
      const match = coins.find(c => String(c.marketprice) === pricePerCoin);
      setSelectedItem(match || null);
    } else {
      const match = dexPairs.find(d => String(d.price) === pricePerCoin);
      setSelectedItem(match || null);
    }
  }, [pricePerCoin, itemTypeTab, coins, dexPairs]);

  const isAddTransactionDisabled =
    !selectedItem || !quantity || !pricePerCoin || !dateTime;

  const totalAmount = useMemo(() =>
    (Number(quantity) * Number(pricePerCoin)).toFixed(4)
  , [quantity, pricePerCoin]);

  const handleModalTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => setModalTab(newValue),
    [setModalTab]
  );
  const handleCloseModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);

  const handleOptionChange = useCallback(
    (_: any, value: any) => {
      setSelectedItem(value);
      if (!value) {
        setPricePerCoin("");
        return;
      }
      if (itemTypeTab === 0) {
        setPricePerCoin(value.marketprice);
      } else {
        setPricePerCoin(value.price);
      }
    },
    [itemTypeTab, setPricePerCoin]
  );

  const handleQuantityChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (/^\d*\.?\d*$/.test(val)) {
        setQuantity(val);
        setSelectedItem(null); // clear selection if manual override
      }
    },
    [setQuantity]
  );

  const handlePricePerCoinChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (/^\d*\.?\d*$/.test(val)) {
        setPricePerCoin(val);
        setSelectedItem(null);
      }
    },
    [setPricePerCoin]
  );

  const handleItemTypeChange = useCallback(
    (_: any, value: number) => {
      setItemTypeTab(value);
      setPricePerCoin("");
      setSelectedItem(null);
    },
    [setItemTypeTab, setPricePerCoin]
  );

  const handleAddTransaction = useCallback(async () => {
    if (!selectedItem || !quantity || !pricePerCoin || !dateTime) return;
    handleCloseModal();
    try {
      const transactionData: PortfolioTransaction = {
        type: modalTab === 0 ? "Buy" : "Sell",
        coin: itemTypeTab === 0 ? String(selectedItem.coin_id) : null,
        contract_address: itemTypeTab === 1 ? selectedItem.contract_address : null,
        quantity: parseFloat(quantity),
        pricePerCoin: parseFloat(pricePerCoin),
        dateTime: dateTime.toISOString(),
        total: parseFloat(quantity) * parseFloat(pricePerCoin),
      };
      setPricePerCoin("");
      setQuantity("");
      setDateTime(new Date());
      await sendTransactionData(transactionData, user.user_id);
      await Promise.all([
        fetchTransactions(user.user_id),
        fetchUserDetails(user.user_id),
      ]);
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  }, [
    selectedItem,
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

  const options = itemTypeTab === 0 ? coins : dexPairs;
  const getOptionLabel = (option: any) =>
    itemTypeTab === 0
      ? `${option.coin_name} (${option.symbol})`
      : option.name;

  return (
    <Modal open={isModalOpen} onClose={handleCloseModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: '95%', sm: '27rem' },
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant={isSmall ? 'h6' : 'h5'} fontWeight={600}>
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
          sx={{ mt: 2 }}
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

          <Autocomplete
            options={options}
            value={selectedItem}
            onChange={handleOptionChange}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(opt, val) =>
              itemTypeTab === 0
                ? opt.coin_id === val.coin_id
                : opt.contract_address === val.contract_address
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={itemTypeTab === 0 ? 'Select Coin' : 'Select DEX Pair'}
                fullWidth
                sx={textFieldSx}
                InputProps={{
                  ...params.InputProps,
                  ...textFieldInputProps,
                }}
              />
            )}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                value={quantity}
                onChange={handleQuantityChange}
                fullWidth
                sx={textFieldSx}
                InputProps={textFieldInputProps}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
              fullWidth
              sx={textFieldSx}
              InputProps={textFieldInputProps}
            />
          </DemoItem>

          <Box
            sx={{
              backgroundColor: 'grey.100',
              borderRadius: 1,
              p: 2,
              mt: 1,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              {modalTab === 0 ? 'Total Spent ($)' : 'Total Received ($)'}
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              ${totalAmount}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            disabled={isAddTransactionDisabled}
            onClick={handleAddTransaction}
            sx={{ height: 48, borderRadius: 1 }}
          >
            Add Transaction
          </Button>
        </Box>
      </Box>
    </Modal>
  );
});

export default TransactionModal;
