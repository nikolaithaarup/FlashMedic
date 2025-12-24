// src/services/weekly/saveAndMergeWeeklyResult.ts
import { auth } from "../firebase/firebase";
import { saveWeeklyResult } from "./weeklyResultsService";

export type WeeklyResultPartial = {
  mcqScore?: number;
  matchScore?: number;
  wordScore?: number;
};

export async function saveAndMergeWeeklyResult(params: {
  nickname: string;
  scores: WeeklyResultPartial;
}) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  // IMPORTANT:
  // This assumes your saveWeeklyResult() merges fields in Firestore
  // (setDoc(..., { merge: true }) or updateDoc()).
  // If it doesn't, tell me and I’ll adjust weeklyResultsService.
  await saveWeeklyResult({
    uid,
    nickname: params.nickname,
    mcqScore: params.scores.mcqScore ?? 0,
    matchScore: params.scores.matchScore ?? 0,
    wordScore: params.scores.wordScore ?? 0,
  });
}
