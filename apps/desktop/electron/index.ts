import { app, BrowserWindow, shell } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import { registerIPCHandlers } from './handlers';
import { preload, url, workspace } from './utils/path';

const WINDOW_BACKGROUND = '#070B09';
const WINDOW_SYMBOL = '#E5EEE8';

if (release().startsWith('6.1')) app.disableHardwareAcceleration();
if (process.platform === 'win32') app.setAppUserModelId('com.chaosteam.chaosmusic');

if (!process.env.RENDERER_DIST) throw new Error('Missing RENDERER_DIST env');
process.env.electron_dist = app.getAppPath();

class AppBoot {
  window: BrowserWindow | null = null;

  constructor() { void this.init(); }

  async init() {
    registerIPCHandlers();
    this.createWindow();
    this.setupEvents();
  }

  createWindow() {
    this.window = new BrowserWindow({
      title: 'Chaos Music',
      icon: join(workspace, 'resources/icons/icon.png'),
      webPreferences: {
        preload,
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false,
      },
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      frame: false,
      show: false,
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: WINDOW_BACKGROUND,
        symbolColor: WINDOW_SYMBOL,
        height: 40,
      },
      backgroundColor: WINDOW_BACKGROUND,
    });

    void this.window.loadURL(url);
    this.window.on('ready-to-show', () => this.window?.show());
    this.window.webContents.setWindowOpenHandler(({ url: externalUrl }) => {
      void shell.openExternal(externalUrl);
      return { action: 'deny' };
    });

    if (process.env.NODE_ENV === 'development') this.window.webContents.openDevTools();
  }

  setupEvents() {
    this.window?.on('blur', () => this.window?.webContents.send('window:blur'));
    this.window?.on('focus', () => this.window?.webContents.send('window:focus'));
    app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) this.createWindow(); });
    app.on('before-quit', () => this.window?.removeAllListeners('close'));
  }
}

new AppBoot();
