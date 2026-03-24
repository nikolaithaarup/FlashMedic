// src/features/stats/StatsContext.tsx
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
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
export type CardStats = {
  seen: number;
  correct: number;
  incorrect: number;
  lastSeen: string | null;
};

export type StatsMap = Record<string, CardStats>;

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

function safeInt(n: unknown): number {
  const x = typeof n === "number" && Number.isFinite(n) ? Math.floor(n) : 0;
  return x < 0 ? 0 : x;
}

// --------------------
// Provider
// --------------------
export function StatsProvider({ children }: PropsWithChildren) {
  // Personal stats
  const [personalStats, setPersonalStats] = useState<StatsMap>({});

  const markCard = (cardId: string, known: boolean) => {
    if (!cardId) return;

    setPersonalStats((prev) => {
      const current = prev[cardId] ?? {
        seen: 0,
        correct: 0,
        incorrect: 0,
        lastSeen: null,
      };

      const nextSeen = safeInt(current.seen) + 1;
      const nextCorrect = safeInt(current.correct) + (known ? 1 : 0);
      const nextIncorrect = safeInt(current.incorrect) + (known ? 0 : 1);

      return {
        ...prev,
        [cardId]: {
          seen: nextSeen,
          correct: nextCorrect,
          incorrect: nextIncorrect,
          lastSeen: new Date().toISOString(),
        },
      };
    });
  };

  const resetPersonalStats = () => setPersonalStats({});

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
