import type { QueueItem, RepeatMode, Track } from '@chaos-music/contracts';

export class QueueState {
  private items: QueueItem[] = [];
  private index = -1;
  private repeatMode: RepeatMode = 'off';
  private shuffle = false;
  private sequence = 0;

  constructor(private readonly random: () => number = Math.random) {}

  setTracks(tracks: Track[], startIndex = 0) {
    this.items = tracks.map(track => this.toItem(track));
    this.index = this.items.length === 0 ? -1 : Math.max(0, Math.min(startIndex, this.items.length - 1));
  }

  addTracks(tracks: Track[]) {
    this.items.push(...tracks.map(track => this.toItem(track)));
    if (this.index === -1 && this.items.length > 0) this.index = 0;
  }

  remove(index: number) {
    if (index < 0 || index >= this.items.length) return;
    this.items.splice(index, 1);
    if (this.items.length === 0) this.index = -1;
    else if (index < this.index) this.index -= 1;
    else if (this.index >= this.items.length) this.index = this.items.length - 1;
  }

  reorder(fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= this.items.length || toIndex >= this.items.length || fromIndex === toIndex) return;
    const [item] = this.items.splice(fromIndex, 1);
    this.items.splice(toIndex, 0, item);
    if (this.index === fromIndex) this.index = toIndex;
    else if (fromIndex < this.index && toIndex >= this.index) this.index -= 1;
    else if (fromIndex > this.index && toIndex <= this.index) this.index += 1;
  }

  clear() { this.items = []; this.index = -1; }
  setRepeatMode(mode: RepeatMode) { this.repeatMode = mode; }
  setShuffle(enabled: boolean) { this.shuffle = enabled; }

  current() { return this.index >= 0 ? this.items[this.index] ?? null : null; }
  getItems() { return [...this.items]; }
  getIndex() { return this.index; }
  getRepeatMode() { return this.repeatMode; }
  isShuffleEnabled() { return this.shuffle; }

  moveNext() {
    const next = this.nextIndex();
    if (next >= 0) this.index = next;
    return this.current();
  }

  movePrevious() {
    if (this.items.length === 0) return null;
    if (this.shuffle && this.items.length > 1) {
      this.index = this.pickRandomIndex();
      return this.current();
    }
    this.index = this.index <= 0 ? (this.repeatMode === 'all' ? this.items.length - 1 : 0) : this.index - 1;
    return this.current();
  }

  private nextIndex() {
    if (this.items.length === 0) return -1;
    if (this.repeatMode === 'one' && this.index >= 0) return this.index;
    if (this.shuffle && this.items.length > 1) return this.pickRandomIndex();
    const candidate = this.index + 1;
    if (candidate < this.items.length) return candidate;
    return this.repeatMode === 'all' ? 0 : -1;
  }

  private pickRandomIndex() {
    if (this.items.length <= 1) return Math.max(this.index, 0);
    let candidate = Math.floor(this.random() * this.items.length);
    if (candidate === this.index) candidate = (candidate + 1) % this.items.length;
    return candidate;
  }

  private toItem(track: Track): QueueItem {
    this.sequence += 1;
    return { id: `${track.id}:${this.sequence}`, track, addedAt: Date.now(), playCount: 0 };
  }
}
