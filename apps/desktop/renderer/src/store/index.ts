import { configureStore } from '@reduxjs/toolkit';
import libraryReducer from './slices/library.slice';
import playerReducer from './slices/player.slice';
import queueReducer from './slices/queue.slice';
import searchReducer from './slices/search.slice';
import uiReducer from './slices/ui.slice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    library: libraryReducer,
    queue: queueReducer,
    search: searchReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
