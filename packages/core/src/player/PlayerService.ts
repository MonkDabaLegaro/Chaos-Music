import type { AudioEngine, PlayerState, RepeatMode, Track } from '@chaos-music/contracts';
import { AppError } from '../errors/AppError';
import { QueueState } from '../queue/QueueState';

export class PlayerService {
  private isPlaying = false;
  private isPaused = false;
  private isStopped = true;
  private isMuted = false;
  private volume = 1;
  private error: string | null = null;

  constructor(
    private readonly engine: AudioEngine,
    private readonly queue = new QueueState(),
  ) {}

  async play() {
    try {
      const current = this.queue.current();
      if (!current) return;
      await this.engine.play();
      this.isPlaying = true;
      this.isPaused = false;
      this.isStopped = false;
      this.error = null;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Playback failed';
      throw AppError.fromUnknown(error, 'PLAYBACK_FAILURE');
    }
  }

  async pause() {
    await this.engine.pause();
    this.isPlaying = false;
    this.isPaused = true;
  }

  async stop() {
    await this.engine.stop();
    this.isPlaying = false;
    this.isPaused = false;
    this.isStopped = true;
  }

  async seek(position: number) { await this.engine.seek(Math.max(0, position)); }

  async setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    await this.engine.setVolume(this.volume);
  }

  async setMuted(muted: boolean) {
    this.isMuted = muted;
    await this.engine.setMuted(muted);
  }

  setRepeatMode(mode: RepeatMode) { this.queue.setRepeatMode(mode); }
  setShuffle(enabled: boolean) { this.queue.setShuffle(enabled); }

  async playTrack(track: Track) {
    this.queue.setTracks([track], 0);
    await this.loadCurrentAndPlay();
  }

  async playTracks(tracks: Track[], startIndex = 0) {
    this.queue.setTracks(tracks, startIndex);
    await this.loadCurrentAndPlay();
  }

  async addToQueue(tracks: Track[]) { this.queue.addTracks(tracks); }
  async clearQueue() { this.queue.clear(); await this.stop(); }
  async removeFromQueue(index: number) { this.queue.remove(index); }
  async reorderQueue(fromIndex: number, toIndex: number) { this.queue.reorder(fromIndex, toIndex); }

  async next() {
    const previous = this.queue.current();
    const current = this.queue.moveNext();
    if (!current || current === previous) {
      if (current && this.queue.getRepeatMode() === 'one') await this.loadCurrentAndPlay();
      else if (!current) await this.stop();
      return;
    }
    await this.loadCurrentAndPlay();
  }

  async previous() {
    this.queue.movePrevious();
    if (this.queue.current()) await this.loadCurrentAndPlay();
  }

  getState(): PlayerState {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      isStopped: this.isStopped,
      currentTrack: this.queue.current(),
      queue: this.queue.getItems(),
      queueIndex: this.queue.getIndex(),
      position: this.engine.getPosition(),
      duration: this.engine.getDuration(),
      volume: this.volume,
      isMuted: this.isMuted,
      repeatMode: this.queue.getRepeatMode(),
      shuffle: this.queue.isShuffleEnabled(),
      isLoading: false,
      error: this.error,
    };
  }

  private async loadCurrentAndPlay() {
    const current = this.queue.current();
    if (!current) return;
    try {
      await this.engine.load(current.track);
      await this.play();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Playback failed';
      throw AppError.fromUnknown(error, 'PLAYBACK_FAILURE');
    }
  }
}
