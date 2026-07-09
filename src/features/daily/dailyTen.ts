import type { Flashcard } from "../../types/Flashcard";

export const DAILY_TEN_CARD_COUNT = 10;

export function getLocalDayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hashText(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function selectDailyTenCards(
  cards: readonly Flashcard[],
  date = new Date(),
): Flashcard[] {
  const dayKey = getLocalDayKey(date);
  const uniqueCards = new Map<string, Flashcard>();

  for (const card of cards) {
    if (!card.id || uniqueCards.has(card.id)) continue;
    uniqueCards.set(card.id, card);
  }

  return [...uniqueCards.values()]
    .sort((left, right) => {
      const leftScore = hashText(`${dayKey}:${left.id}`);
      const rightScore = hashText(`${dayKey}:${right.id}`);
      return leftScore - rightScore || left.id.localeCompare(right.id);
    })
    .slice(0, DAILY_TEN_CARD_COUNT);
}
