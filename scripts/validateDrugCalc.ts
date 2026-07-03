import {
  DRUG_TOPICS,
  generateDrugCalcQuestion,
  isDrugAnswerCorrect,
} from "../src/features/drugCalc/drugCalcContent";

for (const { id } of DRUG_TOPICS) {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const question = generateDrugCalcQuestion([id]);
    if (question.topic !== id) {
      throw new Error(`Requested ${id}, received ${question.topic}`);
    }
    if (!Number.isFinite(question.correctAnswer) || !question.unit) {
      throw new Error(`Invalid generated question for ${id}`);
    }
    if (!isDrugAnswerCorrect(question.correctAnswer, question.correctAnswer)) {
      throw new Error(`Exact answer rejected for ${id}`);
    }
  }
}

const toleranceCases = [
  { user: 1, correct: 1, tolerance: 0.02, expected: true },
  { user: 1.02, correct: 1, tolerance: 0.02, expected: true },
  { user: 1.021, correct: 1, tolerance: 0.02, expected: false },
  { user: 0.49, correct: 0.01, tolerance: 0.02, expected: false },
  { user: 1.49, correct: 0.51, tolerance: 0.02, expected: false },
  { user: -1, correct: 1, tolerance: 0.02, expected: false },
  { user: Number.NaN, correct: 1, tolerance: 0.02, expected: false },
  { user: Number.POSITIVE_INFINITY, correct: 1, tolerance: 0.02, expected: false },
] as const;

for (const testCase of toleranceCases) {
  const actual = isDrugAnswerCorrect(
    testCase.user,
    testCase.correct,
    testCase.tolerance,
  );
  if (actual !== testCase.expected) {
    throw new Error(
      `Tolerance case failed: ${JSON.stringify(testCase)} returned ${actual}`,
    );
  }
}

console.log(
  `Validated ${DRUG_TOPICS.length} medication topics and ${toleranceCases.length} tolerance cases.`,
);
