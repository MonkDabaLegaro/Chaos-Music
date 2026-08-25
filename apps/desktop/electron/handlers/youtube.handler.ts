import { desktopApplication } from '../composition/createDesktopApplication';
import { registerHandler } from '../utils/ipc';

const youtube = desktopApplication.legacyYouTube;
const ok = <T>(data: T) => ({ success: true, data });
const failure = (error: unknown) => ({ success: false, error: error instanceof Error ? error.message : 'YouTube provider failed' });

registerHandler('youtube:search', async (_event, input: unknown) => {
  try {
    const options = typeof input === 'string' ? { query: input } : (input ?? {}) as Record<string, unknown>;
    return ok(await youtube.search({
      query: String(options.query ?? ''),
      type: (options.type as 'video' | 'playlist' | undefined) ?? 'video',
      maxResults: typeof options.limit === 'number' ? options.limit : 20,
    }));
  } catch (error) { return failure(error); }
});

for (const channel of ['youtube:getVideo', 'youtube:get-video']) {
  registerHandler(channel, async (_event, videoId: unknown) => {
    try { return ok(await youtube.getVideo(String(videoId ?? ''))); } catch (error) { return failure(error); }
  });
}

for (const channel of ['youtube:getStreamUrl', 'youtube:stream-url']) {
  registerHandler(channel, async (_event, videoId: unknown) => {
    try { return ok(await youtube.getStreamUrl(String(videoId ?? ''))); } catch (error) { return failure(error); }
  });
}

registerHandler('youtube:extractAudio', async (_event, videoId: unknown, options: unknown) => {
  try { return ok(await youtube.extractAudio(String(videoId ?? ''), (options ?? {}) as never)); } catch (error) { return failure(error); }
});

for (const channel of ['youtube:getTrending', 'youtube:get-trending']) {
  registerHandler(channel, async (_event, categoryId: unknown) => {
    try { return ok(await youtube.getTrending(categoryId ? String(categoryId) : undefined)); } catch (error) { return failure(error); }
  });
}

for (const channel of ['youtube:getRecommendations', 'youtube:get-recommended']) {
  registerHandler(channel, async (_event, videoId: unknown) => {
    try {
      if (!videoId) return ok([]);
      return ok(await youtube.getRecommendations(String(videoId)));
    } catch (error) { return failure(error); }
  });
}

for (const channel of ['youtube:getPlaylist', 'youtube:get-playlist']) {
  registerHandler(channel, async (_event, playlistId: unknown) => {
    try { return ok(await youtube.getPlaylist(String(playlistId ?? ''))); } catch (error) { return failure(error); }
  });
}
