import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PlayerState, Track } from '../../../../shared/types';

const initialState: PlayerState = {
  isPlaying: false,
  currentTrack: null,
  queue: [],
  position: 0,
  volume: 1,
  repeatMode: 'off',
  shuffle: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<Track | null>) => {
      state.currentTrack = action.payload;
    },
    setQueue: (state, action: PayloadAction<Track[]>) => {
      state.queue = action.payload;
    },
    addToQueue: (state, action: PayloadAction<Track | Track[]>) => {
      const tracks = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.queue.push(...tracks);
    },
    removeFromQueue: (state, action: PayloadAction<number>) => {
      state.queue.splice(action.payload, 1);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    setPosition: (state, action: PayloadAction<number>) => {
      state.position = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
    setRepeatMode: (state, action: PayloadAction<'off' | 'all' | 'one'>) => {
      state.repeatMode = action.payload;
    },
    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.shuffle = action.payload;
    },
    playNext: (state) => {
      if (state.queue.length === 0 || !state.currentTrack) return;
      const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
      if (currentIndex === -1) return;
      const nextIndex = state.shuffle
        ? Math.floor(Math.random() * state.queue.length)
        : (currentIndex + 1) % state.queue.length;
      state.currentTrack = state.queue[nextIndex];
    },
    playPrevious: (state) => {
      if (state.queue.length === 0 || !state.currentTrack) return;
      const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
      if (currentIndex === -1) return;
      const prevIndex = currentIndex === 0 ? state.queue.length - 1 : currentIndex - 1;
      state.currentTrack = state.queue[prevIndex];
    },
    setPlayerState: (state, action: PayloadAction<Partial<PlayerState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setIsPlaying,
  setCurrentTrack,
  setQueue,
  addToQueue,
  removeFromQueue,
  clearQueue,
  setPosition,
  setVolume,
  setRepeatMode,
  setShuffle,
  playNext,
  playPrevious,
  setPlayerState,
} = playerSlice.actions;

export default playerSlice.reducer;
