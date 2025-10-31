/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Add domains here if you load remote images
    remotePatterns: [],
    // Optimize images
    formats: ['image/avif', 'image/webp'],
    // Enable unoptimized for static exports if needed
    unoptimized: false,
    // Performance optimizations
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // CSS optimization
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Enable prefetching and CSS optimization
  experimental: {
    optimizePackageImports: ['react-icons'],
    // Note: optimizeCss is not a valid Next.js option, CSS is minified automatically
  },
};

export default nextConfig;


