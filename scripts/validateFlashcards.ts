import {
  parseFlashcardDocument,
  validateFlashcardDocuments,
} from "../src/services/flashcardValidation";
import { getQueueAfterFlashcardScore } from "../src/features/flashcards/quizSession";

const valid = parseFlashcardDocument({
  id: "card-1",
  subject: "EKG",
  topic: "Rytmer",
  question: "Hvad viser rytmen?",
  answer: "Sinusrytme",
  difficulty: "EASY",
  imageKey: "sinusrytme",
});

if (!valid.ok || valid.card.difficulty !== "easy") {
  throw new Error("A valid flashcard was not parsed and normalized correctly.");
}

const fallbackId = parseFlashcardDocument(
  {
    fag: "Farmakologi",
    emne: "Dosis",
    question: "Et spørgsmål",
    answer: "Et svar",
  },
  "firestore-doc-id",
);

if (!fallbackId.ok || fallbackId.card.id !== "firestore-doc-id") {
  throw new Error("Firestore document ID fallback was not preserved.");
}

const malformed = parseFlashcardDocument({
  id: "",
  subject: "EKG",
  question: "",
  answer: "Svar",
});

if (malformed.ok) {
  throw new Error("A malformed flashcard was accepted.");
}

const originalWarn = console.warn;
console.warn = () => undefined;
const deduplicated = validateFlashcardDocuments([
  { data: valid.card, source: "first" },
  { data: valid.card, source: "duplicate" },
  { data: { id: "broken" }, source: "malformed" },
]);
console.warn = originalWarn;

if (deduplicated.length !== 1) {
  throw new Error("Duplicate or malformed cards were not skipped.");
}

const finalCard = deduplicated[0];
if (getQueueAfterFlashcardScore(finalCard, [], true).length !== 0) {
  throw new Error("A known final card did not complete the quiz session.");
}
const repeatedQueue = getQueueAfterFlashcardScore(finalCard, [], false);
if (repeatedQueue.length !== 1 || repeatedQueue[0].id !== finalCard.id) {
  throw new Error("An unknown final card was not queued for another pass.");
}

console.log(
  "Validated flashcard parsing, normalization, fallback IDs, rejection, and final-card progression.",
);
