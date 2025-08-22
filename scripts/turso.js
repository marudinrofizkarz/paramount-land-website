#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");
const { execSync } = require("child_process");

// Periksa argumen command line
const args = process.argv.slice(2);
const command = args[0];

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

// Fungsi untuk membuat tabel
async function createTables() {
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

    // Baca file schema.sql
    const schemaPath = path.join(process.cwd(), "src", "lib", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Jalankan query untuk membuat tabel
    console.log("Membuat tabel...");
    const queries = schema.split(";").filter((q) => q.trim());

    for (const query of queries) {
      if (query.trim()) {
        await db.execute(query);
        console.log("Query berhasil dijalankan");
      }
    }

    console.log("Inisialisasi database berhasil!");
  } catch (error) {
    console.error("Error saat membuat tabel:", error);
    process.exit(1);
  }
}

// Main function
async function main() {
  switch (command) {
    case "init-db":
      await createTables();
      break;
    case "install-deps":
      console.log("Menginstal dependencies Turso...");
      execSync("npm install @libsql/client uuid", { stdio: "inherit" });
      console.log("Dependencies berhasil diinstal");
      break;
    default:
      console.log(`
Penggunaan:
  node scripts/turso.js init-db     - Inisialisasi database Turso dengan tabel
  node scripts/turso.js install-deps - Instal dependencies Turso
      `);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
