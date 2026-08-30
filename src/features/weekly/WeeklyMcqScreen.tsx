// src/features/weekly/WeeklyMcqScreen.tsx
// ✅ ONLY CHANGE: replace the plain instruction block with the same boxed help card styling.

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  BackHandler,
  Platform,
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
import {
  EmptyState,
  ErrorState,
  LoadingState,
  NoticeCard,
  PrimaryButton,
  ResultSummary,
  SelectableChoice,
  SecondaryButton,
  Surface,
} from "../../ui/primitives";
import { getWeeklyLockKey, useWeeklyLock } from "./useWeeklyLock";
import {
  WeeklyGameFrame,
  WeeklyGameIntro,
  WeeklyGameStatus,
  WeeklyResultModal,
  weeklyGameStyles as styles,
} from "./WeeklyGameUI";

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
    <WeeklyGameFrame
      onBack={handleBack}
      subtitle="Hurtige spørgsmål om ugens emne"
      title="Ugens quiz"
    >
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

        {loadStatus === "loading" ? (
          <LoadingState title="Henter spørgsmål" />
        ) : null}

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

        {packLoaded && loadStatus === "ready" && !started && !finished ? (
          <WeeklyGameIntro
            description="Svar så hurtigt og korrekt som muligt på ugens spørgsmål."
            eyebrow="UGENS UDFORDRING"
            locked={isLocked}
            onStart={handleStart}
            rules={[
              `${totalQuestions} spørgsmål om ugens emne`,
              `${timeLimit} sekunder pr. spørgsmål`,
              "Korrekt svar inden for de første 5 sekunder giver 1000 point",
              "Derefter falder scoren med ca. 32 point pr. sekund",
              "Minimum 200 point for et korrekt svar",
              "Forkert svar eller timeout giver 0 point",
              "Spillet kan kun gennemføres én gang pr. uge",
            ]}
            title="Ugens quiz"
            topic={weeklyTopicBullet}
            topicLabel={
              devWeekKey ? `FORHÅNDSVISNING · ${devWeekKey}` : "UGENS EMNE"
            }
          />
        ) : null}

        {started && currentQuestion ? (
          <>
            <WeeklyGameStatus
              current={questionNumber}
              label="SPØRGSMÅL"
              total={totalQuestions}
              value={`Tid tilbage: ${timeLabel}`}
            />
            <View style={styles.gameStack}>
              <Surface elevated tone="elevated" style={styles.questionCard}>
                <Text style={styles.eyebrow}>{topicTitle}</Text>
                <Text style={styles.title}>{currentQuestion.text}</Text>
              </Surface>
              <View style={styles.choiceList}>
                {(shuffledOptions.length > 0
                  ? shuffledOptions
                  : currentQuestion.options
                ).map((opt) => {
                  const isSelected = selectedId === opt.id;
                  return (
                    <SelectableChoice
                      dimWhenDisabled={false}
                      disabled={showFeedback}
                      key={opt.id}
                      label={opt.text}
                      onPress={() => handleAnswer(opt.id)}
                      state={
                        showFeedback
                          ? opt.isCorrect
                            ? "correct"
                            : isSelected
                              ? "incorrect"
                              : "default"
                          : isSelected
                            ? "selected"
                            : "default"
                      }
                    />
                  );
                })}
              </View>

              {showFeedback ? (
                <View style={styles.feedback}>
                  <ResultSummary
                    message={
                      lastPoints > 0
                        ? `Du fik ${lastPoints} point.`
                        : "Forkert eller for langsom – 0 point for dette spørgsmål."
                    }
                    title={lastPoints > 0 ? "Korrekt svar" : "Ikke korrekt"}
                    tone={lastPoints > 0 ? "success" : "danger"}
                  />
                  <PrimaryButton
                    label={
                      questionNumber === totalQuestions
                        ? "Se resultat"
                        : "Næste spørgsmål"
                    }
                    onPress={handleNext}
                  />
                </View>
              ) : null}
            </View>
          </>
        ) : null}

        <WeeklyResultModal
          closeLabel="Luk"
          message="Ugens quiz er afsluttet."
          onRequestClose={handleCloseResults}
          rows={[
            {
              label: "Korrekte svar",
              value: `${correctCount} / ${totalQuestions}`,
            },
            { label: "Forkerte svar", value: String(wrongCount) },
          ]}
          title="Resultat · Ugens quiz"
          value={`${score} point`}
          visible={showResults}
        />
    </WeeklyGameFrame>
  );
}

export default WeeklyMcqScreen;
