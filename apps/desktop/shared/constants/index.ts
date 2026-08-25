// App constants
export const APP_NAME = 'MusicPlayer';
export const APP_VERSION = '1.0.0';

// Database constants
export const DB_NAME = 'musicplayer.db';
export const DB_VERSION = 1;

// IPC Channel names
export const IPC_CHANNELS = {
  // Library
  LIBRARY_SCAN: 'library:scan',
  LIBRARY_GET_TRACKS: 'library:getTracks',
  LIBRARY_GET_ARTISTS: 'library:getArtists',
  LIBRARY_GET_ALBUMS: 'library:getAlbums',
  LIBRARY_GET_GENRES: 'library:getGenres',
  LIBRARY_SEARCH: 'library:search',
  LIBRARY_ADD_FOLDER: 'library:addFolder',
  LIBRARY_REMOVE_FOLDER: 'library:removeFolder',
  LIBRARY_GET_FOLDERS: 'library:getFolders',

  // Player
  PLAYER_PLAY: 'player:play',
  PLAYER_PAUSE: 'player:pause',
  PLAYER_RESUME: 'player:resume',
  PLAYER_STOP: 'player:stop',
  PLAYER_SEEK: 'player:seek',
  PLAYER_SET_VOLUME: 'player:setVolume',
  PLAYER_GET_STATUS: 'player:getStatus',
  PLAYER_ADD_TO_QUEUE: 'player:addToQueue',
  PLAYER_CLEAR_QUEUE: 'player:clearQueue',
  PLAYER_SHUFFLE: 'player:shuffle',
  PLAYER_REPEAT: 'player:repeat',

  // YouTube
  YOUTUBE_SEARCH: 'youtube:search',
  YOUTUBE_GET_VIDEO: 'youtube:getVideo',
  YOUTUBE_GET_STREAM_URL: 'youtube:getStreamUrl',
  YOUTUBE_EXTRACT_AUDIO: 'youtube:extractAudio',
  YOUTUBE_GET_TRENDING: 'youtube:getTrending',
  YOUTUBE_GET_RECOMMENDATIONS: 'youtube:getRecommendations',
  YOUTUBE_GET_PLAYLIST: 'youtube:getPlaylist',

  // Playlist
  PLAYLIST_GET_ALL: 'playlist:getAll',
  PLAYLIST_GET_BY_ID: 'playlist:getById',
  PLAYLIST_CREATE: 'playlist:create',
  PLAYLIST_UPDATE: 'playlist:update',
  PLAYLIST_DELETE: 'playlist:delete',
  PLAYLIST_ADD_TRACK: 'playlist:addTrack',
  PLAYLIST_REMOVE_TRACK: 'playlist:removeTrack',
  PLAYLIST_REORDER_TRACKS: 'playlist:reorderTracks',

  // Window
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
  WINDOW_IS_MAXIMIZED: 'window:isMaximized',
} as const;

// Audio constants
export const DEFAULT_VOLUME = 0.8;
export const MAX_VOLUME = 1;
export const MIN_VOLUME = 0;
export const SEEK_STEP = 5;

// UI constants
export const SIDEBAR_WIDTH = 240;
export const PLAYER_BAR_HEIGHT = 80;
export const HEADER_HEIGHT = 60;

// File types
export const SUPPORTED_AUDIO_FORMATS = ['.mp3', '.flac', '.m4a', '.wav', '.ogg', '.aac', '.wma'];
export const SUPPORTED_VIDEO_FORMATS = ['.mp4', '.webm', '.mkv'];

// Storage keys
export const STORAGE_KEYS = {
  SETTINGS: 'musicplayer_settings',
  LAST_PLAYED_TRACK: 'musicplayer_last_played',
  QUEUE: 'musicplayer_queue',
  VOLUME: 'musicplayer_volume',
} as const;
