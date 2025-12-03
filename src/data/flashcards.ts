import type { Flashcard } from "../types/Flashcard";

// Akutte tilstande
import { akutAbdomenCards } from "./akutte tilstande/akut_abdomen";
import { akutBinyrebarkinsufficiensCards } from "./akutte tilstande/akut_binyrebarkinsufficiens";
import { akutKoronarSyndromCards } from "./akutte tilstande/akut_koronar_syndrom";
import { akutteObstetriskeTilstandeCards } from "./akutte tilstande/akutte_obstetriske_tilstande";
import { anafylaksiCards } from "./akutte tilstande/anafylaksi";
import { aortaaneurismeCards } from "./akutte tilstande/aortaaneurisme";
import { akutCerebralApopleksiCards } from "./akutte tilstande/cerebral_apopleksi";
import { akutDiabetesMellitusCards } from "./akutte tilstande/diabetes_mellitus";
import { ebolaBlodningsfebervirusCards } from "./akutte tilstande/ebola_blodningsfebervirus";
import { forgiftningerCards } from "./akutte tilstande/forgiftninger";
import { grovreponeringCards } from "./akutte tilstande/grovreponering";
import { akuthjertestopCards } from "./akutte tilstande/hjertestop";
import { hovedtraumeCards } from "./akutte tilstande/hovedtraume";
import { kramperCards } from "./akutte tilstande/kramper";
import { meningitisMeningokoksyndromCards } from "./akutte tilstande/meningitis_meningokoksyndrom";
import { tonsillektomiEfterblodningCards } from "./akutte tilstande/tonsillektomi";

// Anatomi og Fysiologi
import { bevaegeapparatetCards } from "./anatomi_fysiologi/bevaegeapparatet";
import { cellervevCards } from "./anatomi_fysiologi/celler_vev";
import { endokrinCards } from "./anatomi_fysiologi/endokrin";
import { fordojelseCards } from "./anatomi_fysiologi/fordojelse";
import { graviditetCards } from "./anatomi_fysiologi/graviditet";
import { kredslobCards } from "./anatomi_fysiologi/kredslob";
import { nervesystemetCards } from "./anatomi_fysiologi/nervesystemet";
import { nyrefunktionCards } from "./anatomi_fysiologi/nyrefunktion";
import { respirationCards } from "./anatomi_fysiologi/respiration";

// EKG
import { ekgAvanceretCards } from "./ekg/avancerede_diagnoser";
import { ekgBillederCards } from "./ekg/billeder";
import { ekgGenereltCards } from "./ekg/generelt";

// Farmakologi
import { administrationCards } from "./farmakologi/administration";
import { bivirkningerCards } from "./farmakologi/bivirkninger";
import { farmakodynamikCards } from "./farmakologi/farmakodynamik";
import { farmakokinetikCards } from "./farmakologi/farmakokinetik";
import { laegemiddelregningCards } from "./farmakologi/laegemiddelregning";

// Kliniske Parametre
import { klinikCirkulationAcidoseCards } from "./kliniske parametre/cirkulation";
import { klinikDifferentialDiagnoserCards } from "./kliniske parametre/differential_diagnoser";
import { klinikInfektionNeurologiCards } from "./kliniske parametre/infektion";
import { kliniskIntegrationCards } from "./kliniske parametre/klinik";
import { klinikFarmakoSepsisCards } from "./kliniske parametre/sepsis";
import { klinikShockCards } from "./kliniske parametre/shock";

// Mikrobiologi
import { mikroBakterierCards } from "./mikrobiologi/bakterier";
import { mikroSvampeParasitterCards } from "./mikrobiologi/parasitter_og_svampe";
import { mikroSepsisCards } from "./mikrobiologi/sepsis_og_immunrespons";
import { mikroSmitteCards } from "./mikrobiologi/smitteveje_og_isolation";
import { mikroVirusCards } from "./mikrobiologi/virus";

// Sygdomslære
import { akutMedicinCards } from "./sygdomslaere/akut_medicin";
import { endokrinologiCards } from "./sygdomslaere/endokrinologi";
import { gastroCards } from "./sygdomslaere/gastro";
import { geriatriCards } from "./sygdomslaere/geriatri";
import { haematologiCards } from "./sygdomslaere/haematologi";
import { infektionCards } from "./sygdomslaere/infektion";
import { introduktionCards } from "./sygdomslaere/introduktion";
import { karsygdommeCards } from "./sygdomslaere/karsygdomme";
import { lungesygdommeCards } from "./sygdomslaere/lungesygdomme";
import { neurologiCards } from "./sygdomslaere/neurologi";
import { nyrerCards } from "./sygdomslaere/nyrer_og_urinveje";
import { paediatriCards } from "./sygdomslaere/paediatri";

