import { contextBridge, ipcRenderer } from 'electron';

// Custom types for exposed API
interface ElectronAPI {
  // Window controls
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    isMaximized: () => boolean;
    on: (event: string, callback: () => void) => void;
  };
  // IPC invoke wrapper
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
  // IPC on wrapper
  on: (channel: string, callback: (...args: unknown[]) => void) => void;
  // IPC off wrapper
  off: (channel: string, callback: (...args: unknown[]) => void) => void;
}

// Exposed API to renderer process
const api: ElectronAPI = {
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    isMaximized: () => ipcRenderer.sendSync('window:isMaximized'),
    on: (event, callback) => ipcRenderer.on(`window:${event}`, callback),
  },
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  off: (channel, callback) => ipcRenderer.off(channel, callback),
};

contextBridge.exposeInMainWorld('electron', api);

// Type declarations for renderer
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
