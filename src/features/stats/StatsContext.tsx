// src/features/stats/StatsContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { updateStatsForCard } from "../../storage/stats";
import { loadPersonalStats, loadWeeklyGlobalStats, savePersonalStats } from "./statsService";

type StatsContextValue = {
  personalStats: any;
  markCard: (cardId: string, wasCorrect: boolean) => void;
  resetPersonalStats: () => void;

  weeklyGlobal: any;
  loadingWeekly: boolean;
  refreshWeeklyGlobal: () => Promise<void>;
};

const StatsContext = createContext<StatsContextValue | null>(null);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [personalStats, setPersonalStats] = useState<any>({});
  const [weeklyGlobal, setWeeklyGlobal] = useState<any>(null);
  const [loadingWeekly, setLoadingWeekly] = useState(false);

  useEffect(() => {
    loadPersonalStats().then(setPersonalStats);
  }, []);

  const markCard = (cardId: string, wasCorrect: boolean) => {
    setPersonalStats((prev: any) => {
      const next = updateStatsForCard(prev, cardId, wasCorrect);
      savePersonalStats(next); // persist
      return next;
    });
  };

  const resetPersonalStats = () => {
    setPersonalStats({});
    savePersonalStats({});
  };

  async function refreshWeeklyGlobal() {
    setLoadingWeekly(true);
    try {
      const data = await loadWeeklyGlobalStats();
      setWeeklyGlobal(data);
    } finally {
      setLoadingWeekly(false);
    }
  }

  const value = useMemo(
    () => ({
      personalStats,
      markCard,
      resetPersonalStats,
      weeklyGlobal,
      loadingWeekly,
      refreshWeeklyGlobal,
    }),
    [personalStats, weeklyGlobal, loadingWeekly]
  );

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

export function useStats() {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStats must be used inside StatsProvider");
  return ctx;
}
