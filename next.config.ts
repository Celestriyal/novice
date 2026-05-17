import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  basePath: isProd ? '/novice' : '',
  images: {
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: ['192.168.56.1', 'localhost:3000'],
  },
};

export default nextConfig;
