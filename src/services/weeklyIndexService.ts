import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";
import {
  getCurrentIsoWeekInfo,
  getLegacyWeekKeyCandidates,
} from "../utils/week";

type WeeklyIndexCurrent = {
  weekId?: string;
  weekKey?: string;
  overrideWeekKey?: string;
};

async function loadWeeklyIndex(): Promise<WeeklyIndexCurrent | null> {
  const snap = await getDoc(doc(db, "weekly_index", "current"));
  return snap.exists() ? (snap.data() as WeeklyIndexCurrent) : null;
}

function cleanKey(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function getActiveWeekId(date = new Date()): Promise<string> {
  const index = await loadWeeklyIndex();
  return (
    cleanKey(index?.overrideWeekKey) ?? getCurrentIsoWeekInfo(date).weekKey
  );
}

export async function getActiveWeekKey(date = new Date()): Promise<string> {
  return getActiveWeekId(date);
}

/**
 * Current ISO key first, followed by existing pointer/legacy keys. This makes
 * normal weekly rotation automatic without breaking already seeded data.
 */
export async function getWeeklyKeyCandidates(
  date = new Date(),
): Promise<string[]> {
  const index = await loadWeeklyIndex();
  const override = cleanKey(index?.overrideWeekKey);
  if (override) return [override];

  const candidates = [
    getCurrentIsoWeekInfo(date).weekKey,
    cleanKey(index?.weekKey),
    cleanKey(index?.weekId),
    ...getLegacyWeekKeyCandidates(date),
  ].filter((key): key is string => key !== null);

  return [...new Set(candidates)];
}
