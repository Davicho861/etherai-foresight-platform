const path = require('path');

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.m?js$': ['babel-jest', { configFile: path.resolve(__dirname, '..', 'babel.config.cjs') }],
  },
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '<rootDir>/__tests__/mocks/', '<rootDir>/__tests__/mocks'],
  // Ensure setup file runs before modules are imported so we can provide
  // a global fetch mock that shields all network calls during tests.
  setupFiles: ['./jest.setup.js'],
  // Per-test lifecycle hooks and additional backend setup
  setupFilesAfterEnv: ['./jest.setup.backend.js'],
  transformIgnorePatterns: [
    // Allow transpiling a few ESM packages (nanoid, msw, @mswjs) so Jest/Babel can handle them.
    '/node_modules/(?!(nanoid|some-esm-dep|another-esm-dep|msw|@mswjs|until-async)/)'
  ],
};


