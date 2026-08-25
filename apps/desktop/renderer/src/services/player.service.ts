import { PlayerService as CorePlayerService } from '@chaos-music/core';
import type { Track } from '../../../shared/types';
import type { PlayerState } from '../../../shared/types';
import { WebAudioEngine } from '../platform/WebAudioEngine';

export interface PlayerService {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setPosition: (position: number) => Promise<void>;
  setRepeat: (mode: 'off' | 'all' | 'one') => Promise<void>;
  setShuffle: (enabled: boolean) => Promise<void>;
  getState: () => Promise<PlayerState>;
  addToQueue: (tracks: Track[]) => Promise<void>;
  clearQueue: () => Promise<void>;
  removeFromQueue: (index: number) => Promise<void>;
  reorderQueue: (fromIndex: number, toIndex: number) => Promise<void>;
  playTrack: (track: Track) => Promise<void>;
  playTracks: (tracks: Track[], startIndex?: number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
}

const audioEngine = new WebAudioEngine();
const core = new CorePlayerService(audioEngine);
audioEngine.onEnded(() => { void core.next(); });

class PlayerServiceImpl implements PlayerService {
  play() { return core.play(); }
  pause() { return core.pause(); }
  stop() { return core.stop(); }
  next() { return core.next(); }
  previous() { return core.previous(); }
  seek(position: number) { return core.seek(position); }
  setVolume(volume: number) { return core.setVolume(volume); }
  setPosition(position: number) { return core.seek(position); }
  async setRepeat(mode: 'off' | 'all' | 'one') { core.setRepeatMode(mode); }
  async setShuffle(enabled: boolean) { core.setShuffle(enabled); }
  addToQueue(tracks: Track[]) { return core.addToQueue(tracks); }
  clearQueue() { return core.clearQueue(); }
  removeFromQueue(index: number) { return core.removeFromQueue(index); }
  reorderQueue(fromIndex: number, toIndex: number) { return core.reorderQueue(fromIndex, toIndex); }
  playTrack(track: Track) { return core.playTrack(track); }
  playTracks(tracks: Track[], startIndex = 0) { return core.playTracks(tracks, startIndex); }

  async togglePlayPause() {
    core.getState().isPlaying ? await core.pause() : await core.play();
  }

  async getState(): Promise<PlayerState> {
    const state = core.getState();
    return {
      isPlaying: state.isPlaying,
      currentTrack: state.currentTrack?.track ?? null,
      queue: state.queue.map(item => item.track),
      position: state.position,
      volume: state.volume,
      repeatMode: state.repeatMode === 'one' ? 'one' : state.repeatMode,
      shuffle: state.shuffle,
    };
  }
}

export const playerService = new PlayerServiceImpl();
