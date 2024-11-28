import type { Config } from 'jest';
import nextJest from 'next/jest';
import path from 'node:path';

import base from './base';

// For more information about the config options, see:
// https://nextjs.org/docs/app/building-your-application/testing/jest
const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  ...base,
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: ['index.ts', '.*stories.tsx', 'layout.tsx'],
  snapshotResolver: path.resolve(__dirname, './snapshotResolver.js'),
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
};

export default createJestConfig(config) as Config;
