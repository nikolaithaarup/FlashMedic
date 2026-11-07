import { updateMistakeForAttempt } from "../storage/mistakes";
import { updateStatsForCard } from "../storage/stats";
import type { Flashcard } from "../types/Flashcard";
import type { FlashcardTrainingMode, MistakeReviewItem } from "../types/Learning";
import type { StatsMap } from "../types/Stats";

export type ProgressEvent = {
  schemaVersion: 1;
  eventId: string;
  type: "baseline" | "attempt" | "mistake_clear" | "reset";
  deviceId: string;
  cardId: string | null;
  subject: string | null;
  topic: string | null;
  subtopic: string | null;
  occurredAt: string;
  known: boolean | null;
  mode: FlashcardTrainingMode | null;
  seen: number | null;
  correct: number | null;
  incorrect: number | null;
  lastSeen: string | null;
  mistakeAddedAt: string | null;
  mistakeLastReviewedAt: string | null;
  mistakeIncorrectCount: number | null;
  mistakeReviewStatus: "pending" | "learning" | "understood" | null;
};

export type SyncedProgress = { stats: StatsMap; mistakes: MistakeReviewItem[] };

export function parseProgressQueue(raw: string | null): ProgressEvent[] {
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.some((event) =>
    !event || typeof event !== "object" || typeof (event as { eventId?: unknown }).eventId !== "string"
  )) {
    throw new Error("FlashMedic progress queue is invalid; preserving it for recovery.");
  }
  return parsed as ProgressEvent[];
}

function mergeBaselineMistake(
  current: MistakeReviewItem | undefined,
  event: ProgressEvent,
): MistakeReviewItem | undefined {
  if (!event.cardId || !event.mistakeAddedAt || !event.mistakeReviewStatus) return current;
  const candidate: MistakeReviewItem = {
    cardId: event.cardId,
    subject: event.subject ?? "Ukendt",
    ...(event.topic ? { topic: event.topic } : {}),
    ...(event.subtopic ? { subtopic: event.subtopic } : {}),
    addedAt: event.mistakeAddedAt,
    ...(event.mistakeLastReviewedAt ? { lastReviewedAt: event.mistakeLastReviewedAt } : {}),
    incorrectCount: event.mistakeIncorrectCount ?? 1,
    reviewStatus: event.mistakeReviewStatus,
  };
  if (!current) return candidate;
  const currentTime = Date.parse(current.lastReviewedAt ?? current.addedAt);
  const candidateTime = Date.parse(candidate.lastReviewedAt ?? candidate.addedAt);
  return {
    ...(candidateTime >= currentTime ? candidate : current),
    addedAt: current.addedAt < candidate.addedAt ? current.addedAt : candidate.addedAt,
    incorrectCount: current.incorrectCount + candidate.incorrectCount,
  };
}

export function foldProgressEvents(events: readonly ProgressEvent[]): SyncedProgress {
  let stats: StatsMap = {};
  let mistakes: MistakeReviewItem[] = [];
  const sorted = [...new Map(events.map((event) => [event.eventId, event])).values()].sort((left, right) =>
    left.occurredAt.localeCompare(right.occurredAt) || left.eventId.localeCompare(right.eventId),
  );
  for (const event of sorted) {
    if (event.type === "reset") {
      stats = {};
      mistakes = [];
      continue;
    }
    if (!event.cardId) continue;
    if (event.type === "baseline") {
      const current = stats[event.cardId] ?? { seen: 0, correct: 0, incorrect: 0, lastSeen: null };
      stats[event.cardId] = {
        seen: current.seen + (event.seen ?? 0),
        correct: current.correct + (event.correct ?? 0),
        incorrect: current.incorrect + (event.incorrect ?? 0),
        lastSeen: [current.lastSeen, event.lastSeen].filter(Boolean).sort().at(-1) ?? null,
      };
      const mergedMistake = mergeBaselineMistake(
        mistakes.find((item) => item.cardId === event.cardId),
        event,
      );
      if (mergedMistake) {
        mistakes = [...mistakes.filter((item) => item.cardId !== event.cardId), mergedMistake];
      }
      continue;
    }
    if (event.type === "mistake_clear") {
      mistakes = mistakes.filter((item) => item.cardId !== event.cardId);
      continue;
    }
    const card: Flashcard = {
      id: event.cardId,
      subject: event.subject ?? "Ukendt",
      ...(event.topic ? { topic: event.topic } : {}),
      ...(event.subtopic ? { subtopic: event.subtopic } : {}),
      question: "",
      answer: "",
      difficulty: "medium",
    };
    stats = updateStatsForCard(stats, event.cardId, event.known === true);
    stats[event.cardId] = { ...stats[event.cardId], lastSeen: event.occurredAt };
    mistakes = updateMistakeForAttempt(
      mistakes,
      card,
      event.known === true,
      event.mode ?? "normal",
      event.occurredAt,
    );
  }
  return { stats, mistakes };
}
