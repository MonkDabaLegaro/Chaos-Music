import { BrowserWindow, ipcMain } from 'electron';

import './library.handler';
import './player.handler';
import './youtube.handler';

ipcMain.on('window:minimize', () => {
  BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on('window:maximize', () => {
  const window = BrowserWindow.getFocusedWindow();
  if (!window) return;
  window.isMaximized() ? window.unmaximize() : window.maximize();
});

ipcMain.on('window:close', () => {
  BrowserWindow.getFocusedWindow()?.close();
});

ipcMain.on('window:isMaximized', (event) => {
  event.returnValue = BrowserWindow.getFocusedWindow()?.isMaximized() ?? false;
});

export function registerIPCHandlers() {
  console.log('IPC handlers registered');
}
