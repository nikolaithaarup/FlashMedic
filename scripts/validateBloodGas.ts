import {
  bloodGasAnalytes,
  bloodGasPatternExamples,
  bloodGasPatterns,
  type BloodGasValueDirection,
} from "../src/features/bloodGasTraining/bloodGasTheoryContent";
import {
  bloodGasTrainingCases,
  buildBloodGasTrainingDeck,
  patternOptions,
  phStatusOptions,
  primaryProcessOptions,
  valueDirectionOptions,
} from "../src/features/bloodGasTraining/bloodGasTrainingCases";
import {
  bloodGasPatternTrainingCases,
  buildBloodGasPatternTrainingDeck,
} from "../src/features/bloodGasTraining/bloodGasPatternTrainingCases";

const errors: string[] = [];
const previousPatternTrainingCaseCount = 10;
const validDirections = new Set<BloodGasValueDirection>([
  "low",
  "reference",
  "high",
  "uncertain",
]);

function requireText(value: string, path: string) {
  if (!value.trim()) errors.push(`${path} must not be empty.`);
}

function findDuplicates(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

const analyteIds = bloodGasAnalytes.map((analyte) => analyte.id);
const knownAnalyteIds = new Set(analyteIds);
for (const duplicate of new Set(findDuplicates(analyteIds))) {
  errors.push(`Duplicate analyte id: ${duplicate}.`);
}

if (bloodGasPatternExamples.length !== 8) {
  errors.push(`Expected 8 blood-gas pattern examples, found ${bloodGasPatternExamples.length}.`);
}

const exampleIds = bloodGasPatternExamples.map((example) => example.id);
for (const duplicate of new Set(findDuplicates(exampleIds))) {
  errors.push(`Duplicate example id: ${duplicate}.`);
}

for (const pattern of bloodGasPatterns) {
  if (!exampleIds.includes(pattern.id)) {
    errors.push(`Missing value-based example for theory pattern: ${pattern.id}.`);
  }
}

for (const example of bloodGasPatternExamples) {
  const prefix = `Example ${example.id}`;
  requireText(example.id, `${prefix}.id`);
  requireText(example.title, `${prefix}.title`);
  requireText(example.oneLineSummary, `${prefix}.oneLineSummary`);
  requireText(example.clinicalContext, `${prefix}.clinicalContext`);
  requireText(example.interpretation, `${prefix}.interpretation`);
  requireText(example.commonPitfall, `${prefix}.commonPitfall`);
  requireText(example.prehospitalRelevance, `${prefix}.prehospitalRelevance`);
  requireText(example.limitation, `${prefix}.limitation`);

  if (example.values.length === 0) errors.push(`${prefix}.values must not be empty.`);
  if (example.reasoning.length === 0) errors.push(`${prefix}.reasoning must not be empty.`);
  example.reasoning.forEach((reason, index) => requireText(reason, `${prefix}.reasoning[${index}]`));

  const valueAnalyteIds = example.values.map((value) => value.analyteId);
  for (const duplicate of new Set(findDuplicates(valueAnalyteIds))) {
    errors.push(`${prefix} contains duplicate analyte: ${duplicate}.`);
  }

  example.values.forEach((value, index) => {
    const valuePrefix = `${prefix}.values[${index}]`;
    if (!knownAnalyteIds.has(value.analyteId)) {
      errors.push(`${valuePrefix} references unknown analyte: ${value.analyteId}.`);
    }
    requireText(value.label, `${valuePrefix}.label`);
    requireText(value.value, `${valuePrefix}.value`);
    requireText(value.unit, `${valuePrefix}.unit`);
    if (!validDirections.has(value.direction)) {
      errors.push(`${valuePrefix} has invalid direction: ${value.direction}.`);
    }
  });
}

const trainingDirections = new Set(valueDirectionOptions.map((option) => option.id));
const phStatuses = new Set(phStatusOptions.map((option) => option.id));
const primaryProcesses = new Set(primaryProcessOptions.map((option) => option.id));
const patternIds = new Set(patternOptions.map((option) => option.id));
const caseIds = bloodGasTrainingCases.map((trainingCase) => trainingCase.id);
const caseTitles = bloodGasTrainingCases.map((trainingCase) => trainingCase.title);

if (bloodGasTrainingCases.length < 16 || bloodGasTrainingCases.length > 20) {
  errors.push(
    `Expected 16-20 blood-gas training cases, found ${bloodGasTrainingCases.length}.`,
  );
}

for (const duplicate of new Set(findDuplicates(caseIds))) {
  errors.push(`Duplicate training case id: ${duplicate}.`);
}
for (const duplicate of new Set(findDuplicates(caseTitles))) {
  errors.push(`Duplicate training case title: ${duplicate}.`);
}

for (const trainingCase of bloodGasTrainingCases) {
  const prefix = `Training case ${trainingCase.id}`;
  requireText(trainingCase.id, `${prefix}.id`);
  requireText(trainingCase.title, `${prefix}.title`);
  requireText(trainingCase.level, `${prefix}.level`);
  requireText(trainingCase.sampleType, `${prefix}.sampleType`);
  requireText(trainingCase.clinicalContext, `${prefix}.clinicalContext`);
  requireText(trainingCase.commonPitfall, `${prefix}.commonPitfall`);
  requireText(trainingCase.prehospitalRelevance, `${prefix}.prehospitalRelevance`);
  requireText(trainingCase.limitation, `${prefix}.limitation`);

  if (trainingCase.values.length === 0) errors.push(`${prefix}.values must not be empty.`);
  if (trainingCase.reasoning.length === 0) errors.push(`${prefix}.reasoning must not be empty.`);
  if (trainingCase.keyAbnormalities.length === 0) errors.push(`${prefix}.keyAbnormalities must not be empty.`);

  const presentIds = new Set(trainingCase.values.map((value) => value.analyteId));
  for (const value of trainingCase.values) {
    requireText(value.analyteId, `${prefix}.value.analyteId`);
    requireText(value.label, `${prefix}.${value.analyteId}.label`);
    requireText(value.value, `${prefix}.${value.analyteId}.value`);
    requireText(value.unit, `${prefix}.${value.analyteId}.unit`);
    if (!knownAnalyteIds.has(value.analyteId)) errors.push(`${prefix} references unknown analyte: ${value.analyteId}.`);
    if (!trainingDirections.has(value.direction)) errors.push(`${prefix}.${value.analyteId} has invalid direction.`);
    if (!(value.analyteId in trainingCase.expected.valueDirections)) {
      errors.push(`${prefix} lacks expected direction for ${value.analyteId}.`);
    }
  }
  for (const [analyteId, direction] of Object.entries(trainingCase.expected.valueDirections)) {
    if (!presentIds.has(analyteId)) errors.push(`${prefix}.expected references absent value: ${analyteId}.`);
    if (!trainingDirections.has(direction)) errors.push(`${prefix}.expected has invalid direction for ${analyteId}.`);
  }
  if (!phStatuses.has(trainingCase.expected.phStatus)) errors.push(`${prefix} has invalid phStatus.`);
  if (!primaryProcesses.has(trainingCase.expected.primaryProcess)) errors.push(`${prefix} has invalid primaryProcess.`);
  if (!patternIds.has(trainingCase.expected.patternId)) errors.push(`${prefix} has invalid patternId.`);

  for (const alternative of trainingCase.acceptedAlternatives?.phStatus ?? []) {
    if (!phStatuses.has(alternative)) errors.push(`${prefix} has invalid alternative phStatus.`);
  }
  for (const alternative of trainingCase.acceptedAlternatives?.primaryProcess ?? []) {
    if (!primaryProcesses.has(alternative)) errors.push(`${prefix} has invalid alternative primaryProcess.`);
  }
  for (const alternative of trainingCase.acceptedAlternatives?.patternId ?? []) {
    if (!patternIds.has(alternative)) errors.push(`${prefix} has invalid alternative patternId.`);
  }
}

const deterministicDeck = buildBloodGasTrainingDeck(bloodGasTrainingCases, () => 0);
if (deterministicDeck.length !== bloodGasTrainingCases.length) {
  errors.push("Deck selector changed the number of cases.");
}
if (new Set(deterministicDeck.map((item) => item.id)).size !== deterministicDeck.length) {
  errors.push("Deck selector returned repeated cases.");
}
if (buildBloodGasTrainingDeck([], () => 0).length !== 0) {
  errors.push("Empty deck handling must return an empty deck.");
}

const patternCaseIds = bloodGasPatternTrainingCases.map((item) => item.id);
const patternCaseTitles = bloodGasPatternTrainingCases.map((item) => item.title);
for (const duplicate of new Set(findDuplicates(patternCaseIds))) errors.push(`Duplicate pattern-training case id: ${duplicate}.`);
for (const duplicate of new Set(findDuplicates(patternCaseTitles))) errors.push(`Duplicate pattern-training case title: ${duplicate}.`);
for (const trainingCase of bloodGasPatternTrainingCases) {
  const prefix = `Pattern-training case ${trainingCase.id}`;
  requireText(trainingCase.id, `${prefix}.id`); requireText(trainingCase.title, `${prefix}.title`); requireText(trainingCase.neutralTitle, `${prefix}.neutralTitle`); requireText(trainingCase.level, `${prefix}.level`); requireText(trainingCase.patternId, `${prefix}.patternId`); requireText(trainingCase.scenario, `${prefix}.scenario`); requireText(trainingCase.taskPrompt, `${prefix}.taskPrompt`); requireText(trainingCase.keyLearningPoint, `${prefix}.keyLearningPoint`); requireText(trainingCase.commonPitfall, `${prefix}.commonPitfall`); requireText(trainingCase.prehospitalRelevance, `${prefix}.prehospitalRelevance`); requireText(trainingCase.limitation, `${prefix}.limitation`);
  if (!patternIds.has(trainingCase.patternId)) errors.push(`${prefix} has invalid patternId.`);
  if (!trainingCase.valuesToPredict.length) errors.push(`${prefix}.valuesToPredict must not be empty.`);
  const present = new Set(trainingCase.valuesToPredict.map((item) => item.analyteId));
  for (const item of trainingCase.valuesToPredict) {
    requireText(item.analyteId, `${prefix}.value.analyteId`); requireText(item.label, `${prefix}.${item.analyteId}.label`); requireText(item.unit, `${prefix}.${item.analyteId}.unit`); requireText(item.explanation, `${prefix}.${item.analyteId}.explanation`);
    if (!knownAnalyteIds.has(item.analyteId)) errors.push(`${prefix} references unknown analyte: ${item.analyteId}.`);
    if (!trainingDirections.has(item.expectedDirection)) errors.push(`${prefix}.${item.analyteId} has invalid expectedDirection.`);
  }
  for (const [analyteId, alternatives] of Object.entries(trainingCase.acceptedAlternatives ?? {})) {
    if (!present.has(analyteId)) errors.push(`${prefix}.acceptedAlternatives references absent analyte: ${analyteId}.`);
    for (const direction of alternatives) if (!trainingDirections.has(direction)) errors.push(`${prefix}.${analyteId} has invalid accepted alternative.`);
  }
}
const patternDeck = buildBloodGasPatternTrainingDeck(bloodGasPatternTrainingCases, () => 0);
if (patternDeck.length !== bloodGasPatternTrainingCases.length) errors.push("Pattern deck selector changed the number of cases.");
if (new Set(patternDeck.map((item) => item.id)).size !== patternDeck.length) errors.push("Pattern deck selector returned repeated cases.");
if (buildBloodGasPatternTrainingDeck([], () => 0).length !== 0) errors.push("Empty pattern deck handling must return an empty deck.");

if (errors.length > 0) {
  console.error(`Blood-gas validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Blood-gas validation passed: ${bloodGasPatternExamples.length} examples, ${bloodGasTrainingCases.length} value-training cases, pattern-training cases ${previousPatternTrainingCaseCount} -> ${bloodGasPatternTrainingCases.length} across ${new Set(bloodGasPatternTrainingCases.map((trainingCase) => trainingCase.patternId)).size} patterns, ${new Set(bloodGasTrainingCases.map((trainingCase) => trainingCase.expected.patternId)).size} value-training patterns, and ${bloodGasAnalytes.length} analytes.`,
);
