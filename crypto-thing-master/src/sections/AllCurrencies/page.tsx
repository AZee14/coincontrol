import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
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
} from "@mui/material";
import "./types";
import { formatNumber, formatDate } from "@/utils/allCurrencies";
import TabPanel from "./TabPanel";
import { getAllDataOnCoins } from "@/utils/coins";
import { getAllDataOnDexPairs, getDexExchanges } from "@/utils/dex";
import { PercentChange } from "@/components/PercentChange";
import MarketOverview from "./MarketOverview";
import SearchTabBar from "./SearchTabBar";

// Create a memoized row component for each table type
const CoinRow = React.memo(({ coin }: { coin: CoinItem }) => (
  <TableRow hover>
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
        <Typography sx={{ color: "black", fontSize: "15px" }}>
          {coin.coin_name}
        </Typography>
        <Typography color="secondary" sx={{ fontSize: "14px" }}>
          {coin.symbol.toUpperCase()}
        </Typography>
      </Box>
    </TableCell>
    <TableCell align="right">
      {formatNumber(Number(coin.marketprice))}
    </TableCell>
    <TableCell align="right">{formatNumber(coin.marketcap)}</TableCell>
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
    <TableCell align="right">{formatNumber(coin.trading_volume_24h)}</TableCell>
    <TableCell align="right">{formatNumber(coin.circulatingsupply)}</TableCell>
  </TableRow>
));
CoinRow.displayName = "CoinRow";

const DexPairRow = React.memo(({ pair }: { pair: DexPairItem }) => (
  <TableRow hover>
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
      </PercentChange>
    </TableCell>
    <TableCell align="right">
      <PercentChange value={pair.percent_change_24h}>
        {pair.percent_change_24h}%
      </PercentChange>
    </TableCell>
    <TableCell align="right">{formatNumber(pair.volume_24h)}</TableCell>
    <TableCell align="right">{formatNumber(pair.liquidity)}</TableCell>
  </TableRow>
));
DexPairRow.displayName = "DexPairRow";

const DexExchangeRow = React.memo(({ exchange }: { exchange: DexExchange }) => (
  <TableRow hover>
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
    <TableCell align="right">{formatNumber(exchange.volume_24h)}</TableCell>
    <TableCell align="right">
      <PercentChange value={exchange.percent_change_volume_24h}>
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
));
DexExchangeRow.displayName = "DexExchangeRow";

