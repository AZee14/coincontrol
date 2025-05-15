import { PercentChange } from "@/components/PercentChange";
import { formatNumber } from "@/utils/allCurrencies";
import { Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react"; // Create a memoized row component for each table type
// eslint-disable-next-line react/display-name
const CoinRow = React.memo(
  ({
    coin,
    onViewDetails,
  }: {
    coin: CoinItem;
    onViewDetails: (coinId: string) => void;
  }) => (
    <TableRow hover sx={{ height: "80px" }}>
      <TableCell
        sx={{
          textAlign: "left",
          height: "80px",
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <Typography sx={{ color: "black", fontSize: "15px" }}>
          {coin.coin_name}
        </Typography>
        <Typography color="secondary" sx={{ fontSize: "14px" }}>
          {coin.symbol.toUpperCase()}
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          textAlign: "right",
          height: "80px",
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
        }}
      >
        <Typography sx={{ fontSize: "14px", color: "black" }}>
          {coin.marketprice}
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          textAlign: "right",
          height: "80px",
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
        }}
      >
        <Typography sx={{ fontSize: "14px", color: "black" }}>
          {formatNumber(coin.marketcap)}
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          textAlign: "right",
          height: "80px",
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            color: coin.volume1h >= 0 ? "#16c784" : "#ea3943",
          }}
        >
          {formatNumber(coin.volume1h)}%
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          textAlign: "right",
          height: "80px",
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            color: coin.volume24h >= 0 ? "#16c784" : "#ea3943",
          }}
        >
          {formatNumber(coin.volume24h)}%
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          textAlign: "right",
          height: "80px",
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            color: coin.volume7d >= 0 ? "#16c784" : "#ea3943",
          }}
        >
          {formatNumber(coin.volume7d)}%
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          textAlign: "right",
          height: "80px",
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
        }}
      >
        <Typography sx={{ fontSize: "14px", color: "black" }}>
          {formatNumber(coin.trading_volume_24h)}
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          textAlign: "right",
          height: "80px",
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
        }}
      >
        <Typography sx={{ fontSize: "14px", color: "black" }}>
          {formatNumber(coin.circulatingsupply)}
        </Typography>
      </TableCell>
      <TableCell
        align="center"
        sx={{
          height: "80px",
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
        }}
      >
        <Tooltip title="View Details">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onViewDetails(coin.coin_id)}
            aria-label="view coin details"
          >
            <Visibility />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
);

export default CoinRow;
