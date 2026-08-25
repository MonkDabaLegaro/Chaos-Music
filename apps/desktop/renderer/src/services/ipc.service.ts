import type {
  Album,
  AppSettings,
  Artist,
  Genre,
  IPCResponse,
  LibraryFolder,
  LibraryStats,
  PlayerState,
  Playlist,
  RecentlyAdded,
  RecentlyPlayed,
  Track,
  YouTubePlaylist,
  YouTubeVideo,
} from '../../../shared/types';

export enum IPCChannels {
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

  YOUTUBE_SEARCH = 'youtube:search',
  YOUTUBE_GET_VIDEO = 'youtube:get-video',
  YOUTUBE_GET_PLAYLIST = 'youtube:get-playlist',
  YOUTUBE_GET_TRENDING = 'youtube:get-trending',
  YOUTUBE_GET_RECOMMENDED = 'youtube:get-recommended',
  YOUTUBE_STREAM_URL = 'youtube:stream-url',

  PLAYLIST_CREATE = 'playlist:create',
  PLAYLIST_UPDATE = 'playlist:update',
  PLAYLIST_DELETE = 'playlist:delete',
  PLAYLIST_ADD_TRACK = 'playlist:add-track',
  PLAYLIST_REMOVE_TRACK = 'playlist:remove-track',
  PLAYLIST_GET_TRACKS = 'playlist:get-tracks',

  SETTINGS_GET = 'settings:get',
  SETTINGS_SET = 'settings:set',

  WINDOW_MINIMIZE = 'window:minimize',
  WINDOW_MAXIMIZE = 'window:maximize',
  WINDOW_CLOSE = 'window:close',
}

class IPCService {
  private invoke<T>(channel: IPCChannels, ...args: unknown[]): Promise<IPCResponse<T>> {
    return window.electronAPI.invoke<IPCResponse<T>>(channel, ...args);
  }

  private on(channel: IPCChannels, callback: (...args: unknown[]) => void): void {
    window.electronAPI.on(channel, callback);
  }

  private off(channel: IPCChannels, callback?: (...args: unknown[]) => void): void {
    window.electronAPI.off(channel, callback);
  }

  scanLibrary(folderPath: string): Promise<IPCResponse<{ trackCount: number }>> {
    return this.invoke(IPCChannels.LIBRARY_SCAN, folderPath);
  }

