// src/services/weeklyMatchService.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  createDirectWeeklyBundle,
  resolveWeeklyBundle,
  type ResolvedWeeklyBundle,
} from "./weeklyIndexService";
import {
  validateWeeklyMatchPack,
  WeeklyPackValidationError,
} from "./weeklyPackValidation";

export type WeeklyMatchPair = {
  id: string; // IMPORTANT: must be stable + unique within round
  left: string;
  right: string;
};

export type WeeklyMatchRound = {
  round: number;
  topic: string;
  pairs: WeeklyMatchPair[];
};

export type WeeklyMatchPack = {
  weekKey: string;
  topicTitle?: string;
  rounds: WeeklyMatchRound[];
};

function normalizeRound(r: any, fallbackRound: number): WeeklyMatchRound {
  const pairs: WeeklyMatchPair[] = Array.isArray(r?.pairs)
    ? r.pairs.map((p: any, i: number) => ({
        // If you didn’t seed ids, generate deterministic ids per pair index
        id: typeof p?.id === "string" ? p.id : `pair_${fallbackRound}_${i}`,
        left: String(p?.left ?? ""),
        right: String(p?.right ?? ""),
      }))
    : [];

  return {
    round: typeof r?.round === "number" ? r.round : fallbackRound,
    topic: String(r?.topic ?? "Ugens emne"),
    pairs,
  };
}

export async function loadMatchPackByWeekKey(
  weekKey: string,
): Promise<{
  weekKey: string;
  pack: WeeklyMatchPack;
  resolution: ResolvedWeeklyBundle;
} | null> {
  const ref = doc(db, "weekly_match_packs", weekKey);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as any;

  const rawRounds = Array.isArray(data?.rounds) ? data.rounds : [];
  const rounds = rawRounds.map((r: any, idx: number) =>
    normalizeRound(r, idx + 1),
  );

  const pack: WeeklyMatchPack = {
    weekKey: String(data?.weekKey ?? weekKey),
    topicTitle: typeof data?.topicTitle === "string" ? data.topicTitle : "",
    rounds,
  };
  const issues = validateWeeklyMatchPack(pack);
  if (issues.length) throw new WeeklyPackValidationError("Match", issues);

  return {
    weekKey,
    pack,
    resolution: createDirectWeeklyBundle(weekKey, "match"),
  };
}

export async function loadThisWeeksMatchPack(): Promise<{
  weekKey: string;
  pack: WeeklyMatchPack;
  resolution: ResolvedWeeklyBundle;
} | null> {
  const resolution = await resolveWeeklyBundle();
  if (!resolution) return null;
  const result = await loadMatchPackByWeekKey(resolution.contentKey);
  return result ? { ...result, weekKey: resolution.contentKey, resolution } : null;
}
