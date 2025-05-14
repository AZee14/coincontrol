import { PercentChange } from '@/components/PercentChange';
import { formatNumber } from '@/utils/allCurrencies';
import { Box, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react'

const DexExchangeRow = React.memo(({ exchange }: { exchange: DexExchange }) => (
  <TableRow hover>
    <TableCell component="th" scope="row">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          variant="body2"
          fontWeight="medium"
          sx={{ textTransform: "capitalize" }}
        >
          {exchange.name}
        </Typography>
      </Box>
    </TableCell>
    <TableCell align="right">{formatNumber(exchange.volume_24h)}</TableCell>
    <TableCell align="right">
      <PercentChange value={exchange.percent_change_volume_24h}>
        {exchange.percent_change_volume_24h.toFixed(2)}%
      </PercentChange>
    </TableCell>
    <TableCell align="right">
      {exchange.num_transactions_24h.toLocaleString()}
    </TableCell>
    <TableCell align="right">
      {exchange.num_market_pairs.toLocaleString()}
    </TableCell>
  </TableRow>
));


export default DexExchangeRow
