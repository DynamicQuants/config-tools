/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint/eslint-plugin'],
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  ignorePatterns: [
    '*.js',
    '*.setup.js',
    '*.config.js',
    '.eslintrc.js',
    'node_modules/**',
    'dist/**',
    'build/**',
  ],
};
