# Chaos Music Architecture

This document describes the code that exists in the modular foundation branch. Product ideas that are not implemented belong in the design spec or roadmap, not in this file.

## Architectural style

Chaos Music is a TypeScript workspace containing a modular monolith. Electron is the current desktop host; it is not the application architecture.

```text
+---------------------------------------------------+
| apps/desktop                                      |
|  Electron host | React renderer | composition     |
+-----------------------------+---------------------+
                              |
                              v
+---------------------------------------------------+
| packages/core                                     |
| library | player | queue | source registry        |
+-----------------------------+---------------------+
                              |
                              v
+---------------------------------------------------+
| packages/contracts                                |
| media types | repository | scanner | audio/source |
+-----------------------------+---------------------+
                              ^
                              |
+---------------------------------------------------+
| packages/adapters-desktop                         |
| SQLite/scanner wrappers | YouTube source adapter  |
+---------------------------------------------------+
```

## Workspace layout

### `apps/desktop`

`electron/` owns Electron boot, IPC transports and the composition root. Infrastructure such as the existing SQLite database, file scanner and external-provider implementation remains here while adapters are extracted.

`renderer/` owns the React application and the browser-capable audio implementation. Web Audio/HTML media objects are intentionally not created in Electron main.

`shared/` contains desktop-era types/constants retained for compatibility. New platform-neutral APIs should use `packages/contracts`; this folder should shrink over time.

### `packages/contracts`

Owns ports and stable media/application-facing types. It must remain free from host/platform implementations.

Current ports include:

- `MusicRepository`
- `LibraryScanner`
- `AudioEngine`
- `MusicSource`

### `packages/core`

Owns application behavior that can run without Electron or browser globals:

- `LibraryService`
- `QueueState`
- `PlayerService`
- `SourceRegistry`
- `AppError`

### `packages/adapters-desktop`

Implements or wraps desktop infrastructure behind contract interfaces. During the migration it deliberately wraps existing implementations instead of duplicating SQL/scanner/provider logic.

### `packages/design-system` and `packages/ui`

`design-system` owns platform-neutral Chaos Forest tokens. `ui` creates the React/MUI theme from those tokens. Android can later consume the token package without importing MUI.

## Composition root

`apps/desktop/electron/composition/createDesktopApplication.ts` is where concrete desktop infrastructure is bound to contracts.

Database initialization happens there, not as a side effect of loading an IPC handler.

## Library flow

```text
React renderer
  -> preload bridge
  -> library IPC transport
  -> LibraryService
  -> MusicRepository / LibraryScanner
  -> desktop adapter
  -> SQLite / filesystem scanner
```

The IPC layer maps transport inputs/results; core library validation and orchestration are independent of Electron.

A transitional persistence facade remains for playlist, queue, metadata-editing, exclusion and stats endpoints that have not yet been extracted into dedicated core modules.

## Player flow

```text
React UI/usePlayer
  -> renderer player service
  -> core PlayerService + QueueState
  -> AudioEngine
  -> WebAudioEngine (renderer)
```

The previous Electron-main audio service was removed because it instantiated browser media APIs from the wrong process.

## External source flow

`SourceRegistry` selects providers by id and delegates `search`/playable URL resolution through `MusicSource`. The current YouTube implementation is wrapped by `LegacyYouTubeMusicSource` and registered by the desktop composition root.

Provider-specific rich IPC endpoints are retained as compatibility endpoints while the UI migrates to the generic source API.

## IPC bridge

The preload exposes `window.electronAPI` as the canonical bridge and `window.electron` as a compatibility alias. Only narrow invoke/on/off/send/window-control methods are exposed; Node integration remains disabled in the renderer and context isolation is enabled.

Library transport temporarily accepts both historical camel-style and renderer kebab-style channel names to avoid a flag-day migration.

## Error handling

Core errors use `AppError` with stable categories:

- validation
- not found
- source unavailable
- filesystem permission
- unsupported media
- persistence failure
- playback failure
- external-provider failure
- unknown

IPC adapters convert errors to serializable `{ success, data?, error? }` responses.

## Android boundary

Android is not yet an application workspace containing fake implementations. The important constraint is already enforced architecturally: application logic sits in `packages/core`, platform capabilities are contracts, and the React UI/design tokens are separated from Electron.

The intended first host is Capacitor, with Kotlin plugins for native capabilities when needed.

## Testing and verification

Core tests use fakes rather than Electron/SQLite. Legacy desktop service tests remain available for infrastructure behavior. GitHub Actions runs install, typecheck, tests and build for `main`, `refactor/**` and pull requests.
