// src/features/weekly/WeeklyMcqScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../../app/flashmedicStyles";

import { auth } from "../../firebase/firebase";
import { saveWeeklyResult } from "../../services/weeklyResultsService";
import { useWeeklyLock } from "./useWeeklyLock";

import {
  loadThisWeeksMcqPack,
  type WeeklyMcqOption,
  type WeeklyMcqQuestion,
} from "../../services/weeklyMcqService";

// ---------- Helpers ----------
function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type WeeklyMcqScreenProps = {
  headingFont: number;
  buttonFont: number;

  // You can keep these props for now (for backwards compat),
  // but this screen will primarily use the internal week-based lock.
  weeklyMcqLocked: boolean;
  setWeeklyMcqLocked: (locked: boolean) => void;

  profileNickname?: string | null;
  onBack: () => void;
};

// ---------- Component ----------
export function WeeklyMcqScreen({
  headingFont,
  buttonFont,
  weeklyMcqLocked,
  setWeeklyMcqLocked,
  profileNickname,
  onBack,
}: WeeklyMcqScreenProps) {
  // Pack state (loaded from Firestore)
  const [packLoaded, setPackLoaded] = useState(false);
  const [weekKey, setWeekKey] = useState<string | null>(null);
  const [topicTitle, setTopicTitle] = useState<string>("Ugens emne");
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [questions, setQuestions] = useState<WeeklyMcqQuestion[]>([]);

  // Game state
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);

  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

  const [shuffledOptions, setShuffledOptions] = useState<WeeklyMcqOption[]>([]);

  // Week-specific lock key (auto-unlocks next week)
  const lockKey = weekKey ? `weekly_lock_mcq_${weekKey}` : "weekly_lock_mcq_unknown";
  const { locked } = useWeeklyLock(lockKey);

  // Effective lock combines prop + internal week lock
  const isLocked = weeklyMcqLocked || locked;

  const currentQuestion = questions[index];
  const totalQuestions = questions.length;
  const questionNumber = index + 1;
  const timeLabel = formatSeconds(secondsLeft);
  const playerRank = 15; // placeholder

  const weeklyTopicBullet = useMemo(() => `- ${topicTitle}`, [topicTitle]);

  // Load pack on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await loadThisWeeksMcqPack();
        if (!res) {
          setWeekKey(null);
          setTopicTitle("Ugens emne");
          setTimeLimit(30);
          setQuestions([]);
          return;
        }

        setWeekKey(res.weekKey);
        setTopicTitle(res.pack.topicTitle || "Ugens emne");
        setTimeLimit(res.pack.timeLimitSec || 30);
        setQuestions(res.pack.questions || []);
      } catch (e) {
        console.error("Failed to load weekly MCQ pack", e);
        setQuestions([]);
      } finally {
        setPackLoaded(true);
      }
    })();
  }, []);

  // Keep secondsLeft aligned with timeLimit when not actively playing
  useEffect(() => {
    if (!started) setSecondsLeft(timeLimit);
  }, [timeLimit, started]);

  // Shuffle options for each question
  useEffect(() => {
    if (currentQuestion) setShuffledOptions(shuffle(currentQuestion.options));
    else setShuffledOptions([]);
  }, [index, started, currentQuestion]);

  // Countdown
  useEffect(() => {
    if (!timerRunning) return;
    if (!started || showFeedback || finished) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Timeout: 0 points, count as wrong
          setTimerRunning(false);
          setShowFeedback(true);
          setLastPoints(0);
          setWrongCount((w) => w + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, started, showFeedback, finished]);

  // -------- Handlers --------
  const resetRunState = () => {
    setTimerRunning(false);
    setStarted(false);
    setFinished(false);
    setShowFeedback(false);
    setShowResults(false);
    setIndex(0);
    setSecondsLeft(timeLimit);
    setSelectedId(null);
    setLastPoints(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
  };

  const handleBack = () => {
    // If currently playing, confirm exit + lock
    if (started && !finished) {
      Alert.alert(
        "Afslut spil?",
        "Er du sikker på, at du vil afslutte spillet? Du har kun én chance pr. uge.",
        [
          { text: "Nej", style: "cancel" },
          {
            text: "Ja",
            style: "destructive",
            onPress: () => {
              setWeeklyMcqLocked(true);
              setTimerRunning(false);
              setStarted(false);
              setFinished(true);
              setShowFeedback(false);
              setShowResults(false);
              setSecondsLeft(timeLimit);
              setSelectedId(null);
              setLastPoints(0);
              onBack();
            },
          },
        ],
      );
      return;
    }

    // Normal exit
    setTimerRunning(false);
    setStarted(false);
    setFinished(false);
    setShowFeedback(false);
    setSecondsLeft(timeLimit);
    setSelectedId(null);
    setLastPoints(0);
    onBack();
  };

  const handleStart = () => {
    if (!packLoaded) {
      Alert.alert("Indlæser", "Henter ugens spørgsmål...");
      return;
    }

    if (isLocked) {
      Alert.alert("Spillet er låst", "Du har allerede spillet denne uges Multiple Choice Game.");
      return;
    }

    if (!questions || questions.length === 0) {
      Alert.alert("Ingen spørgsmål", "Ingen MCQ-spørgsmål til denne uge endnu.");
      return;
    }

    setStarted(true);
    setFinished(false);
    setIndex(0);
    setSecondsLeft(timeLimit);
    setSelectedId(null);
    setShowFeedback(false);
    setLastPoints(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTimerRunning(true);
  };

  const handleAnswer = (optionId: string) => {
    if (!started) return;
    if (showFeedback) return;
    if (!currentQuestion) return;

    const sourceOptions = shuffledOptions.length > 0 ? shuffledOptions : currentQuestion.options;
    const selectedOption = sourceOptions.find((o) => o.id === optionId);
    if (!selectedOption) return;

    setSelectedId(optionId);

    const isCorrect = !!selectedOption.isCorrect;
    let points = 0;

    if (isCorrect) {
      const elapsed = timeLimit - secondsLeft;
      const fastWindow = 5;

      if (elapsed <= fastWindow) {
        points = 1000;
      } else {
        const extraSeconds = elapsed - fastWindow;
        const deducted = extraSeconds * 32;
        points = Math.max(200, 1000 - deducted);
      }
    } else {
      points = 0;
    }

    setLastPoints(points);
    setShowFeedback(true);
    setTimerRunning(false);

    setScore((prev) => prev + points);
    if (isCorrect) setCorrectCount((prev) => prev + 1);
    else setWrongCount((prev) => prev + 1);
  };

  const handleNext = async () => {
    const nextIndex = index + 1;

    if (nextIndex >= totalQuestions) {
      setStarted(false);
      setFinished(true);
      setShowFeedback(false);
      setSelectedId(null);
      setSecondsLeft(timeLimit);
      setWeeklyMcqLocked(true);
      setShowResults(true);

      try {
        const uid = auth.currentUser?.uid;
        if (uid) {
          await saveWeeklyResult({
            uid,
            nickname: profileNickname ?? "Ukendt",
            mcqScore: score,
          });
        }
      } catch (err) {
        console.error("Failed to save MCQ weekly result", err);
      }

      return;
    }

    setIndex(nextIndex);
    setSelectedId(null);
    setShowFeedback(false);
    setLastPoints(0);
    setSecondsLeft(timeLimit);
    setTimerRunning(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setFinished(true);
    setStarted(false);
    setSelectedId(null);
    setShowFeedback(false);
    setSecondsLeft(timeLimit);
    onBack();
  };

  // ---------- Render ----------
  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={[styles.homeContainer, styles.safeTopContainer]}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.appTitle, { fontSize: headingFont, color: "#fff" }]}>
            Weekly Challenges
          </Text>
          <Pressable
            style={[styles.smallButton, { borderColor: "#ffffffdd" }]}
            onPress={handleBack}
            hitSlop={8}
          >
            <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
              Tilbage
            </Text>
          </Pressable>
        </View>

        {/* Loading state */}
        {!packLoaded && (
          <View style={styles.weeklyGameCenter}>
            <ActivityIndicator />
            <Text style={[styles.weeklyPlaceholderText, { marginTop: 12 }]}>
              Henter ugens spørgsmål...
            </Text>
          </View>
        )}

        {/* Intro screen */}
        {packLoaded && !started && !finished && (
          <View style={styles.weeklyGameCenter}>
            <Text style={styles.weeklyGameTitle}>Multiple Choice Game</Text>

            <Text
              style={[
                styles.weeklyPlaceholderText,
                { textAlign: "left", alignSelf: "flex-start", marginTop: 16 },
              ]}
            >
              Svar så hurtigt og korrekt som muligt på ugens spørgsmål.
            </Text>

            <View style={{ marginTop: 16, width: "100%", maxWidth: 700, alignSelf: "flex-start" }}>
              <Text style={styles.statsLabel}>Sådan fungerer spillet:</Text>
              <Text style={styles.drugTheoryText}>
                {"\n"}• {totalQuestions} spørgsmål om ugens emne
                {"\n"}• {timeLimit} sekunder pr. spørgsmål
                {"\n"}• Korrekt svar inden for de første 5 sekunder: 1000 point
                {"\n"}• Derefter falder scoren med ca. 32 point pr. sekund
                {"\n"}• Minimum 200 point for et korrekt svar
                {"\n"}• Forkert svar eller timeout: 0 point
                {"\n\n"}Du kan kun spille dette spil én gang pr. uge.
              </Text>
            </View>

            <Pressable
              style={[
                styles.bigButton,
                styles.weeklyStartButton,
                { marginTop: 24 },
                isLocked && { opacity: 0.5 },
              ]}
              onPress={handleStart}
            >
              <Text style={[styles.bigButtonText, styles.weeklyStartButtonText]}>
                {isLocked ? "LÅST (allerede spillet)" : "START SPILLET"}
              </Text>
            </Pressable>

            {/* Weekly topic */}
            <View
              style={{
                marginTop: 24,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                alignSelf: "stretch",
                maxWidth: 700,
                backgroundColor: "#ffffff22",
              }}
            >
              <Text
                style={[
                  styles.bigButtonText,
                  {
                    fontSize: 24,
                    fontWeight: "700",
                    textAlign: "left",
                    alignSelf: "flex-start",
                    marginBottom: 6,
                  },
                ]}
              >
                Denne uges emne:
              </Text>

              <Text
                style={[
                  styles.weeklyPlaceholderText,
                  { textAlign: "left", lineHeight: 24 },
                ]}
              >
                {weeklyTopicBullet}
              </Text>
            </View>
          </View>
        )}

        {/* Active question view */}
        {started && currentQuestion && (
          <>
            <View style={styles.weeklyTimerBar}>
              <Text style={styles.weeklyTimerText}>Tid tilbage: {timeLabel}</Text>
            </View>

            <View style={styles.weeklyGameCenter}>
              <Text style={styles.weeklyGameTitle}>Multiple Choice Game</Text>

              <View style={{ marginTop: 4, alignSelf: "center", width: "100%", maxWidth: 700 }}>
                <Text style={[styles.subjectStatsSub, { textAlign: "center", fontStyle: "italic" }]}>
                  Denne uges emne: {topicTitle}
                </Text>
              </View>

              <Text style={styles.statsLabel}>
                Spørgsmål {questionNumber} af {totalQuestions}
              </Text>

              <View
                style={{
                  marginTop: 16,
                  width: "100%",
                  maxWidth: 700,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: "#f8f9fad9",
                }}
              >
                <Text style={[styles.questionText, { fontSize: 20, lineHeight: 26 }]}>
                  {currentQuestion.text}
                </Text>
              </View>

              {/* Options */}
              <View style={{ width: "100%", maxWidth: 700, marginTop: 16 }}>
                {(shuffledOptions.length > 0 ? shuffledOptions : currentQuestion.options).map(
                  (opt) => {
                    const isSelected = selectedId === opt.id;

                    let backgroundColor = "#343a40";
                    if (showFeedback) {
                      if (opt.isCorrect) backgroundColor = "#2b8a3e";
                      else if (isSelected && !opt.isCorrect) backgroundColor = "#c92a2a";
                      else backgroundColor = "#495057";
                    } else if (isSelected) {
                      backgroundColor = "#1c7ed6";
                    }

                    return (
                      <Pressable
                        key={opt.id}
                        style={[
                          styles.bigButton,
                          { alignSelf: "stretch", marginTop: 8, backgroundColor },
                        ]}
                        disabled={showFeedback}
                        onPress={() => handleAnswer(opt.id)}
                      >
                        <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>
                          {opt.text}
                        </Text>
                      </Pressable>
                    );
                  },
                )}
              </View>

              {/* Feedback */}
              {showFeedback && (
                <View style={{ marginTop: 20, width: "100%", maxWidth: 700, alignItems: "center" }}>
                  <Text
                    style={
                      lastPoints > 0
                        ? styles.weeklyWordFeedbackCorrect
                        : styles.weeklyWordFeedbackWrong
                    }
                  >
                    {lastPoints > 0
                      ? `Korrekt! Du fik ${lastPoints} point.`
                      : "Forkert eller for langsom – 0 point for dette spørgsmål."}
                  </Text>

                  <Pressable
                    style={[
                      styles.bigButton,
                      styles.primaryButton,
                      { marginTop: 12, backgroundColor: "#1c7ed6" },
                    ]}
                    onPress={handleNext}
                  >
                    <Text style={styles.bigButtonText}>
                      {questionNumber === totalQuestions ? "Se resultat" : "Næste spørgsmål"}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </>
        )}

        {/* Result modal */}
        <Modal visible={showResults} transparent animationType="fade" onRequestClose={handleCloseResults}>
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalContent,
                { maxWidth: 700, backgroundColor: "#ffffff", borderRadius: 12, padding: 20 },
              ]}
            >
              <Text style={styles.statsSectionTitle}>Resultat – Multiple Choice Game</Text>

              <Text style={[styles.statsLabel, { marginTop: 12 }]}>
                Point i alt: <Text style={styles.statsAccuracy}>{score}</Text>
              </Text>
              <Text style={styles.statsLabel}>
                Korrekte svar: {correctCount} / {totalQuestions}
              </Text>
              <Text style={styles.statsLabel}>Forkerte svar: {wrongCount}</Text>

              <Text style={[styles.statsLabel, { marginTop: 16 }]}>
                Foreløbig global rangliste (placeholder – backend kommer):
              </Text>

              <View style={{ marginTop: 8 }}>
                <Text style={styles.subjectStatsSub}>1. ParamedPro · 9870 pts</Text>
                <Text style={styles.subjectStatsSub}>2. ShockMaster · 9420 pts</Text>
                <Text style={styles.subjectStatsSub}>3. ABCDE_Ninja · 9100 pts</Text>
                <Text style={styles.subjectStatsSub}>...</Text>
                <Text style={styles.subjectStatsSub}>
                  {playerRank}. {profileNickname ?? "Dig"} · {score} pts
                </Text>
              </View>

              <Pressable style={[styles.modalCloseButton, { marginTop: 24 }]} onPress={handleCloseResults}>
                <Text style={styles.modalCloseText}>Luk</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}

export default WeeklyMcqScreen;
