import { PercentChange } from "@/components/PercentChange";
import { formatNumber } from "@/utils/allCurrencies";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import React from "react"; // Create a memoized row component for each table type
const CoinRow = React.memo(({ coin }: { coin: CoinItem }) => (
  <TableRow hover>
    <TableCell component="th" scope="row">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
        }}
      >
        <Typography sx={{ color: "black", fontSize: "15px" }}>
          {coin.coin_name}
        </Typography>
        <Typography color="secondary" sx={{ fontSize: "14px" }}>
          {coin.symbol.toUpperCase()}
        </Typography>
      </Box>
    </TableCell>
    <TableCell align="right">
      {formatNumber(Number(coin.marketprice))}
    </TableCell>
    <TableCell align="right">{formatNumber(coin.marketcap)}</TableCell>
    <TableCell align="right">
      <PercentChange value={coin.volume1h}>
        {formatNumber(coin.volume1h)}%
      </PercentChange>
    </TableCell>
    <TableCell align="right">
      <PercentChange value={coin.volume24h}>
        {formatNumber(coin.volume24h)}%
      </PercentChange>
    </TableCell>
    <TableCell align="right">
      <PercentChange value={coin.volume7d}>
        {formatNumber(coin.volume7d)}%
      </PercentChange>
    </TableCell>
    <TableCell align="right">{formatNumber(coin.trading_volume_24h)}</TableCell>
    <TableCell align="right">{formatNumber(coin.circulatingsupply)}</TableCell>
  </TableRow>
));

export default CoinRow;
