// src/features/weekly/WeeklyWordScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  BackHandler,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";

import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  NoticeCard,
  PrimaryButton,
  ResultSummary,
  SecondaryButton,
  Surface,
} from "../../ui/primitives";
import { scrambleWord } from "./weeklyData";
import {
  WeeklyGameFrame,
  WeeklyGameIntro,
  WeeklyGameStatus,
  WeeklyResultModal,
  weeklyGameStyles as styles,
} from "./WeeklyGameUI";

import { auth } from "../../firebase/firebase";
import {
  createDirectWeeklyBundle,
  type ResolvedWeeklyBundle,
} from "../../services/weeklyIndexService";
import { WeeklyPackValidationError } from "../../services/weeklyPackValidation";
import { submitWeeklyResultReliably } from "../../services/weeklyPendingUploadService";
import { getWeeklyLockKey, useWeeklyLock } from "./useWeeklyLock";

import {
  loadThisWeeksWordPack,
  loadWordPackByWeekKey,
  pickWordFromRound,
  type WeeklyWordRound,
} from "../../services/weeklyWordService";

const WEEKLY_WORD_TIME_LIMIT_DEFAULT = 30;

// ---------- Helpers ----------
function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function getRound(rounds: WeeklyWordRound[], roundNumber: number) {
  return rounds.find((r) => r.round === roundNumber) ?? rounds[0] ?? null;
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

type WeeklyWordScreenProps = {
  headingFont: number;
  buttonFont: number;
  profileNickname?: string | null;
  onAttemptLocked: () => void;

  onBack: () => void;

  // ✅ DEV: force-load specific week doc id (e.g. "2026-W06")
  devWeekKey?: string | null;
};

export function WeeklyWordScreen({
  headingFont,
  buttonFont,
  profileNickname,
  onAttemptLocked,
  onBack,
  devWeekKey = null,
}: WeeklyWordScreenProps) {
  // ---- Pack state ----
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
  const [rounds, setRounds] = useState<WeeklyWordRound[]>([]);

  const maxRounds = rounds.length > 0 ? rounds.length : 3;

  const effectiveWeekKey =
    resolution?.canonicalWeekKey ?? devWeekKey ?? weekKey ?? null;

  // ---- Week lock ----
  const lockKey = effectiveWeekKey
    ? getWeeklyLockKey("word", effectiveWeekKey)
    : "weekly_lock_word_unknown";
  const lock = useWeeklyLock(lockKey);
  const [forceLocked, setForceLocked] = useState(false);
  const isLocked = (lock.locked || forceLocked) && !lock.ignoreLocks;

  // ---- Game state ----
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [round, setRound] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState<number>(
    WEEKLY_WORD_TIME_LIMIT_DEFAULT,
  );

  const [wordOriginal, setWordOriginal] = useState("");
  const [wordScrambled, setWordScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<"idle" | "correct" | "wrong">("idle");

  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const [showResults, setShowResults] = useState(false);


  const currentRoundData = useMemo(
    () => getRound(rounds, round),
    [rounds, round],
  );

  const weeklyTopicsBullets = useMemo(() => {
    // Show ONE weekly topic like MCQ (instead of difficulty/length meta)
    if (!topicTitle) return "- (Ingen emner endnu)";
    return `- ${topicTitle}`;
  }, [topicTitle]);

  useEffect(() => {
    setForceLocked(false);
  }, [effectiveWeekKey]);

  // ---- Load pack ----
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setPackLoaded(false);
      setLoadStatus("loading");
      setLoadMessage("");

      try {
        const res = devWeekKey
          ? await loadWordPackByWeekKey(devWeekKey)
          : await loadThisWeeksWordPack();

        if (cancelled) return;

        if (!res) {
          setWeekKey(devWeekKey ?? null);
          setTopicTitle(
            devWeekKey ? `Ingen ordindhold for ${devWeekKey}` : "Ugens emne",
          );
          setRounds([]);
          setResolution(null);
          setLoadStatus("missing");
          return;
        }

        setWeekKey(res.weekKey);
        setResolution(res.resolution);
        setTopicTitle(res.pack.topicTitle || "Ugens emne");
        setRounds(res.pack.rounds || []);
        setLoadStatus("ready");
      } catch (e) {
        console.error("Failed to load weekly Word pack", e);
        if (!cancelled) {
          setRounds([]);
          setLoadStatus(
            e instanceof WeeklyPackValidationError ? "invalid" : "error",
          );
          setLoadMessage(
            e instanceof Error ? e.message : "Ugens ord kunne ikke hentes.",
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

  // ---- Timer ----
  useEffect(() => {
    if (!started) return;

    if (secondsLeft <= 0) {
      setStarted(false);
      setFinished(true);
      setResult("wrong");
      setRoundScore(0);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, secondsLeft]);

  const hardResetUi = () => {
    setStarted(false);
    setFinished(false);
    setShowResults(false);

    setRound(1);
    setSecondsLeft(WEEKLY_WORD_TIME_LIMIT_DEFAULT);

    setWordOriginal("");
    setWordScrambled("");
    setGuess("");
    setResult("idle");

    setRoundScore(0);
    setTotalScore(0);
  };

  const lockAndExit = async () => {
    setForceLocked(true);
    if (!lock.ignoreLocks) {
      try {
        await lock.lock();
        onAttemptLocked();
      } catch (err) {
        console.error("Failed to lock Word game on exit", err);
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

  const startRound = (roundNumber: number, resetSession: boolean) => {
    const rd = getRound(rounds, roundNumber);

    if (!rd) {
      Alert.alert("Intet indhold", "Der er ingen ordrunder til denne uge endnu.");
      return;
    }

    const word = pickWordFromRound(rd);
    if (!word) {
      Alert.alert(
        "Ingen ord",
        `Runde ${roundNumber} har ingen ord endnu (eller længder matcher ikke).`,
      );
      return;
    }

    if (resetSession) setTotalScore(0);

    setRound(roundNumber);
    setWordOriginal(word);
    setWordScrambled(scrambleWord(word).toUpperCase());
    setGuess("");
    setResult("idle");

    setSecondsLeft(WEEKLY_WORD_TIME_LIMIT_DEFAULT);
    setRoundScore(0);

    setStarted(true);
    setFinished(false);
    setShowResults(false);
  };

  const handleStart = async () => {
    if (!lock.loaded) {
      Alert.alert("Indlæser", "Tjekker spilstatus...");
      return;
    }
    if (!packLoaded) {
      Alert.alert("Indlæser", "Henter ugens ord…");
      return;
    }
    if (isLocked) {
      Alert.alert(
        "Spillet er låst",
        "Du har allerede spillet Ugens ord.",
      );
      return;
    }
    if (!rounds || rounds.length === 0) {
      Alert.alert(
        "Intet indhold",
        devWeekKey
          ? `Ingen ordrunder for ${devWeekKey}.`
          : "Der er ingen ordrunder til denne uge endnu.",
      );
      return;
    }

    const firstRound =
      rounds.slice().sort((a, b) => a.round - b.round)[0]?.round ?? 1;

    if (!lock.ignoreLocks) {
      setForceLocked(true);
      try {
        await lock.lock();
        onAttemptLocked();
      } catch (err) {
        setForceLocked(false);
        console.error("Failed to lock Word attempt on start", err);
        Alert.alert("Kunne ikke starte", "Forsøget kunne ikke gemmes sikkert. Prøv igen.");
        return;
      }
    }

    startRound(firstRound, true);
  };

  const handleGuess = () => {
    if (!started) return;
    if (secondsLeft <= 0) return;

    const trimmed = guess.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert("Manglende gæt", "Skriv dit gæt, før du afleverer.");
      return;
    }

    const target = (wordOriginal || "").trim().toLowerCase();
    let s = 0;

    if (trimmed === target) {
      const elapsed = WEEKLY_WORD_TIME_LIMIT_DEFAULT - secondsLeft;
      if (elapsed <= 5) s = 5000;
      else {
        const extraSeconds = elapsed - 5;
        s = Math.max(1000, 5000 - extraSeconds * 160);
      }
      setResult("correct");
    } else {
      s = 0;
      setResult("wrong");
    }

    setRoundScore(s);
    setTotalScore((prev) => prev + s);
    setStarted(false);
    setFinished(true);
  };

  const finishRun = async (finalScore: number) => {
    setForceLocked(true);
    if (!lock.ignoreLocks) {
      try {
        await lock.lock();
        onAttemptLocked();
      } catch (err) {
        console.error("Failed to lock Word game on finish", err);
      }
    }

    try {
      const uid = await ensureAuthUid();
      const activeResolution =
        resolution ??
        createDirectWeeklyBundle(effectiveWeekKey ?? "unknown", "word");
      const upload = await submitWeeklyResultReliably({
        uid,
        nickname: profileNickname ?? "Ukendt",
        resolution: activeResolution,
        game: "word",
        score: finalScore,
      });
      setUploadPending(upload.status === "pending");
    } catch (err) {
      console.error("Failed to save Word weekly result", err);
      setUploadPending(true);
    }
  };

  const handleShowResults = () => {
    if (!finished) return;
    setShowResults(true);
  };

  const handleNextRound = () => {
    if (round >= maxRounds) return;
    startRound(round + 1, false);
  };

  const handleCloseResults = async () => {
    setShowResults(false);

    if (round >= maxRounds) {
      await finishRun(totalScore);
      hardResetUi();
      onBack();
      return;
    }
  };

  const scrambledLetters = (wordScrambled || "").split("");

  const timeLabel = formatSeconds(secondsLeft);
  const isTimeUp = secondsLeft <= 0;
  const guessLocked = finished;

  // ---------- Render ----------
  return (
    <WeeklyGameFrame
      onBack={handleBack}
      subtitle="Find ugens ambulancefaglige ord"
      title="Ugens ord"
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
          <LoadingState title="Henter ugens ord" />
        ) : null}

        {loadStatus === "missing" ? (
          <EmptyState
            message="Der er endnu ikke udgivet Word-indhold til den valgte uge."
            title="Ingen ord denne uge"
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
                : "Ugens ord kunne ikke hentes"
            }
          />
        ) : null}

        {packLoaded && loadStatus === "ready" && !started && !finished ? (
          <WeeklyGameIntro
            description="Gæt et blandet, ambulance-relevant ord på dansk, før tiden løber ud."
            eyebrow="UGENS UDFORDRING"
            locked={isLocked}
            onStart={handleStart}
            rules={[
              `Der spilles ${maxRounds} runder`,
              "Hver runde har 30 sekunders nedtælling",
              "Skriv dit gæt i feltet og tryk Gæt ord",
              "Korrekt svar inden for 5 sekunder giver 5000 point",
              "Derefter mistes 160 point pr. ekstra sekund",
              "Minimumscore for et korrekt svar er 1000 point",
              "Forkert svar eller timeout giver 0 point",
              "Spillet kan kun gennemføres én gang pr. uge",
            ]}
            title="Ugens ord"
            topic={weeklyTopicsBullets}
            topicLabel={
              devWeekKey ? `FORHÅNDSVISNING · ${devWeekKey}` : "UGENS EMNER"
            }
          />
        ) : null}

        {started || finished ? (
          <>
            <WeeklyGameStatus
              current={round}
              label="RUNDE"
              total={maxRounds}
              value={`Tid tilbage: ${timeLabel}`}
            />
            <View style={styles.gameStack}>
              <Surface elevated tone="elevated" style={styles.questionCard}>
                <Text style={styles.eyebrow}>
                  {currentRoundData?.topic ?? topicTitle}
                </Text>
                <Text style={styles.title}>Hvilket ord gemmer sig?</Text>
                <View style={styles.wordLetters}>
                  {scrambledLetters.length > 0 ? (
                    scrambledLetters.map((ch, idx) => (
                      <View key={`${ch}-${idx}`} style={styles.letterTile}>
                        <Text style={styles.letterText}>{ch}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.meta}>
                      Tryk på Start spil for at se ugens ord.
                    </Text>
                  )}
                </View>
              </Surface>
              <Surface style={styles.questionCard}>
                <Text style={styles.inputLabel}>Skriv dit gæt</Text>
                <TextInput
                  accessibilityLabel="Dit gæt"
                  autoCapitalize="characters"
                  editable={!guessLocked && !isTimeUp}
                  onChangeText={(text) => {
                    if (!guessLocked && !isTimeUp) {
                      setGuess(text.toUpperCase());
                      setResult("idle");
                    }
                  }}
                  placeholder="FX RESPIRATION"
                  style={styles.input}
                  value={guess}
                />
                <PrimaryButton
                  disabled={guessLocked || isTimeUp}
                  label={isTimeUp ? "Tiden er gået" : "Gæt ord"}
                  onPress={handleGuess}
                />
                {guessLocked || isTimeUp ? (
                  <SecondaryButton
                    label="Vis svar"
                    onPress={handleShowResults}
                  />
                ) : null}
              </Surface>
              {finished ? (
                <ResultSummary
                  message={
                    result === "correct"
                      ? `Du fik ${roundScore} point.`
                      : "Forkert eller for langsom – 0 point denne runde."
                  }
                  title={result === "correct" ? "Korrekt ord" : "Ikke korrekt"}
                  tone={result === "correct" ? "success" : "danger"}
                />
              ) : null}
            </View>
          </>
        ) : null}

        <WeeklyResultModal
          closeLabel={round >= maxRounds ? "Afslut ugens spil" : "Tilbage"}
          message={`Runde ${round} af ${maxRounds}`}
          onPrimary={round < maxRounds ? handleNextRound : undefined}
          onRequestClose={handleCloseResults}
          primaryLabel={
            round < maxRounds
              ? `Næste runde (${round + 1} / ${maxRounds})`
              : undefined
          }
          rows={[
            { label: "Korrekt ord", value: wordOriginal.toUpperCase() },
            { label: "Dit gæt", value: guess || "(ingen gæt)" },
            { label: "Point denne runde", value: String(roundScore) },
            { label: "Samlede point", value: String(totalScore) },
          ]}
          title="Resultat · Ugens ord"
          value={`${roundScore} point`}
          visible={showResults}
        />
    </WeeklyGameFrame>
  );
}

export default WeeklyWordScreen;
