/**
 * Pruebas Unitarias para usePlayer Hook
 */

import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../store/slices/player.slice';
import { usePlayer } from '../hooks/usePlayer';
import { playerService } from '../services/player.service';

// Mock del servicio de player
jest.mock('../services/player.service', () => ({
  playerService: {
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
    togglePlayPause: jest.fn().mockResolvedValue(undefined),
    next: jest.fn().mockResolvedValue(undefined),
    previous: jest.fn().mockResolvedValue(undefined),
    seek: jest.fn().mockResolvedValue(undefined),
    setVolume: jest.fn().mockResolvedValue(undefined),
    setRepeat: jest.fn().mockResolvedValue(undefined),
    setShuffle: jest.fn().mockResolvedValue(undefined),
    playTrack: jest.fn().mockResolvedValue(undefined),
    playTracks: jest.fn().mockResolvedValue(undefined),
    getState: jest.fn().mockResolvedValue({
      isPlaying: false,
      currentTrack: null,
      queue: [],
      position: 0,
      volume: 1,
      repeatMode: 'off',
      shuffle: false,
    }),
  },
}));

describe('usePlayer Hook', () => {
  let store: ReturnType<typeof configureStore>;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    store = configureStore({
      reducer: { player: playerReducer },
    });

    wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('state', () => {
    it('debería retornar el estado del player', () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      expect(result.current.playerState).toBeDefined();
      expect(result.current.playerState.isPlaying).toBe(false);
      expect(result.current.playerState.queue).toEqual([]);
    });
  });

  describe('play', () => {
    it('debería reproducir correctamente', async () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.play();
      });

      expect(playerService.play).toHaveBeenCalled();
      expect(store.getState().player.isPlaying).toBe(true);
    });

    it('debería manejar errores al reproducir', async () => {
      (playerService.play as jest.Mock).mockRejectedValueOnce(new Error('Play failed'));

      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.play();
      });

      expect(playerService.play).toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    it('debería pausar correctamente', async () => {
      // First play
      await act(async () => {
        await store.dispatch({ type: 'player/setIsPlaying', payload: true });
      });

      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.pause();
      });

      expect(playerService.pause).toHaveBeenCalled();
      expect(store.getState().player.isPlaying).toBe(false);
    });
  });

  describe('stop', () => {
    it('debería detener correctamente', async () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.stop();
      });

      expect(playerService.stop).toHaveBeenCalled();
      expect(store.getState().player.isPlaying).toBe(false);
      expect(store.getState().player.currentTrack).toBeNull();
    });
  });

  describe('togglePlayPause', () => {
    it('debería alternar play/pause', async () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.togglePlayPause();
      });

      expect(playerService.togglePlayPause).toHaveBeenCalled();
    });
  });

  describe('next', () => {
    it('debería reproducir la siguiente canción', async () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.next();
      });

      expect(playerService.next).toHaveBeenCalled();
    });
  });

  describe('previous', () => {
    it('debería reproducir la canción anterior', async () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.previous();
      });

      expect(playerService.previous).toHaveBeenCalled();
    });
  });

  describe('seek', () => {
    it('debería buscar a una posición específica', async () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.seek(60);
      });

      expect(playerService.seek).toHaveBeenCalledWith(60);
    });
  });

  describe('setVolume', () => {
    it('debería establecer el volumen', async () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.setVolume(0.5);
      });

      expect(playerService.setVolume).toHaveBeenCalledWith(0.5);
    });
  });

  describe('setRepeat', () => {
    it('debería establecer el modo de repetición', async () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.setRepeat('all');
      });

      expect(playerService.setRepeat).toHaveBeenCalledWith('all');
    });
  });

  describe('toggleShuffle', () => {
    it('debería alternar shuffle', async () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.toggleShuffle();
      });

      expect(playerService.setShuffle).toHaveBeenCalledWith(true);
    });
  });

  describe('playTrack', () => {
    it('debería reproducir una canción específica', async () => {
      const track = { id: '1', title: 'Test Track', duration: 180 };
      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.playTrack(track as any);
      });

      expect(playerService.playTrack).toHaveBeenCalledWith(track);
      expect(store.getState().player.currentTrack).toEqual(track);
      expect(store.getState().player.isPlaying).toBe(true);
    });
  });

  describe('playTracks', () => {
    it('debería reproducir múltiples canciones', async () => {
      const tracks = [
        { id: '1', title: 'Track 1', duration: 180 },
        { id: '2', title: 'Track 2', duration: 200 },
      ];
      const { result } = renderHook(() => usePlayer(), { wrapper });

      await act(async () => {
        await result.current.playTracks(tracks as any[]);
      });

      expect(playerService.playTracks).toHaveBeenCalled();
      expect(store.getState().player.queue).toEqual(tracks);
      expect(store.getState().player.currentTrack).toEqual(tracks[0]);
    });
  });

  describe('getState', () => {
    it('debería obtener el estado del reproductor', async () => {
      const { result } = renderHook(() => usePlayer(), { wrapper });

      const state = await result.current.getState();

      expect(state).toBeDefined();
      expect(playerService.getState).toHaveBeenCalled();
    });
  });
});
