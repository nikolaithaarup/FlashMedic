import fs from "fs";
import path from "path";

import { getQueueAfterFlashcardScore } from "../src/features/flashcards/quizSession";
import { validateContentCard } from "../src/services/contentValidation";
import {
  parseFlashcardDocument,
  validateFlashcardDocuments,
} from "../src/services/flashcardValidation";
import type { Flashcard } from "../src/types/Flashcard";

type LocatedCard = { card: Flashcard; source: string };

type Inventory = {
  total: number;
  v1: number;
  v2: number;
  reviewed: number;
  explanations: number;
  sources: number;
  subjects: number;
  topics: number;
  subtopics: number;
  withoutSubtopic: number;
  withoutLearningObjective: number;
  mediaCards: number;
  scenarioCards: number;
  duplicateIds: number;
  invalidMediaKeys: number;
  invalidTaxonomy: number;
};

function findDuplicateIds(cards: LocatedCard[]): string[] {
  const sources = new Map<string, string[]>();
  for (const { card, source } of cards) {
    sources.set(card.id, [...(sources.get(card.id) ?? []), source]);
  }
  return [...sources.entries()]
    .filter(([, locations]) => locations.length > 1)
    .map(([id, locations]) => `${id}: ${locations.join(" | ")}`);
}

function findLocalSourceDuplicateIds(): string[] {
  const root = path.join(process.cwd(), "src", "data");
  const locations = new Map<string, string[]>();
  const visit = (directory: string) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".ts")) {
        const source = fs.readFileSync(fullPath, "utf8");
        const pattern = /\bid\s*:\s*["']([^"']+)["']/g;
        for (const match of source.matchAll(pattern)) {
          const line = source.slice(0, match.index).split(/\r?\n/).length;
          const relative = path.relative(process.cwd(), fullPath);
          locations.set(match[1], [
            ...(locations.get(match[1]) ?? []),
            `${relative}:${line}`,
          ]);
        }
      }
    }
  };
  visit(root);
  return [...locations.entries()]
    .filter(([, sources]) => sources.length > 1)
    .map(([id, sources]) => `${id}: ${sources.join(" | ")}`);
}

function findInvalidMedia(
  cards: LocatedCard[],
  mediaKeys: Set<string>,
  label: string,
): string[] {
  const invalid: string[] = [];
  for (const { card, source } of cards) {
    if (card.imageKey && !mediaKeys.has(card.imageKey)) {
      invalid.push(`${card.imageKey} at ${source}`);
    }
    if (
      card.imageOrientation &&
      card.imageOrientation !== "portrait" &&
      card.imageOrientation !== "landscape" &&
      card.imageOrientation !== "rotate-90"
    ) {
      invalid.push(`${card.imageOrientation} at ${source}`);
    }
  }
  return invalid.map((entry) => `${label}: ${entry}`);
}

function inventory(
  cards: LocatedCard[],
  duplicateIds: number,
  mediaKeys: Set<string>,
): Inventory {
  const contentIssues = cards.flatMap(({ card }) => validateContentCard(card, { mediaKeys }));
  return {
    total: cards.length,
    v1: cards.filter(({ card }) => card.schemaVersion !== 2).length,
    v2: cards.filter(({ card }) => card.schemaVersion === 2).length,
    reviewed: cards.filter(({ card }) => card.reviewStatus === "reviewed").length,
    explanations: cards.filter(({ card }) => !!(card.explanation || card.rationale)).length,
    sources: cards.filter(({ card }) => !!(card.references?.length || card.media?.sourceNote)).length,
    subjects: new Set(cards.map(({ card }) => card.subject)).size,
    topics: new Set(cards.flatMap(({ card }) => card.topic ? [`${card.subject}/${card.topic}`] : [])).size,
    subtopics: new Set(cards.flatMap(({ card }) => card.subtopic ? [`${card.subject}/${card.topic ?? ""}/${card.subtopic}`] : [])).size,
    withoutSubtopic: cards.filter(({ card }) => !card.subtopic).length,
    withoutLearningObjective: cards.filter(({ card }) => !card.learningObjectiveId).length,
    mediaCards: cards.filter(({ card }) => !!(card.media || card.imageKey)).length,
    scenarioCards: cards.filter(({ card }) => card.kind === "scenario" || !!card.scenario).length,
    duplicateIds,
    invalidMediaKeys: contentIssues.filter(({ code }) => code === "media.key").length,
    invalidTaxonomy: contentIssues.filter(({ code }) => code.startsWith("taxonomy.")).length,
  };
}

function printInventory(label: string, report: Inventory): void {
  console.log(`\n${label} inventory`);
  console.table(report);
  console.log(`Explanation coverage: ${report.explanations}/${report.total} (${Math.round(report.explanations / report.total * 100)}%)`);
  console.log(`Source coverage: ${report.sources}/${report.total} (${Math.round(report.sources / report.total * 100)}%)`);
}

function loadBackendCards(): LocatedCard[] {
  const directory = path.join(process.cwd(), "Backend", "data", "subjects");
  const cards: LocatedCard[] = [];
  for (const filename of fs.readdirSync(directory).filter((name) => name.endsWith(".json"))) {
    const filePath = path.join(directory, filename);
    const parsed: unknown = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!Array.isArray(parsed)) throw new Error(`${filePath} is not an array.`);

    parsed.forEach((item, index) => {
      const result = parseFlashcardDocument(item);
      if (!result.ok) {
        throw new Error(`${filePath}[${index}]: ${result.errors.join(", ")}`);
      }
      if (result.warnings.some((warning) =>
        warning.startsWith("invalid schemaVersion") ||
        warning.startsWith("invalid card kind") ||
        warning.startsWith("invalid review status") ||
        warning.startsWith("invalid media") ||
        warning.startsWith("invalid scenario") ||
        warning.startsWith("invalid reference") ||
        warning.startsWith("invalid contentRevision") ||
        warning.startsWith("invalid commonMistakes") ||
        warning.includes("image orientation")
      )) {
        throw new Error(`${filePath}[${index}]: ${result.warnings.join(", ")}`);
      }
      cards.push({ card: result.card, source: `${filePath}[${index}]` });
    });
  }
  return cards;
}

