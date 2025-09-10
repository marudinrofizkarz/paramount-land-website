#!/usr/bin/env node

const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

// Read environment variables
function readEnvFile() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error(".env.local file not found");
    return {};
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  const env = {};
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  });
  return env;
}

async function checkContactInquiryData() {
  const env = readEnvFile();
  const dbUrl = env.DATABASE_URL;
  const authToken = env.DATABASE_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    console.error(
      "DATABASE_URL and DATABASE_AUTH_TOKEN must be set in .env.local"
    );
    return;
  }

  try {
    const db = createClient({
      url: dbUrl,
      authToken: authToken,
    });

    console.log("🔍 Checking ContactInquiry table structure...");
    const schema = await db.execute("PRAGMA table_info(ContactInquiry)");
    console.log("Columns:");
    schema.rows.forEach((row) => console.log(`  ${row.name} (${row.type})`));

    console.log("\n📋 Sample data (last 3 inquiries):");
    const samples = await db.execute(
      "SELECT id, name, email, message, inquiry_type, created_at FROM ContactInquiry ORDER BY created_at DESC LIMIT 3"
    );

    if (samples.rows.length === 0) {
      console.log("No inquiries found in database");
    } else {
      samples.rows.forEach((row) => {
        console.log(`\nID: ${row.id}`);
        console.log(`Name: ${row.name}`);
        console.log(`Email: ${row.email}`);
        console.log(`Type: ${row.inquiry_type}`);
        console.log(
          `Message: ${
            row.message
              ? row.message.length > 100
                ? row.message.substring(0, 100) + "..."
                : row.message
              : "NULL"
          }`
        );
        console.log(`Created: ${row.created_at}`);
      });
    }

    console.log(
      `\n📊 Total inquiries: ${
        samples.rows.length > 0 ? "Found data" : "No data yet"
      }`
    );
  } catch (error) {
    console.error("❌ Error checking database:", error.message);
  }
}

checkContactInquiryData();
