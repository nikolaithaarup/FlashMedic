import type { Flashcard } from "../../types/Flashcard";

import { ekgAvanceretCards } from "./avancerede_diagnoser";
import { ekgGenereltCards } from "./generelt";

export const ekgCards: Flashcard[] = [
  ...ekgGenereltCards,
  ...ekgAvanceretCards,
];
