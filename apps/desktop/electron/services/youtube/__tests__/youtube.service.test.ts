import youtubedl from 'youtube-dl-exec';
import { youtubeService } from '../youtube.service';

jest.mock('youtube-dl-exec', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockYoutubeDl = youtubedl as unknown as jest.Mock;

describe('YouTubeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockYoutubeDl.mockReset();
  });

  it('devuelve una búsqueda vacía sin invocar el proveedor', async () => {
    await expect(youtubeService.search({ query: '   ' })).resolves.toEqual({
      videos: [],
      nextPageToken: null,
      totalResults: 0,
      estimatedResults: 0,
    });
    expect(mockYoutubeDl).not.toHaveBeenCalled();
  });

  it('mapea resultados de búsqueda del proveedor al contrato de dominio', async () => {
    mockYoutubeDl.mockResolvedValue({
      entries: [{
        id: 'video-1',
        title: 'Forest Track',
        uploader: 'Chaos Channel',
        duration: 125,
        view_count: 42,
        thumbnail: 'https://example.test/thumb.jpg',
      }],
    });

    const result = await youtubeService.search({ query: 'forest', maxResults: 5 });

    expect(result.totalResults).toBe(1);
    expect(result.videos[0]).toMatchObject({
      id: 'video-1',
      title: 'Forest Track',
      channelTitle: 'Chaos Channel',
      duration: 125,
      durationString: '2:05',
      viewCount: 42,
    });
    expect(mockYoutubeDl).toHaveBeenCalledWith(
      'ytsearch5:forest',
      expect.objectContaining({ dumpSingleJson: true, simulate: true }),
      expect.objectContaining({ timeout: 30000 }),
    );
  });

  it('obtiene y normaliza los detalles de un video', async () => {
    mockYoutubeDl.mockResolvedValue({
      id: 'video-2',
      title: 'Details',
      channel: 'Channel',
      duration: 3601,
      tags: ['music'],
      categories: ['Music'],
    });

    const video = await youtubeService.getVideo('video-2');

    expect(video).toMatchObject({
      id: 'video-2',
      title: 'Details',
      channelTitle: 'Channel',
      durationString: '1:00:01',
      tags: ['music'],
      categoryId: 'Music',
    });
  });

  it('mapea los items de una playlist sin red real', async () => {
    mockYoutubeDl.mockResolvedValue({
      entries: [{
        id: 'track-1',
        title: 'Playlist Track',
        uploader: 'Channel',
        duration: 90,
      }],
    });

    const items = await youtubeService.getPlaylistItems('playlist-1');

    expect(items).toEqual([
      expect.objectContaining({
        playlistId: 'playlist-1',
        videoId: 'track-1',
        title: 'Playlist Track',
        duration: 90,
      }),
    ]);
  });

  it('clasifica errores del proveedor en el contrato YouTubeError', async () => {
    mockYoutubeDl.mockRejectedValue(new Error('network timeout'));

    await expect(youtubeService.search({ query: 'failure' })).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      recoverable: true,
    });
  });
});
