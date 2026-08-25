import type { LibraryScanner, MusicRepository } from '@chaos-music/contracts';
import { LibraryService } from './LibraryService';

const repository = (): jest.Mocked<MusicRepository> => ({
  initialize: jest.fn(),
  getTracks: jest.fn().mockReturnValue({ tracks: [], total: 0 }),
  getTrackById: jest.fn().mockReturnValue(null),
  getArtists: jest.fn().mockReturnValue([]),
  getAlbums: jest.fn().mockReturnValue([]),
  getGenres: jest.fn().mockReturnValue([]),
  search: jest.fn().mockReturnValue({ tracks: [], artists: [], albums: [] }),
  getFavorites: jest.fn().mockReturnValue([]),
  toggleFavorite: jest.fn().mockReturnValue(true),
  getRecentlyPlayed: jest.fn().mockReturnValue([]),
  getLibraries: jest.fn().mockReturnValue([]),
  addLibrary: jest.fn(),
  updateLibrary: jest.fn(),
  removeLibrary: jest.fn().mockReturnValue(true),
});

const scanner = (): jest.Mocked<LibraryScanner> => ({
  scan: jest.fn().mockResolvedValue({ totalFiles: 0, scannedFiles: 0, addedTracks: 0, updatedTracks: 0, removedTracks: 0, errors: [], duration: 0 }),
  getStatus: jest.fn().mockReturnValue({ isScanning: false, progress: 0, currentPath: '', currentFile: '', startTime: null }),
  cancel: jest.fn(),
});

describe('LibraryService', () => {
  it('does not query persistence for blank searches', async () => {
    const repo = repository();
    const service = new LibraryService(repo, scanner());
    await expect(service.search('   ')).resolves.toEqual({ tracks: [], artists: [], albums: [] });
    expect(repo.search).not.toHaveBeenCalled();
  });

  it('derives a library name from its path', async () => {
    const repo = repository();
    repo.addLibrary.mockResolvedValue({ id: '1', name: 'Music', path: '/home/me/Music', isActive: true, createdAt: 'now' });
    const service = new LibraryService(repo, scanner());
    await service.addLibrary('/home/me/Music');
    expect(repo.addLibrary).toHaveBeenCalledWith({ name: 'Music', path: '/home/me/Music' });
  });

  it('normalizes scanner failures', async () => {
    const scan = scanner();
    scan.scan.mockRejectedValue(new Error('denied'));
    const service = new LibraryService(repository(), scan);
    await expect(service.scan('library')).rejects.toMatchObject({ code: 'FILESYSTEM_PERMISSION' });
  });
});
