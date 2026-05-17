import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

// @ts-ignore - allowedDevOrigins might not be in the types yet
const nextConfig: NextConfig & { allowedDevOrigins?: string[] } = {
  reactCompiler: true,
  output: 'export',
  // Only prefix with /novice if we are actually building for production
  basePath: isProd ? '/novice' : '',
  assetPrefix: isProd ? '/novice/' : '',
  images: {
    unoptimized: true,
  },
  // Allow the local IP and common dev hosts
  allowedDevOrigins: ['localhost:3000', '192.168.56.1', '127.0.0.1:3000', '0.0.0.0:3000'],
};

export default nextConfig;
