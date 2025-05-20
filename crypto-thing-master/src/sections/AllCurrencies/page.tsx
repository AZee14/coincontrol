"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, TablePagination, Paper, Container, Fade, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import CompareIcon from "@mui/icons-material/CompareArrows";
import "./types";
import { formatNumber, formatDate } from "@/utils/allCurrencies";
import TabPanel from "./TabPanel";
import { getAllDataOnCoins } from "@/utils/coins";
import { getAllDataOnDexPairs, getDexExchanges } from "@/utils/dex";
import MarketOverview from "./MarketOverview";
import SearchTabBar from "./SearchTabBar";
import CoinsTable from "./CoinsTable";
import DexPairsTable from "./DexPairsTable";
import DexExchangesTable from "./DexExchangesTable";
import SkeletonAllCurrencies from "./SkeletonAllCurrencies";

// Create a cache object outside of the component
const dataCache = {
  coins: null as CoinItem[] | null,
  dexPairs: null as DexPairItem[] | null,
  dexExchanges: null as DexExchange[] | null,
  lastFetched: 0,
  expiryTime: 5 * 60 * 1000, // 5 minutes
};

export default function AllCurrencies() {
  const router = useRouter();
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

  // Handle view details click
  const handleViewDetails = useCallback(
    (coinId: string) => {
      router.push(`/coin/${coinId}`);
    },
    [router]
  );

  // Navigate to compare page
  const handleNavigateToCompare = useCallback(() => {
    router.push('/compare');
  }, [router]);

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
      dexpairs: filteredData.dexPairs.length,
      exchanges: filteredData.dexExchanges.length,
    }),
    [filteredData]
  );

  // Get current count based on active tab
  const currentCount = useMemo(() => {
    if (tabValue === 0) return counts.coins;
    if (tabValue === 1) return counts.dexpairs;
    return counts.exchanges;
  }, [tabValue, counts]);

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
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
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
        </Box>

        {/* Compare Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<CompareIcon />}
            onClick={handleNavigateToCompare}
            sx={{
              backgroundColor: '#0074e4',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 116, 228, 0.2)',
              '&:hover': {
                backgroundColor: '#0063c1',
                boxShadow: '0 6px 16px rgba(0, 116, 228, 0.3)',
              },
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Compare Currencies
          </Button>
        </Box>

        {/* Search and Tabs - Positioned outside the relative Box for sticky to work */}
        <Box
          sx={{
            position: "sticky",
            top: { xs: "1.5rem", sm: "2rem", md: "3rem" },
            zIndex: 10,
            marginTop: 3,
            marginBottom: 3,
            marginX: { xs: -3, sm: -4, md: -6 },
            paddingX: { xs: 3, sm: 4, md: 6 },
          }}
        >
          <SearchTabBar
            tabValue={tabValue}
            onTabChange={handleTabChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            counts={counts}
            loading={loading}
          />
        </Box>

        {loading ? (
          <SkeletonAllCurrencies />
        ) : (
          <Box sx={{ mt: 3, minHeight: "400px" }}>
            {/* Tabs content with fade transition */}
            <Fade in={tabValue === 0} timeout={500}>
              <div style={{ display: tabValue === 0 ? "block" : "none" }}>
                <TabPanel value={tabValue} index={0}>
                  <CoinsTable
                    data={paginatedData.coins}
                    onViewDetails={handleViewDetails}
                  />
                </TabPanel>
              </div>
            </Fade>

            <Fade in={tabValue === 1} timeout={500}>
              <div style={{ display: tabValue === 1 ? "block" : "none" }}>
                <TabPanel value={tabValue} index={1}>
                  <DexPairsTable data={paginatedData.dexPairs} />
                </TabPanel>
              </div>
            </Fade>

            <Fade in={tabValue === 2} timeout={500}>
              <div style={{ display: tabValue === 2 ? "block" : "none" }}>
                <TabPanel value={tabValue} index={2}>
                  <DexExchangesTable data={paginatedData.dexExchanges} />
                </TabPanel>
              </div>
            </Fade>

            {/* Pagination with styled appearance */}
            <TablePagination
              component="div"
              count={currentCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                ".MuiTablePagination-toolbar": {
                  borderRadius: "10px",
                  paddingY: 0.5,
                  margin: "1rem 0",
                },
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                  {
                    color: "#58667e",
                    fontWeight: 500,
                  },
                ".MuiTablePagination-select": {
                  paddingBottom: 0,
                },
                ".MuiTablePagination-actions": {
                  "& .MuiIconButton-root": {
                    color: "#0074e4",
                    "&:hover": {
                      backgroundColor: "rgba(0, 116, 228, 0.1)",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
}