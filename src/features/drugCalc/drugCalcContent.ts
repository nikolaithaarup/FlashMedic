// src/features/drugCalc/drugCalcContent.ts

export type DrugCalcTopic =
  | "strength"
  | "dose"
  | "volume"
  | "percentage"
  | "conversion"
  | "tablets"
  | "dilution"
  | "drops"
  | "infusion"
  | "oxygen"
  | "time"
  | "multiStep"
  | "errorCheck";

export const DROPS_PER_ML = 20;

// -------------------- Topic metadata --------------------

export const DRUG_TOPICS: { id: DrugCalcTopic; title: string; desc: string }[] =
  [
    {
      id: "strength",
      title: "Styrke (mg/mL, ug/mL, IE/mL)",
      desc: "Konverter styrke og enheder.",
    },
    {
      id: "dose",
      title: "Dosis (mg/kg, ug/kg)",
      desc: "Vægtbaseret dosering og total dosis.",
    },
    {
      id: "volume",
      title: "Volumen (mL)",
      desc: "Hvor mange mL skal gives ud fra styrke og dosis.",
    },
    {
      id: "percentage",
      title: "Procent (g/100 mL)",
      desc: "Glukose/NaCl: g i volumen og omvendt.",
    },
    {
      id: "conversion",
      title: "Enhedsomregning (ug, mg, g, mL, L)",
      desc: "Træn sikre omregninger mellem almindelige enheder.",
    },
    {
      id: "tablets",
      title: "Tabletter",
      desc: "Beregn antal tabletter ud fra ordination og tabletstyrke.",
    },
    {
      id: "dilution",
      title: "Fortynding",
      desc: "Find slutkoncentration efter en enkel fortynding.",
    },
    {
      id: "drops",
      title: "Dråber (dr/min, dr/mL)",
      desc: `Dråbesæt: ${DROPS_PER_ML} dr pr. mL.`,
    },
    {
      id: "infusion",
      title: "Infusion (mL/t, mg/t, ug/min)",
      desc: "Hastigheder, blandinger og infusionshastighed.",
    },
    {
      id: "oxygen",
      title: "Iltbeholdning (teoretisk varighed)",
      desc: "Beregn estimeret varighed ud fra tryk, størrelse og flow.",
    },
    {
      id: "time",
      title: "Tid (hvor længe rækker det?)",
      desc: "Tid ud fra volumen og hastighed.",
    },
    {
      id: "multiStep",
      title: "Flere trin: dosis til volumen",
      desc: "Kombinér vægtbaseret dosis, styrke og volumen.",
    },
    {
      id: "errorCheck",
      title: "Find regnefejlen",
      desc: "Kontrollér enheder, regneretning og plausibilitet.",
    },
  ];

// -------------------- Theory --------------------

type TheorySectionBase = {
  topic: DrugCalcTopic;
  title: string;
  bullets: string[];
  workedExamples: { title: string; steps: string[] }[];
};

export type WorkedExample = {
  topic: DrugCalcTopic;
  title: string;
  problem: string;
  formula: string;
  calculation: string[];
  finalAnswer: string;
  commonPitfall: string;
};

export type TheorySection = Omit<TheorySectionBase, "workedExamples"> & {
  workedExamples: WorkedExample[];
};

