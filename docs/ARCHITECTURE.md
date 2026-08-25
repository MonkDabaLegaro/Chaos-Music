# Documentación de Arquitectura

Esta documentación describe la arquitectura técnica de MusicPlayer, incluyendo la estructura del proyecto, tecnologías utilizadas y patrones de diseño.

## 🏗️ Visión General de la Arquitectura

MusicPlayer utiliza una arquitectura de tres capas basada en **Electron** para crear una aplicación de escritorio multiplataforma:

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     React Renderer                       │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │ Pages    │ │Components│ │ Hooks    │ │ Services │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                        IPC COMMUNICATION                         │
│              (Electron IPC - Preload Bridge)                    │
├─────────────────────────────────────────────────────────────────┤
│                         MAIN LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Electron Main Process                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │ Handlers │ │ Services │ │  Utils   │ │ IPC Utils│   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                         DATA LAYER                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  SQLite DB      │  │  File System    │  │  External APIs  │ │
│  │  (better-sqlite3)│  │  (Node.js fs)   │  │  (YouTube)      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes Principales

1. **Main Process (Electron)**: Maneja la ventana de la aplicación, acceso al sistema de archivos y comunicación con APIs externas
2. **Renderer Process (React)**: Interfaz de usuario responsiva
3. **IPC Bridge**: Comunicación segura entre procesos
4. **Services**: Lógica de negocio reutilizable

---

## 📁 Estructura de Directorios

