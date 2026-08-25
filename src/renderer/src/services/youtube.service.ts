import type { YouTubePlaylist, YouTubeVideo } from '../../../shared/types';
import { ipcService } from './ipc.service';

export interface YouTubeService {
  search: (query: string, options?: { limit?: number; type?: 'video' | 'playlist' }) => Promise<{
    videos: YouTubeVideo[];
    playlists: YouTubePlaylist[];
  }>;
  getVideo: (videoId: string) => Promise<YouTubeVideo>;
  getPlaylist: (playlistId: string) => Promise<YouTubePlaylist>;
  getTrending: () => Promise<YouTubeVideo[]>;
  getRecommended: () => Promise<YouTubeVideo[]>;
  getStreamUrl: (videoId: string) => Promise<string>;
  getPlaylistVideos: (playlistId: string) => Promise<YouTubeVideo[]>;
}

class YouTubeServiceImpl implements YouTubeService {
  async search(query: string, options?: { limit?: number; type?: 'video' | 'playlist' }): Promise<{
    videos: YouTubeVideo[];
    playlists: YouTubePlaylist[];
  }> {
    const response = await ipcService.searchYouTube(query, options);
    if (!response.success) {
      throw new Error(response.error || 'Failed to search YouTube');
    }
    return response.data!;
  }

  async getVideo(videoId: string): Promise<YouTubeVideo> {
    const response = await ipcService.getYouTubeVideo(videoId);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get video');
    }
    return response.data!;
  }

  async getPlaylist(playlistId: string): Promise<YouTubePlaylist> {
    const response = await ipcService.getYouTubePlaylist(playlistId);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get playlist');
    }
    return response.data!;
  }

  async getTrending(): Promise<YouTubeVideo[]> {
    const response = await ipcService.getTrendingVideos();
    if (!response.success) {
      throw new Error(response.error || 'Failed to get trending videos');
    }
    return response.data || [];
  }

  async getRecommended(): Promise<YouTubeVideo[]> {
    const response = await ipcService.getRecommendedVideos();
    if (!response.success) {
      throw new Error(response.error || 'Failed to get recommended videos');
    }
    return response.data || [];
  }

  async getStreamUrl(videoId: string): Promise<string> {
    const response = await ipcService.getYouTubeStreamUrl(videoId);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get stream URL');
    }
    return response.data!.url;
  }

  async getPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
    const playlist = await this.getPlaylist(playlistId);
    // Extract videos from playlist - this would need to be implemented in the main process
    return [];
  }
}

export const youTubeService = new YouTubeServiceImpl();
