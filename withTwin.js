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
              presets: [
                [
                  'next/babel',
                  {
                    'preset-react': {
                      runtime: 'automatic',
                      importSource: '@emotion/react',
                    },
                  },
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
