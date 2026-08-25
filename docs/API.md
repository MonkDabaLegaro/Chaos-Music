# Documentación de la API

Esta documentación describe la API de MusicPlayer, incluyendo los handlers IPC, servicios y canales de comunicación.

## 📡 API de Handlers IPC

Los handlers IPC permiten la comunicación entre el proceso de renderizado (React) y el proceso principal (Electron).

### Canales de Biblioteca (`library:*`)

#### `library:scan`

Escanea las carpetas de la biblioteca en busca de archivos de audio.

**Solicitud:**
```typescript
// Renderer
ipcRenderer.invoke('library:scan'): Promise<IPCResponse<LibraryStats>>
```

**Respuesta:**
```typescript
{
  success: true,
  data: {
    totalTracks: 150,
    totalArtists: 45,
    totalAlbums: 78,
    totalGenres: 12,
    totalDuration: 3600000,
    totalSize: 5000000000
  }
}
```

**Ejemplo de uso:**
```typescript
import { ipcRenderer } from 'electron';

const result = await ipcRenderer.invoke('library:scan');
if (result.success) {
  console.log(`Escaneados ${result.data.totalTracks} temas`);
}
```

---

#### `library:getTracks`

Obtiene la lista de canciones de la biblioteca.

**Solicitud:**
```typescript
ipcRenderer.invoke('library:getTracks', options?: {
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'artist' | 'album' | 'duration' | 'dateAdded';
  sortOrder?: 'asc' | 'desc';
  filter?: {
    artist?: string;
    album?: string;
    genre?: string;
    favorites?: boolean;
  };
}): Promise<IPCResponse<Track[]>>
```

**Respuesta:**
```typescript
{
  success: true,
  data: [
    {
      id: 'uuid-1234',
      title: 'Canción de prueba',
      artist: 'Artista de prueba',
      album: 'Álbum de prueba',
      duration: 180000,
      filePath: '/path/to/file.mp3',
      coverPath: '/path/to/cover.jpg',
      genre: 'Rock',
      year: 2023,
      playCount: 5,
      isFavorite: true,
      dateAdded: '2024-01-15T10:00:00Z'
    }
  ]
}
```

---

#### `library:getArtists`

Obtiene la lista de artistas de la biblioteca.

**Solicitud:**
```typescript
ipcRenderer.invoke('library:getArtists'): Promise<IPCResponse<Artist[]>>
```

**Respuesta:**
```typescript
{
  success: true,
  data: [
    {
      id: 'uuid-5678',
      name: 'Nombre del artista',
      imagePath: '/path/to/artist.jpg',
      genres: ['Rock', 'Pop'],
      trackCount: 25,
      albumCount: 5
    }
  ]
}
```

---

#### `library:getAlbums`

Obtiene la lista de álbumes de la biblioteca.

**Solicitud:**
```typescript
ipcRenderer.invoke('library:getAlbums', options?: {
  artistId?: string;
}): Promise<IPCResponse<Album[]>>
```

---

#### `library:getGenres`

Obtiene la lista de géneros de la biblioteca.

**Solicitud:**
```typescript
ipcRenderer.invoke('library:getGenres'): Promise<IPCResponse<Genre[]>>
```

---

#### `library:search`

Busca en la biblioteca.

**Solicitud:**
```typescript
ipcRenderer.invoke('library:search', query: string, filters?: {
  tracks?: boolean;
  albums?: boolean;
  artists?: boolean;
  playlists?: boolean;
}): Promise<IPCResponse<SearchResult[]>>
```

---

#### `library:addFolder`

Añade una carpeta a la biblioteca.

**Solicitud:**
```typescript
ipcRenderer.invoke('library:addFolder', path: string): Promise<IPCResponse<LibraryFolder>>
```

---

#### `library:removeFolder`

Elimina una carpeta de la biblioteca.

**Solicitud:**
```typescript
ipcRenderer.invoke('library:removeFolder', folderId: string): Promise<IPCResponse<void>>
```

---

#### `library:getFolders`

Obtiene las carpetas configuradas de la biblioteca.

**Solicitud:**
```typescript
ipcRenderer.invoke('library:getFolders'): Promise<IPCResponse<LibraryFolder[]>>
```

---

### Canales del Reproductor (`player:*`)

#### `player:play`

Inicia la reproducción.

**Solicitud:**
```typescript
ipcRenderer.invoke('player:play'): Promise<IPCResponse<void>>
```

---

#### `player:pause`

Pausa la reproducción.

**Solicitud:**
```typescript
ipcRenderer.invoke('player:pause'): Promise<IPCResponse<void>>
```

