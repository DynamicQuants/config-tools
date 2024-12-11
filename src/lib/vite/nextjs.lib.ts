import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

function viteNextjsLib(name: string) {
  return defineConfig({
    root: process.cwd(),
    cacheDir: './vite',
    plugins: [
      react(),
      nxViteTsPaths(),
      nxCopyAssetsPlugin(['*.md']),
      dts({
        entryRoot: './src',
        tsconfigPath: path.resolve(process.cwd(), 'tsconfig.build.json'),
      }),
    ],
    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      lib: {
        // Could also be a dictionary or array of multiple entry points.
        entry: './src/index.ts',
        name,
        fileName: 'index',
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        // External packages that should not be bundled into your library.
        external: ['react', 'react-dom', 'react/jsx-runtime'],
      },
    },
  });
}

export default viteNextjsLib;
