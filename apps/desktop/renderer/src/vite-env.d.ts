/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ElectronAPI {
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    isMaximized: () => boolean;
    on: (event: string, callback: () => void) => void;
  };
  invoke: <T>(channel: string, ...args: unknown[]) => Promise<T>;
  on: (channel: string, callback: (...args: unknown[]) => void) => void;
  off: (channel: string, callback?: (...args: unknown[]) => void) => void;
  send: (channel: string, ...args: unknown[]) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    electron: ElectronAPI;
  }
}

export {};
