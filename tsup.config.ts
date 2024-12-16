import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/lib/eslint.ts',
    'src/lib/jest.ts',
    'src/lib/playwright.ts',
    'src/lib/prettier.mjs',
    'src/lib/tailwind.ts',
    'src/lib/vite.ts',
    'src/bin/main.ts',
  ],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  tsconfig: './tsconfig.json',
  shims: true,
  onSuccess: 'pnpm run cp',
  treeshake: true,
});
