import { ipcMain, BrowserWindow } from 'electron';

// Import handlers
import './library.handler';
import './player.handler';
import './youtube.handler';
import './playlist.handler';

// Window controls handlers
ipcMain.on('window:minimize', () => {
  BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on('window:maximize', () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
});

ipcMain.on('window:close', () => {
  BrowserWindow.getFocusedWindow()?.close();
});

ipcMain.on('window:isMaximized', () => {
  return BrowserWindow.getFocusedWindow()?.isMaximized();
});

export function registerIPCHandlers() {
  // All handlers are imported and registered in their respective files
  console.log('IPC Handlers registered');
}
