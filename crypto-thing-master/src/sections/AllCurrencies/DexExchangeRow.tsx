import { PercentChange } from "@/components/PercentChange";
import { formatNumber } from "@/utils/allCurrencies";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import React from "react";

// eslint-disable-next-line react/display-name
const DexExchangeRow = React.memo(({ exchange }: { exchange: DexExchange }) => (
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
        {exchange.name}
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
        {formatNumber(exchange.volume_24h)}
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
          color:
            exchange.percent_change_volume_24h >= 0 ? "#16c784" : "#ea3943",
        }}
      >
        {exchange.percent_change_volume_24h.toFixed(2)}%
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
        {exchange.num_transactions_24h.toLocaleString()}
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
        {exchange.num_market_pairs.toLocaleString()}
      </Typography>
    </TableCell>
  </TableRow>
));

export default DexExchangeRow;
