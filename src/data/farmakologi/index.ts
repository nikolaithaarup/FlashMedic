import type { Flashcard } from "../../types/Flashcard";

import { administrationCards } from "./administration";
import { bivirkningerCards } from "./bivirkninger";
import { farmakodynamikCards } from "./farmakodynamik";
import { farmakokinetikCards } from "./farmakokinetik";
import { laegemiddelregningCards } from "./laegemiddelregning";

export const farmakologiCards: Flashcard[] = [
  ...administrationCards,
  ...bivirkningerCards,
  ...farmakodynamikCards,
  ...farmakokinetikCards,
  ...laegemiddelregningCards,
];