const THEORY_BASE: TheorySectionBase[] = [
  {
    topic: "strength",
    title: "Styrke: hvad betyder mg/mL, ug/mL, IE/mL?",
    bullets: [
      "Styrke (S) fortæller hvor meget stof (mængde) der er pr. volumen.",
      "mg/mL: milligram pr. milliliter. ug/mL: mikrogram pr. milliliter.",
      "Husk: 1 mg = 1000 ug.",
      "Grundformel: D = S × V  (dosis = styrke × volumen)",
      "Omskrevet: V = D / S  og  S = D / V",
    ],
    workedExamples: [
      {
        title: "Fentanyl: 50 ug/mL — hvor meget er 2 mL?",
        steps: ["S = 50 ug/mL", "V = 2 mL", "D = S × V = 50 × 2 = 100 ug"],
      },
      {
        title:
          "Ketamin: 10 mg/mL — hvor stærk er blandingen hvis 100 mg i 20 mL?",
        steps: ["D = 100 mg", "V = 20 mL", "S = D / V = 100 / 20 = 5 mg/mL"],
      },
    ],
  },

  {
    topic: "dose",
    title: "Dosis: mg/kg og ug/kg",
    bullets: [
      "Vægtbaseret dosis: total dosis = (dosis pr kg) × (vægt i kg).",
      "Hold øje med enheder: mg/kg vs ug/kg.",
      "Konverter hvis nødvendigt: 1 mg = 1000 ug.",
    ],
    workedExamples: [
      {
        title: "Fentanyl 1 ug/kg til 84 kg",
        steps: ["1 ug/kg × 84 kg = 84 ug total dosis"],
      },
      {
        title: "Ketamin 0,5 mg/kg til 70 kg",
        steps: ["0,5 mg/kg × 70 kg = 35 mg total dosis"],
      },
    ],
  },

  {
    topic: "volume",
    title: "Volumen: hvor mange mL skal gives?",
    bullets: [
      "Når du har dosis (D) og styrke (S), kan du finde volumen (V).",
      "Formel: V = D / S.",
      "Enhedstjek: hvis S er mg/mL og D er mg → V bliver mL.",
    ],
    workedExamples: [
      {
        title: "Ketamin: 10 mg/mL — du skal give 35 mg",
        steps: ["V = D / S = 35 mg / (10 mg/mL) = 3,5 mL"],
      },
      {
        title: "Fentanyl: 50 ug/mL — du skal give 80 ug",
        steps: ["V = 80 / 50 = 1,6 mL"],
      },
    ],
  },

  {
    topic: "percentage",
    title: "Procent: glukose og NaCl",
    bullets: [
      "X% betyder X gram pr. 100 mL.",
      "10% = 10 g / 100 mL = 0,1 g/mL.",
      "50% glukose = 50 g / 100 mL = 0,5 g/mL.",
      "Brug proportionalitet: g = (X/100) × mL.",
    ],
    workedExamples: [
      {
        title: "Glukose 10%: hvor mange gram i 250 mL?",
        steps: ["10 g/100 mL → 250 mL = (10/100)×250 = 25 g"],
      },
      {
        title: "Glukose 50%: hvor mange gram i 20 mL?",
        steps: ["50 g/100 mL → 20 mL = (50/100)×20 = 10 g"],
      },
      {
        title: "NaCl 0,9%: hvor mange gram i 1000 mL?",
        steps: ["0,9 g/100 mL → 1000 mL = (0,9/100)×1000 = 9 g"],
      },
    ],
  },

  {
    topic: "conversion",
    title: "Enhedsomregning: mikrogram, milligram, gram og liter",
    bullets: [
      "1 g = 1000 mg, og 1 mg = 1000 ug.",
      "1 L = 1000 mL.",
      "Går du fra en stor enhed til en mindre, ganger du med 1000.",
      "Går du fra en lille enhed til en større, dividerer du med 1000.",
      "Skriv altid enheden ved hvert mellemtrin for at opdage fejl.",
    ],
    workedExamples: [
      {
        title: "0,25 mg til mikrogram",
        steps: ["0,25 × 1000 = 250 ug"],
      },
      {
        title: "750 mL til liter",
        steps: ["750 ÷ 1000 = 0,75 L"],
      },
    ],
  },

  {
    topic: "tablets",
    title: "Tabletter: ordineret dosis og tabletstyrke",
    bullets: [
      "Antal tabletter = ordineret dosis ÷ styrke pr. tablet.",
      "Kontrollér at dosis og tabletstyrke står i samme enhed.",
      "Del kun tabletter, når præparatet og lokale retningslinjer tillader det.",
    ],
    workedExamples: [
      {
        title: "Ordination 1000 mg, tabletter á 500 mg",
        steps: ["1000 ÷ 500 = 2 tabletter"],
      },
      {
        title: "Ordination 750 mg, tabletter á 500 mg",
        steps: ["750 ÷ 500 = 1,5 tablet"],
      },
    ],
  },

  {
    topic: "dilution",
    title: "Fortynding: find slutkoncentrationen",
    bullets: [
      "Ved en enkel fortynding ændres stofmængden ikke; kun totalvolumen ændres.",
      "Slutstyrke = samlet stofmængde ÷ samlet volumen.",
      "Medregn både lægemiddelvolumen og tilsat fortyndingsvæske.",
    ],
    workedExamples: [
      {
        title: "10 mg fortyndes til et totalvolumen på 20 mL",
        steps: ["10 mg ÷ 20 mL = 0,5 mg/mL"],
      },
      {
        title: "100 mg i et samlet volumen på 50 mL",
        steps: ["100 mg ÷ 50 mL = 2 mg/mL"],
      },
    ],
  },

  {
    topic: "drops",
    title: "Dr: omregning mellem dr/min og mL/time",
    bullets: [
      `Standard dråbesæt: ${DROPS_PER_ML} dr = 1 mL.`,
      "mL/min = dr/min ÷ (dr/mL).",
      "mL/time = (mL/min) × 60.",
      "Omvendt: dr/min = (mL/time ÷ 60) × (dr/mL).",
    ],
    workedExamples: [
      {
        title: `60 dr/min med ${DROPS_PER_ML} dr/mL — hvad er mL/time?`,
        steps: [
          `mL/min = 60 ÷ ${DROPS_PER_ML} = 3 mL/min`,
          "mL/time = 3 × 60 = 180 mL/time",
        ],
      },
      {
        title: "120 mL/time — hvad er dr/min?",
        steps: [
          "mL/min = 120 ÷ 60 = 2 mL/min",
          `dr/min = 2 × ${DROPS_PER_ML} = 40 dr/min`,
        ],
      },
    ],
  },

  {
    topic: "infusion",
    title: "Infusion: hastighed og blandinger",
    bullets: [
      "Infusionshastighed kan være mL/time, mg/time eller ug/min.",
      "Hvis du kender koncentrationen i posen (mg/mL), kan du konvertere mellem mL/time og mg/time.",
      "GTN bruges ofte i ug/min → kræver koncentration i mg/mL og enhedskonvertering.",
      "Husk: 1 mg = 1000 ug.",
    ],
    workedExamples: [
      {
        title: "GTN-blanding: 50 mg i 50 mL → hvilken styrke?",
        steps: ["S = 50 mg / 50 mL = 1 mg/mL (= 1000 ug/mL)"],
      },
      {
        title: "GTN: 20 ug/min med styrke 1000 ug/mL → hvor mange mL/time?",
        steps: [
          "S = 1000 ug/mL",
          "V (mL/min) = D/S = 20 / 1000 = 0,02 mL/min",
          "mL/time = 0,02 × 60 = 1,2 mL/time",
        ],
      },
    ],
  },

  {
    topic: "oxygen",
    title: "Iltbeholdning: teoretisk varighed",
    bullets: [
      "Tilgængelige liter ≈ flaskestørrelse (L) × tryk (bar).",
      "Varighed i minutter = tilgængelige liter ÷ flow (L/min).",
      "Resultatet er et træningsestimat. Reserve, regulator og lokale procedurer skal altid medregnes i praksis.",
    ],
    workedExamples: [
      {
        title: "2 L flaske ved 150 bar og flow 10 L/min",
        steps: ["2 × 150 = 300 L", "300 ÷ 10 = 30 minutter teoretisk"],
      },
    ],
  },

  {
    topic: "time",
    title: "Tid: hvor længe rækker en pose/sprøjte?",
    bullets: [
      "Tid = total volumen ÷ hastighed.",
      "Hvis hastighed er mL/time → tid i timer.",
      "Hvis hastighed er dr/min: konverter først til mL/time.",
    ],
    workedExamples: [
      {
        title: "250 mL pose løber med 125 mL/time — hvor længe?",
        steps: ["Tid = 250 / 125 = 2 timer"],
      },
      {
        title: `500 mL løber med 40 dr/min (${DROPS_PER_ML} dr/mL) — hvor længe?`,
        steps: [
          `mL/min = 40/${DROPS_PER_ML} = 2`,
          "mL/time = 2×60 = 120",
          "Tid = 500/120 = 4,17 timer ≈ 4 timer 10 min",
        ],
      },
    ],
  },
  {
    topic: "multiStep",
    title: "Flere trin: fra vægtbaseret dosis til volumen",
    bullets: [
      "Del opgaven op: beregn først total dosis, og beregn derefter volumen.",
      "Total dosis = dosis pr. kg × vægt.",
      "Volumen = total dosis ÷ styrke.",
      "Behold enheden ved hvert trin, og afrund først til sidst.",
    ],
    workedExamples: [
      {
        title: "0,5 mg/kg til 70 kg med en styrke på 10 mg/mL",
        steps: [
          "Total dosis = 0,5 mg/kg × 70 kg = 35 mg",
          "Volumen = 35 mg ÷ 10 mg/mL = 3,5 mL",
        ],
      },
    ],
  },
  {
    topic: "errorCheck",
    title: "Find regnefejlen med enhedstjek og plausibilitet",
    bullets: [
      "Læs først hvilken enhed svaret skal ende i.",
      "Kontrollér om omregningen skal gange eller dividere med 1000.",
      "Sæt resultatet tilbage i grundformlen for at kontrollere det.",
      "Et svar kan være matematisk pænt og stadig være usandsynligt.",
    ],
    workedExamples: [
      {
        title: "Fejl: 0,4 mg er skrevet som 40 ug",
        steps: [
          "1 mg = 1000 ug",
          "0,4 mg × 1000 = 400 ug",
          "40 ug er derfor en faktor 10 for lavt",
        ],
      },
    ],
  },
];

