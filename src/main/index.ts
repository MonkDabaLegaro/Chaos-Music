import { app, BrowserWindow, shell } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import { registerIPCHandlers } from './handlers';
import { preload, url, workspace } from './utils/path';

// Disable GPU acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 11
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!process.env.RENDERER_DIST) {
  throw new Error('Missing RENDERER_DIST env');
}

process.env.electron_dist = app.getAppPath();

// The built directory structure
//
// ├─┬ dist
// │  ├── main
// │  └── preload
// ├─┬ out
// │  └── main
// │  └── preload
// ├── package.json
// └── src

class AppBoot {
  window: BrowserWindow | null = null;

  constructor() {
    this.init();
  }

  async init() {
    // Register IPC handlers
    registerIPCHandlers();

    // Create window
    this.createWindow();

    // Setup app events
    this.setupEvents();
  }

  createWindow() {
    this.window = new BrowserWindow({
      title: 'MusicPlayer',
      icon: join(workspace, 'resources/icons/icon.png'),
      webPreferences: {
        preload,
        sandbox: false,
      },
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      frame: false,
      show: false,
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#1a1a1a',
        symbolColor: '#ffffff',
        height: 40,
      },
      backgroundColor: '#1a1a1a',
    });

    // Load the app URL
    this.window.loadURL(url);

    // Show window when ready
    this.window.on('ready-to-show', () => {
      this.window?.show();
    });

    // Handle external links
    this.window.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: 'deny' };
    });

    // Enable dev tools in development
    if (process.env.NODE_ENV === 'development') {
      this.window.webContents.openDevTools();
    }
  }

  setupEvents() {
    // Window blur
    this.window?.on('blur', () => {
      this.window?.webContents.send('window:blur');
    });

    // Window focus
    this.window?.on('focus', () => {
      this.window?.webContents.send('window:focus');
    });

    // App quit
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit();
    });

    // App activate
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });

    // Before quit
    app.on('before-quit', () => {
      this.window?.removeAllListeners('close');
    });
  }
}

new AppBoot();
