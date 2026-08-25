import { resolve } from 'node:path';
import { cwd } from 'node:process';

export const workspace = cwd();
export const root = resolve(workspace, '..');
export const src = resolve(workspace, 'src');
export const preload = resolve(src, 'main/preload/index.ts');
export const url = process.env.electron_dist
  ? `http://localhost:5173`
  : `file://${resolve(workspace, 'dist/renderer/index.html')}`;
export const isDev = process.env.NODE_ENV === 'development' || !process.env.electron_dist;
