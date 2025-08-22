#!/usr/bin/env node

// Script untuk memverifikasi koneksi ke database Turso
// Run: node verify-turso-connection.js

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

// Fungsi untuk memverifikasi koneksi
async function verifyConnection() {
  const env = readEnvFile();
  const dbUrl = env.DATABASE_URL;
  const authToken = env.DATABASE_AUTH_TOKEN;

  if (!dbUrl) {
    console.error("DATABASE_URL tidak ditemukan di file .env.local");
    process.exit(1);
  }

  if (!authToken || authToken === "[MASUKKAN_TOKEN_BARU_ANDA_DI_SINI]") {
    console.error("DATABASE_AUTH_TOKEN tidak valid di file .env.local");
    console.error("Harap perbarui dengan token baru dari Turso dashboard");
    process.exit(1);
  }

  console.log("Memeriksa koneksi ke database Turso...");
  console.log(`URL Database: ${dbUrl}`);
  console.log(
    `Token: ${authToken.substring(0, 10)}...${authToken.substring(
      authToken.length - 5
    )}`
  );

  try {
    const db = createClient({
      url: dbUrl,
      authToken: authToken,
    });

    // Coba jalankan query sederhana
    const result = await db.execute("SELECT 1 as test");
    console.log("\n✅ Koneksi ke database Turso berhasil!");
    console.log("Hasil query test:", result.rows[0]);

    // Cek tabel yang ada
    const tables = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    console.log("\nTabel yang ada di database:");
    if (tables.rows.length === 0) {
      console.log("- Tidak ada tabel yang ditemukan");
    } else {
      tables.rows.forEach((row) => {
        console.log(`- ${row.name}`);
      });
    }

    // Cek apakah tabel Project sudah ada
    const projectTable = tables.rows.find((row) => row.name === "Project");

    if (projectTable) {
      // Hitung jumlah data di tabel Project
      const count = await db.execute("SELECT COUNT(*) as count FROM Project");
      console.log(`\nJumlah data di tabel Project: ${count.rows[0].count}`);
    } else {
      console.log(
        "\n⚠️ Tabel Project belum dibuat. Anda perlu menjalankan migrasi:"
      );
      console.log("   node scripts/migrate-project.js");
    }
  } catch (error) {
    console.error("\n❌ Koneksi ke database Turso gagal!");
    console.error("Error:", error);
    console.error("\nKemungkinan penyebab:");
    console.error("1. Token tidak valid atau kedaluwarsa");
    console.error("2. URL database tidak benar");
    console.error("3. Database tidak tersedia atau dihapus");
    console.error("\nSolusi:");
    console.error("1. Buat token baru di Turso dashboard");
    console.error("2. Perbarui token di file .env.local");
    console.error("3. Pastikan database masih ada di Turso dashboard");
    process.exit(1);
  }
}

// Jalankan verifikasi
verifyConnection();