async function main() {
  const imageStub = () => undefined;
  require.extensions[".jpg"] = imageStub;
  require.extensions[".jpeg"] = imageStub;
  require.extensions[".png"] = imageStub;

  const flashcardsModule = await import("../src/data/flashcards");
  const imageModule = await import("../src/data/ekg/imageLookup");
  const localCards: LocatedCard[] = Object.entries(flashcardsModule.allDecks)
    .flatMap(([deckId, deck]) =>
      (deck ?? []).map((card, index) => ({
        card,
        source: `src/data deck ${deckId}[${index}]`,
      })),
    );
  const backendCards = loadBackendCards();
  const mediaKeys = new Set(Object.keys(imageModule.ekgImageLookup));

  const localDuplicates = findLocalSourceDuplicateIds();
  const backendDuplicates = findDuplicateIds(backendCards);
  if (localDuplicates.length || backendDuplicates.length) {
    throw new Error(
      [
        localDuplicates.length
          ? `Local duplicate IDs:\n${localDuplicates.join("\n")}`
          : "",
        backendDuplicates.length
          ? `Backend duplicate IDs:\n${backendDuplicates.join("\n")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  const invalidMedia = [
    ...findInvalidMedia(localCards, mediaKeys, "Local cards"),
    ...findInvalidMedia(backendCards, mediaKeys, "Backend cards"),
  ];
  if (invalidMedia.length) throw new Error(`Invalid media:\n${invalidMedia.join("\n")}`);

  const strictErrors = [...localCards, ...backendCards].flatMap(({ card, source }) =>
    validateContentCard(card, { mediaKeys })
      .filter(({ severity }) => severity === "error")
      .map(({ code, message }) => `${source} [${code}] ${message}`),
  );
  if (strictErrors.length) throw new Error(`Content validation failed:\n${strictErrors.join("\n")}`);

  const referencedMedia = new Set(
    localCards.flatMap(({ card }) => (card.imageKey ? [card.imageKey] : [])),
  );
  const orphanedRegistryKeys = [...mediaKeys].filter(
    (key) => !referencedMedia.has(key),
  );
  if (orphanedRegistryKeys.length) {
    throw new Error(
      `Orphaned EKG registry keys: ${orphanedRegistryKeys.join(", ")}`,
    );
  }

  const valid = parseFlashcardDocument({
    id: "card-1",
    subject: "EKG",
    topic: "Rytmer",
    question: "Hvad viser rytmen?",
    answer: "Sinusrytme",
    difficulty: "EASY",
    imageKey: "ekg_img_atrial_fib_1",
  });
  if (!valid.ok || valid.card.difficulty !== "easy") {
    throw new Error("A valid flashcard was not normalized correctly.");
  }

  const v2 = parseFlashcardDocument({
    id: "card-v2",
    subject: "EKG",
    topic: "Billeder",
    question: "Hvad viser rytmen?",
    answer: "Atrieflimren",
    difficulty: "medium",
    schemaVersion: 2,
    kind: "media",
    reviewStatus: "draft",
    learningObjectiveId: "lo.ekg.billeder.grundlag",
    media: {
      kind: "ekg",
      imageKey: "ekg_img_atrial_fib_1",
      altText: "EKG med uregelmæssig rytme",
    },
  });
  if (!v2.ok || v2.card.imageKey !== "ekg_img_atrial_fib_1" || validateContentCard(v2.card, { mediaKeys }).some(({ severity }) => severity === "error")) {
    throw new Error("A valid V2 media card did not parse and validate correctly.");
  }

  const invalidV2 = parseFlashcardDocument({
    id: "invalid-v2",
    subject: "EKG",
    topic: "Billeder",
    question: "Test",
    answer: "Test",
    schemaVersion: 2,
    kind: "scenario",
    reviewStatus: "reviewed",
  });
  if (!invalidV2.ok || !validateContentCard(invalidV2.card, { mediaKeys }).some(({ severity }) => severity === "error")) {
    throw new Error("An incomplete reviewed V2 card was not rejected.");
  }

  const originalWarn = console.warn;
  console.warn = () => undefined;
  const deduplicated = validateFlashcardDocuments([
    { data: valid.card, source: "first" },
    { data: valid.card, source: "duplicate" },
    { data: { id: "broken" }, source: "malformed" },
  ]);
  console.warn = originalWarn;
  if (deduplicated.length !== 1) {
    throw new Error("Duplicate or malformed cards were not skipped.");
  }

  const finalCard = deduplicated[0];
  if (getQueueAfterFlashcardScore(finalCard, [], true).length !== 0) {
    throw new Error("A known final card did not complete the quiz session.");
  }
  if (getQueueAfterFlashcardScore(finalCard, [], false).length !== 1) {
    throw new Error("An unknown final card was not queued again.");
  }

  printInventory("Local", inventory(localCards, localDuplicates.length, mediaKeys));
  printInventory("Backend", inventory(backendCards, backendDuplicates.length, mediaKeys));

  console.log(
    `Validated ${localCards.length} local and ${backendCards.length} backend cards, IDs, media, and final-card progression.`,
  );
}

void main();
