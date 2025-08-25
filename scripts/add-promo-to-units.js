#!/usr/bin/env node

// Run this script to add promo column to units table
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log(
  "DATABASE_AUTH_TOKEN available:",
  !!process.env.DATABASE_AUTH_TOKEN
);

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable not set");
  process.exit(1);
}

// Initialize database connection
const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
});

async function runMigration() {
  try {
    console.log("Adding promo column to units table...");

    // Simple direct migration
    console.log("Checking if promo column exists...");
    const result = await db.execute(
      "SELECT COUNT(*) as count FROM pragma_table_info('units') WHERE name = 'promo'"
    );

    const columnExists = result.rows[0].count > 0;

    if (columnExists) {
      console.log(
        "Promo column already exists in units table. Skipping migration."
      );
      return;
    }

    console.log("Adding promo column to units table...");
    await db.execute("ALTER TABLE units ADD COLUMN promo TEXT");

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
