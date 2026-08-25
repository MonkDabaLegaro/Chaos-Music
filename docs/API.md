# Chaos Music Desktop Boundaries

Chaos Music currently uses Electron IPC as a local transport. This is not a public network API.

## Response envelope

Migrated handlers return:

```ts
type IPCResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

## Library

Canonical renderer channels currently include:

- `library:scan`
- `library:get-tracks`
- `library:get-albums`
- `library:get-artists`
- `library:get-genres`
- `library:get-playlists`
- `library:get-recently-played`
- `library:get-stats`
- `library:add-folder`
- `library:remove-folder`
- `library:get-folders`
- `library:update-track`
- `library:delete-track`

The main transport also accepts historical camel-style aliases such as `library:getTracks` while migration is in progress.

Core-backed operations route through `LibraryService`. Playlist/metadata/stats/exclusion endpoints still use the transitional desktop persistence facade and should not be treated as platform-neutral contracts yet.

## Generic music sources

- `sources:list` — returns registered source ids/display names
- `sources:search(sourceId, query)` — provider-neutral search
- `sources:resolve-playable-url(sourceId, itemId)` — resolve a provider item when supported

Provider errors are normalized before crossing core boundaries.

## YouTube compatibility endpoints

Existing provider-specific flows remain available during migration:

- `youtube:search`
- `youtube:getVideo` / `youtube:get-video`
- `youtube:getStreamUrl` / `youtube:stream-url`
- `youtube:extractAudio`
- `youtube:getTrending` / `youtube:get-trending`
- `youtube:getRecommendations` / `youtube:get-recommended`
- `youtube:getPlaylist` / `youtube:get-playlist`

These endpoints are desktop/provider adapters, not domain APIs.

## Player

The current renderer no longer sends basic player commands to Electron main. `player.service.ts` calls the platform-independent `PlayerService`, which delegates playback to the renderer `WebAudioEngine`.

The core supports play, pause, stop, seek, volume, mute, repeat, shuffle, queue replacement/add/remove/reorder, next and previous.

## Window controls

The preload exposes minimize, maximize, close and synchronous maximized-state lookup through the narrow Electron bridge.
