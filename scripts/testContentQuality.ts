import assert from "node:assert/strict";
import { analyzeContentQuality } from "./lib/contentQuality";
import type { Flashcard } from "../src/types/Flashcard";

const card = (id: string, question: string, answer = "Svar", extra: Partial<Flashcard> = {}): Flashcard => ({
  id, subject: "Farmakologi", topic: "Farmakokinetik", question, answer,
  difficulty: "medium", ...extra,
});
const codes = (cards: Flashcard[], options = {}) => analyzeContentQuality(cards, {
  validLearningObjectiveIds: ["lo.valid"], repetitiveOpeningMinimum: 2,
  repetitiveOpeningShare: 0.5, ...options,
}).map(({ code }) => code);

assert(codes([card("a", "Samme?"), card("b", "Samme?")]).includes("duplicate.question.exact"));
assert(codes([card("a", "Samme?"), card("b", " samme ")]).includes("duplicate.question.normalized"));
assert(codes([card("a", "A?", "Ens"), card("b", "B?", "Ens")]).includes("duplicate.answer.exact"));
assert(codes([card("a", "TODO: skriv kort")]).includes("placeholder"));
assert(codes([card("a", "Kort?", "Svar :contentReference[oaicite:1]")]).includes("placeholder.generated-citation"));
assert(codes([card("a", "What is the dose?")]).includes("language.english-boilerplate"));
assert(codes([card("a", "Hvad skal altid gøres?")]).includes("clinical.absolute"));
assert(codes([card("a", "Hvad betyder 5 mg/ml?")]).includes("clinical.dose-threshold"));
assert(codes([card("a", "Hvad siger lokal instruks?")]).includes("clinical.protocol"));
assert(codes([card("a", "Kort?", "Svar", { explanation: " " })]).includes("metadata.empty"));
assert(codes([card("a", "Kort?", "Svar", { learningObjectiveId: "lo.unknown" })]).includes("objective.invalid"));
assert(codes([card("a", "Meget lang", "Svar")], { longQuestion: 3 }).includes("length.question"));
assert(codes([card("a", "Hvordan virker dette stof?"), card("b", "Hvordan virker dette princip?")]).includes("language.repetitive-opening"));

const ekgCards = [
  card("ekg1", "Hvilken rytme/tilstand ses på dette EKG?", "AF", { subject: "EKG", topic: "Billeder", kind: "media", imageKey: "one" }),
  card("ekg2", "Hvilken rytme/tilstand ses på dette EKG?", "VT", { subject: "EKG", topic: "Billeder", kind: "media", imageKey: "two" }),
];
assert(!codes(ekgCards).includes("duplicate.question.exact"));
assert(!codes(ekgCards).includes("duplicate.answer.exact"));

const duplicateObjectives = analyzeContentQuality([], {
  learningObjectiveDefinitions: [{ id: "lo.same" }, { id: "lo.same" }],
});
assert(duplicateObjectives.some(({ code }) => code === "objective.duplicate-definition"));

console.log("Validated content-quality duplicate, language, risk, metadata, objective, length and EKG exception behaviour.");
