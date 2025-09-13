const { createClient } = require("@libsql/client");

async function fixBrokenImageUrls() {
  const client = createClient({
    url: "file:./local.db",
  });

  try {
    console.log("=== Fixing Broken Image URLs ===");

    // Get all components with potential image issues
    const components = await client.execute(
      "SELECT id, type, config FROM LandingPageComponents"
    );

    let fixedComponents = 0;

    for (const component of components.rows) {
      if (component.config) {
        try {
          let config = JSON.parse(component.config);
          let needsUpdate = false;

          // Fix different types of broken image paths
          const fixImageUrl = (url) => {
            if (!url) return url;

            // If it's a missing relative path, replace with placeholder
            if (
              url.startsWith("/images/") &&
              !url.includes("hero-bg.jpg") &&
              !url.includes("logo")
            ) {
              return "/placeholder.svg";
            }

            // Keep valid paths
            return url;
          };

          // Fix based on component type
          if (component.type === "hero") {
            const oldImage = config.backgroundImage;
            config.backgroundImage = fixImageUrl(config.backgroundImage);
            if (oldImage !== config.backgroundImage) {
              console.log(
                `Fixed hero background: ${oldImage} -> ${config.backgroundImage}`
              );
              needsUpdate = true;
            }
          }

          if (component.type === "custom-image") {
            const oldDesktop = config.desktopImage;
            const oldMobile = config.mobileImage;
            const oldLegacy = config.image;

            config.desktopImage = fixImageUrl(config.desktopImage);
            config.mobileImage = fixImageUrl(config.mobileImage);
            config.image = fixImageUrl(config.image);

            if (
              oldDesktop !== config.desktopImage ||
              oldMobile !== config.mobileImage ||
              oldLegacy !== config.image
            ) {
              console.log(`Fixed custom-image URLs for ${component.id}`);
              needsUpdate = true;
            }
          }

          if (component.type === "gallery" && config.images) {
            const oldImages = [...config.images];
            config.images = config.images.map((img) => {
              if (img.src) {
                const fixedSrc = fixImageUrl(img.src);
                return { ...img, src: fixedSrc, url: fixedSrc }; // Ensure both src and url are fixed
              }
              if (img.url) {
                const fixedUrl = fixImageUrl(img.url);
                return { ...img, url: fixedUrl };
              }
              return img;
            });

            const hasChanges = config.images.some((img, idx) => {
              const oldImg = oldImages[idx];
              return (
                oldImg && (oldImg.src !== img.src || oldImg.url !== img.url)
              );
            });

            if (hasChanges) {
              console.log(`Fixed gallery images for ${component.id}`);
              needsUpdate = true;
            }
          }

          // Update the component if changes were made
          if (needsUpdate) {
            await client.execute(
              "UPDATE LandingPageComponents SET config = ? WHERE id = ?",
              [JSON.stringify(config), component.id]
            );
            fixedComponents++;
          }
        } catch (e) {
          console.log(`Error processing ${component.id}: ${e.message}`);
        }
      }
    }

    console.log(
      `\n✅ Fixed ${fixedComponents} components with broken image URLs`
    );
    console.log("All broken image paths now point to /placeholder.svg");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.close();
  }
}

fixBrokenImageUrls();
