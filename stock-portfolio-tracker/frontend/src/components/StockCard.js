import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { removeStock, fetchPortfolio } from "../redux/portfolioSlice";
import { format } from "date-fns";

function StockCard({ transaction }) {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Remove this stock from portfolio?")) {
      setIsDeleting(true);
      await dispatch(removeStock(transaction.id));
      dispatch(fetchPortfolio());
      setIsDeleting(false);
    }
  };

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

  const isProfit = transaction.gain_loss >= 0;

  return (
    <Card
      sx={{
        backgroundColor: "transparent",
        border: "1px solid #1a1a1a",
        borderRadius: 0,
        transition: "border-color 0.3s ease",
        "&:hover": {
          borderColor: "#333333",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 100,
                letterSpacing: "0.05em",
              }}
            >
              {transaction.symbol}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#666666",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "0.7rem",
              }}
            >
              {transaction.company_name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleDelete}
            disabled={isDeleting}
            sx={{
              color: "#666666",
              "&:hover": {
                color: "#ffffff",
                backgroundColor: "transparent",
              },
            }}
          >
            {isDeleting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <CloseIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Box>

        <Box mt={3} sx={{ borderTop: "1px solid #1a1a1a", pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="caption"
                sx={{ color: "#666666", fontSize: "0.7rem" }}
              >
                SHARES
              </Typography>
              <Typography variant="body1">{transaction.quantity}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="caption"
                sx={{ color: "#666666", fontSize: "0.7rem" }}
              >
                AVG COST
              </Typography>
              <Typography variant="body1">
                {formatCurrency(transaction.purchase_price)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="caption"
                sx={{ color: "#666666", fontSize: "0.7rem" }}
              >
                CURRENT
              </Typography>
              <Typography variant="body1">
                {formatCurrency(transaction.current_price)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="caption"
                sx={{ color: "#666666", fontSize: "0.7rem" }}
              >
                PURCHASED
              </Typography>
              <Typography variant="body1">
                {format(new Date(transaction.purchase_date), "MMM dd, yyyy")}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3} sx={{ borderTop: "1px solid #1a1a1a", pt: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "#666666", fontSize: "0.7rem" }}
              >
                MARKET VALUE
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 100 }}>
                {formatCurrency(transaction.total_value)}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 100,
                  color: isProfit ? "#00ff00" : "#ff0000",
                }}
              >
                {formatPercent(transaction.gain_loss_percent)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isProfit ? "#00ff00" : "#ff0000",
                  fontSize: "0.875rem",
                }}
              >
                {formatCurrency(transaction.gain_loss)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StockCard;
