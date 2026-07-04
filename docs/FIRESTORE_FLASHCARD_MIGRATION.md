# Firestore flashcard migration

`Backend/data/subjects/*.json` is the canonical deployable Firestore seed/export source. It contains all backend subjects and is validated before a migration plan is produced. The app itself is Firestore-backed: repo changes are not visible at runtime until Firestore is synced.

The intended active target is `subjects/{subjectSlug}/cards/{cardId}`. The runtime loader first queries `collectionGroup("cards")`, which includes this path, before trying legacy top-level `cards`, `flashcards`, and `decks[].cards` fallbacks. Dry run reports counts for every shape and flags unexpected `cards` subcollection paths.

## Credentials

Never commit credentials. Either place the service account at the already ignored path `Backend/scripts/keys/serviceAccount.json`, or set:

```powershell
$env:FLASHMEDIC_FIREBASE_SERVICE_ACCOUNT="C:\secure\serviceAccount.json"
```

## Dry run

```powershell
npm run migrate:flashcards:dry-run
```

This validates canonical content, reads Firestore, prints the target project and reports additions, updates, unchanged cards, stale documents, malformed documents and ID rename candidates. It never writes.

## Apply

Review the dry run first, then explicitly name and confirm the target:

```powershell
$env:FLASHMEDIC_FIREBASE_PROJECT_ID="flashmedic-edf96"
$env:FLASHMEDIC_CONFIRM_FIRESTORE_WRITE="true"
npm run migrate:flashcards:apply
```

Apply uses merge writes in batches. It adds missing cards and updates canonical fields while retaining compatible Firestore-only fields. Stale documents are not deleted by default.

The scoped `sygdomslaere/neuro_001..020` to `syg_neuro_001..020` map is reported separately. To delete only old documents whose question and answer exactly match the corrected card, additionally set `FLASHMEDIC_APPLY_VERIFIED_ID_RENAMES=true`. Ambiguous matches are never deleted automatically.

## Verification and rollback

Run dry-run again after apply. Additions and updates should be zero. Verify reviewed V2 cards and images in the app before broad release.

Firestore has no automatic rollback here. Before apply, use a managed Firestore export or retain a read-only snapshot/report. A rollback means restoring that export or applying the prior canonical JSON. Do not manually delete the entire `subjects` collection, do not commit service-account files, and do not enable rename deletion without reviewing the candidate list.
