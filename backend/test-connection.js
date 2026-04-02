#!/usr/bin/env node

/**
 * PostgreSQL Connection Test Script
 * Tests if the backend can connect to the Aiven PostgreSQL database
 */

require("dotenv").config();

const { Pool } = require("pg");

// Use the same SSL configuration as db.js
let sslConfig = false;
if (process.env.NODE_ENV === "production") {
  if (process.env.DB_SSL_CERT) {
    sslConfig = {
      rejectUnauthorized: true,
      ca: process.env.DB_SSL_CERT,
    };
  }
} else {
  sslConfig = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: sslConfig,
});

console.log("\n" + "=".repeat(60));
console.log("PostgreSQL Connection Test");
console.log("=".repeat(60) + "\n");

console.log("📋 Connection Details:");
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   Port: ${process.env.DB_PORT}`);
console.log(`   User: ${process.env.DB_USER}`);
console.log(`   Database: ${process.env.DB_NAME}`);
console.log(`   SSL Enabled: ${sslConfig ? "Yes" : "No"}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || "not set"}`);
console.log();

// Test 1: Basic Connection
console.log("Test 1: Connecting to PostgreSQL...");
pool.connect((err, client, release) => {
  if (err) {
    console.log("   ✗ Connection failed!");
    console.log("   Error:", err.message);
    console.log();
    process.exit(1);
  }

  console.log("   ✓ Connected successfully!\n");

  // Test 2: Get PostgreSQL Version
  console.log("Test 2: Fetching PostgreSQL version...");
  client.query("SELECT VERSION()", (err, result) => {
    if (err) {
      console.log("   ✗ Query failed!");
      console.log("   Error:", err.message);
      release();
      process.exit(1);
    }

    console.log("   ✓ Version query successful!");
    console.log("   Version:", result.rows[0].version);
    console.log();

    // Test 3: Check if tables exist
    console.log("Test 3: Checking for database tables...");
    client.query(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `,
      (err, result) => {
        if (err) {
          console.log("   ✗ Table query failed!");
          console.log("   Error:", err.message);
          release();
          process.exit(1);
        }

        const tableCount = result.rows.length;
        console.log(`   ✓ Found ${tableCount} tables\n`);

        if (tableCount === 0) {
          console.log("   ⚠️  WARNING: No tables found!");
          console.log("   You need to run DATABASE_SCHEMA_POSTGRESQL.sql\n");
          release();
          pool.end(() => {
            console.log("=".repeat(60));
            console.log(
              "Status: Database connection works, but schema not created",
            );
            console.log("=".repeat(60) + "\n");
            process.exit(0);
          });
        } else {
          console.log("   Tables found:");
          result.rows.forEach((row) => {
            console.log(`      - ${row.table_name}`);
          });
          console.log();

          // Test 4: Check Users table
          console.log("Test 4: Checking Users table...");
          client.query('SELECT * FROM "Users"', (err, result) => {
            if (err) {
              console.log("   ✗ Users table query failed!");
              console.log("   Error:", err.message);
              release();
              pool.end(() => {
                console.log("=".repeat(60));
                console.log(
                  "Status: Connection OK, but Users table query failed",
                );
                console.log("=".repeat(60) + "\n");
                process.exit(1);
              });
            } else {
              console.log("   ✓ Users table query successful!");
              console.log(`   Users table has ${result.rows.length} records\n`);
              console.log("   Checking for test users in Users table...");
              console.log("printing all users:");
              result.rows.forEach((row) => {
                console.log(`      - ${row.email}`);
              });
            }
          });

          client.query(
            'SELECT COUNT(*) as user_count FROM "Users"',
            (err, result) => {
              if (err) {
                console.log("   ✗ Users table query failed!");
                console.log("   Error:", err.message);
              } else {
                const count = result.rows[0].user_count;
                console.log(`   ✓ Users table has ${count} records`);

                if (count === 0) {
                  console.log("   ⚠️  WARNING: No test users found!");
                  console.log(
                    "   Run DATABASE_SCHEMA_POSTGRESQL.sql to insert sample data\n",
                  );
                }
              }

              release();
              pool.end(() => {
                console.log("=".repeat(60));
                if (tableCount > 0) {
                  console.log(
                    "✓ Status: All tests passed! Backend is ready to start",
                  );
                } else {
                  console.log(
                    "⚠️  Status: Connection OK, but database schema needs setup",
                  );
                }
                console.log("=".repeat(60) + "\n");
                process.exit(0);
              });
            },
          );
        }
      },
    );
  });
});

// Handle errors
pool.on("error", (err) => {
  console.log("\n✗ Pool Error:", err.message);
  process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log("\n✗ Connection timeout after 10 seconds");
  process.exit(1);
}, 10000);
