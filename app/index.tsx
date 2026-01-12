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

type UserProfile = {
  userId: string | null;
  nickname: string;

  role: UserRole | null;
  gender: Gender | null;
  region: Region | null;

  classId: number | null; // only relevant if role === "student"
  isAnonymous: boolean;
};

type UserRole = "student" | "ambulancebehandler" | "paramediciner" | "laegeassistent";

type Gender = "male" | "female" | "not_specified";

type Region = "hovedstaden" | "sjaelland" | "syddanmark" | "midtjylland" | "nordjylland" | "oestdanmark";

type DrugCalcQuestion = {
  id: number;
  text: string;
  correctAnswer: number;
  unit?: string;
  hint?: string;
};

// ---------- App identity ----------

const APP_ID = "FlashMedic";
const SUPPORT_EMAIL = "nikolai_91@live.com";

const APP_LOGO = require("../assets/her-icon.png");

const API_BASE_URL = "https://flashmedic-backend.onrender.com";

// ---------- Helpers ----------

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
function scoreCardForQuiz(card: Flashcard, stats: StatsMap): number {
  const s = stats[card.id];
  if (!s || s.seen === 0) return 0;
  const accuracy = s.correct / s.seen;
  return accuracy + s.seen * 0.05;
}

const MAX_STUDENT_CLASS = 60;
const STUDENT_CLASSES = Array.from({ length: MAX_STUDENT_CLASS }, (_, i) => i + 1);

// ---------- Drug calc question generator ----------

let drugCalcCounter = 1;

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDrugCalcQuestion(): DrugCalcQuestion {
  const type = randInt(1, 3);

  if (type === 1) {
    // Tablet calculation
    const tabletStrength = 75;
    const numTablets = randInt(2, 6);
    const dose = tabletStrength * numTablets;
    return {
      id: drugCalcCounter++,
      text: `Du skal give ${dose} mg ASA som tabletter á ${tabletStrength} mg.\nHvor mange tabletter skal du give?`,
      correctAnswer: numTablets,
      unit: "tabletter",
    };
  }

  if (type === 2) {
    // mg/mL → mL
    const strength = [2, 5, 10][randInt(0, 2)]; // mg/mL
    const ml = randInt(2, 10);
    const dose = strength * ml;
    return {
      id: drugCalcCounter++,
      text: `En opløsning indeholder ${strength} mg/mL.\nDu skal give ${dose} mg.\nHvor mange mL skal du give?`,
      correctAnswer: ml,
      unit: "mL",
    };
  }

  // type 3: glucose %
  const percent = [5, 10, 20][randInt(0, 2)];
  const volume = [100, 250, 500][randInt(0, 2)];
  const grams = (percent / 100) * volume; // g per 100 mL
  return {
    id: drugCalcCounter++,
    text: `Du har en glukose ${percent}% opløsning.\nHvor mange gram glukose er der i ${volume} mL?`,
    correctAnswer: grams,
    unit: "g",
    hint: "Husk: X% = X g pr. 100 mL.",
  };
}

function isDrugAnswerCorrect(user: number, correct: number): boolean {
  const diff = Math.abs(user - correct);
  if (diff < 0.01) return true;
  if (Math.round(user) === Math.round(correct)) return true;
  return false;
}

// ---------- MAIN COMPONENT ----------

