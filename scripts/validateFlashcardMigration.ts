import {
  assertJsonValue,
  createFlashcardMigrationPlan,
  type CanonicalFirestoreCard,
  type ExistingFirestoreCard,
} from "./lib/flashcardMigration";

const canonical: CanonicalFirestoreCard[] = [
  { subjectSlug: "a", id: "same", source: "test", data: { id: "same", question: "Q", answer: "A" } },
  { subjectSlug: "a", id: "update", source: "test", data: { id: "update", question: "Q2", answer: "new", schemaVersion: 2 } },
  { subjectSlug: "a", id: "add", source: "test", data: { id: "add", question: "Q3", answer: "A3" } },
  { subjectSlug: "sygdomslaere", id: "syg_neuro_001", source: "test", data: { id: "syg_neuro_001", question: "Neuro Q", answer: "Neuro A" } },
];
const existing: ExistingFirestoreCard[] = [
  { subjectSlug: "a", id: "same", path: "subjects/a/cards/same", data: { id: "same", question: "Q", answer: "A", updatedAt: "ignored extra" } },
  { subjectSlug: "a", id: "update", path: "subjects/a/cards/update", data: { id: "update", question: "Q2", answer: "old" } },
  { subjectSlug: "a", id: "stale", path: "subjects/a/cards/stale", data: { id: "stale", question: "old", answer: "old" } },
  { subjectSlug: "sygdomslaere", id: "neuro_001", path: "subjects/sygdomslaere/cards/neuro_001", data: { id: "neuro_001", question: "Neuro Q", answer: "Neuro A" } },
];

canonical.forEach(({ data, id }) => assertJsonValue(data, id));
const plan = createFlashcardMigrationPlan(canonical, existing);
if (plan.additions.length !== 2 || plan.updates.length !== 1 || plan.unchanged.length !== 1 || plan.stale.length !== 2) throw new Error("Migration plan counts are incorrect.");
if (plan.renameCandidates.length !== 1 || plan.renameCandidates[0].status !== "verified") throw new Error("Verified ID rename was not detected.");
try {
  assertJsonValue({ broken: undefined });
  throw new Error("Unserializable data was accepted.");
} catch (error) {
  if (error instanceof Error && error.message === "Unserializable data was accepted.") throw error;
}
console.log("Validated migration comparison, stale reporting, rename detection, and serialization guard.");
