const yahooFinance = require("yahoo-finance2").default;

// Cache for stock prices (helps reduce API calls)
const priceCache = new Map();
const CACHE_DURATION = 60000; // 1 minute

// Get current stock price
const getStockPrice = async (symbol) => {
  try {
    const upperSymbol = symbol.toUpperCase();

    // Check cache first
    const cached = priceCache.get(upperSymbol);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const quote = await yahooFinance.quote(upperSymbol);

    if (!quote || !quote.regularMarketPrice) {
      throw new Error(`No price data available for ${upperSymbol}`);
    }

    const data = {
      symbol: quote.symbol,
      companyName: quote.longName || quote.shortName || upperSymbol,
      currentPrice: quote.regularMarketPrice,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      previousClose: quote.regularMarketPreviousClose,
      marketCap: quote.marketCap,
      volume: quote.regularMarketVolume,
    };

    // Cache the result
    priceCache.set(upperSymbol, { data, timestamp: Date.now() });

    return data;
  } catch (error) {
    console.error(
      `❌ Error fetching stock price for ${symbol}:`,
      error.message
    );
    throw new Error(`Unable to fetch stock data for ${symbol}`);
  }
};

// Get historical stock data
const getHistoricalData = async (symbol, period = "1mo") => {
  try {
    const upperSymbol = symbol.toUpperCase();
    const endDate = new Date();
    const startDate = new Date();

    // Set start date based on period
    switch (period) {
      case "1d":
        startDate.setDate(endDate.getDate() - 1);
        break;
      case "1w":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "1mo":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "3mo":
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "6mo":
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }

    const historical = await yahooFinance.historical(upperSymbol, {
      period1: startDate,
      period2: endDate,
      interval: "1d",
    });

    if (!historical || historical.length === 0) {
      throw new Error(`No historical data available for ${upperSymbol}`);
    }

    return historical.map((day) => ({
      date: day.date,
      close: day.close,
      open: day.open,
      high: day.high,
      low: day.low,
      volume: day.volume,
    }));
  } catch (error) {
    console.error(
      `❌ Error fetching historical data for ${symbol}:`,
      error.message
    );
    throw new Error(`Unable to fetch historical data for ${symbol}`);
  }
};

// Search for stocks
const searchStocks = async (query) => {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const results = await yahooFinance.search(query.trim());

    if (!results || !results.quotes) {
      return [];
    }

    return results.quotes
      .filter((quote) => quote.typeDisp === "Equity" && quote.symbol)
      .slice(0, 10)
      .map((quote) => ({
        symbol: quote.symbol,
        name: quote.longname || quote.shortname || quote.symbol,
        exchange: quote.exchange || "N/A",
        type: quote.typeDisp,
      }));
  } catch (error) {
    console.error("❌ Error searching stocks:", error.message);
    throw new Error("Unable to search stocks");
  }
};

// Clear cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of priceCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      priceCache.delete(key);
    }
  }
}, CACHE_DURATION);

module.exports = {
  getStockPrice,
  getHistoricalData,
  searchStocks,
};
