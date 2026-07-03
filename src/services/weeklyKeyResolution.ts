import {
  getCurrentIsoWeekInfo,
  getLegacyWeekKeyCandidates,
} from "../utils/week";

export type WeeklyGameKind = "mcq" | "match" | "word";
export type WeeklyKeySource =
  | "override"
  | "iso"
  | "pointer-weekKey"
  | "pointer-weekId"
  | "legacy-week"
  | "legacy-W"
  | "legacy-number";

export type WeeklyKeyCandidate = { key: string; source: WeeklyKeySource };
export type WeeklyIndexCurrent = {
  weekId?: string;
  weekKey?: string;
  overrideWeekKey?: string;
};

export type ResolvedWeeklyBundle = {
  canonicalWeekKey: string;
  contentKey: string;
  resultKey: string;
  source: WeeklyKeySource;
  isFallback: boolean;
  availableGames: WeeklyGameKind[];
};

function cleanKey(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function buildWeeklyKeyCandidates(
  date = new Date(),
  index: WeeklyIndexCurrent | null = null,
): WeeklyKeyCandidate[] {
  const canonicalWeekKey = getCurrentIsoWeekInfo(date).weekKey;
  const override = cleanKey(index?.overrideWeekKey);
  if (override) return [{ key: override, source: "override" }];

  const [legacyWeek, legacyW, legacyNumber] =
    getLegacyWeekKeyCandidates(date);
  const pointerWeekKey = cleanKey(index?.weekKey);
  const pointerWeekId = cleanKey(index?.weekId);
  const candidates: (WeeklyKeyCandidate | null)[] = [
    { key: canonicalWeekKey, source: "iso" },
    pointerWeekKey
      ? { key: pointerWeekKey, source: "pointer-weekKey" }
      : null,
    pointerWeekId ? { key: pointerWeekId, source: "pointer-weekId" } : null,
    { key: legacyWeek, source: "legacy-week" },
    { key: legacyW, source: "legacy-W" },
    { key: legacyNumber, source: "legacy-number" },
  ];

  const seen = new Set<string>();
  return candidates.filter((candidate): candidate is WeeklyKeyCandidate => {
    if (!candidate || seen.has(candidate.key)) return false;
    seen.add(candidate.key);
    return true;
  });
}

export function createResolvedWeeklyBundle(
  canonicalWeekKey: string,
  candidate: WeeklyKeyCandidate,
  availableGames: WeeklyGameKind[],
): ResolvedWeeklyBundle {
  return {
    canonicalWeekKey,
    contentKey: candidate.key,
    resultKey: candidate.key,
    source: candidate.source,
    isFallback:
      candidate.source !== "iso" || candidate.key !== canonicalWeekKey,
    availableGames,
  };
}

export function createDirectWeeklyBundle(
  weekKey: string,
  game: WeeklyGameKind,
): ResolvedWeeklyBundle {
  return {
    canonicalWeekKey: weekKey,
    contentKey: weekKey,
    resultKey: weekKey,
    source: "override",
    isFallback: false,
    availableGames: [game],
  };
}
