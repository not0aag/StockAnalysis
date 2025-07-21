const express = require("express");
const router = express.Router();
const { getQuote, search } = require("../controllers/stockController");
const authMiddleware = require("../middleware/auth");

// All routes require authentication
router.use(authMiddleware);

router.get("/quote/:symbol", getQuote);
router.get("/search", search);

module.exports = router;
