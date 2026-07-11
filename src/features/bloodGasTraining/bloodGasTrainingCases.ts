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
  { id: "reference", label: "Reference" },
  { id: "high", label: "Høj" },
  { id: "uncertain", label: "Usikker" },
];

export const phStatusOptions: { id: BloodGasPhStatus; label: string }[] = [
  { id: "acidaemia", label: "Acidæmi" },
  { id: "reference", label: "Reference / normal-ish" },
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
  { id: "normalish", label: "Normal-ish VGAS" },
  { id: "primary-metabolic-acidosis", label: "Primær metabolisk acidose" },
  { id: "respiratory-acidosis", label: "Respiratorisk acidose" },
  { id: "respiratory-alkalosis", label: "Respiratorisk alkalose" },
  { id: "hyperglycaemia-metabolic-acidosis", label: "Svær hyperglykæmi + metabolisk acidose" },
  { id: "hypoperfusion-elevated-lactate", label: "Forhøjet laktat / mulig hypoperfusion-stress" },
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
      : ["Ingen tydelig hovedafvigelse i de viste værdier"],
    commonPitfall: example.commonPitfall,
    prehospitalRelevance: example.prehospitalRelevance,
    limitation: example.limitation,
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
