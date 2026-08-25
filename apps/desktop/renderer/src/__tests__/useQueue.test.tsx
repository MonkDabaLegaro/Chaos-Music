/**
 * Pruebas Unitarias para useQueue Hook
 */

import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import queueReducer from '../store/slices/queue.slice';
import playerReducer from '../store/slices/player.slice';
import { useQueue } from '../hooks/useQueue';
import { playerService } from '../services/player.service';

// Mock del servicio de player
jest.mock('../services/player.service', () => ({
  playerService: {
    addToQueue: jest.fn().mockResolvedValue(undefined),
    removeFromQueue: jest.fn().mockResolvedValue(undefined),
    reorderQueue: jest.fn().mockResolvedValue(undefined),
    clearQueue: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('useQueue Hook', () => {
  let store: ReturnType<typeof configureStore>;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        queue: queueReducer,
        player: playerReducer,
      },
    });

    wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('state', () => {
    it('debería retornar el estado de la cola', () => {
      const { result } = renderHook(() => useQueue(), { wrapper });

      expect(result.current.queueItems).toEqual([]);
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.isExpanded).toBe(false);
    });
  });

  describe('addToQueue', () => {
    it('debería agregar una canción a la cola', async () => {
      const track = { id: '1', title: 'Track 1', duration: 180 };
      const { result } = renderHook(() => useQueue(), { wrapper });

      await act(async () => {
        await result.current.addToQueue(track as any);
      });

      expect(store.getState().queue.items).toHaveLength(1);
      expect(playerService.addToQueue).toHaveBeenCalledWith(['1']);
    });

    it('debería agregar múltiples canciones a la cola', async () => {
      const tracks = [
        { id: '1', title: 'Track 1', duration: 180 },
        { id: '2', title: 'Track 2', duration: 200 },
      ];
      const { result } = renderHook(() => useQueue(), { wrapper });

      await act(async () => {
        await result.current.addToQueue(tracks as any[]);
      });

      expect(store.getState().queue.items).toHaveLength(2);
    });
  });

  describe('removeFromQueue', () => {
    it('debería remover una canción de la cola', async () => {
      const items = [
        { id: 'item-1', track: { id: '1' }, position: 0, addedAt: new Date().toISOString() },
        { id: 'item-2', track: { id: '2' }, position: 1, addedAt: new Date().toISOString() },
      ];

      await act(async () => {
        store.dispatch({ type: 'queue/setQueueItems', payload: items });
      });

      const { result } = renderHook(() => useQueue(), { wrapper });

      await act(async () => {
        await result.current.removeFromQueue('item-1');
      });

      expect(store.getState().queue.items).toHaveLength(1);
      expect(playerService.removeFromQueue).toHaveBeenCalledWith(0);
    });

    it('no debería hacer nada si el item no existe', async () => {
      const items = [
        { id: 'item-1', track: { id: '1' }, position: 0, addedAt: new Date().toISOString() },
      ];

      await act(async () => {
        store.dispatch({ type: 'queue/setQueueItems', payload: items });
      });

      const { result } = renderHook(() => useQueue(), { wrapper });

      await act(async () => {
        await result.current.removeFromQueue('non-existent');
      });

      expect(store.getState().queue.items).toHaveLength(1);
    });
  });

  describe('reorder', () => {
    it('debería reordenar la cola', async () => {
      const items = [
        { id: 'item-1', track: { id: '1' }, position: 0, addedAt: new Date().toISOString() },
        { id: 'item-2', track: { id: '2' }, position: 1, addedAt: new Date().toISOString() },
      ];

      await act(async () => {
        store.dispatch({ type: 'queue/setQueueItems', payload: items });
      });

      const { result } = renderHook(() => useQueue(), { wrapper });

      await act(async () => {
        await result.current.reorder(0, 1);
      });

      expect(store.getState().queue.items[0].id).toBe('item-2');
      expect(playerService.reorderQueue).toHaveBeenCalledWith(0, 1);
    });
  });

  describe('clear', () => {
    it('debería limpiar la cola', async () => {
      const items = [
        { id: 'item-1', track: { id: '1' }, position: 0, addedAt: new Date().toISOString() },
        { id: 'item-2', track: { id: '2' }, position: 1, addedAt: new Date().toISOString() },
      ];

      await act(async () => {
        store.dispatch({ type: 'queue/setQueueItems', payload: items });
      });

      const { result } = renderHook(() => useQueue(), { wrapper });

      await act(async () => {
        await result.current.clear();
      });

      expect(store.getState().queue.items).toHaveLength(0);
      expect(playerService.clearQueue).toHaveBeenCalled();
    });
  });

  describe('goToIndex', () => {
    it('debería ir a un índice específico', async () => {
      const items = [
        { id: 'item-1', track: { id: '1' }, position: 0, addedAt: new Date().toISOString() },
        { id: 'item-2', track: { id: '2' }, position: 1, addedAt: new Date().toISOString() },
      ];

      await act(async () => {
        store.dispatch({ type: 'queue/setQueueItems', payload: items });
      });

      const { result } = renderHook(() => useQueue(), { wrapper });

      act(() => {
        result.current.goToIndex(1);
      });

      expect(store.getState().queue.currentIndex).toBe(1);
    });
  });

  describe('next', () => {
    it('debería ir al siguiente item', async () => {
      const items = [
        { id: 'item-1', track: { id: '1' }, position: 0, addedAt: new Date().toISOString() },
        { id: 'item-2', track: { id: '2' }, position: 1, addedAt: new Date().toISOString() },
      ];

      await act(async () => {
        store.dispatch({ type: 'queue/setQueueItems', payload: items });
      });

      const { result } = renderHook(() => useQueue(), { wrapper });

      act(() => {
        result.current.next();
      });

      expect(store.getState().queue.currentIndex).toBe(1);
    });

    it('debería hacer loop al inicio', async () => {
      const items = [
        { id: 'item-1', track: { id: '1' }, position: 0, addedAt: new Date().toISOString() },
      ];

      await act(async () => {
        store.dispatch({ type: 'queue/setQueueItems', payload: items });
        store.dispatch({ type: 'queue/setCurrentIndex', payload: 0 });
      });

      const { result } = renderHook(() => useQueue(), { wrapper });

      act(() => {
        result.current.next();
      });

      expect(store.getState().queue.currentIndex).toBe(0);
    });
  });

  describe('previous', () => {
    it('debería ir al item anterior', async () => {
      const items = [
        { id: 'item-1', track: { id: '1' }, position: 0, addedAt: new Date().toISOString() },
        { id: 'item-2', track: { id: '2' }, position: 1, addedAt: new Date().toISOString() },
      ];

      await act(async () => {
        store.dispatch({ type: 'queue/setQueueItems', payload: items });
        store.dispatch({ type: 'queue/setCurrentIndex', payload: 1 });
      });

      const { result } = renderHook(() => useQueue(), { wrapper });

      act(() => {
        result.current.previous();
      });

      expect(store.getState().queue.currentIndex).toBe(0);
    });
  });

  describe('toggleExpandedView', () => {
    it('debería alternar expanded', () => {
      const { result } = renderHook(() => useQueue(), { wrapper });

      act(() => {
        result.current.toggleExpandedView();
      });

      expect(store.getState().queue.isExpanded).toBe(true);
    });
  });

  describe('setExpandedView', () => {
    it('debería setear expanded', () => {
      const { result } = renderHook(() => useQueue(), { wrapper });

      act(() => {
        result.current.setExpandedView(true);
      });

      expect(store.getState().queue.isExpanded).toBe(true);
    });
  });

  describe('currentTrack', () => {
    it('debería retornar el track actual', async () => {
      const items = [
        { id: 'item-1', track: { id: '1', title: 'Track 1' }, position: 0, addedAt: new Date().toISOString() },
      ];

      await act(async () => {
        store.dispatch({ type: 'queue/setQueueItems', payload: items });
        store.dispatch({ type: 'queue/setCurrentIndex', payload: 0 });
      });

      const { result } = renderHook(() => useQueue(), { wrapper });

      expect(result.current.currentTrack).toBeDefined();
      expect(result.current.currentTrack?.id).toBe('1');
    });

    it('debería retornar null si no hay track actual', () => {
      const { result } = renderHook(() => useQueue(), { wrapper });

      expect(result.current.currentTrack).toBeNull();
    });
  });
});