export const COMMON_PITFALLS = [
  "Bland ikke mg og mikrogram: 1 mg er 1000 ug.",
  "Behold kg i mellemregningen ved vægtbaseret dosis.",
  "mg/mL betyder stof pr. volumen; det er ikke det samme som mL/mg.",
  "Afrund først det afsluttende svar, medmindre opgaven siger andet.",
  "Dråber pr. minut er et praktisk estimat og ikke en eksakt pumpehastighed.",
  "Iltvarighed er et teoretisk estimat, ikke en garanti for faktisk driftstid.",
  "Kontrollér altid om størrelsesordenen og enheden virker plausible.",
] as const;

const FORMULA_BY_TOPIC: Record<DrugCalcTopic, string> = {
  strength: "Styrke = dosis ÷ volumen",
  dose: "Total dosis = dosis pr. kg × vægt",
  volume: "Volumen = dosis ÷ styrke",
  percentage: "Stofmængde = (procent ÷ 100) × volumen",
  conversion: "Stor til mindre enhed: × 1000. Mindre til større: ÷ 1000",
  tablets: "Antal tabletter = ordineret dosis ÷ styrke pr. tablet",
  dilution: "Slutstyrke = samlet stofmængde ÷ samlet volumen",
  drops: "dr/min = (mL/time ÷ 60) × dr/mL",
  infusion: "mL/time = (dosis pr. minut ÷ styrke) × 60",
  oxygen: "Varighed = (flaskestørrelse × tryk) ÷ flow",
  time: "Tid = resterende volumen ÷ hastighed",
  multiStep: "Total dosis = dosis pr. kg × vægt; volumen = dosis ÷ styrke",
  errorCheck: "Kontrollér enhederne og indsæt resultatet i grundformlen",
};

