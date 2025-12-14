// src/features/stats/statsSelectors.ts
import type { Flashcard } from "../../types/Flashcard";

export function getPersonalTotals(stats: any) {
  let seen = 0;
  let correct = 0;
  let incorrect = 0;

  for (const s of Object.values(stats)) {
    seen += s.seen;
    correct += s.correct;
    incorrect += s.incorrect;
  }

  return {
    totalSeen: seen,
    totalCorrect: correct,
    totalIncorrect: incorrect,
    accuracy: seen > 0 ? (correct / seen) * 100 : 0,
  };
}

export function getSubjectStats(stats: any, cards: Flashcard[]) {
  const map = new Map<string, { seen: number; correct: number }>();

  for (const [cardId, s] of Object.entries(stats)) {
    const card = cards.find((c) => c.id === cardId);
    if (!card) continue;

    const subject = card.subject ?? "Ukendt";
    const entry = map.get(subject) ?? { seen: 0, correct: 0 };

    entry.seen += s.seen;
    entry.correct += s.correct;
    map.set(subject, entry);
  }

  return Array.from(map.entries()).map(([subject, v]) => ({
    subject,
    seen: v.seen,
    accuracy: v.seen ? (v.correct / v.seen) * 100 : 0,
  }));
}
