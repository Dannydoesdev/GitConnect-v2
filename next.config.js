/** @type {import('next').NextConfig} */
const withTwin = require('./withTwin.js')

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
      }
    ],
    domains: ['firebasestorage.googleapis.com'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [200, 400],  // Smaller sizes, as deviceSizes covers the larger ones
    formats: ['image/webp'],
    minimumCacheTTL: 2592000, // 30 days
  },
 // TODO: Resolve large page data bytes in home page - below is the experimental config to ignore build error
  // experimental: {
  //   largePageDataBytes: 150 * 10000,
  // },
})

// Old integration before withTwin.js (for tailwindcss)
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'firebasestorage.googleapis.com',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
// };

// module.exports = nextConfig;
