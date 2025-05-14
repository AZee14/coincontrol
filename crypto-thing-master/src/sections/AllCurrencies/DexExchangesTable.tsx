import React, { FC, useState, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import DexExchangeRow from "./DexExchangeRow";

export interface DexExchange {
  exchange_id: string;
  name: string;
  volume_24h: number;
  percent_change_volume_24h: number;
  num_transactions_24h: number;
  num_market_pairs: number;
}

interface HeadCell {
  id: keyof DexExchange;
  label: string;
  align: "left" | "right";
}

const headCells: HeadCell[] = [
  { id: "name", label: "Exchange", align: "left" },
  { id: "volume_24h", label: "Volume (24h)", align: "right" },
  {
    id: "percent_change_volume_24h",
    label: "Volume Change (24h)",
    align: "right",
  },
  { id: "num_transactions_24h", label: "Transactions (24h)", align: "right" },
  { id: "num_market_pairs", label: "Market Pairs", align: "right" },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: "asc" | "desc",
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  const stabilized = array.map((el, index) => [el, index] as [T, number]);
  stabilized.sort((a, b) => {
    const comp = comparator(a[0], b[0]);
    if (comp !== 0) return comp;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

interface DexExchangesTableProps {
  data: DexExchange[];
}

const DexExchangesTable: FC<DexExchangesTableProps> = React.memo(({ data }) => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof DexExchange>("name");

  const handleRequestSort = (property: keyof DexExchange) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = useMemo(() => {
    return stableSort(data, getComparator(order, orderBy));
  }, [data, order, orderBy]);

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ minWidth: 650 }} aria-label="dex exchanges table">
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={headCell.align}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={() => handleRequestSort(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((exchange) => (
              <DexExchangeRow key={exchange.exchange_id} exchange={exchange} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headCells.length} align="center">
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ py: 2 }}
                >
                  No exchanges found matching your search.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

DexExchangesTable.displayName = "DexExchangesTable";

export default DexExchangesTable;
