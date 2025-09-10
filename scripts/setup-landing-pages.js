const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

// Database configuration
const db = createClient({
  url: process.env.DATABASE_URL || "file:local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function setupLandingPageTables() {
  try {
    console.log("Setting up Landing Page tables...");

    // Create tables directly with individual statements
    const createTableStatements = [
      `CREATE TABLE IF NOT EXISTS LandingPages (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        content JSON NOT NULL,
        meta_title TEXT,
        meta_description TEXT,
        og_image TEXT,
        status TEXT NOT NULL DEFAULT 'draft',
        template_type TEXT DEFAULT 'custom',
        target_audience TEXT,
        campaign_source TEXT,
        tracking_code TEXT,
        settings JSON,
        published_at TEXT,
        expires_at TEXT,
        created_by TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS LandingPageComponents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        config JSON NOT NULL,
        preview_image TEXT,
        is_system INTEGER DEFAULT 0,
        created_by TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )`,

      `CREATE TABLE IF NOT EXISTS LandingPageAnalytics (
        id TEXT PRIMARY KEY,
        landing_page_id TEXT NOT NULL,
        visit_count INTEGER DEFAULT 0,
        conversion_count INTEGER DEFAULT 0,
        source TEXT,
        device_type TEXT,
        date TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )`,
    ];

    // Execute CREATE TABLE statements
    for (const statement of createTableStatements) {
      try {
        console.log("Creating table...");
        await db.execute(statement);
        console.log("✓ Table created successfully");
      } catch (error) {
        console.error("✗ Error creating table:", error.message);
      }
    }

    // Create indexes
    const indexStatements = [
      "CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON LandingPages(slug)",
      "CREATE INDEX IF NOT EXISTS idx_landing_pages_status ON LandingPages(status)",
      "CREATE INDEX IF NOT EXISTS idx_landing_pages_created_by ON LandingPages(created_by)",
      "CREATE INDEX IF NOT EXISTS idx_landing_pages_campaign_source ON LandingPages(campaign_source)",
      "CREATE INDEX IF NOT EXISTS idx_landing_page_analytics_page_date ON LandingPageAnalytics(landing_page_id, date)",
      "CREATE INDEX IF NOT EXISTS idx_landing_page_components_type ON LandingPageComponents(type)",
    ];

    for (const statement of indexStatements) {
      try {
        console.log("Creating index...");
        await db.execute(statement);
        console.log("✓ Index created successfully");
      } catch (error) {
        console.error("✗ Error creating index:", error.message);
      }
    }

    console.log("✓ Landing Page tables setup completed!");

    // Verify tables were created
    try {
      const tables = await db.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%Landing%'"
      );
      console.log(
        "Created tables:",
        tables.rows.map((row) => row.name)
      );
    } catch (error) {
      console.error("Error checking tables:", error.message);
    }

    // Insert default components if they don't exist
    await insertDefaultComponents();
  } catch (error) {
    console.error("Error setting up Landing Page tables:", error);
    process.exit(1);
  }
}

async function insertDefaultComponents() {
  try {
    console.log("Inserting default components...");

    const defaultComponents = [
      {
        id: "hero-1",
        name: "Hero Section - Property Focus",
        type: "hero",
        config: JSON.stringify({
          title: "Find Your Dream Property",
          subtitle: "Discover premium properties with exclusive offers",
          backgroundImage: "/images/hero-bg.svg",
          ctaText: "Explore Now",
          ctaAction: "scroll-to-form",
          overlay: true,
          textAlign: "center",
        }),
        is_system: 1,
      },
      {
        id: "form-1",
        name: "Contact Form - Property Inquiry",
        type: "form",
        config: JSON.stringify({
          title: "Get More Information",
          fields: [
            { name: "name", type: "text", label: "Full Name", required: true },
            {
              name: "email",
              type: "email",
              label: "Email Address",
              required: true,
            },
            {
              name: "phone",
              type: "tel",
              label: "Phone Number",
              required: true,
            },
            {
              name: "property_type",
              type: "select",
              label: "Property Interest",
              options: ["Apartment", "House", "Commercial"],
              required: false,
            },
            {
              name: "budget",
              type: "select",
              label: "Budget Range",
              options: ["< 1M", "1M - 3M", "3M - 5M", "> 5M"],
              required: false,
            },
            {
              name: "message",
              type: "textarea",
              label: "Additional Message",
              required: false,
            },
          ],
          submitText: "Submit Inquiry",
          successMessage: "Thank you! We will contact you soon.",
          style: "modern",
        }),
        is_system: 1,
      },
      {
        id: "features-1",
        name: "Features Grid - Property Benefits",
        type: "features",
        config: JSON.stringify({
          title: "Why Choose Our Properties",
          features: [
            {
              icon: "map-pin",
              title: "Prime Location",
              description:
                "Strategic locations near business districts and transportation",
            },
            {
              icon: "shield-check",
              title: "Legal Guarantee",
              description: "Complete legal documentation and certificates",
            },
            {
              icon: "home",
              title: "Ready to Live",
              description: "Move-in ready properties with modern facilities",
            },
            {
              icon: "trending-up",
              title: "Investment Value",
              description: "High potential for property value appreciation",
            },
          ],
          layout: "grid",
          columns: 2,
        }),
        is_system: 1,
      },
    ];

    for (const component of defaultComponents) {
      try {
        await db.execute(
          `INSERT OR IGNORE INTO LandingPageComponents (id, name, type, config, is_system) VALUES (?, ?, ?, ?, ?)`,
          [
            component.id,
            component.name,
            component.type,
            component.config,
            component.is_system,
          ]
        );
        console.log(`✓ Inserted component: ${component.name}`);
      } catch (error) {
        console.error(
          `✗ Error inserting component ${component.name}:`,
          error.message
        );
      }
    }

    console.log("✓ Default components setup completed!");
  } catch (error) {
    console.error("Error inserting default components:", error);
  }
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "setup-landing-pages":
      await setupLandingPageTables();
      break;
    default:
      console.log("Available commands:");
      console.log(
        "  setup-landing-pages - Setup Landing Page tables and default components"
      );
      break;
  }

  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = { setupLandingPageTables };
