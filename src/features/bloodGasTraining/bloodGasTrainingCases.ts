import { bloodGasPatternExamples } from "./bloodGasTheoryContent";

export type BloodGasValueDirection =
  | "low"
  | "reference"
  | "high"
  | "uncertain"
  | "not-assessed";

export type BloodGasPhStatus =
  | "acidaemia"
  | "reference"
  | "alkalaemia"
  | "uncertain";

export type BloodGasPrimaryProcess =
  | "metabolic"
  | "respiratory"
  | "mixed"
  | "uncertain"
  | "insufficient-information";

export type BloodGasPatternId =
  | "normalish"
  | "primary-metabolic-acidosis"
  | "respiratory-acidosis"
  | "respiratory-alkalosis"
  | "hyperglycaemia-metabolic-acidosis"
  | "hypoperfusion-elevated-lactate"
  | "inflammation-elevated-crp"
  | "renal-electrolyte-disturbance"
  | "mixed-or-uncertain";

export type BloodGasTrainingValue = {
  analyteId: string;
  label: string;
  value: string;
  unit: string;
  direction: BloodGasValueDirection;
  note?: string;
};

export type BloodGasTrainingCase = {
  id: string;
  title: string;
  level: "intro" | "intermediate" | "advanced";
  sampleType: "venous";
  clinicalContext: string;
  values: BloodGasTrainingValue[];
  expected: {
    valueDirections: Record<string, BloodGasValueDirection>;
    phStatus: BloodGasPhStatus;
    primaryProcess: BloodGasPrimaryProcess;
    patternId: BloodGasPatternId;
    supportingAbnormalities: string[];
  };
  acceptedAlternatives?: {
    phStatus?: BloodGasPhStatus[];
    primaryProcess?: BloodGasPrimaryProcess[];
    patternId?: BloodGasPatternId[];
  };
  reasoning: string[];
  keyAbnormalities: string[];
  commonPitfall: string;
  prehospitalRelevance: string;
  limitation: string;
};

export const valueDirectionOptions: { id: BloodGasValueDirection; label: string }[] = [
  { id: "low", label: "Lav" },
  { id: "reference", label: "Ref." },
  { id: "high", label: "Høj" },
  { id: "uncertain", label: "Usikker" },
];

export const phStatusOptions: { id: BloodGasPhStatus; label: string }[] = [
  { id: "acidaemia", label: "Acidæmi" },
  { id: "reference", label: "Forventet område" },
  { id: "alkalaemia", label: "Alkalæmi" },
  { id: "uncertain", label: "Usikker" },
];

export const primaryProcessOptions: { id: BloodGasPrimaryProcess; label: string }[] = [
  { id: "metabolic", label: "Overvejende metabolisk" },
  { id: "respiratory", label: "Overvejende respiratorisk" },
  { id: "mixed", label: "Blandet" },
  { id: "insufficient-information", label: "Usikker / ikke nok information" },
];

export const patternOptions: { id: BloodGasPatternId; label: string }[] = [
  { id: "normalish", label: "Ingen tydelig hovedafvigelse" },
  { id: "primary-metabolic-acidosis", label: "Primær metabolisk acidose" },
  { id: "respiratory-acidosis", label: "Respiratorisk acidose" },
  { id: "respiratory-alkalosis", label: "Respiratorisk alkalose" },
  { id: "hyperglycaemia-metabolic-acidosis", label: "Svær hyperglykæmi + metabolisk acidose" },
  { id: "hypoperfusion-elevated-lactate", label: "Forhøjet laktat / mulig fysiologisk belastning" },
  { id: "inflammation-elevated-crp", label: "Forhøjet CRP / inflammationsmønster" },
  { id: "renal-electrolyte-disturbance", label: "Nyrepåvirkning / elektrolytforstyrrelse" },
  { id: "mixed-or-uncertain", label: "Blandet eller usikkert mønster" },
];

