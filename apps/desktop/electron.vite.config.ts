import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import path from 'node:path';

const root = __dirname;

export default defineConfig({
  main: {
    root: path.resolve(root, 'electron'),
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
