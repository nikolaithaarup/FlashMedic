import type { Flashcard } from "../../types/Flashcard";

import { traumeHjertestopCards } from "./hjertestop";
import { tbiNeurologiCards } from "./hovedtraumer";
import { ITLSPrimaryCards } from "./primary_survey";
import { traumeSekundaerCards } from "./secondary_survery";
import { ShockTraumeCards } from "./shock_cirkulation";
import { MOICards } from "./skademekanisme";
import { ThoraxTraumeCards } from "./thoraxtraumer";

export const traumatologiItlsCards: Flashcard[] = [
  ...ITLSPrimaryCards,
  ...traumeSekundaerCards,
  ...ShockTraumeCards,
  ...ThoraxTraumeCards,
  ...tbiNeurologiCards,
  ...MOICards,
  ...traumeHjertestopCards,
];
