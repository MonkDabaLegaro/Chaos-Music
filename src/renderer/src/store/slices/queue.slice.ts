import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { QueueItem } from '../../../../shared/types';

interface QueueState {
  items: QueueItem[];
  currentIndex: number;
  isExpanded: boolean;
}

const initialState: QueueState = {
  items: [],
  currentIndex: 0,
  isExpanded: false,
};

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setQueueItems: (state, action: PayloadAction<QueueItem[]>) => {
      state.items = action.payload;
    },
    addQueueItem: (state, action: PayloadAction<QueueItem>) => {
      state.items.push(action.payload);
    },
    addQueueItems: (state, action: PayloadAction<QueueItem[]>) => {
      state.items.push(...action.payload);
    },
    removeQueueItem: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.items.splice(index, 1);
        if (index < state.currentIndex) {
          state.currentIndex--;
        }
      }
    },
    reorderQueueItems: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.items.splice(fromIndex, 1);
      state.items.splice(toIndex, 0, removed);
    },
    clearQueue: (state) => {
      state.items = [];
      state.currentIndex = 0;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = Math.max(0, Math.min(action.payload, state.items.length - 1));
    },
    nextItem: (state) => {
      if (state.items.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.items.length;
      }
    },
    previousItem: (state) => {
      if (state.items.length > 0) {
        state.currentIndex = state.currentIndex === 0 ? state.items.length - 1 : state.currentIndex - 1;
      }
    },
    setExpanded: (state, action: PayloadAction<boolean>) => {
      state.isExpanded = action.payload;
    },
    toggleExpanded: (state) => {
      state.isExpanded = !state.isExpanded;
    },
  },
});

export const {
  setQueueItems,
  addQueueItem,
  addQueueItems,
  removeQueueItem,
  reorderQueueItems,
  clearQueue,
  setCurrentIndex,
  nextItem,
  previousItem,
  setExpanded,
  toggleExpanded,
} = queueSlice.actions;

export default queueSlice.reducer;
