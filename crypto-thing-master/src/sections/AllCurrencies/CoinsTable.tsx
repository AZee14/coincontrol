import { useState, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableSortLabel,
} from "@mui/material";
import React from "react";
import CoinRow from "./CoinRow";

// Align SortKey with CoinItem properties
type SortKey =
  | "coin_name"
  | "marketprice"
  | "marketcap"
  | "volume1h"
  | "volume24h"
  | "volume7d"
  | "trading_volume_24h"
  | "circulatingsupply";

type SortConfig = {
  key: SortKey;
  direction: "asc" | "desc";
};

const CoinsTable: React.FC<{ data: CoinItem[] }> = React.memo(({ data }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    const { key, direction } = sortConfig;
    return [...data].sort((a, b) => {
      let aVal: number | string = a[key] as any;
      let bVal: number | string = b[key] as any;

      // parse numeric strings (like marketprice "$1.23") to number
      if (typeof aVal === "string" && aVal.match(/[^\d.-]/)) {
        aVal = parseFloat(aVal.replace(/[^0-9.-]+/g, ""));
        bVal = parseFloat((b[key] as string).replace(/[^0-9.-]+/g, ""));
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal ?? "");
      const bStr = String(bVal ?? "");
      return direction === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [data, sortConfig]);

  const handleSort = (key: SortKey) => {
    setSortConfig((current) =>
      current?.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  // Map columns to CoinItem keys
  const columns: { label: string; key: SortKey; align?: "right" }[] = [
    { label: "Name", key: "coin_name" },
    { label: "Price", key: "marketprice", align: "right" },
    { label: "Market Cap", key: "marketcap", align: "right" },
    { label: "1h Vol (USD)", key: "volume1h", align: "right" },
    { label: "24h Vol (USD)", key: "volume24h", align: "right" },
    { label: "7d Vol (USD)", key: "volume7d", align: "right" },
    { label: "Trading Vol (24h)", key: "trading_volume_24h", align: "right" },
    { label: "Circulating Supply", key: "circulatingsupply", align: "right" },
  ];

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ minWidth: 650 }} aria-label="coins table">
        <TableHead>
          <TableRow>
            {columns.map((col) => {
              const active = sortConfig?.key === col.key;
              const direction = active ? sortConfig.direction : undefined;
              return (
                <TableCell
                  key={col.key}
                  align={col.align || "left"}
                  sortDirection={direction ?? false}
                  sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  <TableSortLabel
                    active={!!active}
                    direction={direction}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((coin) => <CoinRow key={coin.coin_id} coin={coin} />)
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                  No coins found matching your search.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default CoinsTable;
