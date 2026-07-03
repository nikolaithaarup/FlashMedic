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

console.log(`Validated ${DRUG_TOPICS.length} medication topics.`);
