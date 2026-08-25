import type { TrackFilter } from '@chaos-music/contracts';
import { desktopApplication } from '../composition/createDesktopApplication';
import { registerHandler } from '../utils/ipc';

const { library, legacyDatabase } = desktopApplication;

type Handler = (...args: unknown[]) => Promise<unknown> | unknown;

function registerAliases(channels: string[], handler: Handler) {
  for (const channel of channels) {
    registerHandler(channel, async (_event, ...args) => handler(...args));
  }
}

function message(error: unknown) {
  return error instanceof Error ? error.message : 'Error desconocido';
}

async function transport<T>(operation: () => Promise<T> | T, fallback?: T) {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    console.error('[library IPC]', error);
    return { success: false, data: fallback, error: message(error) };
  }
}

registerAliases(['library:scan'], async (libraryIdOrPath) => {
  return transport(async () => {
    const value = String(libraryIdOrPath ?? '');
    const folders = await library.getLibraries();
    let target = folders.find(folder => folder.id === value || folder.path === value);
    if (!target) target = await library.addLibrary(value);
    const result = await library.scan(target.id);
    return { ...result, trackCount: result.addedTracks + result.updatedTracks };
  });
});

registerAliases(['library:getScanStatus', 'library:get-scan-status'], () => transport(() => library.getScanStatus()));
registerAliases(['library:cancelScan', 'library:cancel-scan'], () => transport(() => { library.cancelScan(); }));

registerAliases(['library:getTracks', 'library:get-tracks'], (filter) => transport(async () => {
  const result = await library.getTracks(filter as TrackFilter | undefined);
  return result.tracks;
}, []));
registerAliases(['library:getTrack', 'library:get-track'], (trackId) => transport(() => library.getTrack(String(trackId ?? '')), null));
registerAliases(['library:getArtists', 'library:get-artists'], () => transport(() => library.getArtists(), []));
registerAliases(['library:getAlbums', 'library:get-albums'], (value) => {
  const artistId = typeof value === 'string'
    ? value
    : typeof value === 'object' && value && 'artistId' in value
      ? String((value as { artistId?: unknown }).artistId ?? '') || undefined
      : undefined;
  return transport(() => library.getAlbums(artistId), []);
});
registerAliases(['library:getGenres', 'library:get-genres'], () => transport(() => library.getGenres(), []));
registerAliases(['library:search'], (query) => transport(() => library.search(String(query ?? '')), { tracks: [], artists: [], albums: [] }));
registerAliases(['library:getFavorites', 'library:get-favorites'], () => transport(() => library.getFavorites(), []));
registerAliases(['library:toggleFavorite', 'library:toggle-favorite'], (trackId) => transport(() => library.toggleFavorite(String(trackId ?? ''))));
registerAliases(['library:getRecentlyPlayed', 'library:get-recently-played'], (limit) => transport(() => library.getRecentlyPlayed(typeof limit === 'number' ? limit : undefined), []));

registerAliases(['library:addFolder', 'library:add-folder'], (pathOrInput, name) => {
  const path = typeof pathOrInput === 'string' ? pathOrInput : String((pathOrInput as { path?: unknown } | undefined)?.path ?? '');
  const resolvedName = typeof name === 'string' ? name : typeof pathOrInput === 'object' && pathOrInput ? String((pathOrInput as { name?: unknown }).name ?? '') || undefined : undefined;
  return transport(() => library.addLibrary(path, resolvedName));
});
registerAliases(['library:removeFolder', 'library:remove-folder'], (libraryId) => transport(() => library.removeLibrary(String(libraryId ?? ''))));
registerAliases(['library:getFolders', 'library:get-folders'], () => transport(() => library.getLibraries(), []));
registerAliases(['library:updateLibrary', 'library:update-library'], (libraryId, input) => {
  const data = (input ?? {}) as { name?: string; path?: string; is_active?: number; isActive?: boolean };
  return transport(() => library.updateLibrary(String(libraryId ?? ''), {
    name: data.name,
    path: data.path,
    isActive: data.isActive ?? (data.is_active === undefined ? undefined : Boolean(data.is_active)),
  }));
});

