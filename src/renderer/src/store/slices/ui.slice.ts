import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Dialog, ThemeMode, Toast } from '../../../../shared/types';

interface UIState {
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  playerBarVisible: boolean;
  miniPlayerVisible: boolean;
  toasts: Toast[];
  dialogs: Dialog[];
  activeModal: string | null;
  modalProps: Record<string, unknown>;
  isScanning: boolean;
  scanProgress: {
    current: number;
    total: number;
    currentPath: string;
  } | null;
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    target: 'track' | 'album' | 'artist' | 'playlist' | null;
    data: unknown;
  };
}

const initialState: UIState = {
  theme: 'dark',
  sidebarCollapsed: false,
  playerBarVisible: true,
  miniPlayerVisible: false,
  toasts: [],
  dialogs: [],
  activeModal: null,
  modalProps: {},
  isScanning: false,
  scanProgress: null,
  contextMenu: {
    visible: false,
    x: 0,
    y: 0,
    target: null,
    data: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setPlayerBarVisible: (state, action: PayloadAction<boolean>) => {
      state.playerBarVisible = action.payload;
    },
    setMiniPlayerVisible: (state, action: PayloadAction<boolean>) => {
      state.miniPlayerVisible = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    showDialog: (state, action: PayloadAction<Omit<Dialog, 'id'>>) => {
      const id = Date.now().toString();
      state.dialogs.push({ ...action.payload, id });
    },
    hideDialog: (state, action: PayloadAction<string>) => {
      state.dialogs = state.dialogs.filter(d => d.id !== action.payload);
    },
    clearDialogs: (state) => {
      state.dialogs = [];
    },
    openModal: (state, action: PayloadAction<{ modal: string; props?: Record<string, unknown> }>) => {
      state.activeModal = action.payload.modal;
      state.modalProps = action.payload.props || {};
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalProps = {};
    },
    setScanning: (state, action: PayloadAction<boolean>) => {
      state.isScanning = action.payload;
    },
    setScanProgress: (state, action: PayloadAction<{ current: number; total: number; currentPath: string } | null>) => {
      state.scanProgress = action.payload;
    },
    showContextMenu: (state, action: PayloadAction<{ x: number; y: number; target: 'track' | 'album' | 'artist' | 'playlist'; data: unknown }>) => {
      state.contextMenu = {
        visible: true,
        x: action.payload.x,
        y: action.payload.y,
        target: action.payload.target,
        data: action.payload.data,
      };
    },
    hideContextMenu: (state) => {
      state.contextMenu.visible = false;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarCollapsed,
  toggleSidebarCollapsed,
  setPlayerBarVisible,
  setMiniPlayerVisible,
  addToast,
  removeToast,
  clearToasts,
  showDialog,
  hideDialog,
  clearDialogs,
  openModal,
  closeModal,
  setScanning,
  setScanProgress,
  showContextMenu,
  hideContextMenu,
} = uiSlice.actions;

export default uiSlice.reducer;
