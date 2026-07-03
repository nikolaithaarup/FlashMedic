import type { Difficulty, Flashcard } from "../types/Flashcard";

type ParseResult =
  | { ok: true; card: Flashcard; warnings: string[] }
  | { ok: false; errors: string[] };

type FlashcardDocument = {
  data: unknown;
  fallbackId?: string;
  source?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function optionalText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function firstText(
  record: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = optionalText(record[key]);
    if (value) return value;
  }
  return undefined;
}

function parseDifficulty(
  value: unknown,
): { difficulty: Difficulty; warning?: string } {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "easy" || normalized === "medium" || normalized === "hard") {
      return { difficulty: normalized };
    }
  }

  return {
    difficulty: "medium",
    warning:
      value == null
        ? "missing difficulty; defaulted to medium"
        : "invalid difficulty; defaulted to medium",
  };
}

export function parseFlashcardDocument(
  input: unknown,
  fallbackId?: string,
): ParseResult {
  if (!isRecord(input)) return { ok: false, errors: ["document is not an object"] };

  const id = optionalText(input.id) ?? optionalText(fallbackId);
  const subject = firstText(input, ["subject", "fag", "Subject"]);
  const question = optionalText(input.question);
  const answer = optionalText(input.answer);
  const errors: string[] = [];

  if (!id) errors.push("missing id");
  if (!subject) errors.push("missing subject");
  if (!question) errors.push("missing question");
  if (!answer) errors.push("missing answer");
  if (errors.length > 0 || !id || !subject || !question || !answer) {
    return { ok: false, errors };
  }

  const { difficulty, warning } = parseDifficulty(input.difficulty);
  const topic = firstText(input, ["topic", "emne", "Topic"]);
  const subtopic = firstText(input, [
    "subtopic",
    "underemne",
    "subTopic",
    "Underemne",
  ]);
  const tags = Array.isArray(input.tags)
    ? input.tags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : undefined;
  const explanation = optionalText(input.explanation);
  const imageKey = optionalText(input.imageKey);
  const imageCaption = optionalText(input.imageCaption);
  const imageOrientation = optionalText(input.imageOrientation);
  const validOrientation =
    imageOrientation === "portrait" ||
    imageOrientation === "landscape" ||
    imageOrientation === "rotate-90"
      ? imageOrientation
      : undefined;
  const warnings = warning ? [warning] : [];
  if (imageOrientation && !validOrientation) {
    warnings.push(`invalid image orientation: ${imageOrientation}`);
  }

  return {
    ok: true,
    warnings,
    card: {
      id,
      subject,
      question,
      answer,
      difficulty,
      ...(topic ? { topic } : {}),
      ...(subtopic ? { subtopic } : {}),
      ...(tags?.length ? { tags } : {}),
      ...(explanation ? { explanation } : {}),
      ...(imageKey ? { imageKey } : {}),
      ...(imageCaption ? { imageCaption } : {}),
      ...(validOrientation ? { imageOrientation: validOrientation } : {}),
    },
  };
}

export function validateFlashcardDocuments(
  documents: FlashcardDocument[],
): Flashcard[] {
  const cards: Flashcard[] = [];
  const seenIds = new Set<string>();

  for (const document of documents) {
    const label = document.source ?? document.fallbackId ?? "unknown document";
    const result = parseFlashcardDocument(document.data, document.fallbackId);

    if (!result.ok) {
      console.warn(`[Flashcards] Skipped ${label}: ${result.errors.join(", ")}`);
      continue;
    }
    if (seenIds.has(result.card.id)) {
      console.warn(`[Flashcards] Skipped ${label}: duplicate id ${result.card.id}`);
      continue;
    }
    for (const warning of result.warnings) {
      console.warn(`[Flashcards] Normalized ${label}: ${warning}`);
    }

    seenIds.add(result.card.id);
    cards.push(result.card);
  }

  return cards;
}
