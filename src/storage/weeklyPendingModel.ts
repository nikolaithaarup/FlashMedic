import type {
  ResolvedWeeklyBundle,
  WeeklyGameKind,
} from "../services/weeklyKeyResolution";

export type WeeklyUploadStatus = "pending" | "failed";
export type PendingWeeklyResult = {
  id: string;
  attemptId: string;
  uid: string;
  nickname: string;
  canonicalWeekKey: string;
  resultKey: string;
  game: WeeklyGameKind;
  score: number;
  completedAt: string;
  status: WeeklyUploadStatus;
};

export type ReliableWeeklySubmission = {
  uid: string;
  nickname: string;
  resolution: ResolvedWeeklyBundle;
  game: WeeklyGameKind;
  score: number;
  completedAt?: string;
};

function isGame(value: unknown): value is WeeklyGameKind {
  return value === "mcq" || value === "match" || value === "word";
}

export function parsePendingWeeklyResults(value: unknown): PendingWeeklyResult[] {
  if (!Array.isArray(value)) return [];
  const results: PendingWeeklyResult[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const record = item as Record<string, unknown>;
    if (
      typeof record.id !== "string" ||
      typeof record.attemptId !== "string" ||
      typeof record.uid !== "string" ||
      typeof record.nickname !== "string" ||
      typeof record.canonicalWeekKey !== "string" ||
      typeof record.resultKey !== "string" ||
      !isGame(record.game) ||
      typeof record.score !== "number" ||
      !Number.isFinite(record.score) ||
      typeof record.completedAt !== "string" ||
      (record.status !== "pending" && record.status !== "failed")
    ) {
      continue;
    }
    results.push({
      id: record.id,
      attemptId: record.attemptId,
      uid: record.uid,
      nickname: record.nickname,
      canonicalWeekKey: record.canonicalWeekKey,
      resultKey: record.resultKey,
      game: record.game,
      score: record.score,
      completedAt: record.completedAt,
      status: record.status,
    });
  }
  return results;
}

export function createPendingWeeklyResult(
  input: ReliableWeeklySubmission,
): PendingWeeklyResult {
  const completedAt = input.completedAt ?? new Date().toISOString();
  const id = `${input.resolution.resultKey}:${input.uid}:${input.game}`;
  return {
    id,
    attemptId: id,
    uid: input.uid,
    nickname: input.nickname,
    canonicalWeekKey: input.resolution.canonicalWeekKey,
    resultKey: input.resolution.resultKey,
    game: input.game,
    score: Math.max(0, Math.floor(input.score)),
    completedAt,
    status: "pending",
  };
}
