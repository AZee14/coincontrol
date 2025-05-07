import React from "react";
import { Grid, Typography, Box, Container, Button } from "@mui/material";
import {
  ArrowDropDown,
  ArrowDropUp,
  CurrencyBitcoin,
  CurrencyFranc,
} from "@mui/icons-material";

function CoinPerformance() {
  return (
    <Grid container sx={{ marginTop: 2, gap: 2 }}>
      {/* First Box */}
      <Grid item xs={12} sm={2}>
        <Box
          bgcolor="white"
          p={2}
          borderRadius={4}
          boxShadow={1}
          sx={{ height: "4.5rem", width: "9rem",display:'flex',gap:0.5,flexDirection:'column' }}
        >
          <Typography
            sx={{ fontSize: "14px", fontWeight: "500", color: "#616e85" }}
          >
            Quantity
          </Typography>
          <Typography sx={{ fontSize: "28px", fontWeight: "700" }}>
            100
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
          sx={{ height: "4.5rem", width: "9rem",display:'flex',gap:0.5,flexDirection:'column' }}
        >
          <Typography
            sx={{ fontSize: "14px", fontWeight: "500", color: "#616e85" }}
          >
            Avg. Buy Price
          </Typography>
          <Typography
            sx={{
              textJustify: "center",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            $20.56
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
          sx={{ height: "4.5rem", width: "9rem",display:'flex',gap:0,flexDirection:'column',position:'relative' }}
        >
          <Typography
            sx={{ fontSize: "14px", fontWeight: "500", color: "#616e85",pl:1 }}
          >
            Total Profit / Loss
          </Typography>
          <Typography
            component="div"
            sx={{
              textJustify: "center",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "28px",
              fontWeight: "700",
              width: "100%",
              pl:1,
              color: "#ea3943",
            //   lineHeight:1
            }}
            >
            + 4.5$
          </Typography>
          <Typography
            component="div"
            sx={{
              width: "100%",
              textJustify: "center",
              display: "inline-flex",
              alignItems: "center",
              color: "#ea3943",
              fontSize: "14px",
              fontWeight: "500",
              position:'absolute',
              bottom:7,
              left:28
            }}
          >
            -3%
            <ArrowDropDown />
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default CoinPerformance;
