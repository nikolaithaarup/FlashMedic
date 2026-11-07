import akutteTilstande from "../../Backend/data/subjects/akutte_tilstande.json";
import anatomiOgFysiologi from "../../Backend/data/subjects/anatomi_og_fysiologi.json";
import ekg from "../../Backend/data/subjects/ekg.json";
import farmakologi from "../../Backend/data/subjects/farmakologi.json";
import kliniskeParametre from "../../Backend/data/subjects/kliniske_parametre.json";
import koerekort from "../../Backend/data/subjects/kørekort.json";
import mikrobiologi from "../../Backend/data/subjects/mikrobiologi.json";
import psykologi from "../../Backend/data/subjects/psykologi.json";
import sygdomslaere from "../../Backend/data/subjects/sygdomslaere.json";
import traumatologiOgItls from "../../Backend/data/subjects/traumatologi_og_itls.json";

import { validateFlashcardDocuments } from "../services/flashcardValidation";
import type { Flashcard } from "../types/Flashcard";

const rawBundledCards = [
  ...akutteTilstande,
  ...anatomiOgFysiologi,
  ...ekg,
  ...farmakologi,
  ...kliniskeParametre,
  ...koerekort,
  ...mikrobiologi,
  ...psykologi,
  ...sygdomslaere,
  ...traumatologiOgItls,
];

/**
 * The validated Backend subject exports are the repository's authoritative
 * 1,970-card inventory. Keeping them in the application bundle makes the core
 * learning modes available without a network connection; Firestore may still
 * supply newer revisions at runtime.
 */
export const bundledFlashcards: Flashcard[] = validateFlashcardDocuments(
  rawBundledCards.map((data, index) => ({
    data,
    fallbackId: `bundled-${index}`,
    source: "bundled subject exports",
  })),
);

export const BUNDLED_FLASHCARD_COUNT = bundledFlashcards.length;
