#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

// Fungsi untuk membaca file .env
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

// Fungsi untuk memeriksa struktur tabel Project
async function checkProjectTable() {
  const env = readEnvFile();
  const dbUrl = env.DATABASE_URL;
  const authToken = env.DATABASE_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    console.error(
      "DATABASE_URL dan DATABASE_AUTH_TOKEN harus diisi di file .env.local"
    );
    process.exit(1);
  }

  try {
    const db = createClient({
      url: dbUrl,
      authToken: authToken,
    });

    // Cek struktur tabel Project
    console.log("Memeriksa struktur tabel Project...");
    const tableInfo = await db.execute("PRAGMA table_info(Project)");

    console.log("Struktur tabel Project:");
    tableInfo.rows.forEach((row) => {
      console.log(
        `${row.name} (${row.type}) ${row.notnull ? "NOT NULL" : ""} ${
          row.pk ? "PRIMARY KEY" : ""
        }`
      );
    });

    // Cek jumlah data
    const count = await db.execute("SELECT COUNT(*) as count FROM Project");
    console.log(`\nJumlah data dalam tabel Project: ${count.rows[0].count}`);
  } catch (error) {
    console.error("Error saat memeriksa tabel Project:", error);
    process.exit(1);
  }
}

// Main function
async function main() {
  try {
    await checkProjectTable();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();
