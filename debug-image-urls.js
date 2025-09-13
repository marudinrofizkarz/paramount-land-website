const { createClient } = require("@libsql/client");

async function debugImageUrls() {
  const client = createClient({
    url: "file:./local.db",
  });

  try {
    // Get components with image types
    const components = await client.execute(
      "SELECT id, type, config FROM LandingPageComponents WHERE type IN ('hero', 'gallery', 'custom-image')"
    );

    console.log(
      `=== Image Components Analysis (${components.rows.length}) ===`
    );

    for (const component of components.rows) {
      console.log(
        `\n--- ${component.type.toUpperCase()} Component (${component.id}) ---`
      );

      if (component.config) {
        try {
          const config = JSON.parse(component.config);

          // Analyze different image URL patterns
          const imageUrls = [];

          if (config.backgroundImage)
            imageUrls.push(["Background Image", config.backgroundImage]);
          if (config.desktopImage)
            imageUrls.push(["Desktop Image", config.desktopImage]);
          if (config.mobileImage)
            imageUrls.push(["Mobile Image", config.mobileImage]);
          if (config.image) imageUrls.push(["Legacy Image", config.image]);

          if (config.images && Array.isArray(config.images)) {
            config.images.forEach((img, idx) => {
              if (img.url) {
                imageUrls.push([`Gallery Image ${idx + 1}`, img.url]);
              }
            });
          }

          // Categorize URLs
          imageUrls.forEach(([type, url]) => {
            console.log(`${type}:`);
            console.log(`  URL: ${url}`);

            // Analyze URL type
            if (url.startsWith("data:")) {
              console.log(`  Type: Data URL (Base64)`);
              console.log(
                `  Size: ~${Math.round((url.length * 0.75) / 1024)}KB`
              );
            } else if (url.includes("cloudinary.com")) {
              console.log(`  Type: Cloudinary URL`);
            } else if (url.startsWith("http")) {
              console.log(`  Type: External URL`);
            } else if (url.startsWith("/")) {
              console.log(`  Type: Relative Path`);
            } else {
              console.log(`  Type: Unknown`);
            }
            console.log("");
          });
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

debugImageUrls();
