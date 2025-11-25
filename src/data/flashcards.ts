import type { Flashcard } from "../types/Flashcard";
console.log("AMI", amiCards);
console.log("Hjertesvigt", hjertesvigtCards);



// Anatomi og Fysiologi
import { bevaegeapparatetCards } from "./anatomi_fysiologi/bevaegeapparatet";
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
  ...bevaegeapparatetCards,  

  // Sygdomslære
  ...introduktionCards,
  ...karsygdommeCards,
  ...amiCards,
  ...hjertesvigtCards,
];
