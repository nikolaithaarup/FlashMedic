// src/services/weeklyPacksDev.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

import type { WeeklyMatchRound } from "./weeklyMatchService";
import type { WeeklyMcqQuestion } from "./weeklyMcqService";
import type { WeeklyWordRound } from "./weeklyWordService";

export type WeeklyDevKind = "mcq" | "match" | "word";

export function makeWeekId(year: number, isoWeek: number) {
  return `${year}-W${String(isoWeek).padStart(2, "0")}`;
}

export async function loadMcqPackByWeekId(weekId: string) {
  const snap = await getDoc(doc(db, "weekly_mcq_packs", weekId));
  if (!snap.exists()) return null;
  const d = snap.data() as any;
  return {
    weekKey: String(d.weekKey ?? weekId),
    topicTitle: d.topicTitle ? String(d.topicTitle) : undefined,
    timeLimitSec: Number(d.timeLimitSec ?? 30),
    questions: Array.isArray(d.questions)
      ? (d.questions as WeeklyMcqQuestion[])
      : [],
  };
}

export async function loadMatchRoundByWeekId(weekId: string, round: number) {
  const snap = await getDoc(doc(db, "weekly_match_packs", weekId));
  if (!snap.exists()) return null;
  const d = snap.data() as any;
  const rounds: WeeklyMatchRound[] = Array.isArray(d.rounds) ? d.rounds : [];
  const r = rounds.find((x: any) => Number(x.round) === Number(round));
  if (!r) return null;
  return {
    weekKey: String(d.weekKey ?? weekId),
    topicTitle: d.topicTitle ? String(d.topicTitle) : undefined,
    round: Number(r.round),
    topic: String(r.topic ?? "Ugens emne"),
    pairs: Array.isArray(r.pairs) ? r.pairs : [],
  };
}

export async function loadWordRoundByWeekId(weekId: string, round: number) {
  const snap = await getDoc(doc(db, "weekly_word_packs", weekId));
  if (!snap.exists()) return null;
  const d = snap.data() as any;
  const rounds: WeeklyWordRound[] = Array.isArray(d.rounds) ? d.rounds : [];
  const r = rounds.find((x: any) => Number(x.round) === Number(round));
  if (!r) return null;
  return {
    weekKey: String(d.weekKey ?? weekId),
    topicTitle: d.topicTitle ? String(d.topicTitle) : undefined,
    round: Number(r.round),
    topic: String(r.topic ?? "Ugens emne"),
    minLength: Number(r.minLength ?? 4),
    maxLength: Number(r.maxLength ?? r.minLength ?? 4),
    words: Array.isArray(r.words) ? r.words.map((w: any) => String(w)) : [],
  };
}
