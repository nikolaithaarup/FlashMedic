// src/features/flashcards/useFlashcards.ts
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { collectionGroup, getDocs, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { ekgImageLookup } from "../../data/ekg/imageLookup";
import { auth, db } from "../../firebase/firebase";
import type { Flashcard } from "../../types/Flashcard";

export function useFlashcards() {
  const [authReady, setAuthReady] = useState(false);

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ensure auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
        return;
      }
      setAuthReady(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!authReady) return;

    let cancelled = false;

    const withTimeout = async <T,>(p: Promise<T>, ms: number) => {
      return await Promise.race<T>([
        p,
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error(`Firestore timeout after ${ms}ms`)), ms),
        ),
      ]);
    };

    async function loadFromFirestore() {
      try {
        setLoadError(null);
        setLoadingCards(true);

        const q = query(collectionGroup(db, "cards"));
        const snap = await withTimeout(getDocs(q), 12000);

        const rawCards = snap.docs.map((d) => d.data() as any);

        const hydrated: Flashcard[] = rawCards.map((c: any) => {
          if (c.imageKey && ekgImageLookup[c.imageKey]) {
            return { ...c, image: ekgImageLookup[c.imageKey] };
          }
          return c;
        });

        if (!cancelled) {
          setCards(hydrated);
          setLoadError(null);
        }
      } catch (err: any) {
        if (!cancelled) setLoadError(err?.message ?? "Kunne ikke hente flashcards fra Firestore.");
      } finally {
        if (!cancelled) setLoadingCards(false);
      }
    }

    loadFromFirestore();
    return () => {
      cancelled = true;
    };
  }, [authReady]);

  // placeholder for now: the quiz route will implement this properly
  const startAllSubjectsQuiz = useCallback(() => {
    // we’ll implement this once /flashcards/quiz exists
    // for now do nothing (or throw)
     
    console.log("startAllSubjectsQuiz clicked");
  }, []);

  return { cards, loadingCards, loadError, startAllSubjectsQuiz };
}