const PITFALL_BY_TOPIC: Record<DrugCalcTopic, string> = {
  strength: "At vende mg/mL om til mL/mg.",
  dose: "At glemme at gange dosis pr. kg med patientens vægt.",
  volume: "At gange med styrken, selv om volumen skal findes ved division.",
  percentage: "At læse procent som gram pr. mL i stedet for gram pr. 100 mL.",
  conversion: "At gange med 1000 i den forkerte retning.",
  tablets: "At bruge forskellige enheder for ordination og tabletstyrke.",
  dilution: "At bruge tilsat væske alene i stedet for det samlede slutvolumen.",
  drops: "At behandle dråber pr. minut som en helt eksakt hastighed.",
  infusion: "At glemme omregningen fra minutter til timer.",
  oxygen: "At opfatte den teoretiske varighed som en garanteret driftstid.",
  time: "At blande minutter og timer i samme beregning.",
  multiStep: "At springe direkte til volumen uden først at beregne total dosis.",
  errorCheck: "At acceptere et tal uden at kontrollere enhed og størrelsesorden.",
};

export const THEORY: TheorySection[] = THEORY_BASE.map((section) => ({
  ...section,
  workedExamples: section.workedExamples.map((example) => ({
    topic: section.topic,
    title: example.title,
    problem: example.title,
    formula: FORMULA_BY_TOPIC[section.topic],
    calculation: example.steps,
    finalAnswer: example.steps[example.steps.length - 1],
    commonPitfall: PITFALL_BY_TOPIC[section.topic],
  })),
}));

export const WORKED_EXAMPLES = THEORY.flatMap(
  (section) => section.workedExamples,
);

// -------------------- Questions --------------------

export type DrugCalcQuestion = {
  id: number;
  topic: DrugCalcTopic;
  text: string;
  correctAnswer: number;
  unit: string;
  hint?: string;
  explanation: string;
  formula: string;
  calculationSteps: string[];
  commonPitfall: string;
  plausibilityCheck: string;
  roundingNote: string;
  answerDecimals: number;
  tolerance: number;
};

type DrugCalcQuestionBase = Omit<
  DrugCalcQuestion,
  | "formula"
  | "calculationSteps"
  | "commonPitfall"
  | "plausibilityCheck"
  | "roundingNote"
  | "answerDecimals"
>;

let counter = 1;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function roundTo(n: number, decimals: number) {
  const p = Math.pow(10, decimals);
  return Math.round(n * p) / p;
}

/**
 * Drug answers use only the question's explicit absolute tolerance. We do not
 * infer whole-number rounding: that can accept materially different sub-unit
 * answers. Generated questions currently expect non-negative quantities.
 */
export function isDrugAnswerCorrect(user: number, correct: number, tol = 0.02) {
  if (
    !Number.isFinite(user) ||
    !Number.isFinite(correct) ||
    !Number.isFinite(tol) ||
    user < 0 ||
    correct < 0 ||
    tol < 0
  ) {
    return false;
  }

  const floatingPointMargin =
    Number.EPSILON * Math.max(1, Math.abs(user), Math.abs(correct)) * 4;
  return Math.abs(user - correct) <= tol + floatingPointMargin;
}

