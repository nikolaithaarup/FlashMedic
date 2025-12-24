import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; // your existing db export
import type { Flashcard } from "../types/Flashcard";

export async function fetchSubjectCards(subjectSlug: string): Promise<Flashcard[]> {
  const col = collection(db, "subjects", subjectSlug, "cards");
  const snap = await getDocs(col);
  return snap.docs.map((d) => d.data() as Flashcard);
}

export async function fetchSubjects(): Promise<{ slug: string; name: string; cardCount: number }[]> {
  const col = collection(db, "subjects");
  const snap = await getDocs(col);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return { slug: data.slug, name: data.name, cardCount: data.cardCount ?? 0 };
  });
}
