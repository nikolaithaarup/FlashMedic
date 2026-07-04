import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Flashcard } from "../types/Flashcard";
import type {
  FlashcardTrainingMode,
  MistakeReviewItem,
  MistakeReviewStatus,
} from "../types/Learning";

export const MISTAKES_STORAGE_KEY = "flashmedic_mistakes_v1";
const SCHEMA_VERSION = 1;

type StoredMistakes = {
  schemaVersion: 1;
  items: MistakeReviewItem[];
};

function optionalText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function safeDate(value: unknown): string | undefined {
  const text = optionalText(value);
  return text && !Number.isNaN(Date.parse(text)) ? text : undefined;
}

function safeStatus(value: unknown): MistakeReviewStatus {
  return value === "learning" || value === "understood" ? value : "pending";
}

export function parseStoredMistakes(value: unknown): MistakeReviewItem[] {
  const envelope = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
  const rawItems = envelope && Array.isArray(envelope.items)
    ? envelope.items
    : Array.isArray(value)
      ? value
      : [];
  const byCardId = new Map<string, MistakeReviewItem>();
  for (const rawItem of rawItems) {
    if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) continue;
    const item = rawItem as Record<string, unknown>;
    const cardId = optionalText(item.cardId);
    const subject = optionalText(item.subject);
    const addedAt = safeDate(item.addedAt);
    if (!cardId || !subject || !addedAt) continue;
    const candidate: MistakeReviewItem = {
      cardId,
      subject,
      ...(optionalText(item.topic) ? { topic: optionalText(item.topic) } : {}),
      ...(optionalText(item.subtopic) ? { subtopic: optionalText(item.subtopic) } : {}),
      addedAt,
      ...(safeDate(item.lastReviewedAt) ? { lastReviewedAt: safeDate(item.lastReviewedAt) } : {}),
      incorrectCount: typeof item.incorrectCount === "number" && Number.isFinite(item.incorrectCount)
        ? Math.max(1, Math.floor(item.incorrectCount))
        : 1,
      reviewStatus: safeStatus(item.reviewStatus),
    };
    const existing = byCardId.get(cardId);
    if (!existing || candidate.incorrectCount >= existing.incorrectCount) byCardId.set(cardId, candidate);
  }
  return [...byCardId.values()];
}

export function serializeMistakes(items: readonly MistakeReviewItem[]): string {
  const payload: StoredMistakes = { schemaVersion: SCHEMA_VERSION, items: parseStoredMistakes({ items }) };
  return JSON.stringify(payload);
}

export function updateMistakeForAttempt(
  items: readonly MistakeReviewItem[],
  card: Flashcard,
  known: boolean,
  mode: FlashcardTrainingMode,
  now = new Date().toISOString(),
): MistakeReviewItem[] {
  const existing = items.find(({ cardId }) => cardId === card.id);
  if (!existing && known) return [...items];
  let next: MistakeReviewItem;
  if (!existing) {
    next = {
      cardId: card.id,
      subject: card.subject,
      ...(card.topic ? { topic: card.topic } : {}),
      ...(card.subtopic ? { subtopic: card.subtopic } : {}),
      addedAt: now,
      incorrectCount: 1,
      reviewStatus: "pending",
    };
  } else if (!known) {
    next = {
      ...existing,
      subject: card.subject,
      ...(card.topic ? { topic: card.topic } : {}),
      ...(card.subtopic ? { subtopic: card.subtopic } : {}),
      ...(mode === "mistakes" ? { lastReviewedAt: now } : {}),
      incorrectCount: existing.incorrectCount + 1,
      reviewStatus: "learning",
    };
  } else {
    next = {
      ...existing,
      lastReviewedAt: now,
      reviewStatus: mode === "mistakes" ? "understood" : "learning",
    };
  }
  return [...items.filter(({ cardId }) => cardId !== card.id), next];
}

export async function loadMistakes(): Promise<MistakeReviewItem[]> {
  try {
    const raw = await AsyncStorage.getItem(MISTAKES_STORAGE_KEY);
    return raw ? parseStoredMistakes(JSON.parse(raw)) : [];
  } catch (error) {
    console.warn("Failed to load mistake review data; using an empty queue.", error);
    return [];
  }
}

export async function saveMistakes(items: readonly MistakeReviewItem[]): Promise<void> {
  await AsyncStorage.setItem(MISTAKES_STORAGE_KEY, serializeMistakes(items));
}
