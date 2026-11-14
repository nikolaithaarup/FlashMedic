import assert from "node:assert/strict";

import {
  addGamePoints,
  createRankKey,
  getRawScoreLimit,
  normalizeWeeklyScore,
  sanitizeLeaderboardName,
  totalGamePoints,
} from "../src/services/weeklyCompetition";
import { createDirectWeeklyBundle } from "../src/services/weeklyKeyResolution";
import {
  createPendingWeeklyResult,
  parsePendingWeeklyResults,
} from "../src/storage/weeklyPendingModel";
import { getCurrentIsoWeekInfo } from "../src/utils/week";

const mcqPack = {
  questions: Array.from({ length: 10 }, (_, index) => ({ id: `q${index}` })),
};
const matchPack = {
  rounds: [
    { pairs: [{}, {}, {}] },
    { pairs: [{}, {}] },
  ],
};
const wordPack = {
  rounds: [{ words: ["a"] }, { words: ["b"] }, { words: ["c"] }],
};

assert.equal(getRawScoreLimit("mcq", mcqPack), 10_000);
assert.equal(getRawScoreLimit("match", matchPack), 5_000);
assert.equal(getRawScoreLimit("word", wordPack), 15_000);
assert.equal(normalizeWeeklyScore(10_000, 10_000), 1_000);
assert.equal(normalizeWeeklyScore(2_500, 5_000), 500);
assert.equal(normalizeWeeklyScore(7_500, 15_000), 500);
assert.throws(() => normalizeWeeklyScore(-1, 10_000), /invalid_score/);
assert.throws(() => normalizeWeeklyScore(1.5, 10_000), /invalid_score/);
assert.throws(() => normalizeWeeklyScore(10_001, 10_000), /score_out_of_range/);

const oneGame = addGamePoints({}, "mcq", 900);
const twoGames = addGamePoints(oneGame, "match", 600);
const allGames = addGamePoints(twoGames, "word", 500);
assert.equal(totalGamePoints(allGames), 2_000);
assert.throws(() => addGamePoints(allGames, "mcq", 1_000), /duplicate_game/);

const tiedA = createRankKey(2_000, "alice");
const tiedB = createRankKey(2_000, "bob");
assert.ok(tiedA < tiedB, "UID provides deterministic tie-breaking");
assert.ok(createRankKey(2_001, "z") < tiedA, "Higher points sort first");
assert.equal(sanitizeLeaderboardName("  Test\nUser  ", "uid"), "Test User");

assert.equal(getCurrentIsoWeekInfo(new Date("2026-12-31T12:00:00Z")).weekKey, "2026-W53");
assert.equal(getCurrentIsoWeekInfo(new Date("2027-01-01T12:00:00Z")).weekKey, "2026-W53");
assert.equal(getCurrentIsoWeekInfo(new Date("2027-01-04T12:00:00Z")).weekKey, "2027-W01");

const pending = createPendingWeeklyResult({
  uid: "portal-user",
  nickname: "Test",
  resolution: createDirectWeeklyBundle("2026-W46", "mcq"),
  game: "mcq",
  score: 9_000,
  completedAt: "2026-11-14T12:00:00.000Z",
});
assert.equal(parsePendingWeeklyResults([pending]).length, 1);
assert.equal(parsePendingWeeklyResults([{ ...pending, score: "forged" }]).length, 0);
assert.equal(pending.id, "2026-W46:portal-user:mcq");

console.log("Validated weekly score limits, normalization, aggregation, ties, ISO rollover, and retry model.");
