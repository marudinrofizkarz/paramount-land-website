const { createClient } = require("@libsql/client");

async function debugImages() {
  // Create database client (pointing to local database)
  const client = createClient({
    url: "file:./local.db", // Local database
  });

  try {
    // Get all landing pages
    const landingPages = await client.execute(
      "SELECT id, title, slug, content FROM LandingPages LIMIT 5"
    );

    console.log("=== Landing Pages Found ===");
    console.log(`Total: ${landingPages.rows.length}`);

    for (const page of landingPages.rows) {
      console.log(`\n--- Page: ${page.title} (${page.slug}) ---`);

      // Parse content JSON
      let content = [];
      try {
        content = JSON.parse(page.content || "[]");
      } catch (e) {
        console.log("Failed to parse content JSON");
        continue;
      }

      console.log(`Components: ${content.length}`);

      // Look for components with images
      content.forEach((component, index) => {
        console.log(`  Component ${index + 1}: ${component.type}`);

        // Check for images in different component types
        if (component.type === "custom-image") {
          const config = component.config || {};
          console.log(`    Desktop Image: ${config.desktopImage || "None"}`);
          console.log(`    Mobile Image: ${config.mobileImage || "None"}`);
          console.log(`    Legacy Image: ${config.image || "None"}`);
        }

        if (component.type === "hero" && component.config?.backgroundImage) {
          console.log(
            `    Background Image: ${component.config.backgroundImage}`
          );
        }

        if (component.type === "gallery" && component.config?.images) {
          const images = component.config.images || [];
          console.log(`    Gallery Images: ${images.length}`);
          images.forEach((img, imgIndex) => {
            console.log(`      Image ${imgIndex + 1}: ${img.url}`);
          });
        }
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.close();
  }
}

debugImages();
