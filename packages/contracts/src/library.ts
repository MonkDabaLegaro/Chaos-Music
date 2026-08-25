import type { Album, Artist, Genre, LibraryFolder, SearchResults, Track, TrackFilter, TrackPage } from './media';

export interface ScanError {
  file: string;
  error: string;
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

export interface ScanStatus {
  isScanning: boolean;
  progress: number;
  currentPath: string;
  currentFile: string;
  startTime: number | null;
}

export interface MusicRepository {
  initialize(): void | Promise<void>;
  getTracks(filter?: TrackFilter): TrackPage | Promise<TrackPage>;
  getTrackById(trackId: string): Track | null | Promise<Track | null>;
  getArtists(): Artist[] | Promise<Artist[]>;
  getAlbums(artistId?: string): Album[] | Promise<Album[]>;
  getGenres(): Genre[] | Promise<Genre[]>;
  search(query: string): SearchResults | Promise<SearchResults>;
  getFavorites(): Track[] | Promise<Track[]>;
  toggleFavorite(trackId: string): boolean | Promise<boolean>;
  getRecentlyPlayed(limit?: number): Track[] | Promise<Track[]>;
  getLibraries(): LibraryFolder[] | Promise<LibraryFolder[]>;
  addLibrary(input: { name: string; path: string }): LibraryFolder | Promise<LibraryFolder>;
  updateLibrary(libraryId: string, input: Partial<Pick<LibraryFolder, 'name' | 'path' | 'isActive'>>): LibraryFolder | Promise<LibraryFolder>;
  removeLibrary(libraryId: string): boolean | Promise<boolean>;
}

export interface LibraryScanner {
  scan(libraryId: string): Promise<ScanResult>;
  getStatus(): ScanStatus;
  cancel(): void;
}
