import { PercentChange } from "@/components/PercentChange";
import { formatNumber } from "@/utils/allCurrencies";
import { Box, Chip, TableCell, TableRow, Typography } from "@mui/material";
import React from "react";

// eslint-disable-next-line react/display-name
const DexPairRow = React.memo(({ pair }: { pair: DexPairItem }) => (
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
        {pair.name}
      </Typography>
      <Typography color="secondary" sx={{ fontSize: "14px" }}>
        {pair.dex_name}
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
        ${pair.price.toFixed(4)}
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
          color: pair.percent_change_1h >= 0 ? "#16c784" : "#ea3943",
        }}
      >
        {pair.percent_change_1h}%
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
          color: pair.percent_change_24h >= 0 ? "#16c784" : "#ea3943",
        }}
      >
        {pair.percent_change_24h}%
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
        {formatNumber(pair.volume_24h)}
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
        {formatNumber(pair.liquidity)}
      </Typography>
    </TableCell>
  </TableRow>
));

export default DexPairRow;
