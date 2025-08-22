#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

// Read environment variables
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

async function createContactInquiryTable() {
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

    console.log("Creating ContactInquiry table...");
    
    // Create ContactInquiry table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ContactInquiry (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        project_name TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        message TEXT,
        inquiry_type TEXT NOT NULL DEFAULT 'general',
        unit_slug TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        source TEXT NOT NULL DEFAULT 'website',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_contact_inquiry_project ON ContactInquiry(project_id)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_contact_inquiry_status ON ContactInquiry(status)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_contact_inquiry_created ON ContactInquiry(created_at)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_contact_inquiry_email ON ContactInquiry(email)`);

    console.log("✅ ContactInquiry table created successfully!");
    
    // Verify table was created
    const tables = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='ContactInquiry'"
    );
    if (tables.rows.length > 0) {
      console.log("✅ ContactInquiry table verified!");
    }
    
  } catch (error) {
    console.error("Error creating ContactInquiry table:", error);
    process.exit(1);
  }
}

createContactInquiryTable();