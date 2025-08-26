/*
  This script adds a general_inquiries project to the database
  using direct connection to handle special cases like sales consultations
  that don't have an associated project
*/
require("dotenv").config(); // Load environment variables from .env file
const { createClient } = require("@libsql/client");

// Get database credentials from environment variables
const dbUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
const authToken =
  process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

if (!dbUrl) {
  console.error(
    "❌ Database URL is missing. Please set TURSO_DATABASE_URL or DATABASE_URL in your .env file."
  );
  process.exit(1);
}

// Create database client
const db = createClient({
  url: dbUrl,
  authToken: authToken,
});

async function addGeneralInquiriesProject() {
  try {
    console.log("Checking for general_inquiries project...");

    // Check if the project already exists
    const projectCheck = await db.execute({
      sql: "SELECT id FROM Project WHERE id = ?",
      args: ["general_inquiries"],
    });

    if (projectCheck.rows.length === 0) {
      console.log("Creating general_inquiries project...");

      // Check table structure to get required columns
      const tableInfo = await db.execute({
        sql: "PRAGMA table_info(Project)",
      });

      console.log("Project table structure:", tableInfo.rows);

      // Create the general_inquiries project with only required columns
      await db.execute({
        sql: `INSERT INTO Project (
          id, name, slug, status, location, description, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        args: [
          "general_inquiries",
          "General Inquiries",
          "general-inquiries",
          "active",
          "Global",
          "Special project for general inquiries and consultations",
        ],
      });

      console.log("General inquiries project created successfully!");
    } else {
      console.log("General inquiries project already exists.");
    }
  } catch (error) {
    console.error("Error adding general inquiries project:", error);
    process.exit(1);
  }
}

// Execute the script
addGeneralInquiriesProject()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
