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
