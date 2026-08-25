/**
 * Tipos TypeScript para el servicio de reproducción de audio
 */

import { Track } from '../../shared/types';

// ============ Estados de Reproducción ============

/**
 * Estado actual de reproducción
 */
export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  currentTrack: QueueItem | null;
  queue: QueueItem[];
  queueIndex: number;
  position: number; // en segundos
  duration: number; // en segundos
  volume: number; // 0-100
  isMuted: boolean;
  repeatMode: RepeatMode;
  shuffle: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Modos de repetición disponibles
 */
export type RepeatMode = 'off' | 'one' | 'all';

/**
 * Modo de shuffle (reproducción aleatoria)
 */
export interface ShuffleState {
  isEnabled: boolean;
  shuffledIndices: number[];
}

// ============ Cola de Reproducción ============

/**
 * Elemento de la cola de reproducción
 */
export interface QueueItem {
  id: string;
  track: Track;
  addedAt: number;
  playCount: number;
}

/**
 * Opciones para añadir canciones a la cola
 */
export interface AddToQueueOptions {
  tracks: Track[];
  playNow?: boolean;
  insertAt?: number;
}

/**
 * Resultado de reordenar la cola
 */
export interface ReorderQueueResult {
  fromIndex: number;
  toIndex: number;
  newQueue: QueueItem[];
}

// ============ Ecualizador ============

/**
 * Banda individual del ecualizador (10 bandas estándar: 32Hz - 16kHz)
 */
export interface EqualizerBand {
  index: number;
  frequency: number; // Frecuencia en Hz
  gain: number; // Ganancia en dB (-12 a +12)
  quality: number; // Factor Q (ancho de banda)
}

/**
 * Frecuencias estándar para las 10 bandas del ecualizador
 */
export const EQUALIZER_BAND_FREQUENCIES = [
  32,    // Sub-bass
  64,    // Bass
  125,   // Low-mid
  250,   // Mid
  500,   // Mid
  1000,  // Mid-high
  2000,  // High-mid
  4000,  // High
  8000,  // Treble
  16000, // Brilliance
];

/**
 * Presets predefinidos del ecualizador
 */
export interface EqualizerPreset {
  name: string;
  description: string;
  bands: number[]; // Ganancias para cada banda en dB
}

/**
 * Presets disponibles del ecualizador
 */
export const EQUALIZER_PRESETS: EqualizerPreset[] = [
  {
    name: 'flat',
    description: 'Sin ecualización, respuesta plana',
    bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'rock',
    description: 'Énfasis en graves y agudos para música rock',
    bands: [4, 3, 1, -1, 0, 1, 3, 4, 4, 3],
  },
  {
    name: 'pop',
    description: 'Énfasis en medios para voces claras',
    bands: [2, 2, 1, 3, 4, 4, 3, 2, 1, 0],
  },
  {
    name: 'jazz',
    description: 'Énfasis en graves y medios-altos para instrumentos',
    bands: [3, 2, 1, 2, 1, 2, 2, 3, 2, 1],
  },
  {
    name: 'classical',
    description: 'Sonido equilibrado para música clásica',
    bands: [2, 2, 1, 0, 0, 0, 1, 2, 2, 2],
  },
  {
    name: 'bass_boost',
    description: 'Refuerzo de graves profundos',
    bands: [6, 5, 3, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'vocal',
    description: 'Énfasis en medios para voces',
    bands: [-2, -1, 0, 4, 5, 4, 2, 0, -1, -2],
  },
];

/**
 * Estado actual del ecualizador
 */
export interface EqualizerState {
  isEnabled: boolean;
  bands: EqualizerBand[];
  currentPreset: string | null;
}

// ============ Eventos ============

/**
 * Callback para eventos de reproducción
 */
export type PlaybackEventCallback = (state: PlaybackState) => void;

/**
 * Tipos de eventos de reproducción
 */
export type PlaybackEventType = 
  | 'play' 
  | 'pause' 
  | 'stop' 
  | 'ended' 
  | 'error' 
  | 'timeupdate' 
  | 'progress'
  | 'volumechange'
  | 'muted'
  | 'unmuted'
  | 'shufflechange'
  | 'repeatchange'
  | 'queuechange'
  | 'trackchange';

// ============ Acciones del Reproductor ============

/**
 * Acciones disponibles para el reproductor
 */
export interface PlayerActions {
  // Control de reproducción
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  togglePlay: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setPosition: (position: number) => Promise<void>;
  
  // Control de volumen
  setVolume: (volume: number) => Promise<void>;
  setMute: (muted: boolean) => Promise<void>;
  toggleMute: () => Promise<void>;
  
  // Modos de reproducción
  toggleShuffle: () => void;
  setShuffle: (enabled: boolean) => void;
  cycleRepeatMode: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  
  // Cola de reproducción
  addToQueue: (tracks: Track[], playNow?: boolean) => Promise<void>;
  removeFromQueue: (itemId: string) => Promise<void>;
  reorderQueue: (fromIndex: number, toIndex: number) => Promise<void>;
  clearQueue: () => Promise<void>;
  playQueueItem: (index: number) => Promise<void>;
  playNextInQueue: () => Promise<void>;
  
  // Ecualizador
  setEqualizerBand: (bandIndex: number, gain: number) => void;
  applyEqualizerPreset: (presetName: string) => void;
  resetEqualizer: () => void;
  setEqualizerEnabled: (enabled: boolean) => void;
  
  // Estado
  getState: () => PlaybackState;
  getQueue: () => QueueItem[];
}

// ============ Opciones de Reproducción ============

/**
 * Opciones para la reproducción de audio
 */
export interface PlaybackOptions {
  startPosition?: number;
  fadeIn?: boolean;
  fadeInDuration?: number;
  gapless?: boolean;
}

// ============ Tipos de Fuente de Audio ============

/**
 * Tipo de fuente de audio
 */
export type AudioSourceType = 'local' | 'youtube' | 'stream';

/**
 * Fuente de audio configurable
 */
export interface AudioSource {
  type: AudioSourceType;
  url: string;
  headers?: Record<string, string>;
  startOffset?: number;
}
