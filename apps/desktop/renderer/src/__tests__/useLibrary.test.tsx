/**
 * Pruebas Unitarias para useLibrary Hook
 */

import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import libraryReducer from '../store/slices/library.slice';
import { useLibrary } from '../hooks/useLibrary';
import { libraryService } from '../services/library.service';

// Mock del servicio de library
jest.mock('../services/library.service', () => ({
  libraryService: {
    getTracks: jest.fn().mockResolvedValue([]),
    getAlbums: jest.fn().mockResolvedValue([]),
    getArtists: jest.fn().mockResolvedValue([]),
    getGenres: jest.fn().mockResolvedValue([]),
    getPlaylists: jest.fn().mockResolvedValue([]),
    getStats: jest.fn().mockResolvedValue(null),
    scanLibrary: jest.fn().mockResolvedValue({ success: true }),
    addFolder: jest.fn().mockResolvedValue({ id: 'new-folder' }),
    toggleFavorite: jest.fn().mockResolvedValue({ success: true }),
    deleteTrack: jest.fn().mockResolvedValue(undefined),
    search: jest.fn().mockResolvedValue({ tracks: [], albums: [], artists: [] }),
  },
}));

describe('useLibrary Hook', () => {
  let store: ReturnType<typeof configureStore>;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    store = configureStore({
      reducer: { library: libraryReducer },
    });

    wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('state', () => {
    it('debería retornar el estado de la biblioteca', () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      expect(result.current.tracks).toEqual([]);
      expect(result.current.albums).toEqual([]);
      expect(result.current.artists).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('loadTracks', () => {
    it('debería cargar las canciones', async () => {
      const mockTracks = [
        { id: '1', title: 'Track 1', duration: 180 },
        { id: '2', title: 'Track 2', duration: 200 },
      ];
      (libraryService.getTracks as jest.Mock).mockResolvedValue(mockTracks);

      const { result } = renderHook(() => useLibrary(), { wrapper });

      const tracks = await result.current.loadTracks();

      expect(tracks).toEqual(mockTracks);
      expect(libraryService.getTracks).toHaveBeenCalled();
    });

    it('debería manejar errores al cargar canciones', async () => {
      (libraryService.getTracks as jest.Mock).mockRejectedValue(new Error('Load failed'));

      const { result } = renderHook(() => useLibrary(), { wrapper });

      const tracks = await result.current.loadTracks();

      expect(tracks).toEqual([]);
    });
  });

  describe('loadAlbums', () => {
    it('debería cargar los álbumes', async () => {
      const mockAlbums = [
        { id: '1', name: 'Album 1', trackCount: 10 },
      ];
      (libraryService.getAlbums as jest.Mock).mockResolvedValue(mockAlbums);

      const { result } = renderHook(() => useLibrary(), { wrapper });

      const albums = await result.current.loadAlbums();

      expect(albums).toEqual(mockAlbums);
    });
  });

  describe('loadArtists', () => {
    it('debería cargar los artistas', async () => {
      const mockArtists = [
        { id: '1', name: 'Artist 1', trackCount: 20 },
      ];
      (libraryService.getArtists as jest.Mock).mockResolvedValue(mockArtists);

      const { result } = renderHook(() => useLibrary(), { wrapper });

      const artists = await result.current.loadArtists();

      expect(artists).toEqual(mockArtists);
    });
  });

  describe('loadGenres', () => {
    it('debería cargar los géneros', async () => {
      const mockGenres = [
        { id: '1', name: 'Rock', trackCount: 50 },
      ];
      (libraryService.getGenres as jest.Mock).mockResolvedValue(mockGenres);

      const { result } = renderHook(() => useLibrary(), { wrapper });

      const genres = await result.current.loadGenres();

      expect(genres).toEqual(mockGenres);
    });
  });

  describe('loadPlaylists', () => {
    it('debería cargar las playlists', async () => {
      const mockPlaylists = [
        { id: '1', name: 'Playlist 1', trackCount: 15 },
      ];
      (libraryService.getPlaylists as jest.Mock).mockResolvedValue(mockPlaylists);

      const { result } = renderHook(() => useLibrary(), { wrapper });

      const playlists = await result.current.loadPlaylists();

      expect(playlists).toEqual(mockPlaylists);
    });
  });

  describe('loadStats', () => {
    it('debería cargar las estadísticas', async () => {
      const mockStats = {
        totalTracks: 100,
        totalArtists: 20,
        totalAlbums: 30,
      };
      (libraryService.getStats as jest.Mock).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useLibrary(), { wrapper });

      const stats = await result.current.loadStats();

      expect(stats).toEqual(mockStats);
    });
  });

  describe('scanLibrary', () => {
    it('debería escanear la biblioteca', async () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      await act(async () => {
        await result.current.scanLibrary('/music');
      });

      expect(libraryService.scanLibrary).toHaveBeenCalledWith('/music');
    });

    it('debería manejar errores al escanear', async () => {
      (libraryService.scanLibrary as jest.Mock).mockRejectedValue(new Error('Scan failed'));

      const { result } = renderHook(() => useLibrary(), { wrapper });

      await expect(result.current.scanLibrary('/music')).rejects.toThrow('Scan failed');
    });
  });

  describe('addFolder', () => {
    it('debería agregar una carpeta', async () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      const folder = await result.current.addFolder('/music', 'My Music');

      expect(folder).toEqual({ id: 'new-folder' });
      expect(libraryService.addFolder).toHaveBeenCalledWith('/music', 'My Music');
    });
  });

  describe('toggleFavorite', () => {
    it('debería alternar favorito', async () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      await act(async () => {
        await result.current.toggleFavorite('track-123');
      });

      expect(libraryService.toggleFavorite).toHaveBeenCalledWith('track-123');
    });
  });

  describe('deleteTrack', () => {
    it('debería eliminar una canción', async () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      await act(async () => {
        await result.current.deleteTrack('track-123');
      });

      expect(libraryService.deleteTrack).toHaveBeenCalledWith('track-123');
    });
  });

  describe('search', () => {
    it('debería buscar en la biblioteca', async () => {
      const mockResults = {
        tracks: [{ id: '1', title: 'Track 1' }],
        albums: [],
        artists: [],
      };
      (libraryService.search as jest.Mock).mockResolvedValue(mockResults);

      const { result } = renderHook(() => useLibrary(), { wrapper });

      const results = await result.current.search('test');

      expect(results).toEqual(mockResults);
      expect(libraryService.search).toHaveBeenCalledWith('test', undefined);
    });
  });

  describe('redux actions', () => {
    it('debería despachar fetchTracks', async () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.fetchTracks();
      });

      expect(store.getState().library.loading).toBe(true);
    });

    it('debería despachar fetchAlbums', async () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.fetchAlbums();
      });

      expect(store.getState().library.loading).toBe(true);
    });

    it('debería despachar fetchArtists', async () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.fetchArtists();
      });

      expect(store.getState().library.loading).toBe(true);
    });

    it('debería despachar fetchGenres', async () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.fetchGenres();
      });

      expect(store.getState().library.loading).toBe(true);
    });

    it('debería despachar fetchPlaylists', async () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.fetchPlaylists();
      });

      expect(store.getState().library.loading).toBe(true);
    });

    it('debería despachar fetchStats', async () => {
      const { result } = renderHook(() => useLibrary(), { wrapper });

      act(() => {
        result.current.fetchStats();
      });

      expect(store.getState().library.loading).toBe(true);
    });
  });
});
