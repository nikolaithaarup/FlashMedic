import type { Flashcard } from "../types/Flashcard";

// Anatomi og Fysiologi
import { bevaegeapparattetCards } from "./anatomi_fysiologi/bevaegeapparatet";
import { cellervevCards } from "./anatomi_fysiologi/celler_vev";
import { endokrinCards } from "./anatomi_fysiologi/endokrin";
import { fordojelseCards } from "./anatomi_fysiologi/fordojelse";
import { kredslobCards } from "./anatomi_fysiologi/kredslob";
import { nervesystemetCards } from "./anatomi_fysiologi/nervesystemet";
import { nyrefunktionCards } from "./anatomi_fysiologi/nyrefunktion";
import { respirationCards } from "./anatomi_fysiologi/respiration";

// Sygdomslære – Introduktion og hovedgrupper
import { introduktionCards } from "./sygdomslaere/introduktion";
import { karsygdommeCards } from "./sygdomslaere/karsygdomme";

// Hjertesygdomme (subfolder)
import { amiCards } from "./sygdomslaere/hjertesygdomme/ami";
import { hjertesvigtCards } from "./sygdomslaere/hjertesygdomme/hjertesvigt";

// Combine everything:
export const allFlashcards: Flashcard[] = [
  // Anatomi og Fysiologi
  ...cellervevCards,
  ...respirationCards,
  ...nervesystemetCards,
  ...nyrefunktionCards,
  ...kredslobCards,
  ...endokrinCards,
  ...fordojelseCards,
  ...bevaegeapparattetCards,

  // Sygdomslære
  ...introduktionCards,
  ...karsygdommeCards,

  // Hjertesygdomme
  ...amiCards,
  ...hjertesvigtCards,
];

// If you want debug logs:
console.log("Total flashcards:", allFlashcards.length);
console.log("AMI:", amiCards.length, "Hjertesvigt:", hjertesvigtCards.length);
