import Constants from "expo-constants";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import * as MailComposer from "expo-mail-composer";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import {
  loadStoredProfile,
  saveStoredProfile,
  type StoredUserProfile,
} from "../src/services/userService";

import { ekgImageLookup } from "../src/data/ekg/imageLookup";
import { loadStats, saveStats, updateStatsForCard } from "../src/storage/stats";
import type { Difficulty, Flashcard } from "../src/types/Flashcard";

import WeeklyHomeScreen from "../src/features/weekly/WeeklyHomeScreen";
import WeeklyMatchScreen from "../src/features/weekly/WeeklyMatchScreen";
import WeeklyMcqScreen from "../src/features/weekly/WeeklyMcqScreen";
import WeeklyWordScreen from "../src/features/weekly/WeeklyWordScreen";

import { styles } from "./flashmedicStyles";

// ---------- Types ----------

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
  userId: string | null; // NEW
  nickname: string;
  classId: number | null;
  isAnonymous: boolean;
};

type DrugCalcQuestion = {
  id: number;
  text: string;
  correctAnswer: number;
  unit?: string;
  hint?: string;
};

type WeeklyMcqOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type WeeklyMcqQuestion = {
  id: string;
  text: string;
  options: WeeklyMcqOption[];
};

type WeeklyMatchPair = {
  id: string;
  left: string;
  right: string;
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

const difficultyTextMap: Record<Difficulty, string> = {
  easy: "Let",
  medium: "Mellem",
  hard: "Svær",
};

const difficultyColorMap: Record<Difficulty, string> = {
  easy: "#12b886",
  medium: "#fab005",
  hard: "#fa5252",
};

// Lower score = shown earlier
function scoreCardForQuiz(card: Flashcard, stats: StatsMap): number {
  const s = stats[card.id];
  if (!s || s.seen === 0) return 0;
  const accuracy = s.correct / s.seen;
  return accuracy + s.seen * 0.05;
}

const BEHANDLER_CLASSES = Array.from({ length: 30 - 14 + 1 }, (_, i) => 14 + i).map(
  (n) => `Behandler ${n}`,
);

const WEEKLY_WORD_TIME_LIMIT = 30; // sekunder

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

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
  // -------- Flashcards from backend --------
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // -------- Screen & profile --------
  const [screen, setScreen] = useState<Screen>("home");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Profile edit state (must be top-level hooks!)
  const [profileEditNickname, setProfileEditNickname] = useState("");
  const [profileEditClassId, setProfileEditClassId] = useState<number | null>(null);

  // -------- Subject selection --------
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]); // topic::<ALL> or topic::subtopic

  // -------- Quiz state --------
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [history, setHistory] = useState<Flashcard[]>([]);
  const [upcoming, setUpcoming] = useState<Flashcard[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // -------- Image modal --------
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // -------- Stats --------
  const [stats, setStats] = useState<StatsMap>({});

  // -------- Drug calc state --------
  const [currentDrugQuestion, setCurrentDrugQuestion] = useState<DrugCalcQuestion | null>(null);
  const [drugAnswer, setDrugAnswer] = useState("");
  const [drugAnswerStatus, setDrugAnswerStatus] = useState<"neutral" | "correct" | "incorrect">(
    "neutral",
  );

  // -------- Contact form state --------
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [weeklyMcqLocked, setWeeklyMcqLocked] = useState(false);
  const [weeklyMatchLocked, setWeeklyMatchLocked] = useState(false);
  const [weeklyWordLocked, setWeeklyWordLocked] = useState(false);

  // -------- Responsive typography --------
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
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
      // Try to load a stored profile (with userId etc.)
      const stored = await loadStoredProfile();

      if (stored) {
        const loadedProfile: UserProfile = {
          userId: stored.userId,
          nickname: stored.nickname,
          classId: stored.classId,
          isAnonymous: stored.isAnonymous,
        };
        setProfile(loadedProfile);
        setProfileEditNickname(loadedProfile.nickname);
        setProfileEditClassId(loadedProfile.classId);
        return;
      }

      // No stored profile → create local anonymous one (no backend id yet)
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const anon: UserProfile = {
        userId: null,
        nickname: `Bruger${randomId}`,
        classId: null,
        isAnonymous: true,
      };
      setProfile(anon);
      setProfileEditNickname(anon.nickname);
      setProfileEditClassId(anon.classId);

      // Also store this anonymous profile so it sticks across sessions
      const storedAnon: StoredUserProfile = {
        userId: null,
        nickname: anon.nickname,
        classId: anon.classId,
        isAnonymous: true,
      };
      await saveStoredProfile(storedAnon);
    })();
  }, []);

  // When entering profile screen, sync edit fields with current profile
  useEffect(() => {
    if (screen === "profile" && profile) {
      setProfileEditNickname(profile.nickname);
      setProfileEditClassId(profile.classId);
    }
  }, [screen, profile]);

  const classLabel = useMemo(() => {
    if (!profile?.classId) return "";
    return `Behandler ${profile.classId}`;
  }, [profile]);

  // -------- Load stats --------
  useEffect(() => {
    (async () => {
      const loaded = await loadStats();
      setStats(loaded);
    })();
  }, []);

  // -------- Load cards from backend --------
  useEffect(() => {
    let cancelled = false;

    async function loadFromBackend() {
      try {
        setLoadError(null);
        setLoadingCards(true);

        const res = await fetch(`${API_BASE_URL}/flashcards/all`);

        const text = await res.text(); // read raw text first
        console.log("FLASHCARDS RAW RESPONSE", text);

        const data = JSON.parse(text);

        const rawCards = Array.isArray(data) ? data : data.cards ?? [];

        const hydrated: Flashcard[] = rawCards.map((c: any) => {
          if (c.imageKey && ekgImageLookup[c.imageKey]) {
            return { ...c, image: ekgImageLookup[c.imageKey] };
          }
          return c;
        });

        if (!cancelled) {
          setCards(hydrated);
          setLoadingCards(false);
          setLoadError(null);
        }
      } catch (err) {
        console.error("Failed to fetch flashcards", err);
        if (!cancelled) {
          setLoadError("Kunne ikke hente flashcards fra serveren.");
          setLoadingCards(false);
        }
      }
    }

    loadFromBackend();

    return () => {
      cancelled = true;
    };
  }, []);

  // -------- Derived stats --------
  const { totalSeen, totalCorrect, totalIncorrect, accuracy } = useMemo(() => {
    let seen = 0;
    let correct = 0;
    let incorrect = 0;
    for (const s of Object.values(stats)) {
      seen += s.seen;
      correct += s.correct;
      incorrect += s.incorrect;
    }
    const acc = seen > 0 ? (correct / seen) * 100 : 0;
    return {
      totalSeen: seen,
      totalCorrect: correct,
      totalIncorrect: incorrect,
      accuracy: acc,
    };
  }, [stats]);

  // Subject-wise stats (personal)
  const subjectStats = useMemo(() => {
    const map = new Map<string, { seen: number; correct: number }>();

    for (const [cardId, s] of Object.entries(stats)) {
      const card = cards.find((c) => c.id === cardId);
      if (!card) continue;
      const subject = card.subject || "Ukendt";
      const entry = map.get(subject) ?? { seen: 0, correct: 0 };
      entry.seen += s.seen;
      entry.correct += s.correct;
      map.set(subject, entry);
    }

    return Array.from(map.entries())
      .map(([subject, { seen, correct }]) => ({
        subject,
        seen,
        correct,
        accuracy: seen > 0 ? (correct / seen) * 100 : 0,
      }))
      .sort((a, b) => a.subject.localeCompare(b.subject));
  }, [stats, cards]);

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

  // ---------- Subject / theme colors ----------

  const getSubjectGradient = (subject: string) => {
    switch (subject) {
      case "Anatomi og fysiologi":
      case "Farmakologi":
      case "Kliniske parametre":
      case "Mikrobiologi":
      case "Sygdomslære":
      case "EKG":
      case "Traumatologi og ITLS":
        return ["#343a40", "#1c7ed6"];
      default:
        return ["#343a40", "#1c7ed6"];
    }
  };

  const getSubjectPrimaryColor = (subject?: string | null) => {
    if (!subject) return "#1c7ed6";
    const [primary] = getSubjectGradient(subject);
    return primary;
  };

  const getDifficultyColor = (difficulty: Difficulty) =>
    difficultyColorMap[difficulty] ?? "#868e96";

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
      score: scoreCardForQuiz(card, stats),
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
      score: scoreCardForQuiz(card, stats),
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
    setImageModalVisible(false);
  };

  const handlePreviousQuestion = () => {
    if (!currentCard || history.length === 0) return;

    const newHistory = [...history];
    const previous = newHistory.pop()!;

    setHistory(newHistory);
    setUpcoming((prev) => [currentCard, ...prev]);
    setCurrentCard(previous);
    setShowAnswer(true);
    setImageModalVisible(false);
  };

  const handleHome = () => {
    setScreen("home");
    setCurrentCard(null);
    setShowAnswer(false);
    setHistory([]);
    setUpcoming([]);
    setImageModalVisible(false);
  };

  // ---------- Report error via MailComposer ----------

  const handleReportError = async () => {
    if (!currentCard) return;

    const subject = `[${APP_ID}] Fejl i kort ${currentCard.id} – ${currentCard.question.slice(
      0,
      80,
    )}`;

    const bodyLines = [
      "Hej Nikolai,",
      "",
      "Jeg vil gerne rapportere en fejl i FlashMedic.",
      "",
      `Kort-ID: ${currentCard.id}`,
      `Fag: ${currentCard.subject ?? "Ukendt"}`,
      `Emne: ${currentCard.topic ?? "Ukendt"}${
        currentCard.subtopic ? " · " + currentCard.subtopic : ""
      }`,
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

      if (!res.ok) {
        throw new Error("Server error");
      }

      Alert.alert("Sendt!", "Din besked er sendt til udvikleren.");

      // Ryd felterne efter succesfuldt send
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

    setStats((prev) => {
      const updated = updateStatsForCard(prev, currentCard.id, true);
      saveStats(updated);
      return updated;
    });

    handleNextQuestion();
  };

  const handleMarkUnknown = () => {
    if (!currentCard) return;

    setStats((prev) => {
      const updated = updateStatsForCard(prev, currentCard.id, false);
      saveStats(updated);
      return updated;
    });

    setUpcoming((prev) => [...prev, currentCard]);
    handleNextQuestion();
  };

  const handleResetStats = () => {
    Alert.alert("Nulstil statistik", "Er du sikker på, at du vil slette al statistik?", [
      { text: "Annuller", style: "cancel" },
      {
        text: "Ja, nulstil",
        style: "destructive",
        onPress: () => {
          const empty: StatsMap = {};
          setStats(empty);
          saveStats(empty);
        },
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

  // STATS
  if (screen === "stats") {
    return (
      <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.homeContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>
              Statistik
            </Text>
            <Pressable
              style={[styles.smallButton, { borderColor: "#fff" }]}
              onPress={() => setScreen("home")}
              hitSlop={8}
            >
              <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
                Home
              </Text>
            </Pressable>
          </View>

          {/* Global weekly challenge stats (placeholder until backend) */}
          <View style={styles.statsCard}>
            <Text style={styles.statsSectionTitle}>Global statistik – Weekly Challenge</Text>
            <Text style={styles.statsLabel}>
              Rangliste (top 10 – kun weekly challenges, placeholder data)
            </Text>
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={i} style={styles.statsRankRow}>
                <Text style={styles.statsRankPosition}>{i + 1}.</Text>
                <Text style={styles.statsRankName}>
                  ParamedNick{i + 1} <Text style={styles.statsRankClass}>· Behandler 17</Text>
                </Text>
                <Text style={styles.statsRankScore}>{100 - i * 5} pts</Text>
              </View>
            ))}

            <Pressable
              style={[styles.smallButton, { marginTop: 12, alignSelf: "flex-start" }]}
              onPress={() =>
                Alert.alert(
                  "Historik",
                  "Historik over weekly challenges kommer, når backend er klar.",
                )
              }
            >
              <Text style={[styles.smallButtonText, { color: "#343a40" }]}>Se weekly historik</Text>
            </Pressable>
          </View>

          {/* Personal overall stats */}
          <View style={[styles.statsCard, { marginTop: 20 }]}>
            <Text style={styles.statsSectionTitle}>Personlig statistik – samlet</Text>
            <Text style={styles.statsLabel}>Antal besvarede spørgsmål</Text>
            <Text style={styles.statsValue}>{totalSeen}</Text>

            <View style={styles.statsRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.statsLabel}>Korrekte</Text>
                <Text style={styles.statsGood}>{totalCorrect}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statsLabel}>Forkerte</Text>
                <Text style={styles.statsBad}>{totalIncorrect}</Text>
              </View>
            </View>

            <Text style={[styles.statsLabel, { marginTop: 16 }]}>Samlet træfsikkerhed</Text>
            <Text style={styles.statsAccuracy}>
              {isNaN(accuracy) ? "0%" : `${accuracy.toFixed(1)}%`}
            </Text>
          </View>

          {/* Per-subject stats */}
          <View style={[styles.statsCard, { marginTop: 20 }]}>
            <Text style={styles.statsSectionTitle}>Personlig statistik – pr. fag</Text>
            {subjectStats.length === 0 ? (
              <Text style={styles.statsLabel}>Ingen data endnu.</Text>
            ) : (
              subjectStats.map((s) => (
                <View key={s.subject} style={styles.subjectStatsRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.subjectStatsTitle}>{s.subject}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subjectStatsSub}>Set: {s.seen}</Text>
                    <Text style={styles.subjectStatsSub}>
                      Treff: {isNaN(s.accuracy) ? "0%" : `${s.accuracy.toFixed(1)}%`}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <Pressable
            style={[
              styles.bigButton,
              {
                backgroundColor: "#c92a2a",
                alignSelf: "stretch",
                marginTop: 24,
              },
            ]}
            onPress={handleResetStats}
          >
            <Text style={[styles.bigButtonText, { fontSize: buttonFont, color: "#fff" }]}>
              Nulstil statistik
            </Text>
          </Pressable>
        </ScrollView>
      </LinearGradient>
    );
  }

  // QUIZ
  if (screen === "quiz" && currentCard) {
    const primaryColor = getSubjectPrimaryColor(currentCard.subject);
    const difficultyText = difficultyTextMap[currentCard.difficulty];
    const gradient = getSubjectGradient(currentCard.subject);

    const totalQuestions = history.length + 1 + upcoming.length;
    const currentIndex = history.length + 1;

    // Compute zoom style for rotated image based on real image size
    let zoomImageStyle: any = styles.zoomImage;

    if (imageSize) {
      const sw = screenWidth;
      const sh = screenHeight;

      const { width: iw, height: ih } = imageSize;

      // After 90° rotation: rotatedWidth = ih, rotatedHeight = iw
      const rotatedWidth = ih;
      const rotatedHeight = iw;

      // Scale so that rotated box fits within screen
      const fitScale = Math.min(sw / rotatedWidth, sh / rotatedHeight);

      // Shrink slightly so edges are clearly visible
      const marginScale = 0.94; // 94% of max size – tweak if you want
      const finalScale = fitScale * marginScale;

      const displayWidth = iw * finalScale;
      const displayHeight = ih * finalScale;

      zoomImageStyle = [styles.zoomImage, { width: displayWidth, height: displayHeight }];
    }

    return (
      <LinearGradient colors={gradient} style={styles.quizBackground}>
        <StatusBar style="light" />
        <View style={styles.quizContainer}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.appTitle, { color: "#fff", marginBottom: 0, fontSize: headingFont }]}
            >
              FlashMedic
            </Text>
            <View style={styles.headerButtons}>
              {history.length > 0 && (
                <Pressable
                  style={[styles.smallButton, { borderColor: "#fff" }]}
                  onPress={handlePreviousQuestion}
                  hitSlop={8}
                >
                  <Text
                    style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}
                  >
                    Tilbage
                  </Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.smallButton, { borderColor: "#fff" }]}
                onPress={handleHome}
                hitSlop={8}
              >
                <Text
                  style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}
                >
                  Home
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View>
              <Text style={[styles.subjectLabel, { color: "#f8f9fa", fontSize: subjectFont }]}>
                {currentCard.subject}
              </Text>
              <Text style={[styles.topicLabel, { color: "#e9ecef", fontSize: metaFont }]}>
                {currentCard.topic}
                {currentCard.subtopic ? ` · ${currentCard.subtopic}` : ""}
              </Text>
              <Text style={[styles.progressText, { color: "#e9ecef", fontSize: metaFont }]}>
                Spørgsmål {currentIndex} af {totalQuestions}
              </Text>
            </View>
            <View
              style={[
                styles.difficultyPill,
                { backgroundColor: getDifficultyColor(currentCard.difficulty) },
              ]}
            >
              <Text style={[styles.difficultyText, { fontSize: buttonFont * 0.9 }]}>
                {difficultyText}
              </Text>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.cardBox}>
              {currentCard.image && (
                <Pressable
                  onPress={() => {
                    const imgSource = currentCard.image as any;
                    const resolved = Image.resolveAssetSource(imgSource);

                    // Bundled asset: width/height available directly
                    if (resolved?.width && resolved?.height) {
                      setImageSize({ width: resolved.width, height: resolved.height });
                      setImageModalVisible(true);
                      return;
                    }

                    // URI or unknown: use Image.getSize
                    Image.getSize(
                      resolved?.uri ?? imgSource,
                      (width, height) => {
                        setImageSize({ width, height });
                        setImageModalVisible(true);
                      },
                      () => {
                        // fallback guess if we really can't get size
                        setImageSize({ width: 1600, height: 1000 });
                        setImageModalVisible(true);
                      },
                    );
                  }}
                >
                  {/* Thumbnail: same as original – NOT rotated */}
                  <Image
                    source={currentCard.image}
                    style={styles.questionImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.tapToZoomText}>Tryk for at se stort</Text>
                </Pressable>
              )}

              <Text style={[styles.questionText, { fontSize: questionFont }]}>
                {currentCard.question}
              </Text>
            </View>

            <View style={styles.cardBox}>
              {showAnswer ? (
                <Text style={[styles.answerText, { fontSize: answerFont }]}>
                  {currentCard.answer}
                </Text>
              ) : (
                <Text style={styles.placeholderText}>
                  Tryk på &apos;Vis svar&apos; for at se svaret.
                </Text>
              )}
            </View>
          </View>

          {!showAnswer && (
            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.bigButton, styles.primaryButton, { backgroundColor: primaryColor }]}
                onPress={() => setShowAnswer(true)}
              >
                <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>Vis svar</Text>
              </Pressable>
            </View>
          )}

          {showAnswer && (
            <View style={styles.ratingRow}>
              <Pressable
                style={[styles.ratingButton, styles.knownButton]}
                onPress={handleMarkKnown}
              >
                <Text style={[styles.ratingButtonText, { fontSize: buttonFont }]}>
                  Jeg kunne den
                </Text>
              </Pressable>
              <Pressable
                style={[styles.ratingButton, styles.unknownButton]}
                onPress={handleMarkUnknown}
              >
                <Text style={[styles.ratingButtonText, { fontSize: buttonFont }]}>
                  Jeg kunne den ikke
                </Text>
              </Pressable>
            </View>
          )}

          <Pressable style={[styles.bigButton, styles.outlineButton]} onPress={handleReportError}>
            <Text style={styles.outlineButtonText}>Rapportér fejl</Text>
          </Pressable>
        </View>

        {currentCard.image && (
          <Modal
            visible={imageModalVisible}
            transparent={false}
            animationType="fade"
            onRequestClose={() => setImageModalVisible(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                <Image source={currentCard.image} style={zoomImageStyle} resizeMode="contain" />

                <Pressable
                  style={styles.modalCloseButton}
                  onPress={() => setImageModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Luk</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
      </LinearGradient>
    );
  }

  // FLASHCARDS HOME
  if (screen === "flashcardsHome") {
    return (
      <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.homeContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>
              Flashcards
            </Text>
            <Pressable
              style={[styles.smallButton, { borderColor: "#fff" }]}
              onPress={() => setScreen("home")}
              hitSlop={8}
            >
              <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
                Home
              </Text>
            </Pressable>
          </View>

          <View style={styles.subjectGrid}>
            {subjects.map((subject) => (
              <Pressable
                key={subject}
                onPress={() => {
                  setSelectedSubject((prev) => (prev === subject ? null : subject));
                  setSelectedKeys([]);
                }}
              >
                <Text
                  style={[
                    styles.homeNavButtonText,
                    selectedSubject === subject && { textDecorationLine: "underline" },
                  ]}
                >
                  {subject}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedSubject && (
            <View style={styles.topicSection}>
              <View style={styles.topicHeaderRow}>
                <Text style={[styles.topicTitle, { fontSize: metaFont }]}>
                  Emner i {selectedSubject}
                </Text>
                {topicGroupsForSelectedSubject.length > 0 && (
                  <Pressable
                    onPress={() =>
                      allTopicsSelected ? setSelectedKeys([]) : setSelectedKeys(allSelectableKeys)
                    }
                    hitSlop={8}
                  >
                    <Text style={styles.topicLink}>
                      {allTopicsSelected ? "Fravælg alle" : "Vælg alle"}
                    </Text>
                  </Pressable>
                )}
              </View>

              {topicGroupsForSelectedSubject.length === 0 ? (
                <Text style={styles.topicEmptyText}>Ingen emner fundet for dette fag.</Text>
              ) : (
                <View style={styles.topicGroupList}>
                  {topicGroupsForSelectedSubject.map((group) => {
                    const groupKeys =
                      group.subtopics.length === 0
                        ? [`${group.topic}::<ALL>`]
                        : group.subtopics.map((sub) => `${group.topic}::${sub}`);
                    const groupSelected = groupKeys.every((k) => selectedKeys.includes(k));

                    return (
                      <View key={group.topic} style={styles.topicGroup}>
                        {group.subtopics.length > 0 && (
                          <Text
                            style={[
                              styles.topicGroupTitle,
                              groupSelected && styles.topicGroupTitleSelected,
                            ]}
                            onPress={() => {
                              if (groupSelected) {
                                setSelectedKeys((prev) =>
                                  prev.filter((k) => !groupKeys.includes(k)),
                                );
                              } else {
                                setSelectedKeys((prev) =>
                                  Array.from(new Set([...prev, ...groupKeys])),
                                );
                              }
                            }}
                          >
                            {group.topic}
                          </Text>
                        )}

                        <View style={styles.subtopicRow}>
                          {group.subtopics.length === 0 ? (
                            <Pressable
                              onPress={() =>
                                setSelectedKeys((prev) =>
                                  prev.includes(`${group.topic}::<ALL>`)
                                    ? prev.filter((k) => k !== `${group.topic}::<ALL>`)
                                    : [...prev, `${group.topic}::<ALL>`],
                                )
                              }
                              style={[
                                styles.topicChip,
                                selectedKeys.includes(`${group.topic}::<ALL>`) &&
                                  styles.topicChipSelected,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.topicChipText,
                                  selectedKeys.includes(`${group.topic}::<ALL>`) &&
                                    styles.topicChipTextSelected,
                                ]}
                              >
                                {group.topic}
                              </Text>
                            </Pressable>
                          ) : (
                            group.subtopics.map((sub) => {
                              const key = `${group.topic}::${sub}`;
                              const selected = selectedKeys.includes(key);
                              const isNested = sub.includes("::");
                              const displayName = isNested ? sub.split("::")[1] : sub;

                              return (
                                <Pressable
                                  key={key}
                                  onPress={() =>
                                    setSelectedKeys((prev) =>
                                      prev.includes(key)
                                        ? prev.filter((k) => k !== key)
                                        : [...prev, key],
                                    )
                                  }
                                  style={[
                                    styles.topicChip,
                                    selected && styles.topicChipSelected,
                                    isNested && {
                                      marginLeft: 24,
                                      backgroundColor: "#f1f3f5",
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.topicChipText,
                                      selected && styles.topicChipTextSelected,
                                      isNested && {
                                        fontSize: 13,
                                        color: "#495057",
                                      },
                                    ]}
                                  >
                                    {displayName}
                                  </Text>
                                </Pressable>
                              );
                            })
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              <Pressable
                style={[styles.bigButton, { backgroundColor: "#1c7ed6", marginTop: 20 }]}
                onPress={handleStartQuiz}
                disabled={loadingCards || cardsForSelectedSubject.length === 0}
              >
                <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>
                  {selectedKeys.length === 0
                    ? "Start quiz i alle emner"
                    : "Start quiz i valgte emner"}
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    );
  }

  // WEEKLY HOME
  if (screen === "weeklyHome") {
    return (
      <WeeklyHomeScreen
        headingFont={headingFont}
        subtitleFont={subtitleFont}
        buttonFont={buttonFont}
        weeklyMcqLocked={weeklyMcqLocked}
        weeklyMatchLocked={weeklyMatchLocked}
        weeklyWordLocked={weeklyWordLocked}
        profileNickname={profile?.nickname}
        onBackToHome={() => setScreen("home")}
        onOpenMcq={() => setScreen("weeklyMcq")}
        onOpenMatch={() => setScreen("weeklyMatch")}
        onOpenWord={() => setScreen("weeklyWord")}
      />
    );
  }

  // WEEKLY – MULTIPLE CHOICE GAME
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

  // WEEKLY – MATCH GAME
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

  // WEEKLY – WORD OF THE WEEK
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

  // CONTACT
  if (screen === "contact") {
    const appName = Constants.expoConfig?.name ?? "FlashMedic";
    const appVersion = Constants.expoConfig?.version ?? "ukendt version";

    const deviceInfoParts = [
      Device.manufacturer,
      Device.modelName,
      Device.osName,
      Device.osVersion,
    ].filter(Boolean);

    const deviceInfo = deviceInfoParts.join(" ");

    const handleSend = async () => {
      if (!contactMessage.trim()) {
        Alert.alert("Fejl", "Skriv venligst en besked.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/contact/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: contactName.trim() || null,
            email: contactEmail.trim() || null,
            message: contactMessage.trim(),
            appName,
            appVersion,
            platform: Platform.OS,
            deviceInfo,
          }),
        });

        if (!res.ok) {
          throw new Error("Serverfejl");
        }

        Alert.alert("Tak!", "Din besked er sendt til serveren.");
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      } catch (err) {
        Alert.alert("Fejl", "Kunne ikke sende beskeden. Prøv igen.");
      }
    };

    return (
      <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
        <StatusBar style="light" />

        <ScrollView
          contentContainerStyle={[
            styles.safeTopContainer ?? styles.homeContainer,
            {
              paddingTop: 80,
              paddingHorizontal: 16,
              paddingBottom: 40,
              alignItems: "flex-start",
            },
          ]}
        >
          <View style={{ width: "100%", maxWidth: 700 }}>
            <View style={styles.headerRow}>
              <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>
                Kontakt os
              </Text>
              <Pressable
                style={[styles.smallButton, { borderColor: "#ffffffdd" }]}
                onPress={() => setScreen("home")}
              >
                <Text
                  style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}
                >
                  Tilbage
                </Text>
              </Pressable>
            </View>

            {/* EXISTING subtitle – keep this */}
            <Text
              style={[
                styles.statsLabel,
                {
                  marginTop: 12,
                  marginBottom: 8,
                  color: "#f1f3f5",
                },
              ]}
            >
              Denne besked bliver sendt til FlashMedic-teamet via serveren.
              {"\n"}
              App: {appName} – v{appVersion}
              {"\n"}
              Enhed: {deviceInfo || "Ukendt enhed"} ({Platform.OS})
            </Text>

            {/* NEW: app description paragraph under subtitle */}
            <Text
              style={[
                styles.statsLabel,
                {
                  marginBottom: 8,
                  color: "#f8f9fa",
                  fontSize: 24,
                },
              ]}
            >
              Denne app er lavet af en ambulancebehandlerelev og er rettet mod både elever og
              færdiguddannede, som vil øve sig i anatomi, medicin, EKG og meget mere.
              {"\n\n"}
              Ris, ros og konstruktiv kritik modtages meget gerne – det hjælper med at gøre appen
              bedre for alle.
            </Text>

            <Text style={[styles.statsLabel, { marginTop: 24 }]}>Navn (valgfri)</Text>
            <TextInput
              value={contactName}
              onChangeText={setContactName}
              style={[styles.textInput, { width: "100%" }]}
              placeholder="Fx Nikolai"
              placeholderTextColor="#adb5bd"
            />

            <Text style={[styles.statsLabel, { marginTop: 16 }]}>Email (valgfri)</Text>
            <TextInput
              value={contactEmail}
              onChangeText={setContactEmail}
              style={[styles.textInput, { width: "100%" }]}
              placeholder="Fx nikolai@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#adb5bd"
            />

            <Text style={[styles.statsLabel, { marginTop: 16 }]}>Besked</Text>
            <TextInput
              value={contactMessage}
              onChangeText={setContactMessage}
              style={[
                styles.textInput,
                {
                  width: "100%",
                  height: 140,
                  textAlignVertical: "top",
                },
              ]}
              placeholder="Skriv din besked her..."
              placeholderTextColor="#adb5bd"
              multiline
            />

            <Pressable
              style={[
                styles.bigButton,
                styles.primaryButton,
                {
                  marginTop: 24,
                  alignSelf: "flex-start",
                },
              ]}
              onPress={handleSend}
            >
              <Text style={styles.bigButtonText}>SEND</Text>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  // PROFILE
  if (screen === "profile") {
    const saveProfile = async () => {
      const nickname = profileEditNickname.trim();

      if (!nickname) {
        Alert.alert("Navn mangler", "Vælg et kaldenavn.");
        return;
      }

      try {
        let userId = profile?.userId ?? null;

        // If we don't yet have a backend user, register one
        if (!userId) {
          const result = await registerUserOnBackend(nickname, profileEditClassId);
          userId = result.userId;
        }

        const newProfile: UserProfile = {
          userId,
          nickname,
          classId: profileEditClassId,
          isAnonymous: false,
        };

        setProfile(newProfile);

        const stored: StoredUserProfile = {
          userId,
          nickname,
          classId: profileEditClassId,
          isAnonymous: false,
        };
        await saveStoredProfile(stored);

        setScreen("home");
      } catch (err) {
        console.error(err);
        Alert.alert(
          "Fejl",
          "Kunne ikke gemme profil på serveren. Tjek netværket og prøv igen. Din lokale profil er stadig gemt.",
        );

        // Fallback: at least store locally without userId
        const fallbackProfile: UserProfile = {
          userId: profile?.userId ?? null,
          nickname,
          classId: profileEditClassId,
          isAnonymous: false,
        };
        setProfile(fallbackProfile);
        const stored: StoredUserProfile = {
          userId: fallbackProfile.userId,
          nickname,
          classId: profileEditClassId,
          isAnonymous: false,
        };
        await saveStoredProfile(stored);
      }
    };

    return (
      <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.homeContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>
              Profil
            </Text>
            <Pressable
              style={[styles.smallButton, { borderColor: "#fff" }]}
              onPress={() => setScreen("home")}
              hitSlop={8}
            >
              <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
                Home
              </Text>
            </Pressable>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsSectionTitle}>Vælg kaldenavn</Text>
            <TextInput
              value={profileEditNickname}
              onChangeText={setProfileEditNickname}
              placeholder="Fx ParamedNick"
              placeholderTextColor="#adb5bd"
              style={styles.textInput}
            />

            <Text style={[styles.statsSectionTitle, { marginTop: 16 }]}>Vælg hold / klasse</Text>
            <View style={styles.classList}>
              {BEHANDLER_CLASSES.map((label) => {
                const num = parseInt(label.replace("Behandler ", ""), 10);
                const selected = profileEditClassId === num;
                return (
                  <Pressable
                    key={label}
                    onPress={() => setProfileEditClassId(num)}
                    style={[styles.classChip, selected && styles.classChipSelected]}
                  >
                    <Text style={[styles.classChipText, selected && styles.classChipTextSelected]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[
                styles.bigButton,
                { backgroundColor: "#1c7ed6", marginTop: 24, alignSelf: "stretch" },
              ]}
              onPress={saveProfile}
            >
              <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>Gem profil</Text>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  // DRUG CALC HOME
  if (screen === "drugCalcHome") {
    return (
      <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.homeContainer}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Lægemiddelregning
            </Text>
            <Pressable
              style={[styles.smallButton, { borderColor: "#fff" }]}
              onPress={() => setScreen("home")}
              hitSlop={8}
            >
              <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
                Home
              </Text>
            </Pressable>
          </View>

          <Text
            style={[
              styles.subtitle,
              {
                fontSize: subtitleFont,
                color: "#e9ecef",
                textAlign: "left",
                alignSelf: "flex-start",
              },
            ]}
          >
            Træn doser, styrker, mængder og procentregning.
          </Text>

          <View style={styles.homeButtonsContainer}>
            <Pressable style={styles.homeNavButton} onPress={startDrugCalcPractice}>
              <Text style={styles.homeNavButtonText}>Opgaver</Text>
            </Pressable>
            <Pressable style={styles.homeNavButton} onPress={() => setScreen("drugCalcTheory")}>
              <Text style={styles.homeNavButtonText}>Teori</Text>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  // DRUG CALC PRACTICE
  if (screen === "drugCalcPractice") {
    return (
      <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.homeContainer}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Lægemiddelregning
              </Text>
              <View style={styles.subHeaderRow}>
                <Text style={[styles.subHeaderText, { fontSize: subtitleFont }]}>Opgaver</Text>
              </View>
            </View>
            <Pressable
              style={[styles.smallButton, { borderColor: "#fff" }]}
              onPress={() => setScreen("drugCalcHome")}
              hitSlop={8}
            >
              <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
                Tilbage
              </Text>
            </Pressable>
          </View>

          <View style={[styles.statsCard, { alignSelf: "stretch" }]}>
            <Text style={styles.statsSectionTitle}>Spørgsmål</Text>
            <Text style={styles.drugQuestionText}>
              {currentDrugQuestion?.text ?? "Ingen spørgsmål – tryk på Næste spørgsmål."}
            </Text>
            {currentDrugQuestion?.hint && (
              <Text style={styles.drugHintText}>{currentDrugQuestion.hint}</Text>
            )}

            <View
              style={[
                styles.drugAnswerBox,
                drugAnswerStatus === "correct" && styles.drugAnswerBoxCorrect,
                drugAnswerStatus === "incorrect" && styles.drugAnswerBoxIncorrect,
              ]}
            >
              <TextInput
                value={drugAnswer}
                onChangeText={setDrugAnswer}
                placeholder="Skriv dit svar"
                placeholderTextColor="#adb5bd"
                keyboardType="numeric"
                style={styles.textInput}
              />
              {currentDrugQuestion?.unit && (
                <Text style={styles.drugUnitText}>{currentDrugQuestion.unit}</Text>
              )}
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                style={[
                  styles.bigButton,
                  styles.primaryButton,
                  { backgroundColor: "#1c7ed6", flex: 1 },
                ]}
                onPress={checkDrugAnswer}
              >
                <Text style={styles.bigButtonText}>Tjek svar</Text>
              </Pressable>
            </View>

            {drugAnswerStatus !== "neutral" && (
              <View style={styles.buttonRow}>
                <Pressable
                  style={[
                    styles.bigButton,
                    styles.secondaryButton,
                    { backgroundColor: "#495057", flex: 1 },
                  ]}
                  onPress={nextDrugQuestion}
                >
                  <Text style={styles.bigButtonText}>Næste spørgsmål</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  // DRUG CALC THEORY
  if (screen === "drugCalcTheory") {
    return (
      <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={[styles.homeContainer, styles.safeTopContainer]}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Lægemiddelregning
              </Text>
              <View style={styles.subHeaderRow}>
                <Text style={[styles.subHeaderText, { fontSize: subtitleFont }]}>Teori</Text>
              </View>
            </View>

            <Pressable
              style={[styles.smallButton, { borderColor: "#fff" }]}
              onPress={() => setScreen("drugCalcHome")}
              hitSlop={8}
            >
              <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
                Tilbage
              </Text>
            </Pressable>
          </View>

          <View style={[styles.statsCard, { alignSelf: "stretch" }]}>
            <Text style={styles.statsSectionTitle}>Grundformler</Text>

            <Text style={styles.drugTheoryText}>
              Dosisregning handler i sin kerne om tre ting:
              {"\n"}
              {"\n"}• D = ordineret dosis (mg eller g){"\n"}• S = styrke (mg/mL, mg/tablet, % osv.)
              {"\n"}• V = volumen (mL eller antal tabletter)
              {"\n"}
              {"\n"}
              De tre hænger altid sammen gennem formlerne:
              {"\n"}D = S × V{"\n"}V = D / S{"\n"}S = D / V{"\n"}
              {"\n"}
              Eksempel: Du skal give 300 mg, præparatet indeholder 100 mg/mL.
              {"\n"}V = 300 / 100 = 3 mL.
            </Text>

            <Text style={[styles.statsSectionTitle, { marginTop: 18 }]}>Tabletter</Text>
            <Text style={styles.drugTheoryText}>
              Tabletberegning er en af de hyppigste former for medicinregning:
              {"\n"}
              {"\n"}
              Antal tabletter = ordineret dosis / mg pr. tablet.
              {"\n"}
              {"\n"}
              Eksempel: Patienten skal have 225 mg Paracetamol, tabletter findes som 75 mg.
              {"\n"}
              Antal tabletter = 225 / 75 = 3 tabletter.
            </Text>

            <Text style={[styles.statsSectionTitle, { marginTop: 18 }]}>
              Stærke opløsninger (mg/mL)
            </Text>
            <Text style={styles.drugTheoryText}>
              Flydende medicin er næsten altid angivet som mg pr. mL.
              {"\n"}
              Husk: mængden du giver afhænger af total dosis.
              {"\n"}
              {"\n"}
              Eksempel: 5 mg/mL og du skal give 20 mg → 20 / 5 = 4 mL.
            </Text>

            <Text style={[styles.statsSectionTitle, { marginTop: 18 }]}>
              Procentregning (glukose, NaCl osv.)
            </Text>
            <Text style={styles.drugTheoryText}>
              En procentopløsning betyder:
              {"\n"}
              X% = X gram pr. 100 mL.
              {"\n"}
              {"\n"}
              Eksempel: 10% glukose = 10 g / 100 mL.
              {"\n"}
              {"\n"}
              500 mL 10% glukose = (10 g / 100 mL) × 500 mL = 50 g.
              {"\n"}
              {"\n"}
              En hurtig huskeregel:
              {"\n"}• 5% = 5 g/100 mL{"\n"}• 10% = 10 g/100 mL{"\n"}• 20% = 20 g/100 mL
            </Text>

            <Text style={[styles.statsSectionTitle, { marginTop: 18 }]}>Dråber → mL</Text>
            <Text style={styles.drugTheoryText}>
              1 mL svarer typisk til 20 dråber (kan variere i praksis).
              {"\n"}
              Bruges især ved infusioner eller øjendråber.
              {"\n"}
              {"\n"}
              Eksempel: 60 dråber = 60 / 20 = 3 mL.
            </Text>

            <Text style={[styles.statsSectionTitle, { marginTop: 18 }]}>
              Infusioner og hastigheder
            </Text>
            <Text style={styles.drugTheoryText}>
              Infusionshastighed regnes som:
              {"\n"}
              mL/time = total volumen / antal timer.
              {"\n"}
              {"\n"}
              Eksempel: 1000 mL over 4 timer → 1000 / 4 = 250 mL/time.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  // HOME
  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        {/* Top row: profile badge */}
        <View style={styles.homeTopRow}>
          <View style={{ flex: 1 }} />
          <Pressable
            style={[styles.profileBadge, profile?.isAnonymous && styles.profileBadgeAnon]}
            onPress={() => setScreen("profile")}
            hitSlop={16}
          >
            <Text style={styles.profileBadgeText}>
              {profile?.isAnonymous ? "Opret profil" : profile?.nickname}
            </Text>
            {!profile?.isAnonymous && classLabel ? (
              <Text style={styles.profileBadgeSub}>{classLabel}</Text>
            ) : null}
          </Pressable>
        </View>

        {/* Icon + title */}
        <Image source={APP_LOGO} style={styles.appLogo} />
        <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>
          FlashMedic
        </Text>
        {loadingCards ? (
          <Text style={[styles.subtitle, { fontSize: subtitleFont, color: "#e9ecef" }]}>
            Indlæser kort fra serveren…
          </Text>
        ) : loadError ? (
          <Text style={[styles.subtitle, { fontSize: subtitleFont, color: "#ffdddd" }]}>
            {loadError}
          </Text>
        ) : (
          <Text style={[styles.subtitle, { fontSize: subtitleFont, color: "#e9ecef" }]}>
            Træn medicin, anatomi, EKG og meget mere.
          </Text>
        )}

        {/* Big centered nav buttons */}
        <View style={styles.homeButtonsContainer}>
          <Pressable style={styles.homeNavButton} onPress={() => setScreen("weeklyHome")}>
            <Text style={styles.homeNavButtonText}>Weekly Challenges</Text>
          </Pressable>

          <Pressable style={styles.homeNavButton} onPress={() => setScreen("flashcardsHome")}>
            <Text style={styles.homeNavButtonText}>Flashcards</Text>
          </Pressable>

          <Pressable
            style={styles.homeNavButton}
            onPress={handleStartAllSubjectsQuiz}
            disabled={loadingCards || cards.length === 0}
          >
            <Text style={styles.homeNavButtonText}>Flashcards i alle fag</Text>
          </Pressable>

          <Pressable style={styles.homeNavButton} onPress={() => setScreen("drugCalcHome")}>
            <Text style={styles.homeNavButtonText}>Lægemiddelregning</Text>
          </Pressable>

          <Pressable style={styles.homeNavButton} onPress={() => setScreen("stats")}>
            <Text style={styles.homeNavButtonText}>Statistik</Text>
          </Pressable>

          <Pressable style={styles.homeNavButton} onPress={() => setScreen("contact")}>
            <Text style={styles.homeNavButtonText}>Kontakt</Text>
          </Pressable>
        </View>

        {/* Made by – ONLY on home */}
        <Text style={styles.madeByText}>Made by Nikolai Louis Kleftås Thaarup</Text>
      </ScrollView>
    </LinearGradient>
  );
}
