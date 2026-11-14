import assert from "node:assert/strict";
import { deleteApp, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import {
  findExistingWeeklyScore,
  recordWeeklyScore,
  type WeeklyScoreRecord,
} from "../src/server/weeklyScoreStore";

async function main() {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error("Firestore emulator is required.");
  }
  const app = initializeApp({ projectId: "demo-flashmedic" }, "weekly-score-test");
  const db = getFirestore(app);
  const first: WeeklyScoreRecord = {
    uid: "portal-user",
    nickname: "Test",
    weekKey: "2026-W46",
    game: "mcq",
    submissionId: "2026-W46:portal-user:mcq",
    rawScore: 8_000,
    rawLimit: 10_000,
    points: 800,
  };

  const concurrent = await Promise.all([
    recordWeeklyScore(db, first),
    recordWeeklyScore(db, first),
  ]);
  assert.equal(concurrent.filter((result) => result.idempotent).length, 1);
  assert.equal(concurrent.filter((result) => !result.idempotent).length, 1);
  assert.deepEqual(await findExistingWeeklyScore(db, first), { points: 800, idempotent: true });

  await assert.rejects(
    recordWeeklyScore(db, { ...first, submissionId: "conflict", rawScore: 7_000, points: 700 }),
    /duplicate_submission/,
  );

  await recordWeeklyScore(db, {
    ...first,
    game: "match",
    submissionId: "2026-W46:portal-user:match",
    rawScore: 2_500,
    rawLimit: 5_000,
    points: 500,
  });
  await recordWeeklyScore(db, {
    ...first,
    weekKey: "2026-W47",
    game: "word",
    submissionId: "2026-W47:portal-user:word",
    rawScore: 15_000,
    rawLimit: 15_000,
    points: 1_000,
  });

  const week = await db.doc("weekly_leaderboards/2026-W46/users/portal-user").get();
  const lifetime = await db.doc("weekly_all_time/portal-user").get();
  assert.equal(week.data()?.totalPoints, 1_300);
  assert.deepEqual(week.data()?.gamePoints, { mcq: 800, match: 500 });
  assert.equal(lifetime.data()?.totalPoints, 2_300);
  assert.equal((await db.collection("weekly_score_submissions").get()).size, 3);

  await deleteApp(app);
  console.log("Validated atomic retries, duplicate rejection, weekly totals, and lifetime aggregation.");
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
