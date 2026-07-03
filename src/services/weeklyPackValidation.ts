import type { WeeklyMatchPack } from "./weeklyMatchService";
import type { WeeklyMcqPack } from "./weeklyMcqService";
import type { WeeklyWordPack } from "./weeklyWordService";

export class WeeklyPackValidationError extends Error {
  readonly retryable = false;

  constructor(game: string, issues: string[]) {
    super(`${game}-pakken er ugyldig: ${issues.join("; ")}`);
    this.name = "WeeklyPackValidationError";
  }
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

export function validateWeeklyMcqPack(pack: WeeklyMcqPack): string[] {
  const issues: string[] = [];
  if (pack.questions.length === 0) issues.push("ingen spørgsmål");
  const duplicateQuestions = duplicates(pack.questions.map((item) => item.id));
  if (duplicateQuestions.length) {
    issues.push(`dublerede spørgsmål-id'er: ${duplicateQuestions.join(", ")}`);
  }
  for (const question of pack.questions) {
    if (question.options.length < 2) {
      issues.push(`${question.id}: færre end 2 svarmuligheder`);
    }
    if (question.options.filter((option) => option.isCorrect).length !== 1) {
      issues.push(`${question.id}: skal have præcis ét korrekt svar`);
    }
    if (duplicates(question.options.map((option) => option.id)).length) {
      issues.push(`${question.id}: dublerede svar-id'er`);
    }
  }
  return issues;
}

export function validateWeeklyMatchPack(pack: WeeklyMatchPack): string[] {
  const issues: string[] = [];
  if (pack.rounds.length === 0) issues.push("ingen runder");
  for (const round of pack.rounds) {
    if (round.pairs.length === 0) issues.push(`runde ${round.round}: ingen par`);
    if (duplicates(round.pairs.map((pair) => pair.id)).length) {
      issues.push(`runde ${round.round}: dublerede par-id'er`);
    }
    if (round.pairs.some((pair) => !pair.left.trim() || !pair.right.trim())) {
      issues.push(`runde ${round.round}: tom venstre/højre tekst`);
    }
  }
  return issues;
}

export function validateWeeklyWordPack(pack: WeeklyWordPack): string[] {
  const issues: string[] = [];
  if (pack.rounds.length === 0) issues.push("ingen runder");
  for (const round of pack.rounds) {
    if (round.words.length === 0) issues.push(`runde ${round.round}: ingen ord`);
    if (round.minLength < 1 || round.maxLength < round.minLength) {
      issues.push(`runde ${round.round}: ugyldigt længdeinterval`);
    }
  }
  return issues;
}