const exampleById = new Map(bloodGasPatternExamples.map((example) => [example.id, example]));

function createCase(
  exampleId: string,
  level: BloodGasTrainingCase["level"],
  phStatus: BloodGasPhStatus,
  primaryProcess: BloodGasPrimaryProcess,
  patternId: BloodGasPatternId,
): BloodGasTrainingCase {
  const example = exampleById.get(exampleId);
  if (!example) throw new Error(`Missing blood-gas example: ${exampleId}`);
  const values = example.values.map((value) => ({ ...value }));
  return {
    id: `trainer-${exampleId}`,
    title: example.title,
    level,
    sampleType: "venous",
    clinicalContext: example.clinicalContext,
    values,
    expected: {
      valueDirections: Object.fromEntries(
        values.map((value) => [value.analyteId, value.direction]),
      ),
      phStatus,
      primaryProcess,
      patternId,
      supportingAbnormalities: example.reasoning,
    },
    reasoning: example.reasoning,
    keyAbnormalities: values.some(
      (value) => value.direction === "low" || value.direction === "high",
    )
      ? values
          .filter((value) => value.direction === "low" || value.direction === "high")
          .map((value) => `${value.label}: ${value.value} ${value.unit}`)
      : ["De viste værdier er inden for forventet område"],
    commonPitfall: example.commonPitfall,
    prehospitalRelevance: example.prehospitalRelevance,
    limitation: example.limitation,
  };
}

function createTrainingCase(
  trainingCase: Omit<BloodGasTrainingCase, "sampleType" | "expected" | "keyAbnormalities"> & {
    phStatus: BloodGasPhStatus;
    primaryProcess: BloodGasPrimaryProcess;
    patternId: BloodGasPatternId;
    supportingAbnormalities: string[];
  },
): BloodGasTrainingCase {
  const {
    phStatus,
    primaryProcess,
    patternId,
    supportingAbnormalities,
    ...content
  } = trainingCase;
  const abnormalValues = content.values.filter(
    (value) => value.direction === "low" || value.direction === "high",
  );
  return {
    ...content,
    sampleType: "venous",
    expected: {
      valueDirections: Object.fromEntries(
        content.values.map((value) => [value.analyteId, value.direction]),
      ),
      phStatus,
      primaryProcess,
      patternId,
      supportingAbnormalities,
    },
    keyAbnormalities: abnormalValues.length
      ? abnormalValues.map((value) => `${value.label}: ${value.value} ${value.unit}`)
      : ["De viste værdier er inden for forventet område"],
  };
}

