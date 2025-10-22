import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Typography, CircularProgress, Alert } from "@mui/material";
import { fetchPortfolio } from "../redux/portfolioSlice";
import StockCard from "./StockCard";

function Portfolio() {
  const dispatch = useDispatch();
  const { transactions, summary, isLoading, error } = useSelector(
    (state) => state.portfolio
  );

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress sx={{ color: "#ffffff" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          backgroundColor: "transparent",
          color: "#ff0000",
          border: "1px solid #ff0000",
          borderRadius: 0,
        }}
      >
        {error}
      </Alert>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  return (
    <Box>
      {/* Portfolio Summary */}
      <Grid container spacing={0} mb={8}>
        <Grid item xs={12} md={3}>
          <Box sx={{ borderRight: { md: "1px solid #1a1a1a" }, p: 3 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#666666",
                letterSpacing: "0.1em",
                fontSize: "0.7rem",
                textTransform: "uppercase",
              }}
            >
              Total Value
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 100,
                letterSpacing: "-0.02em",
                mt: 1,
              }}
            >
              {formatCurrency(summary.totalValue)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ borderRight: { md: "1px solid #1a1a1a" }, p: 3 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#666666",
                letterSpacing: "0.1em",
                fontSize: "0.7rem",
                textTransform: "uppercase",
              }}
            >
              Total Invested
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 100,
                letterSpacing: "-0.02em",
                mt: 1,
              }}
            >
              {formatCurrency(summary.totalInvested)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ borderRight: { md: "1px solid #1a1a1a" }, p: 3 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#666666",
                letterSpacing: "0.1em",
                fontSize: "0.7rem",
                textTransform: "uppercase",
              }}
            >
              Total Gain/Loss
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 100,
                letterSpacing: "-0.02em",
                mt: 1,
                color: summary.totalGainLoss >= 0 ? "#00ff00" : "#ff0000",
              }}
            >
              {formatCurrency(summary.totalGainLoss)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ p: 3 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#666666",
                letterSpacing: "0.1em",
                fontSize: "0.7rem",
                textTransform: "uppercase",
              }}
            >
              Total Return
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 100,
                letterSpacing: "-0.02em",
                mt: 1,
                color:
                  summary.totalGainLossPercent >= 0 ? "#00ff00" : "#ff0000",
              }}
            >
              {formatPercent(summary.totalGainLossPercent)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Stock Holdings */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 100,
          letterSpacing: "0.05em",
          mb: 4,
          textTransform: "uppercase",
        }}
      >
        Holdings
      </Typography>

      {transactions.length === 0 ? (
        <Alert
          severity="info"
          sx={{
            backgroundColor: "transparent",
            color: "#666666",
            border: "1px solid #333333",
            borderRadius: 0,
          }}
        >
          No stocks in portfolio. Add stocks to get started.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {transactions.map((transaction) => (
            <Grid item xs={12} md={6} lg={4} key={transaction.id}>
              <StockCard transaction={transaction} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Portfolio;