// Create table components
const CoinsTable = React.memo(({ data }: { data: CoinItem[] }) => (
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
        {data.length > 0 ? (
          data.map((coin) => <CoinRow key={coin.coin_id} coin={coin} />)
        ) : (
          <TableRow>
            <TableCell colSpan={8} align="center">
              <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                No coins found matching your search.
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
));
CoinsTable.displayName = "CoinsTable";

const DexPairsTable = React.memo(({ data }: { data: DexPairItem[] }) => (
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
        {data.length > 0 ? (
          data.map((pair) => (
            <DexPairRow key={pair.contract_address} pair={pair} />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} align="center">
              <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                No DEX pairs found matching your search.
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
));
DexPairsTable.displayName = "DexPairsTable";

const DexExchangesTable = React.memo(({ data }: { data: DexExchange[] }) => (
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
        {data.length > 0 ? (
          data.map((exchange) => (
            <DexExchangeRow key={exchange.exchange_id} exchange={exchange} />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} align="center">
              <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                No exchanges found matching your search.
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
));
DexExchangesTable.displayName = "DexExchangesTable";

// Create a cache object outside of the component
const dataCache = {
  coins: null as CoinItem[] | null,
  dexPairs: null as DexPairItem[] | null,
  dexExchanges: null as DexExchange[] | null,
  lastFetched: 0,
  expiryTime: 5 * 60 * 1000, // 5 minutes
};

export default function AllCurrencies() {
  const [tabValue, setTabValue] = useState(0);
  const [coins, setCoins] = useState<CoinItem[]>([]);
  const [dexPairs, setDexPairs] = useState<DexPairItem[]>([]);
  const [dexExchanges, setDexExchanges] = useState<DexExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Simulated data fetch using cache
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const now = Date.now();
        const isCacheValid =
          dataCache.lastFetched > 0 &&
          now - dataCache.lastFetched < dataCache.expiryTime;

        if (
          isCacheValid &&
          dataCache.coins &&
          dataCache.dexPairs &&
          dataCache.dexExchanges
        ) {
          // Use cached data
          setCoins(dataCache.coins);
          setDexPairs(dataCache.dexPairs);
          setDexExchanges(dataCache.dexExchanges);
        } else {
          // Fetch fresh data
          const [coinsResponse, dexPairsResponse, dexExchangesResponse] =
            await Promise.all([
              getAllDataOnCoins(),
              getAllDataOnDexPairs(),
              getDexExchanges(),
            ]);

          dataCache.coins = coinsResponse;
          dataCache.dexPairs = dexPairsResponse.results;
          dataCache.dexExchanges = dexExchangesResponse;
          dataCache.lastFetched = now;

          setCoins(coinsResponse);
          setDexPairs(dexPairsResponse.results);
          setDexExchanges(dexExchangesResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tab change handler
  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
      setPage(0);
    },
    []
  );

  // Search handler
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setPage(0);
    },
    []
  );

  // Pagination handlers
  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  // Memoized filtered data
  const filteredData = useMemo(() => {
    const term = debouncedSearchTerm.toLowerCase();

    const filteredCoins = coins.filter(
      (coin) =>
        coin.coin_name.toLowerCase().includes(term) ||
        coin.symbol.toLowerCase().includes(term)
    );

    const filteredDexPairs = dexPairs.filter(
      (pair) =>
        pair.name.toLowerCase().includes(term) ||
        pair.dex_name.toLowerCase().includes(term)
    );

    const filteredDexExchanges = dexExchanges.filter((exchange) =>
      exchange.name.toLowerCase().includes(term)
    );

    return {
      coins: filteredCoins,
      dexPairs: filteredDexPairs,
      dexExchanges: filteredDexExchanges,
    };
  }, [coins, dexPairs, dexExchanges, debouncedSearchTerm]);

  // Memoized paginated data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return {
      coins: filteredData.coins.slice(startIndex, endIndex),
      dexPairs: filteredData.dexPairs.slice(startIndex, endIndex),
      dexExchanges: filteredData.dexExchanges.slice(startIndex, endIndex),
    };
  }, [filteredData, page, rowsPerPage]);

  // Memoized market overview stats
  const marketStats = useMemo(() => {
    if (coins.length === 0) return null;

    return {
      totalCap: formatNumber(
        coins.reduce((sum, coin) => sum + coin.marketcap, 0)
      ),
      tradingVolume: formatNumber(
        coins.reduce((sum, coin) => sum + coin.trading_volume_24h, 0)
      ),
      dexPairsLength: dexPairs.length.toLocaleString(),
      lastUpdated: formatDate(new Date().toISOString()),
      dexExchangesLength: dexExchanges.length.toLocaleString(),
      dexExchangesGrowing: dexExchanges.filter(
        (ex) => ex.percent_change_volume_24h > 0
      ).length,
    };
  }, [coins, dexPairs, dexExchanges]);

  // Calculate counts only when needed
  const counts = useMemo(
    () => ({
      coins: filteredData.coins.length,
      dexPairs: filteredData.dexPairs.length,
      exchanges: filteredData.dexExchanges.length,
    }),
    [filteredData]
  );

  // Get current count based on active tab
  const currentCount = useMemo(() => {
    if (tabValue === 0) return counts.coins;
    if (tabValue === 1) return counts.dexPairs;
    return counts.exchanges;
  }, [tabValue, counts]);

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper", p: 0, m: 0 }}>
      {/* Market Overview Cards */}
      {marketStats && (
        <MarketOverview
          totalCap={marketStats.totalCap}
          tradingVolume={marketStats.tradingVolume}
          dexPairsLength={marketStats.dexPairsLength}
          lastUpdated={marketStats.lastUpdated}
          dexExchangesLength={marketStats.dexExchangesLength}
          dexExchangesGrowing={marketStats.dexExchangesGrowing}
        />
      )}

      {/* Search and Tabs */}
      <SearchTabBar
        tabValue={tabValue}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        counts={counts}
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
        <Box>
          {/* Tabs content */}
          <TabPanel value={tabValue} index={0}>
            <CoinsTable data={paginatedData.coins} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <DexPairsTable data={paginatedData.dexPairs} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <DexExchangesTable data={paginatedData.dexExchanges} />
          </TabPanel>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={currentCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      )}
    </Box>
  );
}
