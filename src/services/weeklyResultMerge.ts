import type { WeeklyGameKind } from "./weeklyKeyResolution";

export type WeeklyScoreUpdate = {
  uid: string;
  nickname: string;
  weekKey?: string | null;
  mcqScore?: number;
  matchScore?: number;
  wordScore?: number;
  attemptId?: string;
  completedAt?: string;
};

export type WeeklyUserResult = {
  uid?: string;
  nickname?: string;
  mcqScore?: number;
  matchScore?: number;
  wordScore?: number;
  totalScore?: number;
  attemptIds?: Partial<Record<WeeklyGameKind, string>>;
  completedAt?: Partial<Record<WeeklyGameKind, string>>;
};

function toSafeInt(value: unknown): number {
  const number =
    typeof value === "number" && Number.isFinite(value)
      ? Math.floor(value)
      : 0;
  return Math.max(0, number);
}

export function mergeWeeklyResult(
  existing: WeeklyUserResult,
  update: WeeklyScoreUpdate,
): WeeklyUserResult {
  const attemptIds = { ...(existing.attemptIds ?? {}) };
  const completedAt = { ...(existing.completedAt ?? {}) };
  const merged: WeeklyUserResult = {
    ...existing,
    uid: update.uid,
    nickname: update.nickname,
  };

  const applyScore = (kind: WeeklyGameKind, score: number | undefined) => {
    if (typeof score !== "number") return;
    const scoreField = `${kind}Score` as const;
    const existingAttempt = attemptIds[kind];
    const existingScore = existing[scoreField];
    const isRetry =
      !!update.attemptId && existingAttempt === update.attemptId;
    const isNew = existingScore == null && existingAttempt == null;
    const isLegacyCompatible = !update.attemptId;

    if (isRetry || isNew || isLegacyCompatible) {
      merged[scoreField] = toSafeInt(score);
      if (update.attemptId) attemptIds[kind] = update.attemptId;
      if (update.completedAt) completedAt[kind] = update.completedAt;
    }
  };

  applyScore("mcq", update.mcqScore);
  applyScore("match", update.matchScore);
  applyScore("word", update.wordScore);
  merged.attemptIds = attemptIds;
  merged.completedAt = completedAt;
  merged.totalScore =
    toSafeInt(merged.mcqScore) +
    toSafeInt(merged.matchScore) +
    toSafeInt(merged.wordScore);
  return merged;
}
