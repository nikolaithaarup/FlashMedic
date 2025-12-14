// src/services/weeklyResultsService.ts
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type WeeklyResultPatch = {
  uid: string;
  nickname: string;

  // allow partial updates (one game at a time)
  mcqScore?: number;
  matchScore?: number;
  wordScore?: number;
};

// Simple ISO-week key like "2025-W50"
function getIsoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7; // Mon=1..Sun=7
  date.setUTCDate(date.getUTCDate() + 4 - day); // nearest Thursday
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export async function saveWeeklyResult(patch: WeeklyResultPatch) {
  const weekKey = getIsoWeekKey(new Date());

  // One document per user per week (easy leaderboard + easy history)
  const docId = `${patch.uid}_${weekKey}`;
  const ref = doc(db, "weeklyResults", docId);

  await setDoc(
    ref,
    {
      uid: patch.uid,
      nickname: patch.nickname,
      weekKey,
      updatedAt: serverTimestamp(),

      // only set the fields you send (merge:true keeps the rest)
      ...(patch.mcqScore !== undefined ? { mcqScore: patch.mcqScore } : {}),
      ...(patch.matchScore !== undefined ? { matchScore: patch.matchScore } : {}),
      ...(patch.wordScore !== undefined ? { wordScore: patch.wordScore } : {}),
    },
    { merge: true },
  );
}
