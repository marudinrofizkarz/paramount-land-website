// Konfigurasi Service Worker untuk Next.js PWA
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    // Cache hero slider images with high priority
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*\/hero-sliders\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "hero-slider-images",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days - longer cache for hero images
        },
        cacheKeyWillBeUsed: async ({ request }) => {
          // Add size parameters to cache key for better optimization
          const url = new URL(request.url);
          return `${url.origin}${url.pathname}?${url.searchParams.toString()}`;
        },
      },
    },
    // Cache other Cloudinary images
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "cloudinary-images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Cache external images (primaland.id)
    {
      urlPattern: /^https:\/\/primaland\.id\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "external-images",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    // Cache fonts
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "google-fonts-stylesheets",
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    // Cache Next.js static assets
    {
      urlPattern: /^https?:\/\/.*\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "nextjs-static",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    // Cache API responses with shorter TTL
    {
      urlPattern: /\/api\/.*(?:projects|news|sliders).*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 10 * 60, // 10 minutes for dynamic content
        },
      },
    },
    // Cache other API responses
    {
      urlPattern: /\/api\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache-fallback",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
  ],
});