// Hjertesygdomme
import { amiCards } from "./sygdomslaere/hjertesygdomme/ami";
import { anginaCards } from "./sygdomslaere/hjertesygdomme/angina";
import { arytmierCards } from "./sygdomslaere/hjertesygdomme/arytmier";
import { hjertestopCards } from "./sygdomslaere/hjertesygdomme/hjertestop";
import { hjertesvigtCards } from "./sygdomslaere/hjertesygdomme/hjertesvigt";

// Traumatologi og ITLS
import { traumeHjertestopCards } from "./traumatologi og itls/hjertestop";
import { tbiNeurologiCards } from "./traumatologi og itls/hovedtraumer";
import { ITLSPrimaryCards } from "./traumatologi og itls/primary_survey";
import { traumeSekundaerCards } from "./traumatologi og itls/secondary_survery";
import { ShockTraumeCards } from "./traumatologi og itls/shock_cirkulation";
import { MOICards } from "./traumatologi og itls/skademekanisme";
import { ThoraxTraumeCards } from "./traumatologi og itls/thoraxtraumer";

console.log("FLASHCARDS FILE LOADED");

// ---------- Combine everything with a small safety layer ----------

type DeckMap = { [name: string]: Flashcard[] | undefined };

const decks: DeckMap = {
  // Akutte tilstande
  akutAbdomenCards,
  akutBinyrebarkinsufficiensCards,
  akutKoronarSyndromCards,
  akutteObstetriskeTilstandeCards,
  anafylaksiCards,
  aortaaneurismeCards,
  akutCerebralApopleksiCards,
  akutDiabetesMellitusCards,
  ebolaBlodningsfebervirusCards,
  forgiftningerCards,
  grovreponeringCards,
  akuthjertestopCards,
  hovedtraumeCards,
  kramperCards,
  meningitisMeningokoksyndromCards,
  tonsillektomiEfterblodningCards,

  // Anatomi og Fysiologi
  cellervevCards,
  respirationCards,
  nervesystemetCards,
  nyrefunktionCards,
  kredslobCards,
  endokrinCards,
  fordojelseCards,
  graviditetCards,
  bevaegeapparatetCards,

  // Farmakologi
  administrationCards,
  bivirkningerCards,
  farmakodynamikCards,
  farmakokinetikCards,
  laegemiddelregningCards,

  // Kliniske Parametre
  klinikCirkulationAcidoseCards,
  klinikDifferentialDiagnoserCards,
  klinikInfektionNeurologiCards,
  kliniskIntegrationCards,
  klinikFarmakoSepsisCards,
  klinikShockCards,

  // Mikrobiologi
  mikroBakterierCards,
  mikroSvampeParasitterCards,
  mikroSepsisCards,
  mikroSmitteCards,
  mikroVirusCards,

  // Sygdomslære
  introduktionCards,
  karsygdommeCards,
  akutMedicinCards,
  endokrinologiCards,
  gastroCards,
  geriatriCards,
  haematologiCards,
  infektionCards,
  lungesygdommeCards,
  neurologiCards,
  nyrerCards,
  paediatriCards,

  // Hjertesygdomme
  amiCards,
  anginaCards,
  arytmierCards,
  hjertestopCards,
  hjertesvigtCards,

  // EKG
  ekgGenereltCards,
  ekgAvanceretCards,
  ekgBillederCards,

  // Traumatologi og ITLS
  traumeHjertestopCards,
  tbiNeurologiCards,
  ITLSPrimaryCards,
  traumeSekundaerCards,
  ShockTraumeCards,
  MOICards,
  ThoraxTraumeCards,
};

// Log any broken decks clearly instead of cryptic "arraySpread" errors
Object.entries(decks).forEach(([name, deck]) => {
  if (!Array.isArray(deck)) {
    console.warn(`❗ Deck "${name}" is NOT an array:`, deck);
  }
});

// NEW: export the deck map so the exporter can attach deckId to each card
export const allDecks = decks;

// Existing: flat list used by the app
export const allFlashcards: Flashcard[] = Object.entries(decks).flatMap(
  ([name, deck]) => {
    if (!Array.isArray(deck)) {
      // Skip broken decks so the app still loads
      return [];
    }
    return deck;
  }
);