// Transitional persistence façade. These channels remain supported while
// playlists, queue, metadata editing and statistics are extracted into core.
registerAliases(['library:getStats', 'library:get-stats'], () => transport(() => legacyDatabase.getLibraryStats(), null));
registerAliases(['library:deleteTrack', 'library:delete-track'], (trackId) => transport(() => legacyDatabase.deleteTrack(String(trackId ?? ''))));
registerAliases(['library:updateTrack', 'library:update-track'], (trackOrPayload, maybeData) => {
  const payload = typeof trackOrPayload === 'object' && trackOrPayload
    ? trackOrPayload as { trackId?: unknown; updates?: Record<string, unknown> }
    : undefined;
  const trackId = payload ? String(payload.trackId ?? '') : String(trackOrPayload ?? '');
  const updates = payload?.updates ?? (maybeData as Record<string, unknown> | undefined) ?? {};
  return transport(() => legacyDatabase.updateTrack(trackId, updates), null);
});

registerAliases(['library:getPlaylists', 'library:get-playlists'], () => transport(() => legacyDatabase.getAllPlaylists(), []));
registerAliases(['library:createPlaylist', 'playlist:create'], (nameOrInput, description) => {
  const input = typeof nameOrInput === 'object' && nameOrInput
    ? nameOrInput as { name?: unknown; description?: unknown }
    : { name: nameOrInput, description };
  return transport(() => legacyDatabase.addPlaylist({
    name: String(input.name ?? '').trim(),
    description: input.description ? String(input.description) : undefined,
    is_smart: 0,
    is_system: 0,
  }));
});
registerAliases(['library:deletePlaylist', 'playlist:delete'], (playlistId) => transport(() => legacyDatabase.deletePlaylist(String(playlistId ?? ''))));
registerAliases(['library:addToPlaylist', 'playlist:add-track'], (playlistOrPayload, maybeTrackId) => {
  const payload = typeof playlistOrPayload === 'object' && playlistOrPayload
    ? playlistOrPayload as { playlistId?: unknown; trackId?: unknown }
    : undefined;
  const playlistId = payload ? String(payload.playlistId ?? '') : String(playlistOrPayload ?? '');
  const trackId = payload ? String(payload.trackId ?? '') : String(maybeTrackId ?? '');
  return transport(() => legacyDatabase.addTrackToPlaylist(playlistId, trackId));
});
registerAliases(['library:removeFromPlaylist', 'playlist:remove-track'], (playlistOrPayload, maybeTrackId) => {
  const payload = typeof playlistOrPayload === 'object' && playlistOrPayload
    ? playlistOrPayload as { playlistId?: unknown; trackId?: unknown }
    : undefined;
  const playlistId = payload ? String(payload.playlistId ?? '') : String(playlistOrPayload ?? '');
  const trackId = payload ? String(payload.trackId ?? '') : String(maybeTrackId ?? '');
  return transport(() => legacyDatabase.removeTrackFromPlaylist(playlistId, trackId));
});
registerAliases(['library:getPlaylistTracks', 'playlist:get-tracks'], (playlistId) => transport(() => legacyDatabase.getPlaylistTracks(String(playlistId ?? '')), []));

registerAliases(['library:addToQueue'], (trackId, sourceType, sourceId) => transport(() => legacyDatabase.addToQueue(String(trackId ?? ''), sourceType as string | undefined, sourceId as string | undefined)));
registerAliases(['library:getQueue'], () => transport(() => legacyDatabase.getQueue(), []));
registerAliases(['library:clearQueue'], () => transport(() => legacyDatabase.clearQueue()));
registerAliases(['library:removeFromQueue'], (queueItemId) => transport(() => legacyDatabase.removeFromQueue(Number(queueItemId))));

registerAliases(['library:addExcludedPath'], (path) => transport(() => legacyDatabase.addExcludedPath(String(path ?? ''))));
registerAliases(['library:removeExcludedPath'], (path) => transport(() => legacyDatabase.removeExcludedPath(String(path ?? ''))));
registerAliases(['library:getExcludedPaths'], () => transport(() => legacyDatabase.getExcludedPaths(), []));
