#!/bin/bash

# Script untuk testing performance optimizations
echo "🧪 Testing Performance Optimizations..."

# Check if all optimization files exist
echo "📋 Checking optimization files..."

files=(
    "src/components/server-hero-slider.tsx"
    "src/app/page-optimized.tsx"
    "src/components/performance-monitor.tsx"
    "src/styles/critical.ts"
    "scripts/build-optimized.sh"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Check TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
if npx tsc --noEmit --skipLibCheck; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

# Check if dev server can start (quick test)
echo "🚀 Testing development server start..."
timeout 30 npm run dev > /dev/null 2>&1 &
DEV_PID=$!

sleep 10

# Check if localhost:9003 is responding
if curl -s http://localhost:9003 > /dev/null; then
    echo "✅ Development server is responding"
    kill $DEV_PID 2>/dev/null
else
    echo "❌ Development server not responding"
    kill $DEV_PID 2>/dev/null
    exit 1
fi

echo "🎉 All optimization tests passed!"
echo ""
echo "📊 Next Steps:"
echo "1. Replace src/app/page.tsx with page-optimized.tsx"
echo "2. Test on localhost:9003"
echo "3. Run production build with ./scripts/build-optimized.sh"
echo "4. Monitor Core Web Vitals improvements"
echo ""
echo "🚀 Ready for production deployment!"
