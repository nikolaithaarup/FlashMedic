import fs from "node:fs";
import path from "node:path";
import { analyzeContentQuality } from "./lib/contentQuality";
import { LEARNING_OBJECTIVES } from "../src/types/Learning";
import type { Flashcard } from "../src/types/Flashcard";

const directory = path.join(process.cwd(), "Backend", "data", "subjects");
const files = fs.readdirSync(directory).filter((name) => name.endsWith(".json")).sort();
const cards = files.flatMap((name) =>
  JSON.parse(fs.readFileSync(path.join(directory, name), "utf8")) as Flashcard[],
);
const issues = analyzeContentQuality(cards, {
  validLearningObjectiveIds: LEARNING_OBJECTIVES.map(({ id }) => id),
  learningObjectiveDefinitions: [...LEARNING_OBJECTIVES],
});

const errors = issues.filter(({ severity }) => severity === "error");
const warnings = issues.filter(({ severity }) => severity === "warning");
const byCode = Object.entries(
  warnings.reduce<Record<string, number>>((counts, issue) => ({
    ...counts,
    [issue.code]: (counts[issue.code] ?? 0) + 1,
  }), {}),
).sort(([left], [right]) => left.localeCompare(right));

console.log(`Content-quality validation: ${cards.length} canonical cards across ${files.length} subjects, ${errors.length} errors, ${warnings.length} review warnings.`);
for (const [code, count] of byCode) console.log(`  ${code}: ${count}`);
if (errors.length) {
  throw new Error(errors.map((issue) => `${issue.code} (${issue.cardIds.join(", ")}): ${issue.message}`).join("\n"));
}
