// app/index.tsx
import * as Linking from "expo-linking";
import * as MailComposer from "expo-mail-composer";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, useWindowDimensions } from "react-native";

import {
  loadStoredProfile,
  saveStoredProfile,
  type StoredUserProfile,
} from "../src/services/userService";

import {
  DRUG_TOPICS,
  type DrugCalcQuestion as DrugCalcQuestionV2,
  type DrugCalcTopic,
  generateDrugCalcQuestion,
  isDrugAnswerCorrect,
} from "../src/features/drugCalc/drugCalcContent";

import { ekgImageLookup } from "../src/data/ekg/imageLookup";
import type { Flashcard } from "../src/types/Flashcard";

import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { collectionGroup, getDocs, query } from "firebase/firestore";
import { auth, db } from "../src/firebase/firebase";

import { useStats } from "../src/features/stats/StatsContext";
import StatsScreen from "../src/features/stats/StatsScreen";
import { getPersonalTotals } from "../src/features/stats/statsSelectors";

import WeeklyDevScreen from "../src/features/weekly/WeeklyDevScreen";
import WeeklyHomeScreen from "../src/features/weekly/WeeklyHomeScreen";
import WeeklyMatchScreen from "../src/features/weekly/WeeklyMatchScreen";
import WeeklyMcqScreen from "../src/features/weekly/WeeklyMcqScreen";
import WeeklyWordScreen from "../src/features/weekly/WeeklyWordScreen";

import DrugCalcHomeScreen from "../src/features/drugCalc/DrugCalcHomeScreen";
import DrugCalcPracticeScreen from "../src/features/drugCalc/DrugCalcPracticeScreen";
import DrugCalcTheoryScreen from "../src/features/drugCalc/DrugCalcTheoryScreen";

import ContactScreen from "../src/features/contact/ContactScreen";
import AuthScreen from "../src/features/profile/AuthScreen";
import ProfileScreen from "../src/features/profile/ProfileScreen";

import FlashcardsHomeScreen from "../src/features/flashcards/FlashcardsHomeScreen";
import HomeScreen from "../src/features/home/HomeScreen";
import QuizScreen from "../src/features/quiz/QuizScreen";

// ---------- Types ----------

console.log("✅ Index rendered");

type CardStats = {
  seen: number;
  correct: number;
  incorrect: number;
  lastSeen: string | null;
};
type StatsMap = Record<string, CardStats>;

type Screen =
  | "auth"
  | "home"
  | "flashcardsHome"
  | "quiz"
  | "stats"
  | "profile"
  | "weeklyDev"
  | "weeklyHome"
  | "weeklyMcq"
  | "weeklyMatch"
  | "weeklyWord"
  | "contact"
  | "drugCalcHome"
  | "drugCalcPractice"
  | "drugCalcTheory";

type TopicGroup = {
  topic: string;
  subtopics: string[];
};

type UserRole =
  | "student"
  | "ambulancebehandler"
  | "paramediciner"
  | "laegeassistent";

type Gender = "male" | "female" | "not_specified";

type Region =
  | "hovedstaden"
  | "sjaelland"
  | "syddanmark"
  | "midtjylland"
  | "nordjylland"
  | "oestdanmark";

type UserProfile = {
  userId: string | null; // Firebase uid (anonymous user still has uid)
  nickname: string;
  classId: number | null;
  role: UserRole | null;
  gender: Gender | null;
  region: Region | null;
  isAnonymous: boolean;
};

type WeeklyDevOverride =
  | {
      enabled: true;
      kind: "mcq" | "match" | "word";
      weekKey: string;
      round?: number;
    }
  | { enabled: false };

// ---------- App identity ----------

const APP_ID = "FlashMedic";
const SUPPORT_EMAIL = "nikolai_91@live.com";

const APP_LOGO = require("../assets/her-icon.png");

const API_BASE_URL = "https://flashmedic-backend.onrender.com";

// ---------- Helpers ----------

function makeRandomAnonName() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `Bruger${n}`;
}

