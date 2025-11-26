import { allFlashcards } from "./flashcards";
import type { Flashcard } from "../types/Flashcard";

export function getTopicsForSubject(subject: string): string[] {
  const topicSet = new Set(
    allFlashcards
      .filter(card => card.subject === subject)
      .map(card => card.topic)
  );
  return Array.from(topicSet).sort();
}

export function getCardsForSubjectAndTopics(
  subject: string,
  topics?: string[]
): Flashcard[] {
  const topicFilter = topics && topics.length > 0 ? topics : undefined;

  return allFlashcards.filter(card =>
    card.subject === subject &&
    (!topicFilter || topicFilter.includes(card.topic))
  );
}
