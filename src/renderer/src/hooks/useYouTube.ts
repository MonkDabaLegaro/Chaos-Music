import { useCallback, useState } from 'react';
import { youTubeService } from '../services/youtube.service';

export function useYouTube() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, options?: { limit?: number; type?: 'video' | 'playlist' }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await youTubeService.search(query, options);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search YouTube';
      setError(message);
      return { videos: [], playlists: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const getVideo = useCallback(async (videoId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await youTubeService.getVideo(videoId);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get video';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlaylist = useCallback(async (playlistId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await youTubeService.getPlaylist(playlistId);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get playlist';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await youTubeService.getTrending();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get trending';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecommended = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await youTubeService.getRecommended();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get recommended';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getStreamUrl = useCallback(async (videoId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await youTubeService.getStreamUrl(videoId);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get stream URL';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    search,
    getVideo,
    getPlaylist,
    getTrending,
    getRecommended,
    getStreamUrl,
  };
}