export const bloodGasTrainingCases: BloodGasTrainingCase[] = [
  createCase("normal-ish", "intro", "reference", "insufficient-information", "normalish"),
  createCase("metabolic-acidosis", "intro", "acidaemia", "metabolic", "primary-metabolic-acidosis"),
  createCase("respiratory-acidosis", "intermediate", "acidaemia", "respiratory", "respiratory-acidosis"),
  createCase("respiratory-alkalosis", "intermediate", "alkalaemia", "respiratory", "respiratory-alkalosis"),
  createCase("hyperglycaemic-acidosis", "intermediate", "acidaemia", "metabolic", "hyperglycaemia-metabolic-acidosis"),
  createCase("hypoperfusion-lactate", "intermediate", "acidaemia", "metabolic", "hypoperfusion-elevated-lactate"),
  createCase("inflammation-crp", "intro", "reference", "insufficient-information", "inflammation-elevated-crp"),
  createCase("renal-electrolyte", "advanced", "acidaemia", "metabolic", "renal-electrolyte-disturbance"),
  createTrainingCase({
    id: "trainer-metabolic-acidosis-compensating",
    title: "Metabolisk acidose med respiratorisk kompensation",
    level: "intermediate",
    clinicalContext: "Venøs prøve med acidæmi og lav bicarbonat hos en påvirket patient.",
    values: [
      { analyteId: "ph", label: "pH", value: "7,26", unit: "uden enhed", direction: "low" },
      { analyteId: "pco2", label: "pCO₂", value: "3,8", unit: "kPa", direction: "low" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "15", unit: "mmol/L", direction: "low" },
      { analyteId: "be", label: "BE", value: "-11", unit: "mmol/L", direction: "low" },
      { analyteId: "lactate", label: "Lactate", value: "1,7", unit: "mmol/L", direction: "reference" },
    ],
    phStatus: "acidaemia",
    primaryProcess: "metabolic",
    patternId: "primary-metabolic-acidosis",
    supportingAbnormalities: ["Lav pH, HCO₃⁻ og BE peger metabolisk.", "Lav pCO₂ kan være kompensation."],
    reasoning: ["Syrepåvirkningen er overvejende metabolisk.", "Den lave pCO₂ skal ikke automatisk tolkes som hovedproblemet."],
    commonPitfall: "At kalde lav pCO₂ en selvstændig respiratorisk alkalose.",
    prehospitalRelevance: "Se tallene sammen med respiration, perfusion og udvikling.",
    limitation: "Kompensationens tilstrækkelighed kan ikke afgøres sikkert her.",
  }),
  createTrainingCase({
    id: "trainer-respiratory-acidosis-compensated",
    title: "Respiratorisk acidose med mulig kompensation",
    level: "advanced",
    clinicalContext: "Venøs prøve med høj pCO₂ og pH tæt på forventet område.",
    values: [
      { analyteId: "ph", label: "pH", value: "7,34", unit: "uden enhed", direction: "uncertain", note: "Tæt på referencegrænsen; brug apparatets område." },
      { analyteId: "pco2", label: "pCO₂", value: "7,6", unit: "kPa", direction: "high" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "30", unit: "mmol/L", direction: "high" },
      { analyteId: "be", label: "BE", value: "+4", unit: "mmol/L", direction: "high" },
    ],
    phStatus: "reference",
    primaryProcess: "respiratory",
    patternId: "respiratory-acidosis",
    supportingAbnormalities: ["pCO₂ er forhøjet.", "Høj HCO₃⁻ og BE kan passe med kompensation."],
    acceptedAlternatives: { phStatus: ["uncertain"], primaryProcess: ["mixed"] },
    reasoning: ["Det respiratoriske bidrag er tydeligt.", "Nær-normal pH og høj HCO₃⁻ kan afspejle kompensation."],
    commonPitfall: "At afgøre varighed eller kronisk tilstand ud fra én venøs prøve.",
    prehospitalRelevance: "Vurder ventilation, bevidsthed og ændring over tid.",
    limitation: "VGAS alene kan ikke fastslå varighed eller kronisk niveau.",
  }),
  createTrainingCase({
    id: "trainer-mild-respiratory-alkalosis",
    title: "Let respiratorisk alkalose",
    level: "intermediate",
    clinicalContext: "Venøs prøve med let alkalæmi og lav pCO₂.",
    values: [
      { analyteId: "ph", label: "pH", value: "7,46", unit: "uden enhed", direction: "high" },
      { analyteId: "pco2", label: "pCO₂", value: "3,9", unit: "kPa", direction: "low" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "22", unit: "mmol/L", direction: "uncertain" },
      { analyteId: "be", label: "BE", value: "-1", unit: "mmol/L", direction: "reference" },
    ],
    phStatus: "alkalaemia",
    primaryProcess: "respiratory",
    patternId: "respiratory-alkalosis",
    supportingAbnormalities: ["pH er let forhøjet.", "Lav pCO₂ peger respiratorisk."],
    reasoning: ["Den lave pCO₂ passer med den alkalotiske retning.", "Afvigelsen er beskeden og skal ses med patienten."],
    commonPitfall: "At overvurdere sværhedsgraden ud fra en lille afvigelse.",
    prehospitalRelevance: "Sammenhold med respirationsmønster, smerter, temperatur og kredsløb.",
    limitation: "En enkelt prøve forklarer ikke årsagen til den øgede ventilation.",
  }),
  createTrainingCase({
    id: "trainer-lactate-near-reference-ph",
    title: "Forhøjet laktat uden svær acidæmi",
    level: "intermediate",
    clinicalContext: "Venøs prøve med forhøjet laktat, men pH tæt på forventet område.",
    values: [
      { analyteId: "lactate", label: "Lactate", value: "4,2", unit: "mmol/L", direction: "high" },
      { analyteId: "ph", label: "pH", value: "7,35", unit: "uden enhed", direction: "reference" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "21", unit: "mmol/L", direction: "uncertain" },
      { analyteId: "be", label: "BE", value: "-4", unit: "mmol/L", direction: "low" },
      { analyteId: "pco2", label: "pCO₂", value: "4,9", unit: "kPa", direction: "uncertain" },
    ],
    phStatus: "reference",
    primaryProcess: "metabolic",
    patternId: "hypoperfusion-elevated-lactate",
    supportingAbnormalities: ["Laktat er forhøjet.", "BE er let negativ trods pH i forventet område."],
    acceptedAlternatives: { phStatus: ["uncertain"], patternId: ["mixed-or-uncertain"] },
    reasoning: ["Laktat kan stige før tydelig acidæmi.", "Fundet er uspecifikt og skal ses som trend."],
    commonPitfall: "At lade en pH i forventet område skjule det forhøjede laktat.",
    prehospitalRelevance: "Vurder perfusion, belastning, prøvetidspunkt og udvikling.",
    limitation: "Forhøjet laktat beviser ikke shock eller sepsis.",
  }),
  createTrainingCase({
    id: "trainer-hyperglycaemia-without-acidosis",
    title: "Hyperglykæmi uden tydelig acidose",
    level: "intro",
    clinicalContext: "Venøs prøve med forhøjet glukose og ellers upåfaldende syre-base-værdier.",
    values: [
      { analyteId: "glucose", label: "Glucose", value: "19", unit: "mmol/L", direction: "high" },
      { analyteId: "ph", label: "pH", value: "7,38", unit: "uden enhed", direction: "reference" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "24", unit: "mmol/L", direction: "reference" },
      { analyteId: "be", label: "BE", value: "0", unit: "mmol/L", direction: "reference" },
      { analyteId: "lactate", label: "Lactate", value: "1,5", unit: "mmol/L", direction: "reference" },
    ],
    phStatus: "reference",
    primaryProcess: "insufficient-information",
    patternId: "mixed-or-uncertain",
    supportingAbnormalities: ["Glukose er forhøjet.", "Der ses ikke et tydeligt metabolisk acidosemønster."],
    reasoning: ["Hyperglykæmi er hovedfundet.", "Tallene understøtter ikke acidose i denne prøve."],
    commonPitfall: "At antage at al hyperglykæmi ledsages af metabolisk acidose.",
    prehospitalRelevance: "Se glukose sammen med symptomer, væskestatus og udvikling.",
    limitation: "Prøven udelukker ikke anden metabolisk sygdom eller senere udvikling.",
  }),
  createTrainingCase({
    id: "trainer-crp-isolated",
    title: "Forhøjet CRP med upåfaldende VGAS",
    level: "intro",
    clinicalContext: "Forhøjet CRP uden tydelig syre-base- eller laktatpåvirkning.",
    values: [
      { analyteId: "crp", label: "CRP", value: "96", unit: "mg/L", direction: "high" },
      { analyteId: "ph", label: "pH", value: "7,39", unit: "uden enhed", direction: "reference" },
      { analyteId: "pco2", label: "pCO₂", value: "5,5", unit: "kPa", direction: "reference" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "25", unit: "mmol/L", direction: "reference" },
      { analyteId: "be", label: "BE", value: "+1", unit: "mmol/L", direction: "reference" },
      { analyteId: "lactate", label: "Lactate", value: "1,4", unit: "mmol/L", direction: "reference" },
    ],
    phStatus: "reference",
    primaryProcess: "insufficient-information",
    patternId: "inflammation-elevated-crp",
    supportingAbnormalities: ["CRP er forhøjet.", "De øvrige viste værdier er bredt upåfaldende."],
    acceptedAlternatives: { patternId: ["mixed-or-uncertain"] },
    reasoning: ["CRP kan passe med inflammation.", "CRP forklarer ikke alene patientens aktuelle fysiologi."],
    commonPitfall: "At bruge CRP som bevis for bakteriel infektion eller akut sværhedsgrad.",
    prehospitalRelevance: "Overlever CRP sammen med fokus, vitalparametre og tidsforløb.",
    limitation: "CRP er uspecifik og ændrer sig over tid.",
  }),
  createTrainingCase({
    id: "trainer-hyponatraemia",
    title: "Hyponatriæmi uden syre-base-forstyrrelse",
    level: "intermediate",
    clinicalContext: "Venøs prøve med lav natrium og ellers upåfaldende syre-base-værdier.",
    values: [
      { analyteId: "sodium", label: "Na⁺", value: "124", unit: "mmol/L", direction: "low" },
      { analyteId: "glucose", label: "Glucose", value: "5,8", unit: "mmol/L", direction: "reference" },
      { analyteId: "ph", label: "pH", value: "7,37", unit: "uden enhed", direction: "reference" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "24", unit: "mmol/L", direction: "reference" },
      { analyteId: "be", label: "BE", value: "-1", unit: "mmol/L", direction: "reference" },
    ],
    phStatus: "reference",
    primaryProcess: "insufficient-information",
    patternId: "renal-electrolyte-disturbance",
    supportingAbnormalities: ["Natrium er lavt.", "Der ses ikke en tydelig syre-base-forstyrrelse."],
    reasoning: ["Elektrolytafvigelsen er hovedfundet.", "Årsag og varighed fremgår ikke af prøven."],
    commonPitfall: "At overse natrium, fordi pH og bicarbonat er upåfaldende.",
    prehospitalRelevance: "Se natrium sammen med neurologiske symptomer, væskestatus og udvikling.",
    limitation: "En enkelt værdi viser ikke ændringshastighed eller årsag.",
  }),
  createTrainingCase({
    id: "trainer-renal-hyperkalaemia-mild-acidosis",
    title: "Nyrepåvirkning med hyperkaliæmi",
    level: "advanced",
    clinicalContext: "Venøs prøve med påvirkede nyretal, forhøjet kalium og let syrepåvirkning.",
    values: [
      { analyteId: "potassium", label: "K⁺", value: "6,4", unit: "mmol/L", direction: "high", note: "Prøvekvalitet og EKG skal altid med i vurderingen." },
      { analyteId: "creatinine", label: "Creatinine", value: "410", unit: "µmol/L", direction: "high" },
      { analyteId: "urea", label: "Urea", value: "25", unit: "mmol/L", direction: "high" },
      { analyteId: "ph", label: "pH", value: "7,31", unit: "uden enhed", direction: "low" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "19", unit: "mmol/L", direction: "low" },
      { analyteId: "be", label: "BE", value: "-6", unit: "mmol/L", direction: "low" },
    ],
    phStatus: "acidaemia",
    primaryProcess: "metabolic",
    patternId: "renal-electrolyte-disturbance",
    supportingAbnormalities: ["Kalium og nyretal er forhøjede.", "pH, HCO₃⁻ og BE viser metabolisk syrepåvirkning."],
    reasoning: ["Mønstret passer med renal og elektrolytmæssig påvirkning.", "Akut versus kronisk kan ikke afgøres her."],
    commonPitfall: "At overse prøvekvalitet, EKG eller ukendt baseline.",
    prehospitalRelevance: "Overlever værdier, prøvekvalitet, EKG-fund og kendt nyrehistorik.",
    limitation: "Én prøve fastslår ikke årsag eller varighed.",
  }),
  createTrainingCase({
    id: "trainer-borderline-values",
    title: "Grænseværdier uden klart hovedmønster",
    level: "intermediate",
    clinicalContext: "Flere værdier ligger tæt på apparatets referencegrænser.",
    values: [
      { analyteId: "ph", label: "pH", value: "7,35", unit: "uden enhed", direction: "uncertain" },
      { analyteId: "pco2", label: "pCO₂", value: "6,1", unit: "kPa", direction: "uncertain" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "25", unit: "mmol/L", direction: "reference" },
      { analyteId: "be", label: "BE", value: "-2", unit: "mmol/L", direction: "uncertain" },
      { analyteId: "lactate", label: "Lactate", value: "2,0", unit: "mmol/L", direction: "uncertain" },
    ],
    phStatus: "reference",
    primaryProcess: "insufficient-information",
    patternId: "normalish",
    supportingAbnormalities: ["Værdierne ligger omkring referencegrænserne.", "Ingen enkelt retning dominerer."],
    acceptedAlternatives: { phStatus: ["uncertain"], patternId: ["mixed-or-uncertain"] },
    reasoning: ["Der er ikke et robust hovedmønster.", "Apparatets områder og klinikken kan ændre fortolkningen."],
    commonPitfall: "At overfortolke små afvigelser som en sikker forstyrrelse.",
    prehospitalRelevance: "Brug trends og patientens samlede tilstand frem for enkeltgrænser.",
    limitation: "Grænseværdier er afhængige af apparat, prøvetype og kontekst.",
  }),
  createTrainingCase({
    id: "trainer-mixed-acidotic-picture",
    title: "Blandet acidotisk billede",
    level: "advanced",
    clinicalContext: "Venøs prøve hvor både respiratoriske og metaboliske værdier trækker i acidotisk retning.",
    values: [
      { analyteId: "ph", label: "pH", value: "7,20", unit: "uden enhed", direction: "low" },
      { analyteId: "pco2", label: "pCO₂", value: "7,2", unit: "kPa", direction: "high" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "17", unit: "mmol/L", direction: "low" },
      { analyteId: "be", label: "BE", value: "-9", unit: "mmol/L", direction: "low" },
      { analyteId: "lactate", label: "Lactate", value: "3,1", unit: "mmol/L", direction: "high" },
    ],
    phStatus: "acidaemia",
    primaryProcess: "mixed",
    patternId: "mixed-or-uncertain",
    supportingAbnormalities: ["Høj pCO₂ bidrager respiratorisk.", "Lav HCO₃⁻ og negativ BE bidrager metabolisk."],
    reasoning: ["Værdierne passer ikke med én enkel hovedpåvirkning.", "Blandet eller usikkert er derfor det mest forsvarlige svar."],
    commonPitfall: "At tvinge billedet ind i én ren syre-base-kategori.",
    prehospitalRelevance: "Beskriv begge retninger og patientens respiratoriske og kredsløbsmæssige tilstand.",
    limitation: "Den venøse prøve forklarer ikke årsagerne til de samtidige fund.",
  }),
];

export function shuffleBloodGasCases(
  cases: BloodGasTrainingCase[],
  random: () => number = Math.random,
) {
  const deck = [...cases];
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [deck[index], deck[target]] = [deck[target], deck[index]];
  }
  return deck;
}

export function buildBloodGasTrainingDeck(
  cases: BloodGasTrainingCase[] = bloodGasTrainingCases,
  random: () => number = Math.random,
) {
  return shuffleBloodGasCases(cases, random);
}
