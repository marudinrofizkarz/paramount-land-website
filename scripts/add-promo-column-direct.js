// Simple script to add promo column to units table with direct env config
const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

// Try to load env variables from different locations
function loadEnvVariables() {
  const possibleEnvFiles = [
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
  ];

  let databaseUrl = process.env.DATABASE_URL;
  let authToken = process.env.DATABASE_AUTH_TOKEN;

  for (const envFile of possibleEnvFiles) {
    try {
      const envPath = path.resolve(process.cwd(), envFile);
      if (fs.existsSync(envPath)) {
        console.log(`Found ${envFile}, attempting to load...`);
        const envContent = fs.readFileSync(envPath, "utf8");
        const envLines = envContent.split("\n");

        for (const line of envLines) {
          if (line.trim() && !line.startsWith("#")) {
            const [key, value] = line.split("=");
            if (key.trim() === "DATABASE_URL" && !databaseUrl) {
              databaseUrl = value.trim().replace(/["']/g, "");
              console.log(`Found DATABASE_URL in ${envFile}`);
            } else if (key.trim() === "DATABASE_AUTH_TOKEN" && !authToken) {
              authToken = value.trim().replace(/["']/g, "");
              console.log(`Found DATABASE_AUTH_TOKEN in ${envFile}`);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error loading ${envFile}:`, error.message);
    }
  }

  return { databaseUrl, authToken };
}

async function main() {
  console.log("Starting promo column migration...");

  // Load environment variables
  const { databaseUrl, authToken } = loadEnvVariables();

  // Log environment variables for debugging (without revealing sensitive info)
  console.log("Database URL available:", !!databaseUrl);
  console.log("Auth token available:", !!authToken);

  if (!databaseUrl) {
    console.error(
      "DATABASE_URL is not defined. Please check your environment variables."
    );
    process.exit(1);
  }

  try {
    // Create database client
    console.log("Creating database client...");
    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
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