---

#### `player:resume`

Reanuda la reproducción.

**Solicitud:**
```typescript
ipcRenderer.invoke('player:resume'): Promise<IPCResponse<void>>
```

---

#### `player:stop`

Detiene la reproducción.

**Solicitud:**
```typescript
ipcRenderer.invoke('player:stop'): Promise<IPCResponse<void>>
```

---

#### `player:seek`

Busca a una posición específica.

**Solicitud:**
```typescript
ipcRenderer.invoke('player:seek', position: number): Promise<IPCResponse<void>>
```

**Parámetros:**
- `position`: Posición en milisegundos

**Ejemplo:**
```typescript
// Ir al minuto 2:30 (150 segundos = 150000 ms)
await ipcRenderer.invoke('player:seek', 150000);
```

---

#### `player:setVolume`

Establece el volumen.

**Solicitud:**
```typescript
ipcRenderer.invoke('player:setVolume', volume: number): Promise<IPCResponse<void>>
```

**Parámetros:**
- `volume`: Volumen entre 0 y 100

**Ejemplo:**
```typescript
await ipcRenderer.invoke('player:setVolume', 75);
```

---

#### `player:getStatus`

Obtiene el estado actual del reproductor.

**Solicitud:**
```typescript
ipcRenderer.invoke('player:getStatus'): Promise<IPCResponse<PlayerState>>
```

**Respuesta:**
```typescript
{
  success: true,
  data: {
    isPlaying: true,
    currentTrack: { /* Track */ },
    queue: [ /* Track[] */ ],
    position: 120000,
    volume: 80,
    repeatMode: 'off',
    shuffle: false
  }
}
```

---

#### `player:addToQueue`

Añade una canción a la cola.

**Solicitud:**
```typescript
ipcRenderer.invoke('player:addToQueue', track: Track): Promise<IPCResponse<QueueItem>>
```

---

#### `player:clearQueue`

Limpia la cola de reproducción.

**Solicitud:**
```typescript
ipcRenderer.invoke('player:clearQueue'): Promise<IPCResponse<void>>
```

---

#### `player:shuffle`

Activa o desactiva el modo aleatorio.

**Solicitud:**
```typescript
ipcRenderer.invoke('player:shuffle', enabled: boolean): Promise<IPCResponse<void>>
```

---

#### `player:repeat`

Cambia el modo de repetición.

**Solicitud:**
```typescript
ipcRenderer.invoke('player:repeat', mode: 'off' | 'all' | 'one'): Promise<IPCResponse<void>>
```

---

### Canales de YouTube (`youtube:*`)

#### `youtube:search`

Busca videos en YouTube.

**Solicitud:**
```typescript
ipcRenderer.invoke('youtube:search', options: {
  query: string;
  type?: 'video' | 'playlist' | 'channel';
  maxResults?: number;
  pageToken?: string;
}): Promise<IPCResponse<YouTubeSearchResult>>
```

**Respuesta:**
```typescript
{
  success: true,
  data: {
    videos: [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Video de prueba',
        description: 'Descripción del video',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        channelTitle: 'Canal de prueba',
        duration: 240,
        viewCount: 1000000,
        publishedAt: '2024-01-01T00:00:00Z'
      }
    ],
    nextPageToken: 'CAoQAA',
    totalResults: 100
  }
}
```

---

#### `youtube:getVideo`

Obtiene información de un video específico.

**Solicitud:**
```typescript
ipcRenderer.invoke('youtube:getVideo', videoId: string): Promise<IPCResponse<YouTubeVideo>>
```

---

#### `youtube:getStreamUrl`

Obtiene la URL de streaming de un video.

**Solicitud:**
```typescript
ipcRenderer.invoke('youtube:getStreamUrl', videoId: string): Promise<IPCResponse<YouTubeStreamConfig>>
```

---

#### `youtube:extractAudio`

Extrae el audio de un video.

**Solicitud:**
```typescript
ipcRenderer.invoke('youtube:extractAudio', videoId: string, options?: {
  format?: 'mp3' | 'aac' | 'ogg';
  quality?: number;
  bitrate?: number;
}): Promise<IPCResponse<ExtractedAudioMetadata>>
```

---

#### `youtube:getTrending`

Obtiene los videos trending.

**Solicitud:**
```typescript
ipcRenderer.invoke('youtube:getTrending', categoryId?: string): Promise<IPCResponse<YouTubeVideo[]>>
```

---

#### `youtube:getRecommendations`

Obtiene recomendaciones basadas en un video.

**Solicitud:**
```typescript
ipcRenderer.invoke('youtube:getRecommendations', videoId: string): Promise<IPCResponse<YouTubeRecommendations>>
```

