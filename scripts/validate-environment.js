#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 *
 * This script validates that all required environment variables are properly set
 * for both development and production environments.
 */

const requiredEnvVars = {
  database: {
    TURSO_DATABASE_URL: "Database URL for Turso/LibSQL connection",
    TURSO_AUTH_TOKEN: "Authentication token for Turso database",
  },
  auth: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      "Clerk publishable key for authentication",
    CLERK_SECRET_KEY: "Clerk secret key for server-side authentication",
  },
  cloudinary: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      "Cloudinary cloud name for image uploads",
    CLOUDINARY_API_KEY: "Cloudinary API key for server-side operations",
    CLOUDINARY_API_SECRET: "Cloudinary API secret for server-side operations",
  },
  app: {
    NEXT_PUBLIC_APP_URL:
      "Application URL (defaults to localhost for development)",
  },
};

const optionalEnvVars = {
  legacy: {
    DATABASE_URL: "Legacy database URL (fallback for TURSO_DATABASE_URL)",
    DATABASE_AUTH_TOKEN: "Legacy auth token (fallback for TURSO_AUTH_TOKEN)",
    CLOUDINARY_CLOUD_NAME:
      "Legacy Cloudinary cloud name (use NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME instead)",
  },
};

function validateEnvironment() {
  console.log("🔍 Validating environment variables...\n");

  let hasErrors = false;
  let hasWarnings = false;

  // Check required variables
  Object.entries(requiredEnvVars).forEach(([category, vars]) => {
    console.log(`📋 ${category.toUpperCase()} Configuration:`);

    Object.entries(vars).forEach(([varName, description]) => {
      const value = process.env[varName];

      if (!value) {
        console.log(`  ❌ ${varName}: Missing`);
        console.log(`     Description: ${description}`);
        hasErrors = true;
      } else {
        // Mask sensitive values
        const maskedValue =
          varName.includes("SECRET") ||
          varName.includes("TOKEN") ||
          varName.includes("KEY")
            ? "*".repeat(Math.min(value.length, 20))
            : value.length > 50
            ? value.substring(0, 50) + "..."
            : value;
        console.log(`  ✅ ${varName}: ${maskedValue}`);
      }
    });
    console.log("");
  });

  // Check optional/legacy variables
  console.log("🔧 Optional/Legacy Configuration:");
  Object.entries(optionalEnvVars).forEach(([category, vars]) => {
    Object.entries(vars).forEach(([varName, description]) => {
      const value = process.env[varName];

      if (value) {
        const maskedValue =
          varName.includes("SECRET") ||
          varName.includes("TOKEN") ||
          varName.includes("KEY")
            ? "*".repeat(Math.min(value.length, 20))
            : value.length > 50
            ? value.substring(0, 50) + "..."
            : value;
        console.log(`  ℹ️  ${varName}: ${maskedValue}`);
        console.log(`     Note: ${description}`);
      }
    });
  });
  console.log("");

  // Environment-specific checks
  const nodeEnv = process.env.NODE_ENV || "development";
  console.log(`🌍 Environment: ${nodeEnv}`);

  if (nodeEnv === "production") {
    console.log(
      "🚀 Production environment detected - all variables are required"
    );

    // Check for common production issues
    if (process.env.NEXT_PUBLIC_APP_URL === "http://localhost:9003") {
      console.log(
        "  ⚠️  NEXT_PUBLIC_APP_URL is set to localhost in production"
      );
      hasWarnings = true;
    }

    if (
      process.env.TURSO_DATABASE_URL &&
      process.env.TURSO_DATABASE_URL.includes("localhost")
    ) {
      console.log("  ⚠️  Database URL appears to be localhost in production");
      hasWarnings = true;
    }
  } else {
    console.log(
      "🛠️  Development environment - some variables may have defaults"
    );
  }

  console.log("");

  // Summary
  if (hasErrors) {
    console.log("❌ Environment validation failed!");
    console.log(
      "Please set the missing environment variables before deploying."
    );
    console.log("See DEPLOYMENT.md for detailed instructions.");
    process.exit(1);
  } else if (hasWarnings) {
    console.log("⚠️  Environment validation passed with warnings");
    console.log("Please review the warnings above for production deployment.");
  } else {
    console.log("✅ Environment validation passed!");
    console.log("All required environment variables are properly configured.");
  }

  console.log("\n📚 For more information:");
  console.log("  - See DEPLOYMENT.md for deployment instructions");
  console.log("  - See README.md for development setup");
  console.log("  - Check .env.example for variable format examples");
}

// Run validation
validateEnvironment();
