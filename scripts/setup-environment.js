#!/usr/bin/env node

/**
 * Environment Setup Script
 *
 * This script helps create a .env file from .env.example with guided prompts.
 * It ensures all required environment variables are properly configured.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const envPath = ".env";
const envExamplePath = ".env.example";

function question(text) {
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
}

async function createEnvFile() {
  console.log("🚀 Environment Setup for Paramount Land Website\n");

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question(
      "⚠️  .env file already exists. Overwrite? (y/N): "
    );
    if (overwrite.toLowerCase() !== "y" && overwrite.toLowerCase() !== "yes") {
      console.log("Environment setup cancelled.");
      rl.close();
      return;
    }
  }

  // Check if .env.example exists
  if (!fs.existsSync(envExamplePath)) {
    console.log(`❌ ${envExamplePath} not found. Creating basic template...`);

    const basicTemplate = `# Database Configuration (Turso/LibSQL)
TURSO_DATABASE_URL=libsql://your-database-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your-publishable-key
CLERK_SECRET_KEY=sk_live_your-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up

# Image Storage (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:9003`;

    fs.writeFileSync(envExamplePath, basicTemplate);
    console.log(`✅ Created ${envExamplePath}`);
  }

  const envExample = fs.readFileSync(envExamplePath, "utf8");
  const envLines = envExample.split("\n");

  console.log(
    "📝 Please provide values for the following environment variables:\n"
  );

  const envValues = {};
  let currentSection = "";

  for (const line of envLines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) {
      if (trimmed.startsWith("#")) {
        currentSection = trimmed;
        console.log(`\n${currentSection}`);
      }
      continue;
    }

    // Parse variable
    const [key, defaultValue] = trimmed.split("=");

    if (key && key.trim()) {
      const varName = key.trim();
      const placeholder = defaultValue || "";

      // Provide context for each variable
      let description = "";
      switch (varName) {
        case "TURSO_DATABASE_URL":
          description = "(Format: libsql://database-name-org.turso.io)";
          break;
        case "TURSO_AUTH_TOKEN":
          description = "(Get from Turso dashboard)";
          break;
        case "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY":
          description = "(Starts with pk_live_ or pk_test_)";
          break;
        case "CLERK_SECRET_KEY":
          description = "(Starts with sk_live_ or sk_test_)";
          break;
        case "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME":
          description = "(Your Cloudinary cloud name)";
          break;
        case "CLOUDINARY_API_KEY":
          description = "(Cloudinary API key)";
          break;
        case "CLOUDINARY_API_SECRET":
          description = "(Cloudinary API secret)";
          break;
        case "NEXT_PUBLIC_APP_URL":
          description =
            "(Production URL or http://localhost:9003 for development)";
          break;
      }

      const prompt = `${varName} ${description}: `;
      const value = await question(prompt);

      // Use provided value or keep placeholder for development
      if (value.trim()) {
        envValues[varName] = value.trim();
      } else if (varName === "NEXT_PUBLIC_APP_URL" && !value.trim()) {
        envValues[varName] = "http://localhost:9003";
      } else {
        envValues[varName] = placeholder;
      }
    }
  }

  // Generate .env content
  let envContent = "";
  let inSection = false;

  for (const line of envLines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("#") || !trimmed) {
      envContent += line + "\n";
    } else {
      const [key] = trimmed.split("=");
      if (key && envValues[key.trim()]) {
        envContent += `${key.trim()}=${envValues[key.trim()]}\n`;
      } else {
        envContent += line + "\n";
      }
    }
  }

  // Write .env file
  fs.writeFileSync(envPath, envContent);
  console.log(`\n✅ Environment file created successfully at ${envPath}`);

  // Validate the created environment
  console.log("\n🔍 Validating environment configuration...");

  // Run validation
  const { spawn } = require("child_process");
  const validation = spawn("node", ["scripts/validate-environment.js"], {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "development" },
  });

  validation.on("close", (code) => {
    console.log("\n📚 Next Steps:");
    console.log(
      "1. Review the created .env file and update any placeholder values"
    );
    console.log("2. For production deployment, see DEPLOYMENT.md");
    console.log('3. Run "npm run dev" to start the development server');
    console.log('4. Test your configuration with "npm run validate:env"');
    rl.close();
  });
}

// Handle Ctrl+C
process.on("SIGINT", () => {
  console.log("\n\n🛑 Environment setup cancelled.");
  rl.close();
  process.exit(0);
});

// Run setup
createEnvFile().catch((error) => {
  console.error("❌ Error during environment setup:", error);
  rl.close();
  process.exit(1);
});
