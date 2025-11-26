import type { Flashcard } from "../../../types/Flashcard";

import { amiCards } from "./ami";
import { anginaCards } from "./angina";
import { arytmierCards } from "./arytmier";
import { hjertestopCards } from "./hjertestop";
import { hjertesvigtCards } from "./hjertesvigt";

export const hjertesygdommeCards: Flashcard[] = [
  ...amiCards,
  ...anginaCards,
  ...arytmierCards,
  ...hjertestopCards,
  ...hjertesvigtCards,
];
