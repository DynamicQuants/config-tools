import type { Config } from 'jest';
import nextJest from 'next/jest';
import path from 'path';

import jestBaseConfig from './base';

// For more information about the config options, see:
// https://nextjs.org/docs/app/building-your-application/testing/jest
const createJestConfig = nextJest({
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  ...jestBaseConfig,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: ['index.ts', '.*stories.tsx'],
  snapshotResolver: path.resolve(__dirname, './snapshotResolver.js'),
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
};

export default createJestConfig(customJestConfig) as Config;
