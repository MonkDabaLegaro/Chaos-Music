import { ipcMain, BrowserWindow, IpcMainInvokeEvent } from 'electron';

// Helper function to send to all windows
export function sendToAllWindows(channel: string, data?: unknown) {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(channel, data);
  });
}

// Generic handler registration
export function registerHandler<T = unknown>(
  channel: string,
  handler: (event: IpcMainInvokeEvent, ...args: unknown[]) => Promise<T> | T
) {
  ipcMain.handle(channel, handler);
}

// Generic sender
export function sendToRenderer(window: BrowserWindow | null, channel: string, data?: unknown) {
  window?.webContents.send(channel, data);
}
