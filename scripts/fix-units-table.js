const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

async function fixUnitsTable() {
  console.log("🔧 Fixing Units Table Schema");
  console.log("============================");

  // Check environment variables
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("❌ Missing required environment variables:");
    console.error("   - DATABASE_URL");
    console.error("   - DATABASE_AUTH_TOKEN");
    process.exit(1);
  }

  // Create Turso client
  const client = createClient({
    url: url,
    authToken: authToken,
  });

  try {
    console.log("🚀 Starting units table fix...");

    // Read the migration SQL
    const migrationPath = path.join(
      __dirname,
      "../src/lib/db/migrations/fix_units_table.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("📄 Executing migration SQL...");

    // Split the SQL into separate statements and execute them
    const statements = migrationSQL
      .split(";")
      .map((statement) => statement.trim())
      .filter(
        (statement) => statement.length > 0 && !statement.startsWith("--")
      );

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`   Executing: ${statement.substring(0, 50)}...`);
        await client.execute(statement);
      }
    }

    // Verify the table was created correctly
    const schemaResult = await client.execute("PRAGMA table_info(units)");
    console.log("\n✅ Units table recreated successfully!");
    console.log("📋 New schema:");
    schemaResult.rows.forEach((row) => {
      console.log(
        `   ${row.name}: ${row.type} ${row.pk ? "(PK)" : ""} ${
          row.notnull ? "NOT NULL" : ""
        }`
      );
    });

    // Check foreign key info
    const fkResult = await client.execute("PRAGMA foreign_key_list(units)");
    if (fkResult.rows && fkResult.rows.length > 0) {
      console.log("\n🔗 Foreign key constraints:");
      fkResult.rows.forEach((row) => {
        console.log(`   ${row.from} -> ${row.table}.${row.to}`);
      });
    }

    console.log("\n🎉 Units table fix completed successfully!");
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

// Main execution
fixUnitsTable();
