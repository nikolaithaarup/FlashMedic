import { getRhythm, type RhythmId } from "./rhythmModel";

export type RhythmGameDifficulty = "behandler" | "paramediciner";

function shuffle<T>(source: readonly T[], random: () => number): T[] {
  const items = [...source];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function createAnswerOptions(
  correct: RhythmId,
  difficulty: RhythmGameDifficulty,
  pool: readonly RhythmId[],
  random: () => number = Math.random,
): RhythmId[] {
  if (difficulty === "paramediciner") return [...pool];

  const group = getRhythm(correct).group;
  const others = pool.filter((id) => id !== correct);
  const related = shuffle(others.filter((id) => getRhythm(id).group === group), random);
  const rest = shuffle(others.filter((id) => getRhythm(id).group !== group), random);
  return shuffle([correct, ...[...related, ...rest].slice(0, 3)], random);
}
