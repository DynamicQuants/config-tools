import type { Config } from 'jest';

import jestBaseConfig from './base';

export default {
  ...jestBaseConfig,
  testEnvironment: 'node',
  testRegex: ['.*\\.spec\\.ts$'],
  rootDir: '.',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  collectCoverageFrom: ['src/**/*.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],

  // This files commonly have no meaningful coverage.
  coveragePathIgnorePatterns: ['index.ts', 'main.ts', '.*.module.ts'],
} as Config;
