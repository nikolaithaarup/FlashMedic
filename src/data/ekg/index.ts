import type { Flashcard } from "../../types/Flashcard";

import { ekgAvanceretCards } from "./avancerede_diagnoser";
import { ekgGenereltCards } from "./generelt";
import { ekgBillederCards } from "./billeder";

export const ekgCards: Flashcard[] = [
  ...ekgGenereltCards,
  ...ekgAvanceretCards,
  ...ekgBillederCards,
];
