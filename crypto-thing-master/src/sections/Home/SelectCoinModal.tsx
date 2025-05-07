import { Close } from "@mui/icons-material";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React from "react";

function SelectCoinModal({
  handleCloseModal,
  coins,
  handleCoinSelect,
}: {
  handleCloseModal: () => void;
  coins: coins;
  handleCoinSelect: (coin: coin) => void;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Select Coin</Typography>
        <IconButton onClick={handleCloseModal}>
          <Close />
        </IconButton>
      </Box>
      <TextField
        label="Search Coin"
        variant="outlined"
        fullWidth
        sx={{ marginY: 2 }}
      />
      <List>
        {coins.map((coin, index) => (
          <ListItem button key={index} onClick={() => handleCoinSelect(coin)}>
            <ListItemText primary={coin.name} secondary={coin.shorthand} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default SelectCoinModal;
