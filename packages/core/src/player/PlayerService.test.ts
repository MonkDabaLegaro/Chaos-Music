import type { AudioEngine, Track } from '@chaos-music/contracts';
import { PlayerService } from './PlayerService';

const track = (id: string): Track => ({ id, title: id, artist: 'artist', duration: 30, filePath: `/music/${id}.mp3`, playCount: 0, isFavorite: false, dateAdded: 'now' });

const engine = (): jest.Mocked<AudioEngine> => ({
  load: jest.fn().mockResolvedValue(undefined),
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  seek: jest.fn().mockResolvedValue(undefined),
  setVolume: jest.fn().mockResolvedValue(undefined),
  setMuted: jest.fn().mockResolvedValue(undefined),
  getPosition: jest.fn().mockReturnValue(0),
  getDuration: jest.fn().mockReturnValue(30),
});

describe('PlayerService', () => {
  it('loads and plays a selected track', async () => {
    const audio = engine();
    const service = new PlayerService(audio);
    await service.playTrack(track('a'));
    expect(audio.load).toHaveBeenCalledWith(expect.objectContaining({ id: 'a' }));
    expect(audio.play).toHaveBeenCalled();
    expect(service.getState().isPlaying).toBe(true);
  });

  it('moves to the next queued track', async () => {
    const audio = engine();
    const service = new PlayerService(audio);
    await service.playTracks([track('a'), track('b')]);
    await service.next();
    expect(service.getState().currentTrack?.track.id).toBe('b');
  });

  it('clamps volume to the renderer convention of zero to one', async () => {
    const audio = engine();
    const service = new PlayerService(audio);
    await service.setVolume(2);
    expect(audio.setVolume).toHaveBeenCalledWith(1);
  });
});
