/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    typedRoutes: true
  },
  env: {
    PORT: process.env.PORT || '4002'
  }
};

module.exports = nextConfig;