// Fisher–Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Lower score = shown earlier
// ✅ FIX: stats can be undefined during initial load; guard it.
function scoreCardForQuiz(card: Flashcard, stats?: StatsMap | null): number {
  const safeStats = stats ?? {};
  const s = safeStats[card.id];
  if (!s || s.seen === 0) return 0;
  const accuracy = s.correct / s.seen;
  return accuracy + s.seen * 0.05;
}

const MAX_STUDENT_CLASS = 60;
const STUDENT_CLASSES = Array.from(
  { length: MAX_STUDENT_CLASS },
  (_, i) => i + 1,
);

// ---------- MAIN COMPONENT ----------

export default function Index() {
  const [authReady, setAuthReady] = useState(false);

  // ✅ Dev override MUST be inside component (hooks rule)
  const [weeklyDevOverride, setWeeklyDevOverride] = useState<WeeklyDevOverride>(
    {
      enabled: false,
    },
  );

  // -------- Flashcards from backend --------
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // -------- Screen & profile --------
  const [screen, setScreen] = useState<Screen>("home");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const classLabel = useMemo(() => {
    if (profile?.classId == null) return "";
    return `Behandler ${profile.classId}`;
  }, [profile]);

  const { personalStats, markCard, resetPersonalStats } = useStats();

  // ✅ Don’t compute-and-ignore
  const personalTotals = useMemo(
    () => getPersonalTotals(personalStats),
    [personalStats],
  );
  // (personalTotals is currently unused in this file, but computed correctly.)

  // Profile edit state (used by your existing ProfileScreen)
  const [profileEditNickname, setProfileEditNickname] = useState("");
  const [profileEditClassId, setProfileEditClassId] = useState<number | null>(
    null,
  );
  const [profileEditRole, setProfileEditRole] = useState<UserRole | null>(null);
  const [profileEditGender, setProfileEditGender] = useState<Gender | null>(
    null,
  );
  const [profileEditRegion, setProfileEditRegion] = useState<Region | null>(
    null,
  );

  // -------- Subject selection --------
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // -------- Quiz state --------
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [history, setHistory] = useState<Flashcard[]>([]);
  const [upcoming, setUpcoming] = useState<Flashcard[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // -------- Drug calc state --------
  const [selectedDrugTopics, setSelectedDrugTopics] = useState<DrugCalcTopic[]>(
    [],
  );
  const [currentDrugQuestion, setCurrentDrugQuestion] =
    useState<DrugCalcQuestionV2 | null>(null);
  const [drugAnswer, setDrugAnswer] = useState("");
  const [drugAnswerStatus, setDrugAnswerStatus] = useState<
    "neutral" | "correct" | "incorrect"
  >("neutral");

  // -------- Contact form state --------
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [weeklyMcqLocked, setWeeklyMcqLocked] = useState(false);
  const [weeklyMatchLocked, setWeeklyMatchLocked] = useState(false);
  const [weeklyWordLocked, setWeeklyWordLocked] = useState(false);

  // -------- Responsive typography --------
  const { width: screenWidth } = useWindowDimensions();
  const baseWidth = 375;
  const scale = Math.min(screenWidth / baseWidth, 1.2);

  const headingFont = 40 * scale;
  const subtitleFont = 20 * scale;
  const buttonFont = 18 * scale;
  const subjectFont = 18 * scale;
  const metaFont = 15 * scale;
  const questionFont = 22 * scale;
  const answerFont = 17 * scale;

  // -------- Load profile from storage (NO auto-create anymore) --------
  useEffect(() => {
    (async () => {
      const stored = await loadStoredProfile();

      if (stored) {
        const loadedProfile: UserProfile = {
          userId: stored.userId,
          nickname: stored.nickname,
          role: null,
          gender: null,
          region: null,
          classId: stored.classId ?? null,
          isAnonymous: stored.isAnonymous,
        };

        setProfile(loadedProfile);

        // Prep edit fields
        setProfileEditNickname(loadedProfile.nickname);
        setProfileEditClassId(loadedProfile.classId);
        setProfileEditRole(loadedProfile.role);
        setProfileEditGender(loadedProfile.gender);
        setProfileEditRegion(loadedProfile.region);

        setScreen("home");
        return;
      }

      // No stored profile => show AuthScreen (user chooses anon or create profile)
      setProfile(null);
      setScreen("auth");
    })();
  }, []);

  // 🔐 Firebase Auth bootstrap (always ensure we have a Firebase uid)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.error("Anonymous sign-in failed", e);
        }
        return;
      }

      setAuthReady(true);

      // If we already have a stored profile loaded, but its userId is null,
      // patch it with the real Firebase uid and persist.
      const uid = user.uid;
      setProfile((prev) => {
        if (!prev) return prev;
        if (prev.userId === uid) return prev;
        return { ...prev, userId: uid };
      });

      // Persist patch if needed (best-effort)
      try {
        const stored = await loadStoredProfile();
        if (stored && (!stored.userId || stored.userId !== uid)) {
          const patched: StoredUserProfile = {
            ...stored,
            userId: uid,
          };
          await saveStoredProfile(patched);
        }
      } catch (e) {
        console.warn("Failed to patch stored profile userId", e);
      }
    });

    return unsubscribe;
  }, []);

  // When entering profile screen, sync edit fields with current profile
  useEffect(() => {
    if (screen === "profile" && profile) {
      setProfileEditNickname(profile.nickname);
      setProfileEditClassId(profile.classId);
      setProfileEditRole(profile.role);
      setProfileEditGender(profile.gender);
      setProfileEditRegion(profile.region);
    }
  }, [screen, profile]);

  // -------- Load cards from Firestore --------
  useEffect(() => {
    if (!authReady) return;

    let cancelled = false;

    const withTimeout = async <T,>(p: Promise<T>, ms: number) => {
      return await Promise.race<T>([
        p,
        new Promise<T>((_, reject) =>
          setTimeout(
            () => reject(new Error(`Firestore timeout after ${ms}ms`)),
            ms,
          ),
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
        console.error("Failed to fetch flashcards from Firestore", err);
        if (!cancelled) {
          setLoadError(
            err?.message ?? "Kunne ikke hente flashcards fra Firestore.",
          );
        }
      } finally {
        if (!cancelled) setLoadingCards(false);
      }
    }

    loadFromFirestore();

    return () => {
      cancelled = true;
    };
  }, [authReady]);

  // -------- Subjects, topics, etc. --------
  const subjects = useMemo(() => {
    if (!cards || cards.length === 0) return [];
    return Array.from(new Set(cards.map((c) => c.subject))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [cards]);

  const cardsForSelectedSubject = useMemo(() => {
    if (!selectedSubject) return [];
    return cards.filter((c) => c.subject === selectedSubject);
  }, [selectedSubject, cards]);

  const topicGroupsForSelectedSubject: TopicGroup[] = useMemo(() => {
    if (!selectedSubject) return [];
    const map = new Map<string, Set<string>>();

    for (const c of cardsForSelectedSubject) {
      const topic = c.topic ?? "Ukendt";
      const sub = c.subtopic ?? "";
      if (!map.has(topic)) map.set(topic, new Set());
      if (sub) map.get(topic)!.add(sub);
    }

    return Array.from(map.entries())
      .map(([topic, subSet]) => ({
        topic,
        subtopics: Array.from(subSet).sort(),
      }))
      .sort((a, b) => a.topic.localeCompare(b.topic));
  }, [selectedSubject, cardsForSelectedSubject]);

  const allSelectableKeys = useMemo(() => {
    const keys: string[] = [];
    for (const group of topicGroupsForSelectedSubject) {
      if (group.subtopics.length === 0) {
        keys.push(`${group.topic}::<ALL>`);
      } else {
        for (const sub of group.subtopics) {
          keys.push(`${group.topic}::${sub}`);
        }
      }
    }
    return keys;
  }, [topicGroupsForSelectedSubject]);

  const allTopicsSelected =
    allSelectableKeys.length > 0 &&
    selectedKeys.length === allSelectableKeys.length;

  const effectiveCardsForQuiz = useMemo(() => {
    if (!selectedSubject) return [];
    if (selectedKeys.length === 0) return cardsForSelectedSubject;

    return cardsForSelectedSubject.filter((card) => {
      const topic = card.topic ?? "";
      const sub = card.subtopic ?? "";
      const topicKey = `${topic}::<ALL>`;
      const subKey = `${topic}::${sub}`;
      return selectedKeys.includes(subKey) || selectedKeys.includes(topicKey);
    });
  }, [selectedSubject, selectedKeys, cardsForSelectedSubject]);

  // ---------- Quiz control ----------

  const handleStartQuiz = () => {
    if (!selectedSubject) {
      Alert.alert("Vælg fag", "Du skal vælge et fag først.");
      return;
    }

    if (effectiveCardsForQuiz.length === 0) {
      Alert.alert(
        "Ingen spørgsmål",
        "Der er ingen kort i de valgte emner. Prøv at vælge et andet emne eller alle emner.",
      );
      return;
    }

    // ✅ FIX: personalStats can be undefined during initial load
    const statsSafe = (personalStats ?? {}) as any;

    const scored = effectiveCardsForQuiz.map((card) => ({
      card,
      score: scoreCardForQuiz(card, statsSafe),
    }));

    scored.sort((a, b) => a.score - b.score);
    const orderedCards = scored.map((x) => x.card);
    const deck = shuffle(orderedCards);
    const [first, ...rest] = deck;

    setHistory([]);
    setUpcoming(rest);
    setCurrentCard(first);
    setShowAnswer(false);
    setScreen("quiz");
  };

  const handleStartAllSubjectsQuiz = () => {
    if (!cards || cards.length === 0) {
      Alert.alert("Ingen kort", "Der er ingen flashcards at quizze i endnu.");
      return;
    }

    // ✅ FIX: personalStats can be undefined during initial load
    const statsSafe = (personalStats ?? {}) as any;

    const scored = cards.map((card) => ({
      card,
      score: scoreCardForQuiz(card, statsSafe),
    }));

    scored.sort((a, b) => a.score - b.score);
    const orderedCards = scored.map((x) => x.card);
    const deck = shuffle(orderedCards);
    const [first, ...rest] = deck;

    setSelectedSubject(null);
    setSelectedKeys([]);
    setHistory([]);
    setUpcoming(rest);
    setCurrentCard(first);
    setShowAnswer(false);
    setScreen("quiz");
  };

  // ... (rest of your file is unchanged)
  // KEEP EVERYTHING BELOW EXACTLY AS YOU HAD IT

  const handleNextQuestion = () => {
    if (!currentCard) return;

    if (upcoming.length === 0) {
      Alert.alert("Slut", "Du har været igennem alle spørgsmål i denne runde.");
      return;
    }

    setHistory((prev) => [...prev, currentCard]);
    setCurrentCard(upcoming[0]);
    setUpcoming((prev) => prev.slice(1));
    setShowAnswer(false);
  };

  const handlePreviousQuestion = () => {
    if (!currentCard || history.length === 0) return;

    const newHistory = [...history];
    const previous = newHistory.pop()!;

    setHistory(newHistory);
    setUpcoming((prev) => [currentCard, ...prev]);
    setCurrentCard(previous);
    setShowAnswer(true);
  };

  const handleHome = () => {
    setScreen("home");
    setCurrentCard(null);
    setShowAnswer(false);
    setHistory([]);
    setUpcoming([]);
  };

  // ---------- Report error via MailComposer ----------
  const handleReportError = async () => {
    if (!currentCard) return;

    const subject = `[${APP_ID}] Fejl i kort ${
      (currentCard as any).id
    } – ${(currentCard as any).question?.slice?.(0, 80) ?? ""}`;

    const bodyLines = [
      "Hej Nikolai,",
      "",
      "Jeg vil gerne rapportere en fejl i FlashMedic.",
      "",
      `Kort-ID: ${(currentCard as any).id}`,
      `Fag: ${(currentCard as any).subject ?? "Ukendt"}`,
      `Emne: ${(currentCard as any).topic ?? "Ukendt"}${
        (currentCard as any).subtopic
          ? " · " + (currentCard as any).subtopic
          : ""
      }`,
      "",
      "Spørgsmål:",
      (currentCard as any).question ?? "",
      "",
      "Svar:",
      (currentCard as any).answer ?? "",
      "",
      "Min kommentar til fejlen / forbedringsforslag:",
      "",
      "",
      "— Automatisk sendt fra FlashMedic appen",
    ];

    const body = bodyLines.join("\n");

    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (isAvailable) {
        await MailComposer.composeAsync({
          recipients: [SUPPORT_EMAIL],
          subject,
          body,
        });
        return;
      }
    } catch (err) {
      console.warn("MailComposer failed, falling back to mailto:", err);
    }

    const mailtoSubject = encodeURIComponent(subject);
    const mailtoBody = encodeURIComponent(body);
    const url = `mailto:${SUPPORT_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;
    Linking.openURL(url);
  };

  const handleSendContactEmail = async () => {
    if (!contactMessage.trim()) {
      Alert.alert("Besked mangler", "Skriv en besked, før du sender.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/contact/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.trim() || "Ukendt bruger",
          email: contactEmail.trim() || "Ikke oplyst",
          message: contactMessage.trim(),
        }),
      });

      if (!res.ok) throw new Error("Server error");

      Alert.alert("Sendt!", "Din besked er sendt til udvikleren.");

      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Fejl",
        "Kunne ikke sende beskeden. Tjek internetforbindelsen og prøv igen.",
      );
    }
  };

  // ---------- Spaced repetition actions ----------
  const handleMarkKnown = () => {
    if (!currentCard) return;
    markCard((currentCard as any).id, true);
    handleNextQuestion();
  };

  const handleMarkUnknown = () => {
    if (!currentCard) return;
    markCard((currentCard as any).id, false);
    setUpcoming((prev) => [...prev, currentCard]);
    handleNextQuestion();
  };

  const handleResetStats = () => {
    Alert.alert(
      "Nulstil statistik",
      "Er du sikker på, at du vil slette al statistik?",
      [
        { text: "Annuller", style: "cancel" },
        {
          text: "Ja, nulstil",
          style: "destructive",
          onPress: () => resetPersonalStats(),
        },
      ],
    );
  };

  // ---------- Drug calc helpers ----------
  function normalizeTopicIds(input: any[]): string[] {
    return (input ?? [])
      .map((t) => {
        if (typeof t === "string") return t;
        if (t && typeof t === "object") {
          if (typeof (t as any).id === "string") return (t as any).id;
          if (typeof (t as any).key === "string") return (t as any).key;
          if (typeof (t as any).topicId === "string") return (t as any).topicId;
        }
        return null;
      })
      .filter(Boolean) as string[];
  }

  const startDrugCalcPractice = (topics: any[]) => {
    const topicIds = normalizeTopicIds(topics);
    setSelectedDrugTopics(topicIds as unknown as DrugCalcTopic[]);
    setCurrentDrugQuestion(
      generateDrugCalcQuestion(topicIds as unknown as DrugCalcTopic[]),
    );
    setDrugAnswer("");
    setDrugAnswerStatus("neutral");
    setScreen("drugCalcPractice");
  };

  const checkDrugAnswer = () => {
    if (!currentDrugQuestion) {
      Alert.alert("Ingen spørgsmål", "Start en opgave først.");
      return;
    }

    const normalized = drugAnswer.trim().replace(",", ".");

    if (!normalized) {
      Alert.alert("Manglende svar", "Skriv et svar først.");
      return;
    }

    const parsed = Number(normalized);

    if (!Number.isFinite(parsed)) {
      Alert.alert("Ugyldigt svar", "Skriv et gyldigt tal.");
      return;
    }

    const isCorrect = isDrugAnswerCorrect(
      parsed,
      currentDrugQuestion.correctAnswer,
      currentDrugQuestion.tolerance,
    );

    setDrugAnswerStatus(isCorrect ? "correct" : "incorrect");
  };

  const nextDrugQuestion = () => {
    setCurrentDrugQuestion(generateDrugCalcQuestion(selectedDrugTopics));
    setDrugAnswer("");
    setDrugAnswerStatus("neutral");
  };

  // ---------- AuthScreen actions ----------
  const persistAndEnterApp = async (nickname: string, isAnonymous: boolean) => {
    const uid = auth.currentUser?.uid ?? null;

    const newProfile: UserProfile = {
      userId: uid,
      nickname,
      role: null,
      gender: null,
      region: null,
      classId: null,
      isAnonymous,
    };

    setProfile(newProfile);
    setProfileEditNickname(newProfile.nickname);
    setProfileEditClassId(newProfile.classId);
    setProfileEditRole(newProfile.role);
    setProfileEditGender(newProfile.gender);
    setProfileEditRegion(newProfile.region);

    const toStore: StoredUserProfile = {
      userId: uid,
      nickname: newProfile.nickname,
      classId: newProfile.classId,
      isAnonymous: newProfile.isAnonymous,
    };

    await saveStoredProfile(toStore);
    setScreen("home");
  };

  // ---------- SCREENS ----------
  // (everything below unchanged)
  if (screen === "auth") {
    return (
      <AuthScreen
        headingFont={headingFont}
        subtitleFont={subtitleFont}
        buttonFont={buttonFont}
        suggestedAnonName={makeRandomAnonName()}
        onContinueAnonymous={(nick) => persistAndEnterApp(nick, true)}
        onCreateProfile={(nick) => persistAndEnterApp(nick, false)}
      />
    );
  }

  if (screen === "weeklyDev") {
    return (
      <WeeklyDevScreen
        headingFont={headingFont}
        buttonFont={buttonFont}
        onBack={() => setScreen("home")}
        onStartGame={({ kind, weekKey, round }) => {
          setWeeklyDevOverride({
            enabled: true,
            kind,
            weekKey,
            round,
          });

          if (kind === "mcq") setScreen("weeklyMcq");
          if (kind === "match") setScreen("weeklyMatch");
          if (kind === "word") setScreen("weeklyWord");
        }}
        onClearDevOverride={() => setWeeklyDevOverride({ enabled: false })}
      />
    );
  }

  if (screen === "stats") {
    return (
      <StatsScreen
        headingFont={headingFont}
        buttonFont={buttonFont}
        subtitleFont={subtitleFont}
        cards={cards}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "quiz" && currentCard) {
    return (
      <QuizScreen
        currentCard={currentCard}
        historyCount={history.length}
        upcomingCount={upcoming.length}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        headingFont={headingFont}
        buttonFont={buttonFont}
        subjectFont={subjectFont}
        metaFont={metaFont}
        questionFont={questionFont}
        answerFont={answerFont}
        onPrevious={handlePreviousQuestion}
        onHome={handleHome}
        onMarkKnown={handleMarkKnown}
        onMarkUnknown={handleMarkUnknown}
        onReportError={handleReportError}
      />
    );
  }

  if (screen === "flashcardsHome") {
    return (
      <FlashcardsHomeScreen
        headingFont={headingFont}
        buttonFont={buttonFont}
        metaFont={metaFont}
        subjects={subjects}
        loadingCards={loadingCards}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        topicGroupsForSelectedSubject={topicGroupsForSelectedSubject}
        allSelectableKeys={allSelectableKeys}
        allTopicsSelected={allTopicsSelected}
        cardsForSelectedSubjectCount={cardsForSelectedSubject.length}
        onBack={() => setScreen("home")}
        onStartQuiz={handleStartQuiz}
      />
    );
  }

  if (screen === "weeklyHome") {
    return (
      <WeeklyHomeScreen
        headingFont={headingFont}
        subtitleFont={subtitleFont}
        buttonFont={buttonFont}
        weeklyMcqLocked={weeklyMcqLocked}
        weeklyMatchLocked={weeklyMatchLocked}
        weeklyWordLocked={weeklyWordLocked}
        onBackToHome={() => setScreen("home")}
        onOpenMcq={() => setScreen("weeklyMcq")}
        onOpenMatch={() => setScreen("weeklyMatch")}
        onOpenWord={() => setScreen("weeklyWord")}
      />
    );
  }

  if (screen === "weeklyMcq") {
    return (
      <WeeklyMcqScreen
        headingFont={headingFont}
        buttonFont={buttonFont}
        weeklyMcqLocked={weeklyMcqLocked}
        setWeeklyMcqLocked={setWeeklyMcqLocked}
        profileNickname={profile?.nickname}
        onBack={() => {
          setScreen("weeklyHome");
        }}
        devWeekKey={
          weeklyDevOverride.enabled && weeklyDevOverride.kind === "mcq"
            ? weeklyDevOverride.weekKey
            : null
        }
      />
    );
  }

  if (screen === "weeklyMatch") {
    return (
      <WeeklyMatchScreen
        headingFont={headingFont}
        buttonFont={buttonFont}
        weeklyMatchLocked={weeklyMatchLocked}
        setWeeklyMatchLocked={setWeeklyMatchLocked}
        profileNickname={profile?.nickname}
        onBack={() => setScreen("weeklyHome")}
        devWeekKey={
          weeklyDevOverride.enabled && weeklyDevOverride.kind === "match"
            ? weeklyDevOverride.weekKey
            : null
        }
      />
    );
  }

  if (screen === "weeklyWord") {
    return (
      <WeeklyWordScreen
        headingFont={headingFont}
        buttonFont={buttonFont}
        weeklyWordLocked={weeklyWordLocked}
        setWeeklyWordLocked={setWeeklyWordLocked}
        profileNickname={profile?.nickname}
        onBack={() => setScreen("weeklyHome")}
        devWeekKey={
          weeklyDevOverride.enabled && weeklyDevOverride.kind === "word"
            ? weeklyDevOverride.weekKey
            : null
        }
      />
    );
  }

  if (screen === "contact") {
    return (
      <ContactScreen
        headingFont={headingFont}
        buttonFont={buttonFont}
        apiBaseUrl={API_BASE_URL}
        contactName={contactName}
        setContactName={setContactName}
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        contactMessage={contactMessage}
        setContactMessage={setContactMessage}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "profile") {
    return (
      <ProfileScreen
        headingFont={headingFont}
        subtitleFont={subtitleFont}
        buttonFont={buttonFont}
        firebaseUid={auth.currentUser?.uid ?? null}
        profile={profile}
        setProfile={setProfile}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "drugCalcHome") {
    return (
      <DrugCalcHomeScreen
        headingFont={headingFont}
        subtitleFont={subtitleFont}
        buttonFont={buttonFont}
        onBackHome={() => setScreen("home")}
        onStartPractice={startDrugCalcPractice}
        onOpenTheory={() => setScreen("drugCalcTheory")}
      />
    );
  }

  if (screen === "drugCalcPractice") {
    return (
      <DrugCalcPracticeScreen
        headingFont={headingFont}
        subtitleFont={subtitleFont}
        buttonFont={buttonFont}
        currentDrugQuestion={currentDrugQuestion}
        drugAnswer={drugAnswer}
        setDrugAnswer={setDrugAnswer}
        drugAnswerStatus={drugAnswerStatus}
        onCheckAnswer={checkDrugAnswer}
        onNextQuestion={nextDrugQuestion}
        onBack={() => setScreen("drugCalcHome")}
        availableTopics={DRUG_TOPICS}
        selectedTopics={selectedDrugTopics}
        setSelectedTopics={setSelectedDrugTopics}
        onStartWithTopics={startDrugCalcPractice}
      />
    );
  }

  if (screen === "drugCalcTheory") {
    return (
      <DrugCalcTheoryScreen
        headingFont={headingFont}
        subtitleFont={subtitleFont}
        buttonFont={buttonFont}
        onBack={() => setScreen("drugCalcHome")}
      />
    );
  }

  // HOME
  return (
    <HomeScreen
      headingFont={headingFont}
      subtitleFont={subtitleFont}
      loadingCards={loadingCards}
      loadError={loadError}
      profileNickname={profile?.nickname ?? null}
      profileIsAnonymous={!!profile?.isAnonymous}
      classLabel={classLabel}
      appLogo={APP_LOGO}
      onOpenProfile={() => setScreen("profile")}
      onOpenWeeklyHome={() => setScreen("weeklyHome")}
      onOpenWeeklyDev={() => setScreen("weeklyDev")}
      onOpenFlashcardsHome={() => setScreen("flashcardsHome")}
      onStartAllSubjectsQuiz={handleStartAllSubjectsQuiz}
      onOpenDrugCalcHome={() => setScreen("drugCalcHome")}
      onOpenStats={() => setScreen("stats")}
      onOpenContact={() => setScreen("contact")}
      disableAllSubjectsQuiz={loadingCards || cards.length === 0}
    />
  );
}
