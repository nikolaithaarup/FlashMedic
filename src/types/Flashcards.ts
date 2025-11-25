export type Difficulty = "easy" | "medium" | "hard";

export interface Flashcard {
  id: string;
  subject: string;   // e.g. "Cardiology", "Respiratory"
  topic: string;     // e.g. "ACS", "COPD"
  subtopic?: string;

  question: string;
  answer: string;

  difficulty: Difficulty;

  language?: "da" | "en" | "mix";
  sourceType?: string;
  sourceRef?: string;
  tags?: string[];
}
