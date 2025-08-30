#!/bin/bash

# Clear Next.js Cache Script
# This script helps resolve common Next.js cache issues

echo "🧹 Clearing Next.js cache..."

# Remove Next.js build directory
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ Removed .next directory"
fi

# Remove Node modules cache
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✅ Removed node_modules/.cache"
fi

# Remove TypeScript incremental build info
if [ -f "tsconfig.tsbuildinfo" ]; then
    rm tsconfig.tsbuildinfo
    echo "✅ Removed TypeScript build info"
fi

echo "🎉 Cache cleared successfully!"
echo ""
echo "You can now run:"
echo "  npm run dev    - Start development server"
echo "  npm run build  - Build for production"