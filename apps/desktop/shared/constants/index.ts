export const APP_NAME = 'Chaos Music';
export const APP_VERSION = '0.2.0';

// Keep the existing filename during the refactor so current local libraries
// are not silently disconnected from their database.
export const DB_NAME = 'musicplayer.db';
export const DB_VERSION = 1;

export const IPC_CHANNELS = {
  LIBRARY_SCAN: 'library:scan',
  LIBRARY_GET_TRACKS: 'library:getTracks',
  LIBRARY_GET_ARTISTS: 'library:getArtists',
  LIBRARY_GET_ALBUMS: 'library:getAlbums',
  LIBRARY_GET_GENRES: 'library:getGenres',
  LIBRARY_SEARCH: 'library:search',
  LIBRARY_ADD_FOLDER: 'library:addFolder',
  LIBRARY_REMOVE_FOLDER: 'library:removeFolder',
  LIBRARY_GET_FOLDERS: 'library:getFolders',
  YOUTUBE_SEARCH: 'youtube:search',
  YOUTUBE_GET_VIDEO: 'youtube:getVideo',
  YOUTUBE_GET_STREAM_URL: 'youtube:getStreamUrl',
  YOUTUBE_EXTRACT_AUDIO: 'youtube:extractAudio',
  YOUTUBE_GET_TRENDING: 'youtube:getTrending',
  YOUTUBE_GET_RECOMMENDATIONS: 'youtube:getRecommendations',
  YOUTUBE_GET_PLAYLIST: 'youtube:getPlaylist',
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
  WINDOW_IS_MAXIMIZED: 'window:isMaximized',
} as const;

export const DEFAULT_VOLUME = 0.8;
export const MAX_VOLUME = 1;
export const MIN_VOLUME = 0;
export const SEEK_STEP = 5;
export const SIDEBAR_WIDTH = 240;
export const PLAYER_BAR_HEIGHT = 80;
export const HEADER_HEIGHT = 60;
export const SUPPORTED_AUDIO_FORMATS = ['.mp3', '.flac', '.m4a', '.wav', '.ogg', '.aac', '.wma'];
export const SUPPORTED_VIDEO_FORMATS = ['.mp4', '.webm', '.mkv'];
export const STORAGE_KEYS = {
  SETTINGS: 'chaos_music_settings',
  LAST_PLAYED_TRACK: 'chaos_music_last_played',
  QUEUE: 'chaos_music_queue',
  VOLUME: 'chaos_music_volume',
} as const;
