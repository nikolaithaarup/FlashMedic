import type { Flashcard } from "../../types/Flashcard";

import { mikroBakterierCards } from "./bakterier";
import { mikroSvampeParasitterCards } from "./parasitter_og_svampe";
import { mikroSepsisCards } from "./sepsis_og_immunrespons";
import { mikroSmitteCards } from "./smitteveje_og_isolation";
import { mikroVirusCards } from "./virus";

export const mikrobiologiCards: Flashcard[] = [
  ...mikroBakterierCards,
  ...mikroSvampeParasitterCards,
  ...mikroSepsisCards,
  ...mikroSmitteCards,
  ...mikroVirusCards,
];
