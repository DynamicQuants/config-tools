import type { Config } from 'jest';

/**
 * This is the base config for all jest tests.
 * It is used to configure the jest environment and the coverage report.
 */
export default {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts', 'json', 'jsx', 'tsx'],
} as const satisfies Config;
