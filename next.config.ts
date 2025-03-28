import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Mengizinkan via.placeholder.com
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      // Mengizinkan server lokal Laravel
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
}

export default nextConfig
