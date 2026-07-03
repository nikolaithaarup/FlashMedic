import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CardStats, StatsMap } from "../types/Stats";

const STATS_KEY = "flashmedic_card_stats";

export async function loadStats(): Promise<StatsMap> {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      console.warn("Stored flashcard stats have an invalid shape; ignoring them.");
      return {};
    }

    const stats: StatsMap = {};
    for (const [cardId, value] of Object.entries(parsed)) {
      if (!cardId.trim() || !value || typeof value !== "object") continue;

      const candidate = value as Record<string, unknown>;
      const seen = toSafeCount(candidate.seen);
      const correct = toSafeCount(candidate.correct);
      const incorrect = toSafeCount(candidate.incorrect);
      const lastSeen =
        typeof candidate.lastSeen === "string" ? candidate.lastSeen : null;

      stats[cardId] = { seen, correct, incorrect, lastSeen };
    }
    return stats;
  } catch (e) {
    console.warn("Failed to load stats", e);
    return {};
  }
}

export async function saveStats(stats: StatsMap): Promise<void> {
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function toSafeCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
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
