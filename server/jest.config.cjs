const path = require('path');

// ARES FORGED: Perfect Jest configuration for ESM/TS backend testing
// Destroyed and reforged in the fires of Etna - pure, immutable, divine
module.exports = {
  // Identity
  displayName: 'server',
  testEnvironment: 'node',

  // Transform: Babel-jest with absolute purity
  transform: {
    '^.+\\.(js|mjs|cjs|ts|tsx)$': ['babel-jest', {
      configFile: path.resolve(__dirname, './babel.config.cjs')
    }]
  },

  // Extensions: Complete coverage
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json', 'node'],

  // Aliases: Clean imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Discovery: Comprehensive test finding
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/tests/**/*.[jt]s?(x)'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/backup_for_ARES/'],

  // Setup: Divine initialization
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.backend.js'],

  // Transform Ignore: Modern ESM dependencies
  transformIgnorePatterns: ['/node_modules/(?!(' + [
    'msw',
    '@mswjs',
    'until-async',
    'nanoid',
    'uuid',
    'axios',
    'form-data-encoder',
    'formdata-node',
    '@prisma',
    'prisma'
  ].join('|') + '))'],

  // Module Name Mapper: ESM fixes for simIntegration
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Performance: Optimized for victory
  testTimeout: 30000,
  maxConcurrency: 5,
  maxWorkers: '50%',

  // Coverage: Disabled for speed (enable in CI)
  collectCoverage: false,
  coverageDirectory: '<rootDir>/coverage',

  // Globals: ESM perfection
  globals: {
    __DEV__: true,
    'babel-jest': {
      useESM: true,
      isolatedModules: true
    }
  },

  // Cache: Isolated for purity
  cacheDirectory: path.resolve(__dirname, '.jest-cache'),

  // Quality: Divine standards
  detectOpenHandles: true,
  errorOnDeprecated: true
};
