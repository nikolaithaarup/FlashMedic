// src/features/weekly/WeeklyMcqScreen.tsx
// ✅ ONLY CHANGE: replace the plain instruction block with the same boxed help card styling.

import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

import { auth } from "../../firebase/firebase";
import { saveWeeklyResult } from "../../services/weeklyResultsService";
import { styles } from "../../ui/flashmedicStyles";
import { useWeeklyLock } from "./useWeeklyLock";

import {
  loadMcqPackByWeekKey,
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

async function ensureAuthUid(): Promise<string> {
  const existing = auth.currentUser?.uid;
  if (existing) return existing;

  const hydrated = await new Promise<string | null>((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      unsub();
      resolve(u?.uid ?? null);
    });
  });
  if (hydrated) return hydrated;

  const cred = await signInAnonymously(auth);
  return cred.user.uid;
}

type WeeklyMcqScreenProps = {
  headingFont: number;
  buttonFont: number;

  weeklyMcqLocked: boolean; // backward compat
  setWeeklyMcqLocked: (locked: boolean) => void;

  profileNickname?: string | null;
  onBack: () => void;

  // ✅ DEV: force-load specific week doc id (e.g. "2026-W06")
  devWeekKey?: string | null;
};

export function WeeklyMcqScreen({
  headingFont,
  buttonFont,
  weeklyMcqLocked,
  setWeeklyMcqLocked,
  profileNickname,
  onBack,
  devWeekKey = null,
}: WeeklyMcqScreenProps) {
  // Pack state
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

  // Use the effective weekKey for lock keys
  const effectiveWeekKey = weekKey ?? devWeekKey ?? null;

  const lockKey = effectiveWeekKey
    ? `weekly_lock_mcq_${effectiveWeekKey}`
    : "weekly_lock_mcq_unknown";
  const lock = useWeeklyLock(lockKey);

  const isLocked = (weeklyMcqLocked || lock.locked) && !lock.ignoreLocks;

  const currentQuestion = questions[index];
  const totalQuestions = questions.length;
  const questionNumber = index + 1;
  const timeLabel = formatSeconds(secondsLeft);

  const weeklyTopicBullet = useMemo(() => `- ${topicTitle}`, [topicTitle]);

  // Load pack on mount / when devWeekKey changes
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setPackLoaded(false);

      try {
        const res = devWeekKey
          ? await loadMcqPackByWeekKey(devWeekKey)
          : await loadThisWeeksMcqPack();

        if (cancelled) return;

        if (!res) {
          setWeekKey(devWeekKey ?? null);
          setTopicTitle(
            devWeekKey ? `Ingen MCQ pack for ${devWeekKey}` : "Ugens emne",
          );
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
        if (!cancelled) setQuestions([]);
      } finally {
        if (!cancelled) setPackLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [devWeekKey]);

  useEffect(() => {
    if (!started) setSecondsLeft(timeLimit);
  }, [timeLimit, started]);

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

  const hardResetUi = () => {
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

  const lockAndExit = async () => {
    try {
      await lock.lock();
    } catch {}
    setWeeklyMcqLocked(true);
    hardResetUi();
    onBack();
  };

  const handleBack = () => {
    if (started && !finished) {
      Alert.alert(
        "Afslut spil?",
        "Er du sikker på, at du vil afslutte spillet? Du har kun én chance pr. uge.",
        [
          { text: "Nej", style: "cancel" },
          {
            text: "Ja",
            style: "destructive",
            onPress: () => void lockAndExit(),
          },
        ],
      );
      return;
    }
    hardResetUi();
    onBack();
  };

  const handleStart = () => {
    if (!packLoaded) {
      Alert.alert("Indlæser", "Henter ugens spørgsmål...");
      return;
    }
    if (isLocked) {
      Alert.alert(
        "Spillet er låst",
        "Du har allerede spillet denne uges Multiple Choice Game.",
      );
      return;
    }
    if (!questions || questions.length === 0) {
      Alert.alert(
        "Ingen spørgsmål",
        devWeekKey
          ? `Ingen MCQ-spørgsmål for ${devWeekKey}.`
          : "Ingen MCQ-spørgsmål til denne uge endnu.",
      );
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
    if (!started || showFeedback || !currentQuestion) return;

    const sourceOptions =
      shuffledOptions.length > 0 ? shuffledOptions : currentQuestion.options;
    const selectedOption = sourceOptions.find((o) => o.id === optionId);
    if (!selectedOption) return;

    setSelectedId(optionId);

    const isCorrect = !!selectedOption.isCorrect;
    let points = 0;

    if (isCorrect) {
      const elapsed = timeLimit - secondsLeft;
      const fastWindow = 5;
      if (elapsed <= fastWindow) points = 1000;
      else {
        const extraSeconds = elapsed - fastWindow;
        points = Math.max(200, 1000 - extraSeconds * 32);
      }
    }

    setLastPoints(points);
    setShowFeedback(true);
    setTimerRunning(false);

    setScore((prev) => prev + points);
    if (isCorrect) setCorrectCount((prev) => prev + 1);
    else setWrongCount((prev) => prev + 1);
  };

  const finishRun = async (finalScore: number) => {
    if (!lock.ignoreLocks) {
      try {
        await lock.lock();
      } catch {}
      setWeeklyMcqLocked(true);
    }

    try {
      const uid = await ensureAuthUid();
      await saveWeeklyResult({
        uid,
        nickname: profileNickname ?? "Ukendt",
        weekKey: effectiveWeekKey,
        mcqScore: finalScore,
      });
    } catch (err) {
      console.error("Failed to save MCQ weekly result", err);
    }
  };

  const handleNext = async () => {
    const nextIndex = index + 1;

    if (nextIndex >= totalQuestions) {
      setStarted(false);
      setFinished(true);
      setShowFeedback(false);
      setSelectedId(null);
      setSecondsLeft(timeLimit);
      setShowResults(true);

      await finishRun(score);
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
    hardResetUi();
    onBack();
  };

  // ---------- Render ----------
  return (
    <LinearGradient
      colors={["#0e91a8ff", "#5e6e7eff"]}
      style={styles.homeBackground}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.homeContainer, styles.safeTopContainer]}
      >
        <View style={styles.gameHeaderRow}>
          <Text
            style={[
              styles.appTitle,
              {
                fontSize: headingFont,
                color: "#fff",
                flex: 1,
                textAlign: "left",
                marginBottom: 0,
              },
            ]}
            numberOfLines={2}
          >
            Weekly Challenges
          </Text>

          <Pressable
            style={styles.gameCloseButton}
            onPress={handleBack}
            hitSlop={10}
          >
            <Text style={styles.gameCloseButtonText}>✕</Text>
          </Pressable>
        </View>

        {!packLoaded && (
          <View style={styles.weeklyGameCenter}>
            <ActivityIndicator />
            <Text style={[styles.weeklyPlaceholderText, { marginTop: 12 }]}>
              Henter spørgsmål...
            </Text>
          </View>
        )}

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

            {/* ✅ NEW: same "boxed help card" look as FlashcardsHomeScreen */}
            <View
              style={[
                styles.statsCard,
                {
                  marginTop: 14,
                  marginBottom: 14,
                  alignSelf: "stretch",
                  maxWidth: 700,
                  backgroundColor: "rgba(0,0,0,0.12)",
                },
              ]}
            >
              <Text style={[styles.statsSectionTitle, { color: "#f8f9fa" }]}>
                Sådan fungerer spillet
              </Text>

              <Text
                style={[
                  styles.statsLabel,
                  { color: "#e9ecef", marginTop: 8, lineHeight: 20 },
                ]}
              >
                • {totalQuestions} spørgsmål om ugens emne{"\n"}• {timeLimit}{" "}
                sekunder pr. spørgsmål{"\n"}• Korrekt svar inden for de første 5
                sekunder: 1000 point{"\n"}• Derefter falder scoren med ca. 32
                point pr. sekund{"\n"}• Minimum 200 point for et korrekt svar
                {"\n"}• Forkert svar eller timeout: 0 point{"\n\n"}Du kan kun
                spille dette spil én gang pr. uge.
              </Text>
            </View>

            <Pressable
              style={[
                styles.bigButton,
                styles.weeklyStartButton,
                { marginTop: 10 },
                isLocked && { opacity: 0.5 },
              ]}
              onPress={handleStart}
            >
              <Text
                style={[styles.bigButtonText, styles.weeklyStartButtonText]}
              >
                {isLocked ? "LÅST (allerede spillet)" : "START SPILLET"}
              </Text>
            </Pressable>

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
                {devWeekKey ? `Preview uge: ${devWeekKey}` : "Denne uges emne:"}
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

        {started && currentQuestion && (
          <>
            <View style={styles.weeklyTimerBar}>
              <Text style={styles.weeklyTimerText}>
                Tid tilbage: {timeLabel}
              </Text>
            </View>

            <View style={styles.weeklyGameCenter}>
              <Text style={styles.weeklyGameTitle}>Multiple Choice Game</Text>

              <View
                style={{
                  marginTop: 4,
                  alignSelf: "center",
                  width: "100%",
                  maxWidth: 700,
                }}
              >
                <Text
                  style={[
                    styles.subjectStatsSub,
                    { textAlign: "center", fontStyle: "italic" },
                  ]}
                >
                  Emne: {topicTitle}
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
                <Text
                  style={[
                    styles.questionText,
                    { fontSize: 20, lineHeight: 26 },
                  ]}
                >
                  {currentQuestion.text}
                </Text>
              </View>

              <View style={{ width: "100%", maxWidth: 700, marginTop: 16 }}>
                {(shuffledOptions.length > 0
                  ? shuffledOptions
                  : currentQuestion.options
                ).map((opt) => {
                  const isSelected = selectedId === opt.id;

                  let backgroundColor = "#343a40";
                  if (showFeedback) {
                    if (opt.isCorrect) backgroundColor = "#2b8a3e";
                    else if (isSelected && !opt.isCorrect)
                      backgroundColor = "#c92a2a";
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
                      <Text
                        style={[styles.bigButtonText, { fontSize: buttonFont }]}
                      >
                        {opt.text}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {showFeedback && (
                <View
                  style={{
                    marginTop: 20,
                    width: "100%",
                    maxWidth: 700,
                    alignItems: "center",
                  }}
                >
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
                      {questionNumber === totalQuestions
                        ? "Se resultat"
                        : "Næste spørgsmål"}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </>
        )}

        <Modal
          visible={showResults}
          transparent
          animationType="fade"
          onRequestClose={handleCloseResults}
        >
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalContent,
                {
                  maxWidth: 700,
                  backgroundColor: "#ffffff",
                  borderRadius: 12,
                  padding: 20,
                },
              ]}
            >
              <Text style={styles.statsSectionTitle}>
                Resultat – Multiple Choice Game
              </Text>

              <Text style={[styles.statsLabel, { marginTop: 12 }]}>
                Point i alt: <Text style={styles.statsAccuracy}>{score}</Text>
              </Text>
              <Text style={styles.statsLabel}>
                Korrekte svar: {correctCount} / {totalQuestions}
              </Text>
              <Text style={styles.statsLabel}>Forkerte svar: {wrongCount}</Text>

              <Pressable
                style={[styles.modalCloseButton, { marginTop: 24 }]}
                onPress={handleCloseResults}
              >
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
