import {
  loadPendingWeeklyResults,
  type PendingWeeklyResult,
} from "../storage/weeklyPendingResults";
import {
  createPendingWeeklyResult,
  type ReliableWeeklySubmission,
} from "../storage/weeklyPendingModel";

export { createPendingWeeklyResult } from "../storage/weeklyPendingModel";

export async function submitWeeklyResultReliably(
  input: ReliableWeeklySubmission,
): Promise<{
  status: "uploaded" | "pending" | "local";
  result: PendingWeeklyResult;
}> {
  const pending = createPendingWeeklyResult(input);
  // Competitive scores cannot be trusted while answers and scoring logic are
  // available offline. Keep the local completion/lock, but do not submit it to
  // the public ranking until a server-verifiable game mode exists.
  return { status: "local", result: pending };
}

export async function flushPendingWeeklyResults(): Promise<{
  uploaded: number;
  remaining: PendingWeeklyResult[];
}> {
  const pending = await loadPendingWeeklyResults();
  return { uploaded: 0, remaining: pending };
}
