module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
    '^.+\\.(png|jpg|jpeg|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/playwright/'],
   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
