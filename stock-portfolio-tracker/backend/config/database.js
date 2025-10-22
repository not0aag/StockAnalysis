const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com') || process.env.NODE_ENV === "production"
    ? {
        rejectUnauthorized: false,
      }
    : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
  min: 2,
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
});

const connectDB = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected successfully");
    client.release();

    await createTables();
  } catch (error) {
    console.error("❌ Database connection error:", error.message);

    if (!process.env.DATABASE_URL) {
      console.error("💡 DATABASE_URL environment variable is not set");
    }

    if (error.code === "ECONNRESET") {
      console.log("💡 This might be a network/SSL issue");
    }

    // Don't exit in production serverless environment
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Portfolio table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_value DECIMAL(10, 2) DEFAULT 0,
        total_gain_loss DECIMAL(10, 2) DEFAULT 0,
        total_gain_loss_percent DECIMAL(5, 2) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        symbol VARCHAR(10) NOT NULL,
        company_name VARCHAR(100),
        quantity INTEGER NOT NULL,
        purchase_price DECIMAL(10, 2) NOT NULL,
        current_price DECIMAL(10, 2),
        total_value DECIMAL(10, 2),
        gain_loss DECIMAL(10, 2),
        gain_loss_percent DECIMAL(5, 2),
        purchase_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

module.exports = { pool, connectDB };
