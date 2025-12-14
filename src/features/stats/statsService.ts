// src/features/stats/statsService.ts
import { loadStats as loadLocalStats, saveStats } from "../../storage/stats";
import { loadActiveWeek, loadLeaderboardTop10 } from "../weekly/weeklyService";

export async function loadPersonalStats() {
  return await loadLocalStats();
}

export async function savePersonalStats(stats: any) {
  await saveStats(stats);
}

export async function loadWeeklyGlobalStats() {
  const week = await loadActiveWeek();
  if (!week?.weekId) {
    return { week: null, leaderboard: [] };
  }

  const leaderboard = await loadLeaderboardTop10(week.weekId);
  return { week, leaderboard };
}
