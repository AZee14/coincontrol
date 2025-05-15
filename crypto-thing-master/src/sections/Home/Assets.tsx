"use client";
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  Typography,
  TableBody,
  CircularProgress,
  Box,
  Button,
  TableContainer,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useStytchUser } from "@stytch/nextjs";
import { createClient } from "@supabase/supabase-js";

// Define the type for asset data
export interface AssetData {
  coin_id?: string | number | null;
  contract_address?: string | null;
  name: string;
  shorthand: string;
  current_price?: number;
  currentPrice?: number;
  hourly_change?: string | number;
  hourlyChange?: string | number;
  daily_change?: string | number;
  dailyChange?: string | number;
  weekly_change?: string | number;
  weeklyChange?: string | number;
  holding_value?: number;
  holdingValue?: number;
  holding_amount?: number;
  holdingAmount?: number;
  avg_buy_price?: number;
  avgBuyPrice?: number;
  profit_loss_amount?: number;
  profitLossAmount?: number;
  profit_loss_percentage?: string | number;
  profitLossPercentage?: string | number;
  user_id?: string;
}
interface AssetsProps {
  onBuySellClick: (asset: AssetData) => void;
  onViewDetailedAnalysis: (asset: AssetData) => void; // Add this prop
  
}

const useStyles = makeStyles({
  tc: {
    alignItems: "center",
    height: "80px",
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    textAlign: "right",
  },
  th: {
    textAlign: "right",
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
  },
});

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL or Key is not defined in environment variables."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: "cryptothing" },
});

function Assets({ onBuySellClick, onViewDetailedAnalysis, assets, loading }: AssetsProps & { assets: AssetData[]; loading: boolean }) {
  const classes = useStyles();
  const { user, isInitialized } = useStytchUser();

  // Fallback for loading state
  if (loading && isInitialized && user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Box} sx={{ overflowX: "auto" }}>
      <Table sx={{minWidth:650}}>      <TableHead>
        <TableRow>
          <TableCell sx={{ width: "25%" }}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              Name
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              Price
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              1h%
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              24h%
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              7d%
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              Holdings
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              Avg Buy Price
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              Profit/Loss
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              Actions
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      {isInitialized && user && (
        <TableBody>
          {assets?.length > 0 ? (
            assets.map((asset: any, index: any) => (
              <TableRow key={index}>
                <TableCell
                  className={classes.tc}
                  sx={{ textAlign: "left !important" }}
                >
                  <Typography sx={{ color: "black", fontSize: "15px" }}>
                    {asset.name}
                  </Typography>
                  <Typography color="secondary" sx={{ fontSize: "14px" }}>
                    {asset.shorthand?.toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell className={classes.tc}>
                  <Typography sx={{ fontSize: "14px", color: "black" }}>
                    ${asset.current_price}
                  </Typography>
                </TableCell>
                <TableCell className={classes.tc}>
                  <Typography
                    sx={{
                      color:
                        Number(asset.hourly_change) > 0 ? "#16c784" : "#ea3943",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {Number(asset.hourly_change) > 0 ? (
                      <ArrowDropUp />
                    ) : (
                      <ArrowDropDown />
                    )}
                    {asset.hourly_change}%
                  </Typography>
                </TableCell>
                <TableCell className={classes.tc}>
                  <Typography
                    sx={{
                      color:
                        Number(asset.daily_change) > 0 ? "#16c784" : "#ea3943",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {Number(asset.daily_change) > 0 ? (
                      <ArrowDropUp />
                    ) : (
                      <ArrowDropDown />
                    )}
                    {asset.daily_change}%
                  </Typography>
                </TableCell>
                <TableCell className={classes.tc}>
                  <Typography
                    sx={{
                      color:
                        Number(asset.weekly_change) > 0 ? "#16c784" : "#ea3943",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {Number(asset.weekly_change) > 0 ? (
                      <ArrowDropUp />
                    ) : (
                      <ArrowDropDown />
                    )}
                    {asset.weekly_change}%
                  </Typography>
                </TableCell>
                <TableCell className={classes.tc}>
                  <Typography sx={{ fontSize: "14px", color: "black" }}>
                    ${asset.holding_value?.toFixed(3)}
                  </Typography>
                  <Typography sx={{ fontSize: "12px" }} color="secondary">
                    {asset.holding_amount} {asset.shorthand}
                  </Typography>
                </TableCell>
                <TableCell className={classes.tc}>
                  <Typography sx={{ fontSize: "14px" }}>
                    ${asset.avg_buy_price}
                  </Typography>
                </TableCell>
                <TableCell className={classes.tc}>
                  <Typography sx={{ fontSize: "14px" }}>
                    ${asset.profit_loss_amount}
                  </Typography>
                  <Typography
                    sx={{
                      color:
                        Number(asset.profit_loss_percentage) > 0
                          ? "#16c784"
                          : "#ea3943",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "12px",
                      justifyContent: "flex-end",
                    }}
                  >
                    {Number(asset.profit_loss_percentage) > 0 ? (
                      <ArrowDropUp />
                    ) : (
                      <ArrowDropDown />
                    )}
                    {asset.profit_loss_percentage || 0}%
                  </Typography>
                </TableCell>
                <TableCell className={classes.tc}>
                  <Typography
                    sx={{
                      fontWeight: "600",
                      cursor: "pointer",
                      color: "#1976d2",
                    }}
                    onClick={() => onBuySellClick(asset)}
                  >
                    Buy/Sell
                  </Typography>
                </TableCell>
                
                <Button
  variant="text"
  size="small"
  onClick={() => onViewDetailedAnalysis(asset)}
>
  View detailed analysis
</Button>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography sx={{ p: 3 }}>
                  No assets found. Add some crypto to your portfolio!
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      )}
      {(!isInitialized || !user) && (
        <TableBody>
          <TableRow>
            <TableCell colSpan={9} align="center">
              <Typography sx={{ p: 3 }}>
                Please log in to see your assets.
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
    </TableContainer>
  );
}

export default Assets;
