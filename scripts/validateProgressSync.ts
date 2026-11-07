import assert from "node:assert/strict";
import {
  foldProgressEvents,
  parseProgressQueue,
  type ProgressEvent,
} from "../src/sync/progressEvents";
import { createProgressBackupImportIdentity } from "../src/storage/progressTransfer";

function event(overrides: Partial<ProgressEvent>): ProgressEvent {
  return {
    schemaVersion: 1,
    eventId: "event-1",
    type: "attempt",
    deviceId: "device-1",
    cardId: "card-1",
    subject: "EKG",
    topic: null,
    subtopic: null,
    occurredAt: "2026-11-05T12:00:00.000Z",
    known: true,
    mode: "normal",
    seen: null,
    correct: null,
    incorrect: null,
    lastSeen: null,
    mistakeAddedAt: null,
    mistakeLastReviewedAt: null,
    mistakeIncorrectCount: null,
    mistakeReviewStatus: null,
    ...overrides,
  };
}

const baseline = event({
  eventId: "baseline-device-a-card-1",
  type: "baseline",
  deviceId: "device-a",
  known: null,
  mode: null,
  seen: 2,
  correct: 1,
  incorrect: 1,
  lastSeen: "2026-11-05T10:00:00.000Z",
});
const concurrent = event({
  eventId: "attempt-device-b-card-1",
  deviceId: "device-b",
  occurredAt: "2026-11-05T12:01:00.000Z",
});
const merged = foldProgressEvents([baseline, concurrent, concurrent]);
assert.deepEqual(merged.stats["card-1"], {
  seen: 3,
  correct: 2,
  incorrect: 1,
  lastSeen: "2026-11-05T12:01:00.000Z",
});

const incorrect = event({
  eventId: "attempt-device-a-card-2",
  cardId: "card-2",
  known: false,
  occurredAt: "2026-11-05T12:02:00.000Z",
});
const review = foldProgressEvents([incorrect]);
assert.equal(review.mistakes[0]?.cardId, "card-2");
assert.equal(review.mistakes[0]?.incorrectCount, 1);

const reset = event({
  eventId: "reset-device-a",
  type: "reset",
  cardId: null,
  subject: null,
  occurredAt: "2026-11-05T12:03:00.000Z",
  known: null,
  mode: null,
});
assert.deepEqual(foldProgressEvents([baseline, concurrent, reset]).stats, {});

assert.throws(() => parseProgressQueue("{not-json"));
assert.throws(() => parseProgressQueue(JSON.stringify({ eventId: "not-an-array" })));
assert.deepEqual(parseProgressQueue(JSON.stringify([concurrent])), [concurrent]);

const importedBackup = {
  app: "FlashMedic" as const,
  schemaVersion: 1 as const,
  exportedAt: "2026-11-05T12:04:00.000Z",
  values: {
    flashmedic_card_stats: JSON.stringify({
      "card-1": { seen: 3, correct: 2, incorrect: 1, lastSeen: null },
    }),
  },
};
const firstImport = createProgressBackupImportIdentity(importedBackup);
const duplicateImport = createProgressBackupImportIdentity({
  ...importedBackup,
  values: { ...importedBackup.values },
});
assert.deepEqual(duplicateImport, firstImport);
assert.notDeepEqual(
  createProgressBackupImportIdentity({
    ...importedBackup,
    values: { flashmedic_card_stats: "{}" },
  }),
  firstImport,
);

console.log("Validated retries, concurrent merges, reset events, queue preservation, and duplicate-import identity.");
