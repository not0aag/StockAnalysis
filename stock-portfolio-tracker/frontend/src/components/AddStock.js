import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addStock, fetchPortfolio } from "../redux/portfolioSlice";
import api from "../services/api";

function AddStock({ onSuccess }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      symbol: null,
      quantity: "",
      purchasePrice: "",
      purchaseDate: new Date().toISOString().split("T")[0],
    },
  });

  const handleSearch = async (query) => {
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await api.get(`/stocks/search?query=${query}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      await dispatch(
        addStock({
          symbol: data.symbol.symbol,
          quantity: parseInt(data.quantity),
          purchasePrice: parseFloat(data.purchasePrice),
          purchaseDate: data.purchaseDate,
        })
      ).unwrap();

      await dispatch(fetchPortfolio());
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err || "Failed to add stock");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto">
      <Typography
        variant="h5"
        sx={{
          fontWeight: 100,
          letterSpacing: "0.05em",
          mb: 6,
          textTransform: "uppercase",
        }}
      >
        Add Position
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            backgroundColor: "transparent",
            color: "#ff0000",
            border: "1px solid #ff0000",
            borderRadius: 0,
          }}
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="symbol"
          control={control}
          rules={{ required: "Stock symbol is required" }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={searchResults}
              getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
              loading={searchLoading}
              onInputChange={(event, value) => handleSearch(value)}
              onChange={(event, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="SYMBOL"
                  margin="normal"
                  fullWidth
                  error={!!errors.symbol}
                  helperText={errors.symbol?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  InputLabelProps={{
                    sx: {
                      letterSpacing: "0.1em",
                      fontSize: "0.875rem",
                    },
                  }}
                  sx={{ mb: 3 }}
                />
              )}
            />
          )}
        />

        <Controller
          name="quantity"
          control={control}
          rules={{
            required: "Quantity is required",
            min: { value: 1, message: "Quantity must be at least 1" },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="SHARES"
              type="number"
              margin="normal"
              fullWidth
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              InputLabelProps={{
                sx: {
                  letterSpacing: "0.1em",
                  fontSize: "0.875rem",
                },
              }}
              sx={{ mb: 3 }}
            />
          )}
        />

        <Controller
          name="purchasePrice"
          control={control}
          rules={{
            required: "Purchase price is required",
            min: { value: 0.01, message: "Price must be greater than 0" },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="PURCHASE PRICE"
              type="number"
              margin="normal"
              fullWidth
              inputProps={{ step: "0.01" }}
              error={!!errors.purchasePrice}
              helperText={errors.purchasePrice?.message}
              InputLabelProps={{
                sx: {
                  letterSpacing: "0.1em",
                  fontSize: "0.875rem",
                },
              }}
              sx={{ mb: 3 }}
            />
          )}
        />

        <Controller
          name="purchaseDate"
          control={control}
          rules={{ required: "Purchase date is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="PURCHASE DATE"
              type="date"
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
                sx: {
                  letterSpacing: "0.1em",
                  fontSize: "0.875rem",
                },
              }}
              error={!!errors.purchaseDate}
              helperText={errors.purchaseDate?.message}
              sx={{ mb: 6 }}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            py: 2,
            letterSpacing: "0.1em",
            fontSize: "0.875rem",
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "ADD POSITION"
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default AddStock;
