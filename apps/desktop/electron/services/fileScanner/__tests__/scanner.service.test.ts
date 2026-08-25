/**
 * Pruebas Unitarias para FileScannerService
 */

import * as crypto from 'node:crypto';
import * as fs from 'node:fs/promises';

// Mock de los módulos
jest.mock('node:crypto');
jest.mock('node:fs/promises');

describe('FileScannerService', () => {
  let fileScannerService: typeof import('../scanner.service').fileScannerService;
  let mockDatabaseService: jest.Mocked<{
    getLibraryById: jest.Mock;
    getAllFilePaths: jest.Mock;
    getTrackByPath: jest.Mock;
    softDeleteTrack: jest.Mock;
    addTrack: jest.Mock;
    updateTrack: jest.Mock;
    updateLibraryLastScan: jest.Mock;
    getExcludedPaths: jest.Mock;
  }>;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Mock de crypto
    (crypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('mock-file-hash'),
    });

    // Mock de fs
    (fs.readdir as jest.Mock).mockResolvedValue([]);
    (fs.stat as jest.Mock).mockResolvedValue({
      mtime: new Date(),
      size: 1024,
    });
    (fs.open as jest.Mock).mockResolvedValue({
      read: jest.fn().mockResolvedValue({ bytesRead: 0 }),
      close: jest.fn().mockResolvedValue(undefined),
    });
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

    // Mock del servicio de base de datos
    mockDatabaseService = {
      getLibraryById: jest.fn(),
      getAllFilePaths: jest.fn().mockReturnValue([]),
      getTrackByPath: jest.fn(),
      softDeleteTrack: jest.fn(),
      addTrack: jest.fn(),
      updateTrack: jest.fn(),
      updateLibraryLastScan: jest.fn(),
      getExcludedPaths: jest.fn().mockReturnValue([]),
    };

    // Mock del servicio de base de datos
    jest.mock('../database/database.service', () => ({
      databaseService: mockDatabaseService,
    }));

    // Importar el servicio después de hacer los mocks
    fileScannerService = require('../scanner.service').fileScannerService;
  });

  describe('scanLibrary', () => {
    it('debería escanear una biblioteca correctamente', async () => {
      const mockLibrary = {
        id: 'lib-123',
        name: 'Test Library',
        path: '/music',
        is_active: 1,
      };

      mockDatabaseService.getLibraryById.mockReturnValue(mockLibrary);

      // Mock de archivos encontrados
      (fs.readdir as jest.Mock).mockResolvedValue([
        { name: 'song1.mp3', isDirectory: () => false, isFile: () => true },
      ]);

      const result = await fileScannerService.scanLibrary('lib-123');

      expect(result).toBeDefined();
      expect(result.totalFiles).toBe(1);
      expect(mockDatabaseService.updateLibraryLastScan).toHaveBeenCalledWith('lib-123');
    });

    it('debería lanzar error si la biblioteca no existe', async () => {
      mockDatabaseService.getLibraryById.mockReturnValue(null);

      await expect(fileScannerService.scanLibrary('non-existent')).rejects.toThrow(
        'Biblioteca no encontrada'
      );
    });

    it('debería detectar archivos eliminados', async () => {
      const mockLibrary = {
        id: 'lib-123',
        name: 'Test Library',
        path: '/music',
        is_active: 1,
      };

      mockDatabaseService.getLibraryById.mockReturnValue(mockLibrary);
      mockDatabaseService.getAllFilePaths.mockReturnValue(['/music/deleted-song.mp3']);
      (fs.readdir as jest.Mock).mockResolvedValue([]);

      await fileScannerService.scanLibrary('lib-123');

      expect(mockDatabaseService.softDeleteTrack).toHaveBeenCalledWith('/music/deleted-song.mp3');
    });

    it('debería procesar archivos nuevos correctamente', async () => {
      const mockLibrary = {
        id: 'lib-123',
        name: 'Test Library',
        path: '/music',
        is_active: 1,
      };

      mockDatabaseService.getLibraryById.mockReturnValue(mockLibrary);
      mockDatabaseService.getAllFilePaths.mockReturnValue([]);
      mockDatabaseService.getTrackByPath.mockReturnValue(null);

      (fs.readdir as jest.Mock).mockResolvedValue([
        { name: 'new-song.mp3', isDirectory: () => false, isFile: () => true },
      ]);

      const result = await fileScannerService.scanLibrary('lib-123');

      expect(result.addedTracks).toBe(1);
      expect(mockDatabaseService.addTrack).toHaveBeenCalled();
    });

    it('debería actualizar archivos modificados', async () => {
      const mockLibrary = {
        id: 'lib-123',
        name: 'Test Library',
        path: '/music',
        is_active: 1,
      };

      const existingTrack = {
        id: 'track-123',
        file_hash: 'old-hash',
      };

      mockDatabaseService.getLibraryById.mockReturnValue(mockLibrary);
      mockDatabaseService.getAllFilePaths.mockReturnValue([]);
      mockDatabaseService.getTrackByPath.mockReturnValue(existingTrack);

      (fs.readdir as jest.Mock).mockResolvedValue([
        { name: 'modified-song.mp3', isDirectory: () => false, isFile: () => true },
      ]);

      const result = await fileScannerService.scanLibrary('lib-123');

      expect(result.updatedTracks).toBe(1);
      expect(mockDatabaseService.updateTrack).toHaveBeenCalled();
    });

    it('debería manejar errores durante el escaneo', async () => {
      const mockLibrary = {
        id: 'lib-123',
        name: 'Test Library',
        path: '/music',
        is_active: 1,
      };

      mockDatabaseService.getLibraryById.mockReturnValue(mockLibrary);
      (fs.readdir as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const result = await fileScannerService.scanLibrary('lib-123');

      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('cancelScan', () => {
    it('debería cancelar el escaneo en progreso', async () => {
      const mockLibrary = {
        id: 'lib-123',
        name: 'Test Library',
        path: '/music',
        is_active: 1,
      };

      mockDatabaseService.getLibraryById.mockReturnValue(mockLibrary);
      (fs.readdir as jest.Mock).mockResolvedValue([
        { name: 'song1.mp3', isDirectory: () => false, isFile: () => true },
        { name: 'song2.mp3', isDirectory: () => false, isFile: () => true },
      ]);

      // Iniciar escaneo en background
      const scanPromise = fileScannerService.scanLibrary('lib-123');

      // Cancelar después de un tick
      fileScannerService.cancelScan();

      const result = await scanPromise;

      expect(result.scannedFiles).toBeLessThan(2);
    });
  });

  describe('getScanStatus', () => {
    it('debería retornar el estado del escaneo', () => {
      const status = fileScannerService.getScanStatus();

      expect(status).toBeDefined();
      expect(status.isScanning).toBe(false);
    });
  });

  describe('onProgress', () => {
    it('debería configurar el callback de progreso', () => {
      const callback = jest.fn();
      fileScannerService.onProgress(callback);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('scanFile', () => {
    it('debería escanear un archivo individual', async () => {
      (fs.stat as jest.Mock).mockResolvedValue({
        mtime: new Date(),
        size: 1024,
      });

      const result = await fileScannerService.scanFile('/music/song.mp3');

      expect(result).toBeDefined();
      expect(result?.title).toBe('song');
      expect(result?.file_path).toBe('/music/song.mp3');
    });

    it('debería retornar null para formato no soportado', async () => {
      const result = await fileScannerService.scanFile('/music/song.xyz');

      expect(result).toBeNull();
    });

    it('debería manejar errores al escanear archivo', async () => {
      (fs.stat as jest.Mock).mockRejectedValue(new Error('File not found'));

      const result = await fileScannerService.scanFile('/music/nonexistent.mp3');

      expect(result).toBeNull();
    });
  });

  describe('supported formats', () => {
    const supportedFormats = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'opus', 'webm'];

    it.each(supportedFormats)('debería soportar formato %s', async (format) => {
      (fs.stat as jest.Mock).mockResolvedValue({
        mtime: new Date(),
        size: 1024,
      });

      const result = await fileScannerService.scanFile(`/music/song.${format}`);

      expect(result).toBeDefined();
    });
  });
});
