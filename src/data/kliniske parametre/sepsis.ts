import type { Flashcard } from "../../types/Flashcard";

export const klinikFarmakoSepsisCards: Flashcard[] = [
  {
    id: "farmasepsis_001",
    question: "Hvorfor gives ilt ofte ved sepsis?",
    answer: "Sepsis reducerer iltoptagelse og transport, hvilket kræver supplemental ilt for at sikre vævsperfusion.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "easy",
    tags: ["ilt", "sepsis"]
  },
  {
    id: "farmasepsis_002",
    question: "Hvad er formålet med iv-væske ved sepsis?",
    answer: "At erstatte væske tabt til interstitiet pga. kapillærlækage og forbedre kredsløb og BT.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "medium",
    tags: ["væske", "shock"]
  },
  {
    id: "farmasepsis_003",
    question: "Hvorfor kan vasopressorer være nødvendige ved septisk shock?",
    answer: "Fordi kraftig vasodilatation gør, at væske alene ikke kan opretholde blodtryk.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "hard",
    tags: ["vasopressor", "BT"]
  },
  {
    id: "farmasepsis_004",
    question: "Hvorfor gives iv-glukose ved lavt blodsukker i sepsis?",
    answer: "Stressrespons og øget metabolisme kan udtømme glukose og give hypoglykæmi.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "medium",
    tags: ["glukose", "hypoglykæmi"]
  },
  {
    id: "farmasepsis_005",
    question: "Hvorfor må antibiotika ikke gives i ambulancen ved mistanke om sepsis?",
    answer: "Det kræver dyrkning og lægelig ordination for korrekt valg og undgå resistens.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "medium",
    tags: ["antibiotika", "ordination"]
  },
  {
    id: "farmasepsis_006",
    question: "Hvad betyder 'empirisk antibiotika' på hospitalet?",
    answer: "Antibiotika gives ud fra sandsynlig årsag før man kender specifik bakterie.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "medium",
    tags: ["empirisk", "behandling"]
  },
  {
    id: "farmasepsis_007",
    question: "Hvordan kan du vurdere om væsketerapi virker præhospitalt?",
    answer: "BT stabiliseres, puls falder, CRT forbedres og mentalstatus bedres.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "hard",
    tags: ["væskeeffekt"]
  },
  {
    id: "farmasepsis_008",
    question: "Hvorfor skal man være forsigtig med store væskemængder ved kardiogent shock?",
    answer: "Øger risiko for lungeødem pga. hjertets nedsatte pumpeevne.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "hard",
    tags: ["væske", "hjertesvigt"]
  },
  {
    id: "farmasepsis_009",
    question: "Hvilken farmakologisk effekt har adrenalin ved anafylaktisk shock?",
    answer: "Vasokonstriktion, bronkodilatation og øget BT og cardiac output.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "hard",
    tags: ["anafylaksi", "adrenalin"]
  },
  {
    id: "farmasepsis_010",
    question: "Hvorfor stiger ofte blodsukkeret ved infektion?",
    answer: "Stressrespons → kortisol/adrenalin → hæmmer insulin og øger glukose.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "medium",
    tags: ["hyperglykæmi"]
  },
  {
    id: "farmasepsis_011",
    question: "Hvordan kan væskebehandling forbedre bevidsthedsniveauet ved sepsis?",
    answer: "Forbedret cerebral perfusion giver højere GCS.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "medium",
    tags: ["GCS", "perfusion"]
  },
  {
    id: "farmasepsis_012",
    question: "Hvad er den primære årsag til hypotension ved sepsis?",
    answer: "Vasodilatation og tab af intravaskulær væske pga. kapillærlækage.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "hard",
    tags: ["vasodilatation", "BT"]
  },
  {
    id: "farmasepsis_013",
    question: "Hvorfor kan iltbehandling være utilstrækkelig ved sepsis?",
    answer: "Ilttransport og vævsoptagelse er ofte nedsat trods god saturation.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "hard",
    tags: ["ilt", "vævsoptagelse"]
  },
  {
    id: "farmasepsis_014",
    question: "Hvordan kan iv-væske forbedre laktatniveauet ved sepsis?",
    answer: "Bedre perfusion → mindre anaerob metabolisme → lavere laktat.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "hard",
    tags: ["laktat", "perfusionsstatus"]
  },
  {
    id: "farmasepsis_015",
    question: "Hvorfor kan vasopressor være farligt at give præhospitalt?",
    answer: "Perifer ekstravasation kan give nekrose, og monitorering kræver hospital.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "hard",
    tags: ["vasopressor", "risiko"]
  },
  {
    id: "farmasepsis_016",
    question: "Hvad er paramedicinerens rolle ift. antibiotika ved sepsis?",
    answer: "Ikke give det – men identificere infektion og informere hospitalet om mistanke.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "easy",
    tags: ["rolle", "antibiotika"]
  },
  {
    id: "farmasepsis_017",
    question: "Hvorfor gives væske hurtigt ved sepsis, men langsomt ved hjertesvigt?",
    answer: "Sepsis → lav modstand og lav volumen. Hjertesvigt → risiko for overload og lungeødem.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "medium",
    tags: ["væske", "differentialdiagnose"]
  },
  {
    id: "farmasepsis_018",
    question: "Hvad er tegn på at væsketerapi ikke virker?",
    answer: "BT stiget minimalt, fortsat tachykardi, kold hud og mental påvirkning.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "hard",
    tags: ["væsketerapi", "BT"]
  },
  {
    id: "farmasepsis_019",
    question: "Hvordan kan glukose påvirke mental status ved sepsis?",
    answer: "Hypoglykæmi kan forværre eller imitere sepsis-hjerne.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "medium",
    tags: ["glukose", "mental status"]
  },
  {
    id: "farmasepsis_020",
    question: "Hvad er paramedicinerens hovedmål ved sepsisbehandling?",
    answer: "Optimere perfusion (ilt, væske), understøtte ABC og sikre hurtig transport.",
    subject: "Kliniske parametre",
    topic: "Farmakologi & sepsis",
    difficulty: "easy",
    tags: ["rolle", "ABC"]
  }
];
