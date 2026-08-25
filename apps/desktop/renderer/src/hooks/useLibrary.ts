import { useCallback } from 'react';
import type { RecentlyAdded, RecentlyPlayed } from '@shared/types';
import { libraryService } from '../services/library.service';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchAlbums, fetchArtists, fetchGenres, fetchLibraryStats, fetchPlaylists, fetchTracks } from '../store/slices/library.slice';

export function useLibrary() {
  const dispatch = useAppDispatch();
  const { tracks, albums, artists, genres, playlists, stats, loading, error } = useAppSelector((state) => state.library);

  const loadTracks = useCallback(async (options?: { artistId?: string; albumId?: string; genre?: string; limit?: number }) => {
    try { return await libraryService.getTracks(options); }
    catch (err) { console.error('Failed to load tracks:', err); return []; }
  }, []);

  const loadAlbums = useCallback(async (options?: { artistId?: string; genre?: string; limit?: number }) => {
    try { return await libraryService.getAlbums(options); }
    catch (err) { console.error('Failed to load albums:', err); return []; }
  }, []);

  const loadArtists = useCallback(async (options?: { genre?: string; limit?: number }) => {
    try { return await libraryService.getArtists(options); }
    catch (err) { console.error('Failed to load artists:', err); return []; }
  }, []);

  const loadGenres = useCallback(async () => {
    try { return await libraryService.getGenres(); }
    catch (err) { console.error('Failed to load genres:', err); return []; }
  }, []);

  const loadPlaylists = useCallback(async () => {
    try { return await libraryService.getPlaylists(); }
    catch (err) { console.error('Failed to load playlists:', err); return []; }
  }, []);

  const loadRecentlyAdded = useCallback(async (limit = 12): Promise<RecentlyAdded[]> => {
    try { return await libraryService.getRecentlyAdded(limit); }
    catch (err) { console.error('Failed to load recently added:', err); return []; }
  }, []);

  const loadRecentlyPlayed = useCallback(async (limit = 12): Promise<RecentlyPlayed[]> => {
    try { return await libraryService.getRecentlyPlayed(limit); }
    catch (err) { console.error('Failed to load recently played:', err); return []; }
  }, []);

  const loadStats = useCallback(async () => {
    try { return await libraryService.getStats(); }
    catch (err) { console.error('Failed to load stats:', err); return null; }
  }, []);

  const scanLibrary = useCallback(async (folderPath: string) => {
    try { return await libraryService.scanLibrary(folderPath); }
    catch (err) { console.error('Failed to scan library:', err); throw err; }
  }, []);

  const addFolder = useCallback(async (path: string, name: string) => {
    try { return await libraryService.addFolder(path, name); }
    catch (err) { console.error('Failed to add folder:', err); throw err; }
  }, []);

  const toggleFavorite = useCallback(async (trackId: string) => {
    try { return await libraryService.toggleFavorite(trackId); }
    catch (err) { console.error('Failed to toggle favorite:', err); throw err; }
  }, []);

  const deleteTrack = useCallback(async (trackId: string) => {
    try { await libraryService.deleteTrack(trackId); }
    catch (err) { console.error('Failed to delete track:', err); throw err; }
  }, []);

  const search = useCallback(async (query: string, filters?: { tracks?: boolean; albums?: boolean; artists?: boolean }) => {
    try { return await libraryService.search(query, filters); }
    catch (err) { console.error('Failed to search:', err); return { tracks: [], albums: [], artists: [] }; }
  }, []);

  return {
    tracks,
    albums,
    artists,
    genres,
    playlists,
    stats,
    loading,
    error,
    loadTracks,
    loadAlbums,
    loadArtists,
    loadGenres,
    loadPlaylists,
    loadRecentlyAdded,
    loadRecentlyPlayed,
    loadStats,
    scanLibrary,
    addFolder,
    toggleFavorite,
    deleteTrack,
    search,
    fetchTracks: () => dispatch(fetchTracks()),
    fetchAlbums: () => dispatch(fetchAlbums()),
    fetchArtists: () => dispatch(fetchArtists()),
    fetchGenres: () => dispatch(fetchGenres()),
    fetchPlaylists: () => dispatch(fetchPlaylists()),
    fetchStats: () => dispatch(fetchLibraryStats()),
  };
}
