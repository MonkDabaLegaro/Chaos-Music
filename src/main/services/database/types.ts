/**
 * Tipos para el servicio de base de datos
 */

// Entidades principales
export interface Artist {
  id: string;
  name: string;
  image_path?: string;
  bio?: string;
  genres?: string;
  created_at: string;
  updated_at: string;
}

export interface Album {
  id: string;
  name: string;
  artist_id?: string;
  release_year?: number;
  cover_path?: string;
  genre?: string;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  title: string;
  artist_id?: string;
  album_id?: string;
  file_path: string;
  duration: number;
  track_number?: number;
  disc_number?: number;
  file_size?: number;
  bitrate?: number;
  sample_rate?: number;
  format?: string;
  genre?: string;
  year?: number;
  date_added: string;
  last_played?: string;
  play_count: number;
  is_favorite: number;
  lyrics?: string;
  file_hash?: string;
}

export interface Genre {
  id: number;
  name: string;
  track_count: number;
}

export interface Library {
  id: string;
  name: string;
  path: string;
  scan_depth: number;
  file_types: string;
  is_active: number;
  last_scan?: string;
  created_at: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  cover_path?: string;
  is_smart: number;
  is_system: number;
  created_at: string;
  updated_at: string;
  sort_order?: string;
}

export interface PlaylistTrack {
  playlist_id: string;
  track_id: string;
  position: number;
  added_at: string;
}

export interface PlaybackHistory {
  id: number;
  track_id: string;
  started_at: string;
  completed: number;
  progress: number;
}

export interface RecentlyPlayed {
  track_id: string;
  last_played: string;
  play_count: number;
}

export interface PlayQueueItem {
  id: number;
  track_id: string;
  position: number;
  source_type?: string;
  source_id?: string;
  added_at: string;
}

export interface Setting {
  key: string;
  value: string;
  updated_at: string;
}

export interface ExcludedPath {
  id: number;
  path: string;
}

// Tipos para consultas y filtros
export interface TrackFilter {
  artist_id?: string;
  album_id?: string;
  genre?: string;
  is_favorite?: number;
  search?: string;
  limit?: number;
  offset?: number;
  order_by?: string;
  order_dir?: 'ASC' | 'DESC';
}

export interface ScanResult {
  totalFiles: number;
  scannedFiles: number;
  addedTracks: number;
  updatedTracks: number;
  removedTracks: number;
  errors: ScanError[];
  duration: number;
}

export interface ScanError {
  file: string;
  error: string;
}

export interface ScanProgress {
  current: number;
  total: number;
  currentFile: string;
}

export interface ScanStatus {
  isScanning: boolean;
  progress: number;
  currentPath: string;
  currentFile: string;
  startTime: number | null;
}

// Tipos para resultados extendidos
export interface TrackWithDetails extends Track {
  artist_name?: string;
  album_name?: string;
  album_cover?: string;
}

export interface AlbumWithDetails extends Album {
  artist_name?: string;
  track_count: number;
}

export interface ArtistWithDetails extends Artist {
  track_count: number;
  album_count: number;
}

export interface PlaylistWithDetails extends Playlist {
  track_count: number;
  total_duration: number;
}

// Tipos para estadísticas
export interface LibraryStats {
  total_tracks: number;
  total_artists: number;
  total_albums: number;
  total_genres: number;
  total_playlists: number;
  total_duration: number;
  total_size: number;
  last_scan?: string;
}

// Tipos de respuesta IPC
export interface ScanResponse {
  success: boolean;
  result?: ScanResult;
  error?: string;
}

export interface TracksResponse {
  success: boolean;
  tracks?: TrackWithDetails[];
  total?: number;
  error?: string;
}

export interface ArtistsResponse {
  success: boolean;
  artists?: ArtistWithDetails[];
  total?: number;
  error?: string;
}

export interface AlbumsResponse {
  success: boolean;
  albums?: AlbumWithDetails[];
  total?: number;
  error?: string;
}

export interface SearchResponse {
  success: boolean;
  tracks?: TrackWithDetails[];
  artists?: ArtistWithDetails[];
  albums?: AlbumWithDetails[];
  error?: string;
}
