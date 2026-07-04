import type { Flashcard } from "../../types/Flashcard";
import type { StatsMap } from "../../types/Stats";
import type { MistakeReviewItem, TopicStats } from "../../types/Learning";

export const MIN_WEAK_TOPIC_ATTEMPTS = 5;

export function topicKey(card: Pick<Flashcard, "subject" | "topic" | "subtopic">): string {
  return [card.subject, card.topic || "Ukendt emne", card.subtopic || ""].join("::");
}

export function deriveTopicStats(
  stats: StatsMap,
  cards: readonly Flashcard[],
  minimumAttempts = MIN_WEAK_TOPIC_ATTEMPTS,
): TopicStats[] {
  const cardById = new Map(cards.map((card) => [card.id, card]));
  const grouped = new Map<string, Omit<TopicStats, "accuracy" | "weaknessScore" | "dataQuality">>();
  for (const [cardId, performance] of Object.entries(stats)) {
    const card = cardById.get(cardId);
    if (!card || performance.seen <= 0) continue;
    const key = topicKey(card);
    const existing = grouped.get(key) ?? {
      key,
      subject: card.subject,
      topic: card.topic || "Ukendt emne",
      ...(card.subtopic ? { subtopic: card.subtopic } : {}),
      attempts: 0,
      correct: 0,
      incorrect: 0,
    };
    existing.attempts += performance.seen;
    existing.correct += performance.correct;
    existing.incorrect += performance.incorrect;
    if (performance.lastSeen && (!existing.lastPracticedAt || performance.lastSeen > existing.lastPracticedAt)) {
      existing.lastPracticedAt = performance.lastSeen;
    }
    grouped.set(key, existing);
  }
  return [...grouped.values()].map((entry): TopicStats => {
    const accuracy = entry.attempts > 0
      ? Math.min(1, Math.max(0, entry.correct / entry.attempts))
      : 0;
    return {
      ...entry,
      accuracy,
      weaknessScore: entry.attempts >= minimumAttempts
        ? Math.min(1, Math.max(0, entry.incorrect / entry.attempts))
        : 0,
      dataQuality: entry.attempts >= minimumAttempts ? "usable" : "insufficient",
    };
  }).sort((left, right) =>
    Number(right.dataQuality === "usable") - Number(left.dataQuality === "usable") ||
    right.weaknessScore - left.weaknessScore ||
    right.attempts - left.attempts ||
    (right.lastPracticedAt ?? "").localeCompare(left.lastPracticedAt ?? "") ||
    left.key.localeCompare(right.key)
  );
}

export function selectMistakeReviewCards(
  mistakes: readonly MistakeReviewItem[],
  cards: readonly Flashcard[],
): { cards: Flashcard[]; orphanedCardIds: string[] } {
  const cardById = new Map(cards.map((card) => [card.id, card]));
  const selected: Flashcard[] = [];
  const orphanedCardIds: string[] = [];
  const seen = new Set<string>();
  for (const mistake of mistakes) {
    if (mistake.reviewStatus === "understood" || seen.has(mistake.cardId)) continue;
    seen.add(mistake.cardId);
    const card = cardById.get(mistake.cardId);
    if (card) selected.push(card);
    else orphanedCardIds.push(mistake.cardId);
  }
  return { cards: selected, orphanedCardIds };
}

export function selectWeakTopicCards(
  topicStats: readonly TopicStats[],
  cards: readonly Flashcard[],
  topicLimit = 3,
): Flashcard[] {
  const weakKeys = new Set(topicStats.filter(({ dataQuality }) => dataQuality === "usable").slice(0, topicLimit).map(({ key }) => key));
  const seen = new Set<string>();
  return cards.filter((card) => {
    if (!weakKeys.has(topicKey(card)) || seen.has(card.id)) return false;
    seen.add(card.id);
    return true;
  });
}
