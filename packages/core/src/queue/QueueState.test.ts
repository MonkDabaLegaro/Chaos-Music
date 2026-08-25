import type { Track } from '@chaos-music/contracts';
import { QueueState } from './QueueState';

const track = (id: string): Track => ({ id, title: id, artist: 'artist', duration: 1, filePath: `/music/${id}.mp3`, playCount: 0, isFavorite: false, dateAdded: 'now' });

describe('QueueState', () => {
  it('navigates sequentially and respects repeat all', () => {
    const queue = new QueueState();
    queue.setTracks([track('a'), track('b')]);
    expect(queue.current()?.track.id).toBe('a');
    expect(queue.moveNext()?.track.id).toBe('b');
    expect(queue.moveNext()?.track.id).toBe('b');
    queue.setRepeatMode('all');
    expect(queue.moveNext()?.track.id).toBe('a');
  });

  it('uses injected randomness for shuffle without replaying the current item', () => {
    const queue = new QueueState(() => 0);
    queue.setTracks([track('a'), track('b'), track('c')]);
    queue.setShuffle(true);
    expect(queue.moveNext()?.track.id).toBe('b');
  });

  it('keeps the current item stable when the queue is reordered', () => {
    const queue = new QueueState();
    queue.setTracks([track('a'), track('b'), track('c')], 1);
    queue.reorder(1, 2);
    expect(queue.current()?.track.id).toBe('b');
  });
});
