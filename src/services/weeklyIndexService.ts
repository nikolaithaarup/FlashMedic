import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";
import { getCurrentIsoWeekInfo } from "../utils/week";
import {
  buildWeeklyKeyCandidates,
  createResolvedWeeklyBundle,
  type ResolvedWeeklyBundle,
  type WeeklyGameKind,
  type WeeklyIndexCurrent,
} from "./weeklyKeyResolution";

export * from "./weeklyKeyResolution";

export class WeeklyResolutionError extends Error {
  readonly retryable = true;

  constructor(message: string) {
    super(message);
    this.name = "WeeklyResolutionError";
  }
}

async function loadWeeklyIndex(): Promise<WeeklyIndexCurrent | null> {
  try {
    const snap = await getDoc(doc(db, "weekly_index", "current"));
    return snap.exists() ? (snap.data() as WeeklyIndexCurrent) : null;
  } catch (error) {
    console.warn(
      "Failed to load weekly_index/current; continuing with local ISO week candidates.",
      error,
    );
    return null;
  }
}

const collectionByGame: Record<WeeklyGameKind, string> = {
  mcq: "weekly_mcq_packs",
  match: "weekly_match_packs",
  word: "weekly_word_packs",
};

export async function resolveWeeklyBundle(
  date = new Date(),
): Promise<ResolvedWeeklyBundle | null> {
  const index = await loadWeeklyIndex();
  const canonicalWeekKey = getCurrentIsoWeekInfo(date).weekKey;
  const candidates = buildWeeklyKeyCandidates(date, index);
  let hadReadFailure = false;

  for (const candidate of candidates) {
    const games = Object.keys(collectionByGame) as WeeklyGameKind[];
    const reads = await Promise.allSettled(
      games.map((game) =>
        getDoc(doc(db, collectionByGame[game], candidate.key)),
      ),
    );
    const availableGames = games.filter(
      (_, index) =>
        reads[index].status === "fulfilled" && reads[index].value.exists(),
    );
    if (availableGames.length) {
      return createResolvedWeeklyBundle(
        canonicalWeekKey,
        candidate,
        availableGames,
      );
    }
    if (reads.some((read) => read.status === "rejected")) hadReadFailure = true;
  }

  if (hadReadFailure) {
    throw new WeeklyResolutionError(
      "Ugens indhold kunne ikke kontrolleres. Tjek forbindelsen og prøv igen.",
    );
  }
  return null;
}

export async function getActiveWeekId(date = new Date()): Promise<string> {
  return (
    (await resolveWeeklyBundle(date))?.resultKey ??
    getCurrentIsoWeekInfo(date).weekKey
  );
}

export async function getActiveWeekKey(date = new Date()): Promise<string> {
  return getActiveWeekId(date);
}

export async function getWeeklyKeyCandidates(
  date = new Date(),
): Promise<string[]> {
  return buildWeeklyKeyCandidates(date, await loadWeeklyIndex()).map(
    (candidate) => candidate.key,
  );
}
