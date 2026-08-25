import type { Album, Artist, Genre, LibraryFolder, MusicRepository, SearchResults, Track, TrackFilter, TrackPage } from '@chaos-music/contracts';

type LegacyRow = Record<string, unknown>;

export interface LegacyDatabase {
  initialize(): void;
  getAllTracks(filter?: Record<string, unknown>): { tracks: unknown[]; total: number };
  getTrackById(id: string): unknown | null;
  getAllArtists(): unknown[];
  getAllAlbums(): unknown[];
  getAlbumsByArtist(id: string): unknown[];
  getAllGenres(): unknown[];
  search(query: string): { tracks: unknown[]; artists: unknown[]; albums: unknown[] };
  getFavoriteTracks(): unknown[];
  toggleFavorite(id: string): boolean;
  getRecentlyPlayedTracks(limit?: number): unknown[];
  getAllLibraries(): unknown[];
  addLibrary(input: Record<string, unknown>): unknown;
  updateLibrary(id: string, input: Record<string, unknown>): unknown | null;
  deleteLibrary(id: string): boolean;
}

const row = (value: unknown): LegacyRow =>
  typeof value === 'object' && value !== null ? value as LegacyRow : {};
const text = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
const number = (value: unknown, fallback = 0) => typeof value === 'number' ? value : fallback;

export const mapTrack = (value: unknown): Track => {
  const data = row(value);
  return {
    id: text(data.id),
    title: text(data.title, 'Unknown Track'),
    artist: text(data.artist_name, 'Unknown Artist'),
    album: text(data.album_name) || undefined,
    albumId: text(data.album_id) || undefined,
    duration: number(data.duration),
    filePath: text(data.file_path),
    coverPath: text(data.album_cover) || undefined,
    genre: text(data.genre) || undefined,
    year: typeof data.year === 'number' ? data.year : undefined,
    trackNumber: typeof data.track_number === 'number' ? data.track_number : undefined,
    discNumber: typeof data.disc_number === 'number' ? data.disc_number : undefined,
    playCount: number(data.play_count),
    isFavorite: Boolean(data.is_favorite),
    dateAdded: text(data.date_added),
    lastPlayed: text(data.last_played) || undefined,
    bitrate: typeof data.bitrate === 'number' ? data.bitrate : undefined,
    sampleRate: typeof data.sample_rate === 'number' ? data.sample_rate : undefined,
    format: text(data.format) || undefined,
  };
};

const mapArtist = (value: unknown): Artist => {
  const data = row(value);
  return {
    id: text(data.id),
    name: text(data.name, 'Unknown Artist'),
    imagePath: text(data.image_path) || undefined,
    bio: text(data.bio) || undefined,
    genres: text(data.genres).split(',').map(item => item.trim()).filter(Boolean),
    trackCount: number(data.track_count),
    albumCount: number(data.album_count),
  };
};

const mapAlbum = (value: unknown): Album => {
  const data = row(value);
  return {
    id: text(data.id),
    name: text(data.name, 'Unknown Album'),
    artistId: text(data.artist_id) || undefined,
    artistName: text(data.artist_name) || undefined,
    releaseYear: typeof data.release_year === 'number' ? data.release_year : undefined,
    coverPath: text(data.cover_path) || undefined,
    genre: text(data.genre) || undefined,
    trackCount: number(data.track_count),
  };
};

const mapLibrary = (value: unknown): LibraryFolder => {
  const data = row(value);
  return {
    id: text(data.id),
    name: text(data.name),
    path: text(data.path),
    isActive: Boolean(data.is_active),
    lastScan: text(data.last_scan) || undefined,
    createdAt: text(data.created_at),
  };
};

export class LegacyMusicRepositoryAdapter implements MusicRepository {
  constructor(private readonly db: LegacyDatabase) {}

  initialize() { this.db.initialize(); }

  getTracks(filter?: TrackFilter): TrackPage {
    const result = this.db.getAllTracks(filter ? {
      artist_id: filter.artistId,
      album_id: filter.albumId,
      genre: filter.genre,
      is_favorite: filter.favoriteOnly === undefined ? undefined : Number(filter.favoriteOnly),
      search: filter.search,
      limit: filter.limit,
      offset: filter.offset,
      order_by: filter.orderBy,
      order_dir: filter.orderDirection,
    } : undefined);
    return { tracks: result.tracks.map(mapTrack), total: result.total };
  }

  getTrackById(id: string) { const value = this.db.getTrackById(id); return value ? mapTrack(value) : null; }
  getArtists() { return this.db.getAllArtists().map(mapArtist); }
  getAlbums(artistId?: string) { return (artistId ? this.db.getAlbumsByArtist(artistId) : this.db.getAllAlbums()).map(mapAlbum); }
  getGenres(): Genre[] { return this.db.getAllGenres().map(value => { const data = row(value); return { id: String(data.id ?? ''), name: text(data.name), trackCount: number(data.track_count) }; }); }
  search(query: string): SearchResults { const result = this.db.search(query); return { tracks: result.tracks.map(mapTrack), artists: result.artists.map(mapArtist), albums: result.albums.map(mapAlbum) }; }
  getFavorites() { return this.db.getFavoriteTracks().map(mapTrack); }
  toggleFavorite(id: string) { return this.db.toggleFavorite(id); }
  getRecentlyPlayed(limit?: number) { return this.db.getRecentlyPlayedTracks(limit).map(mapTrack); }
  getLibraries() { return this.db.getAllLibraries().map(mapLibrary); }
  addLibrary(input: { name: string; path: string }) { return mapLibrary(this.db.addLibrary({ ...input, scan_depth: -1, file_types: 'mp3,wav,flac,aac,ogg,m4a', is_active: 1 })); }
  updateLibrary(id: string, input: Partial<Pick<LibraryFolder, 'name' | 'path' | 'isActive'>>) { const value = this.db.updateLibrary(id, { name: input.name, path: input.path, is_active: input.isActive === undefined ? undefined : Number(input.isActive) }); return value ? mapLibrary(value) : Promise.reject(new Error(`Library ${id} not found`)); }
  removeLibrary(id: string) { return this.db.deleteLibrary(id); }
}
