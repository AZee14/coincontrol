import { PercentChange } from '@/components/PercentChange';
import { formatNumber } from '@/utils/allCurrencies';
import { Box, Chip, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react'

// eslint-disable-next-line react/display-name
const DexPairRow = React.memo(({ pair }: { pair: DexPairItem }) => (
  <TableRow hover>
    <TableCell component="th" scope="row">
      <Typography
        variant="body2"
        fontWeight="medium"
        sx={{ textTransform: "uppercase" }}
      >
        {pair.name}
      </Typography>
    </TableCell>
    <TableCell>
      <Chip
        label={pair.dex_name}
        size="small"
        sx={{ textTransform: "capitalize" }}
      />
    </TableCell>
    <TableCell>${pair.price.toFixed(4)}</TableCell>
    <TableCell align="right">
      <PercentChange value={pair.percent_change_1h}>
        {pair.percent_change_1h}%
      </PercentChange>
    </TableCell>
    <TableCell align="right">
      <PercentChange value={pair.percent_change_24h}>
        {pair.percent_change_24h}%
      </PercentChange>
    </TableCell>
    <TableCell align="right">{formatNumber(pair.volume_24h)}</TableCell>
    <TableCell align="right">{formatNumber(pair.liquidity)}</TableCell>
  </TableRow>
));

export default DexPairRow
