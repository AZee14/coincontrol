import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  Typography,
  TableBody,
  TableContainer,
  Box
} from "@mui/material";
import React from "react";
import { makeStyles } from "@mui/styles";
import { useStytchUser } from "@stytch/nextjs";
import { Delete } from "@mui/icons-material";
import { deleteTransaction } from "@/utils/transactions";
import { Transaction } from "@/types";

const useStyles = makeStyles({
  tc: {
    alignItems: "center",
    height: "80px",
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    textAlign: "right",
  },
  th: {
    textAlign: "right",
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
  },
});

interface TransactionsProps {
  data: Transaction[];
  onTransactionDeleted?: () => void;
}

const Transactions: React.FC<TransactionsProps> = ({
  data,
  onTransactionDeleted,
}) => {
  const classes = useStyles();
  const { user, isInitialized } = useStytchUser();

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      onTransactionDeleted?.();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
        <TableContainer component={Box} sx={{ overflowX: "auto" }}>
      <Table sx={{minWidth:650}}></Table>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: "30%" }}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              Type
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              Coin
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              Price
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              Amount
            </Typography>
          </TableCell>
          <TableCell className={classes.th}>
            <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
              Action
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      {isInitialized && user && (
        <TableBody>
          {data.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell
                className={classes.tc}
                sx={{ textAlign: "left !important" }}
              >
                <Typography sx={{ color: "black", fontSize: "14px" }}>
                  {transaction.Type}
                </Typography>
                <Typography color="secondary" sx={{ fontSize: "12px" }}>
                  {transaction.Date_and_Time_of_Transaction}
                </Typography>
              </TableCell>
              <TableCell className={classes.tc}>
                <Typography sx={{ color: "black", fontSize: "15px" }}>
                  {transaction.Name_of_Coin}
                </Typography>
                <Typography color="secondary" sx={{ fontSize: "14px" }}>
                  {transaction.Shorthand_Notation.toUpperCase()}
                </Typography>
              </TableCell>
              <TableCell className={classes.tc}>
                <Typography sx={{ fontSize: "14px", color: "black" }}>
                  ${transaction.Price_at_Transaction}
                </Typography>
              </TableCell>
              <TableCell className={classes.tc}>
                <Typography sx={{ fontSize: "14px", color: "black" }}>
                  {transaction.Value_in_Dollars}$
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color:
                      Number(transaction.Value_in_Dollars) > 0
                        ? "#16c784"
                        : "#ea3943",
                  }}
                  color="secondary"
                >
                  {transaction.Amount_of_Coin} {transaction.Shorthand_Notation}
                </Typography>
              </TableCell>
              <TableCell className={classes.tc}>
                <Delete
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleDelete(transaction.id as string)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
    </TableContainer>
  );
};

export default Transactions;
