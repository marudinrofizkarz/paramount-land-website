import { createClient } from "@libsql/client";
import { DATABASE_CONFIG } from "./env-config";

const db = createClient({
  url: DATABASE_CONFIG.url,
  authToken: DATABASE_CONFIG.authToken,
});

// Cache for landing page data (simple in-memory cache)
const landingPageCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheItem {
  data: any;
  timestamp: number;
}

// Optimized landing page actions with caching and better error handling
export class OptimizedLandingPageActions {
  // Get landing page by slug with aggressive caching
  static async getBySlugCached(slug: string) {
    try {
      // Check cache first
      const cacheKey = `slug:${slug}`;
      const cached = landingPageCache.get(cacheKey) as CacheItem;

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`Cache hit for slug: ${slug}`);
        return { success: true, data: cached.data };
      }

      console.log(`Cache miss for slug: ${slug}, fetching from database`);

      // Optimized query - select only necessary fields
      const result = await db.execute(
        `SELECT id, title, slug, description, content, meta_title, meta_description, 
         og_image, status, template_type, campaign_source, target_audience, 
         tracking_code, published_at, created_at, updated_at 
         FROM LandingPages WHERE slug = ? AND status = 'published' LIMIT 1`,
        [slug]
      );

      if (result.rows.length === 0) {
        return { success: false, error: "Landing page not found" };
      }

      const row = result.rows[0];

      // Parse JSON content with error handling
      let content = [];
      let settings = {};

      try {
        content = JSON.parse((row.content as string) || "[]");
      } catch (error) {
        console.error("Error parsing content JSON:", error);
        content = [];
      }

      const landingPage = {
        ...row,
        content,
        settings,
      };

      // Cache the result
      landingPageCache.set(cacheKey, {
        data: landingPage,
        timestamp: Date.now(),
      });

      return { success: true, data: landingPage };
    } catch (error) {
      console.error("Error fetching landing page:", error);
      return { success: false, error: "Failed to fetch landing page" };
    }
  }

  // Preload critical landing pages into cache
  static async preloadCriticalPages() {
    const criticalSlugs = [
      "altadena-residence",
      "paramount-garden",
      "senayan-residence",
      // Add other important landing page slugs here
    ];

    try {
      console.log("Preloading critical landing pages...");

      // Use Promise.allSettled to avoid failing if one page fails
      const results = await Promise.allSettled(
        criticalSlugs.map((slug) => this.getBySlugCached(slug))
      );

      const successful = results.filter((r) => r.status === "fulfilled").length;
      console.log(
        `Preloaded ${successful}/${criticalSlugs.length} critical pages`
      );
    } catch (error) {
      console.error("Error preloading critical pages:", error);
    }
  }

  // Clear cache for a specific slug (useful for updates)
  static clearCache(slug?: string) {
    if (slug) {
      landingPageCache.delete(`slug:${slug}`);
    } else {
      landingPageCache.clear();
    }
  }

  // Get cache statistics
  static getCacheStats() {
    return {
      size: landingPageCache.size,
      keys: Array.from(landingPageCache.keys()),
    };
  }
}

// Initialize cache with critical pages on module load
OptimizedLandingPageActions.preloadCriticalPages().catch(console.error);
