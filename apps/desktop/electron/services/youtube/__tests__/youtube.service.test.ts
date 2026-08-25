/**
 * Pruebas Unitarias para YouTubeService
 */

describe('YouTubeService', () => {
  let youtubeService: typeof import('../youtube.service').youtubeService;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Importar el servicio
    youtubeService = require('../youtube.service').youtubeService;
  });

  describe('searchVideos', () => {
    it('debería buscar videos correctamente', async () => {
      const results = await youtubeService.searchVideos('test query');

      expect(results).toBeDefined();
      // Los resultados dependen de la API real
    });

    it('debería manejar errores de búsqueda', async () => {
      // Mock de error
      await expect(youtubeService.searchVideos('')).rejects.toThrow();
    });
  });

  describe('getVideoDetails', () => {
    it('debería obtener detalles del video', async () => {
      const videoId = 'dQw4w9WgXcQ';
      const details = await youtubeService.getVideoDetails(videoId);

      expect(details).toBeDefined();
    });

    it('debería lanzar error para ID inválido', async () => {
      await expect(youtubeService.getVideoDetails('')).rejects.toThrow();
    });
  });

  describe('searchPlaylists', () => {
    it('debería buscar playlists', async () => {
      const results = await youtubeService.searchPlaylists('rock music');

      expect(results).toBeDefined();
    });
  });

  describe('getPlaylistTracks', () => {
    it('debería obtener tracks de una playlist', async () => {
      const playlistId = 'PL123456789';
      const tracks = await youtubeService.getPlaylistTracks(playlistId);

      expect(tracks).toBeDefined();
    });
  });

  describe('extractVideoId', () => {
    it('debería extraer ID de URL de YouTube', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const videoId = youtubeService.extractVideoId(url);

      expect(videoId).toBe('dQw4w9WgXcQ');
    });

    it('debería extraer ID de URL corta', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      const videoId = youtubeService.extractVideoId(url);

      expect(videoId).toBe('dQw4w9WgXcQ');
    });

    it('debería retornar null para URL inválida', () => {
      const url = 'https://example.com/video';
      const videoId = youtubeService.extractVideoId(url);

      expect(videoId).toBeNull();
    });
  });

  describe('parseDuration', () => {
    it('debería parsear duración en formato ISO', () => {
      const duration = youtubeService.parseDuration('PT4M30S');

      expect(duration).toBe(270); // 4*60 + 30
    });

    it('debería parsear duración con horas', () => {
      const duration = youtubeService.parseDuration('PT1H2M30S');

      expect(duration).toBe(3750); // 3600 + 120 + 30
    });

    it('debería retornar 0 para duración inválida', () => {
      const duration = youtubeService.parseDuration('invalid');

      expect(duration).toBe(0);
    });
  });

  describe('isYouTubeUrl', () => {
    it('debería reconocer URLs de YouTube', () => {
      expect(youtubeService.isYouTubeUrl('https://youtube.com/watch?v=123')).toBe(true);
      expect(youtubeService.isYouTubeUrl('https://youtu.be/123')).toBe(true);
      expect(youtubeService.isYouTubeUrl('https://music.youtube.com/watch?v=123')).toBe(true);
    });

    it('debería rechazar URLs que no son de YouTube', () => {
      expect(youtubeService.isYouTubeUrl('https://vimeo.com/123')).toBe(false);
      expect(youtubeService.isYouTubeUrl('https://example.com/video')).toBe(false);
    });
  });
});
