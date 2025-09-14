import { createClient } from "@libsql/client";
import { DATABASE_CONFIG } from "./env-config";

const db = createClient({
  url: DATABASE_CONFIG.url,
  authToken: DATABASE_CONFIG.authToken,
});

// Ultra-fast in-memory cache
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minute cache

interface CacheEntry {
  data: any;
  timestamp: number;
}

export class UltraFastLandingPageActions {
  // Ultra-fast cached getBySlug
  static async getBySlug(slug: string) {
    try {
      // Check cache first
      const cacheKey = `landing_page_${slug}`;
      const cached = cache.get(cacheKey) as CacheEntry;

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return { success: true, data: cached.data };
      }

      // Fetch from database with optimized query
      const result = await db.execute(
        "SELECT id, title, slug, description, content, status, meta_title, meta_description, og_image FROM LandingPages WHERE slug = ? AND status = 'published' LIMIT 1",
        [slug]
      );

      if (result.rows.length === 0) {
        return { success: false, error: "Landing page not found" };
      }

      const row = result.rows[0];

      // Fast JSON parsing
      let content = [];
      try {
        content = JSON.parse((row.content as string) || "[]");
      } catch {
        content = [];
      }

      const landingPage = {
        ...row,
        content,
      };

      // Cache the result
      cache.set(cacheKey, {
        data: landingPage,
        timestamp: Date.now(),
      });

      return { success: true, data: landingPage };
    } catch (error) {
      console.error("Error fetching landing page:", error);
      return { success: false, error: "Failed to fetch landing page" };
    }
  }

  // Clear cache for specific slug
  static clearCache(slug?: string) {
    if (slug) {
      cache.delete(`landing_page_${slug}`);
    } else {
      cache.clear();
    }
  }

  // Preload critical pages
  static async preloadCriticalPages() {
    const criticalSlugs = [
      "altadena-residence",
      "paramount-garden",
      "senayan-residence",
    ];

    await Promise.allSettled(criticalSlugs.map((slug) => this.getBySlug(slug)));
  }
}

// Auto-preload on module initialization
UltraFastLandingPageActions.preloadCriticalPages().catch(console.error);
