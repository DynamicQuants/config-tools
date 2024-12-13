import type { Config } from 'jest';
import path from 'node:path';

import base from './base';

const config: Config = {
  ...base,
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  snapshotResolver: path.resolve(__dirname, './snapshotResolver.js'),
  coveragePathIgnorePatterns: ['index.ts', 'server.ts', '.*stories.tsx', 'layout.tsx'],
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
};

export default config;
