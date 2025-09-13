/**
 * Production Image URL Fix Script
 *
 * This script fixes broken image URLs in production database
 * Run this on production environment or with production database credentials
 */

const { createClient } = require("@libsql/client");

// Production database configuration
// Update these with actual production values
const PRODUCTION_DB_CONFIG = {
  url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
};

async function fixProductionImages() {
  console.log("🔧 Starting Production Image URL Fix...");

  if (!PRODUCTION_DB_CONFIG.url || !PRODUCTION_DB_CONFIG.authToken) {
    console.error("❌ Missing production database credentials");
    console.log(
      "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables"
    );
    process.exit(1);
  }

  const client = createClient(PRODUCTION_DB_CONFIG);

  try {
    // 1. Check current broken images
    console.log("\n📋 Checking for broken image URLs...");

    const brokenImages = await client.execute(`
      SELECT id, type, config 
      FROM LandingPageComponents 
      WHERE config LIKE '%/images/property-%' 
         OR config LIKE '%/images/hero-bg%'
         OR config LIKE '%"src":"/images/%'
    `);

    console.log(
      `Found ${brokenImages.rows.length} components with potentially broken images`
    );

    // 2. Fix each component
    let fixedCount = 0;

    for (const component of brokenImages.rows) {
      try {
        let config = JSON.parse(component.config);
        let needsUpdate = false;

        // Fix function
        const fixImageUrl = (url) => {
          if (!url) return url;

          // Replace missing property images with placeholder
          if (url.includes("/images/property-")) {
            return "/placeholder.svg";
          }

          // Keep valid existing images
          if (
            url.includes("hero-bg.jpg") ||
            url.includes("logo") ||
            url.includes("testimonial")
          ) {
            return url;
          }

          // Replace other potentially broken /images/ paths
          if (
            url.startsWith("/images/") &&
            !url.includes("hero-bg") &&
            !url.includes("logo")
          ) {
            return "/placeholder.svg";
          }

          return url;
        };

        // Fix based on component type
        if (component.type === "gallery" && config.images) {
          const originalImages = [...config.images];
          config.images = config.images.map((img) => {
            const newImg = { ...img };
            if (img.src) newImg.src = fixImageUrl(img.src);
            if (img.url) newImg.url = fixImageUrl(img.url);
            return newImg;
          });

          const hasChanges = config.images.some((img, idx) => {
            const orig = originalImages[idx];
            return orig && (orig.src !== img.src || orig.url !== img.url);
          });

          if (hasChanges) needsUpdate = true;
        }

        if (component.type === "custom-image") {
          const oldDesktop = config.desktopImage;
          const oldMobile = config.mobileImage;

          config.desktopImage = fixImageUrl(config.desktopImage);
          config.mobileImage = fixImageUrl(config.mobileImage);

          if (
            oldDesktop !== config.desktopImage ||
            oldMobile !== config.mobileImage
          ) {
            needsUpdate = true;
          }
        }

        if (component.type === "hero") {
          const oldBg = config.backgroundImage;
          config.backgroundImage = fixImageUrl(config.backgroundImage);

          if (oldBg !== config.backgroundImage) needsUpdate = true;
        }

        // Update database if changes needed
        if (needsUpdate) {
          await client.execute(
            "UPDATE LandingPageComponents SET config = ? WHERE id = ?",
            [JSON.stringify(config), component.id]
          );

          console.log(`✅ Fixed ${component.type} component: ${component.id}`);
          fixedCount++;
        }
      } catch (err) {
        console.error(
          `❌ Error fixing component ${component.id}:`,
          err.message
        );
      }
    }

    // 3. Update LandingPages table if it has content column
    console.log("\n📋 Checking LandingPages table...");

    try {
      const landingPages = await client.execute(`
        SELECT id, title, content 
        FROM LandingPages 
        WHERE content LIKE '%/images/property-%'
      `);

      for (const page of landingPages.rows) {
        try {
          let content = JSON.parse(page.content || "[]");
          let needsUpdate = false;

          content = content.map((component) => {
            if (component.config && typeof component.config === "object") {
              const config = component.config;

              if (config.images && Array.isArray(config.images)) {
                config.images = config.images.map((img) => {
                  const newImg = { ...img };
                  if (img.src && img.src.includes("/images/property-")) {
                    newImg.src = "/placeholder.svg";
                    needsUpdate = true;
                  }
                  if (img.url && img.url.includes("/images/property-")) {
                    newImg.url = "/placeholder.svg";
                    needsUpdate = true;
                  }
                  return newImg;
                });
              }
            }
            return component;
          });

          if (needsUpdate) {
            await client.execute(
              "UPDATE LandingPages SET content = ? WHERE id = ?",
              [JSON.stringify(content), page.id]
            );

            console.log(`✅ Fixed landing page: ${page.title}`);
            fixedCount++;
          }
        } catch (err) {
          console.error(
            `❌ Error fixing landing page ${page.title}:`,
            err.message
          );
        }
      }
    } catch (err) {
      console.log(
        "ℹ️ LandingPages table doesn't have content column or other error:",
        err.message
      );
    }

    // 4. Summary
    console.log("\n🎉 Production Image Fix Complete!");
    console.log(`✅ Fixed ${fixedCount} components/pages`);
    console.log("📝 All broken image URLs now point to /placeholder.svg");
    console.log("🚀 Deploy to apply changes to live website");
  } catch (error) {
    console.error("❌ Production fix failed:", error);
    process.exit(1);
  } finally {
    client.close();
  }
}

// Run the fix
if (require.main === module) {
  fixProductionImages().catch(console.error);
}

module.exports = { fixProductionImages };
