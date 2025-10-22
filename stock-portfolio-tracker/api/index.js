// Vercel serverless function handler
// Environment variables are loaded from Vercel's environment settings
const app = require("../backend/server");

// Export as serverless function
module.exports = app;
