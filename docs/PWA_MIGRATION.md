# FlashMedic PWA migration

## Architecture

FlashMedic keeps Expo Router, React Native Web, and the native iOS/Android
configuration. The web build is a static Expo export in `dist/`, suitable for
Vercel. No Next.js layer is required.

The existing single-screen application state is reflected in hash routes such
as `/#/flashcards`, `/#/ekg`, and `/#/vgas`. This gives browser Back/Forward and
reload-safe deep links without duplicating the native navigation tree.

## Offline content and updates

The ten validated JSON files in `Backend/data/subjects/` are bundled into the
web application. They contain the authoritative 1,970 flashcards. Firestore is
still queried when authentication and networking are available; matching card
IDs from Firestore override the bundled revision, while a partial response
cannot remove bundled cards.

`npm run build:web` exports the application and generates a content-hashed
service worker. It precaches the complete exported shell and referenced EKG
assets. Navigation is network-first with an offline fallback; same-origin
assets are cache-first. A new service worker waits until the user explicitly
chooses to update, avoiding a forced reload during training.

## Browser storage and migration

Web application state is stored in the versioned `flashmedic` IndexedDB
database. Existing AsyncStorage-for-web localStorage values are migrated lazily
the first time each key is read. Native builds continue using AsyncStorage.

The Profile screen exports local profile, statistics, mistake review, pending
weekly results, and weekly locks as a versioned JSON file. The PWA can import
that file. Native storage is isolated from Safari/Chrome storage and cannot be
transferred automatically; the JSON export is the user-controlled bridge. It
does not transfer a Firebase authentication session or create a cross-device
account.

## Local commands

```text
npm run validate:pwa
npm run release:check
npm run build:web
npm run preview:web
```

## Vercel

`vercel.json` declares the build command, `dist` output, SPA fallback, and cache
headers. Connect the repository to a Vercel project, leave the framework preset
as Other, and use the repository root. After a tested preview deployment,
assign `flashmedic.synapsestudio.dk` in Vercel and add the DNS record requested
by Vercel. DNS and production deployment are intentionally outside this local
migration.
