import * as fs from 'node:fs';
import * as path from 'node:path';
import ffmpeg from 'fluent-ffmpeg';
import youtubedl from 'youtube-dl-exec';
import type {
  AudioExtractOptions,
  ExtractedAudioMetadata,
  YouTubeError,
  YouTubeErrorCode,
  YouTubePlaylist,
  YouTubePlaylistItem,
  YouTubeRecommendations,
  YouTubeSearchOptions,
  YouTubeSearchResult,
  YouTubeServiceConfig,
  YouTubeStreamConfig,
  YouTubeVideo,
} from './types';

interface CacheEntry {
  data: unknown;
  timestamp: number;
  maxAgeMinutes?: number;
}

type JsonObject = Record<string, unknown>;

const asObject = (value: unknown): JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? value as JsonObject : {};
const asArray = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
const text = (value: unknown, fallback = ''): string => typeof value === 'string' ? value : fallback;
const number = (value: unknown, fallback = 0): number => typeof value === 'number' ? value : fallback;
const bool = (value: unknown): boolean => value === true;

class YouTubeService {
  private config: YouTubeServiceConfig;
  private cache = new Map<string, CacheEntry>();

  constructor() {
    this.config = {
      apiKey: process.env.YOUTUBE_API_KEY || '',
      cacheEnabled: true,
      cacheMaxAge: 60,
      maxRetries: 3,
      retryDelay: 1000,
      requestTimeout: 30000,
      userAgent: 'Chaos-Music/0.2',
    };
  }

