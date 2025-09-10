/**
 * Cache utility functions for landing pages
 * Handles cache invalidation and fresh data fetching
 */

// Cache busting utilities
export class CacheUtils {
  /**
   * Generate cache buster parameter
   */
  static getCacheBuster(): string {
    return Date.now().toString();
  }

  /**
   * Get no-cache headers for fetch requests
   */
  static getNoCacheHeaders(): HeadersInit {
    return {
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    };
  }

  /**
   * Get fetch options with cache disabled
   */
  static getNoCacheFetchOptions(): RequestInit {
    return {
      cache: "no-store",
      headers: this.getNoCacheHeaders(),
    };
  }

  /**
   * Fetch landing page data with cache busting
   */
  static async fetchLandingPageBySlug(slug: string): Promise<any> {
    const cacheBuster = this.getCacheBuster();
    const response = await fetch(
      `/api/landing-pages/slug/${slug}?t=${cacheBuster}`,
      this.getNoCacheFetchOptions()
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch landing page: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch component templates with cache busting
   */
  static async fetchComponentTemplates(): Promise<any> {
    const cacheBuster = this.getCacheBuster();
    const response = await fetch(
      `/api/landing-pages/components?t=${cacheBuster}`,
      this.getNoCacheFetchOptions()
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch component templates: ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Update landing page with cache invalidation headers
   */
  static async updateLandingPage(id: string, data: any): Promise<any> {
    const response = await fetch(`/api/landing-pages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.getNoCacheHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update landing page");
    }

    return response.json();
  }

  /**
   * Clear browser cache for specific URLs (experimental)
   */
  static clearBrowserCache(urls: string[] = []): void {
    // Clear service worker cache if available
    if ("serviceWorker" in navigator && "caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (urls.length === 0) {
            caches.delete(cacheName);
          } else {
            const cache = caches.open(cacheName);
            cache.then((c) => {
              urls.forEach((url) => c.delete(url));
            });
          }
        });
      });
    }

    // Force reload of specific URLs
    urls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = `${url}?t=${this.getCacheBuster()}`;
      document.head.appendChild(link);
      setTimeout(() => document.head.removeChild(link), 1000);
    });
  }

  /**
   * Add response headers to disable caching
   */
  static addNoCacheHeaders(response: Response): Response {
    const headers = this.getNoCacheHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }
}

// Real-time sync utilities
export class RealTimeSync {
  private static intervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Start auto-sync for a landing page
   */
  static startAutoSync(
    slug: string,
    onUpdate: (data: any) => void,
    onError?: (error: Error) => void,
    intervalMs: number = 2000
  ): void {
    // Clear existing interval if any
    this.stopAutoSync(slug);

    let lastUpdated = "";

    const checkForUpdates = async () => {
      try {
        const data = await CacheUtils.fetchLandingPageBySlug(slug);
        const newPage = data.data;

        if (newPage.updated_at !== lastUpdated && lastUpdated !== "") {
          console.log(`🔄 [${slug}] Content updated, triggering callback...`);
          onUpdate(newPage);
        }

        lastUpdated = newPage.updated_at;
      } catch (error) {
        console.warn(`Auto-sync failed for ${slug}:`, error);
        onError?.(error as Error);
      }
    };

    // Start the interval
    const interval = setInterval(checkForUpdates, intervalMs);
    this.intervals.set(slug, interval);

    console.log(`🚀 Auto-sync started for ${slug} (${intervalMs}ms interval)`);
  }

  /**
   * Stop auto-sync for a landing page
   */
  static stopAutoSync(slug: string): void {
    const interval = this.intervals.get(slug);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(slug);
      console.log(`⏹️ Auto-sync stopped for ${slug}`);
    }
  }

  /**
   * Stop all auto-sync processes
   */
  static stopAllAutoSync(): void {
    this.intervals.forEach((interval, slug) => {
      clearInterval(interval);
      console.log(`⏹️ Auto-sync stopped for ${slug}`);
    });
    this.intervals.clear();
  }

  /**
   * Get active auto-sync slugs
   */
  static getActiveSlugs(): string[] {
    return Array.from(this.intervals.keys());
  }
}
