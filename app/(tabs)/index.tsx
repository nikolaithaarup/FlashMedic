import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import * as MailComposer from "expo-mail-composer";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { allFlashcards } from "../../src/data/flashcards";
import type { Flashcard, Difficulty } from "../../src/types/Flashcard";
import {
  loadStats,
  saveStats,
  updateStatsForCard,
} from "../../src/storage/stats";

// ---------- Simple types for spaced repetition stats ----------

type CardStats = {
  seen: number;
  correct: number;
  incorrect: number;
  lastSeen: string | null;
};
type StatsMap = Record<string, CardStats>;

type Screen = "home" | "quiz";

type TopicGroup = {
  topic: string;
  subtopics: string[];
};

// ---------- App identity (for mail subject etc.) ----------

const APP_ID = "FlashMedic";
const SUPPORT_EMAIL = "nikolai_91@live.com";

// ---------- Small helpers ----------

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

// Lower score = should be shown earlier
function scoreCardForQuiz(card: Flashcard, stats: StatsMap): number {
  const s = stats[card.id];
  if (!s || s.seen === 0) {
    // Never seen → highest priority
    return 0;
  }
  const accuracy = s.correct / s.seen; // 0–1
  // Higher accuracy & more repetitions → higher score (less urgent)
  return accuracy + s.seen * 0.05;
}

// ---------- Main component ----------

