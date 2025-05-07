"use client"
import {
  Box,
  Button,
  Container,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Assets from "../Home/Assets";
import Transactions from "../Home/Transactions";
import Link from "next/link";

function LandingPage() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = ["Assets", "Transactions"];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Container
      sx={{
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        borderRadius: "16px",
        padding: "2rem",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
        <Typography
          color="primary"
          sx={{ fontSize: "2rem", fontWeight: "700", textAlign: "center" }}
        >
          Sign up Today
        </Typography>
        <Typography
          sx={{
            color: "#333",
            fontSize: "2.5rem",
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          Crypto Coin Control
        </Typography>
        <Typography
          sx={{
            color: "#58667e",
            fontSize: "1.2rem",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          Keep track of your profits, losses, and portfolio valuation with our
          easy-to-use platform.
        </Typography>
        <Box>
          <Button
            variant="contained"
            sx={{
              borderRadius: "8px",
              width: "12rem",
              height: "3.5rem",
              paddingX: "1.5rem",
              mt: 2,
              background: "linear-gradient(90deg, #007bff, #0056b3)",
              boxShadow: "0px 4px 10px rgba(0, 123, 255, 0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #0056b3, #003f7f)",
              },
            }}
          >
            <Typography
              sx={{
                textTransform: "none",
                fontWeight: "600",
                fontSize: "16px",
                lineHeight: "1.5rem",
                color: "#fff",
              }}
            >
              <Link href="/login" style={{ textDecoration: "none", color: "inherit" }}>
                Log In / Sign Up
              </Link>
            </Typography>
          </Button>
        </Box>
      </Box>
      <Divider sx={{ width: "100%", mt: 4, mb: 2 }} />
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          "& .MuiTab-root": {
            color: "gray",
            fontWeight: "600",
            fontSize: "1rem",
          },
          "& .Mui-selected": {
            color: "#007bff",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#007bff",
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} wrapped={false} label={tab} />
        ))}
      </Tabs>
      {selectedTab ? <Transactions data={[]} /> : <Assets />}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 4,
          padding: "1rem",
          background: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          sx={{
            color: "#58667e",
            fontSize: "1rem",
            fontWeight: "500",
          }}
        >
          Log In to see Your Data here
        </Typography>
      </Box>
    </Container>
  );
}

export default LandingPage;
