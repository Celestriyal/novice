import type { NextConfig } from "next";

// Only use the sub-path prefix when building on GitHub Actions for Pages
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  basePath: isGitHubPages ? '/novice' : '',
  images: {
    unoptimized: true,
  },
  experimental: {
    // Allow any local network IP to access dev resources
    allowedDevOrigins: ['localhost:3000', '192.168.56.1', '0.0.0.0:3000'],
  },
};

export default nextConfig;
