// src/features/stats/StatsContext.tsx
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  resolveWeeklyBundle,
  type ResolvedWeeklyBundle,
} from "../../services/weeklyIndexService";

import { loadMatchPackByWeekKey } from "../../services/weeklyMatchService";
import { loadMcqPackByWeekKey } from "../../services/weeklyMcqService";
import { loadWordPackByWeekKey } from "../../services/weeklyWordService";
import { flushPendingWeeklyResults } from "../../services/weeklyPendingUploadService";
import {
  loadPersonalStats,
  savePersonalStats,
} from "./statsService";
import { updateStatsForCard } from "../../storage/stats";
import {
  loadMistakes,
  saveMistakes,
  updateMistakeForAttempt,
} from "../../storage/mistakes";
import type { Flashcard } from "../../types/Flashcard";
import type {
  FlashcardTrainingMode,
  MistakeReviewItem,
} from "../../types/Learning";
import type { StatsMap } from "../../types/Stats";
import {
  queueMistakeClear,
  queueProgressAttempt,
  queueProgressReset,
  startProgressSync,
  subscribeProgressSyncState,
  subscribeSyncedProgress,
  synchronizeProgress,
  type ProgressSyncState,
} from "../../sync/progressSync";

export type { CardStats, StatsMap } from "../../types/Stats";

// --------------------
// Types: weekly global
// --------------------
type WeeklyTopics = {
  mcq: string | null;
  match: string | null;
  word: string | null;
};

type WeeklyGlobalState = {
  week: {
    weekId: string;
    topics: WeeklyTopics;
    resolution: ResolvedWeeklyBundle;
  } | null;
  leaderboard: { userId: string; nickname: string; points: number }[];
};

// --------------------
// Types: personal stats
// --------------------
// --------------------
// Context value
// --------------------
type StatsContextValue = {
  // Personal stats (flashcards / quiz)
  personalStats: StatsMap;
  markCard: (cardId: string, known: boolean) => void;
  resetPersonalStats: () => void;
  mistakes: MistakeReviewItem[];
  mistakesHydrated: boolean;
  recordMistakeAttempt: (
    card: Flashcard,
    known: boolean,
    mode: FlashcardTrainingMode,
  ) => void;
  clearUnderstoodMistakes: () => void;
  progressSyncState: ProgressSyncState;
  retryProgressSync: () => Promise<void>;

  // Weekly global stats (leaderboard + topics)
  weeklyGlobal: WeeklyGlobalState | null;
  loadingWeekly: boolean;
  weeklyError: string | null;
  pendingWeeklyUploads: number;
  refreshWeeklyGlobal: () => Promise<void>;
};

const StatsContext = createContext<StatsContextValue | null>(null);

// --------------------
// Helpers
// --------------------
function safeText(v: unknown): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > 0 ? s : null;
}

