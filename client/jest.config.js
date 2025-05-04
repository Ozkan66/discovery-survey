export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  verbose: true,
};
