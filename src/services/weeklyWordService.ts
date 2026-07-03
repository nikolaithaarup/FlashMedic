// src/services/weeklyWordService.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  createDirectWeeklyBundle,
  resolveWeeklyBundle,
  type ResolvedWeeklyBundle,
} from "./weeklyIndexService";
import {
  validateWeeklyWordPack,
  WeeklyPackValidationError,
} from "./weeklyPackValidation";

export type WeeklyWordRound = {
  round: number;
  topic: string;
  minLength: number;
  maxLength: number;
  words: string[];
};

export type WeeklyWordPack = {
  weekKey: string;
  topicTitle?: string;
  rounds: WeeklyWordRound[];
};

function toInt(n: any, fallback: number) {
  const x =
    typeof n === "number" && Number.isFinite(n) ? Math.floor(n) : fallback;
  return x;
}

function normalizeWords(input: any): string[] {
  return Array.isArray(input)
    ? input.map((w) => String(w ?? "").trim()).filter((w) => w.length > 0)
    : [];
}

function normalizeRound(r: any, fallbackRound: number): WeeklyWordRound {
  return {
    round: typeof r?.round === "number" ? r.round : fallbackRound,
    topic: String(r?.topic ?? "Ugens emne"),
    minLength: toInt(r?.minLength, 1),
    maxLength: toInt(r?.maxLength, 99),
    words: normalizeWords(r?.words),
  };
}

function buildLegacyRounds(topicTitle: string, source: any): WeeklyWordRound[] {
  const easy = normalizeWords(source?.easy);
  const medium = normalizeWords(source?.medium);
  const hard = normalizeWords(source?.hard);

  const rounds: WeeklyWordRound[] = [];

  if (easy.length > 0) {
    rounds.push({
      round: 1,
      topic: `${topicTitle} – let`,
      minLength: 1,
      maxLength: 5,
      words: easy,
    });
  }

  if (medium.length > 0) {
    rounds.push({
      round: 2,
      topic: `${topicTitle} – mellem`,
      minLength: 6,
      maxLength: 10,
      words: medium,
    });
  }

  if (hard.length > 0) {
    rounds.push({
      round: 3,
      topic: `${topicTitle} – svær`,
      minLength: 8,
      maxLength: 99,
      words: hard,
    });
  }

  return rounds;
}

function extractWordPack(data: any, fallbackWeekKey: string): WeeklyWordPack {
  const directRounds = Array.isArray(data?.rounds)
    ? data.rounds.map((r: any, idx: number) => normalizeRound(r, idx + 1))
    : [];

  if (directRounds.length > 0) {
    return {
      weekKey: String(data?.weekKey ?? fallbackWeekKey),
      topicTitle: typeof data?.topicTitle === "string" ? data.topicTitle : "",
      rounds: directRounds,
    };
  }

  const nestedWord = data?.word;
  const source =
    nestedWord && typeof nestedWord === "object" ? nestedWord : data;

  const topicTitle =
    typeof source?.topicTitle === "string" && source.topicTitle.trim()
      ? source.topicTitle.trim()
      : typeof data?.title === "string" && data.title.trim()
        ? data.title.trim()
        : "Ugens emne";

  const legacyRounds = buildLegacyRounds(topicTitle, source);

  return {
    weekKey: String(data?.weekKey ?? fallbackWeekKey),
    topicTitle,
    rounds: legacyRounds,
  };
}

export async function loadWordPackByWeekKey(
  weekKey: string,
): Promise<{
  weekKey: string;
  pack: WeeklyWordPack;
  resolution: ResolvedWeeklyBundle;
} | null> {
  const ref = doc(db, "weekly_word_packs", weekKey);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as any;
  const pack = extractWordPack(data, weekKey);
  const issues = validateWeeklyWordPack(pack);
  if (issues.length) throw new WeeklyPackValidationError("Word", issues);

  return {
    weekKey,
    pack,
    resolution: createDirectWeeklyBundle(weekKey, "word"),
  };
}

export async function loadThisWeeksWordPack(): Promise<{
  weekKey: string;
  pack: WeeklyWordPack;
  resolution: ResolvedWeeklyBundle;
} | null> {
  const resolution = await resolveWeeklyBundle();
  if (!resolution) return null;
  const result = await loadWordPackByWeekKey(resolution.contentKey);
  return result ? { ...result, weekKey: resolution.contentKey, resolution } : null;
}

export function pickWordFromRound(round: WeeklyWordRound): string | null {
  const { words, minLength, maxLength } = round;

  const filtered = (words ?? [])
    .map((w) => String(w).trim())
    .filter((w) => w.length >= minLength && w.length <= maxLength);

  if (filtered.length > 0) {
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  const fallback = (words ?? [])
    .map((w) => String(w).trim())
    .filter((w) => w.length > 0);

  if (fallback.length === 0) return null;
  return fallback[Math.floor(Math.random() * fallback.length)];
}
