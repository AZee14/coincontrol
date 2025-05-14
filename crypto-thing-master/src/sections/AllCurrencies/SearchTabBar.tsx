import React from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  styled,
  alpha,
} from "@mui/material";
import { Search, RefreshCw } from "lucide-react";

// Styled components for enhanced visual appeal
const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "3px 3px 0 0",
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 500,
    fontSize: "0.925rem",
    minWidth: 0,
    padding: "12px 16px",
    "&:hover": {
      color: theme.palette.primary.main,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.15)} 0 0 0 2px`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const SearchTabBar = ({
  tabValue,
  onTabChange,
  searchTerm,
  onSearchChange,
  counts = { coins: 0, dexPairs: 0, exchanges: 0 },
  loading = false,
}: any) => {
  // Format counts with commas if they're large numbers
  const formatCount = (count: any) => {
    return count > 999 ? count.toLocaleString() : count;
  };

  return (
    <Box
      component="header"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
        px: { xs: 2, lg: 3 },
        pb: 1,
        pt: 0,
        mt: 0,
        // pt: { xs: 1, md: 2 },
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: (theme) => `-${theme.spacing(3)}`,
        zIndex: 10,
      }}
    >
      <StyledTabs
        value={tabValue}
        onChange={onTabChange}
        aria-label="crypto data tabs"
        sx={{ mb: { xs: 2, md: 0 } }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab
          label={`Coins (${formatCount(counts.coins)})`}
          icon={
            <span
              className="dot"
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#3861fb",
                marginRight: "6px",
              }}
            />
          }
          iconPosition="start"
        />
        <Tab
          label={`DEX Pairs (${formatCount(counts.dexPairs)})`}
          icon={
            <span
              className="dot"
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#f3ba2f",
                marginRight: "6px",
              }}
            />
          }
          iconPosition="start"
        />
        <Tab
          label={`Exchanges (${formatCount(counts.exchanges)})`}
          icon={
            <span
              className="dot"
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#16c784",
                marginRight: "6px",
              }}
            />
          }
          iconPosition="start"
        />
      </StyledTabs>

      <StyledTextField
        variant="outlined"
        size="small"
        placeholder="Search by name, symbol..."
        value={searchTerm}
        onChange={onSearchChange}
        sx={{
          width: { xs: "100%", md: "300px", lg: "340px" },
          transition: "width 0.3s ease",
          "&:focus-within": {
            width: { md: "340px", lg: "380px" },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} />
            </InputAdornment>
          ),
          endAdornment: loading ?? (
            <InputAdornment position="end">
              <CircularProgress size={18} color="primary" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchTabBar;
