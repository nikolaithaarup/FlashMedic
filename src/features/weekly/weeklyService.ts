// src/features/weekly/weeklyService.ts

export type ActiveWeek = { weekId: string };

// TODO: replace with real Firebase logic
export async function loadActiveWeek(): Promise<ActiveWeek | null> {
  return { weekId: "week_01" };
}

// TODO: replace with real Firebase logic
export async function loadLeaderboardTop10(
  _weekId: string,
): Promise<{ nickname: string; classId?: number | null; score: number }[]> {
  return [];
}
