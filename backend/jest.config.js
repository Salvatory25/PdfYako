/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  clearMocks: true,
  moduleNameMapper: {
    '^uuid$': '<rootDir>/src/__mocks__/uuid.js',
  },
};
