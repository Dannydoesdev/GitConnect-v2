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
