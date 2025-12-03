// scripts/exportFlashcards.ts
//
// Run with:
//   npx tsx scripts/exportFlashcards.ts
//
// It will:
//   1) Patch Node so requires of .jpg/.jpeg/.png don't blow up
//   2) Dynamically import src/data/flashcards (which pulls in all decks)
//   3) Flatten into backend cards, including deckId (which deck/folder)
//   4) Write cards.json in the project root

import { writeFileSync } from "fs";
import { join } from "path";

// Shape that the backend / JSON will use
type BackendCard = {
  id: string;
  subject: string;
  topic?: string;
  subtopic?: string;
  question: string;
  answer: string;
  difficulty: string;   // "easy" | "medium" | "hard"
  tags?: string[];
  explanation?: string;
  imageKey?: string;

  // NEW: tells you which deck this card came from
  deckId?: string;      // e.g. "akutAbdomenCards"
};

// Convert full Flashcard -> slim BackendCard
function toBackendCard(card: any, deckId?: string): BackendCard {
  return {
    id: card.id,
    subject: card.subject,
    topic: card.topic,
    subtopic: card.subtopic,
    question: card.question,
    answer: card.answer,
    difficulty: card.difficulty,
    tags: card.tags,
    explanation: card.explanation,
    imageKey: card.imageKey,
    deckId,
  };
}

async function main() {
  console.log("Exporting flashcards…");

  // --- 1) Patch require for image files so Node doesn't try to parse JPG/PNG ---
  // tsx runs under CommonJS for these modules, so require() exists here.
   
  const req = require as any;

  if (req && req.extensions) {
    // Just return an empty object for any imported image file.
    req.extensions[".jpg"] = () => {};
    req.extensions[".jpeg"] = () => {};
    req.extensions[".png"] = () => {};
  }

  // --- 2) Dynamically import the flashcards module AFTER patching ---
  const mod = await import("../src/data/flashcards");
  const allDecks = (mod as any).allDecks as Record<string, any[]>;

  let total = 0;
  const backendCards: BackendCard[] = [];

  for (const [deckId, deck] of Object.entries(allDecks)) {
    if (!Array.isArray(deck)) continue;

    for (const card of deck) {
      backendCards.push(toBackendCard(card, deckId));
      total++;
    }
  }

  console.log(`Loaded ${total} cards from ${Object.keys(allDecks).length} decks.`);

  const json = JSON.stringify({ cards: backendCards }, null, 2);

  // --- 3) Write cards.json to project root ---
  const outputPath = join(__dirname, "..", "cards.json");
  writeFileSync(outputPath, json, "utf-8");

  console.log("Done. Wrote", backendCards.length, "cards to", outputPath);
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