function generateBaseDrugCalcQuestion(
  selectedTopics: DrugCalcTopic[],
): DrugCalcQuestionBase {
  const topics =
    selectedTopics.length > 0 ? selectedTopics : DRUG_TOPICS.map((t) => t.id);
  const topic = pick(topics);

  // ---------- dose ----------
  if (topic === "dose") {
    const weight = randInt(50, 110);
    const which = pick(["fentanyl", "ketamine"] as const);

    if (which === "fentanyl") {
      const doseUgPerKg = pick([0.5, 1, 1.5, 2]);
      const total = doseUgPerKg * weight;

      return {
        id: counter++,
        topic,
        text: `I en teoretisk beregningsopgave er dosis ${doseUgPerKg} ug/kg ved en vægt på ${weight} kg.\nHvad er den beregnede totale dosis i ug?`,
        correctAnswer: total,
        unit: "ug",
        hint: "Total dosis = (ug/kg) × (kg).",
        explanation: `${doseUgPerKg} × ${weight} = ${total} ug`,
        tolerance: 0.01,
      };
    }

    const doseMgPerKg = pick([0.25, 0.5, 1, 2]);
    const totalMg = doseMgPerKg * weight;

    return {
      id: counter++,
      topic,
      text: `I en teoretisk beregningsopgave er dosis ${doseMgPerKg} mg/kg ved en vægt på ${weight} kg.\nHvad er den beregnede totale dosis i mg?`,
      correctAnswer: totalMg,
      unit: "mg",
      hint: "Total dosis = (mg/kg) × (kg).",
      explanation: `${doseMgPerKg} × ${weight} = ${totalMg} mg`,
      tolerance: 0.01,
    };
  }

  // ---------- strength ----------
  if (topic === "strength") {
    const which = pick(["gtnmix", "ketaminmix"] as const);

    if (which === "gtnmix") {
      const mg = pick([25, 50, 100]);
      const ml = pick([25, 50, 100]);
      const strength = mg / ml;

      return {
        id: counter++,
        topic,
        text: `En træningsblanding indeholder ${mg} mg i et totalvolumen på ${ml} mL.\nHvad er styrken i mg/mL?`,
        correctAnswer: strength,
        unit: "mg/mL",
        hint: "S = D / V.",
        explanation: `${mg} / ${ml} = ${roundTo(strength, 2)} mg/mL`,
        tolerance: 0.01,
      };
    }

    const mg = pick([100, 200, 500]);
    const ml = pick([10, 20, 50, 100]);
    const strength = mg / ml;

    return {
      id: counter++,
      topic,
      text: `En træningsblanding indeholder ${mg} mg i et totalvolumen på ${ml} mL.\nHvad er styrken i mg/mL?`,
      correctAnswer: strength,
      unit: "mg/mL",
      hint: "S = D / V.",
      explanation: `${mg} / ${ml} = ${roundTo(strength, 2)} mg/mL`,
      tolerance: 0.01,
    };
  }

  // ---------- volume ----------
  if (topic === "volume") {
    const which = pick(["fentanyl", "ketamine", "insulin"] as const);

    if (which === "fentanyl") {
      const strength = 50; // ug/mL
      const target = pick([25, 50, 75, 100, 125, 150]);
      const vol = target / strength;

      return {
        id: counter++,
        topic,
        text: `En opløsning har styrken ${strength} ug/mL. Den teoretisk beregnede dosis er ${target} ug.\nHvor mange mL svarer det til?`,
        correctAnswer: vol,
        unit: "mL",
        hint: "V = D / S.",
        explanation: `${target} / ${strength} = ${roundTo(vol, 2)} mL`,
        tolerance: 0.01,
      };
    }

    if (which === "ketamine") {
      const strength = pick([10, 20, 50]); // mg/mL
      const target = pick([10, 20, 25, 30, 35, 50, 75, 100]);
      const vol = target / strength;

      return {
        id: counter++,
        topic,
        text: `En opløsning har styrken ${strength} mg/mL. Den teoretisk beregnede dosis er ${target} mg.\nHvor mange mL svarer det til?`,
        correctAnswer: vol,
        unit: "mL",
        hint: "V = D / S.",
        explanation: `${target} / ${strength} = ${roundTo(vol, 2)} mL`,
        tolerance: 0.01,
      };
    }

    // insulin U-100 = 100 IE/mL
    const strength = 100;
    const target = pick([4, 6, 8, 10, 12, 14]);
    const vol = target / strength;

    return {
      id: counter++,
      topic,
      text: `En opløsning har styrken ${strength} IE/mL. Den teoretisk beregnede dosis er ${target} IE.\nHvor mange mL svarer det til?`,
      correctAnswer: vol,
      unit: "mL",
      hint: "V = D / S.",
      explanation: `${target} / ${strength} = ${roundTo(vol, 3)} mL`,
      tolerance: 0.001,
    };
  }

  // ---------- percentage ----------
  if (topic === "percentage") {
    const percent = pick([5, 10, 20, 50]);
    const vol = pick([10, 20, 50, 100, 250, 500]);
    const grams = (percent / 100) * vol; // g per 100 mL -> g in vol mL

    return {
      id: counter++,
      topic,
      text: `Du har glukose ${percent}%.\nHvor mange gram glukose er der i ${vol} mL?`,
      correctAnswer: grams,
      unit: "g",
      hint: "X% = X g pr. 100 mL. g = (X/100) × mL.",
      explanation: `(${percent}/100) × ${vol} = ${roundTo(grams, 2)} g`,
      tolerance: 0.01,
    };
  }

  // ---------- conversion ----------
  if (topic === "conversion") {
    const kind = pick(["mg_to_ug", "g_to_mg", "ml_to_l"] as const);

    if (kind === "mg_to_ug") {
      const mg = pick([0.1, 0.25, 0.5, 1.5, 2.5]);
      const ug = mg * 1000;
      return {
        id: counter++,
        topic,
        text: `Omregn ${mg} mg til mikrogram (ug).`,
        correctAnswer: ug,
        unit: "ug",
        hint: "1 mg = 1000 ug.",
        explanation: `${mg} × 1000 = ${ug} ug`,
        tolerance: 0.001,
      };
    }

    if (kind === "g_to_mg") {
      const grams = pick([0.5, 1, 1.5, 2, 5]);
      const mg = grams * 1000;
      return {
        id: counter++,
        topic,
        text: `Omregn ${grams} g til mg.`,
        correctAnswer: mg,
        unit: "mg",
        hint: "1 g = 1000 mg.",
        explanation: `${grams} × 1000 = ${mg} mg`,
        tolerance: 0.001,
      };
    }

    const ml = pick([250, 500, 750, 1000, 1500]);
    const liters = ml / 1000;
    return {
      id: counter++,
      topic,
      text: `Omregn ${ml} mL til liter.`,
      correctAnswer: liters,
      unit: "L",
      hint: "1000 mL = 1 L.",
      explanation: `${ml} ÷ 1000 = ${roundTo(liters, 2)} L`,
      tolerance: 0.001,
    };
  }

  // ---------- tablets ----------
  if (topic === "tablets") {
    const tabletStrength = pick([250, 500, 1000]);
    const tabletCount = pick([0.5, 1, 1.5, 2, 3]);
    const prescribedMg = tabletStrength * tabletCount;

    return {
      id: counter++,
      topic,
      text: `Ordination: ${prescribedMg} mg. Hver tablet indeholder ${tabletStrength} mg.\nHvor mange tabletter svarer det til?`,
      correctAnswer: tabletCount,
      unit: "tabletter",
      hint: "Antal tabletter = ordineret dosis ÷ styrke pr. tablet.",
      explanation: `${prescribedMg} ÷ ${tabletStrength} = ${tabletCount} tabletter`,
      tolerance: 0.01,
    };
  }

  // ---------- dilution ----------
  if (topic === "dilution") {
    const drugMg = pick([10, 20, 50, 100, 200]);
    const totalMl = pick([10, 20, 50, 100]);
    const finalStrength = drugMg / totalMl;

    return {
      id: counter++,
      topic,
      text: `${drugMg} mg lægemiddel fortyndes til et samlet volumen på ${totalMl} mL.\nHvad er slutstyrken?`,
      correctAnswer: finalStrength,
      unit: "mg/mL",
      hint: "Slutstyrke = samlet stofmængde ÷ samlet volumen.",
      explanation: `${drugMg} ÷ ${totalMl} = ${roundTo(finalStrength, 2)} mg/mL`,
      tolerance: 0.01,
    };
  }

  // ---------- drops ----------
  if (topic === "drops") {
    const which = pick(["to_mL_h", "to_dr_min"] as const);

    if (which === "to_mL_h") {
      const drMin = pick([20, 30, 40, 60, 80, 100]);
      const mlMin = drMin / DROPS_PER_ML;
      const mlH = mlMin * 60;

      return {
        id: counter++,
        topic,
        text: `Dropset = ${DROPS_PER_ML} dr/mL.\nInfusionen løber ${drMin} dr/min.\nHvad er hastigheden i mL/time?`,
        correctAnswer: mlH,
        unit: "mL/time",
        hint: `mL/min = dr/min ÷ ${DROPS_PER_ML}. mL/time = mL/min × 60.`,
        explanation: `${drMin}/${DROPS_PER_ML} = ${roundTo(
          mlMin,
          2,
        )} mL/min → ×60 = ${roundTo(mlH, 1)} mL/time`,
        tolerance: 0.01,
      };
    }

    const mlH = pick([60, 90, 120, 180, 240]);
    const drMin = (mlH / 60) * DROPS_PER_ML;

    return {
      id: counter++,
      topic,
      text: `Dropset = ${DROPS_PER_ML} dr/mL.\nDu vil give ${mlH} mL/time.\nHvor mange dr/min er det?`,
      correctAnswer: drMin,
      unit: "dr/min",
      hint: `dr/min = (mL/time ÷ 60) × ${DROPS_PER_ML}.`,
      explanation: `(${mlH}/60)×${DROPS_PER_ML} = ${roundTo(drMin, 1)} dr/min`,
      tolerance: 0.01,
    };
  }

  // ---------- infusion ----------
  if (topic === "infusion") {
    // GTN: 50mg/50mL => 1mg/mL => 1000ug/mL
    const ugMin = pick([5, 10, 15, 20, 30, 40]);
    const strengthUgMl = 1000;
    const mlMin = ugMin / strengthUgMl;
    const mlH = mlMin * 60;

    return {
      id: counter++,
      topic,
      text: `En træningsblanding indeholder 50 mg i 50 mL (≈ ${strengthUgMl} ug/mL). Den teoretiske dosisrate er ${ugMin} ug/min.\nHvad er hastigheden i mL/time?`,
      correctAnswer: mlH,
      unit: "mL/time",
      hint: "V = D/S (i mL/min), gang derefter med 60.",
      explanation: `${ugMin}/${strengthUgMl} = ${roundTo(
        mlMin,
        3,
      )} mL/min → ×60 = ${roundTo(mlH, 2)} mL/time`,
      tolerance: 0.01,
    };
  }

  // ---------- oxygen ----------
  if (topic === "oxygen") {
    const cylinderLiters = pick([2, 3, 5, 10]);
    const pressureBar = pick([100, 120, 150, 180, 200]);
    const flowLitersPerMinute = pick([5, 10, 15]);
    const durationMinutes =
      (cylinderLiters * pressureBar) / flowLitersPerMinute;

    return {
      id: counter++,
      topic,
      text: `En ${cylinderLiters} L iltflaske viser ${pressureBar} bar. Flowet er ${flowLitersPerMinute} L/min.\nHvor mange minutter rækker flasken teoretisk?`,
      correctAnswer: durationMinutes,
      unit: "minutter",
      hint: "Varighed = (flaskestørrelse × tryk) ÷ flow.",
      explanation: `(${cylinderLiters} × ${pressureBar}) ÷ ${flowLitersPerMinute} = ${roundTo(durationMinutes, 1)} minutter. Husk reserve og lokale procedurer i praksis.`,
      tolerance: 0.05,
    };
  }

  // ---------- multi-step dose to volume ----------
  if (topic === "multiStep") {
    const weight = pick([50, 60, 70, 80, 90, 100]);
    const doseMgPerKg = pick([0.1, 0.2, 0.5, 1]);
    const strengthMgMl = pick([5, 10, 20]);
    const totalDoseMg = doseMgPerKg * weight;
    const volumeMl = totalDoseMg / strengthMgMl;

    return {
      id: counter++,
      topic,
      text: `En teoretisk beregnet dosis er ${doseMgPerKg} mg/kg til en person på ${weight} kg. Styrken er ${strengthMgMl} mg/mL.\nHvor mange mL svarer den beregnede dosis til?`,
      correctAnswer: volumeMl,
      unit: "mL",
      hint: "Beregn først total dosis i mg. Brug derefter V = D / S.",
      explanation: `${doseMgPerKg} × ${weight} = ${roundTo(totalDoseMg, 2)} mg. ${roundTo(totalDoseMg, 2)} ÷ ${strengthMgMl} = ${roundTo(volumeMl, 2)} mL.`,
      tolerance: 0.01,
    };
  }

  // ---------- error detection ----------
  if (topic === "errorCheck") {
    const kind = pick(["conversion", "concentration"] as const);

    if (kind === "conversion") {
      const mg = pick([0.2, 0.4, 0.5, 1.5]);
      const incorrectUg = mg * 100;
      const correctUg = mg * 1000;
      return {
        id: counter++,
        topic,
        text: `En beregning siger: ${mg} mg = ${incorrectUg} ug.\nHvad er den korrekte omregning i ug?`,
        correctAnswer: correctUg,
        unit: "ug",
        hint: "Kontrollér omregningsfaktoren mellem mg og ug.",
        explanation: `1 mg = 1000 ug, så ${mg} × 1000 = ${correctUg} ug. Det viste svar er en faktor 10 for lavt.`,
        tolerance: 0.001,
      };
    }

    const doseMg = pick([50, 100, 200]);
    const volumeMl = pick([10, 20, 50]);
    const correctStrength = doseMg / volumeMl;
    const incorrectStrength = volumeMl / doseMg;
    return {
      id: counter++,
      topic,
      text: `En blanding indeholder ${doseMg} mg i ${volumeMl} mL. En beregning angiver styrken som ${roundTo(incorrectStrength, 2)} mg/mL.\nHvad er den korrekte styrke?`,
      correctAnswer: correctStrength,
      unit: "mg/mL",
      hint: "Styrke er stofmængde divideret med volumen.",
      explanation: `${doseMg} ÷ ${volumeMl} = ${roundTo(correctStrength, 2)} mg/mL. Den viste beregning har vendt brøken om.`,
      tolerance: 0.01,
    };
  }

  // ---------- time ----------
  const totalMl = pick([50, 100, 250, 500, 1000]);
  const rateMlH = pick([25, 50, 75, 100, 125, 150, 200]);
  const hours = totalMl / rateMlH;

  return {
    id: counter++,
    topic: "time",
    text: `En infusion har ${totalMl} mL tilbage.\nDen løber med ${rateMlH} mL/time.\nHvor mange timer varer det?`,
    correctAnswer: hours,
    unit: "timer",
    hint: "Tid = volumen ÷ hastighed.",
    explanation: `${totalMl}/${rateMlH} = ${roundTo(hours, 2)} timer`,
    tolerance: 0.005,
  };
}

