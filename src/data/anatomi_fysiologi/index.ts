import type { Flashcard } from "../../types/Flashcard";

import { bevaegeapparatetCards } from "./bevaegeapparatet";
import { cellervevCards } from "./celler_vev";
import { endokrinCards } from "./endokrin";
import { fordojelseCards } from "./fordojelse";
import { graviditetCards } from "./graviditet";
import { kredslobCards } from "./kredslob";
import { nervesystemetCards } from "./nervesystemet";
import { nyrefunktionCards } from "./nyrefunktion";
import { respirationCards } from "./respiration";

export const anatomiFysiologiCards: Flashcard[] = [
  ...bevaegeapparatetCards,
  ...cellervevCards,
  ...endokrinCards,
  ...fordojelseCards,
  ...graviditetCards,
  ...kredslobCards,
  ...nervesystemetCards,
  ...nyrefunktionCards,
  ...respirationCards,
];
