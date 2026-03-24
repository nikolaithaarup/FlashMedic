// src/services/weeklyResultsService.ts
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getActiveWeekId } from "./weeklyIndexService";

export type WeeklyScoreUpdate = {
  uid: string;
  nickname: string;
  weekKey?: string | null;
  mcqScore?: number;
  matchScore?: number;
  wordScore?: number;
};

type WeeklyUserResult = {
  uid: string;
  nickname: string;
  mcqScore?: number;
  matchScore?: number;
  wordScore?: number;
  totalScore?: number;
  updatedAt?: any;
};

function toSafeInt(n: unknown): number {
  const x = typeof n === "number" && Number.isFinite(n) ? Math.floor(n) : 0;
  return x < 0 ? 0 : x;
}

export async function saveWeeklyResult(update: WeeklyScoreUpdate) {
  const weekId = update.weekKey ?? (await getActiveWeekId());

  if (!weekId) {
    throw new Error("No active weekId (weekly_index/current missing)");
  }

  const ref = doc(db, "weekly_results", weekId, "users", update.uid);

  await setDoc(
    ref,
    {
      uid: update.uid,
      nickname: update.nickname,
      ...(typeof update.mcqScore === "number"
        ? { mcqScore: toSafeInt(update.mcqScore) }
        : {}),
      ...(typeof update.matchScore === "number"
        ? { matchScore: toSafeInt(update.matchScore) }
        : {}),
      ...(typeof update.wordScore === "number"
        ? { wordScore: toSafeInt(update.wordScore) }
        : {}),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  const snap = await getDoc(ref);
  const d = (snap.data() || {}) as WeeklyUserResult;

  const total =
    toSafeInt(d.mcqScore) + toSafeInt(d.matchScore) + toSafeInt(d.wordScore);

  await setDoc(
    ref,
    {
      totalScore: total,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return { weekId, totalScore: total };
}
