import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageDirectory: 'coverage',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)']
  
};

export default config;
