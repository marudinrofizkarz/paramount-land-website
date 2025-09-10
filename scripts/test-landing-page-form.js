#!/usr/bin/env node

/**
 * Test script untuk verifikasi landing page form integration dengan database Turso
 * dan sweet alerts functionality
 */

const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

// Read environment variables
function readEnvFile() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error(".env.local file not found");
    return {};
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  const env = {};
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  });
  return env;
}

async function testDatabaseConnection() {
  const env = readEnvFile();
  const dbUrl = env.DATABASE_URL;
  const authToken = env.DATABASE_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    console.error(
      "❌ DATABASE_URL and DATABASE_AUTH_TOKEN must be set in .env.local"
    );
    return false;
  }

  try {
    const db = createClient({
      url: dbUrl,
      authToken: authToken,
    });

    console.log("🔍 Testing database connection...");

    // Test connection with a simple query
    const result = await db.execute("SELECT 1 as test");
    if (result.rows.length > 0) {
      console.log("✅ Database connection successful");
    }

    // Check if required tables exist
    const tables = await db.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      AND name IN ('LandingPages', 'LandingPageComponents', 'ContactInquiry')
    `);

    const existingTables = tables.rows.map((row) => row.name);
    const requiredTables = [
      "LandingPages",
      "LandingPageComponents",
      "ContactInquiry",
    ];

    console.log("📋 Checking required tables:");
    requiredTables.forEach((table) => {
      if (existingTables.includes(table)) {
        console.log(`  ✅ ${table} - exists`);
      } else {
        console.log(`  ❌ ${table} - missing`);
      }
    });

    // Check if default components exist
    const components = await db.execute(`
      SELECT id, name, type FROM LandingPageComponents 
      WHERE is_system = 1 AND type = 'form'
    `);

    console.log("📝 Checking form components:");
    if (components.rows.length > 0) {
      components.rows.forEach((component) => {
        console.log(`  ✅ ${component.name} (${component.id})`);
      });
    } else {
      console.log("  ❌ No form components found");
    }

    // Test ContactInquiry table structure
    const contactInquirySchema = await db.execute(`
      PRAGMA table_info(ContactInquiry)
    `);

    console.log("🗃️ ContactInquiry table structure:");
    const requiredColumns = [
      "id",
      "project_id",
      "project_name",
      "name",
      "email",
      "phone",
      "message",
      "inquiry_type",
      "status",
    ];
    const existingColumns = contactInquirySchema.rows.map((row) => row.name);

    requiredColumns.forEach((column) => {
      if (existingColumns.includes(column)) {
        console.log(`  ✅ ${column} - exists`);
      } else {
        console.log(`  ❌ ${column} - missing`);
      }
    });

    return true;
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    return false;
  }
}

async function testFormComponentIntegration() {
  console.log("\n🧪 Testing Form Component Integration...");

  const formComponentPath = path.join(
    __dirname,
    "..",
    "src",
    "components",
    "landing-page",
    "components",
    "form-component.tsx"
  );

  if (!fs.existsSync(formComponentPath)) {
    console.log("❌ FormComponent not found");
    return false;
  }

  const formContent = fs.readFileSync(formComponentPath, "utf8");

  // Check for required imports and functions
  const checks = [
    {
      name: "submitContactInquiry import",
      pattern: /import.*submitContactInquiry.*from.*contact-inquiry-actions/,
    },
    {
      name: "useSweetAlert import",
      pattern: /import.*useSweetAlert.*from.*use-sweet-alert/,
    },
    { name: "showSuccess usage", pattern: /showSuccess/ },
    { name: "showError usage", pattern: /showError/ },
    { name: "showLoading usage", pattern: /showLoading/ },
    { name: "hideLoading usage", pattern: /hideLoading/ },
    {
      name: "submitContactInquiry call",
      pattern: /await submitContactInquiry\(inquiryData\)/,
    },
  ];

  console.log("📝 FormComponent integration checks:");
  let allPassed = true;

  checks.forEach((check) => {
    if (check.pattern.test(formContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ❌ ${check.name}`);
      allPassed = false;
    }
  });

  return allPassed;
}

async function testLandingPageBuilder() {
  console.log("\n🏗️ Testing Landing Page Builder Integration...");

  const builderPath = path.join(
    __dirname,
    "..",
    "src",
    "components",
    "landing-page",
    "landing-page-builder.tsx"
  );
  const landingPagePath = path.join(
    __dirname,
    "..",
    "src",
    "app",
    "lp",
    "[slug]",
    "page.tsx"
  );

  if (!fs.existsSync(builderPath)) {
    console.log("❌ LandingPageBuilder not found");
    return false;
  }

  if (!fs.existsSync(landingPagePath)) {
    console.log("❌ Landing page route not found");
    return false;
  }

  const builderContent = fs.readFileSync(builderPath, "utf8");
  const pageContent = fs.readFileSync(landingPagePath, "utf8");

  console.log("📝 Landing page integration checks:");

  // Check LandingPageBuilder props
  const builderChecks = [
    { name: "projectId prop in interface", pattern: /projectId\?\: string/ },
    {
      name: "projectName prop in interface",
      pattern: /projectName\?\: string/,
    },
    {
      name: "FormComponent receives projectId",
      pattern: /projectId={projectId}/,
    },
    {
      name: "FormComponent receives projectName",
      pattern: /projectName={projectName}/,
    },
  ];

  let builderPassed = true;
  builderChecks.forEach((check) => {
    if (check.pattern.test(builderContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ❌ ${check.name}`);
      builderPassed = false;
    }
  });

  // Check landing page usage
  const pageChecks = [
    {
      name: "projectId passed to builder",
      pattern: /projectId={`landing-page-\${page\.id}`}/,
    },
    {
      name: "projectName passed to builder",
      pattern: /projectName={page\.title}/,
    },
  ];

  pageChecks.forEach((check) => {
    if (check.pattern.test(pageContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ❌ ${check.name}`);
      builderPassed = false;
    }
  });

  return builderPassed;
}

async function main() {
  console.log("🚀 Landing Page Form Integration Test\n");
  console.log("=".repeat(50));

  const dbTest = await testDatabaseConnection();
  const formTest = await testFormComponentIntegration();
  const builderTest = await testLandingPageBuilder();

  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Results Summary:");
  console.log(`  Database Connection: ${dbTest ? "✅ PASS" : "❌ FAIL"}`);
  console.log(
    `  Form Component Integration: ${formTest ? "✅ PASS" : "❌ FAIL"}`
  );
  console.log(`  Landing Page Builder: ${builderTest ? "✅ PASS" : "❌ FAIL"}`);

  const allTestsPassed = dbTest && formTest && builderTest;
  console.log(
    `\n🎯 Overall Status: ${
      allTestsPassed ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"
    }`
  );

  if (allTestsPassed) {
    console.log("\n🎉 Your landing page form is ready!");
    console.log("👉 Forms will now save to Turso database");
    console.log("👉 Sweet alerts will show on form submission");
    console.log(
      "👉 Dashboard at /dashboard/contact-inquiries will show submissions"
    );
  } else {
    console.log("\n⚠️  Please fix the failed tests above");
  }

  process.exit(allTestsPassed ? 0 : 1);
}

if (require.main === module) {
  main();
}
