export type IsoWeekInfo = {
  isoYear: number;
  isoWeek: number;
  weekKey: string;
};

export function getCurrentIsoWeekInfo(date = new Date()): IsoWeekInfo {
  const thursday = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const day = thursday.getUTCDay() || 7;
  thursday.setUTCDate(thursday.getUTCDate() + 4 - day);

  const isoYear = thursday.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const isoWeek = Math.ceil(
    ((thursday.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );

  return {
    isoYear,
    isoWeek,
    weekKey: `${isoYear}-W${String(isoWeek).padStart(2, "0")}`,
  };
}

export function getWeekId(date = new Date()): string {
  return getCurrentIsoWeekInfo(date).weekKey;
}

export function getLegacyWeekKeyCandidates(date = new Date()): string[] {
  const { isoWeek } = getCurrentIsoWeekInfo(date);
  const paddedWeek = String(isoWeek).padStart(2, "0");
  return [`week_${paddedWeek}`, `W${paddedWeek}`, paddedWeek];
}
