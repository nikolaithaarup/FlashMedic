// src/services/weeklyMcqService.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Keep these types aligned with WeeklyMcqScreen
export type WeeklyMcqOption = { id: string; text: string; isCorrect: boolean };
export type WeeklyMcqQuestion = { id: string; text: string; options: WeeklyMcqOption[] };

export type WeeklyMcqPack = {
  year: number;
  week: number;
  gameType: "mcq";
  topicId: string;
  topicTitle: string;
  timeLimitSec: number;
  questions: WeeklyMcqQuestion[];
};

// ISO week helpers (no extra deps)
function getISOWeekAndYear(date: Date) {
  // ISO week date weeks start on Monday, and week 1 is the week with Jan 4 in it.
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Mon=1..Sun=7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // shift to Thursday of current ISO week
  const isoYear = d.getUTCFullYear();

  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  return { isoYear, isoWeek: weekNo };
}

export function getCurrentWeekKey(now = new Date()) {
  const { isoYear, isoWeek } = getISOWeekAndYear(now);
  const ww = String(isoWeek).padStart(2, "0");
  return { isoYear, isoWeek, key: `${isoYear}-W${ww}` };
}

export async function loadThisWeeksMcqPack(): Promise<{
  weekKey: string;
  pack: WeeklyMcqPack;
} | null> {
  const { key } = getCurrentWeekKey();
  const ref = doc(db, "weeklyChallenges", key);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const d = snap.data() as any;
  if (d.gameType !== "mcq") return null;

  return {
    weekKey: key,
    pack: {
      year: Number(d.year ?? 0),
      week: Number(d.week ?? 0),
      gameType: "mcq",
      topicId: String(d.topicId ?? "unknown"),
      topicTitle: String(d.topicTitle ?? "Ugens emne"),
      timeLimitSec: typeof d.timeLimitSec === "number" ? d.timeLimitSec : 30,
      questions: Array.isArray(d.questions) ? d.questions : [],
    },
  };
}