---

#### `youtube:getPlaylist`

Obtiene información de una playlist.

**Solicitud:**
```typescript
ipcRenderer.invoke('youtube:getPlaylist', playlistId: string): Promise<IPCResponse<YouTubePlaylist>>
```

---

### Canales de Playlist (`playlist:*`)

#### `playlist:getAll`

Obtiene todas las playlists.

**Solicitud:**
```typescript
ipcRenderer.invoke('playlist:getAll'): Promise<IPCResponse<Playlist[]>>
```

---

#### `playlist:getById`

Obtiene una playlist específica.

**Solicitud:**
```typescript
ipcRenderer.invoke('playlist:getById', playlistId: string): Promise<IPCResponse<Playlist>>
```

---

#### `playlist:create`

Crea una nueva playlist.

**Solicitud:**
```typescript
ipcRenderer.invoke('playlist:create', playlist: {
  name: string;
  description?: string;
  coverPath?: string;
}): Promise<IPCResponse<Playlist>>
```

---

#### `playlist:update`

Actualiza una playlist.

**Solicitud:**
```typescript
ipcRenderer.invoke('playlist:update', playlistId: string, updates: {
  name?: string;
  description?: string;
  coverPath?: string;
}): Promise<IPCResponse<Playlist>>
```

---

#### `playlist:delete`

Elimina una playlist.

**Solicitud:**
```typescript
ipcRenderer.invoke('playlist:delete', playlistId: string): Promise<IPCResponse<void>>
```

---

#### `playlist:addTrack`

Añade una canción a una playlist.

**Solicitud:**
```typescript
ipcRenderer.invoke('playlist:addTrack', playlistId: string, trackId: string): Promise<IPCResponse<PlaylistTrack>>
```

---

#### `playlist:removeTrack`

Elimina una canción de una playlist.

**Solicitud:**
```typescript
ipcRenderer.invoke('playlist:removeTrack', playlistId: string, trackId: string): Promise<IPCResponse<void>>
```

---

#### `playlist:reorderTracks`

Reordena las canciones de una playlist.

**Solicitud:**
```typescript
ipcRenderer.invoke('playlist:reorderTracks', playlistId: string, trackIds: string[]): Promise<IPCResponse<void>>
```

---

### Canales de Ventana (`window:*`)

#### `window:minimize`

Minimiza la ventana.

**Solicitud:**
```typescript
ipcRenderer.send('window:minimize');
```

---

#### `window:maximize`

Maximiza o restaura la ventana.

**Solicitud:**
```typescript
ipcRenderer.send('window:maximize');
```

---

#### `window:close`

Cierra la ventana.

**Solicitud:**
```typescript
ipcRenderer.send('window:close');
```

---

#### `window:isMaximized`

Obtiene si la ventana está maximizada.

**Solicitud:**
```typescript
ipcRenderer.invoke('window:isMaximized'): Promise<boolean>
```

---

## 🎯 Métodos del Servicio de Biblioteca

### `LibraryService`

```typescript
class LibraryService {
  // Escanea una carpeta y añade las canciones encontradas
  async scanFolder(path: string): Promise<LibraryStats>;
  
  // Obtiene todas las canciones
  getTracks(options?: GetTracksOptions): Track[];
  
  // Obtiene todos los artistas
  getArtists(): Artist[];
  
  // Obtiene todos los álbumes
  getAlbums(artistId?: string): Album[];
  
  // Obtiene todos los géneros
  getGenres(): Genre[];
  
  // Busca en la biblioteca
  search(query: string, filters?: SearchFilters): SearchResult[];
  
  // Añade una carpeta
  addFolder(path: string): LibraryFolder;
  
  // Elimina una carpeta
  removeFolder(folderId: string): void;
  
  // Obtiene las carpetas
  getFolders(): LibraryFolder[];
  
  // Obtiene estadísticas
  getStats(): LibraryStats;
}
```

---

## 🎵 Métodos del Servicio de Reproductor

### `AudioPlayerService`

