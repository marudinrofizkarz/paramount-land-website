#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const readline = require("readline");

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

// Interface untuk input dari pengguna
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fungsi untuk mendapatkan input dari user
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function addUser(manualInput = false) {
  try {
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

    let userData = {
      id: uuidv4(),
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (manualInput) {
      console.log("\n=== Tambah User Baru ===\n");
      userData.username = await question("Username: ");
      userData.email = await question("Email: ");
      userData.password = await question("Password: ");
      userData.name = await question("Nama Lengkap: ");
      userData.role = (await question("Role (admin/user): ")) || "user";
    }

    // Hash password dengan bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Simpan data user ke database
    console.log("\nMenyimpan user ke database...");

    try {
      // Cek apakah username sudah ada
      const existingUsername = await client.execute({
        sql: "SELECT username FROM Users WHERE username = ?",
        args: [userData.username],
      });

      if (existingUsername.rows.length > 0) {
        console.error(`\n❌ Username '${userData.username}' sudah digunakan.`);
        process.exit(1);
      }

      // Cek apakah email sudah ada
      const existingEmail = await client.execute({
        sql: "SELECT email FROM Users WHERE email = ?",
        args: [userData.email],
      });

      if (existingEmail.rows.length > 0) {
        console.error(`\n❌ Email '${userData.email}' sudah terdaftar.`);
        process.exit(1);
      }

      // Insert user ke database
      await client.execute({
        sql: `
          INSERT INTO Users (id, username, email, password, name, role, avatar_url, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          userData.id,
          userData.username,
          userData.email,
          hashedPassword,
          userData.name,
          userData.role,
          userData.avatar_url,
          userData.created_at,
          userData.updated_at,
        ],
      });

      console.log("\n✅ User berhasil ditambahkan!");
      console.log("\nInformasi User:");
      console.log(`Username: ${userData.username}`);
      console.log(`Email: ${userData.email}`);
      console.log(`Role: ${userData.role}`);
      console.log(`Created At: ${userData.created_at}`);
      console.log("\nSekarang Anda dapat login dengan user tersebut.");
    } catch (error) {
      console.error("Error saat menambahkan user:", error.message);
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Jalankan fungsi utama
const args = process.argv.slice(2);
const interactive = args.includes("--interactive") || args.includes("-i");

addUser(interactive);
