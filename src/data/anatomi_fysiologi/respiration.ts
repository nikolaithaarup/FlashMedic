import type { Flashcard } from "../../types/Flashcard";

export const respirationCards: Flashcard[] = [
  {
    id: "resp_001",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question: "Hvad er forskellen på ventilation og respiration?",
    answer:
      "Ventilation er luftens bevægelse ind og ud af lungerne. Respiration er gasudvekslingen i alveoler og ude i vævene.",
    difficulty: "easy",
    tags: ["ventilation", "respiration", "definition"]
  },
  {
    id: "resp_002",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question:
      "Forklar kort, hvordan gasudvekslingen foregår i alveolerne.",
    answer:
      "I alveolerne diffunderer O₂ fra luften til blodet og CO₂ fra blodet til alveoleluften, styret af partialtryk.",
    difficulty: "easy",
    tags: ["gasudveksling", "alveoler"]
  },
  {
    id: "resp_003",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question: "Forklar begrebet partialtryk (pO2 og pCO2).",
    answer:
      "Partialtryk beskriver koncentrationen af en gas i en blanding. pO₂ og pCO₂ afgør diffusion mellem blod og alveole.",
    difficulty: "medium",
    tags: ["partialtryk", "gasudveksling"]
  },
  {
    id: "resp_004",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question:
      "Hvordan transporteres størstedelen af ilt i blodet?",
    answer:
      "Omkring 98% binder til hæmoglobin, mens kun 2% transporteres frit opløst i plasma.",
    difficulty: "easy",
    tags: ["ilttransport", "hæmoglobin"]
  },
  {
    id: "resp_005",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question: "Hvad er oxyhæmoglobin-dissociationskurven?",
    answer:
      "En kurve der viser forholdet mellem pO₂ og hæmoglobins iltmætning (SaO₂). Forklarer hvorfor ilt afgives lettere i væv med lav pO₂.",
    difficulty: "medium",
    tags: ["kurve", "hæmoglobin"]
  },
  {
    id: "resp_006",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question: "Hvad betyder høj resp.frekvens (takypnø) fysiologisk?",
    answer:
      "Øget RF kan være et tegn på hypoxi, acidose, smerte, angst eller kompensation for metabolisk acidose.",
    difficulty: "medium",
    tags: ["rf", "kompensation"]
  },
  {
    id: "resp_007",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question:
      "Hvorfor får KOL-patienter nedsat gasudveksling?",
    answer:
      "Ødelagte alveoler og tab af elastic recoil medfører mindre diffusionsoverflade og luftfangst.",
    difficulty: "medium",
    tags: ["kol", "alveoler"]
  },
  {
    id: "resp_008",
    question:
      "Hvad er forskellen på hypoxi og hypoxæmi?",
    answer:
      "Hypoxi: utilstrækkelig ilt til kroppens væv. Hypoxæmi: nedsat iltindhold i blodet (lav pO₂/SaO₂).",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    difficulty: "medium",
    tags: ["iltmangel"]
  },
  {
    id: "resp_009",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question: "Hvad sker ved respiratorisk acidose?",
    answer:
      "CO₂ ophobes i blodet pga. hypoventilation, hvilket sænker pH og giver acidose.",
    difficulty: "hard",
    tags: ["acidose", "co2"]
  },
  {
    id: "resp_010",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question: "Beskriv kort kroppens pH-regulering ved hyperventilation.",
    answer:
      "Ved hyperventilation udskilles ekstra CO₂, hvilket reducerer syre og øger pH (respiratorisk alkalose).",
    difficulty: "hard",
    tags: ["alkalose"]
  },
  {
    id: "resp_011",
    question:
      "Hvordan påvirkes respirationen af sympatikusaktivering?",
    answer:
      "RF øges, bronkier dilateres og vejrtrækningen bliver dybere for at forbedre ilttilførsel.",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    difficulty: "medium",
    tags: ["sympaticus", "respiration"]
  },
  {
    id: "resp_012",
    question: "Hvad er tidalvolumen (VT)?",
    answer:
      "Den mængde luft, man normalt indånder eller udånder ved hver vejrtrækning (~500 ml hos voksne).",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    difficulty: "easy",
    tags: ["VT", "volumen"]
  },
  {
    id: "resp_013",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question:
      "Hvordan beregnes minutventilation?",
    answer:
      "RF × tidalvolumen (VT). Fx 12 vejrtrækninger/min × 500 ml = 6 liter/min.",
    difficulty: "medium",
    tags: ["minutventilation"]
  },
  {
    id: "resp_014",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question: " Hvordan ændres respirationen ved metabolisk acidose?",
    answer:
      "Man hyperventilerer for at udskille CO₂ og kompensere, fx ved ketoacidose.",
    difficulty: "hard",
    tags: ["DKA", "kompensation"]
  },
  {
    id: "resp_015",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question:
      "Hvorfor kan pneumothorax give respirationssvigt?",
    answer:
      "Luft i pleurahulen trykker på lungen og reducerer ventilation og gasudveksling.",
    difficulty: "medium",
    tags: ["trauma", "pneumothorax"]
  },
  {
    id: "resp_016",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question:
      "Hvorfor er surfaktant vigtig for lungerne?",
    answer:
      "Surfaktant nedsætter overfladespændingen i alveolerne og forhindrer sammenklapning ved udånding.",
    difficulty: "medium",
    tags: ["alveoler", "surfaktant"]
  },
  {
    id: "resp_017",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question: "Hvad sker der ved respiratorisk insufficiens?",
    answer:
      "Utilstrækkelig gasudveksling medfører hypoxæmi og/eller hyperkapni.",
    difficulty: "hard",
    tags: ["insufficiens", "respiration"]
  },
  {
    id: "resp_018",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question: "Hvad er dead space?",
    answer:
      "Den del af luftvejene hvor der ikke foregår gasudveksling (mund, trachea, bronkier).",
    difficulty: "medium",
    tags: ["ventilation"]
  },
  {
    id: "resp_019",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question: "Hvordan påvirker højre og venstresidig hjertesvigt respirationen?",
    answer:
      "Venstresidig svigt → lungeødem. Højresidig svigt → væskeophobning og nedsat lungeperfusion.",
    difficulty: "hard",
    tags: ["hjertesvigt", "respiration"]
  },
  {
    id: "resp_020",
    subject: "Anatomi og fysiologi",
    topic: "Respiration",
    question:
      "Hvorfor kan hyperventilation føre til svimmelhed og paræstesier?",
    answer:
      "CO₂ tab sænker ionkoncentrationer i blodet (respiratorisk alkalose), hvilket påvirker nervefunktion.",
    difficulty: "medium",
    tags: ["hyperventilation", "nerve"]
  }
];
