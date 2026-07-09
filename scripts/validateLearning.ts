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
import {
  applyExamAnswersToLearningState,
  createExamAnswer,
  EXAM_CARD_COUNT,
  selectExamCards,
  summarizeExamAnswers,
} from "../src/features/flashcards/examMode";
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

const examCards: Flashcard[] = Array.from({ length: 30 }, (_, index) => ({
  id: `exam-${String(index + 1).padStart(2, "0")}`,
  subject: index % 2 === 0 ? "Akutte tilstande" : "Anatomi",
  topic: index % 3 === 0 ? "Svagt" : index % 3 === 1 ? "Fejl" : "Blandet",
  question: `Exam question ${index + 1}`,
  answer: `Exam answer ${index + 1}`,
  difficulty: "medium",
  schemaVersion: index % 4 === 0 ? 2 : 1,
  reviewStatus: index % 4 === 0 ? "reviewed" : "draft",
}));
const examStats: StatsMap = {
  "exam-01": { seen: 8, correct: 2, incorrect: 6, lastSeen: "2026-01-01T00:00:00.000Z" },
  "exam-04": { seen: 5, correct: 1, incorrect: 4, lastSeen: "2026-01-01T00:00:00.000Z" },
  "exam-02": { seen: 1, correct: 0, incorrect: 1, lastSeen: "2026-01-01T00:00:00.000Z" },
};
const examTopics = deriveTopicStats(examStats, examCards, 2);
const selectedExamCards = selectExamCards({
  cards: [...examCards, examCards[0]],
  stats: examStats,
  mistakes: [
    {
      cardId: "exam-05",
      subject: "Akutte tilstande",
      topic: "Fejl",
      addedAt: "2026-01-01T00:00:00.000Z",
      incorrectCount: 1,
      reviewStatus: "pending",
    },
    {
      cardId: "missing-exam-card",
      subject: "Ukendt",
      addedAt: "2026-01-01T00:00:00.000Z",
      incorrectCount: 1,
      reviewStatus: "pending",
    },
  ],
  topicStats: examTopics,
});
const selectedIds = selectedExamCards.map(({ id }) => id);
if (selectedExamCards.length !== EXAM_CARD_COUNT) throw new Error("Exam selector did not return 20 cards when enough cards exist.");
if (new Set(selectedIds).size !== selectedIds.length) throw new Error("Exam selector returned duplicate card IDs.");
if (selectedIds.includes("missing-exam-card")) throw new Error("Exam selector included an orphaned mistake ID.");
if (!selectedIds.includes("exam-05")) throw new Error("Exam selector did not include available pending mistake cards.");
if (!selectedExamCards.some((candidate) => candidate.schemaVersion === 2 && candidate.reviewStatus === "reviewed")) throw new Error("Exam selector did not prefer reviewed V2 cards when available.");
const sparseExamCards = selectExamCards({
  cards: examCards.slice(0, 3),
  stats: {},
  mistakes: [],
  topicStats: [],
});
if (sparseExamCards.length !== 3) throw new Error("Exam selector did not handle sparse card data.");

const examAnswers = [
  createExamAnswer(examCards[0], "correct", "2026-01-02T00:00:00.000Z"),
  createExamAnswer(examCards[1], "incorrect", "2026-01-02T00:01:00.000Z"),
  createExamAnswer(examCards[2], "incorrect", "2026-01-02T00:02:00.000Z"),
  createExamAnswer(examCards[2], "correct", "2026-01-02T00:03:00.000Z"),
];
const examSummary = summarizeExamAnswers(examAnswers);
if (examSummary.totalAnswered !== 3 || examSummary.correct !== 2 || examSummary.incorrect !== 1) throw new Error("Exam summary calculation or answer de-duplication failed.");
if (examSummary.bySubject.length === 0 || examSummary.byTopic.length === 0) throw new Error("Exam summary breakdown failed.");

const applied = applyExamAnswersToLearningState({
  stats: {},
  mistakes: [],
  cards: examCards,
  answers: examAnswers,
});
if (applied.stats["exam-01"].seen !== 1 || applied.stats["exam-03"].correct !== 1) throw new Error("Exam stats were not applied once per card.");
if (applied.mistakes.length !== 1 || applied.mistakes[0].cardId !== "exam-02") throw new Error("Wrong exam answers did not enter mistake review correctly.");
let submitted = false;
let guardedStats: StatsMap = {};
const submitOnce = () => {
  if (submitted) return;
  submitted = true;
  guardedStats = applyExamAnswersToLearningState({
    stats: guardedStats,
    mistakes: [],
    cards: examCards,
    answers: examAnswers,
  }).stats;
};
submitOnce();
submitOnce();
if (guardedStats["exam-01"].seen !== 1) throw new Error("Exam submission guard allowed double-counting.");
const nonExamQueueAfterWrong = [cards[1]];
if (nonExamQueueAfterWrong.length !== 1) throw new Error("Normal non-exam immediate queue behavior fixture failed.");

console.log("Validated mistake persistence, weak-topic selection, exam selection, exam summaries, one-shot exam scoring, and session guards.");
