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

async function createUsersTables() {
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
    console.log("Starting users table migration...");

    // Read the SQL migration file
    const migrationSql = fs.readFileSync(
      path.join(__dirname, "../sql/auth_schema.sql"),
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

    console.log("Found", allStatements.length, "SQL statements to execute");

    for (let i = 0; i < allStatements.length; i++) {
      const statement = allStatements[i];
      console.log(`\nExecuting statement ${i + 1}:`);
      console.log(statement.substring(0, 100) + "...");

      try {
        await client.execute(statement);
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
        if (error.message.includes("already exists")) {
          console.log("Table already exists, continuing...");
        } else {
          throw error;
        }
      }
    }

    console.log("\n✅ Users tables migration completed successfully.");

    // Verify tables were created
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND (name='Users' OR name='PasswordResets')"
    );

    console.log("Verification results:");
    tables.rows.forEach((row) => {
      console.log(`✅ Table '${row.name}' exists`);
    });

    if (tables.rows.length === 2) {
      console.log("✅ All auth tables successfully created!");
    } else {
      console.log("⚠️ Some tables might be missing. Please check the logs.");
    }

    // Show table structure for Users
    console.log("\nUsers table structure:");
    const usersStructure = await client.execute("PRAGMA table_info(Users)");
    usersStructure.rows.forEach((row) => {
      console.log(
        `- ${row.name} (${row.type})${row.pk ? " PRIMARY KEY" : ""}${
          row.notnull ? " NOT NULL" : ""
        }`
      );
    });
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

createUsersTables();