```
music-player/
├── __mocks__/                    # Mocks para tests
├── docs/                         # Documentación
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── CONFIGURATION.md
│   ├── INSTALLATION.md
│   └── TROUBLESHOOTING.md
├── src/
│   ├── main/                     # Proceso principal (Node.js)
│   │   ├── handlers/             # Handlers IPC
│   │   │   ├── index.ts
│   │   │   ├── library.handler.ts
│   │   │   ├── player.handler.ts
│   │   │   ├── playlist.handler.ts
│   │   │   └── youtube.handler.ts
│   │   ├── preload/              # Preload scripts
│   │   │   └── index.ts
│   │   ├── services/             # Servicios del main
│   │   │   ├── audioPlayer/      # Servicio de reproducción
│   │   │   │   ├── audioPlayer.service.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── __tests__/
│   │   │   ├── database/         # Servicio de base de datos
│   │   │   │   ├── database.service.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── __tests__/
│   │   │   ├── fileScanner/      # Escáner de archivos
│   │   │   │   ├── scanner.service.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── __tests__/
│   │   │   └── youtube/          # Servicio de YouTube
│   │   │       ├── youtube.service.ts
│   │   │       ├── types.ts
│   │   │       └── __tests__/
│   │   ├── utils/                # Utilidades del main
│   │   │   ├── ipc.ts
│   │   │   └── path.ts
│   │   └── index.ts              # Entry point del main
│   ├── renderer/                 # Proceso de renderizado (React)
│   │   ├── index.html
│   │   └── src/
│   │       ├── components/       # Componentes React
│   │       │   ├── common/       # Componentes compartidos
│   │       │   │   ├── Button.tsx
│   │       │   │   ├── Dialog.tsx
│   │       │   │   ├── EmptyState.tsx
│   │       │   │   ├── IconButton.tsx
│   │       │   │   ├── LoadingSpinner.tsx
│   │       │   │   ├── SearchInput.tsx
│   │       │   │   ├── Slider.tsx
│   │       │   │   └── Toast.tsx
│   │       │   ├── layout/       # Componentes de layout
│   │       │   │   ├── BottomNav.tsx
│   │       │   │   ├── Header.tsx
│   │       │   │   ├── MainLayout.tsx
│   │       │   │   ├── NowPlaying.tsx
│   │       │   │   ├── PlayerBar.tsx
│   │       │   │   ├── Sidebar.tsx
│   │       │   │   └── SidebarItem.tsx
│   │       │   ├── library/      # Componentes de biblioteca
│   │       │   │   ├── AlbumCard.tsx
│   │       │   │   ├── AlbumGrid.tsx
│   │       │   │   ├── ArtistCard.tsx
│   │       │   │   ├── ArtistGrid.tsx
│   │       │   │   ├── GenreList.tsx
│   │       │   │   ├── TrackItem.tsx
│   │       │   │   └── TrackList.tsx
│   │       │   ├── player/       # Componentes del reproductor
│   │       │   │   ├── Equalizer.tsx
│   │       │   │   ├── MiniPlayer.tsx
│   │       │   │   ├── PlayerControls.tsx
│   │       │   │   ├── ProgressBar.tsx
│   │       │   │   ├── QueueList.tsx
│   │       │   │   └── VolumeControl.tsx
│   │       │   ├── playlist/     # Componentes de playlists
│   │       │   └── youtube/      # Componentes de YouTube
│   │       ├── hooks/            # Custom hooks
│   │       │   ├── useKeyboardShortcuts.ts
│   │       │   ├── useLibrary.ts
│   │       │   ├── usePlayer.ts
│   │       │   ├── usePlaylist.ts
│   │       │   ├── useQueue.ts
│   │       │   ├── useSearch.ts
│   │       │   ├── useTheme.ts
│   │       │   └── useYouTube.ts
│   │       ├── pages/            # Páginas de la app
│   │       │   ├── ExplorePage.tsx
│   │       │   ├── HomePage.tsx
│   │       │   ├── LibraryPage.tsx
│   │       │   └── SearchPage.tsx
│   │       ├── services/         # Servicios del renderer
│   │       │   ├── ipc.service.ts
│   │       │   ├── library.service.ts
│   │       │   ├── player.service.ts
│   │       │   └── youtube.service.ts
│   │       ├── store/            # Estado global (Redux)
│   │       │   ├── index.ts
│   │       │   └── slices/
│   │       ├── styles/           # Estilos globales
│   │       │   ├── globalStyles.ts
│   │       │   ├── theme.ts
│   │       │   └── typography.ts
│   │       ├── utils/            # Utilidades del renderer
│   │       ├── App.tsx
│   │       └── main.tsx
│   ├── shared/                   # Código compartido
│   │   ├── constants/            # Constantes compartidas
│   │   │   └── index.ts
│   │   └── types/                # Tipos TypeScript
│   │       └── index.ts
│   └── test/                     # Tests de integración
├── .eslintrc.json
├── .prettierrc
├── electron.vite.config.ts
├── jest.config.js
├── jest.setup.js
├── package.json
├── tsconfig.json
└── tsconfig.node.json
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend (Renderer)

| Tecnología | Propósito | Versión |
|------------|-----------|---------|
| **React** | Biblioteca de UI | ^18.2.0 |
| **TypeScript** | Lenguaje tipado | ^5.3.3 |
| **Redux Toolkit** | Gestión de estado | ^2.0.1 |
| **React Redux** | Bindings de Redux | ^9.0.4 |
| **React Query** | Fetching de datos | ^5.17.0 |
| **Vite** | Build tool | ^5.0.10 |

### Backend (Main)

| Tecnología | Propósito | Versión |
|------------|-----------|---------|
| **Electron** | Runtime de escritorio | ^28.0.0 |
| **Node.js** | Runtime de JavaScript | >=18.0.0 |
| **better-sqlite3** | Base de datos local | ^9.2.2 |
| **music-metadata** | Lectura de metadatos | ^7.14.0 |
| **fluent-ffmpeg** | Procesamiento de audio | ^2.1.2 |
| **youtube-dl-exec** | Integración YouTube | ^2.4.2 |

### Herramientas de Desarrollo

| Tecnología | Propósito |
|------------|-----------|
| **Jest** | Testing unitario |
| **Testing Library** | Testing de componentes |
| **ESLint** | Linting |
| **Prettier** | Formateo de código |
| **Husky** | Git hooks |

---

## 🔄 Flujo de Datos (Data Flow)

### Arquitectura de Flujo de Datos

```
┌──────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                              │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         REACT COMPONENTS                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │
│  │   UI Events  │──▶│ Custom Hooks │──▶│  Actions     │             │
│  └──────────────┘   └──────────────┘   └──────────────┘             │
│                                                 │                    │
└─────────────────────────────────────────────────┼────────────────────┘
                                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         REDUX STORE                                   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │
│  │ librarySlice │   │ playerSlice  │   │  queueSlice  │             │
│  └──────────────┘   └──────────────┘   └──────────────┘             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │
│  │ searchSlice  │   │  uiSlice     │   │              │             │
│  └──────────────┘   └──────────────┘   └──────────────┘             │
│                                                 │                    │
└─────────────────────────────────────────────────┼────────────────────┘
                                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         IPC SERVICES                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │
