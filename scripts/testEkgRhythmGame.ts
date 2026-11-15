import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createAnswerOptions } from "../src/features/ekgTraining/game/ekgRhythmGameLogic";
import { RHYTHMS } from "../src/features/ekgTraining/game/rhythmModel";

const ids = RHYTHMS.map((rhythm) => rhythm.id);
assert.equal(ids.length, 23, "Paramediciner skal fortsat vise alle 23 rytmer");

for (const id of ids) {
  const beginnerOptions = createAnswerOptions(id, "behandler", ids, () => 0.42);
  assert.equal(beginnerOptions.length, 4, `Behandler skal have fire svar ved ${id}`);
  assert.equal(new Set(beginnerOptions).size, 4, `Svar skal være unikke ved ${id}`);
  assert.ok(beginnerOptions.includes(id), `Det korrekte svar mangler ved ${id}`);

  const advancedOptions = createAnswerOptions(id, "paramediciner", ids);
  assert.deepEqual(advancedOptions, ids, "Paramediciner skal bevare hele rytmepuljen");
}

const screen = readFileSync(
  resolve(process.cwd(), "src/features/ekgTraining/game/EkgRhythmGameScreen.tsx"),
  "utf8",
);

for (const required of [
  "rhythm-mode-rounds",
  "rhythm-mode-timed",
  "difficulty-modal",
  "testID={`difficulty-${value}`}",
  "disabled={difficulty === null}",
  "start(setupMode, difficulty)",
  "start(mode, difficulty ?? \"behandler\")",
  "rhythm-answer-scroll",
  "gameMode === \"timed\" ? Date.now() + DURATION * 1000 : null",
]) {
  assert.ok(screen.includes(required), `Manglende rytmespil-regression: ${required}`);
}

console.log("EKG-rytmespil: fokuserede regressioner bestået.");
