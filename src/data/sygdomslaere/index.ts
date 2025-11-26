import type { Flashcard } from "../../types/Flashcard";

import { introduktionCards } from "./introduktion";
import { akutMedicinCards } from "./akut_medicin";
import { endokrinologiCards } from "./endokrinologi";
import { gastroCards } from "./gastro";
import { geriatriCards } from "./geriatri";
import { haematologiCards } from "./haematologi";
import { infektionCards } from "./infektion";
import { karsygdommeCards } from "./karsygdomme";
import { lungesygdommeCards } from "./lungesygdomme";
import { neurologiCards } from "./neurologi";
import { nyrerCards } from "./nyrer_og_urinveje";
import { paediatriCards } from "./paediatri";
import { hjertesygdommeCards } from "./hjertesygdomme";

export const sygdomslaereCards: Flashcard[] = [
  ...introduktionCards,
  ...akutMedicinCards,
  ...endokrinologiCards,
  ...gastroCards,
  ...geriatriCards,
  ...haematologiCards,
  ...infektionCards,
  ...karsygdommeCards,
  ...lungesygdommeCards,
  ...neurologiCards,
  ...nyrerCards,
  ...paediatriCards,
  ...hjertesygdommeCards,
];
