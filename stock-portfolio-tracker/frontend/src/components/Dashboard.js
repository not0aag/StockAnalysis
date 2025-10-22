// src/components/Dashboard.js

import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab, // Make sure Tab is imported
  IconButton,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import Portfolio from "./Portfolio";
import PerformanceChart from "./PerformanceChart";
import AddStock from "./AddStock";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "transparent",
          borderBottom: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#e0e0e0",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ minHeight: 80 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 100,
                letterSpacing: "0.1em",
                fontSize: "1.5rem",
                color: theme.palette.text.primary,
              }}
            >
              STOCK PORTFOLIO TRACKER
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                letterSpacing: "0.2em",
                fontSize: "0.7rem",
                textTransform: "uppercase",
              }}
            >
              Created by Alen
            </Typography>
          </Box>
          <ThemeToggle />
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark" ? "#333333" : "#cccccc",
              borderRadius: 0,
              p: 1,
              "&:hover": {
                borderColor:
                  theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                backgroundColor: "transparent",
              },
              color: theme.palette.text.primary,
            }}
          >
            <LogoutIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#e0e0e0",
            mb: 4,
          }}
        >
          {/* Removed most of the sx from Tabs and Tab, as it's now in ThemeContext.js */}
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="PORTFOLIO" />
            <Tab label="PERFORMANCE" />
            <Tab label="ADD STOCK" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Portfolio />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PerformanceChart />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AddStock onSuccess={() => setTabValue(0)} />
        </TabPanel>
      </Container>
    </Box>
  );
}

export default Dashboard;
