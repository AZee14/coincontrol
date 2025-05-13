import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

interface Props {
  allTimeProfit: AllTimeProfits | undefined;
  bestPerformer: BestPerformer | undefined;
  worstPerformer: WorstPerformer | undefined;
}

function Performers({ allTimeProfit, bestPerformer, worstPerformer }: Props) {
  return (
    <Grid container sx={{ marginTop: 3, gap: 2 }}>
      {/* First Box */}
      <Grid item xs={12} sm={2}>
        <Box
          bgcolor="white"
          p={2}
          borderRadius={4}
          boxShadow={1}
          textAlign="center"
          sx={{ height: "4.5rem", width: "9rem" }}
        >
          <Typography
            sx={{ fontSize: "14px", fontWeight: "500", color: "#616e85" }}
          >
            All-time profit
          </Typography>
          <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
            {allTimeProfit?.total_profit}
          </Typography>
          <Typography
            sx={{
              textJustify: "center",
              display: "inline-flex",
              alignItems: "center",
              color:
                allTimeProfit?.total_profit == undefined ||
                allTimeProfit?.total_profit <= 0
                  ? "#ea3943"
                  : "#16c784",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {allTimeProfit?.percentage_profit}%
            {allTimeProfit?.total_profit == undefined ||
            allTimeProfit?.total_profit <= 0 ? (
              <ArrowDropDown />
            ) : (
              <ArrowDropUp />
            )}
          </Typography>
        </Box>
      </Grid>
      {/* Second Box */}
      <Grid item xs={12} sm={2}>
        <Box
          bgcolor="white"
          p={2}
          borderRadius={4}
          boxShadow={1}
          textAlign="center"
          sx={{ height: "4.5rem", width: "9rem" }}
        >
          <Typography
            sx={{ fontSize: "14px", fontWeight: "500", color: "#616e85" }}
          >
            Best Performer
          </Typography>
          <Typography
            sx={{
              textJustify: "center",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            {bestPerformer?.coin_name}
          </Typography>
          <Typography
            sx={{
              textJustify: "center",
              display: "inline-flex",
              alignItems: "center",
              color:
                bestPerformer?.total_profit == undefined ||
                bestPerformer?.total_profit <= 0
                  ? "#ea3943"
                  : "#16c784",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            ${bestPerformer?.total_profit} ({bestPerformer?.percentage_profit}%)
            {bestPerformer?.total_profit == undefined ||
            bestPerformer?.total_profit <= 0 ? (
              <ArrowDropDown />
            ) : (
              <ArrowDropUp />
            )}
          </Typography>
        </Box>
      </Grid>
      {/* Third Box */}
      <Grid item xs={12} sm={2}>
        <Box
          bgcolor="white"
          p={2}
          borderRadius={4}
          boxShadow={1}
          textAlign="center"
          sx={{ height: "4.5rem", width: "9rem" }}
        >
          <Typography
            sx={{ fontSize: "14px", fontWeight: "500", color: "#616e85" }}
          >
            Worst Performer
          </Typography>
          <Typography
            sx={{
              textJustify: "center",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            {worstPerformer?.coin_name}
          </Typography>
          <Typography
            sx={{
              textJustify: "center",
              display: "inline-flex",
              alignItems: "center",
              color:
                worstPerformer?.total_loss == undefined ||
                worstPerformer?.total_loss <= 0
                  ? "#ea3943"
                  : "#16c784",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            ${worstPerformer?.total_loss?.toString().replace(/^-\s*/, "")} ({worstPerformer?.percentage_loss}%)
            {worstPerformer?.total_loss == undefined ||
            worstPerformer?.total_loss <= 0 ? (
              <ArrowDropDown />
            ) : (
              <ArrowDropUp />
            )}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Performers;
