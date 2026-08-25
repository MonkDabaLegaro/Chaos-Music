# Modular Android Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert Chaos Music from an Electron-shaped single package into an Android-ready TypeScript workspace with an explicit platform-independent core, desktop adapters, thin host boundaries, and the Chaos Forest design system while preserving the current desktop feature set.

**Architecture:** The repository becomes a small npm workspace. `packages/contracts` owns platform ports and shared application-facing types, `packages/core` owns use cases and normalized errors, `packages/design-system` owns visual tokens, and `apps/desktop` owns Electron, React, SQLite, filesystem, FFmpeg/metadata and external-provider infrastructure. Electron IPC is transport only; platform implementations are composed at the desktop entry point.

**Tech Stack:** TypeScript, npm workspaces, Electron, electron-vite, React 18, Redux Toolkit, TanStack Query, MUI, Jest, Testing Library, SQLite (`better-sqlite3`), music-metadata.

**Spec:** `docs/superpowers/specs/2026-08-25-modular-android-foundation-design.md`

## Global Constraints

- Android readiness is an architectural constraint; this plan does not ship an APK/AAB.
- Core packages must not import Electron, Node filesystem APIs, `better-sqlite3`, `fluent-ffmpeg`, `youtube-dl-exec`, browser-only globals, or Android APIs.
- Green accents are reserved for active/playing/focus/progress/status states; large surfaces remain dark and neutral.
- Do not introduce fake Android implementations just to populate directories.
- Preserve regression-friendly commits; do not squash phase commits.
- Documentation must describe actual implementation state, not aspirational files.

---

### Task 1: Establish a reproducible workspace and desktop host

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `tsconfig.node.json`
- Move: `src/main/**` -> `apps/desktop/electron/**`
- Move: `src/renderer/**` -> `apps/desktop/renderer/**`
- Move: `src/shared/**` -> `apps/desktop/shared/**` temporarily
- Create: `apps/desktop/package.json`
- Create: `apps/desktop/electron.vite.config.ts`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: current Electron main/preload/renderer entry points.
- Produces: workspace `@chaos-music/desktop` with root scripts delegating to it.

- [ ] **Step 1: Add workspace manifests and declare dependencies actually imported by the renderer**

