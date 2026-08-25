/**
 * Servicio de YouTube - Implementación completa
 * Maneja búsqueda, streaming, extracción de audio y más
 */

import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { AudioExtractOptions, ExtractedAudioMetadata, YouTubeError, YouTubeErrorCode, YouTubePlaylist, YouTubePlaylistItem, YouTubeRecommendations, YouTubeSearchOptions, YouTubeSearchResult, YouTubeServiceConfig, YouTubeStreamConfig, YouTubeVideo } from './types';

const execAsync = promisify(exec);

// Cache en memoria para búsquedas
interface CacheEntry {
  data: unknown;
  timestamp: number;
}

class YouTubeService {
  private config: YouTubeServiceConfig;
  private cache: Map<string, CacheEntry> = new Map();
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || '';
    this.config = {
      apiKey: this.apiKey,
      cacheEnabled: true,
      cacheMaxAge: 60, // 60 minutos
      maxRetries: 3,
      retryDelay: 1000,
      requestTimeout: 30000,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };
  }

  /**
   * Inicializar el servicio con configuración personalizada
   */
  initialize(config: Partial<YouTubeServiceConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.apiKey) {
      this.apiKey = config.apiKey;
    }
  }

  /**
   * Buscar videos en YouTube
   */
  async search(options: Partial<YouTubeSearchOptions>): Promise<YouTubeSearchResult> {
    const opts: YouTubeSearchOptions = {
      query: options.query || '',
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

    // Verificar cache
    const cacheKey = `search:${JSON.stringify(opts)}`;
    const cached = this.getFromCache<YouTubeSearchResult>(cacheKey);
    if (cached) return cached;

    try {
      // Usar youtube-dl-exec para buscar
      const searchQuery = opts.query;
      const output = await this.executeYoutubeDl(`ytsearch${opts.maxResults}:${searchQuery}`, {
        dumpSingleJson: true,
        noWarnings: true,
        simulate: true,
      });

      // Parsear resultados
      const videos = this.parseSearchResults(output);
      const result: YouTubeSearchResult = {
        videos,
        nextPageToken: null, // youtube-dl no proporciona nextPageToken
        totalResults: videos.length,
        estimatedResults: videos.length,
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      throw this.handleError(error, 'SEARCH_FAILED');
    }
  }

  /**
   * Obtener información de un video específico
   */
  async getVideo(videoId: string): Promise<YouTubeVideo> {
    const cacheKey = `video:${videoId}`;
    const cached = this.getFromCache<YouTubeVideo>(cacheKey);
    if (cached) return cached;

    try {
      const output = await this.executeYoutubeDl(`https://www.youtube.com/watch?v=${videoId}`, {
        dumpSingleJson: true,
        noWarnings: true,
        getDescription: true,
        getDuration: true,
        getThumbnail: true,
        getTitle: true,
        getUrl: true,
        format: 'best',
      });

      const video = this.parseVideoInfo(output, videoId);
      this.setCache(cacheKey, video);
      return video;
    } catch (error) {
      throw this.handleError(error, 'VIDEO_NOT_FOUND', videoId);
    }
  }

  /**
   * Obtener URL de streaming de audio
   */
  async getStreamUrl(videoId: string): Promise<YouTubeStreamConfig> {
    try {
      const video = await this.getVideo(videoId);
      
      if (video.isLive) {
        // Para streams en vivo, obtener URL m3u8
        const streamUrl = await this.getLiveStreamUrl(videoId);
        return {
          url: streamUrl,
          format: 'm3u8',
          quality: 'high',
          bitrate: 128000,
          sampleRate: 48000,
          isLive: true,
          duration: null,
        };
      }

      // Para videos bajo demanda, obtener URL de audio
      const streamUrl = await this.getAudioStreamUrl(videoId);
      return {
        url: streamUrl,
        format: 'mp3',
        quality: 'high',
        bitrate: 192000,
        sampleRate: 44100,
        isLive: false,
        duration: video.duration,
      };
    } catch (error) {
      throw this.handleError(error, 'STREAM_FAILED', videoId);
    }
  }

  /**
   * Extraer audio de un video
   */
  async extractAudio(videoId: string, options: Partial<AudioExtractOptions> = {}): Promise<ExtractedAudioMetadata> {
    const opts: AudioExtractOptions = {
      format: options.format || 'mp3',
      quality: options.quality || 2,
      bitrate: options.bitrate || 192,
      sampleRate: options.sampleRate || 44100,
      outputPath: options.outputPath || null,
      skipDownload: options.skipDownload || false,
    };

    try {
      const videoInfo = await this.getVideo(videoId);
      const outputPath = opts.outputPath || path.join(process.cwd(), 'temp', `audio_${videoId}.${opts.format}`);
      
      // Crear directorio si no existe
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (opts.skipDownload) {
        // Solo obtener la URL de streaming
        const streamUrl = await this.getAudioStreamUrl(videoId);
        return {
          title: videoInfo.title,
          artist: videoInfo.channelTitle,
          album: '',
          duration: videoInfo.duration,
          thumbnail: videoInfo.thumbnail,
          filePath: streamUrl,
          fileSize: 0,
          format: opts.format,
          bitrate: opts.bitrate,
          sampleRate: opts.sampleRate,
          channels: 2,
        };
      }

      // Usar ffmpeg para extraer y convertir audio
      await this.extractAudioWithFFmpeg(`https://www.youtube.com/watch?v=${videoId}`, outputPath, opts);
      
      const stats = fs.statSync(outputPath);
      
      return {
        title: videoInfo.title,
        artist: videoInfo.channelTitle,
        album: '',
        duration: videoInfo.duration,
        thumbnail: videoInfo.thumbnail,
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

  /**
   * Obtener videos trending
   */
  async getTrending(categoryId?: string): Promise<YouTubeVideo[]> {
    const cacheKey = `trending:${categoryId || 'all'}`;
    const cached = this.getFromCache<YouTubeVideo[]>(cacheKey);
    if (cached) return cached;

    try {
      // Usar youtube-dl para obtener trending
      const output = await this.executeYoutubeDl('https://www.youtube.com/feed/trending', {
        dumpSingleJson: true,
        noWarnings: true,
        simulate: true,
      });

      const videos = Array.isArray(output) ? output.map((item: Record<string, unknown>, index: number) => 
        this.parseVideoInfo(item, item.id as string)
      ) : [];

      this.setCache(cacheKey, videos, 10); // Cache por 10 minutos para trending
      return videos;
    } catch (error) {
      throw this.handleError(error, 'SEARCH_FAILED');
    }
  }

  /**
   * Obtener recomendaciones basadas en un video
   */
  async getRecommendations(videoId: string): Promise<YouTubeRecommendations> {
    try {
      const video = await this.getVideo(videoId);
      
      // Buscar videos relacionados usando la API de YouTube
      const searchResults = await this.search({ 
        query: `${video.channelTitle} ${video.title}`,
        maxResults: 10,
        type: 'video',
      });

      // Filtrar para obtener solo videos relacionados (no el mismo video)
      const relatedVideos = searchResults.videos.filter(v => v.id !== videoId);

      return {
        relatedVideos,
        recommendedChannels: [
          {
            channelId: video.channelId,
            channelTitle: video.channelTitle,
            thumbnail: '',
            videoCount: 0,
            subscriberCount: 0,
          },
        ],
      };
    } catch (error) {
      throw this.handleError(error, 'SEARCH_FAILED', videoId);
    }
  }

  /**
   * Obtener playlist
   */
  async getPlaylist(playlistId: string): Promise<YouTubePlaylist> {
    const cacheKey = `playlist:${playlistId}`;
    const cached = this.getFromCache<YouTubePlaylist>(cacheKey);
    if (cached) return cached;

    try {
      const output = await this.executeYoutubeDl(`https://www.youtube.com/playlist?list=${playlistId}`, {
        dumpSingleJson: true,
        noWarnings: true,
      });

      const playlist: YouTubePlaylist = {
        id: playlistId,
        url: `https://www.youtube.com/playlist?list=${playlistId}`,
        title: output.title || 'Unknown Playlist',
        description: output.description || '',
        thumbnail: output.thumbnail || '',
        channelTitle: output.uploader || '',
        channelId: '',
        videoCount: output.entries?.length || 0,
        viewCount: 0,
        lastUpdated: new Date().toISOString(),
      };

      this.setCache(cacheKey, playlist);
      return playlist;
    } catch (error) {
      throw this.handleError(error, 'PLAYLIST_NOT_FOUND');
    }
  }

  /**
   * Obtener items de una playlist
   */
  async getPlaylistItems(playlistId: string): Promise<YouTubePlaylistItem[]> {
    try {
      const output = await this.executeYoutubeDl(`https://www.youtube.com/playlist?list=${playlistId}`, {
        dumpSingleJson: true,
        noWarnings: true,
      });

      const items: YouTubePlaylistItem[] = (output.entries || []).map((entry: Record<string, unknown>, index: number) => ({
        id: `item_${entry.id}_${index}`,
        playlistId,
        videoId: entry.id as string,
        title: entry.title as string,
        description: entry.description as string,
        thumbnail: entry.thumbnail as string,
        position: index,
        duration: (entry.duration as number) || 0,
        channelTitle: entry.uploader as string,
        videoUrl: `https://www.youtube.com/watch?v=${entry.id}`,
      }));

      return items;
    } catch (error) {
      throw this.handleError(error, 'PLAYLIST_NOT_FOUND');
    }
  }

  // ========== Métodos privados ==========

  /**
   * Ejecutar youtube-dl con opciones
   */
  private async executeYoutubeDl(url: string, options: Record<string, unknown>): Promise<Record<string, unknown>> {
    const opts = [
      ...Object.entries(options).map(([key, value]) => {
        if (typeof value === 'boolean') {
          return value ? `--${key}` : `--no-${key}`;
        }
        return `--${key} "${value}"`;
      }),
      '--no-check-certificate',
      '--no-cache-dir',
      '--socket-timeout', '30',
    ].join(' ');

    try {
      const { stdout } = await execAsync(`npx youtube-dl "${url}" ${opts}`);
      return JSON.parse(stdout);
    } catch (error) {
      // Si falla youtube-dl, intentar con yt-dlp
      try {
        const { stdout } = await execAsync(`npx yt-dlp "${url}" ${opts}`);
        return JSON.parse(stdout);
      } catch (secondError) {
        throw secondError;
      }
    }
  }

  /**
   * Obtener URL de stream en vivo (m3u8)
   */
  private async getLiveStreamUrl(videoId: string): Promise<string> {
    const output = await this.executeYoutubeDl(`https://www.youtube.com/watch?v=${videoId}`, {
      getUrl: true,
      format: 'best',
    });
    return (output as { url?: string }).url || '';
  }

  /**
   * Obtener URL de stream de audio
   */
  private async getAudioStreamUrl(videoId: string): Promise<string> {
    const output = await this.executeYoutubeDl(`https://www.youtube.com/watch?v=${videoId}`, {
      getUrl: true,
      format: 'bestaudio[ext=m4a]/bestaudio',
    });
    return (output as { url?: string }).url || '';
  }

  /**
   * Extraer audio usando ffmpeg
   */
  private async extractAudioWithFFmpeg(videoUrl: string, outputPath: string, options: AudioExtractOptions): Promise<void> {
    const ffmpeg = await import('fluent-ffmpeg');
    
    return new Promise((resolve, reject) => {
      const ffmpegPath = require('fluent-ffmpeg').setFfmpegPath;
      // Configurar ruta de ffmpeg si es necesario
      
      ffmpeg(videoUrl)
        .audioCodec('libmp3lame')
        .audioBitrate(options.bitrate)
        .audioFrequency(options.sampleRate)
        .audioChannels(2)
        .format('mp3')
        .on('end', () => resolve())
        .on('error', (err: Error) => reject(err))
        .save(outputPath);
    });
  }

  /**
   * Parsear resultados de búsqueda
   */
  private parseSearchResults(output: Record<string, unknown>): YouTubeVideo[] {
    const entries = (output.entries as Record<string, unknown>[]) || [];
    return entries.map((entry: Record<string, unknown>) => 
      this.parseVideoInfo(entry, entry.id as string)
    );
  }

  /**
   * Parsear información de video
   */
  private parseVideoInfo(output: Record<string, unknown>, videoId: string): YouTubeVideo {
    const duration = (output.duration as number) || 0;
    
    return {
      id: videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title: (output.title as string) || 'Unknown Title',
      description: (output.description as string) || '',
      thumbnail: (output.thumbnail as string) || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      channelTitle: (output.uploader as string) || (output.channel as string) || 'Unknown Channel',
      channelId: (output.channel_id as string) || '',
      channelUrl: (output.uploader_url as string) || `https://www.youtube.com/channel/`,
      duration,
      durationString: this.formatDuration(duration),
      viewCount: (output.view_count as number) || (output.views as number) || 0,
      likeCount: (output.like_count as number) || 0,
      commentCount: (output.comment_count as number) || 0,
      uploadDate: (output.upload_date as string) || new Date().toISOString(),
      isLive: (output.is_live as boolean) || false,
      isAgeRestricted: false, // youtube-dl maneja esto internamente
      isRegionBlocked: false,
      tags: (output.tags as string[]) || [],
      categoryId: (output.categories as string[])?.[0] || '',
      defaultAudioLanguage: (output.language as string) || null,
      playableUrl: (output.url as string) || null,
      streamUrl: (output.url as string) || null,
    };
  }

  /**
   * Formatear duración en segundos a string legible
   */
  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Obtener del cache
   */
  private getFromCache<T>(key: string): T | null {
    if (!this.config.cacheEnabled) return null;
    
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = (Date.now() - entry.timestamp) / 1000 / 60; // minutos
    if (age > this.config.cacheMaxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Guardar en cache
   */
  private setCache(key: string, data: unknown, maxAge?: number): void {
    if (!this.config.cacheEnabled) return;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Limpiar cache si excede el tamaño máximo
    if (this.cache.size > 1000) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toDelete = entries.slice(0, 100);
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }

  /**
   * Manejar errores
   */
  private handleError(error: unknown, code: YouTubeErrorCode, videoId?: string): YouTubeError {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    let recoverable = true;
    let retryAfter: number | undefined;

    if (errorMessage.includes('quota')) {
      code = 'API_QUOTA_EXCEEDED';
      recoverable = false;
    } else if (errorMessage.includes('rate')) {
      code = 'API_RATE_LIMITED';
      retryAfter = 60;
    } else if (errorMessage.includes('age')) {
      code = 'VIDEO_AGE_RESTRICTED';
      recoverable = false;
    } else if (errorMessage.includes('copyright')) {
      code = 'VIDEO_COPYRIGHT';
      recoverable = false;
    } else if (errorMessage.includes('private')) {
      code = 'VIDEO_PRIVATE';
      recoverable = false;
    } else if (errorMessage.includes('deleted')) {
      code = 'VIDEO_DELETED';
      recoverable = false;
    }

    return {
      code,
      message: errorMessage,
      videoId,
      recoverable,
      retryAfter,
    };
  }

  /**
   * Limpiar cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Obtener estadísticas del cache
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: 1000,
      hitCount: 0,
      missCount: 0,
      hitRate: 0,
    };
  }
}

// Exportar instancia singleton
export const youtubeService = new YouTubeService();
export default youtubeService;
