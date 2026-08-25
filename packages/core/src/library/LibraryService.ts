import type { LibraryScanner, MusicRepository, TrackFilter } from '@chaos-music/contracts';
import { AppError } from '../errors/AppError';

export class LibraryService {
  constructor(
    private readonly repository: MusicRepository,
    private readonly scanner: LibraryScanner,
  ) {}

  initialize() {
    return this.repository.initialize();
  }

  getTracks(filter?: TrackFilter) {
    return this.repository.getTracks(filter);
  }

  getTrack(trackId: string) {
    if (!trackId.trim()) throw new AppError('VALIDATION', 'trackId is required');
    return this.repository.getTrackById(trackId);
  }

  getArtists() {
    return this.repository.getArtists();
  }

  getAlbums(artistId?: string) {
    return this.repository.getAlbums(artistId);
  }

  getGenres() {
    return this.repository.getGenres();
  }

  async search(query: string) {
    const normalized = query.trim();
    if (!normalized) return { tracks: [], artists: [], albums: [] };
    try {
      return await this.repository.search(normalized);
    } catch (error) {
      throw AppError.fromUnknown(error, 'PERSISTENCE_FAILURE');
    }
  }

  getFavorites() {
    return this.repository.getFavorites();
  }

  toggleFavorite(trackId: string) {
    if (!trackId.trim()) throw new AppError('VALIDATION', 'trackId is required');
    return this.repository.toggleFavorite(trackId);
  }

  getRecentlyPlayed(limit?: number) {
    return this.repository.getRecentlyPlayed(limit);
  }

  getLibraries() {
    return this.repository.getLibraries();
  }

  addLibrary(path: string, name?: string) {
    const normalizedPath = path.trim();
    if (!normalizedPath) throw new AppError('VALIDATION', 'Library path is required');
    const fallbackName = normalizedPath.split(/[\\/]/).filter(Boolean).at(-1) ?? 'Nueva Biblioteca';
    return this.repository.addLibrary({ name: name?.trim() || fallbackName, path: normalizedPath });
  }

  updateLibrary(libraryId: string, input: { name?: string; path?: string; isActive?: boolean }) {
    if (!libraryId.trim()) throw new AppError('VALIDATION', 'libraryId is required');
    return this.repository.updateLibrary(libraryId, input);
  }

  removeLibrary(libraryId: string) {
    if (!libraryId.trim()) throw new AppError('VALIDATION', 'libraryId is required');
    return this.repository.removeLibrary(libraryId);
  }

  async scan(libraryId: string) {
    if (!libraryId.trim()) throw new AppError('VALIDATION', 'libraryId is required');
    try {
      return await this.scanner.scan(libraryId);
    } catch (error) {
      throw AppError.fromUnknown(error, 'FILESYSTEM_PERMISSION');
    }
  }

  getScanStatus() {
    return this.scanner.getStatus();
  }

  cancelScan() {
    this.scanner.cancel();
  }
}
