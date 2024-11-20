/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],
  plugins: ['@typescript-eslint/eslint-plugin'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '*.js',
    '*.ts',
    '*.setup.js',
    '*.config.js',
    '.eslintrc.js',
    'node_modules/**',
    'dist/**',
    'build/**',
  ],
};
