/**
 * Helper function to get base URL dynamically
 * Returns the appropriate base URL depending on the environment
 */
export function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    // Running on Vercel
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    // Custom environment variable
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Fallback to production domain or localhost for development
  return process.env.NODE_ENV === "production"
    ? "https://www.rizalparamountland.com" // Production fallback
    : "http://localhost:3000"; // Development
}