export default function Index() {
  // -------- Screen & selection state --------
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  // selection keys: "topic::<ALL>" or "topic::subtopic"
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // -------- Quiz state --------
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [history, setHistory] = useState<Flashcard[]>([]);
  const [upcoming, setUpcoming] = useState<Flashcard[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // -------- Spaced repetition stats --------
  const [stats, setStats] = useState<StatsMap>({});

  // -------- Responsive typography --------
  const { width } = useWindowDimensions();
  const baseWidth = 375; // iPhone 11-ish
  const scale = Math.min(width / baseWidth, 1.2);

  const headingFont = 40 * scale;
  const subtitleFont = 20 * scale;
  const buttonFont = 18 * scale;
  const subjectFont = 18 * scale;
  const metaFont = 15 * scale;
  const questionFont = 22 * scale;
  const answerFont = 17 * scale;

  // -------- Load stats once on mount --------
  useEffect(() => {
    (async () => {
      const loaded = await loadStats();
      setStats(loaded);
    })();
  }, []);

  // -------- Subject list (automatically from flashcards) --------
  const subjects = useMemo(
    () => Array.from(new Set(allFlashcards.map((c) => c.subject))),
    []
  );

  // Flashcards filtered by selected subject
  const cardsForSelectedSubject = useMemo(() => {
    if (!selectedSubject) return [];
    return allFlashcards.filter((c) => c.subject === selectedSubject);
  }, [selectedSubject]);

  // Build topic + subtopic groups for the subject
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

  // All selectable keys for "Vælg alle"
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

  const toggleAllTopics = () => {
    if (allTopicsSelected) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(allSelectableKeys);
    }
  };

  const toggleTopicKey = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleGroup = (group: TopicGroup) => {
    const groupKeys =
      group.subtopics.length === 0
        ? [`${group.topic}::<ALL>`]
        : group.subtopics.map((sub) => `${group.topic}::${sub}`);

    const groupSelected = groupKeys.every((k) => selectedKeys.includes(k));

    if (groupSelected) {
      setSelectedKeys((prev) => prev.filter((k) => !groupKeys.includes(k)));
    } else {
      setSelectedKeys((prev) =>
        Array.from(new Set([...prev, ...groupKeys]))
      );
    }
  };

  // Cards that will be used in the quiz (subject + topic/subtopic filters)
  const effectiveCardsForQuiz = useMemo(() => {
    if (!selectedSubject) return [];
    if (selectedKeys.length === 0) return cardsForSelectedSubject; // no filters => all

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
    // Blue/grey/olive palette for everything
    switch (subject) {
      case "Anatomi og fysiologi":
        return ["#343a40", "#1c7ed6"]; // blue
      case "Farmakologi":
        return ["#343a40", "#1c7ed6"]; // blue → grey
      case "Kliniske parametre":
        return ["#343a40", "#1c7ed6"]; // teal → dark grey
      case "Mikrobiologi":
        return ["#343a40", "#1c7ed6"]; // blue → desaturated green
      case "Sygdomslære":
        return ["#343a40", "#1c7ed6"]; // dark → medium grey
      case "EKG":
        return ["#343a40", "#1c7ed6"]; // teal → blue
      case "Traumatologi og ITLS":
        return ["#343a40", "#1c7ed6"]; // dark grey → blue
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

  // ---------- Quiz control logic ----------

  const handleStartQuiz = () => {
    if (!selectedSubject) {
      Alert.alert("Vælg fag", "Du skal vælge et fag først.");
      return;
    }

    if (effectiveCardsForQuiz.length === 0) {
      Alert.alert(
        "Ingen spørgsmål",
        "Der er ingen kort i de valgte emner. Prøv at vælge et andet emne eller alle emner."
      );
      return;
    }

    // Score cards so weaker/newer ones come earlier
    const scored = effectiveCardsForQuiz.map((card) => ({
      card,
      score: scoreCardForQuiz(card, stats),
    }));

    scored.sort((a, b) => a.score - b.score); // lower = earlier
    const orderedCards = scored.map((x) => x.card);

    const deck = shuffle(orderedCards);
    const [first, ...rest] = deck;

    setHistory([]);
    setUpcoming(rest);
    setCurrentCard(first);
    setShowAnswer(false);
    setScreen("quiz");
  };

  // 🔥 Quiz i ALLE fag
  const handleStartAllSubjectsQuiz = () => {
    if (allFlashcards.length === 0) {
      Alert.alert("Ingen kort", "Der er ingen flashcards at quizze i endnu.");
      return;
    }

    const scored = allFlashcards.map((card) => ({
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
      Alert.alert(
        "Slut",
        "Du har været igennem alle spørgsmål i denne runde."
      );
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

  // Subject: [FlashMedic] + kort-id + kortet's question (truncated)
  const subject = `[FlashMedic] Fejl i kort ${currentCard.id} – ${currentCard.question.slice(
    0,
    80
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
      // ✅ This opens the system mail composer with the user's preferred mail app
      await MailComposer.composeAsync({
        recipients: ["nikolai_91@live.com"],
        subject,
        body,
      });
      return;
    }
  } catch (err) {
    console.warn("MailComposer failed, falling back to mailto:", err);
  }

  // Fallback: basic mailto-link
  const mailtoSubject = encodeURIComponent(subject);
  const mailtoBody = encodeURIComponent(body);
  const url = `mailto:nikolai_91@live.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  Linking.openURL(url);
};


  // ---------- Spaced repetition actions (no dedicated "Næste" button) ----------

  const handleMarkKnown = () => {
    if (!currentCard) return;

    setStats((prev) => {
      const updated = updateStatsForCard(prev, currentCard.id, true);
      saveStats(updated);
      return updated;
    });

    // Gå automatisk videre til næste spørgsmål
    handleNextQuestion();
  };

  const handleMarkUnknown = () => {
    if (!currentCard) return;

    setStats((prev) => {
      const updated = updateStatsForCard(prev, currentCard.id, false);
      saveStats(updated);
      return updated;
    });

    // Læg kortet bagerst i køen og gå videre
    setUpcoming((prev) => [...prev, currentCard]);
    handleNextQuestion();
  };

  // ------------------ QUIZ SCREEN --------------------
  if (screen === "quiz" && currentCard) {
    const primaryColor = getSubjectPrimaryColor(currentCard.subject);
    const difficultyText = difficultyTextMap[currentCard.difficulty];
    const gradient = getSubjectGradient(currentCard.subject);

    return (
      <LinearGradient colors={gradient} style={styles.quizBackground}>
        <StatusBar style="light" />
        <View style={styles.quizContainer}>
          {/* Top header: logo + navigation */}
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.appTitle,
                { color: "#fff", marginBottom: 0, fontSize: headingFont },
              ]}
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
                    style={[
                      styles.smallButtonText,
                      { color: "#fff", fontSize: buttonFont * 0.9 },
                    ]}
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
                  style={[
                    styles.smallButtonText,
                    { color: "#fff", fontSize: buttonFont * 0.9 },
                  ]}
                >
                  Home
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Subject + topic under each other + difficulty pill */}
          <View style={styles.metaRow}>
            <View>
              <Text
                style={[
                  styles.subjectLabel,
                  { color: "#f8f9fa", fontSize: subjectFont },
                ]}
              >
                {currentCard.subject}
              </Text>
              <Text
                style={[
                  styles.topicLabel,
                  { color: "#e9ecef", fontSize: metaFont },
                ]}
              >
                {currentCard.topic}
                {currentCard.subtopic ? ` · ${currentCard.subtopic}` : ""}
              </Text>
            </View>
            <View
              style={[
                styles.difficultyPill,
                { backgroundColor: getDifficultyColor(currentCard.difficulty) },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { fontSize: buttonFont * 0.9 },
                ]}
              >
                {difficultyText}
              </Text>
            </View>
          </View>

          {/* Question + answer cards */}
          <View style={styles.cardContainer}>
            <View style={styles.cardBox}>
              <Text
                style={[
                  styles.questionText,
                  { fontSize: questionFont },
                ]}
              >
                {currentCard.question}
              </Text>
            </View>

            <View style={styles.cardBox}>
              {showAnswer ? (
                <Text
                  style={[
                    styles.answerText,
                    { fontSize: answerFont },
                  ]}
                >
                  {currentCard.answer}
                </Text>
              ) : (
                <Text style={styles.placeholderText}>
                  Tryk på &apos;Vis svar&apos; for at se svaret.
                </Text>
              )}
            </View>
          </View>

          {/* Big primary button: show answer */}
          {!showAnswer && (
            <View style={styles.buttonRow}>
              <Pressable
                style={[
                  styles.bigButton,
                  styles.primaryButton,
                  { backgroundColor: primaryColor },
                ]}
                onPress={() => setShowAnswer(true)}
              >
                <Text
                  style={[
                    styles.bigButtonText,
                    { fontSize: buttonFont },
                  ]}
                >
                  Vis svar
                </Text>
              </Pressable>
            </View>
          )}

          {/* Rating buttons – only visible after answer is shown */}
          {showAnswer && (
            <View style={styles.ratingRow}>
              <Pressable
                style={[styles.ratingButton, styles.knownButton]}
                onPress={handleMarkKnown}
              >
                <Text
                  style={[
                    styles.ratingButtonText,
                    { fontSize: buttonFont },
                  ]}
                >
                  Jeg kunne den
                </Text>
              </Pressable>
              <Pressable
                style={[styles.ratingButton, styles.unknownButton]}
                onPress={handleMarkUnknown}
              >
                <Text
                  style={[
                    styles.ratingButtonText,
                    { fontSize: buttonFont },
                  ]}
                >
                  Jeg kunne den ikke
                </Text>
              </Pressable>
            </View>
          )}

          {/* Report error */}
          <Pressable
            style={[styles.bigButton, styles.outlineButton]}
            onPress={handleReportError}
          >
            <Text style={styles.outlineButtonText}>Rapportér fejl</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  // ------------------ HOME SCREEN --------------------
  return (
    <LinearGradient
      colors={["#0e91a8ff", "#5e6e7eff"]}
      style={styles.homeBackground}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        {/* App title + subtitle */}
        <Text
          style={[
            styles.appTitle,
            { fontSize: headingFont, color: "#f8f9fa" },
          ]}
        >
          FlashMedic
        </Text>
        <Text
          style={[
            styles.subtitle,
            { fontSize: subtitleFont, color: "#e9ecef" },
          ]}
        >
          Vælg et fag for at træne din medicinske viden.
        </Text>

        {/* Subject tiles */}
        <View style={styles.subjectGrid}>
          {subjects.map((subject) => (
            <Pressable
              key={subject}
              onPress={() => {
                setSelectedSubject((prev) =>
                  prev === subject ? null : subject
                );
                setSelectedKeys([]); // ryd altid valg, når du skifter/lukker et fag
              }}
            >
              <LinearGradient
                colors={getSubjectGradient(subject)}
                style={[
                  styles.subjectTile,
                  selectedSubject === subject && styles.subjectTileSelected,
                ]}
              >
                <Text
                  style={[
                    styles.subjectTileText,
                    { fontSize: subjectFont },
                  ]}
                >
                  {subject}
                </Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        {/* Quiz i alle fag – sort knap */}
        <Pressable
          style={[
            styles.bigButton,
            {
              marginTop: 24,
              alignSelf: "stretch",
              backgroundColor: "#000000",
            },
          ]}
          onPress={handleStartAllSubjectsQuiz}
        >
          <Text
            style={[
              styles.bigButtonText,
              { color: "#ffffff", fontSize: buttonFont },
            ]}
          >
            QUIZ I ALLE FAG
          </Text>
        </Pressable>

        {/* Topic / subtopic selector for selected subject */}
        {selectedSubject && (
          <View style={styles.topicSection}>
            <View style={styles.topicHeaderRow}>
              <Text
                style={[
                  styles.topicTitle,
                  { fontSize: metaFont },
                ]}
              >
                Emner i {selectedSubject}
              </Text>
              {topicGroupsForSelectedSubject.length > 0 && (
                <Pressable onPress={toggleAllTopics} hitSlop={8}>
                  <Text style={styles.topicLink}>
                    {allTopicsSelected ? "Fravælg alle" : "Vælg alle"}
                  </Text>
                </Pressable>
              )}
            </View>

            {topicGroupsForSelectedSubject.length === 0 ? (
              <Text style={styles.topicEmptyText}>
                Ingen emner fundet for dette fag.
              </Text>
            ) : (
              <View style={styles.topicGroupList}>
                {topicGroupsForSelectedSubject.map((group) => {
                  const groupKeys =
                    group.subtopics.length === 0
                      ? [`${group.topic}::<ALL>`]
                      : group.subtopics.map(
                          (sub) => `${group.topic}::${sub}`
                        );
                  const groupSelected = groupKeys.every((k) =>
                    selectedKeys.includes(k)
                  );

                  return (
                    <View key={group.topic} style={styles.topicGroup}>
                      {/* Kun overskrift hvis der faktisk er subemner */}
                      {group.subtopics.length > 0 && (
                        <Text
                          style={[
                            styles.topicGroupTitle,
                            groupSelected && styles.topicGroupTitleSelected,
                          ]}
                          onPress={() => toggleGroup(group)}
                        >
                          {group.topic}
                        </Text>
                      )}

                      <View style={styles.subtopicRow}>
                        {group.subtopics.length === 0 ? (
                          // Ingen subtopics → kun én klikbar chip
                          <Pressable
                            onPress={() =>
                              toggleTopicKey(`${group.topic}::<ALL>`)
                            }
                            style={[
                              styles.topicChip,
                              selectedKeys.includes(
                                `${group.topic}::<ALL>`
                              ) && styles.topicChipSelected,
                            ]}
                          >
                            <Text
                              style={[
                                styles.topicChipText,
                                selectedKeys.includes(
                                  `${group.topic}::<ALL>`
                                ) && styles.topicChipTextSelected,
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
                            const displayName = isNested
                              ? sub.split("::")[1]
                              : sub;

                            return (
                              <Pressable
                                key={key}
                                onPress={() => toggleTopicKey(key)}
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
                                    selected &&
                                      styles.topicChipTextSelected,
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

            {/* Start quiz button for selected subject/emner */}
            <Pressable
              style={[
                styles.bigButton,
                { backgroundColor: "#1c7ed6", marginTop: 20 },
              ]}
              onPress={handleStartQuiz}
            >
              <Text
                style={[
                  styles.bigButtonText,
                  { fontSize: buttonFont },
                ]}
              >
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

// ------------------ STYLES --------------------

const styles = StyleSheet.create({
  homeBackground: {
    flex: 1,
  },
  homeContainer: {
    flexGrow: 1,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  quizBackground: {
    flex: 1,
  },
  quizContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
    alignItems: "center",
  },
  appTitle: {
    fontWeight: "800",
    marginBottom: 12,
    fontFamily: "sans-serif",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#495057",
    marginBottom: 20,
    fontFamily: "System",
    textAlign: "center",
  },
  subjectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  subjectTile: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  subjectTileSelected: {
    borderWidth: 3,
    borderColor: "#f8f9fa",
  },
  subjectTileText: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
    fontFamily: "System",
  },
  cardContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
  },
  cardBox: {
    minHeight: 120,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 0,
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  questionText: {
    fontWeight: "800",
    textAlign: "center",
    fontFamily: "System",
  },
  answerText: {
    textAlign: "center",
    fontFamily: "serif",
  },
  placeholderText: {
    fontSize: 15,
    color: "#dee2e6",
    textAlign: "center",
  },
  bigButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 150,
    alignItems: "center",
    marginVertical: 10,
  },
  primaryButton: { backgroundColor: "#1c7ed6" },
  secondaryButton: { backgroundColor: "#495057" },
  bigButtonText: { color: "#fff", fontWeight: "800" },
  smallButton: {
    borderWidth: 1,
    borderColor: "#343a40",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginLeft: 8,
  },
  smallButtonText: { color: "#343a40", fontWeight: "500" },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#f1f3f5",
    backgroundColor: "transparent",
    marginTop: 8,
  },
  outlineButtonText: { color: "#f1f3f5", fontWeight: "600" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  subjectLabel: { fontWeight: "700" },
  topicLabel: {
    marginTop: 2,
  },
  metaRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  difficultyPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  difficultyText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 10,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 10,
    marginTop: 4,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  knownButton: {
    backgroundColor: "#e6fcf5",
    borderWidth: 1,
    borderColor: "#12b886",
  },
  unknownButton: {
    backgroundColor: "#fff4e6",
    borderWidth: 1,
    borderColor: "#f08c00",
  },
  ratingButtonText: {
    fontWeight: "600",
    color: "#212529",
  },
  topicSection: {
    marginTop: 24,
    width: "100%",
  },
  topicHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  topicTitle: {
    fontWeight: "600",
    color: "#f8f9fa",
  },
  topicLink: {
    fontSize: 14,
    color: "#e9ecef",
    fontWeight: "500",
  },
  topicEmptyText: {
    fontSize: 14,
    color: "#dee2e6",
    marginTop: 4,
  },
  topicGroupList: {
    marginTop: 4,
    width: "100%",
  },
  topicGroup: {
    marginBottom: 10,
  },
  topicGroupTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f8f9fa",
  },
  topicGroupTitleSelected: {
    color: "#4dabf7",
  },
  subtopicRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    marginLeft: 12, // indent
  },
  topicChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#ffffff",
  },
  topicChipSelected: {
    backgroundColor: "#4c6ef5",
    borderColor: "#364fc7",
  },
  topicChipText: {
    fontSize: 14,
    color: "#343a40",
  },
  topicChipTextSelected: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
