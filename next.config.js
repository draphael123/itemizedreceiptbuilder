/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_ENABLE_DEV_AUTH: process.env.ENABLE_DEV_AUTH || 'false',
  },
}

module.exports = nextConfig

