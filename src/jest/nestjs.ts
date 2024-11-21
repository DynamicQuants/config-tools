import type { Config } from 'jest';

import jestBaseConfig from './base';

export default {
  ...jestBaseConfig,
  testEnvironment: 'node',
  testRegex: ['.spec.ts$', '.spec.tsx$'],
  rootDir: '.',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts'],
} as Config;
