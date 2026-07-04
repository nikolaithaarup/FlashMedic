import {
  parseStoredMistakes,
  serializeMistakes,
  updateMistakeForAttempt,
} from "../src/storage/mistakes";
import {
  deriveTopicStats,
  selectMistakeReviewCards,
  selectWeakTopicCards,
} from "../src/features/flashcards/learningSelectors";
import type { Flashcard } from "../src/types/Flashcard";
import type { StatsMap } from "../src/types/Stats";

const card = (id: string, topic: string): Flashcard => ({
  id,
  subject: "Testfag",
  topic,
  question: `Spørgsmål ${id}`,
  answer: `Svar ${id}`,
  difficulty: "medium",
});
const cards = [card("a", "Svagt"), card("b", "Svagt"), card("c", "Stærkt")];
const firstError = updateMistakeForAttempt([], cards[0], false, "normal", "2026-01-01T00:00:00.000Z");
if (firstError.length !== 1 || firstError[0].reviewStatus !== "pending" || firstError[0].incorrectCount !== 1) throw new Error("First mistake transition failed.");
const repeatedError = updateMistakeForAttempt(firstError, cards[0], false, "mistakes", "2026-01-02T00:00:00.000Z");
if (repeatedError.length !== 1 || repeatedError[0].reviewStatus !== "learning" || repeatedError[0].incorrectCount !== 2) throw new Error("Repeated mistake was duplicated or not incremented.");
const understood = updateMistakeForAttempt(repeatedError, cards[0], true, "mistakes", "2026-01-03T00:00:00.000Z");
if (understood[0].reviewStatus !== "understood") throw new Error("Correct review did not mark the mistake understood.");
const learnedNormally = updateMistakeForAttempt(repeatedError, cards[0], true, "normal", "2026-01-03T00:00:00.000Z");
if (learnedNormally[0].reviewStatus !== "learning") throw new Error("Normal training removed review pressure.");

const serialized = serializeMistakes([...repeatedError, repeatedError[0]]);
const parsed = parseStoredMistakes(JSON.parse(serialized));
if (parsed.length !== 1 || parsed[0].incorrectCount !== 2) throw new Error("Mistake serialization or deduplication failed.");

const selection = selectMistakeReviewCards(
  [...repeatedError, { ...repeatedError[0], cardId: "missing" }],
  cards,
);
if (selection.cards.length !== 1 || selection.orphanedCardIds[0] !== "missing") throw new Error("Mistake orphan handling failed.");

const stats: StatsMap = {
  a: { seen: 3, correct: 1, incorrect: 2, lastSeen: "2026-01-03T00:00:00.000Z" },
  b: { seen: 2, correct: 0, incorrect: 2, lastSeen: "2026-01-04T00:00:00.000Z" },
  c: { seen: 8, correct: 7, incorrect: 1, lastSeen: "2026-01-02T00:00:00.000Z" },
};
const topics = deriveTopicStats(stats, cards);
if (topics[0].topic !== "Svagt" || topics[0].attempts !== 5 || topics[0].weaknessScore !== 0.8) throw new Error("Weak-topic grouping or sorting failed.");
if (topics.some(({ attempts, dataQuality }) => attempts < 5 && dataQuality !== "insufficient")) throw new Error("Minimum attempt threshold failed.");
const weakCards = selectWeakTopicCards(topics, [...cards, cards[0]], 1);
if (weakCards.length !== 2 || weakCards.some(({ topic }) => topic !== "Svagt")) throw new Error("Weak-topic card selection or deduplication failed.");

console.log("Validated mistake persistence model, transitions, orphan handling, weak-topic grouping, threshold, sorting, and session selection.");
