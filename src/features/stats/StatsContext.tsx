// src/features/stats/StatsContext.tsx
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getActiveWeekId } from "../../services/weeklyIndexService";
import {
  getWeeklyLeaderboard,
  type WeeklyLeaderboardRow,
} from "../../services/weeklyLeaderboardService";

import { loadMatchPackByWeekKey } from "../../services/weeklyMatchService";
import { loadMcqPackByWeekKey } from "../../services/weeklyMcqService";
import { loadWordPackByWeekKey } from "../../services/weeklyWordService";
import {
  loadPersonalStats,
  savePersonalStats,
} from "./statsService";
import { updateStatsForCard } from "../../storage/stats";
import type { StatsMap } from "../../types/Stats";

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
  week: { weekId: string; topics: WeeklyTopics } | null;
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

  // Weekly global stats (leaderboard + topics)
  weeklyGlobal: WeeklyGlobalState | null;
  loadingWeekly: boolean;
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
  };

  // Weekly global
  const [weeklyGlobal, setWeeklyGlobal] = useState<WeeklyGlobalState | null>(
    null,
  );
  const [loadingWeekly, setLoadingWeekly] = useState(false);

  const refreshWeeklyGlobal = async () => {
    setLoadingWeekly(true);

    try {
      const weekId = await getActiveWeekId();

      if (!weekId) {
        setWeeklyGlobal({ week: null, leaderboard: [] });
        return;
      }

      // 1) Leaderboard
      const rows: WeeklyLeaderboardRow[] = await getWeeklyLeaderboard(
        weekId,
        10,
      );

      // 2) Topics from packs (best-effort)
      const [mcqRes, matchRes, wordRes] = await Promise.allSettled([
        loadMcqPackByWeekKey(weekId),
        loadMatchPackByWeekKey(weekId),
        loadWordPackByWeekKey(weekId),
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
        week: { weekId, topics },
        leaderboard: rows.map((r) => ({
          userId: r.uid,
          nickname: r.nickname,
          points: r.totalScore,
        })),
      });
    } catch (e) {
      console.error("refreshWeeklyGlobal failed", e);
      setWeeklyGlobal((prev) => prev ?? { week: null, leaderboard: [] });
    } finally {
      setLoadingWeekly(false);
    }
  };

  const value = useMemo<StatsContextValue>(
    () => ({
      personalStats,
      markCard,
      resetPersonalStats,

      weeklyGlobal,
      loadingWeekly,
      refreshWeeklyGlobal,
    }),
    [personalStats, weeklyGlobal, loadingWeekly],
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
