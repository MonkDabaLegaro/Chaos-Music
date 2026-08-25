import { IPCResponse } from '../../../shared/types';

// Channel names matching main process handlers
export enum IPCChannels {
  // Library
  LIBRARY_SCAN = 'library:scan',
  LIBRARY_GET_TRACKS = 'library:get-tracks',
  LIBRARY_GET_ALBUMS = 'library:get-albums',
  LIBRARY_GET_ARTISTS = 'library:get-artists',
  LIBRARY_GET_GENRES = 'library:get-genres',
  LIBRARY_GET_PLAYLISTS = 'library:get-playlists',
  LIBRARY_GET_RECENTLY_ADDED = 'library:get-recently-added',
  LIBRARY_GET_RECENTLY_PLAYED = 'library:get-recently-played',
  LIBRARY_GET_STATS = 'library:get-stats',
  LIBRARY_ADD_FOLDER = 'library:add-folder',
  LIBRARY_REMOVE_FOLDER = 'library:remove-folder',
  LIBRARY_GET_FOLDERS = 'library:get-folders',
  LIBRARY_UPDATE_TRACK = 'library:update-track',
  LIBRARY_DELETE_TRACK = 'library:delete-track',
  
  // Player
  PLAYER_PLAY = 'player:play',
  PLAYER_PAUSE = 'player:pause',
  PLAYER_STOP = 'player:stop',
  PLAYER_NEXT = 'player:next',
  PLAYER_PREVIOUS = 'player:previous',
  PLAYER_SEEK = 'player:seek',
  PLAYER_SET_VOLUME = 'player:set-volume',
  PLAYER_SET_POSITION = 'player:set-position',
  PLAYER_SET_REPEAT = 'player:set-repeat',
  PLAYER_SET_SHUFFLE = 'player:set-shuffle',
  PLAYER_GET_STATE = 'player:get-state',
  PLAYER_ADD_TO_QUEUE = 'player:add-to-queue',
  PLAYER_CLEAR_QUEUE = 'player:clear-queue',
  PLAYER_REMOVE_FROM_QUEUE = 'player:remove-from-queue',
  PLAYER_REORDER_QUEUE = 'player:reorder-queue',
  
  // YouTube
  YOUTUBE_SEARCH = 'youtube:search',
  YOUTUBE_GET_VIDEO = 'youtube:get-video',
  YOUTUBE_GET_PLAYLIST = 'youtube:get-playlist',
  YOUTUBE_GET_TRENDING = 'youtube:get-trending',
  YOUTUBE_GET_RECOMMENDED = 'youtube:get-recommended',
  YOUTUBE_STREAM_URL = 'youtube:stream-url',
  
  // Playlist
  PLAYLIST_CREATE = 'playlist:create',
  PLAYLIST_UPDATE = 'playlist:update',
  PLAYLIST_DELETE = 'playlist:delete',
  PLAYLIST_ADD_TRACK = 'playlist:add-track',
  PLAYLIST_REMOVE_TRACK = 'playlist:remove-track',
  PLAYLIST_GET_TRACKS = 'playlist:get-tracks',
  
  // Settings
  SETTINGS_GET = 'settings:get',
  SETTINGS_SET = 'settings:set',
  
  // Window
  WINDOW_MINIMIZE = 'window:minimize',
  WINDOW_MAXIMIZE = 'window:maximize',
  WINDOW_CLOSE = 'window:close',
}

class IPCService {
  private invoke<T>(channel: IPCChannels, ...args: unknown[]): Promise<IPCResponse<T>> {
    return window.electronAPI.invoke(channel, ...args) as Promise<IPCResponse<T>>;
  }

  private on(channel: IPCChannels, callback: (...args: unknown[]) => void): void {
    window.electronAPI.on(channel, callback);
  }

  private off(channel: IPCChannels, callback?: (...args: unknown[]) => void): void {
    window.electronAPI.off(channel, callback);
  }

