import { doc, runTransaction, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase/firebase";
import { resolveWeeklyBundle } from "./weeklyIndexService";
import {
  mergeWeeklyResult,
  type WeeklyScoreUpdate,
  type WeeklyUserResult,
} from "./weeklyResultMerge";

export * from "./weeklyResultMerge";

export async function saveWeeklyResult(update: WeeklyScoreUpdate) {
  const resolution = update.weekKey ? null : await resolveWeeklyBundle();
  const weekId = update.weekKey ?? resolution?.resultKey;
  if (!weekId) throw new Error("No weekly result key is available.");

  const ref = doc(db, "weekly_results", weekId, "users", update.uid);
  const result = await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    const existing = snapshot.exists()
      ? (snapshot.data() as WeeklyUserResult)
      : {};
    const merged = mergeWeeklyResult(existing, update);

    transaction.set(
      ref,
      { ...merged, updatedAt: serverTimestamp() },
      { merge: true },
    );
    return merged;
  });

  return { weekId, totalScore: result.totalScore ?? 0 };
}
