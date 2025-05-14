import CoinChart from "@/components/CoinChart";
import {
  Box,
  Chip,
  Fade,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";

function MarketTab({
  selectedTab,
  loading,
  selectedCoin,
  isMobile,
  isTablet,
  handleMarketCoinChange,
  topCoins,
  chartLoaded,
}: any) {
  return (
    <Fade in={selectedTab === 2} timeout={500}>
      <div className="w-full mt-6">
        <section className="mb-12">
          {loading ? (
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
                        {topCoins.map((coin: any) => (
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
                    {topCoins.map((coin: any, index: any) => (
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
}

export default MarketTab;
