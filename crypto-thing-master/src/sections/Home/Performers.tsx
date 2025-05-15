import React from "react";
import { Grid, Typography, Box, Paper, Divider } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface AllTimeProfits {
  total_profit: number;
  percentage_profit: number;
}

interface BestPerformer {
  coin_name: string;
  total_profit: number;
  percentage_profit: number;
}

interface WorstPerformer {
  coin_name: string;
  total_loss: number;
  percentage_loss: number;
}

interface Props {
  allTimeProfit: AllTimeProfits | undefined;
  bestPerformer: BestPerformer | undefined;
  worstPerformer: WorstPerformer | undefined;
}

function Performers({ allTimeProfit, bestPerformer, worstPerformer }: Props) {
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "$0";
    return `$${Math.abs(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return "0%";
    return `${Math.abs(value).toFixed(2)}%`;
  };

  const cards = [
    {
      label: "All-time Profit",
      main: formatCurrency(allTimeProfit?.total_profit),
      sub: formatPercentage(allTimeProfit?.percentage_profit),
      isPositive: allTimeProfit?.total_profit! > 0,
      icon:
        allTimeProfit?.total_profit! > 0 ? (
          <TrendingUp fontSize="small" />
        ) : (
          <TrendingDown fontSize="small" />
        ),
    },
    {
      label: "Best Performer",
      main: bestPerformer?.coin_name || "-",
      sub: bestPerformer
        ? `${formatCurrency(bestPerformer?.total_profit)} (${formatPercentage(
            bestPerformer?.percentage_profit
          )})`
        : "-",
      isPositive: true,
      icon: <TrendingUp fontSize="small" />,
    },
    {
      label: "Worst Performer",
      main: worstPerformer?.coin_name || "-",
      sub: worstPerformer
        ? `${formatCurrency(worstPerformer?.total_loss)} (${formatPercentage(
            worstPerformer?.percentage_loss
          )})`
        : "-",
      isPositive: false,
      icon: <TrendingDown fontSize="small" />,
    },
  ];

  return (
    <Grid
      container
      spacing={2}
      sx={{
        marginTop: 1,
        justifyContent: "space-between",
      }}
    >
      {cards.map((card, i) => (
        <Grid item key={i} xs={12} sm={4} md={3.8}>
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
            {/* Top colored border */}
            <Box
              sx={{
                height: "4px",
                width: "100%",
                background: card.isPositive
                  ? "linear-gradient(90deg, #16c784, #0fad6d)"
                  : "linear-gradient(90deg, #ea3943, #ce303a)",
              }}
            />

            <Box p={2.5} sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#58667e",
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {card.label}
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "1.3rem", sm: "1.4rem" },
                  fontWeight: 600,
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "#0a1629",
                  mb: 1.5,
                }}
              >
                {card.main}
              </Typography>

              <Divider sx={{ my: 1, opacity: 0.6 }} />

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
                    backgroundColor: card.isPositive
                      ? "rgba(22, 199, 132, 0.12)"
                      : "rgba(234, 57, 67, 0.12)",
                    color: card.isPositive ? "#16c784" : "#ea3943",
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: card.isPositive ? "#16c784" : "#ea3943",
                  }}
                >
                  {card.sub}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default Performers;
