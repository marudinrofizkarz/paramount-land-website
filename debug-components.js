const { createClient } = require("@libsql/client");

async function debugLandingPageComponents() {
  const client = createClient({
    url: "file:./local.db",
  });

  try {
    // Check LandingPageComponents table structure first
    const tableInfo = await client.execute(
      "PRAGMA table_info(LandingPageComponents)"
    );
    console.log("=== LandingPageComponents Table Structure ===");
    for (const column of tableInfo.rows) {
      console.log(`${column.name}: ${column.type}`);
    }

    // Get sample components with image data
    const components = await client.execute(
      "SELECT * FROM LandingPageComponents LIMIT 5"
    );
    console.log(
      `\n=== Landing Page Components (${components.rows.length}) ===`
    );

    for (const component of components.rows) {
      console.log(`\nComponent ID: ${component.id}`);
      console.log(`Type: ${component.type}`);
      console.log(`Landing Page ID: ${component.landing_page_id}`);

      // Parse config JSON if it exists
      if (component.config) {
        try {
          const config = JSON.parse(component.config);

          // Check for images in config
          if (config.desktopImage) {
            console.log(`Desktop Image: ${config.desktopImage}`);
          }
          if (config.mobileImage) {
            console.log(`Mobile Image: ${config.mobileImage}`);
          }
          if (config.image) {
            console.log(`Legacy Image: ${config.image}`);
          }
          if (config.backgroundImage) {
            console.log(`Background Image: ${config.backgroundImage}`);
          }
          if (config.images && Array.isArray(config.images)) {
            console.log(`Gallery Images: ${config.images.length} items`);
            config.images.forEach((img, idx) => {
              if (img.url) {
                console.log(
                  `  - Image ${idx + 1}: ${img.url.substring(0, 80)}...`
                );
              }
            });
          }
        } catch (e) {
          console.log(`Config parse error: ${e.message}`);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.close();
  }
}

debugLandingPageComponents();
