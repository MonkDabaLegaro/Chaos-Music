import type { MusicSource } from '@chaos-music/contracts';
import { SourceRegistry } from './SourceRegistry';

const source = (id: string): jest.Mocked<MusicSource> => ({
  id,
  displayName: id.toUpperCase(),
  search: jest.fn().mockResolvedValue([{ id: 'song', sourceId: id, title: 'Song', playable: true }]),
  resolvePlayableUrl: jest.fn().mockResolvedValue('https://example.test/audio'),
});

describe('SourceRegistry', () => {
  it('delegates search to the selected provider without provider branches', async () => {
    const registry = new SourceRegistry();
    const local = source('local');
    const remote = source('remote');
    registry.register(local);
    registry.register(remote);

    const results = await registry.search('remote', 'artist');
    expect(results[0].sourceId).toBe('remote');
    expect(remote.search).toHaveBeenCalledWith('artist');
    expect(local.search).not.toHaveBeenCalled();
  });

  it('rejects unknown source ids with a stable error code', async () => {
    await expect(new SourceRegistry().search('missing', 'x')).rejects.toMatchObject({ code: 'SOURCE_UNAVAILABLE' });
  });
});
