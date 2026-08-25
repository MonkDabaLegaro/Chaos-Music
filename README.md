# Chaos Music

Chaos Music is a local-first music player being developed as a platform-independent application rather than an Electron-only product. The current host is desktop (Electron + React); the architecture is being prepared so an Android host can reuse the same domain and application logic later.

> Status: active foundation refactor. Desktop is the current runnable target. Android support is architectural groundwork, not a released APK/AAB yet.

## Product direction

Chaos Music is intended to provide:

- local music library discovery and indexing;
- metadata-based browsing by tracks, artists, albums and genres;
- local playback, queue, repeat and shuffle;
- favorites, recent playback and playlists;
- search;
- external music/discovery providers behind a generic source interface;
- a restrained dark forest visual identity rather than a Spotify clone or terminal-themed gimmick.

Some of these flows predate the architecture refactor and are still being migrated behind stable contracts. See `docs/ARCHITECTURE.md` for the current boundaries.

## Current architecture

```text
apps/desktop
  electron/        Electron host, IPC transport, SQLite/filesystem/provider composition
  renderer/        React UI and renderer-hosted audio
  shared/          legacy desktop types/constants being reduced during migration

packages
  contracts/       platform-independent ports and media types
  core/            library/player/queue/source application logic
  adapters-desktop/desktop implementations/wrappers for legacy infrastructure
  design-system/   Chaos Forest tokens
  ui/              reusable MUI theme built from the design tokens
```

Dependency direction:

```text
Desktop host / UI
       |
       v
      Core
       |
       v
   Contracts
       ^
       |
Desktop adapters
```

The core packages do not depend on Electron, Node filesystem APIs, SQLite, browser globals or Android APIs.

## Chaos Forest

The visual system uses deep neutral surfaces with forest and moss accents. Strong green is reserved for state: active navigation, playback, progress, focus and status.

Primary identity tokens include:

```text
background.deep      #070B09
background.surface   #0C1210
background.elevated  #111A16
forest.900           #102A1D
forest.700           #174D32
forest.500           #27734C
forest.400           #3C9466
accent.moss          #7DB58B
accent.signal        #63E69A
text.primary         #E5EEE8
text.secondary       #95A69B
text.muted           #56645C
border.default       #1D2B23
```

## Requirements

- Node.js 22+
- npm 10+
- supported desktop OS for Electron
- local audio files for the library workflow
- provider-specific external tools/credentials only when using a provider that requires them

## Development

```bash
git clone https://github.com/MonkDabaLegaro/Chaos-Music.git
cd Chaos-Music
npm install
npm run dev
```

Verification commands:

```bash
npm run typecheck
npm test -- --runInBand
npm run build
```

The root is an npm workspace and delegates desktop development to `@chaos-music/desktop`.

## Android direction

The planned first Android host is Capacitor because the current UI is React DOM based. Android-only behavior such as background playback, media sessions and storage permissions can be implemented through native Capacitor plugins backed by Kotlin without moving business rules out of `packages/core`.

No Android binary is currently published.

## External sources

Provider-specific code is isolated behind `MusicSource`. The current YouTube-related implementation remains a desktop adapter during migration. It is not part of the player core, and future providers can be registered without adding provider-name conditionals to playback logic.

## Documentation

- `docs/ARCHITECTURE.md` — implemented architecture and dependency rules
- `docs/API.md` — desktop IPC/source boundaries
- `docs/INSTALLATION.md` — local setup
- `docs/CONFIGURATION.md` — runtime and provider configuration
- `docs/superpowers/specs/2026-08-25-modular-android-foundation-design.md` — approved design
- `docs/superpowers/plans/2026-08-25-modular-android-foundation.md` — migration plan

## License

No repository license file is currently present. Until a license is explicitly added, do not assume reuse rights from an old README badge or statement.