const PLAUSIBILITY_BY_TOPIC: Record<DrugCalcTopic, string> = {
  strength: "Gang svaret med volumen; du bør få den oprindelige stofmængde.",
  dose: "En større vægt skal give en større total dosis ved samme dosis pr. kg.",
  volume: "Gang volumen med styrken; resultatet bør være den ønskede dosis.",
  percentage: "Resultatet skal passe med antal gram pr. 100 mL og det valgte volumen.",
  conversion: "Kontrollér om tallet bør blive større eller mindre, når enheden ændres.",
  tablets: "Gang antal tabletter med styrken pr. tablet og sammenlign med ordinationen.",
  dilution: "Gang slutstyrken med totalvolumen; stofmængden skal være uændret.",
  drops: "Sammenlign med mL/time og husk, at dråber er et praktisk estimat.",
  infusion: "Gang mL/time med styrken og omregn tiden tilbage for at kontrollere dosisraten.",
  oxygen: "Kortere varighed forventes ved højere flow; beregningen er kun et teoretisk estimat.",
  time: "Højere hastighed skal give kortere resterende tid.",
  multiStep: "Gang slutvolumen med styrken; du bør få den beregnede totale dosis.",
  errorCheck: "Indsæt det korrigerede svar i grundformlen og kontrollér størrelsesordenen.",
};

