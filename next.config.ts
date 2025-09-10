import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
// Import next-pwa directly with the correct syntax
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

// Configuration for analyzing bundle size
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Base Next.js configuration
const baseConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer, dev }) => {
    // Ignore the OpenTelemetry instrumentation critical dependency warnings
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    // Optimize bundle size in production
    if (!dev && !isServer) {
      // Use Terser for better minification
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };

      // Exclude large dependencies from the main bundle
      config.externals = [...(config.externals || []), "canvas", "jsdom"];
    }

    return config;
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    serverActions: {
      bodySizeLimit: "10mb", // Increase body size limit to 10MB
    },
    // Modern bundle optimizations
    optimizePackageImports: [
      "react-dom",
      "lucide-react",
      "@radix-ui/react-icons",
    ],
  },
  // Optimize image delivery
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days for hero images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Cloudinary optimization
    loader: "default",
    // Enable placeholder blur for better UX
    disableStaticImages: false,
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.rizalparamountland.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rizalparamountland.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "primaland.id",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Add performance headers
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/:path*.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.css",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

// Compose the config with optimizations
const nextConfig = withAnalyzer(withPWA(baseConfig));

export default nextConfig;
