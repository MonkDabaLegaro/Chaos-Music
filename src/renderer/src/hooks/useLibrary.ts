import { useCallback } from 'react';
import { libraryService } from '../services/library.service';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchAlbums, fetchArtists, fetchGenres, fetchLibraryStats, fetchPlaylists, fetchTracks } from '../store/slices/library.slice';

export function useLibrary() {
  const dispatch = useAppDispatch();
  const { tracks, albums, artists, genres, playlists, stats, loading, error } = useAppSelector(
    (state) => state.library
  );

  const loadTracks = useCallback(async (options?: { artistId?: string; albumId?: string; genre?: string; limit?: number }) => {
    try {
      const data = await libraryService.getTracks(options);
      return data;
    } catch (err) {
      console.error('Failed to load tracks:', err);
      return [];
    }
  }, []);

  const loadAlbums = useCallback(async (options?: { artistId?: string; genre?: string }) => {
    try {
      const data = await libraryService.getAlbums(options);
      return data;
    } catch (err) {
      console.error('Failed to load albums:', err);
      return [];
    }
  }, []);

  const loadArtists = useCallback(async (options?: { genre?: string }) => {
    try {
      const data = await libraryService.getArtists(options);
      return data;
    } catch (err) {
      console.error('Failed to load artists:', err);
      return [];
    }
  }, []);

  const loadGenres = useCallback(async () => {
    try {
      const data = await libraryService.getGenres();
      return data;
    } catch (err) {
      console.error('Failed to load genres:', err);
      return [];
    }
  }, []);

  const loadPlaylists = useCallback(async () => {
    try {
      const data = await libraryService.getPlaylists();
      return data;
    } catch (err) {
      console.error('Failed to load playlists:', err);
      return [];
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await libraryService.getStats();
      return data;
    } catch (err) {
      console.error('Failed to load stats:', err);
      return null;
    }
  }, []);

  const scanLibrary = useCallback(async (folderPath: string) => {
    try {
      const result = await libraryService.scanLibrary(folderPath);
      return result;
    } catch (err) {
      console.error('Failed to scan library:', err);
      throw err;
    }
  }, []);

  const addFolder = useCallback(async (path: string, name: string) => {
    try {
      const result = await libraryService.addFolder(path, name);
      return result;
    } catch (err) {
      console.error('Failed to add folder:', err);
      throw err;
    }
  }, []);

  const toggleFavorite = useCallback(async (trackId: string) => {
    try {
      const result = await libraryService.toggleFavorite(trackId);
      return result;
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      throw err;
    }
  }, []);

  const deleteTrack = useCallback(async (trackId: string) => {
    try {
      await libraryService.deleteTrack(trackId);
    } catch (err) {
      console.error('Failed to delete track:', err);
      throw err;
    }
  }, []);

  const search = useCallback(async (query: string, filters?: { tracks?: boolean; albums?: boolean; artists?: boolean }) => {
    try {
      const result = await libraryService.search(query, filters);
      return result;
    } catch (err) {
      console.error('Failed to search:', err);
      return { tracks: [], albums: [], artists: [] };
    }
  }, []);

  return {
    // State
    tracks,
    albums,
    artists,
    genres,
    playlists,
    stats,
    loading,
    error,
    // Actions
    loadTracks,
    loadAlbums,
    loadArtists,
    loadGenres,
    loadPlaylists,
    loadStats,
    scanLibrary,
    addFolder,
    toggleFavorite,
    deleteTrack,
    search,
    // Redux actions
    fetchTracks: () => dispatch(fetchTracks()),
    fetchAlbums: () => dispatch(fetchAlbums()),
    fetchArtists: () => dispatch(fetchArtists()),
    fetchGenres: () => dispatch(fetchGenres()),
    fetchPlaylists: () => dispatch(fetchPlaylists()),
    fetchStats: () => dispatch(fetchLibraryStats()),
  };
}
