// src/services/weeklyLeaderboardService.ts
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type WeeklyLeaderboardRow = {
  uid: string;
  nickname: string;
  totalScore: number;
  mcqScore?: number;
  matchScore?: number;
  wordScore?: number;
};

function toNum(n: any): number {
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

export async function getWeeklyLeaderboard(
  weekId: string,
  topN: number = 10,
): Promise<WeeklyLeaderboardRow[]> {
  const q = query(
    collection(db, "weekly_results", weekId, "users"),
    orderBy("totalScore", "desc"),
    limit(topN),
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const x = d.data() as any;
    return {
      uid: String(x.uid ?? d.id),
      nickname: String(x.nickname ?? "Ukendt"),
      totalScore: toNum(x.totalScore),
      mcqScore: toNum(x.mcqScore),
      matchScore: toNum(x.matchScore),
      wordScore: toNum(x.wordScore),
    };
  });
}
