/**
 * Environment Variables Configuration
 * This file centralizes all environment variable handling and validation
 */

// Database Configuration
export const DATABASE_CONFIG = {
  url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "",
  authToken:
    process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN || "",
};

// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  apiKey: process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "",
};

// Google AI Configuration
export const AI_CONFIG = {
  googleApiKey: process.env.GOOGLE_GENAI_API_KEY || "",
};

// App Configuration
export const APP_CONFIG = {
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9003",
  nextAuthSecret: process.env.NEXTAUTH_SECRET || "dev-secret-key",
};

// Validation function
export function validateEnvironmentVariables() {
  const errors: string[] = [];

  // Critical environment variables
  if (!DATABASE_CONFIG.url) {
    errors.push("TURSO_DATABASE_URL is missing");
  }

  if (!DATABASE_CONFIG.authToken) {
    errors.push("TURSO_AUTH_TOKEN is missing");
  }

  if (!CLOUDINARY_CONFIG.cloudName) {
    errors.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is missing");
  }

  // Log errors in production
  if (errors.length > 0 && process.env.NODE_ENV === "production") {
    console.error("❌ Critical environment variables are missing:");
    errors.forEach((error) => console.error(`  - ${error}`));
    console.error(
      "\nPlease set these variables in your deployment platform (Vercel, etc.)"
    );
    console.error("See DEPLOYMENT.md for detailed instructions");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Auto-validate on import (only in production)
if (process.env.NODE_ENV === "production") {
  validateEnvironmentVariables();
}
