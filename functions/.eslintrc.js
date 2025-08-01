module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['functions/tsconfig.json', 'functions/tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: ['/lib/**/*'],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // TODO: cleanup eslint rules - in place for emulators only
    quotes: 'off',
    'import/no-unresolved': 'off',
    indent: 'off',
    'max-len': 'off',
    camelcase: 'off',
    'object-curly-spacing': 'off',
  },
};
