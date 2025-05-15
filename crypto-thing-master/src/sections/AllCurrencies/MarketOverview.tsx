import React from "react";
import { Box, Card, CardContent, Grid, Typography, Paper } from "@mui/material";
import { Info, RefreshCcw, RotateCw, TrendingUp } from "lucide-react";

// Consistent with the Performers component style
function MarketOverview({
  totalCap,
  tradingVolume,
  dexPairsLength,
  lastUpdated,
  dexExchangesLength,
  dexExchangesGrowing,
}:any) {
  const cards = [
    {
      title: "TOTAL MARKET CAP",
      value: totalCap,
      change: { value: 4.2, isPositive: true },
      icon: <Info size={16} />,
      gradientColor: "linear-gradient(90deg, #0074e4, #005bb7)",
    },
    {
      title: "24H TRADING VOLUME",
      value: tradingVolume,
      change: { value: 1.8, isPositive: true },
      icon: <Info size={16} />,
      gradientColor: "linear-gradient(90deg, #0074e4, #005bb7)",
    },
    {
      title: "TOTAL ACTIVE PAIRS",
      value: dexPairsLength,
      updateInfo: `Updated ${lastUpdated}`,
      icon: <RefreshCcw size={16} />,
      gradientColor: "linear-gradient(90deg, #f3ba2f, #e3a81d)",
    },
    {
      title: "ACTIVE DEX EXCHANGES",
      value: dexExchangesLength,
      growthInfo: {
        value: dexExchangesGrowing,
        label: "exchanges growing",
      },
      icon: <Info size={16} />,
      gradientColor: "linear-gradient(90deg, #16c784, #0fad6d)",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: { xs: "12px", md: "16px" },
              overflow: "hidden",
              background: "white",
              position: "relative",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              },
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top colored border matching the Performers component */}
            <Box
              sx={{
                height: "4px",
                width: "100%",
                background: card.gradientColor,
              }}
            />

            <Box p={2.5} sx={{ flexGrow: 1 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#58667e",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {card.title}
                </Typography>
                <Box
                  sx={{
                    color: "#58667e",
                    opacity: 0.7,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  {card.icon}
                </Box>
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: "1.3rem", sm: "1.4rem" },
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: "#0a1629",
                  mb: 1.5,
                }}
              >
                {card.value}
              </Typography>

              {/* Divider matching the Performers component */}
              <Box
                sx={{
                  height: "1px",
                  background: "rgba(0,0,0,0.1)",
                  width: "100%",
                  my: 1,
                  opacity: 0.6,
                }}
              />

              {/* Bottom content - either percentage change, update info, or growth info */}
              {card.change && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: card.change.isPositive
                        ? "rgba(22, 199, 132, 0.12)"
                        : "rgba(234, 57, 67, 0.12)",
                      color: card.change.isPositive ? "#16c784" : "#ea3943",
                    }}
                  >
                    {card.change.isPositive ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingUp
                        size={16}
                        style={{ transform: "rotate(180deg)" }}
                      />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: card.change.isPositive ? "#16c784" : "#ea3943",
                    }}
                  >
                    {card.change.value}%
                  </Typography>
                </Box>
              )}

              {card.updateInfo && (
                <Box display="flex" alignItems="center" mt={1} color="#58667e">
                  <RotateCw size={16} />
                  <Typography
                    variant="body2"
                    sx={{ ml: 0.5, fontSize: "0.85rem" }}
                  >
                    {card.updateInfo}
                  </Typography>
                </Box>
              )}

              {card.growthInfo && (
                <Box display="flex" alignItems="center" mt={1}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#16c784",
                    }}
                  >
                    <TrendingUp size={16} />
                    <Typography
                      sx={{ ml: 0.5, fontWeight: 600, fontSize: "0.9rem" }}
                    >
                      {card.growthInfo.value}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{ ml: 1, color: "#58667e", fontSize: "0.85rem" }}
                  >
                    {card.growthInfo.label}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default MarketOverview;
