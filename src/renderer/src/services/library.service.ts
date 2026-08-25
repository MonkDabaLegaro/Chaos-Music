import type { Album, Artist, Genre, LibraryFolder, LibraryStats, Playlist, RecentlyAdded, RecentlyPlayed, Track } from '../../../shared/types';
import { ipcService } from './ipc.service';

export interface LibraryService {
  scanLibrary: (folderPath: string) => Promise<{ trackCount: number }>;
  getTracks: (options?: { artistId?: string; albumId?: string; genre?: string; limit?: number; offset?: number }) => Promise<Track[]>;
  getAlbums: (options?: { artistId?: string; genre?: string; limit?: number; offset?: number }) => Promise<Album[]>;
  getArtists: (options?: { genre?: string; limit?: number; offset?: number }) => Promise<Artist[]>;
  getGenres: () => Promise<Genre[]>;
  getPlaylists: () => Promise<Playlist[]>;
  getRecentlyAdded: (limit?: number) => Promise<RecentlyAdded[]>;
  getRecentlyPlayed: (limit?: number) => Promise<RecentlyPlayed[]>;
  getStats: () => Promise<LibraryStats>;
  addFolder: (path: string, name: string) => Promise<LibraryFolder>;
  removeFolder: (folderId: string) => Promise<void>;
  getFolders: () => Promise<LibraryFolder[]>;
  updateTrack: (trackId: string, updates: Partial<Track>) => Promise<Track>;
  deleteTrack: (trackId: string) => Promise<void>;
  getFavorites: () => Promise<Track[]>;
  toggleFavorite: (trackId: string) => Promise<Track>;
  search: (query: string, filters?: { tracks?: boolean; albums?: boolean; artists?: boolean }) => Promise<{
    tracks: Track[];
    albums: Album[];
    artists: Artist[];
  }>;
}

class LibraryServiceImpl implements LibraryService {
  async scanLibrary(folderPath: string): Promise<{ trackCount: number }> {
    const response = await ipcService.scanLibrary(folderPath);
    if (!response.success) {
      throw new Error(response.error || 'Failed to scan library');
    }
    return response.data!;
  }

  async getTracks(options?: { artistId?: string; albumId?: string; genre?: string; limit?: number; offset?: number }): Promise<Track[]> {
    const response = await ipcService.getTracks(options);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get tracks');
    }
    return response.data || [];
  }

  async getAlbums(options?: { artistId?: string; genre?: string; limit?: number; offset?: number }): Promise<Album[]> {
    const response = await ipcService.getAlbums(options);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get albums');
    }
    return response.data || [];
  }

  async getArtists(options?: { genre?: string; limit?: number; offset?: number }): Promise<Artist[]> {
    const response = await ipcService.getArtists(options);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get artists');
    }
    return response.data || [];
  }

  async getGenres(): Promise<Genre[]> {
    const response = await ipcService.getGenres();
    if (!response.success) {
      throw new Error(response.error || 'Failed to get genres');
    }
    return response.data || [];
  }

  async getPlaylists(): Promise<Playlist[]> {
    const response = await ipcService.getPlaylists();
    if (!response.success) {
      throw new Error(response.error || 'Failed to get playlists');
    }
    return response.data || [];
  }

  async getRecentlyAdded(limit?: number): Promise<RecentlyAdded[]> {
    const response = await ipcService.getRecentlyAdded(limit);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get recently added');
    }
    return response.data || [];
  }

  async getRecentlyPlayed(limit?: number): Promise<RecentlyPlayed[]> {
    const response = await ipcService.getRecentlyPlayed(limit);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get recently played');
    }
    return response.data || [];
  }

  async getStats(): Promise<LibraryStats> {
    const response = await ipcService.getLibraryStats();
    if (!response.success) {
      throw new Error(response.error || 'Failed to get library stats');
    }
    return response.data!;
  }

  async addFolder(path: string, name: string): Promise<LibraryFolder> {
    const response = await ipcService.addLibraryFolder(path, name);
    if (!response.success) {
      throw new Error(response.error || 'Failed to add folder');
    }
    return response.data!;
  }

  async removeFolder(folderId: string): Promise<void> {
    const response = await ipcService.removeLibraryFolder(folderId);
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove folder');
    }
  }

  async getFolders(): Promise<LibraryFolder[]> {
    const response = await ipcService.getLibraryFolders();
    if (!response.success) {
      throw new Error(response.error || 'Failed to get folders');
    }
    return response.data || [];
  }

  async updateTrack(trackId: string, updates: Partial<Track>): Promise<Track> {
    const response = await ipcService.updateTrack(trackId, updates);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update track');
    }
    return response.data!;
  }

  async deleteTrack(trackId: string): Promise<void> {
    const response = await ipcService.deleteTrack(trackId);
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete track');
    }
  }

  async getFavorites(): Promise<Track[]> {
    return this.getTracks({ limit: 100 });
  }

  async toggleFavorite(trackId: string): Promise<Track> {
    const tracks = await this.getTracks();
    const track = tracks.find(t => t.id === trackId);
    if (!track) {
      throw new Error('Track not found');
    }
    return this.updateTrack(trackId, { isFavorite: !track.isFavorite });
  }

  async search(query: string, filters?: { tracks?: boolean; albums?: boolean; artists?: boolean }): Promise<{
    tracks: Track[];
    albums: Album[];
    artists: Artist[];
  }> {
    const [tracksResponse, albumsResponse, artistsResponse] = await Promise.all([
      filters?.tracks !== false ? ipcService.getTracks({ limit: 20 }) : Promise.resolve({ success: true, data: [] }),
      filters?.albums !== false ? ipcService.getAlbums({ limit: 20 }) : Promise.resolve({ success: true, data: [] }),
      filters?.artists !== false ? ipcService.getArtists({ limit: 20 }) : Promise.resolve({ success: true, data: [] }),
    ]);

    const tracks = (tracksResponse.data || []).filter(t => 
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase())
    );
    const albums = (albumsResponse.data || []).filter(a => 
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.artistName?.toLowerCase().includes(query.toLowerCase())
    );
    const artists = (artistsResponse.data || []).filter(a => 
      a.name.toLowerCase().includes(query.toLowerCase())
    );

    return { tracks, albums, artists };
  }
}

export const libraryService = new LibraryServiceImpl();
