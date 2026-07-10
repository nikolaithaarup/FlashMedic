import {
  bloodGasAnalytes,
  bloodGasPatternExamples,
  bloodGasPatterns,
  type BloodGasValueDirection,
} from "../src/features/bloodGasTraining/bloodGasTheoryContent";

const errors: string[] = [];
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

if (errors.length > 0) {
  console.error(`Blood-gas validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `Blood-gas validation passed: ${bloodGasPatternExamples.length} examples and ${bloodGasAnalytes.length} analytes.`,
);
