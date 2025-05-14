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
    <Grid
      container
      wrap="wrap"
      sx={{
        marginTop: 3,
        gap: 4,
        justifyContent: { xs: "center", sm: "flex-start" },
      }}
    >
      {/** Shared sx for each card **/}
      {[
        {
          label: "All-time profit",
          main: allTimeProfit?.total_profit,
          sub: `${allTimeProfit?.percentage_profit}%`,
          icon:
            allTimeProfit?.total_profit! <= 0 ? <ArrowDropDown /> : <ArrowDropUp />,
          color:
            allTimeProfit?.total_profit! <= 0 ? "#ea3943" : "#16c784",
        },
        {
          label: "Best Performer",
          main: bestPerformer?.coin_name,
          sub: `$${bestPerformer?.total_profit} (${bestPerformer?.percentage_profit}%)`,
          icon:
            bestPerformer?.total_profit! <= 0 ? <ArrowDropDown /> : <ArrowDropUp />,
          color:
            bestPerformer?.total_profit! <= 0 ? "#ea3943" : "#16c784",
        },
        {
          label: "Worst Performer",
          main: worstPerformer?.coin_name,
          sub: `$${String(worstPerformer?.total_loss).replace(/^-/, "")} (${worstPerformer?.percentage_loss}%)`,
          icon:
            worstPerformer?.total_loss! <= 0 ? <ArrowDropDown /> : <ArrowDropUp />,
          color:
            worstPerformer?.total_loss! <= 0 ? "#ea3943" : "#16c784",
        },
      ].map(({ label, main, sub, icon, color }, i) => (
        <Grid item key={i} xs={12} sm={2}>
          <Box
            bgcolor="white"
            p={2}
            borderRadius={4}
            boxShadow={1}
            textAlign="center"
            sx={{
              height: "4.5rem",
              width: { xs: "100%", sm: "9rem" },
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#616e85",
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{ fontSize: "20px", fontWeight: 700 }}
            >
              {main}
            </Typography>
            <Typography
              sx={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "14px",
                fontWeight: 500,
                color,
              }}
            >
              {sub}
              {icon}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export default Performers;
