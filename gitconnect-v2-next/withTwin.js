const path = require('path');

const includedDirs = [
  path.resolve(__dirname, './pages'),
  path.resolve(__dirname, './components'),
  path.resolve(__dirname, './app'),
  path.resolve(__dirname, './features'),
];

module.exports = function withTwin(nextConfig) {
  return {
    ...nextConfig,
    webpack(config, options) {
      const { dev, isServer } = options;

      config.module = config.module || {};
      config.module.rules = config.module.rules || [];

      config.module.rules.push({
        test: /\.(tsx|ts)$/,
        include: includedDirs,
        use: [
          options.defaultLoaders.babel,
          {
            loader: 'babel-loader',
            options: {
              sourceMaps: dev,
              // Updated version from https://medium.com/@ianenrico1/set-up-a-next-js-project-with-tailwindcss-and-twin-macro-191ae518dd29
              // Also reflected here: https://www.elvisduru.com/blog/twin-macro-use-tailwind-and-css-in-js-in-a-nextjs-app
              // presets: [
              //   [
              //     'next/babel',
              //     {
              //       'preset-react': {
              //         runtime: 'automatic',
              //         importSource: '@emotion/react',
              //       },
              //     },
              //   ],
              // ],
              // OLD - not causing any issues but not sure if syntax is correct - reverting for now
              presets: [
                [
                  '@babel/preset-react',
                  { runtime: 'automatic', importSource: '@emotion/react' },
                  'next/babel',
                ],
              ],
              plugins: [
                require.resolve('babel-plugin-twin'),
                require.resolve('babel-plugin-macros'),
                require.resolve('@emotion/babel-plugin'),
                [
                  require.resolve('@babel/plugin-syntax-typescript'),
                  { isTSX: true },
                ],
                require.resolve('jotai/babel/plugin-react-refresh'),
              ],
            },
          },
        ],
      });

      if (!isServer) {
        config.resolve.fallback = {
          ...(config.resolve.fallback || {}),
          fs: false,
          module: false,
          path: false,
          os: false,
          crypto: false,
        };
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      } else {
        return config;
      }
    },
  };
};
