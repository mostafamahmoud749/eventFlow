import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep a running dev preview separate from the production build output.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
