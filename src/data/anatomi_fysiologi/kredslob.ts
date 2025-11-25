import type { Flashcard } from "../../types/Flashcard";

export const kredslobCards: Flashcard[] = [
  {
    id: "kredslob_001",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    question: "Hvad forstås ved perfusion i en præhospital kontekst?",
    answer:
      "Perfusion er levering af ilt og næringsstoffer til kroppens væv gennem blodets cirkulation. Utilstrækkelig perfusion ses ved shock.",
    difficulty: "easy",
    tags: ["perfusion", "shock"]
  },
  {
    id: "kredslob_002",
    question: "Forklar forskellen på systemisk og pulmonal kredsløb.",
    answer:
      "Systemisk kredsløb sender blod ud i kroppen via aorta. Pulmonal kredsløb fører iltfattigt blod til lungerne og iltet blod tilbage til venstre atrium.",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    difficulty: "easy",
    tags: ["systemisk", "pulmonal"]
  },
  {
    id: "kredslob_003",
    question:
      "Hvordan defineres blodtryk (BT)?",
    answer:
      "Blodtryk er det tryk, blodet udøver på karvæggen. BT = Cardiac Output × Perifer Modstand.",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    difficulty: "medium",
    tags: ["BT", "CO"]
  },
  {
    id: "kredslob_004",
    question: "Hvad er cardiac output (CO), og hvordan beregnes det?",
    answer:
      "Cardiac output er hjertets minutvolumen og beregnes: CO = HR × Slagvolumen.",
    difficulty: "medium",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["CO", "puls", "slagvolumen"]
  },
  {
    id: "kredslob_005",
    question: "Forklar preload, afterload og kontraktilitet kort.",
    answer:
      "Preload: fyldning af ventriklen før kontraktion. Afterload: modstanden hjertet skal pumpe imod. Kontraktilitet: hjertemusklens evne til at trække sig sammen.",
    difficulty: "hard",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["preload", "afterload"]
  },
  {
    id: "kredslob_006",
    question:
      "Hvordan påvirker dehydrering preload og blodtryk?",
    answer:
      "Dehydrering reducerer blodvolumen og preload, hvilket mindsker slagvolumen og BT.",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    difficulty: "medium",
    tags: ["BT", "dehydrering"]
  },
  {
    id: "kredslob_007",
    question: "Hvorfor kan venstresidig hjertesvigt føre til lungeødem?",
    answer:
      "Ved venstresidig hjertesvigt stiger trykket i lungekapillærerne, og væske presses ud i alveolerne → lungeødem.",
    difficulty: "hard",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["hjertesvigt", "lungeødem"]
  },
  {
    id: "kredslob_008",
    question: "Hvad forstås ved mean arterial pressure (MAP)?",
    answer:
      "MAP er det gennemsnitlige arterielle tryk gennem hele hjerteslaget og er afgørende for organperfusion. MAP <65 mmHg er kritisk.",
    difficulty: "medium",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["MAP", "perfusion"]
  },
  {
    id: "kredslob_009",
    question: "Hvad er forskellen på systolisk og diastolisk BT?",
    answer:
      "Systolisk: tryk under hjertets kontraktion. Diastolisk: tryk når hjertet hviler.",
    difficulty: "easy",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["BT"]
  },
  {
    id: "kredslob_010",
    question:
      "Hvorfor kan septisk shock give lavt blodtryk trods høj puls?",
    answer:
      "Ved sepsis dilateres blodkar pga. inflammation og tab af tonus → lavt BT trods kompensatorisk høj puls.",
    difficulty: "hard",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["shock", "sepsis"]
  },
  {
    id: "kredslob_011",
    question: "Hvad er hæmatokrit (HCT)?",
    answer:
      "Andelen af blodvolumen, der udgøres af røde blodlegemer. Lav HCT → anæmi, høj HCT → dehydrering eller polycytæmi.",
    difficulty: "medium",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["hæmatokrit"]
  },
  {
    id: "kredslob_012",
    question: "Hvordan transporteres CO₂ i blodet?",
    answer:
      "70% som bikarbonat (HCO₃−), 23% bundet til hæmoglobin og 7% frit opløst i plasma.",
    difficulty: "medium",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["co2", "transport"]
  },
  {
    id: "kredslob_013",
    question: "Hvad er Starling-loven (Frank-Starling)?",
    answer:
      "Jo mere ventriklen fyldes under diastole (preload), desto kraftigere kontraktion og større slagvolumen.",
    difficulty: "medium",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["Frank-Starling"]
  },
  {
    id: "kredslob_014",
    question: "Hvilken betydning har albumin for kredsløbet?",
    answer:
      "Albumin hjælper med at opretholde det kolloidosmotiske tryk og forhindrer væske i at lække ud i vævet.",
    difficulty: "hard",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["albumin", "væske"]
  },
  {
    id: "kredslob_015",
    question:
      "Hvorfor er venetryk vigtigt for preload?",
    answer:
      "Højt venetryk øger blodets tilbageløb til hjertet og dermed preload, slagvolumen og BT.",
    difficulty: "medium",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["preload", "venetryk"]
  },
  {
    id: "kredslob_016",
    question: "Hvad er DO₂ i præhospital sammenhæng?",
    answer:
      "Delivery of Oxygen: det samlede ilttilbud til vævet. DO₂ afhænger af Hgb, SaO₂ og CO.",
    difficulty: "hard",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["ilttransport"]
  },
  {
    id: "kredslob_017",
    question: "Hvad forstås ved perifer modstand?",
    answer:
      "Modstanden blodet møder i arterier og arterioler. Påvirkes bl.a. af kar-diameter og vasokonstriktion.",
    difficulty: "medium",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["modstand", "BT"]
  },
  {
    id: "kredslob_018",
    question: "Hvad er årsagen til ortostatisk hypotension?",
    answer:
      "Når man stiller sig op, samler blodet sig i benene. Hvis kroppen ikke kompenserer via sympatikus → fald i BT og svimmelhed.",
    difficulty: "medium",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["BT", "svimmelhed"]
  },
  {
    id: "kredslob_019",
    question: "Hvad er forskellen på arterier og vener?",
    answer:
      "Arterier fører blod fra hjertet (højt tryk), vener fører blod tilbage til hjertet (lavt tryk, indeholder klapper).",
    difficulty: "easy",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["arterier", "vener"]
  },
  {
    id: "kredslob_020",
    question:
      "Hvorfor kan patienter med hjertesvigt opleve kuldefornemmelse i ekstremiteterne?",
    answer:
      "Nedsat cardiac output → kroppen prioriterer vitale organer og reducerer blodflow til arme og ben.",
    difficulty: "medium",
    subject: "Anatomi og fysiologi",
    topic: "Kredsløb",
    tags: ["hjertesvigt", "perfusion"]
  }
];
