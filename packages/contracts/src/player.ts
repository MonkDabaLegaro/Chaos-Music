import type { Track } from './media';

export type RepeatMode = 'off' | 'one' | 'all';

export interface QueueItem {
  id: string;
  track: Track;
  addedAt: number;
  playCount: number;
}

export interface PlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  currentTrack: QueueItem | null;
  queue: QueueItem[];
  queueIndex: number;
  position: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  shuffle: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AudioEngine {
  load(track: Track): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  seek(positionSeconds: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  setMuted(muted: boolean): Promise<void>;
  getPosition(): number;
  getDuration(): number;
}