  // Library operations
  async scanLibrary(folderPath: string): Promise<IPCResponse<{ trackCount: number }>> {
    return this.invoke(IPCChannels.LIBRARY_SCAN, folderPath);
  }

  async getTracks(options?: { artistId?: string; albumId?: string; genre?: string; limit?: number; offset?: number }): Promise<IPCResponse<import('../../../../shared/types').Track[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_TRACKS, options);
  }

  async getAlbums(options?: { artistId?: string; genre?: string; limit?: number; offset?: number }): Promise<IPCResponse<import('../../../../shared/types').Album[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_ALBUMS, options);
  }

  async getArtists(options?: { genre?: string; limit?: number; offset?: number }): Promise<IPCResponse<import('../../../../shared/types').Artist[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_ARTISTS, options);
  }

  async getGenres(): Promise<IPCResponse<import('../../../../shared/types').Genre[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_GENRES);
  }

  async getPlaylists(): Promise<IPCResponse<import('../../../../shared/types').Playlist[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_PLAYLISTS);
  }

  async getRecentlyAdded(limit?: number): Promise<IPCResponse<import('../../../../shared/types').RecentlyAdded[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_RECENTLY_ADDED, limit);
  }

  async getRecentlyPlayed(limit?: number): Promise<IPCResponse<import('../../../../shared/types').RecentlyPlayed[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_RECENTLY_PLAYED, limit);
  }

  async getLibraryStats(): Promise<IPCResponse<import('../../../../shared/types').LibraryStats>> {
    return this.invoke(IPCChannels.LIBRARY_GET_STATS);
  }

  async addLibraryFolder(path: string, name: string): Promise<IPCResponse<import('../../../../shared/types').LibraryFolder>> {
    return this.invoke(IPCChannels.LIBRARY_ADD_FOLDER, { path, name });
  }

  async removeLibraryFolder(folderId: string): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.LIBRARY_REMOVE_FOLDER, folderId);
  }

  async getLibraryFolders(): Promise<IPCResponse<import('../../../../shared/types').LibraryFolder[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_FOLDERS);
  }

  async updateTrack(trackId: string, updates: Partial<import('../../../../shared/types').Track>): Promise<IPCResponse<import('../../../../shared/types').Track>> {
    return this.invoke(IPCChannels.LIBRARY_UPDATE_TRACK, { trackId, updates });
  }

  async deleteTrack(trackId: string): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.LIBRARY_DELETE_TRACK, trackId);
  }

  // Player operations
  async play(): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_PLAY);
  }

  async pause(): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_PAUSE);
  }

  async stop(): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_STOP);
  }

  async next(): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_NEXT);
  }

  async previous(): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_PREVIOUS);
  }

  async seek(position: number): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_SEEK, position);
  }

  async setVolume(volume: number): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_SET_VOLUME, volume);
  }

  async setPosition(position: number): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_SET_POSITION, position);
  }

  async setRepeat(mode: 'off' | 'all' | 'one'): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_SET_REPEAT, mode);
  }

  async setShuffle(enabled: boolean): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_SET_SHUFFLE, enabled);
  }

  async getPlayerState(): Promise<IPCResponse<import('../../../../shared/types').PlayerState>> {
    return this.invoke(IPCChannels.PLAYER_GET_STATE);
  }

  async addToQueue(trackIds: string[]): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_ADD_TO_QUEUE, trackIds);
  }

  async clearQueue(): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_CLEAR_QUEUE);
  }

  async removeFromQueue(index: number): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_REMOVE_FROM_QUEUE, index);
  }

  async reorderQueue(fromIndex: number, toIndex: number): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYER_REORDER_QUEUE, { fromIndex, toIndex });
  }

  // YouTube operations
  async searchYouTube(query: string, options?: { limit?: number; type?: 'video' | 'playlist' }): Promise<IPCResponse<{ videos: import('../../../../shared/types').YouTubeVideo[]; playlists: import('../../../../shared/types').YouTubePlaylist[] }>> {
    return this.invoke(IPCChannels.YOUTUBE_SEARCH, { query, ...options });
  }

  async getYouTubeVideo(videoId: string): Promise<IPCResponse<import('../../../../shared/types').YouTubeVideo>> {
    return this.invoke(IPCChannels.YOUTUBE_GET_VIDEO, videoId);
  }

  async getYouTubePlaylist(playlistId: string): Promise<IPCResponse<import('../../../../shared/types').YouTubePlaylist>> {
    return this.invoke(IPCChannels.YOUTUBE_GET_PLAYLIST, playlistId);
  }

  async getTrendingVideos(): Promise<IPCResponse<import('../../../../shared/types').YouTubeVideo[]>> {
    return this.invoke(IPCChannels.YOUTUBE_GET_TRENDING);
  }

  async getRecommendedVideos(): Promise<IPCResponse<import('../../../../shared/types').YouTubeVideo[]>> {
    return this.invoke(IPCChannels.YOUTUBE_GET_RECOMMENDED);
  }

  async getYouTubeStreamUrl(videoId: string): Promise<IPCResponse<{ url: string }>> {
    return this.invoke(IPCChannels.YOUTUBE_STREAM_URL, videoId);
  }

  // Playlist operations
  async createPlaylist(name: string, description?: string): Promise<IPCResponse<import('../../../../shared/types').Playlist>> {
    return this.invoke(IPCChannels.PLAYLIST_CREATE, { name, description });
  }

  async updatePlaylist(playlistId: string, updates: Partial<import('../../../../shared/types').Playlist>): Promise<IPCResponse<import('../../../../shared/types').Playlist>> {
    return this.invoke(IPCChannels.PLAYLIST_UPDATE, { playlistId, updates });
  }

  async deletePlaylist(playlistId: string): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYLIST_DELETE, playlistId);
  }

  async addTrackToPlaylist(playlistId: string, trackId: string): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYLIST_ADD_TRACK, { playlistId, trackId });
  }

  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYLIST_REMOVE_TRACK, { playlistId, trackId });
  }

  async getPlaylistTracks(playlistId: string): Promise<IPCResponse<import('../../../../shared/types').Track[]>> {
    return this.invoke(IPCChannels.PLAYLIST_GET_TRACKS, playlistId);
  }

  // Settings operations
  async getSettings(): Promise<IPCResponse<import('../../../../shared/types').AppSettings>> {
    return this.invoke(IPCChannels.SETTINGS_GET);
  }

  async setSettings(settings: Partial<import('../../../../shared/types').AppSettings>): Promise<IPCResponse<import('../../../../shared/types').AppSettings>> {
    return this.invoke(IPCChannels.SETTINGS_SET, settings);
  }

  // Window operations
  minimizeWindow(): void {
    window.electronAPI.send(IPCChannels.WINDOW_MINIMIZE);
  }

  maximizeWindow(): void {
    window.electronAPI.send(IPCChannels.WINDOW_MAXIMIZE);
  }

  closeWindow(): void {
    window.electronAPI.send(IPCChannels.WINDOW_CLOSE);
  }

  // Event listeners
  onPlayerStateChange(callback: (state: import('../../../../shared/types').PlayerState) => void): void {
    this.on(IPCChannels.PLAYER_GET_STATE, callback);
  }

  onLibraryScanProgress(callback: (progress: { current: number; total: number; currentPath: string }) => void): void {
    this.on(IPCChannels.LIBRARY_SCAN, callback);
  }

  offPlayerStateChange(callback?: (...args: unknown[]) => void): void {
    this.off(IPCChannels.PLAYER_GET_STATE, callback);
  }

  offLibraryScanProgress(callback?: (...args: unknown[]) => void): void {
    this.off(IPCChannels.LIBRARY_SCAN, callback);
  }
}

export const ipcService = new IPCService();
