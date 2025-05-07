import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  Typography,
  TableBody,
} from "@mui/material";
import React, { Key, useState } from "react";
import { makeStyles } from "@mui/styles";
import { useStytchUser } from "@stytch/nextjs";
import { Delete } from "@mui/icons-material";
import { deleteTransaction } from "@/utils/transactions";
// Import the shared Transaction type
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
}

function Transactions({ data }: TransactionsProps) {
  const classes = useStyles();
  const { user, isInitialized } = useStytchUser();
  const [transactions, setTransactions] = useState<Transaction[]>(data);

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    // Filter out the deleted transaction from the display
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  };

  return (
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
          {transactions.map((transaction) => (
            <TableRow key={transaction.id as Key}>
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
  );
}

export default Transactions;