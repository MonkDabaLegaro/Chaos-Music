/**
 * Pruebas Unitarias para DatabaseService
 */

import Database from 'better-sqlite3';

// Mock de better-sqlite3
jest.mock('better-sqlite3');

describe('DatabaseService', () => {
  let databaseService: typeof import('../database.service').databaseService;
  let mockDb: jest.Mocked<Database.Database>;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Crear mock de la base de datos
    mockDb = {
      pragma: jest.fn(),
      exec: jest.fn(),
      prepare: jest.fn().mockReturnValue({
        run: jest.fn().mockReturnValue({ changes: 1 }),
        get: jest.fn().mockReturnValue(null),
        all: jest.fn().mockReturnValue([]),
      }),
      close: jest.fn(),
    } as unknown as jest.Mocked<Database.Database>;

    (Database as jest.MockedClass<typeof Database>).mockImplementation(() => mockDb);

    // Importar el servicio después de hacer los mocks
    databaseService = require('../database.service').databaseService;
  });

  describe('initialize', () => {
    it('debería inicializar la base de datos correctamente', () => {
      databaseService.initialize();

      expect(Database).toHaveBeenCalled();
      expect(mockDb.pragma).toHaveBeenCalledWith('journal_mode = WAL');
      expect(mockDb.exec).toHaveBeenCalled();
    });

    it('no debería inicializar twice si ya está inicializada', () => {
      databaseService.initialize();
      databaseService.initialize();

      expect(Database).toHaveBeenCalledTimes(1);
    });
  });

  describe('addArtist', () => {
    it('debería agregar un artista correctamente', () => {
      const artistData = {
        name: 'Test Artist',
        image_path: '/path/to/image.jpg',
        bio: 'Test bio',
        genres: 'Rock,Pop',
      };

      mockDb.prepare.mockReturnValueOnce({
        run: jest.fn(),
        get: jest.fn().mockReturnValue({
          id: 'mock-uuid',
          ...artistData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });

      const result = databaseService.addArtist(artistData);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Artist');
    });
  });

  describe('getArtistById', () => {
    it('debería obtener un artista por ID', () => {
      const mockArtist = {
        id: 'artist-123',
        name: 'Test Artist',
        image_path: null,
        bio: null,
        genres: 'Rock',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockDb.prepare.mockReturnValueOnce({
        get: jest.fn().mockReturnValue(mockArtist),
      });

      const result = databaseService.getArtistById('artist-123');

      expect(result).toEqual(mockArtist);
    });

    it('debería retornar null si no encuentra el artista', () => {
      mockDb.prepare.mockReturnValueOnce({
        get: jest.fn().mockReturnValue(null),
      });

      const result = databaseService.getArtistById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('addAlbum', () => {
    it('debería agregar un álbum correctamente', () => {
      const albumData = {
        name: 'Test Album',
        artist_id: 'artist-123',
        release_year: 2024,
        cover_path: '/path/to/cover.jpg',
        genre: 'Rock',
      };

      mockDb.prepare.mockReturnValueOnce({
        run: jest.fn(),
        get: jest.fn().mockReturnValue({
          id: 'mock-uuid',
          ...albumData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });

      const result = databaseService.addAlbum(albumData);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Album');
    });
  });

  describe('addTrack', () => {
    it('debería agregar una pista correctamente', () => {
      const trackData = {
        title: 'Test Track',
        artist_id: 'artist-123',
        album_id: 'album-123',
        file_path: '/path/to/track.mp3',
        duration: 180,
        track_number: 1,
        disc_number: 1,
        file_size: 1024000,
        bitrate: 320,
        sample_rate: 44100,
        format: 'MP3',
        genre: 'Rock',
        year: 2024,
        play_count: 0,
        is_favorite: 0,
        lyrics: null,
        file_hash: 'abc123',
      };

      mockDb.prepare.mockReturnValueOnce({
        run: jest.fn(),
        get: jest.fn().mockReturnValue({
          id: 'mock-uuid',
          ...trackData,
          date_added: new Date().toISOString(),
        }),
      });

      const result = databaseService.addTrack(trackData);

      expect(result).toBeDefined();
      expect(result.title).toBe('Test Track');
    });
  });

  describe('getAllTracks', () => {
    it('debería obtener todas las pistas con filtros opcionales', () => {
      const mockTracks = {
        tracks: [
          {
            id: 'track-1',
            title: 'Track 1',
            artist_name: 'Artist 1',
            album_name: 'Album 1',
            album_cover: '/cover.jpg',
          },
        ],
        total: 1,
      };

      mockDb.prepare
        .mockReturnValueOnce({
          get: jest.fn().mockReturnValue({ total: 1 }),
        })
        .mockReturnValueOnce({
          all: jest.fn().mockReturnValue(mockTracks.tracks),
        });

      const result = databaseService.getAllTracks({ limit: 10 });

      expect(result).toEqual(mockTracks);
    });

    it('debería aplicar filtros de búsqueda', () => {
      mockDb.prepare
        .mockReturnValueOnce({
          get: jest.fn().mockReturnValue({ total: 0 }),
        })
        .mockReturnValueOnce({
          all: jest.fn().mockReturnValue([]),
        });

      databaseService.getAllTracks({ search: 'test' });

      const prepareCall = mockDb.prepare.mock.calls[1];
      expect(prepareCall[0]).toContain('LIKE');
    });
  });

  describe('getAllArtists', () => {
    it('debería obtener todos los artistas con detalles', () => {
      const mockArtists = [
        {
          id: 'artist-1',
          name: 'Artist 1',
          image_path: null,
          bio: null,
          genres: 'Rock',
          track_count: 10,
          album_count: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      mockDb.prepare.mockReturnValueOnce({
        all: jest.fn().mockReturnValue(mockArtists),
      });

      const result = databaseService.getAllArtists();

      expect(result).toEqual(mockArtists);
      expect(result[0].track_count).toBe(10);
    });
  });

  describe('getAllAlbums', () => {
    it('debería obtener todos los álbumes con detalles', () => {
      const mockAlbums = [
        {
          id: 'album-1',
          name: 'Album 1',
          artist_id: 'artist-1',
          artist_name: 'Artist 1',
          release_year: 2024,
          cover_path: '/cover.jpg',
          genre: 'Rock',
          track_count: 12,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      mockDb.prepare.mockReturnValueOnce({
        all: jest.fn().mockReturnValue(mockAlbums),
      });

      const result = databaseService.getAllAlbums();

      expect(result).toEqual(mockAlbums);
    });
  });

  describe('updateArtist', () => {
    it('debería actualizar un artista correctamente', () => {
      const updatedArtist = {
        id: 'artist-123',
        name: 'Updated Artist',
        image_path: '/new/image.jpg',
        bio: 'Updated bio',
        genres: 'Pop',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockDb.prepare
        .mockReturnValueOnce({
          run: jest.fn(),
        })
        .mockReturnValueOnce({
          get: jest.fn().mockReturnValue(updatedArtist),
        });

      const result = databaseService.updateArtist('artist-123', { name: 'Updated Artist' });

      expect(result).toEqual(updatedArtist);
    });
  });

  describe('deleteArtist', () => {
    it('debería eliminar un artista correctamente', () => {
      mockDb.prepare.mockReturnValueOnce({
        run: jest.fn().mockReturnValue({ changes: 1 }),
      });

      const result = databaseService.deleteArtist('artist-123');

      expect(result).toBe(true);
    });

    it('debería retornar false si no existe el artista', () => {
      mockDb.prepare.mockReturnValueOnce({
        run: jest.fn().mockReturnValue({ changes: 0 }),
      });

      const result = databaseService.deleteArtist('non-existent');

      expect(result).toBe(false);
    });
  });
});
