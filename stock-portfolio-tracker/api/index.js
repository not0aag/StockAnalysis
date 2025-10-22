// Load environment variables
require("dotenv").config({
  path: require("path").join(__dirname, "../backend/.env"),
});

// Vercel serverless function handler
const app = require("../backend/server");

// Export as serverless function
module.exports = app;
