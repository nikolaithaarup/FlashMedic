import { LinearGradient } from "expo-linear-gradient";
import * as MailComposer from "expo-mail-composer";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { loadStats, saveStats, updateStatsForCard } from "../../src/storage/stats";
import type { Difficulty, Flashcard } from "../../src/types/Flashcard";
import { ekgImageLookup } from "../data/ekg/imageLookup";
// EKG lookup
export default function Index() {
    const [cards, setCards] = useState<Flashcard[]>([]);
    
    useEffect(() => {
        async function loadFromBackend() {
            const res = await fetch("http://100.98.54.18:3002/flashcards/all");
            const data = await res.json();

            const hydrated = data.cards.map(c => 
                c.imageKey ? { ...c, image: ekgImageLookup[c.imageKey] } : c
            );

            setCards(hydrated);
        }

        loadFromBackend();
    }, []);
// ---------- Simple types for spaced repetition stats ----------

type CardStats = {
  seen: number;
  correct: number;
  incorrect: number;
  lastSeen: string | null;
};
type StatsMap = Record<string, CardStats>;

type Screen = "home" | "quiz" | "stats";

type TopicGroup = {
  topic: string;
  subtopics: string[];
};

// ---------- App identity (for mail subject etc.) ----------

const APP_ID = "FlashMedic";
const SUPPORT_EMAIL = "nikolai_91@live.com";

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

// Lower score = higher priority
function scoreCardForQuiz(card: Flashcard, stats: StatsMap): number {
  const s = stats[card.id];
  if (!s || s.seen === 0) return 0;

  const accuracy = s.correct / s.seen;
  return accuracy + s.seen * 0.05;
}

// ---------- MAIN COMPONENT ----------

export default function Index() {
  // -------- Flashcards loaded from backend --------
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // -------- Screen & selection state --------
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // -------- Quiz state --------
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [history, setHistory] = useState<Flashcard[]>([]);
  const [upcoming, setUpcoming] = useState<Flashcard[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // -------- Image modal state --------
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const openImageModal = () => {
    if (!currentCard?.image) return;
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
  };

  // -------- Stats --------
  const [stats, setStats] = useState<StatsMap>({});

  const { totalSeen, totalCorrect, totalIncorrect, accuracy } = useMemo(() => {
    let seen = 0, correct = 0, incorrect = 0;
    for (const s of Object.values(stats)) {
      seen += s.seen;
      correct += s.correct;
      incorrect += s.incorrect;
    }
    return {
      totalSeen: seen,
      totalCorrect: correct,
      totalIncorrect: incorrect,
      accuracy: seen > 0 ? (correct / seen) * 100 : 0,
    };
  }, [stats]);

  // -------- Responsive typography --------
  const { width } = useWindowDimensions();
  const baseWidth = 375;
  const scale = Math.min(width / baseWidth, 1.2);

  const headingFont = 40 * scale;
  const subtitleFont = 20 * scale;
  const buttonFont = 18 * scale;
  const subjectFont = 18 * scale;
  const metaFont = 15 * scale;
  const questionFont = 22 * scale;
  const answerFont = 17 * scale;

  // -------- Load STATS on mount --------
  useEffect(() => {
    (async () => {
      const loaded = await loadStats();
      setStats(loaded);
    })();
  }, []);

  // -------- Loading UI --------
  if (loadingCards) {
    return (
      <LinearGradient
        colors={["#0e91a8ff", "#5e6e7eff"]}
        style={styles.homeBackground}
      >
        <StatusBar style="light" />
        <View style={[styles.homeContainer, { justifyContent: "center" }]}>
          <Text style={{ color: "#fff", fontSize: 18 }}>Henter kort…</Text>
        </View>
      </LinearGradient>
    );
  }

  // -------- Error UI --------
  if (loadError) {
    return (
      <LinearGradient
        colors={["#0e91a8ff", "#5e6e7eff"]}
        style={styles.homeBackground}
      >
        <StatusBar style="light" />
        <View style={[styles.homeContainer, { justifyContent: "center" }]}>
          <Text style={{ color: "#fff", fontSize: 18, marginBottom: 8 }}>
            {loadError}
          </Text>
          <Pressable
            style={[styles.bigButton, { backgroundColor: "#000" }]}
            onPress={() => {
              // re-trigger loading
              setLoadingCards(true);
              setLoadError(null);
              (async () => {
                try {
                  const res = await fetch("http://100.98.54.18:3002/flashcards/all");
                  const data = await res.json();
                  const hydrated: Flashcard[] = data.cards.map((c: any) => {
                    if (c.imageKey) return { ...c, image: ekgImageLookup[c.imageKey] };
                    return c;
                  });
                  setCards(hydrated);
                } catch {
                  setLoadError("Kunne ikke hente kort fra serveren.");
                } finally {
                  setLoadingCards(false);
                }
              })();
            }}
          >
            <Text style={styles.bigButtonText}>Prøv igen</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  // -------- SUBJECTS --------
  const subjects = useMemo(
    () => Array.from(new Set(cards.map((c) => c.subject))),
    [cards]
  );

  // -------- CARDS for selected subject --------
  const cardsForSelectedSubject = useMemo(() => {
    if (!selectedSubject) return [];
    return cards.filter((c) => c.subject === selectedSubject);
  }, [selectedSubject, cards]);

  // -------- Topic groups --------
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

  const toggleAllTopics = () => {
    if (allTopicsSelected) setSelectedKeys([]);
    else setSelectedKeys(allSelectableKeys);
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

    const selected = groupKeys.every((k) => selectedKeys.includes(k));

    if (selected)
      setSelectedKeys((prev) => prev.filter((k) => !groupKeys.includes(k)));
    else
      setSelectedKeys((prev) => Array.from(new Set([...prev, ...groupKeys])));
  };

  // Cards included in the quiz
  const effectiveCardsForQuiz = useMemo(() => {
    if (!selectedSubject) return [];
    if (selectedKeys.length === 0) return cardsForSelectedSubject;

    return cardsForSelectedSubject.filter((card) => {
      const topic = card.topic ?? "";
      const sub = card.subtopic ?? "";
      return (
        selectedKeys.includes(`${topic}::<ALL>`) ||
        selectedKeys.includes(`${topic}::${sub}`)
      );
    });
  }, [selectedSubject, selectedKeys, cardsForSelectedSubject]);

  // ---------- SUBJECT COLORS ----------
  const getSubjectGradient = (subject: string) => {
    return ["#343a40", "#1c7ed6"];
  };

  const getSubjectPrimaryColor = (subject?: string | null) => {
    if (!subject) return "#1c7ed6";
    const [primary] = getSubjectGradient(subject);
    return primary;
  };

  const getDifficultyColor = (difficulty: Difficulty) =>
    difficultyColorMap[difficulty] ?? "#868e96";

  // ---------- QUIZ CONTROL ----------
  const handleStartQuiz = () => {
    if (!selectedSubject) {
      Alert.alert("Vælg fag", "Du skal vælge et fag først.");
      return;
    }

    if (effectiveCardsForQuiz.length === 0) {
      Alert.alert(
        "Ingen spørgsmål",
        "Der er ingen kort i de valgte emner."
      );
      return;
    }

    const scored = effectiveCardsForQuiz
      .map((card) => ({ card, score: scoreCardForQuiz(card, stats) }))
      .sort((a, b) => a.score - b.score)
      .map((x) => x.card);

    const deck = shuffle(scored);
    const [first, ...rest] = deck;

    setHistory([]);
    setUpcoming(rest);
    setCurrentCard(first);
    setShowAnswer(false);
    setScreen("quiz");
  };

  const handleStartAllSubjectsQuiz = () => {
    if (cards.length === 0) {
      Alert.alert("Ingen kort", "Der er ingen flashcards endnu.");
      return;
    }

    const scored = cards
      .map((card) => ({ card, score: scoreCardForQuiz(card, stats) }))
      .sort((a, b) => a.score - b.score)
      .map((x) => x.card);

    const deck = shuffle(scored);
    const [first, ...rest] = deck;

    setSelectedSubject(null);
    setSelectedKeys([]);
    setHistory([]);
    setUpcoming(rest);
    setCurrentCard(first);
    setShowAnswer(false);
    setScreen("quiz");
  };

  // ---------- QUIZ SCREEN ----------
  if (screen === "quiz" && currentCard) {
    const primaryColor = getSubjectPrimaryColor(currentCard.subject);
    const difficultyText = difficultyTextMap[currentCard.difficulty];
    const gradient = getSubjectGradient(currentCard.subject);

    const totalQuestions = history.length + 1 + upcoming.length;
    const currentIndex = history.length + 1;

    return (
      <LinearGradient colors={gradient} style={styles.quizBackground}>
        <StatusBar style="light" />

        <View style={styles.quizContainer}>
          {/* continues in Part 2 */}
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
                  onPress={() => {
                    if (!currentCard || history.length === 0) return;

                    const newHistory = [...history];
                    const previous = newHistory.pop()!;
                    setHistory(newHistory);
                    setUpcoming((prev) => [currentCard, ...prev]);
                    setCurrentCard(previous);
                    setShowAnswer(true);
                    setImageModalVisible(false);
                  }}
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
                onPress={() => {
                  setScreen("home");
                  setCurrentCard(null);
                  setShowAnswer(false);
                  setHistory([]);
                  setUpcoming([]);
                  setImageModalVisible(false);
                }}
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

          {/* Meta section */}
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

              <Text
                style={[
                  styles.progressText,
                  { color: "#e9ecef", fontSize: metaFont },
                ]}
              >
                Spørgsmål {currentIndex} af {totalQuestions}
              </Text>
            </View>

            <View
              style={[
                styles.difficultyPill,
                { backgroundColor: difficultyColorMap[currentCard.difficulty] },
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

          {/* Question + Answer boxes */}
          <View style={styles.cardContainer}>
            <View style={styles.cardBox}>
              {currentCard.image && (
                <Pressable onPress={openImageModal}>
                  <Image
                    source={currentCard.image}
                    style={styles.questionImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.tapToZoomText}>Tryk for at se stort</Text>
                </Pressable>
              )}

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

          {/* Show Answer */}
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

          {/* Rating buttons */}
          {showAnswer && (
            <View style={styles.ratingRow}>
              <Pressable
                style={[styles.ratingButton, styles.knownButton]}
                onPress={() => {
                  setStats((prev) => {
                    const updated = updateStatsForCard(prev, currentCard.id, true);
                    saveStats(updated);
                    return updated;
                  });

                  if (upcoming.length === 0) {
                    Alert.alert("Slut", "Du har været igennem alle spørgsmål.");
                    return;
                  }

                  setHistory((prev) => [...prev, currentCard]);
                  setCurrentCard(upcoming[0]);
                  setUpcoming((prev) => prev.slice(1));
                  setShowAnswer(false);
                  setImageModalVisible(false);
                }}
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
                onPress={() => {
                  setStats((prev) => {
                    const updated = updateStatsForCard(prev, currentCard.id, false);
                    saveStats(updated);
                    return updated;
                  });

                  // add again to end
                  setUpcoming((prev) => [...prev, currentCard]);

                  if (upcoming.length === 0) {
                    Alert.alert("Slut", "Du har været igennem alle spørgsmål.");
                    return;
                  }

                  setHistory((prev) => [...prev, currentCard]);
                  setCurrentCard(upcoming[0]);
                  setUpcoming((prev) => prev.slice(1));
                  setShowAnswer(false);
                  setImageModalVisible(false);
                }}
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
            onPress={() => {
              if (!currentCard) return;

              const subject = `[${APP_ID}] Fejl i kort ${currentCard.id}`;
              const body = `
Kort-ID: ${currentCard.id}
Fag: ${currentCard.subject}
Emne: ${currentCard.topic}${currentCard.subtopic ? " · " + currentCard.subtopic : ""}

Spørgsmål:
${currentCard.question}

Svar:
${currentCard.answer}

Kommentar:
`;

              MailComposer.composeAsync({
                recipients: [SUPPORT_EMAIL],
                subject,
                body,
              });
            }}
          >
            <Text style={styles.outlineButtonText}>Rapportér fejl</Text>
          </Pressable>
        </View>

        {/* Fullscreen Image Modal */}
        {currentCard.image && (
          <Modal
            visible={imageModalVisible}
            transparent
            animationType="fade"
            onRequestClose={closeImageModal}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                <Image
                  source={currentCard.image}
                  style={styles.zoomImage}
                  resizeMode="contain"
                />

                <Pressable
                  style={styles.modalCloseButton}
                  onPress={closeImageModal}
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

  // ------------------ HOME SCREEN --------------------
  return (
    <LinearGradient
      colors={["#0e91a8ff", "#5e6e7eff"]}
      style={styles.homeBackground}
    >
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.homeContainer}>
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

        {/* SUBJECT GRID */}
        <View style={styles.subjectGrid}>
          {subjects.map((subject) => (
            <Pressable
              key={subject}
              onPress={() => {
                setSelectedSubject((prev) =>
                  prev === subject ? null : subject
                );
                setSelectedKeys([]);
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

        {/* QUIZ ALL */}
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

        {/* STATISTICS */}
        <Pressable
          style={[
            styles.bigButton,
            {
              marginTop: 8,
              alignSelf: "stretch",
              backgroundColor: "#495057",
            },
          ]}
          onPress={() => setScreen("stats")}
        >
          <Text
            style={[
              styles.bigButtonText,
              { color: "#ffffff", fontSize: buttonFont },
            ]}
          >
            Se statistik
          </Text>
        </Pressable>

        {/* TOPIC SELECTOR */}
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
                <Pressable onPress={toggleAllTopics}>
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
                      : group.subtopics.map((sub) => `${group.topic}::${sub}`);

                  const groupSelected = groupKeys.every((k) =>
                    selectedKeys.includes(k)
                  );

                  return (
                    <View key={group.topic} style={styles.topicGroup}>
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
                          <Pressable
                            onPress={() =>
                              toggleTopicKey(`${group.topic}::<ALL>`)
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
                            const nested = sub.includes("::");
                            const name = nested ? sub.split("::")[1] : sub;

                            return (
                              <Pressable
                                key={key}
                                onPress={() => toggleTopicKey(key)}
                                style={[
                                  styles.topicChip,
                                  selected && styles.topicChipSelected,
                                  nested && {
                                    marginLeft: 24,
                                    backgroundColor: "#f1f3f5",
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.topicChipText,
                                    selected && styles.topicChipTextSelected,
                                    nested && {
                                      fontSize: 13,
                                      color: "#495057",
                                    },
                                  ]}
                                >
                                  {name}
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

            {/* Start quiz */}
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
    marginLeft: 12,
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

  progressText: {
    marginTop: 4,
    fontWeight: "500",
  },

  questionImage: {
    width: 260,
    height: 160,
    marginBottom: 8,
  },
  tapToZoomText: {
    fontSize: 12,
    color: "#868e96",
    textAlign: "center",
    marginBottom: 8,
  },

  // Modal & zoomed image
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomImage: {
    width: "100%",
    height: "80%",
  },
  modalCloseButton: {
    position: "absolute",
    top: 48,
    right: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "transparent",
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // Statistics
  statsCard: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statsLabel: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 2,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#212529",
  },
  statsGood: {
    fontSize: 20,
    fontWeight: "700",
    color: "#12b886",
  },
  statsBad: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fa5252",
  },
  statsAccuracy: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1c7ed6",
  },
});
