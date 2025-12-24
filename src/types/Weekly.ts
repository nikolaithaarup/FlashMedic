
export type WeeklyGameKind = "mcq" | "match" | "word";

export type WeeklyGameBase = {
  id: string;
  year: number;
  isoWeek: number;         // 1..53 in 2026
  weekStart: Date;         // Monday
  kind: WeeklyGameKind;
  slot: number;            // mcq:1, match:1-2, word:1-3
  title?: string;
  subjectSlug?: string;
  topic?: string;
};

export type WeeklyMcqItem = {
  id: string;              // stable within the game
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
};

export type WeeklyMatchItem = {
  id: string;
  left: string;
  right: string;
};

export type WeeklyWordItem = {
  id: string;
  word: string;
  prompt: string;          // “What does this mean?” / “Danish term for…”
  accepted: string[];      // acceptable answers (lowercased)
  explanation?: string;
};

export type WeeklyMcqGame = WeeklyGameBase & {
  kind: "mcq";
  items: WeeklyMcqItem[];  // 10 questions
};

export type WeeklyMatchGame = WeeklyGameBase & {
  kind: "match";
  items: WeeklyMatchItem[]; // e.g. 10-15 pairs
};

export type WeeklyWordGame = WeeklyGameBase & {
  kind: "word";
  items: WeeklyWordItem[]; // one “word set” (or 5 words) depending on your UI
};

export type WeeklyGame = WeeklyMcqGame | WeeklyMatchGame | WeeklyWordGame;
