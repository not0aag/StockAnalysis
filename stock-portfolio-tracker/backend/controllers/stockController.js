const { getStockPrice, searchStocks } = require("../utils/stockAPI");

// Get stock quote
const getQuote = async (req, res) => {
  const { symbol } = req.params;

  try {
    const stockData = await getStockPrice(symbol.toUpperCase());
    res.json(stockData);
  } catch (error) {
    console.error("Get quote error:", error);
    res.status(500).json({ error: "Failed to fetch stock quote" });
  }
};

// Search stocks
const search = async (req, res) => {
  const { query } = req.query;

  if (!query || query.length < 1) {
    return res.status(400).json({ error: "Search query required" });
  }

  try {
    const results = await searchStocks(query);
    res.json(results);
  } catch (error) {
    console.error("Search stocks error:", error);
    res.status(500).json({ error: "Failed to search stocks" });
  }
};

module.exports = {
  getQuote,
  search,
};
