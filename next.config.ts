import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    const target = process.env.API_PROXY_TARGET
    if (!target) return []
    return [
      {
        source: '/api/:path*',
        destination: `${target}/:path*`,
      },
    ]
  },
}

export default nextConfig
