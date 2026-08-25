import * as fs from 'node:fs/promises';
import { fileScannerService } from '../scanner.service';

const mockDatabaseService = {
  getLibraryById: jest.fn(),
  getAllFilePaths: jest.fn().mockReturnValue([]),
  getTrackByPath: jest.fn(),
  softDeleteTrack: jest.fn(),
  addTrack: jest.fn(),
  updateTrack: jest.fn(),
  updateLibraryLastScan: jest.fn(),
  getExcludedPaths: jest.fn().mockReturnValue([]),
};

jest.mock('../../database/database.service', () => ({ databaseService: mockDatabaseService }));

describe('FileScannerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDatabaseService.getAllFilePaths.mockReturnValue([]);
    mockDatabaseService.getExcludedPaths.mockReturnValue([]);
    mockDatabaseService.getTrackByPath.mockReturnValue(null);
    (fs.stat as jest.Mock).mockResolvedValue({ mtime: new Date(), size: 1024 });
    (fs.readdir as jest.Mock).mockResolvedValue([]);
  });

  it('rechaza una biblioteca inexistente', async () => {
    mockDatabaseService.getLibraryById.mockReturnValue(null);
    await expect(fileScannerService.scanLibrary('missing')).rejects.toThrow('Biblioteca no encontrada');
  });

  it('escanea archivos soportados y persiste pistas nuevas', async () => {
    mockDatabaseService.getLibraryById.mockReturnValue({ id: 'lib-1', name: 'Music', path: '/music', is_active: 1 });
    (fs.readdir as jest.Mock).mockResolvedValue([
      { name: 'song.mp3', isDirectory: () => false, isFile: () => true },
    ]);

    const result = await fileScannerService.scanLibrary('lib-1');

    expect(result.totalFiles).toBe(1);
    expect(result.addedTracks).toBe(1);
    expect(mockDatabaseService.addTrack).toHaveBeenCalledTimes(1);
    expect(mockDatabaseService.updateLibraryLastScan).toHaveBeenCalledWith('lib-1');
  });

  it('marca como eliminadas pistas que ya no existen', async () => {
    mockDatabaseService.getLibraryById.mockReturnValue({ id: 'lib-1', name: 'Music', path: '/music', is_active: 1 });
    mockDatabaseService.getAllFilePaths.mockReturnValue(['/music/deleted.mp3']);

    const result = await fileScannerService.scanLibrary('lib-1');

    expect(result.removedTracks).toBe(1);
    expect(mockDatabaseService.softDeleteTrack).toHaveBeenCalledWith('/music/deleted.mp3');
  });

  it('expone un estado inactivo fuera de un escaneo', () => {
    expect(fileScannerService.getScanStatus().isScanning).toBe(false);
  });

  it.each(['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'opus', 'webm'])(
    'acepta el formato %s',
    async (format) => {
      const result = await fileScannerService.scanFile(`/music/song.${format}`);
      expect(result).not.toBeNull();
    },
  );

  it('rechaza formatos no soportados sin lanzar excepción', async () => {
    await expect(fileScannerService.scanFile('/music/song.xyz')).resolves.toBeNull();
  });
});
