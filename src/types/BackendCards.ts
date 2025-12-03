// src/types/BackendCard.ts

export type Difficulty = "easy" | "medium" | "hard";

/**
 * This is the shape stored in JSON on the backend.
 * No React Native specific types here.
 */
export interface BackendCard {
  id: string;

  // what you currently call "subject" in the app ("Anatomi og fysiologi", etc.)
  subject: string;

  topic?: string;
  subtopic?: string;

  question: string;
  answer: string;
  explanation?: string;

  difficulty?: Difficulty;
  tags?: string[];

  // optional ordering if you ever need it
  order?: number;

  // for special card categories if you want later ("ekg", "multi", etc.)
  type?: string;

  // link to a local asset on the client
  imageKey?: string;
}
