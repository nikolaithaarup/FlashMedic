import fs from "fs";
import path from "path";

import { getQueueAfterFlashcardScore } from "../src/features/flashcards/quizSession";
import {
  parseFlashcardDocument,
  validateFlashcardDocuments,
} from "../src/services/flashcardValidation";
import type { Flashcard } from "../src/types/Flashcard";

type LocatedCard = { card: Flashcard; source: string };

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

function validateMedia(
  cards: LocatedCard[],
  mediaKeys: Set<string>,
  label: string,
): void {
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
  if (invalid.length) {
    throw new Error(`${label} contains invalid media:\n${invalid.join("\n")}`);
  }
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
      if (result.warnings.some((warning) => warning.includes("image orientation"))) {
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

  validateMedia(localCards, mediaKeys, "Local cards");
  validateMedia(backendCards, mediaKeys, "Backend cards");

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

  console.log(
    `Validated ${localCards.length} local and ${backendCards.length} backend cards, IDs, media, and final-card progression.`,
  );
}

void main();
