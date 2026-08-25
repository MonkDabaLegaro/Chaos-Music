import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import path from 'node:path';

const root = __dirname;
const aliases = {
  '@desktop': root,
  '@electron': path.resolve(root, 'electron'),
  '@renderer': path.resolve(root, 'renderer/src'),
  '@shared': path.resolve(root, 'shared'),
};

export default defineConfig({
  main: {
    root: path.resolve(root, 'electron'),
    resolve: { alias: aliases },
    build: {
      outDir: path.resolve(root, 'dist/main'),
      rollupOptions: {
        input: {
          index: path.resolve(root, 'electron/index.ts'),
        },
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    root: path.resolve(root, 'electron/preload'),
    resolve: { alias: aliases },
    build: {
      outDir: path.resolve(root, 'dist/preload'),
      rollupOptions: {
        input: {
          index: path.resolve(root, 'electron/preload/index.ts'),
        },
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    root: path.resolve(root, 'renderer'),
    resolve: { alias: aliases },
    build: {
      outDir: path.resolve(root, 'dist/renderer'),
      rollupOptions: {
        input: {
          index: path.resolve(root, 'renderer/index.html'),
        },
      },
    },
    plugins: [],
  },
});
