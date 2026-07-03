import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  parsePendingWeeklyResults,
  type PendingWeeklyResult,
} from "./weeklyPendingModel";

export * from "./weeklyPendingModel";

const STORAGE_KEY = "flashmedic_weekly_pending_results_v1";

export async function loadPendingWeeklyResults(): Promise<PendingWeeklyResult[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? parsePendingWeeklyResults(JSON.parse(raw) as unknown) : [];
  } catch (error) {
    console.warn("Failed to load pending weekly results", error);
    return [];
  }
}

async function saveAll(results: PendingWeeklyResult[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export async function upsertPendingWeeklyResult(
  result: PendingWeeklyResult,
): Promise<void> {
  const current = await loadPendingWeeklyResults();
  const next = current.filter((item) => item.id !== result.id);
  next.push(result);
  await saveAll(next);
}

export async function removePendingWeeklyResult(id: string): Promise<void> {
  const current = await loadPendingWeeklyResults();
  await saveAll(current.filter((item) => item.id !== id));
}

export async function markPendingWeeklyResultFailed(id: string): Promise<void> {
  const current = await loadPendingWeeklyResults();
  await saveAll(
    current.map((item) =>
      item.id === id ? { ...item, status: "failed" } : item,
    ),
  );
}
