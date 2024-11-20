/** @type {import("prettier").Config} */
module.exports = {
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  useTabs: false,

  // Sort imports using trivago/prettier-plugin-sort-imports.
  // Ref: https://github.com/trivago/prettier-plugin-sort-imports
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
