import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CardStats, StatsMap } from "../types/Stats";

const STATS_KEY = "flashmedic_card_stats";

export async function loadStats(): Promise<StatsMap> {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load stats", e);
    return {};
  }
}

export async function saveStats(stats: StatsMap): Promise<void> {
  try {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn("Failed to save stats", e);
  }
}

export function updateStatsForCard(
  oldStats: StatsMap,
  cardId: string,
  knew: boolean
): StatsMap {
  const prev: CardStats =
    oldStats[cardId] ?? { seen: 0, correct: 0, incorrect: 0, lastSeen: null };

  const now = new Date().toISOString();

  const next: CardStats = {
    seen: prev.seen + 1,
    correct: prev.correct + (knew ? 1 : 0),
    incorrect: prev.incorrect + (knew ? 0 : 1),
    lastSeen: now,
  };

  return {
    ...oldStats,
    [cardId]: next,
  };
}
