import { Flashcard } from "../../types/Flashcard";

// Samler alle flashcards fra akutte tilstande

import { akutAbdomenCards } from "./akut_abdomen";
import { akutBinyrebarkinsufficiensCards } from "./akut_binyrebarkinsufficiens";
import { akutKoronarSyndromCards } from "./akut_koronar_syndrom";
import { akutteObstetriskeTilstandeCards } from "./akutte_obstetriske_tilstande";
import { anafylaksiCards } from "./anafylaksi";
import { aortaaneurismeCards } from "./aortaaneurisme";
import { akutCerebralApopleksiCards } from "./cerebral_apopleksi";
import { akutDiabetesMellitusCards } from "./diabetes_mellitus";
import { ebolaBlodningsfebervirusCards } from "./ebola_blodningsfebervirus";
import { forgiftningerCards } from "./forgiftninger";
import { grovreponeringCards } from "./grovreponering";
import { akuthjertestopCards } from "./hjertestop";
import { hovedtraumeCards } from "./hovedtraume";
import { kramperCards } from "./kramper";
import { meningitisMeningokoksyndromCards } from "./meningitis_meningokoksyndrom";
import { tonsillektomiEfterblodningCards } from "./tonsillektomi";

// Hvis du senere får nye filer, tilføjer du blot import + ind i arrayet

export const akutteTilstandeCards = Flashcard[] = [
  ...akutAbdomenCards,
  ...akutBinyrebarkinsufficiensCards,
  ...akutKoronarSyndromCards,
  ...akutteObstetriskeTilstandeCards,
  ...anafylaksiCards,
  ...aortaaneurismeCards,
  ...akutCerebralApopleksiCards,
  ...akutDiabetesMellitusCards,
  ...ebolaBlodningsfebervirusCards,
  ...forgiftningerCards,
  ...grovreponeringCards,
  ...akuthjertestopCards,
  ...hovedtraumeCards,
  ...kramperCards,
  ...meningitisMeningokoksyndromCards,
  ...tonsillektomiEfterblodningCards,
];
