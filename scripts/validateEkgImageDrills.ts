import fs from "fs";
import path from "path";

import {
  buildEkgImageAssessment,
  buildEkgImageDrillPool,
  isPercentageAnnotation,
  selectEkgImageDrillCards,
  shuffleEkgImageDrillCards,
  type EkgImageAnnotation,
} from "../src/features/ekgTraining/ekgImageDrills";
import type { Flashcard } from "../src/types/Flashcard";

function extractStringValues(source: string, key: string) {
  const pattern = new RegExp(`\\b${key}\\s*:\\s*["']([^"']+)["']`, "g");
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

const billederSource = fs.readFileSync(
  path.join(process.cwd(), "src", "data", "ekg", "billeder.ts"),
  "utf8",
);
const lookupSource = fs.readFileSync(
  path.join(process.cwd(), "src", "data", "ekg", "imageLookup.ts"),
  "utf8",
);

const localImageIds = extractStringValues(billederSource, "id");
const lookupKeys = new Set(
  [...lookupSource.matchAll(/\b(ekg_img_[a-zA-Z0-9_]+)\s*:/g)].map(
    (match) => match[1],
  ),
);

if (localImageIds.length === 0) {
  throw new Error("No local EKG image card IDs were found.");
}

const missingLookupKeys = localImageIds.filter((id) => !lookupKeys.has(id));
if (missingLookupKeys.length > 0) {
  throw new Error(`Missing EKG image lookup keys: ${missingLookupKeys.join(", ")}`);
}

const fixtureCards: Flashcard[] = [
  ...localImageIds.map((id, index) => ({
    id,
    subject: "EKG",
    topic: "Billeder",
    subtopic: index % 2 === 0 ? "Rytmer" : "Blokke og ledning",
    question: "Hvilken rytme/tilstand ses på dette EKG?",
    answer: `Svar ${index + 1}`,
    difficulty: "medium" as const,
    tags: ["ekg", "billede"],
    imageKey: id,
  })),
  {
    id: localImageIds[0],
    subject: "EKG",
    topic: "Billeder",
    question: "Duplicate should be skipped",
    answer: "Duplicate",
    difficulty: "medium",
    tags: ["ekg", "billede"],
    imageKey: localImageIds[0],
  },
  {
    id: "ekg_theory_with_image",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    question: "Theory card with imageKey should not enter image drill.",
    answer: "Theory",
    difficulty: "medium",
    imageKey: localImageIds[0],
  },
  {
    id: "ekg_malformed_image",
    subject: "EKG",
    topic: "Billeder",
    question: "Malformed image key should be skipped.",
    answer: "Malformed",
    difficulty: "medium",
    tags: ["ekg", "billede"],
    imageKey: "missing_key",
  },
  {
    id: "non_ekg_image",
    subject: "Akutte tilstande",
    topic: "Billeder",
    question: "Non-EKG image should be skipped.",
    answer: "Other",
    difficulty: "medium",
    tags: ["billede"],
    imageKey: localImageIds[1],
  },
];

const fakeLookup = Object.fromEntries(
  localImageIds.map((id) => [id, { uri: `fixture://${id}` }]),
);

const pool = buildEkgImageDrillPool(fixtureCards, { imageLookup: fakeLookup });
if (pool.length !== localImageIds.length) {
  throw new Error(
    `Expected ${localImageIds.length} usable EKG image cards, got ${pool.length}.`,
  );
}
if (new Set(pool.map((card) => card.id)).size !== pool.length) {
  throw new Error("EKG image drill pool returned duplicate card IDs.");
}
if (pool.some((card) => !card.imageKey || !card.image)) {
  throw new Error("EKG image drill pool returned a card without imageKey/image.");
}
if (pool.some((card) => card.subject !== "EKG" || card.topic !== "Billeder")) {
  throw new Error("EKG image drill pool included a non-image or non-EKG card.");
}

const seededA = selectEkgImageDrillCards(fixtureCards, {
  imageLookup: fakeLookup,
  seed: "ekg-seed",
}).map((card) => card.id);
const seededB = selectEkgImageDrillCards(fixtureCards, {
  imageLookup: fakeLookup,
  seed: "ekg-seed",
}).map((card) => card.id);
const seededC = selectEkgImageDrillCards(fixtureCards, {
  imageLookup: fakeLookup,
  seed: "ekg-other-seed",
}).map((card) => card.id);

if (seededA.join("|") !== seededB.join("|")) {
  throw new Error("Seeded EKG image shuffle is not deterministic.");
}
if (seededA.join("|") === seededC.join("|") && seededA.length > 1) {
  throw new Error("Different EKG image shuffle seeds produced identical order.");
}
if (shuffleEkgImageDrillCards([], "empty").length !== 0) {
  throw new Error("Empty EKG image shuffle was not handled safely.");
}

const fallback = buildEkgImageAssessment(pool[0]);
if (fallback.source !== "flashcard-fallback") {
  throw new Error("Fallback assessment did not report flashcard-fallback source.");
}
if (fallback.likelyRhythm !== pool[0].answer) {
  throw new Error("Fallback assessment did not use card answer as rhythm suggestion.");
}
if (
  fallback.rateDescription !== "Ikke angivet i nuværende kortmetadata." ||
  fallback.regularity !== "Ikke angivet i nuværende kortmetadata."
) {
  throw new Error("Fallback assessment invented structured rhythm fields.");
}

const validAnnotation: EkgImageAnnotation = {
  annotationId: "a1",
  label: "QRS",
  target: { type: "box", x: 10, y: 20, width: 30, height: 40 },
  relatedStep: "qrsWidth",
};
const invalidAnnotation: EkgImageAnnotation = {
  annotationId: "a2",
  label: "Outside",
  target: { type: "point", x: 101, y: 20 },
};
if (!isPercentageAnnotation(validAnnotation)) {
  throw new Error("Valid percentage annotation was rejected.");
}
if (isPercentageAnnotation(invalidAnnotation)) {
  throw new Error("Invalid percentage annotation was accepted.");
}

console.log(
  `Validated ${pool.length} usable EKG image drill cards, deterministic shuffle, fallback assessment, empty pool handling, and annotation coordinate guards.`,
);
