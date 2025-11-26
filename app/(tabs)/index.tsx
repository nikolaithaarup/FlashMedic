import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { allFlashcards } from "../../src/data/flashcards";
import type { Flashcard, Difficulty } from "../../src/types/Flashcard";
import {
  loadStats,
  saveStats,
  updateStatsForCard,
} from "../../src/storage/stats";

// ---------- Types & helper functions ----------

// Local copy of types so this file compiles even if you didn't make a types/Stats.ts
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

type ShuffleMode = "random" | "ordered";

// Simple Fisher–Yates shuffle
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

// Build deck with scoring + optional shuffle
function buildDeck(
  cards: Flashcard[],
  stats: StatsMap,
  mode: ShuffleMode
): Flashcard[] {
  const scored = cards.map((card) => ({
    card,
    score: scoreCardForQuiz(card, stats),
  }));
  scored.sort((a, b) => a.score - b.score);
  const ordered = scored.map((x) => x.card);
  return mode === "random" ? shuffle(ordered) : ordered;
}

// Simple global stats
function computeGlobalStats(stats: StatsMap) {
  let totalSeen = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;

  Object.values(stats).forEach((s) => {
    totalSeen += s.seen;
    totalCorrect += s.correct;
    totalIncorrect += s.incorrect;
  });

  const accuracy = totalSeen ? totalCorrect / totalSeen : 0;

  return { totalSeen, totalCorrect, totalIncorrect, accuracy };
}

// ---------- Fonts (cross-platform) ----------

const headingFont = Platform.OS === "android" ? "sans-serif" : "System";
const bodyFont = "System";

// ---------- Component ----------

