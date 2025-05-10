import React, { useEffect, useState } from "react";
import { Grid, Typography, Box, Container, Button } from "@mui/material";
import {
  ArrowDropDown,
  ArrowDropUp,
  CurrencyBitcoin,
  CurrencyFranc,
} from "@mui/icons-material";
import { getAllTimeProfit, getBestPerformer, getTodayCondition, getWorstPerformer } from "@/utils/portfolio";
import { useStytchUser } from "@stytch/nextjs";

function Performers() {
    const { user, isInitialized } = useStytchUser();
  const [allTimeProfit, setAllTimeProfit] = useState();
  const [bestPerformer, setBestPerformer] = useState();
  const [worstPerformer, setWorstPerformer] = useState();
  const [todayCondition, setTodayCondition] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const data1 = await getAllTimeProfit(user!.user_id)
      setAllTimeProfit(data1)
      const data2 = await getBestPerformer(user!.user_id)
      setBestPerformer(data2)
      const data3 = await getTodayCondition(user!.user_id)
      setTodayCondition(data3)
      const data4 = await getWorstPerformer(user!.user_id)
      setWorstPerformer(data4)
      console.log(data1)
      console.log(data2)
      console.log(data3)
      console.log(data4)
    };
    fetchData()
  },[user]);

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
            $5000
          </Typography>
          <Typography
            sx={{
              textJustify: "center",
              display: "inline-flex",
              alignItems: "center",
              color: "#ea3943",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            +10% <ArrowDropDown />
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
            <CurrencyBitcoin />
            Bitcoin
          </Typography>
          <Typography
            sx={{
              textJustify: "center",
              display: "inline-flex",
              alignItems: "center",
              color: "#16c784",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            +$2000 (5%)
            <ArrowDropUp />
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
            <CurrencyFranc />
            Ethereum
          </Typography>
          <Typography
            sx={{
              textJustify: "center",
              display: "inline-flex",
              alignItems: "center",
              color: "#ea3943",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            -$1000 (3%)
            <ArrowDropDown />
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Performers;
