import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    isMaximized: () => boolean;
    on: (event: string, callback: () => void) => void;
  };
  invoke: <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>;
  on: (channel: string, callback: (...args: unknown[]) => void) => void;
  off: (channel: string, callback?: (...args: unknown[]) => void) => void;
  send: (channel: string, ...args: unknown[]) => void;
}

const api: ElectronAPI = {
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    isMaximized: () => ipcRenderer.sendSync('window:isMaximized') as boolean,
    on: (event, callback) => { ipcRenderer.on(`window:${event}`, callback); },
  },
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, callback) => { ipcRenderer.on(channel, (_event, ...args) => callback(...args)); },
  off: (channel) => { ipcRenderer.removeAllListeners(channel); },
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
};

// `electronAPI` is the canonical renderer bridge. `electron` remains as a
// compatibility alias for components written against the first prototype.
contextBridge.exposeInMainWorld('electronAPI', api);
contextBridge.exposeInMainWorld('electron', api);
