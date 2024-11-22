import { resolve } from 'node:path';
import process from 'node:process';

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'prettier',
    ...[
      '@vercel/style-guide/eslint/node',
      '@vercel/style-guide/eslint/typescript',
      '@vercel/style-guide/eslint/browser',
      '@vercel/style-guide/eslint/react',
      '@vercel/style-guide/eslint/next',
    ].map((path) => require.resolve(path)),
  ],
  plugins: ['only-warn'],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: [
    '*.ts',
    '*.setup.js',
    '*.config.js',
    '.eslintrc.js',
    'node_modules/**',
    'dist/**',
    'build/**',
    'coverage/**/*',
    'playwright/**/*',
    '.next/**/*',
    '.swc/**/*',
  ],
  overrides: [{ files: ['src/**/*.ts?(x)'] }],
  rules: {
    'import/no-default-export': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/function-component-definition': 'off',
    'import/order': [
      1,
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
      },
    ],
  },
};
