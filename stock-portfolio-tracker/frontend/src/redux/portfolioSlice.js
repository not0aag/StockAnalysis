import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Fetch portfolio
export const fetchPortfolio = createAsyncThunk(
  "portfolio/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/portfolio");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Add stock
export const addStock = createAsyncThunk(
  "portfolio/addStock",
  async (stockData, { rejectWithValue }) => {
    try {
      const response = await api.post("/portfolio/stocks", stockData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Remove stock
export const removeStock = createAsyncThunk(
  "portfolio/removeStock",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/portfolio/stocks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// Fetch performance
export const fetchPerformance = createAsyncThunk(
  "portfolio/fetchPerformance",
  async (period, { rejectWithValue }) => {
    try {
      const response = await api.get(`/portfolio/performance?period=${period}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    transactions: [],
    summary: {
      totalValue: 0,
      totalInvested: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      numberOfStocks: 0,
    },
    performance: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch portfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.summary = action.payload.summary;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add stock
      .addCase(addStock.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      // Remove stock
      .addCase(removeStock.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
      })
      // Fetch performance
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.performance = action.payload.performance;
      });
  },
});

export const { clearError } = portfolioSlice.actions;
export default portfolioSlice.reducer;
