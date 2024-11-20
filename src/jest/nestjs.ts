import type { Config } from 'jest';

import jestBaseConfig from './base';

export default {
  ...jestBaseConfig,
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  rootDir: '.',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
} as Config;
