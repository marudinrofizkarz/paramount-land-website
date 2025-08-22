#!/usr/bin/env node

// Debug script untuk menguji koneksi Cloudinary dan Turso
const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");
const { v2: cloudinary } = require("cloudinary");

// Baca file .env.local
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

// Fungsi untuk menguji koneksi database Turso
async function testTursoConnection() {
  const env = readEnvFile();
  const dbUrl = env.DATABASE_URL;
  const authToken = env.DATABASE_AUTH_TOKEN;

  console.log("\n===== TURSO DATABASE TEST =====");
  console.log(`URL: ${dbUrl}`);
  console.log(`Token: ${authToken ? "Configured ✓" : "Missing ✗"}`);

  if (!dbUrl || !authToken) {
    console.error(
      "❌ DATABASE_URL atau DATABASE_AUTH_TOKEN tidak dikonfigurasi dengan benar"
    );
    return false;
  }

  try {
    const db = createClient({
      url: dbUrl,
      authToken: authToken,
    });

    // Coba jalankan query sederhana
    await db.execute("SELECT 1 as test");
    console.log("✅ Koneksi ke database Turso berhasil!");

    // Periksa tabel Project
    const projectTable = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Project'"
    );

    if (projectTable.rows.length > 0) {
      console.log("✅ Tabel Project ditemukan");
      return true;
    } else {
      console.log(
        "❌ Tabel Project tidak ditemukan. Migrasi mungkin belum dijalankan."
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Koneksi ke database Turso gagal:", error.message);
    return false;
  }
}

// Fungsi untuk menguji koneksi Cloudinary
async function testCloudinaryConnection() {
  const env = readEnvFile();
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  console.log("\n===== CLOUDINARY TEST =====");
  console.log(`Cloud Name: ${cloudName || "Missing ✗"}`);
  console.log(`API Key: ${apiKey ? "Configured ✓" : "Missing ✗"}`);
  console.log(`API Secret: ${apiSecret ? "Configured ✓" : "Missing ✗"}`);

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("❌ Konfigurasi Cloudinary tidak lengkap");
    return false;
  }

  // Konfigurasi Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  try {
    // Coba dapatkan informasi akun untuk memverifikasi kredensial
    const result = await cloudinary.api.ping();
    console.log("✅ Koneksi ke Cloudinary berhasil!");
    return true;
  } catch (error) {
    console.error("❌ Koneksi ke Cloudinary gagal:", error.message);
    return false;
  }
}

// Fungsi untuk menguji upload Cloudinary
async function testCloudinaryUpload() {
  const env = readEnvFile();
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  // Konfigurasi Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  console.log("\n===== CLOUDINARY UPLOAD TEST =====");

  try {
    // Buat sample image data URL (1x1 pixel transparent PNG)
    const sampleImage =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

    // Upload gambar sample
    console.log("Mencoba upload gambar sample...");
    const result = await cloudinary.uploader.upload(sampleImage, {
      folder: "debug-test",
      resource_type: "image",
    });

    console.log("✅ Upload ke Cloudinary berhasil!");
    console.log(`URL Gambar: ${result.secure_url}`);

    return true;
  } catch (error) {
    console.error("❌ Upload ke Cloudinary gagal:", error.message);
    return false;
  }
}

// Fungsi untuk menguji insert ke database
async function testDatabaseInsert() {
  const env = readEnvFile();
  const dbUrl = env.DATABASE_URL;
  const authToken = env.DATABASE_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    return false;
  }

  console.log("\n===== DATABASE INSERT TEST =====");

  try {
    const db = createClient({
      url: dbUrl,
      authToken: authToken,
    });

    // Cek apakah tabel Project ada
    const tableCheck = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Project'"
    );

    if (tableCheck.rows.length === 0) {
      console.log(
        "❌ Tabel Project tidak ditemukan. Tidak dapat melakukan insert test."
      );
      return false;
    }

    // Buat test data
    const testId = `test-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Coba insert data
    console.log("Mencoba insert data test...");
    await db.execute(
      `INSERT INTO Project (
        id, name, slug, location, description, status, units, 
        startingPrice, maxPrice, completion, mainImage, 
        galleryImages, brochureUrl, youtubeLink, advantages,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testId,
        "Test Project",
        `test-project-${Date.now()}`,
        "Test Location",
        "Test Description",
        "planning",
        10,
        "1000000",
        "2000000",
        0,
        "https://placeholder.com/300",
        "[]",
        null,
        null,
        "[]",
        timestamp,
        timestamp,
      ]
    );

    console.log("✅ Insert ke database berhasil!");

    // Hapus data test
    await db.execute("DELETE FROM Project WHERE id = ?", [testId]);
    console.log("✅ Data test berhasil dihapus");

    return true;
  } catch (error) {
    console.error("❌ Insert ke database gagal:", error.message);
    console.error("Detail error:", error);
    return false;
  }
}

// Main function
async function main() {
  console.log("=================================");
  console.log("DIAGNOSTIC TEST: PROJECT CREATION");
  console.log("=================================");

  // Test database connection
  const dbConnected = await testTursoConnection();

  // Test Cloudinary connection
  const cloudinaryConnected = await testCloudinaryConnection();

  // Only proceed with more tests if basic connections work
  if (dbConnected && cloudinaryConnected) {
    // Test Cloudinary upload
    const uploadWorks = await testCloudinaryUpload();

    // Test database insert
    const insertWorks = await testDatabaseInsert();

    console.log("\n===== SUMMARY =====");
    console.log(
      `Database Connection: ${dbConnected ? "✅ Working" : "❌ Failed"}`
    );
    console.log(
      `Cloudinary Connection: ${
        cloudinaryConnected ? "✅ Working" : "❌ Failed"
      }`
    );
    console.log(
      `Cloudinary Upload: ${uploadWorks ? "✅ Working" : "❌ Failed"}`
    );
    console.log(`Database Insert: ${insertWorks ? "✅ Working" : "❌ Failed"}`);

    if (!uploadWorks || !insertWorks) {
      console.log("\n⚠️ REKOMENDASI:");

      if (!uploadWorks) {
        console.log(
          "- Periksa konfigurasi Cloudinary (cloud_name, api_key, api_secret)"
        );
        console.log(
          "- Pastikan akun Cloudinary aktif dan memiliki quota yang cukup"
        );
        console.log(
          "- Periksa apakah ada firewall atau proxy yang memblokir koneksi ke Cloudinary"
        );
      }

      if (!insertWorks) {
        console.log("- Periksa skema tabel Project");
        console.log("- Pastikan token database memiliki izin tulis");
        console.log("- Periksa batasan kapasitas atau kuota database");
      }
    }
  }
}

main().catch(console.error);
