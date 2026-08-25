# Chaos Music — Modular Android Foundation Design

Date: 2026-08-25
Status: Approved concept, implementation pending
Branch: `refactor/modular-android-foundation`

## 1. Purpose

Chaos Music will evolve from an Electron-centric desktop music player into a platform-independent music application whose current desktop client and future Android client are hosts around the same application core.

The refactor must preserve the useful existing implementation while removing direct coupling between business capabilities and Electron, Node.js filesystem APIs, SQLite bindings, FFmpeg, and external music providers.

The near-term target remains a functional desktop application. Android readiness is an architectural constraint, not a requirement to ship an Android app in this iteration.

## 2. Product Scope

The product remains centered on:

- local music library discovery and indexing;
- metadata extraction and library browsing;
- audio playback;
- queue management;
- favorites and recently played tracks;
- playlists;
- search;
- equalizer/player controls where supported by the host platform;
- external music/discovery sources through provider abstractions;
- a cohesive dark forest visual identity.

Features that depend on a platform capability must be implemented through an interface owned by the application/core layer and an adapter owned by the host platform.

## 3. Architectural Decision

Use a small TypeScript workspace/monorepo containing a modular monolith rather than keeping a single Electron-shaped `src` tree.

Target structure:

```text
Chaos-Music/
├── apps/
│   ├── desktop/
│   │   ├── electron/
│   │   └── renderer/
│   └── android/
│       └── capacitor/
├── packages/
│   ├── core/
│   ├── contracts/
│   ├── adapters-desktop/
│   ├── adapters-android/
│   ├── ui/
│   └── design-system/
├── docs/
├── tests/
└── package.json
```

The Android workspace is intentionally minimal during the foundation refactor. No fake Android implementation should be added merely to populate directories.

## 4. Dependency Direction

Dependencies must point inward:

```text
UI / Host
   ↓
Application/Core
   ↓
Contracts
   ↑
Platform adapters implement contracts
```

The core must not import:

- `electron`;
- `node:fs` or other Node-only APIs;
- `better-sqlite3`;
- `fluent-ffmpeg`;
- `youtube-dl-exec`;
- browser globals that are unavailable outside a renderer;
- Android-specific APIs.

The desktop host may import all desktop adapters and bind them to application contracts at composition time.

## 5. Modules

### 5.1 Core modules

Initial capabilities:

- `library`
- `player`
- `queue`
- `playlists`
- `search`
- `sources`

Each capability owns its domain types and use cases. Shared cross-cutting primitives should remain small and intentional.

### 5.2 Contracts

Minimum ports to introduce as needed by migrated code:

- `MusicRepository`
- `LibraryScanner`
- `AudioEngine`
- `MetadataReader`
- `MusicSource`
- `PlatformFilePicker` where user-driven directory selection is required

Interfaces should be shaped by actual use cases extracted from the current code, not speculative Android requirements.

## 6. Desktop Composition

Electron becomes a host instead of the application architecture.

IPC handlers must become thin transport adapters. They may validate transport input, call an application use case, translate the result into IPC-safe data, and map errors. They must not initialize databases, perform library business decisions, or directly coordinate multiple infrastructure services.

Current pattern:

```text
Electron IPC handler
  -> database service
  -> scanner service
```

Target pattern:

```text
Electron IPC handler
  -> application use case
  -> contract
  -> desktop adapter
```

Database initialization and service composition belong in the desktop composition root.

## 7. Android Strategy

Use Capacitor as the first Android host because the existing renderer is React DOM based and should remain reusable.

Android-only capabilities can later be provided through Capacitor plugins backed by Kotlin when web APIs are insufficient, particularly for:

- background playback;
- media notifications/session integration;
- indexed media storage access;
- native audio behavior;
- storage permissions and directory/file access.

This design does not prevent a later React Native or native UI rewrite because business logic and platform contracts will not depend on Capacitor.

## 8. External Music Sources

External providers must implement `MusicSource` rather than being referenced directly by the player or library modules.

Examples of possible providers include local storage, YouTube-compatible discovery/reproduction flows, internet radio, Jellyfin, Navidrome, or Subsonic.

Provider-specific limitations and policy constraints must remain inside the provider adapter. Core playback logic must not assume YouTube, `yt-dlp`, or any single source technology.

## 9. State Management

Use Redux only for client/UI state that benefits from global observable state.

Do not duplicate persistent domain state in Redux when React Query or application use cases already own server/IPC-backed data.

Target separation:

