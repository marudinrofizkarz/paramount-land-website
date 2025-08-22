#!/bin/bash
# This script optimizes your Next.js development environment

echo "🧹 Cleaning development cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "📊 Pruning unused dependencies..."
npm prune

echo "🔄 Updating packages with potential performance issues..."
npm update

echo "✅ Setup complete! Now run: npm run dev"
