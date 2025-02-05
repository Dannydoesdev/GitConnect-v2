// const UnoCSS = require('@unocss/webpack').default;

// The folders containing files importing twin.macro
// const includedDirs = [path.resolve(__dirname, './')]
const path = require('path');

const includedDirs = [
  path.resolve(__dirname, './pages'),
  path.resolve(__dirname, './components'),
  path.resolve(__dirname, './app'),
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
                [require.resolve('@babel/plugin-syntax-typescript'), { isTSX: true }],
                require.resolve('jotai/babel/plugin-react-refresh'),
                // require.resolve('@unocss/webpack'),
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
