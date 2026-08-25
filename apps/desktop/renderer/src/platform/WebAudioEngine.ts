import type { AudioEngine, Track } from '@chaos-music/contracts';

function toMediaUrl(filePath: string) {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(filePath)) return filePath;
  const normalized = filePath.replace(/\\/g, '/');
  if (/^[a-zA-Z]:\//.test(normalized)) return `file:///${encodeURI(normalized)}`;
  return `file://${encodeURI(normalized.startsWith('/') ? normalized : `/${normalized}`)}`;
}

export class WebAudioEngine implements AudioEngine {
  private readonly audio = new Audio();
  private endedListeners = new Set<() => void>();

  constructor() {
    this.audio.preload = 'metadata';
    this.audio.addEventListener('ended', () => this.endedListeners.forEach(listener => listener()));
  }

  async load(track: Track) {
    this.audio.src = toMediaUrl(track.filePath);
    this.audio.load();
  }

  async play() { await this.audio.play(); }
  async pause() { this.audio.pause(); }
  async stop() { this.audio.pause(); this.audio.currentTime = 0; }
  async seek(positionSeconds: number) { this.audio.currentTime = positionSeconds; }
  async setVolume(volume: number) { this.audio.volume = Math.max(0, Math.min(1, volume)); }
  async setMuted(muted: boolean) { this.audio.muted = muted; }
  getPosition() { return Number.isFinite(this.audio.currentTime) ? this.audio.currentTime : 0; }
  getDuration() { return Number.isFinite(this.audio.duration) ? this.audio.duration : 0; }

  onEnded(listener: () => void) {
    this.endedListeners.add(listener);
    return () => this.endedListeners.delete(listener);
  }
}
