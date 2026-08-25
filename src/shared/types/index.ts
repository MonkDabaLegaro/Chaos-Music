// Track types
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumId?: string;
  duration: number;
  filePath: string;
  coverPath?: string;
  genre?: string;
  year?: number;
  trackNumber?: number;
  discNumber?: number;
  playCount: number;
  isFavorite: boolean;
  dateAdded: string;
  lastPlayed?: string;
}

// Artist types
export interface Artist {
  id: string;
  name: string;
  imagePath?: string;
  bio?: string;
  genres: string[];
  trackCount: number;
  albumCount: number;
}

// Album types
export interface Album {
  id: string;
  name: string;
  artistId: string;
  artistName?: string;
  releaseYear?: number;
  coverPath?: string;
  genre?: string;
  trackCount: number;
}

// Playlist types
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverPath?: string;
  isSmart: boolean;
  isSystem: boolean;
  trackCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistTrack {
  playlistId: string;
  trackId: string;
  position: number;
  addedAt: string;
}

// Player types
export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  position: number;
  volume: number;
  repeatMode: 'off' | 'all' | 'one';
  shuffle: boolean;
}

// YouTube types
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  duration: number;
  viewCount: number;
  publishedAt: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
  channelTitle: string;
}

// Library types
export interface LibraryFolder {
  id: string;
  path: string;
  name: string;
  addedAt: string;
}

export interface LibraryStats {
  totalTracks: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
  totalDuration: number;
  totalSize: number;
}

// Settings types
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  audioOutput: string;
  volume: number;
  startWithSystem: boolean;
  minimizeToTray: boolean;
  scanOnStartup: boolean;
}


// IPC Response types
export interface IPCResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Search types
export interface SearchResult {
  id: string;
  type: 'track' | 'album' | 'artist' | 'playlist' | 'youtube-video';
  title: string;
  subtitle?: string;
  imageUrl?: string;
  track?: Track;
  album?: Album;
  artist?: Artist;
  playlist?: Playlist;
  youtubeVideo?: YouTubeVideo;
}

export interface SearchFilters {
  tracks: boolean;
  albums: boolean;
  artists: boolean;
  playlists: boolean;
  youtube: boolean;
}

// Queue types
export interface QueueItem {
  id: string;
  track: Track;
  position: number;
  addedAt: string;
}

// Genre types
export interface Genre {
  id: string;
  name: string;
  trackCount: number;
  imagePath?: string;
}

// Recently played types
export interface RecentlyPlayed {
  id: string;
  trackId: string;
  track: Track;
  playedAt: string;
}

// Recently added types
export interface RecentlyAdded {
  id: string;
  trackId: string;
  track: Track;
  addedAt: string;
}

// UI types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface Dialog {
  id: string;
  type: 'confirm' | 'alert' | 'custom';
  title: string;
  message?: string;
  component?: unknown;
  props?: Record<string, unknown>;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  onPrimary: string;
  onSecondary: string;
  onBackground: string;
  onSurface: string;
  onSurfaceVariant: string;
  error: string;
  onError: string;
}

// Keyboard shortcut types
export interface KeyboardShortcut {
  id: string;
  key: string;
  modifiers: ('ctrl' | 'shift' | 'alt' | 'meta')[];
  action: string;
  description: string;
}

// Featured types
export interface FeaturedContent {
  id: string;
  type: 'album' | 'playlist' | 'artist';
  title: string;
  subtitle?: string;
  imageUrl: string;
  data: Album | Playlist | Artist;
}

// Recommended types
export interface RecommendedContent {
  type: 'genre' | 'artist' | 'album';
  title: string;
  items: (Genre | Artist | Album)[];
}

