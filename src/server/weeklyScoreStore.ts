import { FieldValue, type Firestore } from "firebase-admin/firestore";

import {
  addGamePoints,
  createRankKey,
  totalGamePoints,
  type WeeklyGamePoints,
} from "../services/weeklyCompetition";
import type { WeeklyGameKind } from "../services/weeklyKeyResolution";

export type WeeklyScoreRecord = {
  uid: string;
  nickname: string;
  weekKey: string;
  game: WeeklyGameKind;
  submissionId: string;
  rawScore: number;
  rawLimit: number;
  points: number;
};

export type WeeklyScoreResult = { points: number; idempotent: boolean };

function refs(
  db: Firestore,
  input: Pick<WeeklyScoreRecord, "uid" | "weekKey" | "game">,
) {
  return {
    submission: db.doc(`weekly_score_submissions/${input.weekKey}_${input.uid}_${input.game}`),
    weekly: db.doc(`weekly_leaderboards/${input.weekKey}/users/${input.uid}`),
    lifetime: db.doc(`weekly_all_time/${input.uid}`),
  };
}

export async function findExistingWeeklyScore(
  db: Firestore,
  input: Pick<WeeklyScoreRecord, "uid" | "weekKey" | "game" | "submissionId" | "rawScore">,
): Promise<WeeklyScoreResult | null> {
  const snapshot = await refs(db, input).submission.get();
  if (!snapshot.exists) return null;
  const data = snapshot.data()!;
  if (data.submissionId !== input.submissionId || data.rawScore !== input.rawScore) {
    throw new Error("duplicate_submission");
  }
  return { points: Number(data.points), idempotent: true };
}

export async function recordWeeklyScore(
  db: Firestore,
  input: WeeklyScoreRecord,
): Promise<WeeklyScoreResult> {
  const target = refs(db, input);
  return db.runTransaction(async (transaction) => {
    const existingSubmission = await transaction.get(target.submission);
    if (existingSubmission.exists) {
      const existing = existingSubmission.data()!;
      if (existing.submissionId === input.submissionId && existing.rawScore === input.rawScore) {
        return { points: Number(existing.points), idempotent: true };
      }
      throw new Error("duplicate_submission");
    }

    const weeklySnapshot = await transaction.get(target.weekly);
    const lifetimeSnapshot = await transaction.get(target.lifetime);
    const weekly = weeklySnapshot.data() ?? {};
    const lifetime = lifetimeSnapshot.data() ?? {};
    const gamePoints = addGamePoints(
      (weekly.gamePoints ?? {}) as WeeklyGamePoints,
      input.game,
      input.points,
    );
    const weeklyTotal = totalGamePoints(gamePoints);
    const lifetimeTotal = Number(lifetime.totalPoints ?? 0) + input.points;

    transaction.create(target.submission, {
      uid: input.uid,
      weekKey: input.weekKey,
      game: input.game,
      submissionId: input.submissionId,
      rawScore: input.rawScore,
      rawLimit: input.rawLimit,
      points: input.points,
      createdAt: FieldValue.serverTimestamp(),
    });
    transaction.set(target.weekly, {
      uid: input.uid,
      nickname: input.nickname,
      weekKey: input.weekKey,
      gamePoints,
      totalPoints: weeklyTotal,
      rankKey: createRankKey(weeklyTotal, input.uid),
      updatedAt: FieldValue.serverTimestamp(),
    });
    transaction.set(target.lifetime, {
      uid: input.uid,
      nickname: input.nickname,
      totalPoints: lifetimeTotal,
      rankKey: createRankKey(lifetimeTotal, input.uid),
      updatedAt: FieldValue.serverTimestamp(),
    });
    transaction.set(
      db.doc(`weekly_leaderboards/${input.weekKey}/meta/state`),
      { revision: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    transaction.set(
      db.doc("weekly_all_time_meta/state"),
      { revision: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    return { points: input.points, idempotent: false };
  });
}