export default function Index() {
  const [authReady, setAuthReady] = useState(false);

  // -------- Flashcards from backend --------
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // -------- Screen & profile --------
  const [screen, setScreen] = useState<Screen>("home");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const classLabel = useMemo(() => {
    if (!profile?.classId) return "";
    return `Behandler ${profile.classId}`;
  }, [profile]);

  const {
    personalStats,
    markCard,
    resetPersonalStats,
    // weeklyGlobal,
    // loadingWeekly,
    // refreshWeeklyGlobal,
  } = useStats();

  // Not required right now, but harmless to keep around if StatsScreen uses it later
  useMemo(() => getPersonalTotals(personalStats), [personalStats]);

  // Profile edit state
  const [profileEditNickname, setProfileEditNickname] = useState("");
  const [profileEditClassId, setProfileEditClassId] = useState<number | null>(null);
  const [profileEditRole, setProfileEditRole] = useState<UserRole | null>(null);
  const [profileEditGender, setProfileEditGender] = useState<Gender | null>(null);
  const [profileEditRegion, setProfileEditRegion] = useState<Region | null>(null);

  // -------- Subject selection --------
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // -------- Quiz state --------
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [history, setHistory] = useState<Flashcard[]>([]);
  const [upcoming, setUpcoming] = useState<Flashcard[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // -------- Drug calc state --------
  const [currentDrugQuestion, setCurrentDrugQuestion] = useState<DrugCalcQuestion | null>(null);
  const [drugAnswer, setDrugAnswer] = useState("");
  const [drugAnswerStatus, setDrugAnswerStatus] = useState<"neutral" | "correct" | "incorrect">("neutral");

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

  // -------- Load profile from storage or create anonymous --------
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
          classId: stored.classId,
          isAnonymous: stored.isAnonymous,
        };

        setProfile(loadedProfile);
        setProfileEditNickname(loadedProfile.nickname);
        setProfileEditClassId(loadedProfile.classId);
        setProfileEditRole(loadedProfile.role);
        setProfileEditGender(loadedProfile.gender);
        setProfileEditRegion(loadedProfile.region);
        return;
      }

      const randomId = Math.floor(1000 + Math.random() * 9000);
      const anon: UserProfile = {
        userId: null,
        nickname: `Bruger${randomId}`,
        role: null,
        gender: null,
        region: null,
        classId: null,
        isAnonymous: true,
      };

      setProfile(anon);
      setProfileEditNickname(anon.nickname);
      setProfileEditClassId(anon.classId);

      const storedAnon: StoredUserProfile = {
        userId: null,
        nickname: anon.nickname,
        classId: anon.classId,
        isAnonymous: true,
      };
      await saveStoredProfile(storedAnon);
    })();
  }, []);

  // 🔐 Firebase Auth bootstrap
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

      const uid = user.uid;

      setProfile((prev) =>
        prev
          ? { ...prev, userId: uid }
          : {
              userId: uid,
              nickname: "Bruger",
              role: null,
              gender: null,
              region: null,
              classId: null,
              isAnonymous: true,
            },
      );

      setAuthReady(true);
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
        console.error("Failed to fetch flashcards from Firestore", err);
        if (!cancelled) {
          setLoadError(err?.message ?? "Kunne ikke hente flashcards fra Firestore.");
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
    return Array.from(new Set(cards.map((c) => c.subject))).sort((a, b) => a.localeCompare(b));
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
    allSelectableKeys.length > 0 && selectedKeys.length === allSelectableKeys.length;

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

    const scored = effectiveCardsForQuiz.map((card) => ({
      card,
      score: scoreCardForQuiz(card, personalStats),
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

    const scored = cards.map((card) => ({
      card,
      score: scoreCardForQuiz(card, personalStats),
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
    // ✅ FIX: you no longer have image modal state in index.tsx
  };

  const handlePreviousQuestion = () => {
    if (!currentCard || history.length === 0) return;

    const newHistory = [...history];
    const previous = newHistory.pop()!;

    setHistory(newHistory);
    setUpcoming((prev) => [currentCard, ...prev]);
    setCurrentCard(previous);
    setShowAnswer(true);
    // ✅ FIX: you no longer have image modal state in index.tsx
  };

  const handleHome = () => {
    setScreen("home");
    setCurrentCard(null);
    setShowAnswer(false);
    setHistory([]);
    setUpcoming([]);
    // ✅ FIX: you no longer have image modal state in index.tsx
  };

  // ---------- Report error via MailComposer ----------
  const handleReportError = async () => {
    if (!currentCard) return;

    const subject = `[${APP_ID}] Fejl i kort ${currentCard.id} – ${currentCard.question.slice(0, 80)}`;

    const bodyLines = [
      "Hej Nikolai,",
      "",
      "Jeg vil gerne rapportere en fejl i FlashMedic.",
      "",
      `Kort-ID: ${currentCard.id}`,
      `Fag: ${currentCard.subject ?? "Ukendt"}`,
      `Emne: ${currentCard.topic ?? "Ukendt"}${currentCard.subtopic ? " · " + currentCard.subtopic : ""}`,
      "",
      "Spørgsmål:",
      currentCard.question,
      "",
      "Svar:",
      currentCard.answer,
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
      Alert.alert("Fejl", "Kunne ikke sende beskeden. Tjek internetforbindelsen og prøv igen.");
    }
  };

  // ---------- Spaced repetition actions ----------

  const handleMarkKnown = () => {
    if (!currentCard) return;
    markCard(currentCard.id, true);
    handleNextQuestion();
  };

  const handleMarkUnknown = () => {
    if (!currentCard) return;

    markCard(currentCard.id, false);
    setUpcoming((prev) => [...prev, currentCard]);
    handleNextQuestion();
  };

  const handleResetStats = () => {
    Alert.alert("Nulstil statistik", "Er du sikker på, at du vil slette al statistik?", [
      { text: "Annuller", style: "cancel" },
      {
        text: "Ja, nulstil",
        style: "destructive",
        onPress: () => resetPersonalStats(),
      },
    ]);
  };

  // ---------- Drug calc helpers ----------

  const startDrugCalcPractice = () => {
    setCurrentDrugQuestion(generateDrugCalcQuestion());
    setDrugAnswer("");
    setDrugAnswerStatus("neutral");
    setScreen("drugCalcPractice");
  };

  const checkDrugAnswer = () => {
    if (!currentDrugQuestion) return;
    const parsed = parseFloat(drugAnswer.replace(",", "."));
    if (isNaN(parsed)) {
      Alert.alert("Ups", "Skriv et tal som svar.");
      return;
    }
    if (isDrugAnswerCorrect(parsed, currentDrugQuestion.correctAnswer)) {
      setDrugAnswerStatus("correct");
    } else {
      setDrugAnswerStatus("incorrect");
    }
  };

  const nextDrugQuestion = () => {
    setCurrentDrugQuestion(generateDrugCalcQuestion());
    setDrugAnswer("");
    setDrugAnswerStatus("neutral");
  };

  // ---------- SCREENS ----------

  if (screen === "weeklyDev") {
    return <WeeklyDevScreen headingFont={headingFont} buttonFont={buttonFont} onBack={() => setScreen("home")} />;
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
        onBack={() => setScreen("weeklyHome")}
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
        buttonFont={buttonFont}
        firebaseUid={auth.currentUser?.uid ?? null}
        setProfile={setProfile}
        saveStoredProfile={saveStoredProfile}
        profileEditNickname={profileEditNickname}
        setProfileEditNickname={setProfileEditNickname}
        profileEditRole={profileEditRole}
        setProfileEditRole={setProfileEditRole}
        profileEditClassId={profileEditClassId}
        setProfileEditClassId={setProfileEditClassId}
        profileEditRegion={profileEditRegion}
        setProfileEditRegion={setProfileEditRegion}
        profileEditGender={profileEditGender}
        setProfileEditGender={setProfileEditGender}
        STUDENT_CLASSES={STUDENT_CLASSES}
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
