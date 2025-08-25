// Simple script to add promo column directly using SQL

import { exec } from "child_process";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Full path to the database file
const dbPath = path.join(process.cwd(), ".turso/data.db");

console.log(`Using database at: ${dbPath}`);

// SQL command to add the column
const sql = `ALTER TABLE units ADD COLUMN promo TEXT;`;

// Create a temporary SQL file
const tempSqlFile = path.join(process.cwd(), "temp-migration.sql");
fs.writeFileSync(tempSqlFile, sql);

// Run the sqlite3 command
const cmd = `sqlite3 ${dbPath} < ${tempSqlFile}`;
console.log(`Executing: ${cmd}`);

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    console.error(`stderr: ${stderr}`);
    // Clean up
    fs.unlinkSync(tempSqlFile);
    process.exit(1);
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }

  console.log(`stdout: ${stdout}`);
  console.log("Column added successfully!");

  // Clean up
  fs.unlinkSync(tempSqlFile);
});
