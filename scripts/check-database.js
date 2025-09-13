const { createClient } = require("@libsql/client");
const path = require("path");

// Database configuration - use local SQLite for development
const DB_CONFIG = {
  url: `file:${path.join(__dirname, "../local.db")}`,
};

async function checkTables() {
  console.log("🔍 Checking database tables...");

  const db = createClient(DB_CONFIG);

  try {
    // List all tables
    const tables = await db.execute(
      `SELECT name FROM sqlite_master WHERE type='table'`
    );

    console.log(`📊 Found ${tables.rows.length} tables:`);
    for (const table of tables.rows) {
      console.log(`  - ${table.name}`);
    }

    // Check LandingPageComponents table schema
    try {
      const schema = await db.execute(
        `PRAGMA table_info(LandingPageComponents)`
      );
      console.log(`\n� LandingPageComponents table schema:`);
      for (const column of schema.rows) {
        console.log(`  - ${column.name}: ${column.type}`);
      }
    } catch (error) {
      console.log("ℹ️  Could not get LandingPageComponents schema");
    }

    // Get sample landing pages with their content
    try {
      const pages = await db.execute(
        `SELECT id, slug, title, content FROM LandingPages LIMIT 2`
      );
      console.log(
        `\n📄 Found ${pages.rows.length} landing pages (showing first 2):`
      );
      for (const page of pages.rows) {
        console.log(
          `  - ID: ${page.id}, Slug: ${page.slug}, Title: ${page.title}`
        );
        if (page.content) {
          try {
            const content = JSON.parse(page.content);
            console.log(`    Components (${content.length}):`);
            content.forEach((comp, i) => {
              console.log(`      ${i + 1}. Type: ${comp.type}, ID: ${comp.id}`);
              if (comp.type === "location") {
                console.log(
                  `         Has marketingGallery: ${!!comp.config
                    ?.marketingGallery}`
                );
              }
            });
          } catch (e) {
            console.log(`    Content: Could not parse JSON`);
          }
        }
      }
    } catch (error) {
      console.log("ℹ️  No landing pages found or error:", error.message);
    }
  } catch (error) {
    console.error("❌ Error checking tables:", error);
  } finally {
    console.log("📝 Database check completed");
  }
}

// Run the check
checkTables().catch(console.error);
