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
import DexPairRow from "./DexPairRow";

export interface DexPairItem {
  name: string;
  dex_name: string;
  contract_address: string;
  liquidity: number;
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
}

interface HeadCell {
  id: keyof DexPairItem;
  label: string;
  align: "left" | "right";
}

const headCells: HeadCell[] = [
  { id: "name", label: "Pair", align: "left" },
  { id: "dex_name", label: "DEX", align: "left" },
  { id: "price", label: "Price", align: "right" },
  { id: "percent_change_1h", label: "1h%", align: "right" },
  { id: "percent_change_24h", label: "24h%", align: "right" },
  { id: "volume_24h", label: "Volume (24h)", align: "right" },
  { id: "liquidity", label: "Liquidity", align: "right" },
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

interface DexPairsTableProps {
  data: DexPairItem[];
}

const DexPairsTable: FC<DexPairsTableProps> = React.memo(({ data }) => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof DexPairItem>("name");

  const handleRequestSort = (property: keyof DexPairItem) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = useMemo(() => {
    return stableSort(data, getComparator(order, orderBy));
  }, [data, order, orderBy]);

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ minWidth: 650 }} aria-label="dex pairs table">
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
            sortedData.map((pair) => (
              <DexPairRow key={pair.contract_address} pair={pair} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headCells.length} align="center">
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ py: 2 }}
                >
                  No DEX pairs found matching your search.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default DexPairsTable;
