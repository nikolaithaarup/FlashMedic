// src/features/weekly/weeklyData.ts

export const WORD_OF_WEEK_WORDS = [
  "SEPSIS",
  "RESPIRATION",
  "INTUBATION",
  "CEREBRUM",
  "VENTRIKEL",
  "INFUSION",
  "ANAFYLAXI",
  "HYPOTENSION",
  "KAPILLÆR",
  "ARTERIOLER",
];

export function scrambleWord(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const scrambled = arr.join("");
  if (scrambled.toLowerCase() === word.toLowerCase()) {
    return scrambleWord(word);
  }
  return scrambled;
}

export function pickRandomWordOfWeek(): string {
  const candidates = WORD_OF_WEEK_WORDS.filter((w) => w.length >= 6);
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}
