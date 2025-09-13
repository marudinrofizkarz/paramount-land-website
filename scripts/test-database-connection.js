const { createClient } = require("@libsql/client");

// Database Configuration
const DATABASE_CONFIG = {
  url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "",
  authToken:
    process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN || "",
};

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...\n");

  // Check environment variables
  console.log("📋 Database Configuration:");
  console.log(`   URL: ${DATABASE_CONFIG.url ? "✅ Set" : "❌ Missing"}`);
  console.log(
    `   Auth Token: ${DATABASE_CONFIG.authToken ? "✅ Set" : "❌ Missing"}`
  );

  if (!DATABASE_CONFIG.url || !DATABASE_CONFIG.authToken) {
    console.log("\n⚠️  Database credentials are not properly configured");
    console.log("🔧 For local development, these may be optional");
    console.log(
      "🚀 For Vercel deployment, set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN"
    );
    return;
  }

  try {
    const db = createClient({
      url: DATABASE_CONFIG.url,
      authToken: DATABASE_CONFIG.authToken,
    });

    // Test connection with a simple query
    const result = await db.execute("SELECT 1 as test");

    if (result.rows.length > 0) {
      console.log("\n✅ Database connection successful!");
      console.log(
        "🔗 Connected to:",
        DATABASE_CONFIG.url.replace(/\/\/.*@/, "//***@")
      ); // Hide credentials

      // Test landing pages table
      try {
        const landingPages = await db.execute(
          "SELECT COUNT(*) as count FROM LandingPages"
        );
        console.log(
          `📄 Landing Pages table: ${landingPages.rows[0].count} records`
        );
      } catch (error) {
        console.log("📄 Landing Pages table: Not accessible or doesn't exist");
      }
    } else {
      console.log("⚠️  Connection established but query returned no results");
    }
  } catch (error) {
    console.error("\n❌ Database connection failed:", error.message);
    console.log(
      "🔧 Please check your Turso credentials and network connection"
    );

    if (error.message.includes("SQLITE_AUTH")) {
      console.log("🔑 Authentication error - check your TURSO_AUTH_TOKEN");
    } else if (error.message.includes("network")) {
      console.log(
        "🌐 Network error - check your internet connection and database URL"
      );
    }
  }
}

testDatabaseConnection().catch(console.error);
