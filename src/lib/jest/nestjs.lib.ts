import { readFileSync } from 'fs';
import type { Config } from 'jest';

import jestNestjs from './nestjs';

// Reading the SWC compilation config and remove the "exclude"
// for the test files to be compiled by SWC
const { exclude: _, ...swcJestConfig } = JSON.parse(readFileSync(`${__dirname}/.swcrc`, 'utf-8'));

// disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves.
// If we do not disable this, SWC Core will read .swcrc and won't transform our test files due to "exclude"
if (swcJestConfig.swcrc === undefined) {
  swcJestConfig.swcrc = false;
}

const config: Config = {
  ...jestNestjs,
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
};

export default config;