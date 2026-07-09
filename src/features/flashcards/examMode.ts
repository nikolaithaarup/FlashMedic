import { updateMistakeForAttempt } from "../../storage/mistakes";
import { updateStatsForCard } from "../../storage/stats";
import type { Flashcard } from "../../types/Flashcard";
import type {
  ExamAnswerResult,
  ExamBreakdownRow,
  ExamSessionAnswer,
  ExamSummary,
  MistakeReviewItem,
  TopicStats,
} from "../../types/Learning";
import type { StatsMap } from "../../types/Stats";
import { selectMistakeReviewCards, topicKey } from "./learningSelectors";

export const EXAM_CARD_COUNT = 20;

type ExamBucket = "weak" | "mistake" | "lowSeen" | "reviewed" | "varied";

type SelectExamCardsInput = {
  cards: readonly Flashcard[];
  stats: StatsMap;
  mistakes: readonly MistakeReviewItem[];
  topicStats: readonly TopicStats[];
  limit?: number;
};

type ApplyExamAnswersInput = {
  stats: StatsMap;
  mistakes: readonly MistakeReviewItem[];
  cards: readonly Flashcard[];
  answers: readonly ExamSessionAnswer[];
};

const BUCKET_ORDER: ExamBucket[] = [
  "weak",
  "mistake",
  "lowSeen",
  "reviewed",
  "varied",
];

function stableCardScore(card: Flashcard): string {
  const reviewedPrefix = card.schemaVersion === 2 && card.reviewStatus === "reviewed"
    ? "0"
    : "1";
  return [
    reviewedPrefix,
    card.subject || "",
    card.topic || "",
    card.subtopic || "",
    card.id,
  ].join("::");
}

function uniqueCards(cards: readonly Flashcard[]): Flashcard[] {
  const byId = new Map<string, Flashcard>();
  for (const card of cards) {
    if (!card.id || byId.has(card.id)) continue;
    byId.set(card.id, card);
  }
  return [...byId.values()];
}

function sortCards(cards: readonly Flashcard[]): Flashcard[] {
  return [...cards].sort((left, right) =>
    stableCardScore(left).localeCompare(stableCardScore(right)),
  );
}

function pushCard(
  selected: Flashcard[],
  seenIds: Set<string>,
  card: Flashcard,
  limit: number,
): boolean {
  if (selected.length >= limit || !card.id || seenIds.has(card.id)) {
    return false;
  }
  selected.push(card);
  seenIds.add(card.id);
  return true;
}

function balancedPick(
  buckets: Record<ExamBucket, Flashcard[]>,
  limit: number,
): Flashcard[] {
  const selected: Flashcard[] = [];
  const seenIds = new Set<string>();
  const bucketIndexes: Record<ExamBucket, number> = {
    weak: 0,
    mistake: 0,
    lowSeen: 0,
    reviewed: 0,
    varied: 0,
  };

  let progressed = true;
  while (selected.length < limit && progressed) {
    progressed = false;
    for (const bucket of BUCKET_ORDER) {
      const cards = buckets[bucket];
      while (bucketIndexes[bucket] < cards.length) {
        const candidate = cards[bucketIndexes[bucket]];
        bucketIndexes[bucket] += 1;
        if (pushCard(selected, seenIds, candidate, limit)) {
          progressed = true;
          break;
        }
      }
      if (selected.length >= limit) break;
    }
  }

  return selected;
}

export function selectExamCards({
  cards,
  stats,
  mistakes,
  topicStats,
  limit = EXAM_CARD_COUNT,
}: SelectExamCardsInput): Flashcard[] {
  const safeLimit = Math.max(0, Math.floor(limit));
  if (safeLimit === 0) return [];

  const allCards = sortCards(uniqueCards(cards));
  const cardsById = new Map(allCards.map((card) => [card.id, card]));
  const weakKeys = new Set(
    topicStats
      .filter(({ dataQuality }) => dataQuality === "usable")
      .slice(0, 4)
      .map(({ key }) => key),
  );
  const mistakeCards = selectMistakeReviewCards(mistakes, allCards).cards;

  const weak = allCards.filter((card) => weakKeys.has(topicKey(card)));
  const lowSeen = allCards.filter((card) => (stats[card.id]?.seen ?? 0) <= 1);
  const reviewed = allCards.filter(
    (card) => card.schemaVersion === 2 && card.reviewStatus === "reviewed",
  );
  const varied = allCards.filter((card) => cardsById.has(card.id));

  return balancedPick(
    {
      weak: sortCards(weak),
      mistake: sortCards(mistakeCards),
      lowSeen: sortCards(lowSeen),
      reviewed: sortCards(reviewed),
      varied: sortCards(varied),
    },
    Math.min(safeLimit, allCards.length),
  );
}

