// Simple script to add promo column to units table
require("dotenv").config();
const { createClient } = require("@libsql/client");

async function main() {
  console.log("Starting promo column migration...");

  // Log environment variables for debugging (without sensitive info)
  console.log("Database URL available:", !!process.env.DATABASE_URL);
  console.log("Auth token available:", !!process.env.DATABASE_AUTH_TOKEN);

  try {
    // Create database client
    const client = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });

    console.log("Connected to database. Checking if promo column exists...");

    // Check if column already exists
    const checkResult = await client.execute({
      sql: "SELECT COUNT(*) as count FROM pragma_table_info('units') WHERE name = 'promo'",
    });

    const columnExists = checkResult.rows[0].count > 0;

    if (columnExists) {
      console.log(
        "Promo column already exists in units table. No migration needed."
      );
      return;
    }

    // Add the column if it doesn't exist
    console.log("Adding promo column to units table...");
    await client.execute({
      sql: "ALTER TABLE units ADD COLUMN promo TEXT",
    });

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main().catch(console.error);
