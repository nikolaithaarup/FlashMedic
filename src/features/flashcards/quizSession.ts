import type { Flashcard } from "../../types/Flashcard";

/**
 * Known cards leave the session. Unknown cards are appended for another pass.
 * An empty returned queue means the final card was known and the session ended.
 */
export function getQueueAfterFlashcardScore(
  currentCard: Flashcard,
  upcoming: Flashcard[],
  known: boolean,
): Flashcard[] {
  return known ? upcoming : [...upcoming, currentCard];
}