export function createExamAnswer(
  card: Flashcard,
  result: ExamAnswerResult,
  answeredAt = new Date().toISOString(),
): ExamSessionAnswer {
  return {
    cardId: card.id,
    subject: card.subject || "Ukendt",
    ...(card.topic ? { topic: card.topic } : {}),
    ...(card.subtopic ? { subtopic: card.subtopic } : {}),
    result,
    answeredAt,
  };
}

function buildBreakdown(
  answers: readonly ExamSessionAnswer[],
  keyForAnswer: (answer: ExamSessionAnswer) => { key: string; label: string },
): ExamBreakdownRow[] {
  const grouped = new Map<string, ExamBreakdownRow>();
  for (const answer of answers) {
    const { key, label } = keyForAnswer(answer);
    const existing = grouped.get(key) ?? {
      key,
      label,
      answered: 0,
      correct: 0,
      incorrect: 0,
      accuracy: 0,
    };
    existing.answered += 1;
    if (answer.result === "correct") existing.correct += 1;
    else existing.incorrect += 1;
    existing.accuracy = existing.answered > 0
      ? (existing.correct / existing.answered) * 100
      : 0;
    grouped.set(key, existing);
  }
  return [...grouped.values()].sort(
    (left, right) => right.answered - left.answered || left.label.localeCompare(right.label),
  );
}

export function summarizeExamAnswers(
  answers: readonly ExamSessionAnswer[],
): ExamSummary {
  const uniqueAnswers = new Map<string, ExamSessionAnswer>();
  for (const answer of answers) {
    if (!answer.cardId) continue;
    uniqueAnswers.set(answer.cardId, answer);
  }
  const values = [...uniqueAnswers.values()];
  const correct = values.filter(({ result }) => result === "correct").length;
  const incorrect = values.length - correct;

  return {
    totalAnswered: values.length,
    correct,
    incorrect,
    accuracy: values.length > 0 ? (correct / values.length) * 100 : 0,
    bySubject: buildBreakdown(values, (answer) => ({
      key: answer.subject || "Ukendt",
      label: answer.subject || "Ukendt",
    })),
    byTopic: buildBreakdown(values, (answer) => {
      const subject = answer.subject || "Ukendt";
      const topic = answer.topic || "Ukendt emne";
      const subtopic = answer.subtopic ? ` · ${answer.subtopic}` : "";
      return {
        key: `${subject}::${topic}::${answer.subtopic || ""}`,
        label: `${subject} · ${topic}${subtopic}`,
      };
    }),
    incorrectCardIds: values
      .filter(({ result }) => result === "incorrect")
      .map(({ cardId }) => cardId),
  };
}

export function applyExamAnswersToLearningState({
  stats,
  mistakes,
  cards,
  answers,
}: ApplyExamAnswersInput): {
  stats: StatsMap;
  mistakes: MistakeReviewItem[];
  summary: ExamSummary;
} {
  const cardById = new Map(cards.map((card) => [card.id, card]));
  const uniqueAnswers = [...new Map(answers.map((answer) => [answer.cardId, answer])).values()];
  const nextStats = uniqueAnswers.reduce<StatsMap>(
    (current, answer) =>
      updateStatsForCard(current, answer.cardId, answer.result === "correct"),
    stats,
  );
  const nextMistakes = uniqueAnswers.reduce<MistakeReviewItem[]>(
    (current, answer) => {
      const card = cardById.get(answer.cardId);
      if (!card) return current;
      return updateMistakeForAttempt(
        current,
        card,
        answer.result === "correct",
        "exam",
        answer.answeredAt,
      );
    },
    [...mistakes],
  );

  return {
    stats: nextStats,
    mistakes: nextMistakes,
    summary: summarizeExamAnswers(uniqueAnswers),
  };
}
