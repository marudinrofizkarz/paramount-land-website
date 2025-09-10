#!/bin/bash

# Script untuk build production dengan optimasi maksimal
echo "🚀 Starting optimized production build..."

# Set environment variables for maximum optimization
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export CI=true

# Clear previous builds and caches
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf public/sw.js
rm -rf public/workbox-*.js

# Install dependencies with exact versions for consistency
echo "📦 Installing dependencies..."
npm ci --production=false

# Build with maximum optimization
echo "🔨 Building with optimizations..."
npm run build

# Analyze bundle if needed
if [ "$ANALYZE" = "true" ]; then
  echo "📊 Analyzing bundle..."
  ANALYZE=true npm run build
fi

# Verify critical files exist
echo "✅ Verifying build artifacts..."
if [ ! -f ".next/static/chunks/pages/index-*.js" ]; then
  echo "❌ Home page chunk not found!"
  exit 1
fi

if [ ! -f "public/sw.js" ]; then
  echo "❌ Service worker not generated!"
  exit 1
fi

echo "✨ Production build completed successfully!"
echo "📈 Performance optimizations applied:"
echo "   - Server-side rendering for hero slider"
echo "   - Image optimization with WebP/AVIF"
echo "   - Service worker caching"
echo "   - Critical CSS inlining"
echo "   - Bundle splitting"
echo "   - ISR with 10-minute revalidation"

# Optional: Run performance tests
if [ "$RUN_PERF_TESTS" = "true" ]; then
  echo "🔍 Running performance tests..."
  npm run test:perf
fi
