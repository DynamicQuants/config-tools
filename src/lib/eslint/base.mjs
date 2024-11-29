import nx from '@nx/eslint-plugin';

/**
 * @type {import('@eslint/eslintrc').Config[]}
 */
export default [
  // Ref: https://github.com/nrwl/nx/blob/master/packages/eslint-plugin/src/flat-configs/base.ts
  ...nx.configs['flat/base'],

  // Ref: https://github.com/nrwl/nx/blob/master/packages/eslint-plugin/src/flat-configs/typescript.ts
  ...nx.configs['flat/typescript'],

  // Ref: https://github.com/nrwl/nx/blob/master/packages/eslint-plugin/src/flat-configs/javascript.ts
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
  },
];
