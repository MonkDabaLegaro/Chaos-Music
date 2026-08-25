import { useCallback, useState } from 'react';
import type { Playlist, Track } from '../../../shared/types';
import { ipcService } from '../services/ipc.service';

export function usePlaylist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlaylist = useCallback(async (name: string, description?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ipcService.createPlaylist(name, description);
      if (response.success) {
        return response.data!;
      }
      throw new Error(response.error || 'Failed to create playlist');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create playlist';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePlaylist = useCallback(async (playlistId: string, updates: Partial<Playlist>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ipcService.updatePlaylist(playlistId, updates);
      if (response.success) {
        return response.data!;
      }
      throw new Error(response.error || 'Failed to update playlist');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update playlist';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ipcService.deletePlaylist(playlistId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete playlist');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete playlist';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTrackToPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ipcService.addTrackToPlaylist(playlistId, trackId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to add track to playlist');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add track to playlist';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ipcService.removeTrackFromPlaylist(playlistId, trackId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to remove track from playlist');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove track from playlist';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlaylistTracks = useCallback(async (playlistId: string): Promise<Track[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await ipcService.getPlaylistTracks(playlistId);
      if (response.success) {
        return response.data || [];
      }
      throw new Error(response.error || 'Failed to get playlist tracks');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get playlist tracks';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    getPlaylistTracks,
  };
}
