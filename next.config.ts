import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/f/**',
      },
    ],
  },
  experimental: {
    // Enable turbopack in dev if you like
    // turbo: { rules: {} }
  }
};

export default nextConfig;