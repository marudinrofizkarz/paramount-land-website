#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

// Fungsi untuk membaca file .env.local
function readEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const envContent = fs.readFileSync(envPath, "utf8");
    const envVars = {};

    envContent.split("\n").forEach((line) => {
      if (line && !line.startsWith("#")) {
        const [key, value] = line.split("=");
        if (key && value) {
          envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
        }
      }
    });

    return envVars;
  } catch (error) {
    console.error("Error reading .env file:", error.message);
    process.exit(1);
  }
}

async function runMigration() {
  const env = readEnvFile();
  const dbUrl = env.DATABASE_URL;
  const authToken = env.DATABASE_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    console.error(
      "DATABASE_URL dan DATABASE_AUTH_TOKEN harus diisi di file .env.local"
    );
    process.exit(1);
  }

  // Create database client
  const client = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  try {
    console.log("Starting units table migration...");

    // Read the SQL migration file
    const migrationSql = fs.readFileSync(
      path.join(__dirname, "../src/lib/db/migrations/create_units_table.sql"),
      "utf8"
    );

    // Remove comments and split by semicolon
    const cleanSql = migrationSql
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");

    const allStatements = cleanSql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt);

    console.log("All statements found:", allStatements.length);

    for (let i = 0; i < allStatements.length; i++) {
      const statement = allStatements[i];
      console.log(`\nExecuting statement ${i + 1}:`);
      console.log(statement.substring(0, 100) + "...");

      try {
        await client.execute(statement);
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
        throw error;
      }
    }

    console.log("\n✅ Units table migration completed successfully.");

    // Verify table was created
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='units'"
    );
    if (tables.rows.length > 0) {
      console.log("✅ Units table berhasil dibuat!");
    } else {
      console.log("❌ Units table gagal dibuat.");
    }
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

runMigration();
