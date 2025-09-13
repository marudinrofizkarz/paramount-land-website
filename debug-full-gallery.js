const { createClient } = require("@libsql/client");

async function debugFullGallery() {
  const client = createClient({
    url: "file:./local.db",
  });

  try {
    // Get gallery component specifically
    const gallery = await client.execute(
      "SELECT * FROM LandingPageComponents WHERE id = 'gallery-1'"
    );

    if (gallery.rows.length > 0) {
      const config = JSON.parse(gallery.rows[0].config);
      console.log("=== Gallery Component Full Config ===");
      console.log(JSON.stringify(config, null, 2));
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.close();
  }
}

debugFullGallery();
