import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Improve development performance
  reactStrictMode: false, // Set to true only for final testing
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  optimizeFonts: true,
  // Experimental optimizations (comment out if you encounter issues)
  experimental: {
    // optimizeCss: true,
    scrollRestoration: true,
    serverActions: {
      bodySizeLimit: "10mb", // Increase body size limit to 10MB
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.paramount-land.com",
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
    ],
  },
};

export default nextConfig;
