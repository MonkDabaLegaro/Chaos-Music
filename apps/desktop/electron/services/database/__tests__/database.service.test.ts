import Database from 'better-sqlite3';

jest.mock('better-sqlite3');

describe('DatabaseService', () => {
  let databaseService: typeof import('../database.service').databaseService;
  let mockDb: {
    pragma: jest.Mock;
    exec: jest.Mock;
    prepare: jest.Mock;
    close: jest.Mock;
    transaction: jest.Mock;
  };

  const statement = (overrides: Partial<{ run: jest.Mock; get: jest.Mock; all: jest.Mock }> = {}) => ({
    run: overrides.run ?? jest.fn().mockReturnValue({ changes: 1, lastInsertRowid: 1 }),
    get: overrides.get ?? jest.fn().mockReturnValue(null),
    all: overrides.all ?? jest.fn().mockReturnValue([]),
  });

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    mockDb = {
      pragma: jest.fn(),
      exec: jest.fn(),
      prepare: jest.fn().mockReturnValue(statement()),
      close: jest.fn(),
      transaction: jest.fn((fn: () => unknown) => fn),
    };

    (Database as unknown as jest.Mock).mockImplementation(() => mockDb);
    databaseService = require('../database.service').databaseService;
  });

  it('inicializa SQLite una sola vez y crea esquema, índices y triggers', () => {
    databaseService.initialize();
    databaseService.initialize();

    expect(Database).toHaveBeenCalledTimes(1);
    expect(mockDb.pragma).toHaveBeenCalledWith('journal_mode = WAL');
    expect(mockDb.exec).toHaveBeenCalledTimes(3);
  });

  it('agrega y recupera un artista', () => {
    databaseService.initialize();
    const artist = {
      id: 'mock-uuid-1234',
      name: 'Test Artist',
      image_path: null,
      bio: null,
      genres: 'Rock',
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    };

    mockDb.prepare
      .mockReturnValueOnce(statement())
      .mockReturnValueOnce(statement({ get: jest.fn().mockReturnValue(artist) }));

    const result = databaseService.addArtist({
      name: artist.name,
      image_path: artist.image_path,
      bio: artist.bio,
      genres: artist.genres,
    });

    expect(result).toEqual(artist);
  });

  it('aplica búsqueda y paginación al consultar canciones', () => {
    databaseService.initialize();
    const tracks = [{ id: 'track-1', title: 'Track 1' }];
    mockDb.prepare
      .mockReturnValueOnce(statement({ get: jest.fn().mockReturnValue({ total: 1 }) }))
      .mockReturnValueOnce(statement({ all: jest.fn().mockReturnValue(tracks) }));

    const result = databaseService.getAllTracks({ search: 'track', limit: 10, offset: 0 });

    expect(result).toEqual({ tracks, total: 1 });
    expect(mockDb.prepare.mock.calls[1][0]).toContain('LIKE');
  });

  it('alterna favoritos usando el estado persistido actual', () => {
    databaseService.initialize();
    mockDb.prepare
      .mockReturnValueOnce(statement({ get: jest.fn().mockReturnValue({ id: 'track-1', is_favorite: 0 }) }))
      .mockReturnValueOnce(statement());

    expect(databaseService.toggleFavorite('track-1')).toBe(true);
  });

  it('cierra la conexión activa', () => {
    databaseService.initialize();
    databaseService.close();
    expect(mockDb.close).toHaveBeenCalledTimes(1);
  });
});
