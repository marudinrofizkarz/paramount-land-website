#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

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

async function checkProjectStatus() {
  const env = readEnvFile();
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  try {
    console.log("📋 Checking project status...");

    const result = await client.execute("SELECT id, name, status FROM Project");
    console.log("\n🏗️  Projects with status:");
    result.rows.forEach((row) => {
      console.log(`- ${row.name}: ${row.status || "NULL"}`);
    });

    const residential = await client.execute(
      "SELECT COUNT(*) as count FROM Project WHERE status = ?",
      ["residential"]
    );
    const commercial = await client.execute(
      "SELECT COUNT(*) as count FROM Project WHERE status = ?",
      ["commercial"]
    );

    console.log(`\n📊 Summary:`);
    console.log(`Residential count: ${residential.rows[0]?.count || 0}`);
    console.log(`Commercial count: ${commercial.rows[0]?.count || 0}`);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkProjectStatus();
