import React from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  CircularProgress,
  styled,
  alpha,
} from "@mui/material";
import { Search } from "lucide-react";

// Styled components with enhanced visual appeal matching portfolio style
const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "3px 3px 0 0",
    backgroundColor: "#0074e4",
  },
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.95rem",
    minWidth: 0,
    padding: "12px 18px",
    color: "#58667e",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#0074e4",
      backgroundColor: "rgba(0, 116, 228, 0.04)",
    },
    "&.Mui-selected": {
      color: "#0074e4",
      fontWeight: 600,
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 10,
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0074e4",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      boxShadow: `0 0 0 3px rgba(0, 116, 228, 0.15)`,
      borderColor: "#0074e4",
      borderWidth: "1px",
    },
    "& .MuiInputBase-input": {
      padding: "10px 12px",
    },
  },
}));

const SearchTabBar = ({
  tabValue,
  onTabChange,
  searchTerm,
  onSearchChange,
  counts = { coins: 0, dexpairs: 0, exchanges: 0 },
  loading = false,
}: any) => {
  // Format counts with commas if they're large numbers
  const formatCount = (count: number) => {
    return count > 999 ? count.toLocaleString() : count;
  };

  const tabIndicators = [
    { color: "#0074e4", label: "Coins", key: "coins" },
    { color: "#f3ba2f", label: "DEX Pairs", key: "dexpairs" },
    { color: "#16c784", label: "Exchanges", key: "exchanges" },
  ];

  return (
    <Box
      component="header"
      sx={{
        borderBottom: 1,
        borderColor: "rgba(0, 116, 228, 0.2)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
        px: { xs: 0, sm: 1 },
        pb: 1,
        pt: { xs: 1, md: 1 },
        backgroundColor: "#f8faff",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderRadius: { xs: "16px 16px 0 0", md: "24px 24px 0 0" },
      }}
    >
      <StyledTabs
        value={tabValue}
        onChange={onTabChange}
        aria-label="crypto data tabs"
        sx={{ mb: { xs: 2, md: 0 }}}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabIndicators.map((item, index) => (
          <Tab
            key={index}
            label={`${item.label} (${formatCount(counts[item.key])})`}
            icon={
              <span
                className="dot"
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  marginRight: "8px",
                }}
              />
            }
            iconPosition="start"
            sx={{ width: { md: "12rem" } }}
          />
        ))}
      </StyledTabs>

      <StyledTextField
        variant="outlined"
        size="small"
        placeholder="Search by name, symbol..."
        value={searchTerm}
        onChange={onSearchChange}
        sx={{
          width: { xs: "95%", md: "280px", lg: "320px" },
          mx: { xs: "auto", md: 2 },
          mb: { xs: 1, md: 0 },
          transition: "width 0.3s ease, box-shadow 0.2s ease",
          "&:focus-within": {
            width: { md: "320px", lg: "360px" },
            transform: "translateY(-1px)",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} color="#58667e" />
            </InputAdornment>
          ),
          endAdornment: loading && (
            <InputAdornment position="end">
              <CircularProgress size={18} sx={{ color: "#0074e4" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchTabBar;
