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
import { auth } from "../firebase/firebase";
import { Platform } from "react-native";

export { createPendingWeeklyResult } from "../storage/weeklyPendingModel";

const WEEKLY_SCORE_URL = Platform.OS === "web"
  ? "/api/weekly-score"
  : "https://flashmedic.synapsestudio.dk/api/weekly-score";

async function uploadPendingResult(result: PendingWeeklyResult): Promise<boolean> {
  const user = auth.currentUser;
  if (!user || user.isAnonymous || user.uid !== result.uid) return false;

  const send = async (forceRefresh: boolean) => fetch(WEEKLY_SCORE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await user.getIdToken(forceRefresh)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      submissionId: result.attemptId,
      weekKey: result.canonicalWeekKey,
      game: result.game,
      score: result.score,
      nickname: result.nickname,
    }),
  });

  let response = await send(false);
  if (response.status === 401) response = await send(true);
  if (response.ok || response.status === 409) return true;
  throw new Error(`weekly_score_${response.status}`);
}

export async function submitWeeklyResultReliably(
  input: ReliableWeeklySubmission,
): Promise<{
  status: "uploaded" | "pending" | "local";
  result: PendingWeeklyResult;
}> {
  const pending = createPendingWeeklyResult(input);
  const user = auth.currentUser;
  if (!user || user.isAnonymous || user.uid !== input.uid) {
    return { status: "local", result: pending };
  }

  await upsertPendingWeeklyResult(pending);
  try {
    if (await uploadPendingResult(pending)) {
      await removePendingWeeklyResult(pending.id);
      return { status: "uploaded", result: pending };
    }
  } catch {
    await markPendingWeeklyResultFailed(pending.id);
  }
  return { status: "pending", result: pending };
}

export async function flushPendingWeeklyResults(): Promise<{
  uploaded: number;
  remaining: PendingWeeklyResult[];
}> {
  const pending = await loadPendingWeeklyResults();
  let uploaded = 0;
  for (const result of pending) {
    try {
      if (await uploadPendingResult(result)) {
        await removePendingWeeklyResult(result.id);
        uploaded += 1;
      }
    } catch {
      await markPendingWeeklyResultFailed(result.id);
    }
  }
  return { uploaded, remaining: await loadPendingWeeklyResults() };
}