Root `package.json` becomes private and delegates lifecycle commands to `@chaos-music/desktop`. Desktop dependencies must include `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, and `react-router-dom`, which are imported by current source but missing from the root manifest.

- [ ] **Step 2: Move source trees without changing their contents**

Reuse Git blobs/subtrees when possible so this commit is a structural move rather than a behavioral rewrite.

- [ ] **Step 3: Update electron-vite and TypeScript paths**

Use desktop-relative roots:

```ts
main.root = 'electron'
preload.root = 'electron/preload'
renderer.root = 'renderer'
```

Root TypeScript paths must expose workspace packages and desktop host aliases rather than `src/*`.

- [ ] **Step 4: Add CI baseline**

CI runs on pushes and pull requests with Node 22:

```yaml
- run: npm install
- run: npm run typecheck
- run: npm test -- --runInBand
- run: npm run build
```

- [ ] **Step 5: Commit**

```bash
git commit -m "refactor: establish workspace desktop host"
```

### Task 2: Introduce contracts and normalized application errors

**Files:**
- Create: `packages/contracts/package.json`
- Create: `packages/contracts/tsconfig.json`
- Create: `packages/contracts/src/media.ts`
- Create: `packages/contracts/src/library.ts`
- Create: `packages/contracts/src/player.ts`
- Create: `packages/contracts/src/sources.ts`
- Create: `packages/contracts/src/index.ts`
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/src/errors/AppError.ts`
- Create: `packages/core/src/index.ts`
- Test: `packages/core/src/errors/AppError.test.ts`

**Interfaces:**
- Produces: `Track`, `Artist`, `Album`, `Playlist`, `MusicRepository`, `LibraryScanner`, `AudioEngine`, `MusicSource`, `AppError`, `AppErrorCode`.

- [ ] **Step 1: Write an error normalization test**

```ts
expect(AppError.fromUnknown(new Error('boom'), 'PERSISTENCE_FAILURE').code)
  .toBe('PERSISTENCE_FAILURE');
expect(AppError.fromUnknown('boom').code).toBe('UNKNOWN');
```

- [ ] **Step 2: Define contracts from currently implemented flows**

`MusicRepository` exposes the operations already used by library/player handlers: initialize, track queries, artists, albums, genres, libraries, favorites, recently played, search, queue lookup and playback history recording. Do not add speculative cloud or Android methods.

- [ ] **Step 3: Implement `AppError`**

Stable codes:

```ts
'VALIDATION' | 'NOT_FOUND' | 'SOURCE_UNAVAILABLE' |
'FILESYSTEM_PERMISSION' | 'UNSUPPORTED_MEDIA' |
'PERSISTENCE_FAILURE' | 'PLAYBACK_FAILURE' |
'EXTERNAL_PROVIDER_FAILURE' | 'UNKNOWN'
```

- [ ] **Step 4: Run package tests/typecheck and commit**

```bash
git commit -m "feat: add platform-independent music contracts"
```

### Task 3: Extract library use cases and desktop repository/scanner adapters

**Files:**
- Create: `packages/core/src/library/LibraryService.ts`
- Create: `packages/core/src/library/LibraryService.test.ts`
- Create: `packages/adapters-desktop/package.json`
- Create: `packages/adapters-desktop/tsconfig.json`
- Create: `packages/adapters-desktop/src/library/DesktopMusicRepository.ts`
- Create: `packages/adapters-desktop/src/library/DesktopLibraryScanner.ts`
- Create: `packages/adapters-desktop/src/index.ts`
- Modify: `apps/desktop/electron/services/database/database.service.ts`
- Modify: `apps/desktop/electron/services/fileScanner/scanner.service.ts`
- Modify: `apps/desktop/electron/handlers/library.handler.ts`
- Create: `apps/desktop/electron/composition/createDesktopApplication.ts`

**Interfaces:**
- Consumes: `MusicRepository`, `LibraryScanner`, shared media types.
- Produces: `LibraryService` and desktop composition object `{ library, repository, scanner }`.

- [ ] **Step 1: Write failing `LibraryService` tests with in-memory fakes**

Cover list tracks, search, favorite toggle, add library, scan, and error normalization without importing Electron or SQLite.

- [ ] **Step 2: Implement `LibraryService`**

It coordinates repository/scanner ports only. It validates empty search/folder input and converts infrastructure failures to `AppError`.

- [ ] **Step 3: Adapt existing SQLite and scanner implementations**

Wrap current services rather than reimplementing SQL/scanning. Any snake_case database entities are mapped at adapter boundaries into contract-facing camelCase domain objects.

- [ ] **Step 4: Make library IPC handlers transport-only**

Handlers call `desktopApplication.library.*`; remove database initialization from handler module load.

- [ ] **Step 5: Commit**

```bash
git commit -m "refactor: extract library core and desktop adapters"
```

### Task 4: Extract player/queue state from Electron and isolate the audio engine

**Files:**
- Create: `packages/core/src/player/PlayerService.ts`
- Create: `packages/core/src/player/PlayerService.test.ts`
- Create: `packages/core/src/queue/QueueState.ts`
- Create: `packages/core/src/queue/QueueState.test.ts`
- Create: `packages/adapters-desktop/src/player/RendererAudioEngine.ts`
- Modify: `apps/desktop/electron/handlers/player.handler.ts`
- Modify: `apps/desktop/electron/preload/index.ts`
- Create: `apps/desktop/renderer/src/platform/WebAudioEngine.ts`
- Modify: `apps/desktop/renderer/src/services/player.service.ts`

**Interfaces:**
- Consumes: `AudioEngine`, `MusicRepository`, `Track`, `PlayerState`.
- Produces: platform-independent queue/repeat/shuffle state and renderer-hosted Web Audio implementation.

- [ ] **Step 1: Test queue state independent of browser/Electron**

Cover add, remove, reorder, clear, next/previous, repeat-one/all and deterministic shuffle behavior through injected randomness.

- [ ] **Step 2: Test `PlayerService` against fake `AudioEngine`**

Verify play/pause/seek/volume and track transitions without DOM globals.

- [ ] **Step 3: Remove Web Audio API construction from Electron main**

The current main-process audio service constructs `AudioContext` and `Audio`, which are renderer/browser APIs. Playback moves behind `AudioEngine` and is hosted by the renderer where those APIs exist.

- [ ] **Step 4: Preserve IPC compatibility during migration**

Existing renderer calls remain supported while the transport forwards player commands to the renderer-hosted engine/application service.

- [ ] **Step 5: Commit**

```bash
git commit -m "refactor: isolate player core from Electron runtime"
```

### Task 5: Isolate external music providers behind `MusicSource`

**Files:**
- Create: `packages/adapters-desktop/src/sources/YouTubeMusicSource.ts`
- Modify: `apps/desktop/electron/services/youtube/youtube.service.ts`
- Modify: `apps/desktop/electron/handlers/youtube.handler.ts`
- Create: `packages/core/src/sources/SourceRegistry.ts`
- Create: `packages/core/src/sources/SourceRegistry.test.ts`

**Interfaces:**
- Consumes: `MusicSource`.
- Produces: provider-neutral source registry keyed by source id.

- [ ] **Step 1: Test provider registration/search delegation**

Use two fake sources and verify lookup/search never branches on provider names inside core.

- [ ] **Step 2: Wrap current YouTube implementation as a desktop source adapter**

Provider-specific command/tool behavior remains outside core.

- [ ] **Step 3: Make YouTube IPC handler delegate to source registry/adapter**

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor: isolate external music source provider"
```

### Task 6: Introduce Chaos Forest design system and remove Spotify branding constants

**Files:**
- Create: `packages/design-system/package.json`
- Create: `packages/design-system/tsconfig.json`
- Create: `packages/design-system/src/tokens.ts`
- Create: `packages/design-system/src/index.ts`
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/src/chaosTheme.ts`
- Create: `packages/ui/src/index.ts`
- Modify: `apps/desktop/renderer/src/styles/theme.ts`
- Modify: `apps/desktop/renderer/src/styles/globalStyles.ts`
- Modify: `apps/desktop/electron/index.ts`

**Interfaces:**
- Consumes: design tokens.
- Produces: reusable `chaosForestTokens` and `chaosTheme`.

- [ ] **Step 1: Add token tests**

Assert the required spec colors and ensure `#1DB954` is not present in exported token values.

- [ ] **Step 2: Implement tokens and MUI theme**

Use:

```text
#070B09 #0C1210 #111A16 #102A1D #174D32 #27734C
#3C9466 #7DB58B #63E69A #E5EEE8 #95A69B #56645C #1D2B23
```

Use a normal sans stack for content and a mono stack only for technical metadata.

- [ ] **Step 3: Replace desktop window chrome/background and renderer theme imports**

Remove Spotify green hard-coding from theme/window surfaces.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add Chaos Forest design system"
```

### Task 7: Align documentation and verify the foundation

**Files:**
- Modify: `README.md`
- Replace: `docs/ARCHITECTURE.md`
- Modify: `docs/API.md`
- Modify: `docs/INSTALLATION.md`
- Modify: `docs/CONFIGURATION.md`
- Delete or archive only demonstrably stale planning documentation after preserving useful decisions in the approved spec.

**Interfaces:**
- Produces: documentation matching the migrated tree and current supported capabilities.

- [ ] **Step 1: Update README identity and implementation-status section**

Use `Chaos Music`, explain desktop current state and Android architectural readiness separately, and remove placeholder repository URLs.

- [ ] **Step 2: Rewrite architecture documentation from the actual tree**

Document workspace dependency direction, composition root, adapters, and the renderer-hosted audio engine.

- [ ] **Step 3: Run final verification through CI**

Required gates:

```bash
npm install
npm run typecheck
npm test -- --runInBand
npm run build
```

- [ ] **Step 4: Compare branch with `main` and verify no unintended deletions**

- [ ] **Step 5: Commit**

```bash
git commit -m "docs: align Chaos Music architecture and setup"
```

## Self-review

- Spec coverage: workspace, core/contracts, adapters, thin IPC, external providers, Chaos Forest, testing, error normalization, documentation and Android readiness all have an implementation task.
- Scope: Android APK, cloud sync, accounts, microservices and additional providers remain explicitly outside this plan.
- Type direction: contracts are introduced before core, core before adapters, adapters before host composition.
- Regression strategy: structural move, core extraction, player isolation, provider isolation, design system and documentation are separate commits.
