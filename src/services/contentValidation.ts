import type { Flashcard } from "../types/Flashcard";
import {
  findTaxonomySubject,
  findTaxonomyTopic,
  LEARNING_OBJECTIVES,
} from "../types/Learning";

export type ContentIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
};

export type ContentValidationContext = {
  mediaKeys: ReadonlySet<string>;
};

const ranges = {
  pulse: [0, 300],
  systolicBp: [0, 300],
  diastolicBp: [0, 200],
  respiratoryRate: [0, 100],
  spo2: [0, 100],
  temperatureC: [20, 45],
  gcs: [3, 15],
  bloodGlucoseMmolL: [0, 100],
} as const;

export function validateContentCard(
  card: Flashcard,
  { mediaKeys }: ContentValidationContext,
): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const add = (severity: ContentIssue["severity"], code: string, message: string) =>
    issues.push({ severity, code, message });
  const isV2 = card.schemaVersion === 2;
  const requiresV2Validation = isV2 || card.reviewStatus === "reviewed";
  const taxonomySeverity = requiresV2Validation ? "error" : "warning";
  const subject = findTaxonomySubject(card.subject);
  if (!subject) add(taxonomySeverity, "taxonomy.subject", `Unknown subject: ${card.subject}`);
  if (card.topic && !findTaxonomyTopic(card.subject, card.topic)) {
    add(taxonomySeverity, "taxonomy.topic", `Unknown topic: ${card.subject} / ${card.topic}`);
  }

  for (const key of [card.imageKey, card.media?.imageKey, card.media?.annotatedImageKey]) {
    if (key && !mediaKeys.has(key)) add("error", "media.key", `Unknown media key: ${key}`);
  }

  const hasV2Metadata = !!(
    card.kind || card.learningObjectiveId || card.rationale || card.references ||
    card.media || card.scenario || card.reviewStatus || card.reviewedAt || card.contentRevision
  );
  if (hasV2Metadata && card.schemaVersion !== 2) {
    add("error", "schema.version", "V2 metadata requires schemaVersion 2");
  }
  if (!requiresV2Validation) return issues;

  if (!card.kind) add("error", "v2.kind", "V2 card is missing kind");
  if (!card.reviewStatus) add("error", "v2.reviewStatus", "V2 card is missing reviewStatus");
  if (card.learningObjectiveId && !LEARNING_OBJECTIVES.some(({ id }) => id === card.learningObjectiveId)) {
    add("error", "objective.unknown", `Unknown learning objective: ${card.learningObjectiveId}`);
  }
  if (card.references?.some(({ title }) => !title.trim())) {
    add("error", "references.title", "Every reference must have a title");
  }
  if (card.scenario && !card.scenario.presentation.trim()) {
    add("error", "scenario.presentation", "Scenario presentation is required");
  }
  if (card.kind === "scenario" && !card.scenario) {
    add("error", "scenario.missing", "Scenario cards require scenario data");
  }
  if (card.kind === "media" && !card.media && !card.imageKey) {
    add("error", "media.missing", "Media cards require structured or legacy media");
  }
  if (card.scenario?.vitals) {
    for (const [key, [minimum, maximum]] of Object.entries(ranges)) {
      const value = card.scenario.vitals[key as keyof typeof ranges];
      if (typeof value === "number" && (value < minimum || value > maximum)) {
        add("error", "scenario.vital.range", `${key} ${value} is outside ${minimum}-${maximum}`);
      }
    }
  }

  if (card.reviewStatus === "reviewed") {
    if (!card.explanation && !card.rationale) add("error", "review.explanation", "Reviewed cards require explanation or rationale");
    if (!card.learningObjectiveId) add("error", "review.objective", "Reviewed cards require learningObjectiveId");
    if (!card.prehospitalRelevance) add("error", "review.relevance", "Reviewed cards require prehospitalRelevance");
    if (!card.references?.length && !card.media?.sourceNote) add("error", "review.source", "Reviewed cards require a reference or media sourceNote");
    if (!card.contentRevision) add("error", "review.revision", "Reviewed cards require contentRevision");
    if (!card.reviewedAt || Number.isNaN(Date.parse(card.reviewedAt))) add("error", "review.date", "Reviewed cards require a valid reviewedAt date");
  }
  return issues;
}
