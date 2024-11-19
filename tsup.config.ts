import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.{ts,js}'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['jest', 'prettier', 'next', 'playwright'],
  format: ['esm', 'cjs'],
  dts: true,
});
