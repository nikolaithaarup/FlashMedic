import {
  buildWeeklyKeyCandidates,
  createResolvedWeeklyBundle,
} from "../src/services/weeklyKeyResolution";
import {
  validateWeeklyMatchPack,
  validateWeeklyMcqPack,
  validateWeeklyWordPack,
} from "../src/services/weeklyPackValidation";
import { mergeWeeklyResult } from "../src/services/weeklyResultMerge";
import {
  createPendingWeeklyResult,
  parsePendingWeeklyResults,
} from "../src/storage/weeklyPendingModel";

const date = new Date("2026-07-02T12:00:00Z");
const candidates = buildWeeklyKeyCandidates(date, {
  weekKey: "week_27",
  weekId: "W27",
});
const keys = candidates.map((candidate) => candidate.key);
const expectedKeys = ["2026-W27", "week_27", "W27", "27"];
if (JSON.stringify(keys) !== JSON.stringify(expectedKeys)) {
  throw new Error(`Unexpected weekly fallback order: ${keys.join(", ")}`);
}

const resolution = createResolvedWeeklyBundle(
  "2026-W27",
  candidates[1],
  ["mcq", "match", "word"],
);
if (
  resolution.contentKey !== "week_27" ||
  resolution.resultKey !== "week_27" ||
  !resolution.isFallback
) {
  throw new Error("Fallback content and result keys are not aligned.");
}

const firstMerge = mergeWeeklyResult(
  { uid: "uid", nickname: "User", mcqScore: 100, totalScore: 100 },
  {
    uid: "uid",
    nickname: "User",
    matchScore: 200,
    attemptId: "week_27:uid:match",
    completedAt: "2026-07-02T12:00:00Z",
  },
);
if (
  firstMerge.mcqScore !== 100 ||
  firstMerge.matchScore !== 200 ||
  firstMerge.wordScore != null ||
  firstMerge.totalScore !== 300
) {
  throw new Error("Atomic merge did not preserve unspecified scores.");
}
const replayMerge = mergeWeeklyResult(firstMerge, {
  uid: "uid",
  nickname: "User",
  matchScore: 200,
  attemptId: "week_27:uid:match",
});
if (replayMerge.totalScore !== 300) {
  throw new Error("Idempotent result replay changed the total.");
}

const pending = createPendingWeeklyResult({
  uid: "uid",
  nickname: "User",
  resolution,
  game: "match",
  score: 200,
  completedAt: "2026-07-02T12:00:00Z",
});
const parsedPending = parsePendingWeeklyResults([pending, { broken: true }]);
if (parsedPending.length !== 1 || parsedPending[0].id !== pending.id) {
  throw new Error("Pending result serialization validation failed.");
}

if (
  validateWeeklyMcqPack({
    weekKey: "2026-W27",
    rounds: ["Test"],
    questions: [
      {
        id: "q1",
        text: "Question",
        options: [
          { id: "a", text: "A", isCorrect: true },
          { id: "b", text: "B", isCorrect: false },
        ],
      },
    ],
  }).length ||
  validateWeeklyMatchPack({
    weekKey: "2026-W27",
    rounds: [
      { round: 1, topic: "Test", pairs: [{ id: "p1", left: "A", right: "B" }] },
    ],
  }).length ||
  validateWeeklyWordPack({
    weekKey: "2026-W27",
    rounds: [
      { round: 1, topic: "Test", minLength: 3, maxLength: 8, words: ["SEPSIS"] },
    ],
  }).length
) {
  throw new Error("Valid weekly packs were rejected.");
}

console.log(
  "Validated weekly key resolution, pack schemas, atomic merge, and pending-result serialization.",
);