function getAnswerDecimals(question: DrugCalcQuestionBase) {
  if (question.topic === "drops") return 0;
  if (question.topic === "oxygen") return 1;
  if (question.topic === "time") return 2;
  if (question.topic === "tablets") return 1;
  if (question.topic === "dose") {
    if (Number.isInteger(question.correctAnswer)) return 0;
    return Number.isInteger(question.correctAnswer * 10) ? 1 : 2;
  }
  if (question.topic === "conversion" || question.topic === "errorCheck") {
    return Number.isInteger(question.correctAnswer) ? 0 : 2;
  }
  if (question.topic === "volume" && question.correctAnswer < 0.2) return 3;
  return 2;
}

function getRoundingNote(answerDecimals: number) {
  if (answerDecimals === 0) {
    return "Angiv svaret som et helt tal. Afrund først efter hele beregningen.";
  }
  const decimalLabel = answerDecimals === 1 ? "én decimal" : `${answerDecimals} decimaler`;
  return `Angiv svaret med ${decimalLabel}. Afrund først efter hele beregningen.`;
}

export function formatDrugAnswer(question: DrugCalcQuestion) {
  return question.correctAnswer
    .toFixed(question.answerDecimals)
    .replace(".", ",");
}

export function generateDrugCalcQuestion(
  selectedTopics: DrugCalcTopic[],
): DrugCalcQuestion {
  const question = generateBaseDrugCalcQuestion(selectedTopics);
  const answerDecimals = getAnswerDecimals(question);
  const calculationSteps = question.explanation
    .split(" → ")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    ...question,
    formula: FORMULA_BY_TOPIC[question.topic],
    calculationSteps,
    commonPitfall: PITFALL_BY_TOPIC[question.topic],
    plausibilityCheck: PLAUSIBILITY_BY_TOPIC[question.topic],
    roundingNote: getRoundingNote(answerDecimals),
    answerDecimals,
  };
}
