# Configuration

## Runtime

Chaos Music currently targets Node.js 22+ and npm 10+. The active host is Electron desktop.

## Local database

The desktop host keeps the existing database filename `musicplayer.db` during the refactor to avoid silently disconnecting existing local libraries. The filename is a compatibility detail, not current product branding.

Database initialization is owned by the desktop composition root.

## Library folders

Folders are persisted by the desktop repository and scanned through `LibraryScanner`. Supported audio extensions in the current desktop constants are:

```text
.mp3 .flac .m4a .wav .ogg .aac .wma
```

## External sources

External providers are registered in the `SourceRegistry` at composition time.

The current legacy YouTube implementation reads `YOUTUBE_API_KEY` when available, although parts of the implementation also use provider tooling directly. Do not put secrets in source files or commit `.env` files containing keys.

Provider-specific requirements should remain inside their adapters; the core must not read environment variables.

## UI theme

The renderer mounts `chaosTheme` from `@chaos-music/ui`. Raw visual identity values live in `@chaos-music/design-system` and should not be duplicated in feature components.

Technical metadata may use the `.technical-meta` style; strong signal green should be reserved for active/playback/focus/status states.

## Electron security boundary

The renderer runs with `contextIsolation: true` and `nodeIntegration: false`. Native access is provided by the preload's narrow `electronAPI` bridge.
