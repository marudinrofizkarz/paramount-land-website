const { createClient } = require("@libsql/client");
const path = require("path");

const DB_CONFIG = {
  url: `file:${path.join(__dirname, "../local.db")}`,
};

async function checkSchema() {
  const db = createClient(DB_CONFIG);

  try {
    // Check LandingPages schema
    const schema = await db.execute(`PRAGMA table_info(LandingPages)`);
    console.log(`📋 LandingPages columns:`);
    for (const col of schema.rows) {
      console.log(`  - ${col.name}: ${col.type}`);
    }

    // Get sample data
    const pages = await db.execute(`SELECT * FROM LandingPages LIMIT 1`);
    if (pages.rows.length > 0) {
      console.log(
        `\n📄 Sample landing page columns:`,
        Object.keys(pages.rows[0])
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkSchema();
