import type { Flashcard } from "../../types/Flashcard";

export const kliniskIntegrationCards: Flashcard[] = [
  {
    id: "mikro_klinisk_001",
    question: "Hvilke tre elementer kræver mistanke om sepsis præhospitalt?",
    answer: "1) Mistanke om infektion, 2) påvirket vitalstatus, 3) tegn på organsvigt (ændret mentalstatus, hypotension, høj RF).",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "medium",
    tags: ["sepsis", "triage"]
  },
  {
    id: "mikro_klinisk_002",
    question: "Hvad er det første vitale parameter, der ofte ændres ved sepsis?",
    answer: "Respirationsfrekvensen stiger (>22) som kompensation for metabolisk acidose.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "hard",
    tags: ["respiration", "kompensation"]
  },
  {
    id: "mikro_klinisk_003",
    question: "Hvilket tegn er stærkest mistanke om alvorlig infektion præhospitalt?",
    answer: "Ændret mental status (GCS <15) – tegn på organpåvirkning.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "easy",
    tags: ["GCS", "organpåvirkning"]
  },
  {
    id: "mikro_klinisk_004",
    question: "Hvordan skelner du præhospitalt mellem anafylaksi og septisk shock?",
    answer: "Anafylaksi: pludselig debut, hudforandringer, luftvejsødem. Sepsis: langsommere debut, feber, infektion, mental påvirkning.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "hard",
    tags: ["shock", "differentialdiagnose"]
  },
  {
    id: "mikro_klinisc_005",
    question: "Hvordan ses hypovolæmisk shock i modsætning til septisk shock?",
    answer: "Hypovolæmisk: kold, bleg, takykardi, lavt BT. Tidlig sepsis: varm hud, rød, høj puls og feber.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "medium",
    tags: ["shocktyper"]
  },
  {
    id: "mikro_klinisk_006",
    question: "Hvad skyldes hypotension ved sepsis?",
    answer: "Vasodilatation og kapillærlækage → fald i intravaskulært volumen.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "hard",
    tags: ["patofysiologi"]
  },
  {
    id: "mikro_klinisk_007",
    question: "Hvorfor kan septisk shock være 'varmt shock' i starten?",
    answer: "Fordi inflammatoriske mediatorer giver vasodilatation, rød og varm hud trods shock.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "hard",
    tags: ["varmt shock"]
  },
  {
    id: "mikro_klinisk_008",
    question: "Hvilke ABC-prioriteter gælder ved mistanke om sepsis?",
    answer: "Sikre luftvej, ilt ved hypoxi, iv-adgang, væske, overvågning og hurtig transport.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "easy",
    tags: ["ABC", "behandling"]
  },
  {
    id: "mikro_klinisc_009",
    question: "Hvilket vitalt parameter er mest følsomt for klinisk forværring?",
    answer: "Respirationsfrekvens – tidligt tegn på sepsis, acidose og hypoksi.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "medium",
    tags: ["RF", "vitalparametre"]
  },
  {
    id: "mikro_klinisc_010",
    question: "Hvornår mistænkes urosepsis præhospitalt?",
    answer: "Feber, flankesmerter, påvirket AT, takykardi, hypotension og evt. konfusion.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "medium",
    tags: ["urosepsis"]
  },
  {
    id: "mikro_klinisc_011",
    question: "Hvilke 3 infektionstyper fører oftest til sepsis?",
    answer: "Pneumoni, UVI/pyelonefritis og hud/ bløddelsinfektioner.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "easy",
    tags: ["infektion"]
  },
  {
    id: "mikro_klinisc_012",
    question: "Hvad betyder 'time is tissue' i sepsissammenhæng?",
    answer: "Jo tidligere sepsis opdages og behandles, desto mindre organskade og mortalitet.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "medium",
    tags: ["behandlingstid"]
  },
  {
    id: "mikro_klinisc_013",
    question: "Hvad kan petekkier på hud tyde på?",
    answer: "Meningokoksepsis og risiko for DIC og septisk shock.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "hard",
    tags: ["petechier", "meningitis"]
  },
  {
    id: "mikro_klinisc_014",
    question: "Hvorfor er mental status kritisk at vurdere ved infektion?",
    answer: "Påvirket mentalstatus er tidligt tegn på organpåvirkning og mulig sepsis.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "medium",
    tags: ["GCS", "organ"]
  },
  {
    id: "mikro_klinisc_015",
    question: "Hvorfor giver sepsis hurtig RF og lav saturation?",
    answer: "Kapillærskade og lungeinflammation reducerer iltoptagelse og ventilation.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "hard",
    tags: ["hypoxi", "lunge"]
  },
  {
    id: "mikro_klinisc_016",
    question: "Hvad tyder en hurtig puls (>120) og feber på præhospitalt?",
    answer: "Systemisk infektion eller begyndende sepsis, især hvis BT samtidig er faldende.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "medium",
    tags: ["tachykardi"]
  },
  {
    id: "mikro_klinisc_017",
    question: "Hvilke parametre indgår i NEWS2 ved infektion?",
    answer: "RF, puls, BT, saturation, temperatur og mental status.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "easy",
    tags: ["NEWS2"]
  },
  {
    id: "mikro_klinisc_018",
    question: "Hvordan kan infektion påvirke blodsukkeret?",
    answer: "Stressrespons øger kortisol og adrenalin → hyperglykæmi selv hos ikke-diabetikere.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "hard",
    tags: ["hyperglykæmi"]
  },
  {
    id: "mikro_klinisc_019",
    question: "Hvad gør du ved febril patient med hypotension og tachykardi?",
    answer: "Mistænk sepsis, etabler iv-adgang, giv ilt, monitorer og kør hurtigt til hospital.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "easy",
    tags: ["handling", "ambulance"]
  },
  {
    id: "mikro_klinisc_020",
    question: "Hvad er paramedicinerens vigtigste funktion ved sepsis?",
    answer: "Tidlig identifikation, understøttende behandling (ilt, væske, ABC), og hurtig transport.",
    subject: "Kliniske parametre",
    topic: "Klinisk integration",
    difficulty: "easy",
    tags: ["rolle"]
  }
];
