import type { MusicSource, MusicSourceItem } from '@chaos-music/contracts';

interface LegacyVideo {
  id?: string;
  title?: string;
  channelTitle?: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  duration?: number;
}

type LegacySearchType = 'all' | 'video' | 'playlist' | 'channel';

export interface LegacyYouTubeService {
  search(options: { query: string; type?: LegacySearchType; maxResults?: number }): Promise<{ videos: LegacyVideo[] }>;
  getStreamUrl(videoId: string): Promise<{ url: string }>;
}

export class LegacyYouTubeMusicSource implements MusicSource {
  readonly id = 'youtube';
  readonly displayName = 'YouTube';

  constructor(private readonly service: LegacyYouTubeService) {}

  async search(query: string): Promise<MusicSourceItem[]> {
    const result = await this.service.search({ query, type: 'video', maxResults: 20 });
    return result.videos.map(video => ({
      id: String(video.id ?? ''),
      sourceId: this.id,
      title: String(video.title ?? 'Untitled'),
      artist: video.channelTitle,
      artworkUrl: video.thumbnail ?? video.thumbnailUrl,
      duration: video.duration,
      playable: Boolean(video.id),
    }));
  }

  async resolvePlayableUrl(itemId: string) {
    const stream = await this.service.getStreamUrl(itemId);
    return stream.url;
  }
}
