// src/services/weeklyMcqService.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getActiveWeekKey } from "./weeklyIndexService";

export type WeeklyMcqOption = { id: string; text: string; isCorrect?: boolean };

export type WeeklyMcqQuestion = {
  id: string;
  category?: string;
  text: string;
  explanation?: string;
  options: WeeklyMcqOption[];
};

export type WeeklyMcqPack = {
  weekKey: string;
  isActive?: boolean;
  topicTitle?: string;
  rounds: string[];
  timeLimitSec?: number;
  questions: WeeklyMcqQuestion[];
};

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : v == null ? fallback : String(v);
}
function asNumber(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}
function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => asString(x))
    .map((s) => s.trim())
    .filter(Boolean);
}
function safeOptions(v: unknown): WeeklyMcqOption[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((o: any) => ({
      id: asString(o?.id),
      text: asString(o?.text),
      isCorrect: !!o?.isCorrect,
    }))
    .filter((o) => o.id && o.text);
}
function safeQuestions(v: unknown): WeeklyMcqQuestion[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((q: any) => ({
      id: asString(q?.id),
      category: q?.category != null ? asString(q.category) : undefined,
      text: asString(q?.text),
      explanation: q?.explanation != null ? asString(q.explanation) : undefined,
      options: safeOptions(q?.options),
    }))
    .filter((q) => q.id && q.text && q.options.length > 0);
}

function normalizeMcqPack(raw: any, fallbackWeekKey: string): WeeklyMcqPack {
  // ✅ support nested "pack"
  const root = raw?.pack && typeof raw.pack === "object" ? raw.pack : raw;

  const weekKey = asString(raw?.weekKey ?? root?.weekKey ?? fallbackWeekKey);

  const topicTitle =
    root?.topicTitle != null
      ? asString(root.topicTitle)
      : root?.title != null
        ? asString(root.title)
        : undefined;

  const rounds =
    asStringArray(root?.rounds).length > 0
      ? asStringArray(root.rounds)
      : asStringArray(root?.mcqRounds).length > 0
        ? asStringArray(root.mcqRounds)
        : asStringArray(root?.mcq?.rounds);

  const timeLimitSec =
    root?.timeLimitSec != null
      ? asNumber(root.timeLimitSec, 30)
      : root?.mcq?.timeLimitSec != null
        ? asNumber(root.mcq.timeLimitSec, 30)
        : undefined;

  const questions =
    safeQuestions(root?.questions).length > 0
      ? safeQuestions(root.questions)
      : safeQuestions(root?.mcq?.questions);

  return {
    weekKey,
    isActive: !!(raw?.isActive ?? root?.isActive),
    topicTitle,
    rounds,
    timeLimitSec,
    questions,
  };
}

// NORMAL MODE (active week)
export async function loadThisWeeksMcqPack(): Promise<{
  weekKey: string;
  pack: WeeklyMcqPack;
} | null> {
  const activeWeekKey = await getActiveWeekKey();
  if (!activeWeekKey) return null;
  return await loadMcqPackByWeekKey(activeWeekKey);
}

// ✅ DEV MODE / OVERRIDE (direct doc by weekKey)
export async function loadMcqPackByWeekKey(
  weekKey: string,
): Promise<{ weekKey: string; pack: WeeklyMcqPack } | null> {
  const ref = doc(db, "weekly_mcq_packs", weekKey);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as any;
  const pack = normalizeMcqPack(data, weekKey);

  return { weekKey: pack.weekKey, pack };
}
