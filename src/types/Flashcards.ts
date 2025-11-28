import type { ImageSourcePropType } from "react-native";

export type Difficulty = "easy" | "medium" | "hard";

export type Flashcard = {
  id: string;
  subject: string;
  topic?: string;
  subtopic?: string;
  question: string;
  answer: string;
  difficulty: Difficulty;

  // NEW (optional)
  image?: ImageSourcePropType;
  imageCaption?: string;
};
