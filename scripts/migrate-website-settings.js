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

// Fungsi untuk membuat tabel WebsiteSettings
async function createWebsiteSettingsTable() {
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

    // Baca file website-settings-schema.sql
    const schemaPath = path.join(
      process.cwd(),
      "src",
      "lib",
      "website-settings-schema.sql"
    );
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Jalankan query untuk membuat tabel
    console.log("Membuat tabel WebsiteSettings...");
    const queries = schema.split(";").filter((q) => q.trim());

    for (const query of queries) {
      if (query.trim()) {
        await db.execute(query);
        console.log(
          "Query berhasil dijalankan:",
          query.trim().substring(0, 50) + "..."
        );
      }
    }

    // Verifikasi tabel telah dibuat
    const tables = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='WebsiteSettings'"
    );
    if (tables.rows.length > 0) {
      console.log("Tabel WebsiteSettings berhasil dibuat!");
    } else {
      console.log(
        "Tabel WebsiteSettings gagal dibuat. Silakan periksa kembali schema SQL."
      );
    }

    await db.close();
  } catch (error) {
    console.error("Error saat membuat tabel WebsiteSettings:", error);
    process.exit(1);
  }
}

// Main function
async function main() {
  try {
    await createWebsiteSettingsTable();
    console.log("Migrasi WebsiteSettings schema ke database Turso berhasil!");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();