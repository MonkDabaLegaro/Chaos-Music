import { act, renderHook } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { useLibrary } from '../hooks/useLibrary';
import { libraryService } from '../services/library.service';
import libraryReducer from '../store/slices/library.slice';

jest.mock('../services/library.service', () => ({
  libraryService: {
    getTracks: jest.fn().mockResolvedValue([]),
    getAlbums: jest.fn().mockResolvedValue([]),
    getArtists: jest.fn().mockResolvedValue([]),
    getGenres: jest.fn().mockResolvedValue([]),
    getPlaylists: jest.fn().mockResolvedValue([]),
    getRecentlyAdded: jest.fn().mockResolvedValue([]),
    getRecentlyPlayed: jest.fn().mockResolvedValue([]),
    getStats: jest.fn().mockResolvedValue(null),
    scanLibrary: jest.fn().mockResolvedValue({ trackCount: 0 }),
    addFolder: jest.fn().mockResolvedValue({ id: 'folder-1' }),
    toggleFavorite: jest.fn().mockResolvedValue({ id: 'track-1', isFavorite: true }),
    deleteTrack: jest.fn().mockResolvedValue(undefined),
    search: jest.fn().mockResolvedValue({ tracks: [], albums: [], artists: [] }),
  },
}));

describe('useLibrary', () => {
  const setup = () => {
    const store = configureStore({ reducer: { library: libraryReducer } });
    const wrapper = ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;
    return { store, ...renderHook(() => useLibrary(), { wrapper }) };
  };

  beforeEach(() => jest.clearAllMocks());

  it('expone el estado inicial de biblioteca', () => {
    const { result } = setup();
    expect(result.current.tracks).toEqual([]);
    expect(result.current.albums).toEqual([]);
    expect(result.current.artists).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('delega cargas de catálogo y recientes al servicio', async () => {
    const tracks = [{ id: 'track-1', title: 'Track' }];
    const recent = [{ track: tracks[0], addedAt: '2026-08-25' }];
    (libraryService.getTracks as jest.Mock).mockResolvedValue(tracks);
    (libraryService.getRecentlyAdded as jest.Mock).mockResolvedValue(recent);
    const { result } = setup();

    await expect(result.current.loadTracks({ limit: 5 })).resolves.toEqual(tracks);
    await expect(result.current.loadRecentlyAdded(5)).resolves.toEqual(recent);
    expect(libraryService.getTracks).toHaveBeenCalledWith({ limit: 5 });
    expect(libraryService.getRecentlyAdded).toHaveBeenCalledWith(5);
  });

  it('devuelve colecciones vacías cuando falla una lectura recuperable', async () => {
    (libraryService.getTracks as jest.Mock).mockRejectedValue(new Error('Load failed'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const { result } = setup();

    await expect(result.current.loadTracks()).resolves.toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('propaga errores de operaciones mutables', async () => {
    (libraryService.scanLibrary as jest.Mock).mockRejectedValue(new Error('Scan failed'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const { result } = setup();

    await expect(result.current.scanLibrary('/music')).rejects.toThrow('Scan failed');
    consoleSpy.mockRestore();
  });

  it('delega búsqueda y mutaciones explícitas', async () => {
    const { result } = setup();
    await act(async () => {
      await result.current.addFolder('/music', 'Music');
      await result.current.toggleFavorite('track-1');
      await result.current.deleteTrack('track-1');
      await result.current.search('forest');
    });

    expect(libraryService.addFolder).toHaveBeenCalledWith('/music', 'Music');
    expect(libraryService.toggleFavorite).toHaveBeenCalledWith('track-1');
    expect(libraryService.deleteTrack).toHaveBeenCalledWith('track-1');
    expect(libraryService.search).toHaveBeenCalledWith('forest', undefined);
  });

  it('despacha los thunks de sincronización hasta estado fulfilled', async () => {
    const { result, store } = setup();

    await act(async () => {
      await result.current.fetchTracks();
      await result.current.fetchAlbums();
      await result.current.fetchArtists();
      await result.current.fetchGenres();
      await result.current.fetchPlaylists();
      await result.current.fetchStats();
    });

    expect(store.getState().library.loading).toBe(false);
    expect(store.getState().library.error).toBeNull();
  });
});
