// src/services/weeklyMatchService.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getActiveWeekKey } from "./weeklyIndexService";

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
): Promise<{ weekKey: string; pack: WeeklyMatchPack } | null> {
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

  return { weekKey: pack.weekKey, pack };
}

export async function loadThisWeeksMatchPack(): Promise<{
  weekKey: string;
  pack: WeeklyMatchPack;
} | null> {
  const activeWeekKey = await getActiveWeekKey();
  if (!activeWeekKey) return null;
  return await loadMatchPackByWeekKey(activeWeekKey);
}
