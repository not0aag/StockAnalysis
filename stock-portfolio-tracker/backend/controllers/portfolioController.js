const { pool } = require("../config/database");
const { getStockPrice } = require("../utils/stockAPI");

// Get user's portfolio
const getPortfolio = async (req, res) => {
  try {
    // Get all user's transactions
    const transactions = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY purchase_date DESC",
      [req.userId]
    );

    // Update current prices and calculate gains/losses
    const updatedTransactions = await Promise.all(
      transactions.rows.map(async (transaction) => {
        try {
          const stockData = await getStockPrice(transaction.symbol);
          const currentPrice = stockData.currentPrice;
          const totalValue = currentPrice * transaction.quantity;
          const gainLoss =
            totalValue - transaction.purchase_price * transaction.quantity;
          const gainLossPercent =
            ((currentPrice - transaction.purchase_price) /
              transaction.purchase_price) *
            100;

          // Update transaction with current data
          await pool.query(
            `UPDATE transactions 
             SET current_price = $1, total_value = $2, gain_loss = $3, gain_loss_percent = $4 
             WHERE id = $5`,
            [
              currentPrice,
              totalValue,
              gainLoss,
              gainLossPercent,
              transaction.id,
            ]
          );

          return {
            ...transaction,
            current_price: currentPrice,
            total_value: totalValue,
            gain_loss: gainLoss,
            gain_loss_percent: gainLossPercent,
            company_name: stockData.companyName,
          };
        } catch (error) {
          console.error(`Error updating ${transaction.symbol}:`, error);
          return transaction;
        }
      })
    );

    // Calculate portfolio totals
    const totalValue = updatedTransactions.reduce(
      (sum, t) => sum + (t.total_value || 0),
      0
    );
    const totalInvested = updatedTransactions.reduce(
      (sum, t) => sum + t.purchase_price * t.quantity,
      0
    );
    const totalGainLoss = totalValue - totalInvested;
    const totalGainLossPercent =
      totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    // Update portfolio totals
    await pool.query(
      `UPDATE portfolio 
       SET total_value = $1, total_gain_loss = $2, total_gain_loss_percent = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $4`,
      [totalValue, totalGainLoss, totalGainLossPercent, req.userId]
    );

    res.json({
      transactions: updatedTransactions,
      summary: {
        totalValue,
        totalInvested,
        totalGainLoss,
        totalGainLossPercent,
        numberOfStocks: updatedTransactions.length,
      },
    });
  } catch (error) {
    console.error("Get portfolio error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add stock to portfolio
const addStock = async (req, res) => {
  const { symbol, quantity, purchasePrice, purchaseDate } = req.body;

  try {
    // Validate inputs
    if (!symbol || !quantity || !purchasePrice || !purchaseDate) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        error: "Quantity must be greater than 0",
      });
    }

    if (purchasePrice <= 0) {
      return res.status(400).json({
        error: "Purchase price must be greater than 0",
      });
    }

    // Validate date
    const date = new Date(purchaseDate);
    if (isNaN(date.getTime()) || date > new Date()) {
      return res.status(400).json({
        error: "Invalid purchase date",
      });
    }

    // Get stock info
    const stockData = await getStockPrice(symbol.toUpperCase());

    // Calculate values
    const totalValue = stockData.currentPrice * quantity;
    const gainLoss = totalValue - purchasePrice * quantity;
    const gainLossPercent =
      ((stockData.currentPrice - purchasePrice) / purchasePrice) * 100;

    // Insert transaction
    const transaction = await pool.query(
      `INSERT INTO transactions 
       (user_id, symbol, company_name, quantity, purchase_price, current_price, total_value, gain_loss, gain_loss_percent, purchase_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        req.userId,
        stockData.symbol,
        stockData.companyName,
        quantity,
        purchasePrice,
        stockData.currentPrice,
        totalValue,
        gainLoss,
        gainLossPercent,
        purchaseDate,
      ]
    );

    console.log(`✅ Stock added: ${stockData.symbol} x${quantity}`);
    res.status(201).json(transaction.rows[0]);
  } catch (error) {
    console.error("Add stock error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to add stock",
    });
  }
};

// Remove stock from portfolio
const removeStock = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        error: "Invalid transaction ID",
      });
    }

    // Check if transaction belongs to user
    const transaction = await pool.query(
      "SELECT * FROM transactions WHERE id = $1 AND user_id = $2",
      [id, req.userId]
    );

    if (transaction.rows.length === 0) {
      return res.status(404).json({
        error: "Transaction not found or access denied",
      });
    }

    // Delete transaction
    await pool.query("DELETE FROM transactions WHERE id = $1", [id]);

    console.log(`✅ Stock removed: Transaction ID ${id}`);
    res.json({ message: "Stock removed successfully" });
  } catch (error) {
    console.error("Remove stock error:", error.message);
    res.status(500).json({ error: "Failed to remove stock" });
  }
};

// Get portfolio performance data
const getPerformance = async (req, res) => {
  const { period = "1mo" } = req.query;

  try {
    // Get user's transactions
    const transactions = await pool.query(
      "SELECT symbol, quantity FROM transactions WHERE user_id = $1",
      [req.userId]
    );

    if (transactions.rows.length === 0) {
      return res.json({ performance: [] });
    }

    // Group by symbol and sum quantities
    const holdings = transactions.rows.reduce((acc, t) => {
      acc[t.symbol] = (acc[t.symbol] || 0) + t.quantity;
      return acc;
    }, {});

    // Get historical data for each stock
    const { getHistoricalData } = require("../utils/stockAPI");
    const historicalPromises = Object.keys(holdings).map(async (symbol) => {
      const data = await getHistoricalData(symbol, period);
      return { symbol, quantity: holdings[symbol], data };
    });

    const historicalData = await Promise.all(historicalPromises);

    // Calculate portfolio value for each date
    const dateMap = new Map();

    historicalData.forEach(({ symbol, quantity, data }) => {
      data.forEach(({ date, close }) => {
        const dateStr = date.toISOString().split("T")[0];
        const currentValue = dateMap.get(dateStr) || 0;
        dateMap.set(dateStr, currentValue + close * quantity);
      });
    });

    // Convert to array and sort by date
    const performance = Array.from(dateMap.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({ performance });
  } catch (error) {
    console.error("Get performance error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getPortfolio,
  addStock,
  removeStock,
  getPerformance,
};
