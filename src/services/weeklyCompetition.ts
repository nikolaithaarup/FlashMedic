import type { WeeklyGameKind } from "./weeklyKeyResolution";

export const MAX_POINTS_PER_GAME = 1_000;

export type WeeklyGamePoints = Partial<Record<WeeklyGameKind, number>>;

function array(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> =>
        !!item && typeof item === "object" && !Array.isArray(item),
      )
    : [];
}

export function getRawScoreLimit(
  game: WeeklyGameKind,
  pack: Record<string, unknown>,
): number {
  if (game === "mcq") {
    const nested = pack.pack;
    const root = nested && typeof nested === "object" && !Array.isArray(nested)
      ? nested as Record<string, unknown>
      : pack;
    const questions = array(root.questions).length
      ? array(root.questions)
      : array((root.mcq as Record<string, unknown> | undefined)?.questions);
    return questions.length * 1_000;
  }

  if (game === "match") {
    return array(pack.rounds).reduce(
      (total, round) => total + array(round.pairs).length * 1_000,
      0,
    );
  }

  const rounds = array(pack.rounds).length
    ? array(pack.rounds)
    : ["easy", "medium", "hard"].filter((key) =>
        Array.isArray((pack.word as Record<string, unknown> | undefined)?.[key] ?? pack[key]),
      ).map(() => ({}));
  return rounds.length * 5_000;
}

export function normalizeWeeklyScore(rawScore: number, rawLimit: number): number {
  if (!Number.isSafeInteger(rawScore) || rawScore < 0) {
    throw new Error("invalid_score");
  }
  if (!Number.isSafeInteger(rawLimit) || rawLimit <= 0 || rawScore > rawLimit) {
    throw new Error("score_out_of_range");
  }
  return Math.round((rawScore / rawLimit) * MAX_POINTS_PER_GAME);
}

export function totalGamePoints(points: WeeklyGamePoints): number {
  return (points.mcq ?? 0) + (points.match ?? 0) + (points.word ?? 0);
}

export function addGamePoints(
  current: WeeklyGamePoints,
  game: WeeklyGameKind,
  points: number,
): WeeklyGamePoints {
  if (current[game] != null) throw new Error("duplicate_game");
  return { ...current, [game]: points };
}

export function createRankKey(points: number, uid: string): string {
  const inverted = 999_999_999 - Math.max(0, Math.floor(points));
  return `${String(inverted).padStart(9, "0")}:${uid}`;
}

export function sanitizeLeaderboardName(value: unknown, uid: string): string {
  const name = typeof value === "string"
    ? value.trim().replace(/[\r\n\t]/g, " ").replace(/\s+/g, " ").slice(0, 32)
    : "";
  return name || `Spiller ${uid.slice(-6)}`;
}
