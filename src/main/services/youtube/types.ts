/**
 * Tipos TypeScript para el servicio de YouTube
 */

// Información básica de un video de YouTube
export interface YouTubeVideo {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelId: string;
  channelUrl: string;
  duration: number; // en segundos
  durationString: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  uploadDate: string;
  isLive: boolean;
  isAgeRestricted: boolean;
  isRegionBlocked: boolean;
  tags: string[];
  categoryId: string;
  defaultAudioLanguage: string | null;
  playableUrl: string | null;
  streamUrl: string | null;
}

// Resultado de búsqueda
export interface YouTubeSearchResult {
  videos: YouTubeVideo[];
  nextPageToken: string | null;
  totalResults: number;
  estimatedResults: number;
}

// Configuración de streaming
export interface YouTubeStreamConfig {
  url: string;
  format: 'm3u8' | 'mp3' | 'aac' | 'ogg';
  quality: 'low' | 'medium' | 'high' | 'auto';
  bitrate: number;
  sampleRate: number;
  isLive: boolean;
  duration: number | null; // null para streams en vivo
}

// Opciones de búsqueda
export interface YouTubeSearchOptions {
  query: string;
  type: 'video' | 'playlist' | 'channel' | 'all';
  maxResults: number;
  pageToken: string | null;
  order: 'relevance' | 'date' | 'viewCount' | 'rating';
  safeSearch: 'none' | 'moderate' | 'strict';
  videoDuration: 'short' | 'medium' | 'long' | 'any';
  videoDefinition: 'high' | 'standard' | 'any';
  relevanceLanguage: string | null;
  regionCode: string | null;
}

// Opciones de extracción de audio
export interface AudioExtractOptions {
  format: 'mp3' | 'aac' | 'ogg' | 'wav';
  quality: number; // 0-9 (0 = mejor, 9 = peor)
  bitrate: number;
  sampleRate: number;
  outputPath: string | null; // null = archivo temporal
  skipDownload: boolean; // true = solo obtener URL
}

// Tipos de error específicos de YouTube
export type YouTubeErrorCode =
  | 'VIDEO_NOT_FOUND'
  | 'VIDEO_UNAVAILABLE'
  | 'VIDEO_RESTRICTED'
  | 'VIDEO_AGE_RESTRICTED'
  | 'VIDEO_COPYRIGHT'
  | 'VIDEO_GEO_BLOCKED'
  | 'VIDEO_DELETED'
  | 'VIDEO_PRIVATE'
  | 'CHANNEL_SUSPENDED'
  | 'PLAYLIST_NOT_FOUND'
  | 'SEARCH_FAILED'
  | 'STREAM_FAILED'
  | 'EXTRACT_FAILED'
  | 'API_QUOTA_EXCEEDED'
  | 'API_RATE_LIMITED'
  | 'API_KEY_INVALID'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface YouTubeError {
  code: YouTubeErrorCode;
  message: string;
  videoId?: string;
  recoverable: boolean;
  retryAfter?: number; // segundos para esperar antes de reintentar
}

// Configuración del servicio
export interface YouTubeServiceConfig {
  apiKey: string;
  cacheEnabled: boolean;
  cacheMaxAge: number; // minutos
  maxRetries: number;
  retryDelay: number; // milisegundos
  requestTimeout: number; // milisegundos
  userAgent: string;
}

// Playlist de YouTube
export interface YouTubePlaylist {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelId: string;
  videoCount: number;
  viewCount: number;
  lastUpdated: string;
}

// Item de playlist
export interface YouTubePlaylistItem {
  id: string;
  playlistId: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  position: number;
  duration: number;
  channelTitle: string;
  videoUrl: string;
}

// Recomendaciones basadas en un video
export interface YouTubeRecommendations {
  relatedVideos: YouTubeVideo[];
  recommendedChannels: {
    channelId: string;
    channelTitle: string;
    thumbnail: string;
    videoCount: number;
    subscriberCount: number;
  }[];
}

// Estadísticas de cache
export interface CacheStats {
  size: number;
  maxSize: number;
  hitCount: number;
  missCount: number;
  hitRate: number;
}

// Metadatos de audio extraído
export interface ExtractedAudioMetadata {
  title: string;
  artist: string;
  album: string;
  duration: number;
  thumbnail: string;
  filePath: string;
  fileSize: number;
  format: string;
  bitrate: number;
  sampleRate: number;
  channels: number;
}