export default function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // selection keys: "topic::<ALL>" or "topic::subtopic"
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [history, setHistory] = useState<Flashcard[]>([]);
  const [upcoming, setUpcoming] = useState<Flashcard[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  // Stats for spaced repetition
  const [stats, setStats] = useState<StatsMap>({});

  // Shuffle mode
  const [shuffleMode, setShuffleMode] =
    useState<ShuffleMode>("random");

  const globalStats = useMemo(
    () => computeGlobalStats(stats),
    [stats]
  );

  // Load stats once on mount
  useEffect(() => {
    (async () => {
      const loaded = await loadStats();
      setStats(loaded);
    })();
  }, []);

  // -------- Subject list (automatically from flashcards) ------

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

  // Cards that actually will be used in the quiz (subject + topic/subtopic filters)
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

  // --------- Subject / theme colors ---------

  const getSubjectGradient = (subject: string) => {
    switch (subject) {
      case "Anatomi og fysiologi":
        return ["#4c6ef5", "#7950f2"]; // blå → lilla
      case "Farmakologi":
        return ["#12b886", "#20b0c9ff"]; // grøn/turkis
      case "Kliniske parametre":
        return ["#868824ff", "#4dabf7"]; // kølig blå
      case "Mikrobiologi":
        return ["#a6160cff", "#37b24d"]; // grøn
      case "Sygdomslære":
        return ["#fd7e14", "#f76707"]; // orange
      case "EKG":
        return ["#e64980", "#be4bdb"]; // pink/lilla
      case "Traumatologi og ITLS":
        return ["#d6fa52ff", "#e03131"]; // rød
      default:
        return ["#4c6ef5", "#364fc7"]; // fallback
    }
  };

  const getSubjectPrimaryColor = (subject?: string | null) => {
    if (!subject) return "#12b886";
    const [primary] = getSubjectGradient(subject);
    return primary;
  };

  const getDifficultyColor = (difficulty: Difficulty) =>
    difficultyColorMap[difficulty] ?? "#868e96";

  // --------------- Quiz control logic ----------------

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

    const deck = buildDeck(effectiveCardsForQuiz, stats, shuffleMode);
    const [first, ...rest] = deck;

    setHistory([]);
    setUpcoming(rest);
    setCurrentCard(first);
    setShowAnswer(false);
    setScreen("quiz");
  };

  // Quiz in ALL subjects
  const handleStartAllSubjectsQuiz = () => {
    if (allFlashcards.length === 0) {
      Alert.alert("Ingen kort", "Der er ingen flashcards at quizze i endnu.");
      return;
    }

    const deck = buildDeck(allFlashcards, stats, shuffleMode);
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

  const handleReportError = async () => {
    if (!currentCard) return;

    const subject = encodeURIComponent(
      `FlashMedic fejl i kort: ${currentCard.id}`
    );

    const bodyLines = [
      "Hej, jeg vil gerne rapportere en fejl i FlashMedic.",
      "",
      `Kort-ID: ${currentCard.id}`,
      `Fag: ${currentCard.subject}`,
      `Emne: ${currentCard.topic}${
        currentCard.subtopic ? " · " + currentCard.subtopic : ""
      }`,
      "",
      "Spørgsmål:",
      currentCard.question,
      "",
      "Svar:",
      currentCard.answer,
      "",
      "Beskriv fejlen her:",
      "",
    ];

    const body = encodeURIComponent(bodyLines.join("\n"));

    const mailto = `mailto:n.kleftas@gmail.com?subject=${subject}&body=${body}`;

    try {
      const canOpen = await Linking.canOpenURL(mailto);
      if (canOpen) {
        Linking.openURL(mailto);
      } else {
        Alert.alert(
          "Kan ikke åbne mail",
          "Tjek at du har en mail-app installeret."
        );
      }
    } catch (e) {
      Alert.alert(
        "Fejl",
        "Der opstod en fejl ved forsøget på at åbne mail."
      );
    }
  };

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

    // Læg kortet bagerst i køen
    setUpcoming((prev) => [...prev, currentCard]);

    // Gå videre til næste kort
    handleNextQuestion();
  };

  const handleResetStats = () => {
    Alert.alert(
      "Nulstil statistik",
      "Er du sikker på, at du vil nulstille al læringsstatistik?",
      [
        { text: "Annuller", style: "cancel" },
        {
          text: "Ja, nulstil",
          style: "destructive",
          onPress: async () => {
            const empty: StatsMap = {};
            setStats(empty);
            await saveStats(empty);
          },
        },
      ]
    );
  };

  // ------------------ QUIZ SCREEN --------------------
  if (screen === "quiz" && currentCard) {
    const primaryColor = getSubjectPrimaryColor(currentCard.subject);
    const difficultyText = difficultyTextMap[currentCard.difficulty];
    const gradient = getSubjectGradient(currentCard.subject);

    const currentIndex = history.length + 1;
    const totalCards = history.length + 1 + upcoming.length;

    return (
      <LinearGradient colors={gradient} style={styles.quizBackground}>
        <StatusBar style="light" />
        <View style={styles.quizContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.appTitle, { color: "#fff", marginBottom: 0 }]}>
              FlashMedic
            </Text>
            <View style={styles.headerButtons}>
              {history.length > 0 && (
                <Pressable
                  style={[styles.smallButton, { borderColor: "#fff" }]}
                  onPress={handlePreviousQuestion}
                  hitSlop={10}
                >
                  <Text style={[styles.smallButtonText, { color: "#fff" }]}>
                    Tilbage
                  </Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.smallButton, { borderColor: "#fff" }]}
                onPress={handleHome}
                hitSlop={10}
              >
                <Text style={[styles.smallButtonText, { color: "#fff" }]}>
                  Home
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View>
              <Text style={[styles.subjectLabel, { color: "#f8f9fa" }]}>
                {currentCard.subject}
              </Text>
              <Text style={[styles.topicLabel, { color: "#f8f9fa" }]}>
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
              <Text style={styles.difficultyText}>{difficultyText}</Text>
            </View>
          </View>

          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              Spørgsmål {currentIndex} / {totalCards}
            </Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.cardBox}>
              <Text style={styles.questionText}>{currentCard.question}</Text>
            </View>

            <View style={styles.cardBox}>
              {showAnswer ? (
                <Text style={styles.answerText}>{currentCard.answer}</Text>
              ) : (
                <Text style={styles.placeholderText}>
                  Tryk på 'Vis svar' for at se svaret.
                </Text>
              )}
            </View>
          </View>

<View style={styles.buttonRow}>
  {!showAnswer && (
    <Pressable
      style={[
        styles.bigButton,
        styles.primaryButton,
        { backgroundColor: primaryColor },
      ]}
      onPress={() => setShowAnswer(true)}
    >
      <Text style={styles.bigButtonText}>Vis svar</Text>
    </Pressable>
  )}
