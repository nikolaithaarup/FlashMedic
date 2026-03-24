// src/features/stats/statsSelectors.ts
import type { Flashcard } from "../../types/Flashcard";

type StatRow = { seen?: number; correct?: number; incorrect?: number };
type StatsMap = Record<string, StatRow> | null | undefined;

function toInt(n: unknown): number {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

export function getPersonalTotals(stats: StatsMap) {
  let seen = 0;
  let correct = 0;
  let incorrect = 0;

  // ✅ Always give Object.values an object (never null/undefined)
  for (const s of Object.values(stats ?? {})) {
    seen += toInt(s?.seen);
    correct += toInt(s?.correct);
    incorrect += toInt(s?.incorrect);
  }

  return {
    totalSeen: seen,
    totalCorrect: correct,
    totalIncorrect: incorrect,
    accuracy: seen > 0 ? (correct / seen) * 100 : 0,
  };
}

export function getSubjectStats(stats: StatsMap, cards: Flashcard[]) {
  const map = new Map<string, { seen: number; correct: number }>();

  // ✅ Same deal here: never iterate entries of null/undefined
  for (const [cardId, s] of Object.entries(stats ?? {})) {
    const card = cards.find((c) => c.id === cardId);
    if (!card) continue;

    const subject = card.subject ?? "Ukendt";
    const entry = map.get(subject) ?? { seen: 0, correct: 0 };

    entry.seen += toInt(s?.seen);
    entry.correct += toInt(s?.correct);
    map.set(subject, entry);
  }

  return Array.from(map.entries()).map(([subject, v]) => ({
    subject,
    seen: v.seen,
    accuracy: v.seen ? (v.correct / v.seen) * 100 : 0,
  }));
}
