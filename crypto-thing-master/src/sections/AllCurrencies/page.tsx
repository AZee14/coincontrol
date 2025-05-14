import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Chip,
  InputAdornment,
  TextField,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Search, RefreshCw, TrendingUp, RotateCw } from "lucide-react";
import "./types";
import { formatNumber, formatDate } from "@/utils/allCurrencies";
import TabPanel from "./TabPanel";
import { getAllDataOnCoins } from "@/utils/coins";
import { getAllDataOnDexPairs, getDexExchanges } from "@/utils/dex";
import { PercentChange } from "@/components/PercentChange";
import MarketOverview from "./MarketOverview";
import SearchTabBar from "./SearchTabBar";

export default function AllCurrencies() {
  const [tabValue, setTabValue] = useState(0);
  const [coins, setCoins] = useState<CoinItem[]>([]);
  const [dexPairs, setDexPairs] = useState<DexPairItem[]>([]);
  const [dexExchanges, setDexExchanges] = useState<DexExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Simulated data fetch (replace with your actual API calls)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace these with your actual API calls
        const coinsResponse = await getAllDataOnCoins();
        setCoins(coinsResponse);

        const dexPairsResponse = await getAllDataOnDexPairs();
        setDexPairs(dexPairsResponse.results);

        const dexExchangesResponse = await getDexExchanges();
        setDexExchanges(dexExchangesResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };

  // Search handler
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter data based on search term
  const filteredCoins = coins.filter(
    (coin) =>
      coin.coin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDexPairs = dexPairs.filter(
    (pair) =>
      pair.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pair.dex_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDexExchanges = dexExchanges.filter((exchange) =>
    exchange.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedCoins = filteredCoins.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const paginatedDexPairs = filteredDexPairs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const paginatedDexExchanges = filteredDexExchanges.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper", pt: 3 }}>
      {/* Market Overview Cards */}
      <MarketOverview
        totalCap={formatNumber(
          coins.reduce((sum, coin) => sum + coin.marketcap, 0)
        )}
        tradingVolume={formatNumber(
          coins.reduce((sum, coin) => sum + coin.trading_volume_24h, 0)
        )}
        dexPairsLength={dexPairs.length.toLocaleString()}
        lastUpdated={formatDate(new Date().toISOString())}
        dexExchangesLength={dexExchanges.length.toLocaleString()}
        dexExchangesGrowing={
          dexExchanges.filter((ex) => ex.percent_change_volume_24h > 0).length
        }
      />

      {/* Search and Tabs */}
      <SearchTabBar
        tabValue={tabValue}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        counts={{
          coins: filteredCoins.length,
          dexPairs: filteredDexPairs.length,
          exchanges: filteredDexExchanges.length,
        }}
        loading={loading}
      />

      {loading ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading data...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Coins Tab */}
          <TabPanel value={tabValue} index={0}>
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }} aria-label="coins table">
                <TableHead>
                  <TableRow>
                    <TableCell>Coin</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Market Cap</TableCell>
                    <TableCell align="right">1h%</TableCell>
                    <TableCell align="right">24h%</TableCell>
                    <TableCell align="right">7d%</TableCell>
                    <TableCell align="right">Volume (24h)</TableCell>
                    <TableCell align="right">Circulating Supply</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCoins.length > 0 ? (
                    paginatedCoins.map((coin) => (
                      <TableRow key={coin.coin_id} hover>
                        <TableCell component="th" scope="row">
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              paddingTop: 0,
                              paddingBottom: 0,
                              paddingRight: 0,
                            }}
                          >
                            <Typography
                              sx={{ color: "black", fontSize: "15px" }}
                            >
                              {coin.coin_name}
                            </Typography>
                            <Typography
                              color="secondary"
                              sx={{ fontSize: "14px" }}
                            >
                              {coin.symbol.toUpperCase()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(Number(coin.marketprice))}
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(coin.marketcap)}
                        </TableCell>
                        <TableCell align="right">
                          <PercentChange value={coin.volume1h}>
                            {formatNumber(coin.volume1h)}%
                          </PercentChange>
                        </TableCell>
                        <TableCell align="right">
                          <PercentChange value={coin.volume24h}>
                            {formatNumber(coin.volume24h)}%
                          </PercentChange>
                        </TableCell>
                        <TableCell align="right">
                          <PercentChange value={coin.volume7d}>
                            {formatNumber(coin.volume7d)}%
                          </PercentChange>
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(coin.trading_volume_24h)}
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(coin.circulatingsupply)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ py: 2 }}
                        >
                          No coins found matching your search.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* DEX Pairs Tab */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }} aria-label="dex pairs table">
                <TableHead>
                  <TableRow>
                    <TableCell>Pair</TableCell>
                    <TableCell>DEX</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">1h%</TableCell>
                    <TableCell align="right">24%</TableCell>
                    <TableCell align="right">Volume (24h)</TableCell>
                    <TableCell align="right">Liquidity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedDexPairs.length > 0 ? (
                    paginatedDexPairs.map((pair) => (
                      <TableRow key={pair.contract_address} hover>
                        <TableCell component="th" scope="row">
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{ textTransform: "uppercase" }}
                          >
                            {pair.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={pair.dex_name}
                            size="small"
                            sx={{ textTransform: "capitalize" }}
                          />
                        </TableCell>
                        <TableCell>${pair.price.toFixed(3)}</TableCell>

                        <TableCell align="right">
                          <PercentChange value={pair.percent_change_1h}>
                            {pair.percent_change_1h}%
                          </PercentChange>{" "}
                        </TableCell>
                        <TableCell align="right">
                          <PercentChange value={pair.percent_change_24h}>
                            {pair.percent_change_24h}%
                          </PercentChange>{" "}
                        </TableCell>

                        <TableCell align="right">
                          {formatNumber(pair.volume_24h)}
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(pair.liquidity)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ py: 2 }}
                        >
                          No DEX pairs found matching your search.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* DEX Exchanges Tab */}
          <TabPanel value={tabValue} index={2}>
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }} aria-label="dex exchanges table">
                <TableHead>
                  <TableRow>
                    <TableCell>Exchange</TableCell>
                    <TableCell align="right">Volume (24h)</TableCell>
                    <TableCell align="right">Volume Change (24h)</TableCell>
                    <TableCell align="right">Transactions (24h)</TableCell>
                    <TableCell align="right">Market Pairs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedDexExchanges.length > 0 ? (
                    paginatedDexExchanges.map((exchange) => (
                      <TableRow key={exchange.exchange_id} hover>
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="body2"
                              fontWeight="medium"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {exchange.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(exchange.volume_24h)}
                        </TableCell>
                        <TableCell align="right">
                          <PercentChange
                            value={exchange.percent_change_volume_24h}
                          >
                            {exchange.percent_change_volume_24h.toFixed(2)}%
                          </PercentChange>
                        </TableCell>
                        <TableCell align="right">
                          {exchange.num_transactions_24h.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {exchange.num_market_pairs.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ py: 2 }}
                        >
                          No exchanges found matching your search.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={
              tabValue === 0
                ? filteredCoins.length
                : tabValue === 1
                ? filteredDexPairs.length
                : filteredDexExchanges.length
            }
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </>
      )}
    </Box>
  );
}
