import { bevaegeapparatetCards } from "./bevaegeapparatet";
import { cellerVaevCards } from "./celler_vaev";
import { endokrinCards } from "./endokrin";
import { fordøjelseCards } from "./fordojelse";
import { kredslobCards } from "./kredslob";
import { nervesystemetCards } from "./nervesystemet";
import { nyrefunktionCards } from "./nyrefunktion";
import { respirationCards } from "./respiration";

export const anatomiFysCards = [
  ...cellerVaevCards,
  ...kredslobCards,
  ...respirationCards,
  ...nervesystemetCards,
  ...nyrefunktionCards,
  ...endokrinCards,
  ...fordøjelseCards,
  ...bevaegeapparatetCards,
];