```typescript
class AudioPlayerService {
  // Control de reproducción
  async play(): Promise<void>;
  async pause(): Promise<void>;
  async stop(): Promise<void>;
  async togglePlay(): Promise<void>;
  async next(): Promise<void>;
  async previous(): Promise<void>;
  async seek(position: number): Promise<void>;
  async fastForward(seconds?: number): Promise<void>;
  async rewind(seconds?: number): Promise<void>;
  
  // Control de volumen
  async setVolume(volume: number): Promise<void>;
  async setMute(muted: boolean): Promise<void>;
  async toggleMute(): Promise<void>;
  
  // Modos de reproducción
  setShuffle(enabled: boolean): void;
  setRepeatMode(mode: RepeatMode): void;
  cycleRepeatMode(): void;
  
  // Cola de reproducción
  async addToQueue(track: Track): Promise<void>;
  async removeFromQueue(queueItemId: string): Promise<void>;
  async clearQueue(): Promise<void>;
  async playQueueItem(index: number): Promise<void>;
  async reorderQueue(fromIndex: number, toIndex: number): Promise<void>;
  
  // Ecualizador
  async setEqualizerEnabled(enabled: boolean): Promise<void>;
  async setEqualizerBand(band: number, gain: number): Promise<void>;
  async setEqualizerPreset(preset: string): Promise<void>;
  
  // Estado
  getState(): PlaybackState;
  getCurrentTrack(): Track | null;
  getQueue(): QueueItem[];
}
```

---

## 🎬 Métodos del Servicio de YouTube

### `YouTubeService`

```typescript
class YouTubeService {
  // Inicializa el servicio
  initialize(config?: Partial<YouTubeServiceConfig>): void;
  
  // Busca videos
  async search(options: YouTubeSearchOptions): Promise<YouTubeSearchResult>;
  
  // Obtiene información de un video
  async getVideo(videoId: string): Promise<YouTubeVideo>;
  
  // Obtiene URL de streaming
  async getStreamUrl(videoId: string): Promise<YouTubeStreamConfig>;
  
  // Extrae audio de un video
  async extractAudio(videoId: string, options?: AudioExtractOptions): Promise<ExtractedAudioMetadata>;
  
  // Obtiene videos trending
  async getTrending(categoryId?: string): Promise<YouTubeVideo[]>;
  
  // Obtiene recomendaciones
  async getRecommendations(videoId: string): Promise<YouTubeRecommendations>;
  
  // Obtiene playlist
  async getPlaylist(playlistId: string): Promise<YouTubePlaylist>;
  
  // Obtiene items de una playlist
  async getPlaylistItems(playlistId: string): Promise<YouTubePlaylistItem[]>;
}
```

---

## 📡 Canales de Comunicación

### Constantes de Canales

```typescript
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
```

---

## 🔄 Escuchadores de Eventos (Listeners)

### Eventos del Reproductor

El renderer puede escuchar eventos del reproductor:

```typescript
import { ipcRenderer } from 'electron';

ipcRenderer.on('player:play', () => {
  console.log('Reproducción iniciada');
});

ipcRenderer.on('player:pause', () => {
  console.log('Reproducción pausada');
});

ipcRenderer.on('player:stop', () => {
  console.log('Reproducción detenida');
});

ipcRenderer.on('player:timeupdate', (_, position: number) => {
  console.log(`Posición: ${position}ms`);
});

ipcRenderer.on('player:trackChanged', (_, track: Track) => {
  console.log(`Nueva canción: ${track.title}`);
});

ipcRenderer.on('player:volumechange', (_, volume: number) => {
  console.log(`Volumen: ${volume}%`);
});

ipcRenderer.on('player:error', (_, error: string) => {
  console.error(`Error del reproductor: ${error}`);
});
```

### Eventos de la Biblioteca

```typescript
ipcRenderer.on('library:scanStart', () => {
  console.log('Escaneo iniciado');
});

ipcRenderer.on('library:scanProgress', (_, progress: number) => {
  console.log(`Progreso: ${progress}%`);
});

ipcRenderer.on('library:scanComplete', (_, stats: LibraryStats) => {
  console.log(`Escaneo completado: ${stats.totalTracks} canciones`);
});

ipcRenderer.on('library:scanError', (_, error: string) => {
  console.error(`Error en escaneo: ${error}`);
});
```

---

## 📝 Tipos Compartidos

### IPCResponse

Respuesta estándar de todos los handlers IPC:

```typescript
export interface IPCResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Track

Representa una canción en la biblioteca:

```typescript
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumId?: string;
  duration: number;
  filePath: string;
  coverPath?: string;
  genre?: string;
  year?: number;
  trackNumber?: number;
  discNumber?: number;
  playCount: number;
  isFavorite: boolean;
  dateAdded: string;
  lastPlayed?: string;
}
```

### PlayerState

Estado del reproductor:

```typescript
export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  position: number;
  volume: number;
  repeatMode: 'off' | 'all' | 'one';
  shuffle: boolean;
}
```

### YouTubeVideo

Video de YouTube:

```typescript
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  duration: number;
  viewCount: number;
  publishedAt: string;
}
```
