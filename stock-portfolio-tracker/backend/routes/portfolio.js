const express = require("express");
const router = express.Router();
const {
  getPortfolio,
  addStock,
  removeStock,
  getPerformance,
} = require("../controllers/portfolioController");
const authMiddleware = require("../middleware/auth");

// All routes require authentication
router.use(authMiddleware);

router.get("/", getPortfolio);
router.post("/stocks", addStock);
router.delete("/stocks/:id", removeStock);
router.get("/performance", getPerformance);

module.exports = router;
