const { createClient } = require("@libsql/client");

// Database configuration (same as production)
const db = createClient({
  url: process.env.DATABASE_URL || "file:local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function testComponents() {
  try {
    console.log("Testing component templates from database...");

    const result = await db.execute(
      "SELECT type, name, is_system FROM LandingPageComponents ORDER BY is_system DESC, name ASC"
    );

    console.log(`\nFound ${result.rows.length} components:`);
    result.rows.forEach((row, index) => {
      console.log(
        `${index + 1}. ${row.name} (${row.type}) ${
          row.is_system ? "[SYSTEM]" : "[CUSTOM]"
        }`
      );
    });

    console.log("\n✅ Components are stored in the database successfully!");
  } catch (error) {
    console.error("❌ Error testing components:", error);
  }
}

testComponents();
