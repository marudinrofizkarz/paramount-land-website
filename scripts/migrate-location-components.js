const { createClient } = require("@libsql/client");
const path = require("path");

// Database configuration - use local SQLite for development
const DB_CONFIG = {
  url: `file:${path.join(__dirname, "../local.db")}`,
};

async function migrateLocationComponents() {
  console.log("🔄 Starting location component migration...");

  const db = createClient(DB_CONFIG);

  try {
    // Get all landing pages with content
    const pages = await db.execute(
      `SELECT id, slug, title, content FROM LandingPages 
       WHERE content IS NOT NULL AND content != ''`
    );

    console.log(`📊 Found ${pages.rows.length} landing pages to check`);

    let updatedCount = 0;
    let pagesUpdated = 0;

    for (const page of pages.rows) {
      try {
        const content = JSON.parse(page.content);
        let pageModified = false;

        // Check each component in the page content
        if (Array.isArray(content)) {
          for (let i = 0; i < content.length; i++) {
            const component = content[i];

            if (component.type === "location" && component.config) {
              // Check if marketingGallery is already configured
              if (!component.config.marketingGallery) {
                // Add default marketing gallery configuration
                component.config.marketingGallery = {
                  title: "Marketing Gallery",
                  address: "Lokasi Project - Hubungi untuk info lengkap",
                  phone: "+62 821-2345-6789",
                  hours: "Senin - Minggu: 09:00 - 17:00",
                  showGallery: true,
                };

                pageModified = true;
                updatedCount++;
                console.log(
                  `✅ Updated location component in page "${page.title}" (${page.slug})`
                );
              } else {
                console.log(
                  `ℹ️  Location component in page "${page.title}" already has marketing gallery config`
                );
              }
            }
          }

          // Update the page if any components were modified
          if (pageModified) {
            await db.execute({
              sql: `UPDATE LandingPages 
                    SET content = ?, updated_at = datetime('now') 
                    WHERE id = ?`,
              args: [JSON.stringify(content), page.id],
            });
            pagesUpdated++;
          }
        }
      } catch (error) {
        console.error(
          `❌ Error processing page ${page.id} (${page.slug}):`,
          error.message
        );
      }
    }

    console.log(`\n🎉 Migration completed successfully!`);
    console.log(
      `📈 Updated ${updatedCount} location components across ${pagesUpdated} pages`
    );

    // Verify the updates
    const verifyPages = await db.execute(
      `SELECT id, slug, title FROM LandingPages 
       WHERE content LIKE '%marketingGallery%'`
    );

    console.log(
      `✅ Verification: ${verifyPages.rows.length} pages now have marketing gallery config`
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    console.log("📝 Migration completed");
  }
}

// Run the migration
migrateLocationComponents().catch(console.error);
