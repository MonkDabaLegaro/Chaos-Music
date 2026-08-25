import type { Album, Artist, Genre, LibraryFolder, MusicRepository, SearchResults, Track, TrackFilter, TrackPage } from '@chaos-music/contracts';

type LegacyTrack = Record<string, unknown>;
type LegacyAlbum = Record<string, unknown>;
type LegacyArtist = Record<string, unknown>;
type LegacyLibrary = Record<string, unknown>;

export interface LegacyDatabase {
  initialize(): void;
  getAllTracks(filter?: Record<string, unknown>): { tracks: LegacyTrack[]; total: number };
  getTrackById(id: string): LegacyTrack | null;
  getAllArtists(): LegacyArtist[];
  getAllAlbums(): LegacyAlbum[];
  getAlbumsByArtist(id: string): LegacyAlbum[];
  getAllGenres(): Array<Record<string, unknown>>;
  search(query: string): { tracks: LegacyTrack[]; artists: LegacyArtist[]; albums: LegacyAlbum[] };
  getFavoriteTracks(): LegacyTrack[];
  toggleFavorite(id: string): boolean;
  getRecentlyPlayedTracks(limit?: number): LegacyTrack[];
  getAllLibraries(): LegacyLibrary[];
  addLibrary(input: Record<string, unknown>): LegacyLibrary;
  updateLibrary(id: string, input: Record<string, unknown>): LegacyLibrary | null;
  deleteLibrary(id: string): boolean;
}

const text = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
const number = (value: unknown, fallback = 0) => typeof value === 'number' ? value : fallback;

export const mapTrack = (row: LegacyTrack): Track => ({
  id: text(row.id),
  title: text(row.title, 'Unknown Track'),
  artist: text(row.artist_name, 'Unknown Artist'),
  album: text(row.album_name) || undefined,
  albumId: text(row.album_id) || undefined,
  duration: number(row.duration),
  filePath: text(row.file_path),
  coverPath: text(row.album_cover) || undefined,
  genre: text(row.genre) || undefined,
  year: typeof row.year === 'number' ? row.year : undefined,
  trackNumber: typeof row.track_number === 'number' ? row.track_number : undefined,
  discNumber: typeof row.disc_number === 'number' ? row.disc_number : undefined,
  playCount: number(row.play_count),
  isFavorite: Boolean(row.is_favorite),
  dateAdded: text(row.date_added),
  lastPlayed: text(row.last_played) || undefined,
  bitrate: typeof row.bitrate === 'number' ? row.bitrate : undefined,
  sampleRate: typeof row.sample_rate === 'number' ? row.sample_rate : undefined,
  format: text(row.format) || undefined,
});

const mapArtist = (row: LegacyArtist): Artist => ({
  id: text(row.id),
  name: text(row.name, 'Unknown Artist'),
  imagePath: text(row.image_path) || undefined,
  bio: text(row.bio) || undefined,
  genres: text(row.genres).split(',').map(value => value.trim()).filter(Boolean),
  trackCount: number(row.track_count),
  albumCount: number(row.album_count),
});

const mapAlbum = (row: LegacyAlbum): Album => ({
  id: text(row.id),
  name: text(row.name, 'Unknown Album'),
  artistId: text(row.artist_id) || undefined,
  artistName: text(row.artist_name) || undefined,
  releaseYear: typeof row.release_year === 'number' ? row.release_year : undefined,
  coverPath: text(row.cover_path) || undefined,
  genre: text(row.genre) || undefined,
  trackCount: number(row.track_count),
});

const mapLibrary = (row: LegacyLibrary): LibraryFolder => ({
  id: text(row.id),
  name: text(row.name),
  path: text(row.path),
  isActive: Boolean(row.is_active),
  lastScan: text(row.last_scan) || undefined,
  createdAt: text(row.created_at),
});

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

  getTrackById(id: string) { const row = this.db.getTrackById(id); return row ? mapTrack(row) : null; }
  getArtists() { return this.db.getAllArtists().map(mapArtist); }
  getAlbums(artistId?: string) { return (artistId ? this.db.getAlbumsByArtist(artistId) : this.db.getAllAlbums()).map(mapAlbum); }
  getGenres(): Genre[] { return this.db.getAllGenres().map(row => ({ id: String(row.id ?? ''), name: text(row.name), trackCount: number(row.track_count) })); }
  search(query: string): SearchResults { const result = this.db.search(query); return { tracks: result.tracks.map(mapTrack), artists: result.artists.map(mapArtist), albums: result.albums.map(mapAlbum) }; }
  getFavorites() { return this.db.getFavoriteTracks().map(mapTrack); }
  toggleFavorite(id: string) { return this.db.toggleFavorite(id); }
  getRecentlyPlayed(limit?: number) { return this.db.getRecentlyPlayedTracks(limit).map(mapTrack); }
  getLibraries() { return this.db.getAllLibraries().map(mapLibrary); }
  addLibrary(input: { name: string; path: string }) { return mapLibrary(this.db.addLibrary({ ...input, scan_depth: -1, file_types: 'mp3,wav,flac,aac,ogg,m4a', is_active: 1 })); }
  updateLibrary(id: string, input: Partial<Pick<LibraryFolder, 'name' | 'path' | 'isActive'>>) { const row = this.db.updateLibrary(id, { name: input.name, path: input.path, is_active: input.isActive === undefined ? undefined : Number(input.isActive) }); return row ? mapLibrary(row) : Promise.reject(new Error(`Library ${id} not found`)); }
  removeLibrary(id: string) { return this.db.deleteLibrary(id); }
}
