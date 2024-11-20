import type { Config } from 'jest';
import nextJest from 'next/jest';

import jestBaseConfig from './base';

// For more information about the config options, see:
// https://nextjs.org/docs/app/building-your-application/testing/jest
const createJestConfig = nextJest({
  dir: './',
});

export default createJestConfig(jestBaseConfig) as Config;
