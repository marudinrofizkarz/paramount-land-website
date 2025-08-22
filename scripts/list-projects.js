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

async function listProjects() {
  const env = readEnvFile();
  const dbUrl = env.DATABASE_URL;
  const authToken = env.DATABASE_AUTH_TOKEN;

  const client = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  try {
    console.log("📋 Getting projects from database...");

    const projectsResult = await client.execute(
      "SELECT id, name, slug FROM Project"
    );

    if (!projectsResult.rows || projectsResult.rows.length === 0) {
      console.log("❌ No projects found in database.");
      return;
    }

    console.log("\n🏗️  Projects in database:");
    projectsResult.rows.forEach((row) => {
      console.log(`- ID: ${row.id}, Name: ${row.name}, Slug: ${row.slug}`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

listProjects();
