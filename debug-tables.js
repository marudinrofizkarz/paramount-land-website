const { createClient } = require("@libsql/client");

async function debugTables() {
  // Create database client (pointing to local database)
  const client = createClient({
    url: "file:./local.db", // Local database
  });

  try {
    // Get all tables
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );

    console.log("=== Database Tables ===");
    for (const table of tables.rows) {
      console.log(`- ${table.name}`);
    }

    // Check HeroSlider table for images
    try {
      const heroSliders = await client.execute(
        "SELECT id, title, desktopImage, mobileImage FROM HeroSlider LIMIT 3"
      );
      console.log(`\n=== Hero Sliders (${heroSliders.rows.length}) ===`);

      for (const slider of heroSliders.rows) {
        console.log(`${slider.title}:`);
        console.log(`  Desktop: ${slider.desktopImage || "None"}`);
        console.log(`  Mobile: ${slider.mobileImage || "None"}`);
      }
    } catch (e) {
      console.log("\nNo HeroSlider table or error:", e.message);
    }

    // Check Projects table for images
    try {
      const projects = await client.execute(
        "SELECT id, name, mainImage, galleryImages FROM Projects LIMIT 3"
      );
      console.log(`\n=== Projects (${projects.rows.length}) ===`);

      for (const project of projects.rows) {
        console.log(`${project.name}:`);
        console.log(`  Main Image: ${project.mainImage || "None"}`);
        console.log(
          `  Gallery: ${
            project.galleryImages
              ? JSON.parse(project.galleryImages).length + " images"
              : "None"
          }`
        );
      }
    } catch (e) {
      console.log("\nNo Projects table or error:", e.message);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.close();
  }
}

debugTables();