- domain/application state: core/use cases and repositories;
- remote/IPC async cache: React Query where appropriate;
- transient global UI/player state: Redux only where justified;
- local component state: React state.

Existing slices and hooks must be audited before migration instead of blindly retained.

## 10. Visual Direction — Chaos Forest

The current Spotify-like bright green design will be replaced with a dark forest technical identity.

Primary tokens:

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

Visual rules:

- green accents are reserved for active, playing, focus, progress, status, and visualization states;
- large surfaces remain dark and neutral;
- no Matrix-style rain, fake terminal noise, neon-green full-screen treatment, or excessive monospace typography;
- monospace is used for technical metadata such as codec, sample rate, source, queue count, and engine state;
- music artwork and content remain the visual focus;
- desktop and Android use the same tokens but different responsive layouts.

## 11. Design System

Create a platform-agnostic token package and a React UI layer.

The design system must define:

- color tokens;
- spacing;
- typography;
- radii;
- elevations/borders;
- interactive states;
- icon usage;
- player-specific visual states.

Avoid embedding Spotify brand values such as `#1DB954` into individual components.

## 12. Migration Strategy

The refactor must be incremental and regression-friendly.

### Phase 0 — Reality audit

- verify dependency declarations against imports;
- identify broken fresh-install assumptions;
- compare documentation with the real tree;
- identify dead or aspirational documentation;
- establish baseline build/typecheck/test status.

### Phase 1 — Workspace foundation

- introduce workspace package layout;
- move desktop host without changing behavior;
- keep imports working through explicit package boundaries;
- centralize scripts at repository root.

### Phase 2 — Contracts and core extraction

Extract the currently implemented library/player flows first because they expose the strongest platform coupling.

Introduce interfaces only when a concrete migrated flow needs them.

### Phase 3 — Desktop adapters and composition root

Move SQLite, file scanning, metadata, FFmpeg/audio, and Electron-specific code behind adapters.

Make IPC handlers thin.

### Phase 4 — UI architecture and design system

Reorganize renderer code by capability instead of only technical folder type.

Apply Chaos Forest tokens and rebuild shared layout/player/navigation primitives.

### Phase 5 — Functional completion

Complete and verify desktop library, playback, queue, favorites, recent tracks, playlists, search, metadata, source selection, and settings according to the codebase's actual supported capabilities.

### Phase 6 — Android host foundation

Add Capacitor only after the shared core and renderer boundaries are stable. Android-specific adapters can then be introduced without changing application use cases.

## 13. Testing Strategy

Required verification layers:

- unit tests for core use cases and domain logic without Electron;
- contract tests for adapters where practical;
- desktop integration tests for IPC -> application -> adapter flows;
- React component tests for critical player/library behavior;
- fresh-install typecheck/build verification;
- smoke test that the desktop application starts and renders.

No implementation phase is complete solely because TypeScript compiles.

## 14. Error Handling

Core/application errors should be typed or normalized into stable categories such as:

- validation;
- not found;
- unavailable source;
- filesystem permission;
- unsupported media;
- persistence failure;
- playback failure;
- external provider failure.

Transport adapters may convert these into IPC-safe result objects. Infrastructure-specific error strings must not leak into business logic as control flow.

## 15. Documentation Rules

Existing documentation must be audited against the implementation.

A document that describes files or capabilities that do not exist must be corrected or removed. Architecture documentation must describe the code that exists after each migration phase, not an aspirational future tree presented as current reality.

The README should state the product vision separately from the currently implemented capability set.

## 16. Non-goals for This Foundation

This iteration does not require:

- shipping an Android APK/AAB;
- a cloud backend;
- user accounts;
- cross-device synchronization;
- social functionality;
- plugin marketplace infrastructure;
- microservices;
- replacing React;
- replacing Electron before Android is viable;
- implementing every possible external music provider.

## 17. Acceptance Criteria

The foundation refactor is successful when:

1. the repository uses an explicit workspace structure;
2. the existing desktop app can be installed and built from a clean checkout;
3. core library/player behavior can be tested without importing Electron;
4. SQLite/filesystem/audio implementations are bound through explicit adapters;
5. IPC handlers are transport-only orchestration boundaries;
6. provider-specific music source logic is isolated from core playback logic;
7. the renderer uses the Chaos Forest design tokens rather than Spotify green constants;
8. documentation reflects the real repository structure;
9. tests/typecheck/build pass for the migrated scope;
10. adding an Android host does not require moving business logic out of Electron because that dependency has already been removed.
