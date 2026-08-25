import type { PlayerState, Track } from '../../../shared/types';
import { ipcService } from './ipc.service';

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
  addToQueue: (trackIds: string[]) => Promise<void>;
  clearQueue: () => Promise<void>;
  removeFromQueue: (index: number) => Promise<void>;
  reorderQueue: (fromIndex: number, toIndex: number) => Promise<void>;
  playTrack: (track: Track) => Promise<void>;
  playTracks: (tracks: Track[], startIndex?: number) => Promise<void>;
  togglePlayPause: () => Promise<void>;
}

class PlayerServiceImpl implements PlayerService {
  async play(): Promise<void> {
    const response = await ipcService.play();
    if (!response.success) {
      throw new Error(response.error || 'Failed to play');
    }
  }

  async pause(): Promise<void> {
    const response = await ipcService.pause();
    if (!response.success) {
      throw new Error(response.error || 'Failed to pause');
    }
  }

  async stop(): Promise<void> {
    const response = await ipcService.stop();
    if (!response.success) {
      throw new Error(response.error || 'Failed to stop');
    }
  }

  async next(): Promise<void> {
    const response = await ipcService.next();
    if (!response.success) {
      throw new Error(response.error || 'Failed to go to next');
    }
  }

  async previous(): Promise<void> {
    const response = await ipcService.previous();
    if (!response.success) {
      throw new Error(response.error || 'Failed to go to previous');
    }
  }

  async seek(position: number): Promise<void> {
    const response = await ipcService.seek(position);
    if (!response.success) {
      throw new Error(response.error || 'Failed to seek');
    }
  }

  async setVolume(volume: number): Promise<void> {
    const response = await ipcService.setVolume(volume);
    if (!response.success) {
      throw new Error(response.error || 'Failed to set volume');
    }
  }

  async setPosition(position: number): Promise<void> {
    const response = await ipcService.setPosition(position);
    if (!response.success) {
      throw new Error(response.error || 'Failed to set position');
    }
  }

  async setRepeat(mode: 'off' | 'all' | 'one'): Promise<void> {
    const response = await ipcService.setRepeat(mode);
    if (!response.success) {
      throw new Error(response.error || 'Failed to set repeat mode');
    }
  }

  async setShuffle(enabled: boolean): Promise<void> {
    const response = await ipcService.setShuffle(enabled);
    if (!response.success) {
      throw new Error(response.error || 'Failed to set shuffle');
    }
  }

  async getState(): Promise<PlayerState> {
    const response = await ipcService.getPlayerState();
    if (!response.success) {
      throw new Error(response.error || 'Failed to get player state');
    }
    return response.data!;
  }

  async addToQueue(trackIds: string[]): Promise<void> {
    const response = await ipcService.addToQueue(trackIds);
    if (!response.success) {
      throw new Error(response.error || 'Failed to add to queue');
    }
  }

  async clearQueue(): Promise<void> {
    const response = await ipcService.clearQueue();
    if (!response.success) {
      throw new Error(response.error || 'Failed to clear queue');
    }
  }

  async removeFromQueue(index: number): Promise<void> {
    const response = await ipcService.removeFromQueue(index);
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove from queue');
    }
  }

  async reorderQueue(fromIndex: number, toIndex: number): Promise<void> {
    const response = await ipcService.reorderQueue(fromIndex, toIndex);
    if (!response.success) {
      throw new Error(response.error || 'Failed to reorder queue');
    }
  }

  async playTrack(track: Track): Promise<void> {
    await this.stop();
    await this.addToQueue([track.id]);
    await this.play();
  }

  async playTracks(tracks: Track[], startIndex = 0): Promise<void> {
    await this.stop();
    await this.clearQueue();
    const trackIds = tracks.map(t => t.id);
    await this.addToQueue(trackIds);
    await this.setPosition(startIndex);
    await this.play();
  }

  async togglePlayPause(): Promise<void> {
    const state = await this.getState();
    if (state.isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
  }
}

export const playerService = new PlayerServiceImpl();