  getTracks(options?: { artistId?: string; albumId?: string; genre?: string; limit?: number; offset?: number }): Promise<IPCResponse<Track[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_TRACKS, options);
  }

  getAlbums(options?: { artistId?: string; genre?: string; limit?: number; offset?: number }): Promise<IPCResponse<Album[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_ALBUMS, options);
  }

  getArtists(options?: { genre?: string; limit?: number; offset?: number }): Promise<IPCResponse<Artist[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_ARTISTS, options);
  }

  getGenres(): Promise<IPCResponse<Genre[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_GENRES);
  }

  getPlaylists(): Promise<IPCResponse<Playlist[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_PLAYLISTS);
  }

  getRecentlyAdded(limit?: number): Promise<IPCResponse<RecentlyAdded[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_RECENTLY_ADDED, limit);
  }

  getRecentlyPlayed(limit?: number): Promise<IPCResponse<RecentlyPlayed[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_RECENTLY_PLAYED, limit);
  }

  getLibraryStats(): Promise<IPCResponse<LibraryStats>> {
    return this.invoke(IPCChannels.LIBRARY_GET_STATS);
  }

  addLibraryFolder(path: string, name: string): Promise<IPCResponse<LibraryFolder>> {
    return this.invoke(IPCChannels.LIBRARY_ADD_FOLDER, { path, name });
  }

  removeLibraryFolder(folderId: string): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.LIBRARY_REMOVE_FOLDER, folderId);
  }

  getLibraryFolders(): Promise<IPCResponse<LibraryFolder[]>> {
    return this.invoke(IPCChannels.LIBRARY_GET_FOLDERS);
  }

  updateTrack(trackId: string, updates: Partial<Track>): Promise<IPCResponse<Track>> {
    return this.invoke(IPCChannels.LIBRARY_UPDATE_TRACK, { trackId, updates });
  }

  deleteTrack(trackId: string): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.LIBRARY_DELETE_TRACK, trackId);
  }

  play(): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_PLAY); }
  pause(): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_PAUSE); }
  stop(): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_STOP); }
  next(): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_NEXT); }
  previous(): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_PREVIOUS); }
  seek(position: number): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_SEEK, position); }
  setVolume(volume: number): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_SET_VOLUME, volume); }
  setPosition(position: number): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_SET_POSITION, position); }
  setRepeat(mode: 'off' | 'all' | 'one'): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_SET_REPEAT, mode); }
  setShuffle(enabled: boolean): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_SET_SHUFFLE, enabled); }
  getPlayerState(): Promise<IPCResponse<PlayerState>> { return this.invoke(IPCChannels.PLAYER_GET_STATE); }
  addToQueue(trackIds: string[]): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_ADD_TO_QUEUE, trackIds); }
  clearQueue(): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_CLEAR_QUEUE); }
  removeFromQueue(index: number): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_REMOVE_FROM_QUEUE, index); }
  reorderQueue(fromIndex: number, toIndex: number): Promise<IPCResponse<void>> { return this.invoke(IPCChannels.PLAYER_REORDER_QUEUE, { fromIndex, toIndex }); }

  searchYouTube(query: string, options?: { limit?: number; type?: 'video' | 'playlist' }): Promise<IPCResponse<{ videos: YouTubeVideo[]; playlists: YouTubePlaylist[] }>> {
    return this.invoke(IPCChannels.YOUTUBE_SEARCH, { query, ...options });
  }

  getYouTubeVideo(videoId: string): Promise<IPCResponse<YouTubeVideo>> {
    return this.invoke(IPCChannels.YOUTUBE_GET_VIDEO, videoId);
  }

  getYouTubePlaylist(playlistId: string): Promise<IPCResponse<YouTubePlaylist>> {
    return this.invoke(IPCChannels.YOUTUBE_GET_PLAYLIST, playlistId);
  }

  getTrendingVideos(): Promise<IPCResponse<YouTubeVideo[]>> {
    return this.invoke(IPCChannels.YOUTUBE_GET_TRENDING);
  }

  getRecommendedVideos(videoId?: string): Promise<IPCResponse<YouTubeVideo[]>> {
    return this.invoke(IPCChannels.YOUTUBE_GET_RECOMMENDED, videoId);
  }

  getYouTubeStreamUrl(videoId: string): Promise<IPCResponse<{ url: string }>> {
    return this.invoke(IPCChannels.YOUTUBE_STREAM_URL, videoId);
  }

  createPlaylist(name: string, description?: string): Promise<IPCResponse<Playlist>> {
    return this.invoke(IPCChannels.PLAYLIST_CREATE, { name, description });
  }

  updatePlaylist(playlistId: string, updates: Partial<Playlist>): Promise<IPCResponse<Playlist>> {
    return this.invoke(IPCChannels.PLAYLIST_UPDATE, { playlistId, updates });
  }

  deletePlaylist(playlistId: string): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYLIST_DELETE, playlistId);
  }

  addTrackToPlaylist(playlistId: string, trackId: string): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYLIST_ADD_TRACK, { playlistId, trackId });
  }

  removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<IPCResponse<void>> {
    return this.invoke(IPCChannels.PLAYLIST_REMOVE_TRACK, { playlistId, trackId });
  }

  getPlaylistTracks(playlistId: string): Promise<IPCResponse<Track[]>> {
    return this.invoke(IPCChannels.PLAYLIST_GET_TRACKS, playlistId);
  }

  getSettings(): Promise<IPCResponse<AppSettings>> {
    return this.invoke(IPCChannels.SETTINGS_GET);
  }

  setSettings(settings: Partial<AppSettings>): Promise<IPCResponse<AppSettings>> {
    return this.invoke(IPCChannels.SETTINGS_SET, settings);
  }

  minimizeWindow(): void { window.electronAPI.send(IPCChannels.WINDOW_MINIMIZE); }
  maximizeWindow(): void { window.electronAPI.send(IPCChannels.WINDOW_MAXIMIZE); }
  closeWindow(): void { window.electronAPI.send(IPCChannels.WINDOW_CLOSE); }

  onPlayerStateChange(callback: (state: PlayerState) => void): void {
    this.on(IPCChannels.PLAYER_GET_STATE, callback as (...args: unknown[]) => void);
  }

  onLibraryScanProgress(callback: (progress: { current: number; total: number; currentPath: string }) => void): void {
    this.on(IPCChannels.LIBRARY_SCAN, callback as (...args: unknown[]) => void);
  }

  offPlayerStateChange(callback?: (...args: unknown[]) => void): void {
    this.off(IPCChannels.PLAYER_GET_STATE, callback);
  }

  offLibraryScanProgress(callback?: (...args: unknown[]) => void): void {
    this.off(IPCChannels.LIBRARY_SCAN, callback);
  }
}

export const ipcService = new IPCService();
