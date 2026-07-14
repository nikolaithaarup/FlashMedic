import type { Flashcard } from "../../src/types/Flashcard";

export type QualitySeverity = "error" | "warning";
export type QualityIssue = {
  severity: QualitySeverity;
  code: string;
  message: string;
  cardIds: string[];
};

export type ContentQualityOptions = {
  validLearningObjectiveIds?: Iterable<string>;
  learningObjectiveDefinitions?: { id: string }[];
  longQuestion?: number;
  longAnswer?: number;
  repetitiveOpeningMinimum?: number;
  repetitiveOpeningShare?: number;
};

const optionalTextFields = [
  "topic", "subtopic", "explanation", "learningObjectiveId", "rationale",
  "prehospitalRelevance", "examTip", "redFlag", "reviewedAt", "imageKey",
  "imageCaption",
] as const;

const normalize = (value: string): string => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("da-DK")
  .replace(/[^a-z0-9æøå]+/g, " ")
  .trim()
  .replace(/\s+/g, " ");

const opening = (value: string): string => normalize(value).split(" ").slice(0, 3).join(" ");

function groupsBy(cards: Flashcard[], selector: (card: Flashcard) => string): Flashcard[][] {
  const groups = new Map<string, Flashcard[]>();
  for (const card of cards) {
    const key = selector(card);
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), card]);
  }
  return [...groups.values()].filter((group) => group.length > 1);
}

function intentionalEkgPrompt(group: Flashcard[]): boolean {
  return group.every((card) =>
    card.subject === "EKG" &&
    (card.topic === "Billeder" || card.kind === "media" || !!card.imageKey),
  );
}

export function analyzeContentQuality(
  cards: Flashcard[],
  options: ContentQualityOptions = {},
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const add = (severity: QualitySeverity, code: string, message: string, cardIds: string[]) =>
    issues.push({ severity, code, message, cardIds });
  const validObjectives = new Set(options.validLearningObjectiveIds ?? []);

  for (const group of groupsBy(cards, (card) => card.question.trim())) {
    if (!intentionalEkgPrompt(group)) add("warning", "duplicate.question.exact", "Identical question text", group.map(({ id }) => id));
  }
  for (const group of groupsBy(cards, (card) => card.answer.trim())) {
    if (!intentionalEkgPrompt(group)) add("warning", "duplicate.answer.exact", "Identical answer text", group.map(({ id }) => id));
  }
  for (const group of groupsBy(cards, (card) => normalize(card.question))) {
    if (!intentionalEkgPrompt(group) && new Set(group.map(({ question }) => question)).size > 1) {
      add("warning", "duplicate.question.normalized", "Questions differ only by punctuation, spacing or case", group.map(({ id }) => id));
    }
  }

  const placeholder = /\b(?:todo|tbd|placeholder|source needed|kilde mangler|indsæt kilde)\b/i;
  const unresolved = /\b(?:manual review|manuel(?:t)? review|manuel gennemgang|skal gennemgås)\b/i;
  const generatedCitationPlaceholder = /:contentReference\s*\[/i;
  const english = /\b(?:which of the following|what is the|patient presents with|true or false|most likely)\b/i;
  const absolute = /\b(?:altid|aldrig|førstevalg|hyppigste|mest almindelige|diagnostisk|skal|må ikke)\b/i;
  const dose = /(?:\b\d+(?:[.,]\d+)?\s*(?:mg|g|mikrogram|mcg|µg|ml|mmol|enheder|j(?:oule)?)\b|\b(?:dosis|dosering|koncentration|tærskelværdi)\b)/i;
  const protocol = /\b(?:kontraindiceret|kontraindikation|protokol|instruks|retningslinje|guideline|ambulancebekendtgørelsen)\w*\b/i;
  const longQuestion = options.longQuestion ?? 160;
  const longAnswer = options.longAnswer ?? 300;

  for (const card of cards) {
    const content = `${card.question}\n${card.answer}\n${card.explanation ?? ""}\n${card.rationale ?? ""}\n${card.redFlag ?? ""}`;
    if (placeholder.test(content)) add("error", "placeholder", "Unresolved placeholder text", [card.id]);
    if (unresolved.test(content)) add("error", "review.unresolved-marker", "Manual-review marker must be resolved in the report, not card content", [card.id]);
    if (generatedCitationPlaceholder.test(content)) {
      add("error", "placeholder.generated-citation", "Unresolved generated citation marker", [card.id]);
    }
    if (english.test(content)) add("warning", "language.english-boilerplate", "Suspicious English question boilerplate", [card.id]);
    if (absolute.test(`${card.question}\n${card.answer}`)) add("warning", "clinical.absolute", "High-risk absolute wording requires contextual review", [card.id]);
    if (dose.test(`${card.question}\n${card.answer}`)) add("warning", "clinical.dose-threshold", "Dose, concentration or threshold language requires review", [card.id]);
    if (protocol.test(content)) add("warning", "clinical.protocol", "Contraindication or protocol-dependent language requires review", [card.id]);
    if (card.question.length > longQuestion) add("warning", "length.question", `Question is ${card.question.length} characters`, [card.id]);
    if (card.answer.length > longAnswer) add("warning", "length.answer", `Answer is ${card.answer.length} characters`, [card.id]);

    for (const field of optionalTextFields) {
      const value = card[field];
      if (typeof value === "string" && value.trim() === "") {
        add("error", "metadata.empty", `Optional metadata field ${field} is empty`, [card.id]);
      }
    }
    if (card.references?.some((reference) => !reference.title.trim())) {
      add("error", "metadata.empty-reference", "Reference title is empty", [card.id]);
    }
    if (card.learningObjectiveId && validObjectives.size && !validObjectives.has(card.learningObjectiveId)) {
      add("error", "objective.invalid", `Unknown learning objective ${card.learningObjectiveId}`, [card.id]);
    }
  }

  const definitions = options.learningObjectiveDefinitions ?? [];
  for (const group of groupsBy(definitions as Flashcard[], (item) => item.id)) {
    add("error", "objective.duplicate-definition", `Duplicate learning-objective definition ${group[0].id}`, group.map(({ id }) => id));
  }

  const minimum = options.repetitiveOpeningMinimum ?? 12;
  const share = options.repetitiveOpeningShare ?? 0.15;
  for (const group of groupsBy(cards, (card) => opening(card.question))) {
    if (group.length >= minimum && group.length / Math.max(cards.length, 1) >= share) {
      add("warning", "language.repetitive-opening", `Question opening "${opening(group[0].question)}" is repeated ${group.length} times`, group.map(({ id }) => id));
    }
  }

  return issues;
}