// --------------------
// Provider
// --------------------
export function StatsProvider({ children }: PropsWithChildren) {
  // Personal stats
  const [personalStats, setPersonalStats] = useState<StatsMap>({});
  const statsHydratedRef = useRef(false);
  const pendingOperationsRef = useRef<
    ({ kind: "mark"; cardId: string; known: boolean } | { kind: "reset" })[]
  >([]);
  const persistenceQueueRef = useRef<Promise<void>>(Promise.resolve());
  const [mistakes, setMistakes] = useState<MistakeReviewItem[]>([]);
  const [mistakesHydrated, setMistakesHydrated] = useState(false);
  const mistakesHydratedRef = useRef(false);
  const pendingMistakeOperationsRef = useRef<
    (
      | { kind: "attempt"; card: Flashcard; known: boolean; mode: FlashcardTrainingMode }
      | { kind: "clear-understood" }
    )[]
  >([]);
  const mistakesPersistenceQueueRef = useRef<Promise<void>>(Promise.resolve());
  const [progressSyncState, setProgressSyncState] = useState<ProgressSyncState>({
    status: "guest",
    pendingCount: 0,
    lastSyncedAt: null,
  });

  useEffect(() => {
    startProgressSync();
    const unsubscribeProgress = subscribeSyncedProgress((progress) => {
      statsHydratedRef.current = true;
      mistakesHydratedRef.current = true;
      setMistakesHydrated(true);
      setPersonalStats(progress.stats);
      setMistakes(progress.mistakes);
    });
    const unsubscribeState = subscribeProgressSyncState(setProgressSyncState);
    return () => {
      unsubscribeProgress();
      unsubscribeState();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void loadPersonalStats().then((storedStats) => {
      if (cancelled) return;

      const hydratedStats = pendingOperationsRef.current.reduce<StatsMap>(
        (current, operation) =>
          operation.kind === "reset"
            ? {}
            : updateStatsForCard(
                current,
                operation.cardId,
                operation.known,
              ),
        storedStats,
      );

      pendingOperationsRef.current = [];
      statsHydratedRef.current = true;
      setPersonalStats(hydratedStats);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void loadMistakes().then((storedMistakes) => {
      if (cancelled) return;
      const hydrated = pendingMistakeOperationsRef.current.reduce<MistakeReviewItem[]>(
        (current, operation) => operation.kind === "clear-understood"
          ? current.filter(({ reviewStatus }) => reviewStatus !== "understood")
          : updateMistakeForAttempt(current, operation.card, operation.known, operation.mode),
        storedMistakes,
      );
      pendingMistakeOperationsRef.current = [];
      mistakesHydratedRef.current = true;
      setMistakesHydrated(true);
      setMistakes(hydrated);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!mistakesHydratedRef.current) return;
    const snapshot = mistakes;
    mistakesPersistenceQueueRef.current = mistakesPersistenceQueueRef.current
      .catch(() => undefined)
      .then(() => saveMistakes(snapshot))
      .catch((error: unknown) => {
        console.warn("Failed to persist mistakes; keeping in-memory review data.", error);
      });
  }, [mistakes]);

  useEffect(() => {
    if (!statsHydratedRef.current) return;

    const snapshot = personalStats;
    persistenceQueueRef.current = persistenceQueueRef.current
      .catch(() => undefined)
      .then(() => savePersonalStats(snapshot))
      .catch((error: unknown) => {
        console.warn(
          "Failed to persist flashcard stats; keeping in-memory progress.",
          error,
        );
      });
  }, [personalStats]);

  const markCard = (cardId: string, known: boolean) => {
    if (!cardId) return;

    if (!statsHydratedRef.current) {
      pendingOperationsRef.current.push({ kind: "mark", cardId, known });
    }
    setPersonalStats((prev) => updateStatsForCard(prev, cardId, known));
  };

  const resetPersonalStats = () => {
    if (!statsHydratedRef.current) {
      pendingOperationsRef.current.push({ kind: "reset" });
    }
    setPersonalStats({});
    void queueProgressReset();
  };

  const recordMistakeAttempt = (
    card: Flashcard,
    known: boolean,
    mode: FlashcardTrainingMode,
  ) => {
    if (!mistakesHydratedRef.current) {
      pendingMistakeOperationsRef.current.push({ kind: "attempt", card, known, mode });
    }
    setMistakes((current) => updateMistakeForAttempt(current, card, known, mode));
    void queueProgressAttempt(card, known, mode);
  };

  const clearUnderstoodMistakes = () => {
    if (!mistakesHydratedRef.current) {
      pendingMistakeOperationsRef.current.push({ kind: "clear-understood" });
    }
    setMistakes((current) => {
      void queueMistakeClear(
        current
          .filter(({ reviewStatus }) => reviewStatus === "understood")
          .map(({ cardId }) => cardId),
      );
      return current.filter(({ reviewStatus }) => reviewStatus !== "understood");
    });
  };

  // Weekly global
  const [weeklyGlobal, setWeeklyGlobal] = useState<WeeklyGlobalState | null>(
    null,
  );
  const [loadingWeekly, setLoadingWeekly] = useState(false);
  const [weeklyError, setWeeklyError] = useState<string | null>(null);
  const [pendingWeeklyUploads, setPendingWeeklyUploads] = useState(0);

  const refreshWeeklyGlobal = useCallback(async () => {
    setLoadingWeekly(true);
    setWeeklyError(null);

    try {
      const uploadResult = await flushPendingWeeklyResults();
      setPendingWeeklyUploads(uploadResult.remaining.length);
      const resolution = await resolveWeeklyBundle();

      if (!resolution) {
        setWeeklyGlobal({ week: null, leaderboard: [] });
        return;
      }

      // Topics from packs (best-effort). Competitive ranking is intentionally
      // disabled until scores can be verified server-side.
      const [mcqRes, matchRes, wordRes] = await Promise.allSettled([
        loadMcqPackByWeekKey(resolution.contentKey),
        loadMatchPackByWeekKey(resolution.contentKey),
        loadWordPackByWeekKey(resolution.contentKey),
      ]);

      const mcqTopic =
        mcqRes.status === "fulfilled"
          ? (safeText(mcqRes.value?.pack?.topicTitle) ??
            (mcqRes.value ? "Ugens emne" : null))
          : null;

      const matchTopic =
        matchRes.status === "fulfilled"
          ? (safeText(matchRes.value?.pack?.topicTitle) ??
            (matchRes.value?.pack?.rounds?.length
              ? matchRes.value.pack.rounds
                  .slice()
                  .sort((a: any, b: any) => (a.round ?? 0) - (b.round ?? 0))
                  .map((r: any) => r?.topic)
                  .filter((t: any) => typeof t === "string" && t.trim().length)
                  .join(" · ") || null
              : null))
          : null;

      const wordTopic =
        wordRes.status === "fulfilled"
          ? (safeText(wordRes.value?.pack?.topicTitle) ??
            (wordRes.value ? "Ugens emne" : null))
          : null;

      const topics: WeeklyTopics = {
        mcq: mcqTopic,
        match: matchTopic,
        word: wordTopic,
      };

      setWeeklyGlobal({
        week: { weekId: resolution.canonicalWeekKey, topics, resolution },
        leaderboard: [],
      });
    } catch (e) {
      console.error("refreshWeeklyGlobal failed", e);
      setWeeklyError(
        e instanceof Error
          ? e.message
          : "Ugens udfordringer kunne ikke hentes. Prøv igen.",
      );
      setWeeklyGlobal((prev) => prev ?? { week: null, leaderboard: [] });
    } finally {
      setLoadingWeekly(false);
    }
  }, []);

  const value = useMemo<StatsContextValue>(
    () => ({
      personalStats,
      markCard,
      resetPersonalStats,
      mistakes,
      mistakesHydrated,
      recordMistakeAttempt,
      clearUnderstoodMistakes,
      progressSyncState,
      retryProgressSync: synchronizeProgress,

      weeklyGlobal,
      loadingWeekly,
      weeklyError,
      pendingWeeklyUploads,
      refreshWeeklyGlobal,
    }),
    [
      personalStats,
      mistakes,
      mistakesHydrated,
      progressSyncState,
      weeklyGlobal,
      loadingWeekly,
      weeklyError,
      pendingWeeklyUploads,
      refreshWeeklyGlobal,
    ],
  );

  return (
    <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
  );
}

export function useStats(): StatsContextValue {
  const ctx = useContext(StatsContext);
  if (!ctx) {
    throw new Error(
      "useStats must be used inside StatsProvider (check app/_layout.tsx)",
    );
  }
  return ctx;
}
