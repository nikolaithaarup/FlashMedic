import {
  DRUG_TOPICS,
  THEORY,
  WORKED_EXAMPLES,
  formatDrugAnswer,
  generateDrugCalcQuestion,
  isDrugAnswerCorrect,
} from "../src/features/drugCalc/drugCalcContent";

const topicIds = new Set(DRUG_TOPICS.map((topic) => topic.id));
if (topicIds.size !== DRUG_TOPICS.length) {
  throw new Error("Drug calculation topics contain duplicate IDs.");
}

for (const { id } of DRUG_TOPICS) {
  const theory = THEORY.find((section) => section.topic === id);
  if (!theory || !theory.title.trim() || theory.bullets.length === 0) {
    throw new Error(`Missing theory content for ${id}`);
  }

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const question = generateDrugCalcQuestion([id]);
    if (question.topic !== id) {
      throw new Error(`Requested ${id}, received ${question.topic}`);
    }
    if (!Number.isFinite(question.correctAnswer) || question.correctAnswer < 0) {
      throw new Error(`Invalid expected answer for ${id}`);
    }
    if (!question.unit.trim()) {
      throw new Error(`Missing answer unit for ${id}`);
    }
    if (
      !Number.isFinite(question.tolerance) ||
      question.tolerance <= 0 ||
      question.tolerance > 0.1
    ) {
      throw new Error(`Unsafe tolerance for ${id}: ${question.tolerance}`);
    }
    if (
      !question.formula.trim() ||
      !question.explanation.trim() ||
      !question.commonPitfall.trim() ||
      !question.plausibilityCheck.trim() ||
      !question.roundingNote.trim() ||
      question.calculationSteps.length === 0 ||
      question.calculationSteps.some((step) => !step.trim())
    ) {
      throw new Error(`Incomplete learning metadata for ${id}`);
    }
    if (
      !Number.isInteger(question.answerDecimals) ||
      question.answerDecimals < 0 ||
      question.answerDecimals > 3
    ) {
      throw new Error(`Invalid answer decimal policy for ${id}`);
    }
    if (
      !isDrugAnswerCorrect(
        question.correctAnswer,
        question.correctAnswer,
        question.tolerance,
      )
    ) {
      throw new Error(`Exact answer rejected for ${id}`);
    }

    const displayedAnswer = Number(formatDrugAnswer(question).replace(",", "."));
    if (
      !isDrugAnswerCorrect(
        displayedAnswer,
        question.correctAnswer,
        question.tolerance,
      )
    ) {
      throw new Error(`Displayed rounded answer rejected for ${id}`);
    }

    const clearlyWrongAnswer = question.correctAnswer + 1;
    if (
      isDrugAnswerCorrect(
        clearlyWrongAnswer,
        question.correctAnswer,
        question.tolerance,
      )
    ) {
      throw new Error(`Clearly wrong answer accepted for ${id}`);
    }
  }
}

for (let attempt = 0; attempt < 50; attempt += 1) {
  const mixedQuestion = generateDrugCalcQuestion([]);
  if (!topicIds.has(mixedQuestion.topic)) {
    throw new Error(`Mixed practice returned unknown topic ${mixedQuestion.topic}`);
  }
}

const toleranceCases = [
  { user: 1, correct: 1, tolerance: 0.02, expected: true },
  { user: 1.02, correct: 1, tolerance: 0.02, expected: true },
  { user: 1.021, correct: 1, tolerance: 0.02, expected: false },
  { user: -1, correct: 1, tolerance: 0.02, expected: false },
  { user: 1, correct: -1, tolerance: 0.02, expected: false },
  { user: Number.NaN, correct: 1, tolerance: 0.02, expected: false },
  { user: Number.POSITIVE_INFINITY, correct: 1, tolerance: 0.02, expected: false },
  { user: 1, correct: Number.NaN, tolerance: 0.02, expected: false },
  { user: 1, correct: Number.POSITIVE_INFINITY, tolerance: 0.02, expected: false },
  { user: 1, correct: 1, tolerance: Number.NaN, expected: false },
  { user: 1, correct: 1, tolerance: Number.POSITIVE_INFINITY, expected: false },
  { user: 1, correct: 1, tolerance: -0.01, expected: false },
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

if (WORKED_EXAMPLES.length < 6) {
  throw new Error("Expected at least six worked drug calculation examples.");
}

for (const example of WORKED_EXAMPLES) {
  if (!topicIds.has(example.topic)) {
    throw new Error(`Worked example has unknown topic ${example.topic}`);
  }
  if (
    !example.title.trim() ||
    !example.problem.trim() ||
    !example.formula.trim() ||
    example.calculation.length === 0 ||
    example.calculation.some((step) => !step.trim()) ||
    !example.finalAnswer.trim() ||
    !example.commonPitfall.trim()
  ) {
    throw new Error(`Incomplete worked example: ${example.title || example.topic}`);
  }
}

console.log(
  `Validated ${DRUG_TOPICS.length} medication topics, ${WORKED_EXAMPLES.length} worked examples, ${toleranceCases.length} tolerance cases, mixed practice, rounding, and learning metadata.`,
);
