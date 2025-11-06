const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  // Add this for better Vercel optimization:
  output: 'standalone', // Creates optimized standalone build
  experimental: {
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 1,
    optimizePackageImports: ['framer-motion', '@medusajs/icons', 'lodash'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "static.zuhoorlifestyle.store",
      },
      {
        protocol: "https",
        hostname: "static.zuhoorlifestyle.store",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
}

module.exports = nextConfig
