import { PercentChange } from "@/components/PercentChange";
import { formatNumber } from "@/utils/allCurrencies";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  ArrowUpRight,
  Info,
  RefreshCcw,
  RotateCw,
  TrendingUp,
} from "lucide-react";
import React from "react";

function MarketOverview({
  totalCap,
  tradingVolume,
  dexPairsLength,
  lastUpdated,
  dexExchangesLength,
  dexExchangesGrowing,
}: any) {
  return (
    <Grid container spacing={3} sx={{ mb: 4, px: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={2}
          sx={{
            height: "9rem",
            borderRadius: 2,
            position: "relative",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}
        >
          <CardContent sx={{ height: "100%", p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography
                color="text.secondary"
                variant="subtitle2"
                fontWeight="medium"
              >
                TOTAL MARKET CAP
              </Typography>
              <Info size={16} color="#9e9e9e" />
            </Box>
            <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
              {totalCap}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex",
                flexDirection: "row",
              }}
            >
              <PercentChange value={4.2}>4.2%</PercentChange>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={2}
          sx={{
            height: "9rem",
            borderRadius: 2,
            position: "relative",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}
        >
          <CardContent sx={{ height: "100%", p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography
                color="text.secondary"
                variant="subtitle2"
                fontWeight="medium"
              >
                24H TRADING VOLUME
              </Typography>
              <Info size={16} color="#9e9e9e" />
            </Box>
            <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
              {tradingVolume}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex",
                flexDirection: "row",
              }}
            >
              <PercentChange value={1.8}>1.8%</PercentChange>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={2}
          sx={{
            height: "9rem",
            borderRadius: 2,
            position: "relative",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}
        >
          <CardContent sx={{ height: "100%", p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography
                color="text.secondary"
                variant="subtitle2"
                fontWeight="medium"
              >
                TOTAL ACTIVE PAIRS
              </Typography>
              <RefreshCcw size={16} color="#9e9e9e" />
            </Box>
            <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
              {dexPairsLength}
            </Typography>
            <Box display="flex" alignItems="center" color="text.secondary">
              <RotateCw size={16} />
              <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
                Updated {lastUpdated}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={2}
          sx={{
            height: "9rem",
            borderRadius: 2,
            position: "relative",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}
        >
          <CardContent sx={{ height: "100%", p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography
                color="text.secondary"
                variant="subtitle2"
                fontWeight="medium"
              >
                ACTIVE DEX EXCHANGES
              </Typography>
              <Info size={16} color="#9e9e9e" />
            </Box>
            <Typography variant="h5" component="div" fontWeight="bold" mb={1}>
              {dexExchangesLength}
            </Typography>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "success.main",
                }}
              >
                <TrendingUp size={16} />
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ ml: 0.5, fontWeight: "medium" }}
                >
                  {dexExchangesGrowing}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                exchanges growing
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default MarketOverview;
