const yahooFinance = require("yahoo-finance2").default;

// Get current stock price
const getStockPrice = async (symbol) => {
  try {
    const quote = await yahooFinance.quote(symbol);
    return {
      symbol: quote.symbol,
      companyName: quote.longName || quote.shortName,
      currentPrice: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      previousClose: quote.regularMarketPreviousClose,
      marketCap: quote.marketCap,
      volume: quote.regularMarketVolume,
    };
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    throw new Error("Failed to fetch stock price");
  }
};

// Get historical stock data
const getHistoricalData = async (symbol, period = "1mo") => {
  try {
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
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }

    const historical = await yahooFinance.historical(symbol, {
      period1: startDate,
      period2: endDate,
      interval: "1d",
    });

    return historical.map((day) => ({
      date: day.date,
      close: day.close,
      volume: day.volume,
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw new Error("Failed to fetch historical data");
  }
};

// Search for stocks
const searchStocks = async (query) => {
  try {
    const results = await yahooFinance.search(query);
    return results.quotes
      .filter((quote) => quote.typeDisp === "Equity")
      .slice(0, 10)
      .map((quote) => ({
        symbol: quote.symbol,
        name: quote.longname || quote.shortname,
        exchange: quote.exchange,
        type: quote.typeDisp,
      }));
  } catch (error) {
    console.error("Error searching stocks:", error);
    throw new Error("Failed to search stocks");
  }
};

module.exports = {
  getStockPrice,
  getHistoricalData,
  searchStocks,
};
