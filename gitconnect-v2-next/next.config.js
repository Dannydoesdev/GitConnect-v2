/** @type {import('next').NextConfig} */
const withTwin = require('./withTwin.js');

module.exports = withTwin({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [200, 400],
    formats: ['image/webp'],
    minimumCacheTTL: 2592000, // 30 days
  },
});
