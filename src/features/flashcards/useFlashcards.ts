// src/features/flashcards/useFlashcards.ts
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  collection,
  collectionGroup,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ekgImageLookup } from "../../data/ekg/imageLookup";
import { auth, db } from "../../firebase/firebase";
import { validateFlashcardDocuments } from "../../services/flashcardValidation";
import type { Flashcard } from "../../types/Flashcard";

export type TopicGroup = {
  topic: string;
  subtopics: string[];
};

function buildTopicGroupsBySubject(
  cards: Flashcard[],
): Record<string, TopicGroup[]> {
  // subject -> topic -> subtopics
  const map = new Map<string, Map<string, Set<string>>>();

  for (const card of cards) {
    const { subject, topic = "", subtopic = "" } = card;
    if (!subject || !topic) continue;

    if (!map.has(subject)) map.set(subject, new Map());
    const topicMap = map.get(subject)!;

    if (!topicMap.has(topic)) topicMap.set(topic, new Set());
    const subs = topicMap.get(topic)!;

    if (subtopic) subs.add(subtopic);
  }

  const out: Record<string, TopicGroup[]> = {};
  for (const [subject, topicMap] of map.entries()) {
    const groups: TopicGroup[] = [];

    for (const [topic, subSet] of topicMap.entries()) {
      groups.push({
        topic,
        subtopics: Array.from(subSet).sort((a, b) => a.localeCompare(b)),
      });
    }

    groups.sort((a, b) => a.topic.localeCompare(b.topic));
    out[subject] = groups;
  }

  return out;
}

type RawFlashcardDocument = {
  data: unknown;
  fallbackId?: string;
  source: string;
};

function documentsFromSnapshot(
  docs: { id: string; data: () => unknown; ref: { path: string } }[],
): RawFlashcardDocument[] {
  return docs.map((document) => ({
    data: document.data(),
    fallbackId: document.id,
    source: document.ref.path,
  }));
}

async function tryLoadCardsFromFirestore(): Promise<RawFlashcardDocument[]> {
  // NOTE:
  // - We try multiple likely structures so your app works even if you seeded differently.
  // - If you KNOW your structure, we can simplify later.

  // 1) Subcollections named "cards" anywhere (collectionGroup)
  try {
    // Limit to avoid accidentally loading the whole universe during debugging
    const q1 = query(collectionGroup(db, "cards"), limit(5000));
    const snap = await getDocs(q1);

    if (!snap.empty) {
      console.log(
        "[Flashcards] Loaded",
        snap.size,
        "via collectionGroup(\"cards\")",
      );
      return documentsFromSnapshot(snap.docs);
    }
    console.log("[Flashcards] collectionGroup(\"cards\") returned 0 docs");
  } catch (e) {
    console.warn("[Flashcards] collectionGroup(\"cards\") failed", e);
  }

  // 2) Top-level "cards"
  try {
    const q2 = query(collection(db, "cards"), limit(5000));
    const snap = await getDocs(q2);

    if (!snap.empty) {
      console.log("[Flashcards] Loaded", snap.size, "via collection(\"cards\")");
      return documentsFromSnapshot(snap.docs);
    }
    console.log("[Flashcards] collection(\"cards\") returned 0 docs");
  } catch (e) {
    console.warn("[Flashcards] collection(\"cards\") failed", e);
  }

  // 3) Top-level "flashcards"
  try {
    const q3 = query(collection(db, "flashcards"), limit(5000));
    const snap = await getDocs(q3);

    if (!snap.empty) {
      console.log(
        "[Flashcards] Loaded",
        snap.size,
        "via collection(\"flashcards\")",
      );
      return documentsFromSnapshot(snap.docs);
    }
    console.log("[Flashcards] collection(\"flashcards\") returned 0 docs");
  } catch (e) {
    console.warn("[Flashcards] collection(\"flashcards\") failed", e);
  }

  // 4) Deck docs containing { cards: [] }
  try {
    const snap = await getDocs(query(collection(db, "decks"), limit(2000)));
    const all: RawFlashcardDocument[] = [];

    for (const document of snap.docs) {
      const data: Record<string, unknown> = document.data();
      if (!Array.isArray(data.cards)) continue;
      data.cards.forEach((card, index) => {
        all.push({
          data: card,
          fallbackId: `${document.id}:${index}`,
          source: `${document.ref.path}.cards[${index}]`,
        });
      });
    }

    if (all.length > 0) {
      console.log(
        "[Flashcards] Loaded",
        all.length,
        "from decks[].cards arrays",
      );
      return all;
    }
    console.log("[Flashcards] collection(\"decks\") had no decks[].cards arrays");
  } catch (e) {
    console.warn("[Flashcards] collection(\"decks\") failed", e);
  }

  return [];
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race<T>([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error("Firestore timeout after " + ms + "ms")),
        ms,
      ),
    ),
  ]);
}

export function useFlashcards() {
  const [authReady, setAuthReady] = useState(false);

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Ensure auth (anonymous)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!mountedRef.current) return;

      if (!user) {
        try {
          await signInAnonymously(auth);
          return;
        } catch (e: any) {
          console.error("Anonymous sign-in failed:", e);
          if (mountedRef.current) {
            setLoadError(e?.message ?? "Kunne ikke logge ind anonymt.");
            setLoadingCards(false);
          }
          return;
        }
      }

      setAuthReady(true);
    });

    return unsub;
  }, []);

  // Load cards once auth is ready
  useEffect(() => {
    if (!authReady) return;

    let cancelled = false;

    async function load() {
      try {
        setLoadError(null);
        setLoadingCards(true);

        const rawDocuments = await withTimeout(
          tryLoadCardsFromFirestore(),
          12000,
        );
        const validCards = validateFlashcardDocuments(rawDocuments);

        const hydrated: Flashcard[] = validCards.map((card) => {
          if (card.imageKey && ekgImageLookup[card.imageKey]) {
            return { ...card, image: ekgImageLookup[card.imageKey] };
          }
          return card;
        });

        console.log("[Flashcards] Final hydrated count:", hydrated.length);

        if (!cancelled && mountedRef.current) setCards(hydrated);
      } catch (err: any) {
        console.error("Failed to fetch flashcards from Firestore", err);
        if (!cancelled && mountedRef.current) {
          setLoadError(err?.message ?? "Kunne ikke hente flashcards.");
        }
      } finally {
        if (!cancelled && mountedRef.current) setLoadingCards(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [authReady]);

  const topicGroupsBySubject = useMemo(
    () => buildTopicGroupsBySubject(cards),
    [cards],
  );

  const subjects = useMemo(
    () => Object.keys(topicGroupsBySubject).sort((a, b) => a.localeCompare(b)),
    [topicGroupsBySubject],
  );

  const startAllSubjectsQuiz = useCallback(() => {
    console.log("startAllSubjectsQuiz clicked");
  }, []);

  return {
    cards,
    loadingCards,
    loadError,

    subjects,
    topicGroupsBySubject,

    startAllSubjectsQuiz,
  };
}
