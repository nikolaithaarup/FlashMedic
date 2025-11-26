import type { Flashcard } from "../../types/Flashcard";

import { klinikCirkulationAcidoseCards } from "./cirkulation";
import { klinikDifferentialDiagnoserCards } from "./differential_diagnoser";
import { klinikInfektionNeurologiCards } from "./infektion";
import { kliniskIntegrationCards } from "./klinik";
import { klinikFarmakoSepsisCards } from "./sepsis";
import { klinikShockCards } from "./shock";

export const kliniskeParametreCards: Flashcard[] = [
  ...klinikCirkulationAcidoseCards,
  ...klinikDifferentialDiagnoserCards,
  ...klinikInfektionNeurologiCards,
  ...kliniskIntegrationCards,
  ...klinikFarmakoSepsisCards,
  ...klinikShockCards,
];
