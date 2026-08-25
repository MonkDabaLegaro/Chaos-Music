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
  bitrate?: number;
  sampleRate?: number;
  format?: string;
}

export interface Artist {
  id: string;
  name: string;
  imagePath?: string;
  bio?: string;
  genres: string[];
  trackCount: number;
  albumCount: number;
}

export interface Album {
  id: string;
  name: string;
  artistId?: string;
  artistName?: string;
  releaseYear?: number;
  coverPath?: string;
  genre?: string;
  trackCount: number;
}

export interface Genre {
  id: string;
  name: string;
  trackCount: number;
}

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

export interface LibraryFolder {
  id: string;
  name: string;
  path: string;
  isActive: boolean;
  lastScan?: string;
  createdAt: string;
}

export interface TrackFilter {
  artistId?: string;
  albumId?: string;
  genre?: string;
  favoriteOnly?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface TrackPage {
  tracks: Track[];
  total: number;
}

export interface SearchResults {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
}
