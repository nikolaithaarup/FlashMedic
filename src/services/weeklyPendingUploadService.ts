import {
  loadPendingWeeklyResults,
  markPendingWeeklyResultFailed,
  removePendingWeeklyResult,
  upsertPendingWeeklyResult,
  type PendingWeeklyResult,
} from "../storage/weeklyPendingResults";
import {
  createPendingWeeklyResult,
  type ReliableWeeklySubmission,
} from "../storage/weeklyPendingModel";
import { saveWeeklyResult, type WeeklyScoreUpdate } from "./weeklyResultsService";

export { createPendingWeeklyResult } from "../storage/weeklyPendingModel";

function scoreUpdate(result: PendingWeeklyResult): WeeklyScoreUpdate {
  return {
    uid: result.uid,
    nickname: result.nickname,
    weekKey: result.resultKey,
    attemptId: result.attemptId,
    completedAt: result.completedAt,
    ...(result.game === "mcq" ? { mcqScore: result.score } : {}),
    ...(result.game === "match" ? { matchScore: result.score } : {}),
    ...(result.game === "word" ? { wordScore: result.score } : {}),
  };
}

export async function submitWeeklyResultReliably(
  input: ReliableWeeklySubmission,
): Promise<{ status: "uploaded" | "pending"; result: PendingWeeklyResult }> {
  const pending = createPendingWeeklyResult(input);
  await upsertPendingWeeklyResult(pending);

  try {
    await saveWeeklyResult(scoreUpdate(pending));
    await removePendingWeeklyResult(pending.id);
    return { status: "uploaded", result: pending };
  } catch (error) {
    console.warn("Weekly result upload deferred", error);
    await markPendingWeeklyResultFailed(pending.id);
    return { status: "pending", result: { ...pending, status: "failed" } };
  }
}

export async function flushPendingWeeklyResults(): Promise<{
  uploaded: number;
  remaining: PendingWeeklyResult[];
}> {
  const pending = await loadPendingWeeklyResults();
  let uploaded = 0;

  for (const result of pending) {
    try {
      await upsertPendingWeeklyResult({ ...result, status: "pending" });
      await saveWeeklyResult(scoreUpdate(result));
      await removePendingWeeklyResult(result.id);
      uploaded += 1;
    } catch (error) {
      console.warn(`Weekly result ${result.id} is still pending`, error);
      await markPendingWeeklyResultFailed(result.id);
    }
  }

  return { uploaded, remaining: await loadPendingWeeklyResults() };
}
