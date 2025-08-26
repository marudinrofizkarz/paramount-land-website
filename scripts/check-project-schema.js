// Script to check the schema of the Project table
const { createClient } = require("@libsql/client");
require("dotenv").config();

async function checkSchema() {
  try {
    // Get database URL from environment variables or use a default for development
    const dbUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
    const authToken =
      process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

    if (!dbUrl) {
      console.error("Database URL not found in environment variables");
      process.exit(1);
    }

    console.log("Connecting to database...");
    const db = createClient({
      url: dbUrl,
      authToken: authToken,
    });

    // Query table schema
    console.log("Checking Project table schema...");
    const schema = await db.execute("PRAGMA table_info(Project)");

    console.log("\nProject table columns:");
    schema.rows.forEach((column) => {
      console.log(`- ${column.name} (${column.type})`);
    });

    // Check if the general_inquiries project exists
    console.log("\nChecking if general_inquiries project exists:");
    const project = await db.execute({
      sql: "SELECT * FROM Project WHERE id = ?",
      args: ["general_inquiries"],
    });

    if (project.rows.length > 0) {
      console.log("general_inquiries project exists!");
    } else {
      console.log("general_inquiries project does NOT exist.");
    }

    // Check ContactInquiry table schema for foreign key constraints
    console.log("\nChecking ContactInquiry table schema:");
    const contactSchema = await db.execute("PRAGMA table_info(ContactInquiry)");
    console.log("ContactInquiry table columns:");
    contactSchema.rows.forEach((column) => {
      console.log(`- ${column.name} (${column.type})`);
    });

    // Check foreign keys
    console.log("\nChecking foreign key constraints:");
    const foreignKeys = await db.execute(
      "PRAGMA foreign_key_list(ContactInquiry)"
    );
    console.log("Foreign key constraints:");
    foreignKeys.rows.forEach((fk) => {
      console.log(`- Table: ${fk.table}, From: ${fk.from}, To: ${fk.to}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error checking schema:", error);
    process.exit(1);
  }
}

checkSchema();
