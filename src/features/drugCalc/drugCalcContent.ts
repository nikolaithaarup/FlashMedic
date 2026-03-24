// src/features/drugCalc/drugCalcContent.ts

export type DrugCalcTopic =
  | "strength"
  | "dose"
  | "volume"
  | "percentage"
  | "drops"
  | "infusion"
  | "time";

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
      id: "drops",
      title: "Dråber (dr/min, dr/mL)",
      desc: `Dropset: ${DROPS_PER_ML} dr pr. mL.`,
    },
    {
      id: "infusion",
      title: "Infusion (mL/t, mg/t, ug/min)",
      desc: "Hastigheder, blandinger, run-rate.",
    },
    {
      id: "time",
      title: "Tid (hvor længe rækker det?)",
      desc: "Tid ud fra volumen og hastighed.",
    },
  ];

// -------------------- Theory --------------------

export type TheorySection = {
  topic: DrugCalcTopic;
  title: string;
  bullets: string[];
  workedExamples: { title: string; steps: string[] }[];
};

export const THEORY: TheorySection[] = [
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
    topic: "drops",
    title: "Dr: omregning mellem dr/min og mL/time",
    bullets: [
      `Standard dropset: ${DROPS_PER_ML} dr = 1 mL.`,
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
];

// -------------------- Questions --------------------

export type DrugCalcQuestion = {
  id: number;
  topic: DrugCalcTopic;
  text: string;
  correctAnswer: number;
  unit: string;
  hint?: string;
  explanation?: string; // shown after answer
  tolerance?: number; // absolute tolerance (e.g. 0.05)
};

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

export function isDrugAnswerCorrect(user: number, correct: number, tol = 0.02) {
  const diff = Math.abs(user - correct);
  if (diff <= tol) return true;

  // If user rounds differently (common in practice)
  if (Math.round(user) === Math.round(correct)) return true;

  return false;
}

export function generateDrugCalcQuestion(
  selectedTopics: DrugCalcTopic[],
): DrugCalcQuestion {
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
        text: `Fentanyl ordineres ${doseUgPerKg} ug/kg.\nPatienten vejer ${weight} kg.\nHvad er total dosis i ug?`,
        correctAnswer: total,
        unit: "ug",
        hint: "Total dosis = (ug/kg) × (kg).",
        explanation: `${doseUgPerKg} × ${weight} = ${total} ug`,
        tolerance: 0.5,
      };
    }

    const doseMgPerKg = pick([0.25, 0.5, 1, 2]);
    const totalMg = doseMgPerKg * weight;

    return {
      id: counter++,
      topic,
      text: `Ketamin ordineres ${doseMgPerKg} mg/kg.\nPatienten vejer ${weight} kg.\nHvad er total dosis i mg?`,
      correctAnswer: totalMg,
      unit: "mg",
      hint: "Total dosis = (mg/kg) × (kg).",
      explanation: `${doseMgPerKg} × ${weight} = ${totalMg} mg`,
      tolerance: 0.2,
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
        text: `Du blander GTN: ${mg} mg i ${ml} mL.\nHvad er styrken i mg/mL?`,
        correctAnswer: strength,
        unit: "mg/mL",
        hint: "S = D / V.",
        explanation: `${mg} / ${ml} = ${roundTo(strength, 2)} mg/mL`,
        tolerance: 0.02,
      };
    }

    const mg = pick([100, 200, 500]);
    const ml = pick([10, 20, 50, 100]);
    const strength = mg / ml;

    return {
      id: counter++,
      topic,
      text: `Ketamin-blanding: ${mg} mg i ${ml} mL.\nHvad er styrken i mg/mL?`,
      correctAnswer: strength,
      unit: "mg/mL",
      hint: "S = D / V.",
      explanation: `${mg} / ${ml} = ${roundTo(strength, 2)} mg/mL`,
      tolerance: 0.02,
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
        text: `Fentanyl: ${strength} ug/mL.\nDu skal give ${target} ug.\nHvor mange mL skal du give?`,
        correctAnswer: vol,
        unit: "mL",
        hint: "V = D / S.",
        explanation: `${target} / ${strength} = ${roundTo(vol, 2)} mL`,
        tolerance: 0.05,
      };
    }

    if (which === "ketamine") {
      const strength = pick([10, 20, 50]); // mg/mL
      const target = pick([10, 20, 25, 30, 35, 50, 75, 100]);
      const vol = target / strength;

      return {
        id: counter++,
        topic,
        text: `Ketamin: ${strength} mg/mL.\nDu skal give ${target} mg.\nHvor mange mL skal du give?`,
        correctAnswer: vol,
        unit: "mL",
        hint: "V = D / S.",
        explanation: `${target} / ${strength} = ${roundTo(vol, 2)} mL`,
        tolerance: 0.05,
      };
    }

    // insulin U-100 = 100 IE/mL
    const strength = 100;
    const target = pick([4, 6, 8, 10, 12, 14]);
    const vol = target / strength;

    return {
      id: counter++,
      topic,
      text: `Insulin (U-100): ${strength} IE/mL.\nDu skal give ${target} IE.\nHvor mange mL er det?`,
      correctAnswer: vol,
      unit: "mL",
      hint: "V = D / S.",
      explanation: `${target} / ${strength} = ${roundTo(vol, 3)} mL`,
      tolerance: 0.01,
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
      tolerance: 0.05,
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
        tolerance: 0.2,
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
      tolerance: 0.5,
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
      text: `GTN-blanding: 50 mg i 50 mL (≈ ${strengthUgMl} ug/mL).\nOrdineret ${ugMin} ug/min.\nHvad er hastigheden i mL/time?`,
      correctAnswer: mlH,
      unit: "mL/time",
      hint: "V = D/S (i mL/min), gang derefter med 60.",
      explanation: `${ugMin}/${strengthUgMl} = ${roundTo(
        mlMin,
        3,
      )} mL/min → ×60 = ${roundTo(mlH, 2)} mL/time`,
      tolerance: 0.05,
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
    tolerance: 0.05,
  };
}
