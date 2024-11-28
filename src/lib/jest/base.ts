import nxPreset from '@nx/jest/preset';
import type { Config } from 'jest';

export default {
  ...nxPreset,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts', 'json', 'jsx', 'tsx'],
  coverageReporters: ['text', 'html'],
} as Config;