  initialize(config: Partial<YouTubeServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async search(options: Partial<YouTubeSearchOptions>): Promise<YouTubeSearchResult> {
    const opts: YouTubeSearchOptions = {
      query: options.query?.trim() || '',
      type: options.type || 'video',
      maxResults: options.maxResults || 20,
      pageToken: options.pageToken || null,
      order: options.order || 'relevance',
      safeSearch: options.safeSearch || 'none',
      videoDuration: options.videoDuration || 'any',
      videoDefinition: options.videoDefinition || 'any',
      relevanceLanguage: options.relevanceLanguage || null,
      regionCode: options.regionCode || null,
    };

    if (!opts.query) {
      return { videos: [], nextPageToken: null, totalResults: 0, estimatedResults: 0 };
    }

    const cacheKey = `search:${JSON.stringify(opts)}`;
    const cached = this.getFromCache<YouTubeSearchResult>(cacheKey);
    if (cached) return cached;

    try {
      const output = await this.executeYoutubeDl(`ytsearch${opts.maxResults}:${opts.query}`, {
        dumpSingleJson: true,
        noWarnings: true,
        simulate: true,
      });
      const videos = this.parseSearchResults(output);
      const result = {
        videos,
        nextPageToken: null,
        totalResults: videos.length,
        estimatedResults: videos.length,
      } satisfies YouTubeSearchResult;
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      throw this.handleError(error, 'SEARCH_FAILED');
    }
  }

  async getVideo(videoId: string): Promise<YouTubeVideo> {
    const cacheKey = `video:${videoId}`;
    const cached = this.getFromCache<YouTubeVideo>(cacheKey);
    if (cached) return cached;

    try {
      const output = await this.executeYoutubeDl(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, {
        dumpSingleJson: true,
        noWarnings: true,
        simulate: true,
      });
      const video = this.parseVideoInfo(output, videoId);
      this.setCache(cacheKey, video);
      return video;
    } catch (error) {
      throw this.handleError(error, 'VIDEO_NOT_FOUND', videoId);
    }
  }

  async getStreamUrl(videoId: string): Promise<YouTubeStreamConfig> {
    try {
      const video = await this.getVideo(videoId);
      const url = video.isLive ? await this.getLiveStreamUrl(videoId) : await this.getAudioStreamUrl(videoId);
      return {
        url,
        format: video.isLive ? 'm3u8' : 'aac',
        quality: 'high',
        bitrate: video.isLive ? 128000 : 192000,
        sampleRate: video.isLive ? 48000 : 44100,
        isLive: video.isLive,
        duration: video.isLive ? null : video.duration,
      };
    } catch (error) {
      throw this.handleError(error, 'STREAM_FAILED', videoId);
    }
  }

  async extractAudio(videoId: string, options: Partial<AudioExtractOptions> = {}): Promise<ExtractedAudioMetadata> {
    const opts: AudioExtractOptions = {
      format: options.format || 'mp3',
      quality: options.quality ?? 2,
      bitrate: options.bitrate ?? 192,
      sampleRate: options.sampleRate ?? 44100,
      outputPath: options.outputPath ?? null,
      skipDownload: options.skipDownload ?? false,
    };

    try {
      const video = await this.getVideo(videoId);
      if (opts.skipDownload) {
        const streamUrl = await this.getAudioStreamUrl(videoId);
        return {
          title: video.title,
          artist: video.channelTitle,
          album: '',
          duration: video.duration,
          thumbnail: video.thumbnail,
          filePath: streamUrl,
          fileSize: 0,
          format: opts.format,
          bitrate: opts.bitrate,
          sampleRate: opts.sampleRate,
          channels: 2,
        };
      }

      const outputPath = opts.outputPath || path.join(process.cwd(), 'temp', `audio_${videoId}.${opts.format}`);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      await this.extractAudioWithFFmpeg(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, outputPath, opts);
      const stats = fs.statSync(outputPath);
      return {
        title: video.title,
        artist: video.channelTitle,
        album: '',
        duration: video.duration,
        thumbnail: video.thumbnail,
        filePath: outputPath,
        fileSize: stats.size,
        format: opts.format,
        bitrate: opts.bitrate,
        sampleRate: opts.sampleRate,
        channels: 2,
      };
    } catch (error) {
      throw this.handleError(error, 'EXTRACT_FAILED', videoId);
    }
  }

  async getTrending(categoryId?: string): Promise<YouTubeVideo[]> {
    const cacheKey = `trending:${categoryId || 'all'}`;
    const cached = this.getFromCache<YouTubeVideo[]>(cacheKey);
    if (cached) return cached;

    try {
      const output = await this.executeYoutubeDl('https://www.youtube.com/feed/trending', {
        dumpSingleJson: true,
        noWarnings: true,
        simulate: true,
      });
      const root = asObject(output);
      const entries = asArray(root.entries);
      const videos = entries.map((entry) => {
        const data = asObject(entry);
        return this.parseVideoInfo(data, text(data.id));
      }).filter((video) => Boolean(video.id));
      this.setCache(cacheKey, videos, 10);
      return videos;
    } catch (error) {
      throw this.handleError(error, 'SEARCH_FAILED');
    }
  }

  async getRecommendations(videoId: string): Promise<YouTubeRecommendations> {
    try {
      const video = await this.getVideo(videoId);
      const searchResults = await this.search({
        query: `${video.channelTitle} ${video.title}`,
        maxResults: 10,
        type: 'video',
      });
      return {
        relatedVideos: searchResults.videos.filter((candidate) => candidate.id !== videoId),
        recommendedChannels: [{
          channelId: video.channelId,
          channelTitle: video.channelTitle,
          thumbnail: '',
          videoCount: 0,
          subscriberCount: 0,
        }],
      };
    } catch (error) {
      throw this.handleError(error, 'SEARCH_FAILED', videoId);
    }
  }

  async getPlaylist(playlistId: string): Promise<YouTubePlaylist> {
    const cacheKey = `playlist:${playlistId}`;
    const cached = this.getFromCache<YouTubePlaylist>(cacheKey);
    if (cached) return cached;

    try {
      const output = asObject(await this.executeYoutubeDl(`https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`, {
        dumpSingleJson: true,
        noWarnings: true,
        simulate: true,
      }));
      const playlist: YouTubePlaylist = {
        id: playlistId,
        url: `https://www.youtube.com/playlist?list=${playlistId}`,
        title: text(output.title, 'Unknown Playlist'),
        description: text(output.description),
        thumbnail: text(output.thumbnail),
        channelTitle: text(output.uploader),
        channelId: text(output.channel_id),
        videoCount: asArray(output.entries).length,
        viewCount: number(output.view_count),
        lastUpdated: new Date().toISOString(),
      };
      this.setCache(cacheKey, playlist);
      return playlist;
    } catch (error) {
      throw this.handleError(error, 'PLAYLIST_NOT_FOUND');
    }
  }

  async getPlaylistItems(playlistId: string): Promise<YouTubePlaylistItem[]> {
    try {
      const output = asObject(await this.executeYoutubeDl(`https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`, {
        dumpSingleJson: true,
        noWarnings: true,
        simulate: true,
      }));
      return asArray(output.entries).map((entry, index) => {
        const data = asObject(entry);
        const videoId = text(data.id);
        return {
          id: `item_${videoId}_${index}`,
          playlistId,
          videoId,
          title: text(data.title),
          description: text(data.description),
          thumbnail: text(data.thumbnail),
          position: index,
          duration: number(data.duration),
          channelTitle: text(data.uploader),
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
        };
      });
    } catch (error) {
      throw this.handleError(error, 'PLAYLIST_NOT_FOUND');
    }
  }

  private async executeYoutubeDl(target: string, options: Record<string, unknown>): Promise<unknown> {
    return youtubedl(target, {
      ...options,
      noCheckCertificates: true,
      noWarnings: true,
    }, {
      timeout: this.config.requestTimeout,
    });
  }

  private async getLiveStreamUrl(videoId: string): Promise<string> {
    const output = asObject(await this.executeYoutubeDl(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, {
      dumpSingleJson: true,
      format: 'best',
    }));
    return text(output.url);
  }

  private async getAudioStreamUrl(videoId: string): Promise<string> {
    const output = asObject(await this.executeYoutubeDl(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, {
      dumpSingleJson: true,
      format: 'bestaudio[ext=m4a]/bestaudio',
    }));
    return text(output.url);
  }

  private async extractAudioWithFFmpeg(videoUrl: string, outputPath: string, options: AudioExtractOptions): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoUrl)
        .audioCodec(optsCodec(options.format))
        .audioBitrate(options.bitrate)
        .audioFrequency(options.sampleRate)
        .audioChannels(2)
        .format(options.format)
        .on('end', () => resolve())
        .on('error', reject)
        .save(outputPath);
    });
  }

  private parseSearchResults(output: unknown): YouTubeVideo[] {
    const root = asObject(output);
    return asArray(root.entries).map((entry) => {
      const data = asObject(entry);
      return this.parseVideoInfo(data, text(data.id));
    }).filter((video) => Boolean(video.id));
  }

  private parseVideoInfo(value: unknown, videoId: string): YouTubeVideo {
    const output = asObject(value);
    const duration = number(output.duration);
    const categories = asArray(output.categories).filter((item): item is string => typeof item === 'string');
    const tags = asArray(output.tags).filter((item): item is string => typeof item === 'string');
    return {
      id: videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title: text(output.title, 'Unknown Title'),
      description: text(output.description),
      thumbnail: text(output.thumbnail, `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`),
      channelTitle: text(output.uploader, text(output.channel, 'Unknown Channel')),
      channelId: text(output.channel_id),
      channelUrl: text(output.uploader_url),
      duration,
      durationString: this.formatDuration(duration),
      viewCount: number(output.view_count, number(output.views)),
      likeCount: number(output.like_count),
      commentCount: number(output.comment_count),
      uploadDate: text(output.upload_date, new Date().toISOString()),
      isLive: bool(output.is_live),
      isAgeRestricted: false,
      isRegionBlocked: false,
      tags,
      categoryId: categories[0] || '',
      defaultAudioLanguage: text(output.language) || null,
      playableUrl: text(output.url) || null,
      streamUrl: text(output.url) || null,
    };
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  private getFromCache<T>(key: string): T | null {
    if (!this.config.cacheEnabled) return null;
    const entry = this.cache.get(key);
    if (!entry) return null;
    const ageMinutes = (Date.now() - entry.timestamp) / 60000;
    if (ageMinutes > (entry.maxAgeMinutes ?? this.config.cacheMaxAge)) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private setCache(key: string, data: unknown, maxAgeMinutes?: number): void {
    if (!this.config.cacheEnabled) return;
    this.cache.set(key, { data, timestamp: Date.now(), maxAgeMinutes });
    if (this.cache.size > 1000) {
      const oldest = [...this.cache.entries()]
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, 100);
      oldest.forEach(([cacheKey]) => this.cache.delete(cacheKey));
    }
  }

  private handleError(error: unknown, code: YouTubeErrorCode, videoId?: string): YouTubeError {
    const message = error instanceof Error ? error.message : String(error);
    let recoverable = true;
    let retryAfter: number | undefined;

    if (message.includes('quota')) { code = 'API_QUOTA_EXCEEDED'; recoverable = false; }
    else if (message.includes('rate')) { code = 'API_RATE_LIMITED'; retryAfter = 60; }
    else if (message.includes('age')) { code = 'VIDEO_AGE_RESTRICTED'; recoverable = false; }
    else if (message.includes('copyright')) { code = 'VIDEO_COPYRIGHT'; recoverable = false; }
    else if (message.includes('private')) { code = 'VIDEO_PRIVATE'; recoverable = false; }
    else if (message.includes('network') || message.includes('timeout')) { code = 'NETWORK_ERROR'; }

    return { code, message, videoId, recoverable, retryAfter };
  }
}

const optsCodec = (format: AudioExtractOptions['format']): string => {
  if (format === 'aac') return 'aac';
  if (format === 'ogg') return 'libvorbis';
  if (format === 'wav') return 'pcm_s16le';
  return 'libmp3lame';
};

export const youtubeService = new YouTubeService();
