// jest.config.js
const nextJest = require('next/jest')
const rootPath = global.testFolderRootPath ?? '<rootDir>/../..';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ["/node_modules/(?!(firebase|firebase/app)/)",
  "node_modules/(?!@angular|@firebase|firebase|@ngrx)",
    'node_modules/(?!.*\\.mjs$)',
    `/node_modules/(?!(${esModules}|.*.mjs$))`,
    `/node_modules/(?!${esModules}).+(js|jsx|ts|tsx)$`,],
  resolver: `${rootPath}/jest.resolver.js`,
  // moduleFileExtensions: ['ts', 'html', 'js', 'mjs', 'json'],
  // moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: `${rootPath}/` }), // use to resolve packages in the project
}

// moduleFileExtensions: ['ts', 'html', 'js', 'mjs', 'json'],
// moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: `${rootPath}/` }), // use to resolve packages in the project


// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)