│  │   library    │──▶│   player     │──▶│   youtube    │             │
│  │   service    │   │   service    │   │   service    │             │
│  └──────────────┘   └──────────────┘   └──────────────┘             │
│                                                 │                    │
└─────────────────────────────────────────────────┼────────────────────┘
                                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         IPC HANDLERS (Main Process)                   │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │
│  │   handlers   │   │   handlers   │   │   handlers   │             │
│  └──────────────┘   └──────────────┘   └──────────────┘             │
│                                                 │                    │
└─────────────────────────────────────────────────┼────────────────────┘
                                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         MAIN SERVICES                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │
│  │fileScanner   │   │audioPlayer   │   │  database    │             │
│  └──────────────┘   └──────────────┘   └──────────────┘             │
│  ┌──────────────┐   ┌──────────────┐                                  │
│  │youtube       │   │              │                                  │
│  └──────────────┘   └──────────────┘                                  │
│                                                 │                    │
└─────────────────────────────────────────────────┼────────────────────┘
                                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         DATA SOURCES                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐             │
│  │  File System │   │  SQLite DB   │   │  YouTube API │             │
│  └──────────────┘   └──────────────┘   └──────────────┘             │
└──────────────────────────────────────────────────────────────────────┘
```

### Ciclo de Vida de una Solicitud

1. **Acción del usuario**: El usuario hace clic en "Reproducir"
2. **Hook**: `usePlayer` detecta la acción
3. **Dispatch**: Se despacha una acción a Redux
4. **IPC**: El servicio IPC envía un mensaje al main process
5. **Handler**: El handler IPC correspondiente recibe el mensaje
6. **Servicio**: El servicio de audio ejecuta la acción
7. **Respuesta**: El resultado vuelve al renderer
8. **Update**: Redux actualiza el estado
9. **UI**: Los componentes se re-renderizan

---

## 🎨 Patrones de Diseño

### 1. Patrón de Servicios (Service Pattern)

```typescript
// src/main/services/audioPlayer/audioPlayer.service.ts

class AudioPlayerService {
  private state: PlaybackState;
  private audioContext: AudioContext | null = null;
  
  async play(): Promise<void> {
    // Implementación
  }
  
  async pause(): Promise<void> {
    // Implementación
  }
  
  async seek(position: number): Promise<void> {
    // Implementación
  }
}

export const audioPlayerService = new AudioPlayerService();
```

### 2. Patrón de Manejadores IPC (IPC Handler Pattern)

```typescript
// src/main/handlers/player.handler.ts

