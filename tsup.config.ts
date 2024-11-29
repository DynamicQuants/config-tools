import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.mjs', 'src/postinstall.ts', 'src/lib/prettier.mjs'],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  tsconfig: './tsconfig.json',
  shims: true,
  onSuccess: 'pnpm run copy-files',
  minify: true,
});
