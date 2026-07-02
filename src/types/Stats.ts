export type CardStats = {
  seen: number;
  correct: number;
  incorrect: number;
  lastSeen: string | null;
};

export type StatsMap = Record<string, CardStats>;