ipcMain.handle('player:play', async () => {
  try {
    await audioPlayerService.play();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

### 3. Patrón de Componentes (Component Pattern)

```typescript
// src/renderer/src/components/player/PlayerControls.tsx

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export function PlayerControls({ isPlaying, onPlay, onPause }: PlayerControlsProps) {
  return (
    <div className="controls">
      <button onClick={isPlaying ? onPause : onPlay}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
}
```

### 4. Patrón de Slice (Redux Slice Pattern)

```typescript
// src/renderer/src/store/slices/player.slice.ts

const playerSlice = createSlice({
  name: 'player',
  initialState: initialPlayerState,
  reducers: {
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<Track | null>) => {
      state.currentTrack = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
  },
});
```

### 5. Patrón de Hooks Personalizados (Custom Hook Pattern)

```typescript
// src/renderer/src/hooks/usePlayer.ts

export function usePlayer() {
  const dispatch = useDispatch();
  const { isPlaying, currentTrack } = useSelector((state) => state.player);
  
  const play = useCallback(() => {
    ipcRenderer.invoke('player:play');
    dispatch(setPlaying(true));
  }, [dispatch]);
  
  const pause = useCallback(() => {
    ipcRenderer.invoke('player:pause');
    dispatch(setPlaying(false));
  }, [dispatch]);
  
  return { isPlaying, currentTrack, play, pause };
}
```

---

## 📊 Diagrama de Componentes

### Componentes de la Interfaz

```
App (Root Component)
├── MainLayout
│   ├── Header
│   │   ├── SearchInput
│   │   └── UserMenu
│   ├── Sidebar
│   │   ├── SidebarItem (Biblioteca)
│   │   ├── SidebarItem (Explorar)
│   │   ├── SidebarItem (Buscar)
│   │   └── PlaylistList
│   ├── MainContent
│   │   ├── HomePage
│   │   │   ├── RecentlyPlayed
│   │   │   ├── FeaturedContent
│   │   │   └── RecommendedContent
│   │   ├── LibraryPage
│   │   │   ├── AlbumGrid
│   │   │   │   └── AlbumCard
│   │   │   ├── ArtistGrid
│   │   │   │   └── ArtistCard
│   │   │   ├── TrackList
│   │   │   │   └── TrackItem
│   │   │   └── GenreList
│   │   ├── SearchPage
│   │   │   └── SearchResults
│   │   └── ExplorePage
│   │       ├── YouTubeSearch
│   │       └── YouTubeResults
│   └── BottomNav
│       ├── NowPlaying
│       └── PlayerBar
│           ├── ProgressBar
│           ├── PlayerControls
│           ├── VolumeControl
│           └── QueueList
```

### Componentes del Reproductor

```
Player (Estado Global)
├── AudioContext (Web Audio API)
│   ├── SourceNode
│   ├── GainNode (Volumen)
│   ├── EqualizerFilters (10 bandas)
│   └── DestinationNode
├── AudioElement (HTMLAudioElement)
└── Queue (Cola de reproducción)
    └── QueueItem[]
```

### Servicios del Sistema

```
Main Process
├── AudioPlayerService
│   ├── Web Audio API
│   ├── FFmpeg integration
│   └── Queue management
├── FileScannerService
│   ├── File system traversal
│   ├── Metadata extraction
│   └── Duplicate detection
├── DatabaseService
│   ├── SQLite connection
│   ├── CRUD operations
│   └── Index management
└── YouTubeService
    ├── yt-dlp integration
    ├── Streaming URL extraction
    └── Caching
```

---

## 🔐 Seguridad

### Aislamiento de Procesos

MusicPlayer implementa el modelo de seguridad de Electron:

1. **Main Process**: Acceso completo al sistema
2. **Renderer Process**: Sandboxed, sin acceso directo al sistema
3. **Preload Script**: Puente seguro entre procesos

### Contenido Seguro

- **CSP**: Content Security Policy configurado
- **Node Integration**: Deshabilitado en el renderer
- **Context Isolation**: Habilitado

### Validación de Datos

```typescript
// src/shared/types/index.ts

export interface Track {
  id: string;
  title: string;
  artist: string;
  // ...
}

// Validación con TypeScript
function validateTrack(data: unknown): Track {
  if (!isTrack(data)) {
    throw new Error('Invalid track data');
  }
  return data;
}
```

---

## 🚀 Rendimiento

### Optimizaciones

1. **Virtualización**: Listas virtuales para grandes colecciones
2. **Lazy Loading**: Carga diferida de componentes
3. **Memoización**: `useMemo` y `React.memo` para evitar re-renderizados
4. **Web Workers**: Procesamiento en segundo plano
5. **Base de datos indexada**: Consultas optimizadas

### Métricas de Rendimiento

| Operación | Objetivo | Actual |
|-----------|----------|--------|
| Escaneo de biblioteca | < 10s (1000 archivos) | ~5s |
| Búsqueda | < 100ms | ~50ms |
| Cambio de canción | < 200ms | ~150ms |
| Inicio de aplicación | < 3s | ~2s |

---

## 📈 Escalabilidad

### Estructura de Base de Datos

```sql
-- Tabla de canciones
CREATE TABLE tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  album_id TEXT,
  duration INTEGER,
  file_path TEXT UNIQUE,
  cover_path TEXT,
  genre TEXT,
  year INTEGER,
  play_count INTEGER DEFAULT 0,
  is_favorite INTEGER DEFAULT 0,
  date_added TEXT
);

-- Índices para optimización
CREATE INDEX idx_tracks_artist ON tracks(artist);
CREATE INDEX idx_tracks_album ON tracks(album_id);
CREATE INDEX idx_tracks_genre ON tracks(genre);
```

### Caché

- **Memory Cache**: Para búsquedas frecuentes
- **Disk Cache**: Para thumbnails y metadatos
- **Database Cache**: SQLite WAL mode para mejor rendimiento
