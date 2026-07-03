import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; // your existing db export
import type { Flashcard } from "../types/Flashcard";
import { validateFlashcardDocuments } from "./flashcardValidation";

export async function fetchSubjectCards(subjectSlug: string): Promise<Flashcard[]> {
  const col = collection(db, "subjects", subjectSlug, "cards");
  const snap = await getDocs(col);
  return validateFlashcardDocuments(
    snap.docs.map((document) => ({
      data: document.data(),
      fallbackId: document.id,
      source: document.ref.path,
    })),
  );
}

export async function fetchSubjects(): Promise<{ slug: string; name: string; cardCount: number }[]> {
  const col = collection(db, "subjects");
  const snap = await getDocs(col);
  return snap.docs.flatMap((document) => {
    const data: Record<string, unknown> = document.data();
    const slug = typeof data.slug === "string" ? data.slug.trim() : "";
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const cardCount =
      typeof data.cardCount === "number" && Number.isFinite(data.cardCount)
        ? Math.max(0, Math.floor(data.cardCount))
        : 0;

    if (!slug || !name) {
      console.warn(`[Flashcards] Skipped invalid subject ${document.ref.path}`);
      return [];
    }
    return [{ slug, name, cardCount }];
  });
}
