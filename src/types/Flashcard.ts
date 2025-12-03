import type { ImageSourcePropType } from "react-native";

export type Difficulty = "easy" | "medium" | "hard";

export type Flashcard = {
  id: string;

  subject: string;       // fx "Akutte tilstande", "EKG"
  topic?: string;
  subtopic?: string;

  question: string;
  answer: string;
  difficulty: Difficulty;

  tags?: string[];
  explanation?: string;

  // image support
  imageKey?: string;              // JSON-safe key
  image?: ImageSourcePropType;    // actual require() image
  imageCaption?: string;
};
