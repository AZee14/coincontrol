import { Visibility } from "@mui/icons-material";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import CoinPerformance from "./CoinPerformance";
import Transactions from "../Home/Transactions";

export default function CoinPage({ coinId }: { coinId: string }) {
  return (
    <Container>
      <Grid container>
        <Grid item xs={6}>
          <Box
            textAlign="left"
            justifyContent="center"
            display="flex"
            flexDirection="column"
          >
            <Typography
              fontWeight="500"
              sx={{ color: "#616e85", fontSize: "22px" }}
            >
              BitCoin (BTC)
            </Typography>
            <Typography
              fontWeight="700"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "34px",
              }}
            >
              $100
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <CoinPerformance/>
      <Typography sx={{fontSize:'18px',fontWeight:'700',mt:4,mb:4}}>Transactions</Typography>
      <Transactions/>
    </Container>
  );
}
