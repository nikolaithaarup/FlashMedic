// src/services/weeklyIndexService.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

type WeeklyIndexCurrent = {
  weekId?: string;
  weekKey?: string;
  overrideWeekKey?: string; // optional manual override for testing
};

function getIsoWeekKey(date = new Date()): string {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );

  // Thursday decides ISO year
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  const isoYear = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );

  return `${isoYear}-W${String(weekNo).padStart(2, "0")}`;
}

export async function getActiveWeekId(): Promise<string | null> {
  const ref = doc(db, "weekly_index", "current");
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return getIsoWeekKey();
  }

  const data = snap.data() as WeeklyIndexCurrent;
  return data.overrideWeekKey
    ? String(data.overrideWeekKey)
    : data.weekId
      ? String(data.weekId)
      : getIsoWeekKey();
}

export async function getActiveWeekKey(): Promise<string | null> {
  const ref = doc(db, "weekly_index", "current");
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return getIsoWeekKey();
  }

  const data = snap.data() as WeeklyIndexCurrent;

  if (data.overrideWeekKey) {
    return String(data.overrideWeekKey);
  }

  if (data.weekKey) {
    return String(data.weekKey);
  }

  return getIsoWeekKey();
}
