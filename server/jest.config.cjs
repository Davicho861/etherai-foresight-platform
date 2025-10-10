module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { configFile: '../../babel.config.cjs' }]
  },
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};