</View>


          <View style={styles.ratingRow}>
            <Pressable
              style={[styles.decisionButton, { backgroundColor: "#2ecc71" }]}
              onPress={handleMarkKnown}
              hitSlop={8}
            >
              <Text style={styles.smallTagText}>Jeg kunne den</Text>
            </Pressable>
            <Pressable
              style={[styles.decisionButton, { backgroundColor: "#e74c3c" }]}
              onPress={handleMarkUnknown}
              hitSlop={8}
            >
              <Text style={styles.smallTagText}>Jeg kunne den ikke</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.bigButton, styles.outlineButton]}
            onPress={handleReportError}
            hitSlop={8}
          >
            <Text style={styles.outlineButtonText}>Rapportér fejl</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  // ------------------ STATS SCREEN --------------------
  if (screen === "stats") {
    const { totalSeen, totalCorrect, totalIncorrect, accuracy } =
      globalStats;

    return (
      <LinearGradient
        colors={["#117fec", "#dee2e6", "#ced4da"]}
        style={styles.homeBackground}
      >
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.homeContainer}>
          <Text style={styles.appTitle}>FlashMedic</Text>
          <Text style={styles.subtitle}>Læringsstatistik</Text>

          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{totalSeen}</Text>
            <Text style={styles.statsLabel}>Kort set i alt</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statsSmallCard}>
              <Text style={styles.statsNumber}>{totalCorrect}</Text>
              <Text style={styles.statsLabel}>Rigtige</Text>
            </View>
            <View style={styles.statsSmallCard}>
              <Text style={styles.statsNumber}>{totalIncorrect}</Text>
              <Text style={styles.statsLabel}>Forkerte</Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>
              {totalSeen ? `${Math.round(accuracy * 100)}%` : "–"}
            </Text>
            <Text style={styles.statsLabel}>Samlet træfsikkerhed</Text>
          </View>

          <Pressable
            style={[
              styles.bigButton,
              styles.secondaryButton,
              { marginTop: 24, alignSelf: "stretch" },
            ]}
            onPress={() => setScreen("home")}
            hitSlop={8}
          >
            <Text style={styles.bigButtonText}>Tilbage til forsiden</Text>
          </Pressable>

          <Pressable
            style={[
              styles.bigButton,
              styles.outlineDangerButton,
              { marginTop: 12, alignSelf: "stretch" },
            ]}
            onPress={handleResetStats}
            hitSlop={8}
          >
            <Text style={styles.outlineDangerText}>Nulstil statistik</Text>
          </Pressable>
        </ScrollView>
      </LinearGradient>
    );
  }

  // ------------------ HOME SCREEN --------------------
  return (
    <LinearGradient
      colors={["#117fec", "#dee2e6", "#ced4da"]}
      style={styles.homeBackground}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <Text style={styles.appTitle}>FlashMedic</Text>
        <Text style={styles.subtitle}>
          Vælg et fag for at træne din medicinske viden.
        </Text>

        <View style={styles.subjectGrid}>
          {subjects.map((subject) => (
            <Pressable
              key={subject}
              onPress={() => {
                setSelectedSubject((prev) =>
                  prev === subject ? null : subject
                );
                setSelectedKeys([]); // ryd valg, når du skifter/lukker et fag
              }}
              hitSlop={8}
            >
              <LinearGradient
                colors={getSubjectGradient(subject)}
                style={[
                  styles.subjectTile,
                  selectedSubject === subject && styles.subjectTileSelected,
                ]}
              >
                <Text style={styles.subjectTileText}>{subject}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        {/* Quiz i alle fag */}
        <Pressable
          style={[
            styles.bigButton,
            styles.secondaryButton,
            { marginTop: 24, alignSelf: "stretch" },
          ]}
          onPress={handleStartAllSubjectsQuiz}
          hitSlop={8}
        >
          <Text style={styles.bigButtonText}>QUIZ I ALLE FAG</Text>
        </Pressable>

        {/* Se statistik */}
        <Pressable
          style={[
            styles.bigButton,
            styles.outlineSecondaryButton,
            { marginTop: 12, alignSelf: "stretch" },
          ]}
          onPress={() => setScreen("stats")}
          hitSlop={8}
        >
          <Text style={styles.outlineSecondaryText}>Se statistik</Text>
        </Pressable>

        {/* Shuffle toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Rækkefølge:</Text>
          <Pressable
            style={[
              styles.toggleOption,
              shuffleMode === "random" && styles.toggleOptionActive,
            ]}
            onPress={() => setShuffleMode("random")}
            hitSlop={8}
          >
            <Text
              style={[
                styles.toggleOptionText,
                shuffleMode === "random" &&
                  styles.toggleOptionTextActive,
              ]}
            >
              Randomiseret
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleOption,
              shuffleMode === "ordered" && styles.toggleOptionActive,
            ]}
            onPress={() => setShuffleMode("ordered")}
            hitSlop={8}
          >
            <Text
              style={[
                styles.toggleOptionText,
                shuffleMode === "ordered" &&
                  styles.toggleOptionTextActive,
              ]}
            >
              I rækkefølge
            </Text>
          </Pressable>
        </View>

        {selectedSubject && (
          <View style={styles.topicSection}>
            <View style={styles.topicHeaderRow}>
              <Text style={styles.topicTitle}>Emner i {selectedSubject}</Text>
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
                              selectedKeys.includes(
                                `${group.topic}::<ALL>`
                              ) && styles.topicChipSelected,
                            ]}
                            hitSlop={8}
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
                                hitSlop={8}
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
              style={[
                styles.bigButton,
                { backgroundColor: "#12b886", marginTop: 20 },
              ]}
              onPress={handleStartQuiz}
              hitSlop={8}
            >
              <Text style={styles.bigButtonText}>
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
    paddingTop: 40,
    alignItems: "center",
  },
  appTitle: {
    fontSize: 32,            // ↓ from 48
    fontWeight: "800",
    marginBottom: 12,
    fontFamily: "sans-serif",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,            // ↓ from 24
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
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    minWidth: 130,
    alignItems: "center",
    justifyContent: "center",
  },
  subjectTileSelected: {
    borderWidth: 3,
    borderColor: "#212529",
  },
  subjectTileText: {
    fontSize: 18,            // ↓ from 20
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
    minHeight: 110,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 0,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  questionText: {
    fontSize: 20,            // ↓ from 24
    fontWeight: "800",
    textAlign: "center",
    fontFamily: "System",
  },
  answerText: {
    fontSize: 16,            // ↓ from 18
    textAlign: "center",
    fontFamily: "serif",
  },
  placeholderText: {
    fontSize: 14,
    color: "#868e96",
    textAlign: "center",
  },

  bigButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    minWidth: 150,
    alignItems: "center",
    marginVertical: 8,
  },
  primaryButton: { backgroundColor: "#12b886" },
  secondaryButton: { backgroundColor: "#000000ff" },
  bigButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 22,            // ↓ from 24
  },

  smallButton: {
    borderWidth: 1,
    borderColor: "#343a40",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginLeft: 8,
    marginTop: 4,
  },
  smallButtonText: {
    color: "#343a40",
    fontWeight: "500",
    fontSize: 14,            // ↓ from 20
  },

  outlineButton: {
    borderWidth: 1,
    borderColor: "#f1f3f5",
    backgroundColor: "transparent",
  },
  outlineButtonText: {
    color: "#f1f3f5",
    fontWeight: "600",
    fontSize: 14,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
    alignItems: "center",
    flexWrap: "wrap",        // ✅ lets buttons wrap instead of vanishing
    gap: 8,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },

  subjectLabel: {
    fontSize: 16,            // ↓ from 20
    fontWeight: "600",
  },
  metaRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  difficultyPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  difficultyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,            // ↓ from 20
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 8,
  },

  ratingRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
  },
decisionButton: {
  flex: 1,
  paddingVertical: 18,
  paddingHorizontal: 24,
  borderRadius: 16,
  marginHorizontal: 6,
  alignItems: "center",
  justifyContent: "center",
  elevation: 3,
},

decisionText: {
  fontSize: 22,
  fontWeight: "800",
  color: "#fff",
  textAlign: "center",
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
  smallTagText: {
    fontSize: 13,
    fontWeight: "500",
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
    fontSize: 15,
    fontWeight: "600",
  },
  topicLink: {
    fontSize: 14,
    color: "#4c6ef5",
    fontWeight: "500",
  },
  topicEmptyText: {
    fontSize: 14,
    color: "#868e96",
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
  },
  topicGroupTitleSelected: {
    color: "#4c6ef5",
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



  // Stats
  statsCard: {
    width: "100%",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    marginTop: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  statsSmallCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
    fontFamily: bodyFont,
  },
  statsLabel: {
    fontSize: 14,
    color: "#495057",
    fontFamily: bodyFont,
  },

  // Shuffle toggle
  toggleRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "stretch",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  toggleLabel: {
    fontSize: 14,
    color: "#495057",
    fontFamily: bodyFont,
  },
  toggleOption: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ced4da",
    backgroundColor: "#ffffff",
  },
  toggleOptionActive: {
    backgroundColor: "#4c6ef5",
    borderColor: "#4c6ef5",
  },
  toggleOptionText: {
    fontSize: 13,
    color: "#343a40",
    fontFamily: bodyFont,
  },
  toggleOptionTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
