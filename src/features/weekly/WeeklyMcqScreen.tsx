// src/features/weekly/WeeklyMcqScreen.tsx
// ✅ ONLY CHANGE: replace the plain instruction block with the same boxed help card styling.

import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

import { auth } from "../../firebase/firebase";
import {
  createDirectWeeklyBundle,
  type ResolvedWeeklyBundle,
} from "../../services/weeklyIndexService";
import { WeeklyPackValidationError } from "../../services/weeklyPackValidation";
import { submitWeeklyResultReliably } from "../../services/weeklyPendingUploadService";
import { styles } from "../../ui/flashmedicStyles";
import {
  Background,
  EmptyState,
  ErrorState,
  NoticeCard,
  SecondaryButton,
} from "../../ui/primitives";
import { getWeeklyLockKey, useWeeklyLock } from "./useWeeklyLock";

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

  profileNickname?: string | null;
  onAttemptLocked: () => void;
  onBack: () => void;

  // ✅ DEV: force-load specific week doc id (e.g. "2026-W06")
  devWeekKey?: string | null;
};

export function WeeklyMcqScreen({
  headingFont,
  buttonFont,
  profileNickname,
  onAttemptLocked,
  onBack,
  devWeekKey = null,
}: WeeklyMcqScreenProps) {
  // Pack state
  const [packLoaded, setPackLoaded] = useState(false);
  const [loadStatus, setLoadStatus] = useState<
    "loading" | "ready" | "missing" | "invalid" | "error"
  >("loading");
  const [loadMessage, setLoadMessage] = useState("");
  const [loadVersion, setLoadVersion] = useState(0);
  const [resolution, setResolution] =
    useState<ResolvedWeeklyBundle | null>(null);
  const [uploadPending, setUploadPending] = useState(false);
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
  const effectiveWeekKey =
    resolution?.canonicalWeekKey ?? devWeekKey ?? weekKey ?? null;

  const lockKey = effectiveWeekKey
    ? getWeeklyLockKey("mcq", effectiveWeekKey)
    : "weekly_lock_mcq_unknown";
  const lock = useWeeklyLock(lockKey);
  const [forceLocked, setForceLocked] = useState(false);

  const isLocked = (lock.locked || forceLocked) && !lock.ignoreLocks;

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
      setLoadStatus("loading");
      setLoadMessage("");

      try {
        const res = devWeekKey
          ? await loadMcqPackByWeekKey(devWeekKey)
          : await loadThisWeeksMcqPack();

        if (cancelled) return;

        if (!res) {
          setWeekKey(devWeekKey ?? null);
          setTopicTitle(
            devWeekKey ? `Ingen quizindhold for ${devWeekKey}` : "Ugens emne",
          );
          setTimeLimit(30);
          setQuestions([]);
          setResolution(null);
          setLoadStatus("missing");
          return;
        }

        setWeekKey(res.weekKey);
        setResolution(res.resolution);
        setTopicTitle(res.pack.topicTitle || "Ugens emne");
        setTimeLimit(res.pack.timeLimitSec || 30);
        setQuestions(res.pack.questions || []);
        setLoadStatus("ready");
      } catch (e) {
        console.error("Failed to load weekly MCQ pack", e);
        if (!cancelled) {
          setQuestions([]);
          setLoadStatus(
            e instanceof WeeklyPackValidationError ? "invalid" : "error",
          );
          setLoadMessage(
            e instanceof Error
              ? e.message
              : "Ugens spørgsmål kunne ikke hentes.",
          );
        }
      } finally {
        if (!cancelled) setPackLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [devWeekKey, loadVersion]);

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

  useEffect(() => {
    setForceLocked(false);
  }, [effectiveWeekKey]);

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
    setForceLocked(true);
    if (!lock.ignoreLocks) {
      try {
        await lock.lock();
        onAttemptLocked();
      } catch (err) {
        console.error("Failed to lock MCQ game on exit", err);
      }
    }

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

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true;
      },
    );
    return () => subscription.remove();
  });

  const handleStart = async () => {
    if (!lock.loaded) {
      Alert.alert("Indlæser", "Tjekker spilstatus...");
      return;
    }
    if (!packLoaded) {
      Alert.alert("Indlæser", "Henter ugens spørgsmål...");
      return;
    }
    if (isLocked) {
      Alert.alert(
        "Spillet er låst",
        "Du har allerede spillet denne uges quiz.",
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

    if (!lock.ignoreLocks) {
      setForceLocked(true);
      try {
        await lock.lock();
        onAttemptLocked();
      } catch (err) {
        setForceLocked(false);
        console.error("Failed to lock MCQ attempt on start", err);
        Alert.alert("Kunne ikke starte", "Forsøget kunne ikke gemmes sikkert. Prøv igen.");
        return;
      }
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
    setForceLocked(true);
    if (!lock.ignoreLocks) {
      try {
        await lock.lock();
        onAttemptLocked();
      } catch (err) {
        console.error("Failed to lock MCQ game on finish", err);
      }
    }

    try {
      const uid = await ensureAuthUid();
      const activeResolution =
        resolution ??
        createDirectWeeklyBundle(effectiveWeekKey ?? "unknown", "mcq");
      const upload = await submitWeeklyResultReliably({
        uid,
        nickname: profileNickname ?? "Ukendt",
        resolution: activeResolution,
        game: "mcq",
        score: finalScore,
      });
      setUploadPending(upload.status === "pending");
    } catch (err) {
      console.error("Failed to save MCQ weekly result", err);
      setUploadPending(true);
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

      const finalScore = score + lastPoints;
      await finishRun(finalScore);
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
    <Background style={styles.homeBackground}>
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
            Ugens udfordringer
          </Text>

          <Pressable
            accessibilityLabel="Tilbage til Ugens udfordringer"
            accessibilityRole="button"
            style={styles.gameCloseButton}
            onPress={handleBack}
            hitSlop={10}
          >
            <Text style={styles.gameCloseButtonText}>‹</Text>
          </Pressable>
        </View>

        {resolution?.isFallback ? (
          <NoticeCard title="Kompatibilitetsindhold">
            Ugens spil bruger en ældre version af indholdet. Du kan stadig
            spille og gemme dit resultat.
          </NoticeCard>
        ) : null}
        {uploadPending ? (
          <NoticeCard title="Resultat gemt på enheden" tone="warning">
            Resultatet kunne ikke sendes nu. Det forsøges sendt igen
            fra Ugens udfordringer.
          </NoticeCard>
        ) : null}

        {loadStatus === "loading" && (
          <View style={styles.weeklyGameCenter}>
            <ActivityIndicator />
            <Text style={[styles.weeklyPlaceholderText, { marginTop: 12 }]}>
              Henter spørgsmål...
            </Text>
          </View>
        )}

        {loadStatus === "missing" ? (
          <EmptyState
            message="Der er endnu ikke udgivet quizindhold til den valgte uge."
            title="Ingen spørgsmål denne uge"
          />
        ) : null}
        {loadStatus === "invalid" || loadStatus === "error" ? (
          <ErrorState
            action={
              <SecondaryButton
                label="Prøv igen"
                onPress={() => setLoadVersion((version) => version + 1)}
              />
            }
            message={loadMessage}
            title={
              loadStatus === "invalid"
                ? "Ugens indhold kunne ikke åbnes"
                : "Ugens spørgsmål kunne ikke hentes"
            }
          />
        ) : null}

        {packLoaded && loadStatus === "ready" && !started && !finished && (
          <View style={styles.weeklyGameCenter}>
            <Text style={styles.weeklyGameTitle}>Ugens quiz</Text>

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
                {isLocked ? "Allerede spillet" : "Start spil"}
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
                {devWeekKey ? `Forhåndsvisning af uge: ${devWeekKey}` : "Denne uges emne:"}
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
              <Text style={styles.weeklyGameTitle}>Ugens quiz</Text>

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
                  backgroundColor: "rgba(20,33,39,0.90)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.20)",
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
                  backgroundColor: "#16262d",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.20)",
                  borderRadius: 12,
                  padding: 20,
                },
              ]}
            >
              <Text style={styles.statsSectionTitle}>
                Resultat – Ugens quiz
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
    </Background>
  );
}

export default WeeklyMcqScreen;
