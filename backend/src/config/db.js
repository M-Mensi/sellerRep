require("dotenv").config();

const { Pool } = require("pg");

// SSL/TLS Configuration for Aiven PostgreSQL
let sslConfig = false;

if (process.env.NODE_ENV === "production") {
  // Production: Strict SSL validation with certificate
  if (process.env.DB_SSL_CERT) {
    sslConfig = {
      rejectUnauthorized: true,
      ca: process.env.DB_SSL_CERT,
    };
  }
} else {
  // Development: Allow self-signed certificates from Aiven
  // This is safe for development/testing, but NOT for production
  sslConfig = {
    rejectUnauthorized: false, // Allow self-signed certificates
  };
}

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: sslConfig,
  // Connection pool settings
  max: 20, // Max clients in pool
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 2000, // Return error after 2s if unable to obtain connection
});

// Test connection on startup
pool.on("connect", () => {
  console.log("✓ PostgreSQL connection established");
});

pool.on("error", (err) => {
  console.error("✗ PostgreSQL connection error:", err.message);
});

// Convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
const convertPlaceholders = (text) => {
  let parameterizedText = text;
  let paramIndex = 1;
  return parameterizedText.replace(/\?/g, () => `$${paramIndex++}`);
};

// Callback-based query wrapper (like client.query pattern)
// Handles both: db.query(sql, callback) and db.query(sql, values, callback)
const query = (text, values, callback) => {
  // If values is actually a function (callback), shift parameters
  if (typeof values === "function") {
    callback = values;
    values = [];
  }

  const convertedText = convertPlaceholders(text);
  pool.query(convertedText, values, callback);
};

// Get a client from pool for transaction support
const getClient = (callback) => {
  pool.connect(callback);
};

module.exports = {
  query, // Callback-based: db.query(sql, values, callback)
  pool, // Raw pool for advanced usage
  getClient, // Get client for transactions: db.getClient((err, client, release) => {})
  convertPlaceholders, // Helper to convert placeholders
};
