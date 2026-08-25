# Installation

## Prerequisites

- Node.js 22 or newer
- npm 10 or newer
- Windows, macOS or Linux supported by the selected Electron version
- Git

Optional external-provider functionality may require additional provider-specific binaries or credentials. Local library/player development does not require an Android SDK.

## Clone and install

```bash
git clone https://github.com/MonkDabaLegaro/Chaos-Music.git
cd Chaos-Music
npm install
```

## Development

```bash
npm run dev
```

The root workspace delegates this command to `@chaos-music/desktop`.

## Verification

```bash
npm run typecheck
npm test -- --runInBand
npm run build
```

## Desktop package

Commands can also be scoped explicitly:

```bash
npm run dev --workspace @chaos-music/desktop
npm run typecheck --workspace @chaos-music/desktop
```

## Android

There is no Android build target in this foundation yet. Capacitor/Kotlin integration will be added only after the shared boundaries are stable; do not install Android tooling solely to work on the current desktop app.
