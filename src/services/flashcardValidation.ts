import type { Difficulty, Flashcard } from "../types/Flashcard";
import type {
  CardKind,
  ContentReviewStatus,
  FlashcardMedia,
  ScenarioVitals,
  SourceReference,
} from "../types/Learning";

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

function textArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const values = value.map(optionalText).filter((item): item is string => !!item);
  return values.length ? values : undefined;
}

function optionalFiniteNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function parseReferences(value: unknown, warnings: string[]): SourceReference[] | undefined {
  if (value == null) return undefined;
  if (!Array.isArray(value)) {
    warnings.push("invalid references; expected an array");
    return undefined;
  }
  const references = value.flatMap((item, index): SourceReference[] => {
    if (!isRecord(item) || !optionalText(item.title)) {
      warnings.push(`invalid reference at index ${index}; missing title`);
      return [];
    }
    const title = optionalText(item.title)!;
    const result: SourceReference = { title };
    for (const key of ["publisher", "url", "editionOrDate", "accessedAt", "note"] as const) {
      const text = optionalText(item[key]);
      if (text) result[key] = text;
    }
    return [result];
  });
  return references.length ? references : undefined;
}

function parseMedia(value: unknown, warnings: string[]): FlashcardMedia | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) {
    warnings.push("invalid media; expected an object");
    return undefined;
  }
  const kind = value.kind === "image" || value.kind === "ekg" ? value.kind : undefined;
  const imageKey = optionalText(value.imageKey);
  const altText = optionalText(value.altText);
  if (!kind || !imageKey || !altText) {
    warnings.push("invalid media; kind, imageKey and altText are required");
    return undefined;
  }
  const orientation = optionalText(value.orientation);
  const validOrientation = orientation === "portrait" || orientation === "landscape" || orientation === "rotate-90" ? orientation : undefined;
  if (orientation && !validOrientation) warnings.push(`invalid media orientation: ${orientation}`);
  return {
    kind,
    imageKey,
    altText,
    ...(validOrientation ? { orientation: validOrientation } : {}),
    ...copyOptionalText(value, ["caption", "sourceNote", "licenseNote", "annotatedImageKey"]),
  };
}

function copyOptionalText<K extends string>(
  record: Record<string, unknown>,
  keys: readonly K[],
): Partial<Record<K, string>> {
  const result: Partial<Record<K, string>> = {};
  for (const key of keys) {
    const value = optionalText(record[key]);
    if (value) result[key] = value;
  }
  return result;
}

function parseScenario(value: unknown, warnings: string[]): Flashcard["scenario"] {
  if (value == null) return undefined;
  if (!isRecord(value) || !optionalText(value.presentation)) {
    warnings.push("invalid scenario; presentation is required");
    return undefined;
  }
  const presentation = optionalText(value.presentation)!;
  const ageGroup = value.ageGroup === "child" || value.ageGroup === "adult" || value.ageGroup === "older-adult" || value.ageGroup === "pregnant" ? value.ageGroup : undefined;
  if (value.ageGroup != null && !ageGroup) warnings.push(`invalid scenario age group: ${String(value.ageGroup)}`);
  let vitals: ScenarioVitals | undefined;
  if (value.vitals != null) {
    if (!isRecord(value.vitals)) {
      warnings.push("invalid scenario vitals; expected an object");
    } else {
      const parsed: ScenarioVitals = {};
      for (const key of ["pulse", "systolicBp", "diastolicBp", "respiratoryRate", "spo2", "temperatureC", "gcs", "bloodGlucoseMmolL"] as const) {
        const number = optionalFiniteNumber(value.vitals[key]);
        if (number !== undefined) parsed[key] = number;
        else if (value.vitals[key] != null) warnings.push(`invalid scenario vital: ${key}`);
      }
      const freeText = textArray(value.vitals.freeText);
      vitals = { ...parsed, ...(freeText ? { freeText } : {}) };
    }
  }
  const history = textArray(value.history);
  return { presentation, ...(ageGroup ? { ageGroup } : {}), ...(history ? { history } : {}), ...(vitals ? { vitals } : {}) };
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
  const warnings = warning ? [warning] : [];
  const topic = firstText(input, ["topic", "emne", "Topic"]);
  const subtopic = firstText(input, [
    "subtopic",
    "underemne",
    "subTopic",
    "Underemne",
  ]);
  const tags = textArray(input.tags);
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
  if (imageOrientation && !validOrientation) {
    warnings.push(`invalid image orientation: ${imageOrientation}`);
  }

  const schemaVersion = input.schemaVersion === 1 || input.schemaVersion === 2 ? input.schemaVersion : undefined;
  if (input.schemaVersion != null && !schemaVersion) warnings.push(`invalid schemaVersion: ${String(input.schemaVersion)}`);
  const kind: CardKind | undefined = input.kind === "recall" || input.kind === "applied" || input.kind === "scenario" || input.kind === "media" ? input.kind : undefined;
  if (input.kind != null && !kind) warnings.push(`invalid card kind: ${String(input.kind)}`);
  const reviewStatus: ContentReviewStatus | undefined = input.reviewStatus === "draft" || input.reviewStatus === "reviewed" || input.reviewStatus === "retired" ? input.reviewStatus : undefined;
  if (input.reviewStatus != null && !reviewStatus) warnings.push(`invalid review status: ${String(input.reviewStatus)}`);
  const contentRevision = typeof input.contentRevision === "number" && Number.isInteger(input.contentRevision) && input.contentRevision > 0 ? input.contentRevision : undefined;
  if (input.contentRevision != null && !contentRevision) warnings.push("invalid contentRevision; expected a positive integer");
  const references = parseReferences(input.references, warnings);
  const media = parseMedia(input.media, warnings);
  const scenario = parseScenario(input.scenario, warnings);
  const commonMistakes = textArray(input.commonMistakes);
  if (input.commonMistakes != null && !Array.isArray(input.commonMistakes)) warnings.push("invalid commonMistakes; expected an array");
  const optionalFields = copyOptionalText(input, ["learningObjectiveId", "rationale", "prehospitalRelevance", "examTip", "redFlag", "reviewedAt"]);
  const resolvedImageKey = imageKey ?? media?.imageKey;
  const resolvedImageCaption = imageCaption ?? media?.caption;
  const resolvedOrientation = validOrientation ?? media?.orientation;

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
      ...(resolvedImageKey ? { imageKey: resolvedImageKey } : {}),
      ...(resolvedImageCaption ? { imageCaption: resolvedImageCaption } : {}),
      ...(resolvedOrientation ? { imageOrientation: resolvedOrientation } : {}),
      ...(schemaVersion ? { schemaVersion } : {}),
      ...(kind ? { kind } : {}),
      ...optionalFields,
      ...(commonMistakes ? { commonMistakes } : {}),
      ...(references ? { references } : {}),
      ...(media ? { media } : {}),
      ...(scenario ? { scenario } : {}),
      ...(reviewStatus ? { reviewStatus } : {}),
      ...(contentRevision ? { contentRevision } : {}),
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
