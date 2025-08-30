import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Fix for multiple lockfile warning
  outputFileTracingRoot: __dirname,

  // Cache optimization and stability
  experimental: {
    // Improve build cache stability
    webpackBuildWorker: false,
  },

  // Webpack configuration to handle cache issues
  webpack: (config, { dev }) => {
    if (dev) {
      // Clear cache in development mode to prevent stale cache issues
      config.cache = false
    }

    // Optimize build performance and reduce cache conflicts
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
    }

    return config
  },

  // Output configuration for better cache handling
  distDir: '.next',
  cleanDistDir: true,
}

export default nextConfig
