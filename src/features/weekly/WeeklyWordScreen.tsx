// src/features/weekly/WeeklyWordScreen.tsx
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
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

import { styles } from "../../ui/flashmedicStyles";
import { scrambleWord } from "./weeklyData";

import { auth } from "../../firebase/firebase";
import { saveWeeklyResult } from "../../services/weeklyResultsService";
import { useWeeklyLock } from "./useWeeklyLock";

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

  weeklyWordLocked: boolean; // backward compat
  setWeeklyWordLocked: (locked: boolean) => void;

  onBack: () => void;

  // ✅ DEV: force-load specific week doc id (e.g. "2026-W06")
  devWeekKey?: string | null;
};

export function WeeklyWordScreen({
  headingFont,
  buttonFont,
  profileNickname,
  weeklyWordLocked,
  setWeeklyWordLocked,
  onBack,
  devWeekKey = null,
}: WeeklyWordScreenProps) {
  // ---- Pack state ----
  const [packLoaded, setPackLoaded] = useState(false);
  const [weekKey, setWeekKey] = useState<string | null>(null);
  const [topicTitle, setTopicTitle] = useState<string>("Ugens emne");
  const [rounds, setRounds] = useState<WeeklyWordRound[]>([]);

  const maxRounds = rounds.length > 0 ? rounds.length : 3;

  const effectiveWeekKey = weekKey ?? devWeekKey ?? null;

  // ---- Week lock ----
  const lockKey = effectiveWeekKey
    ? `weekly_lock_word_${effectiveWeekKey}`
    : "weekly_lock_word_unknown";
  const lock = useWeeklyLock(lockKey);
  const [forceLocked, setForceLocked] = useState(false);
  const isLocked =
    (weeklyWordLocked || lock.locked || forceLocked) && !lock.ignoreLocks;

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

  const { width } = useWindowDimensions();

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

      try {
        const res = devWeekKey
          ? await loadWordPackByWeekKey(devWeekKey)
          : await loadThisWeeksWordPack();

        if (cancelled) return;

        if (!res) {
          setWeekKey(devWeekKey ?? null);
          setTopicTitle(
            devWeekKey ? `Ingen Word pack for ${devWeekKey}` : "Ugens emne",
          );
          setRounds([]);
          return;
        }

        setWeekKey(res.weekKey);
        setTopicTitle(res.pack.topicTitle || "Ugens emne");
        setRounds(res.pack.rounds || []);
      } catch (e) {
        console.error("Failed to load weekly Word pack", e);
        if (!cancelled) setRounds([]);
      } finally {
        if (!cancelled) setPackLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [devWeekKey]);

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
    setWeeklyWordLocked(true);

    if (!lock.ignoreLocks) {
      try {
        await lock.lock();
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

  const startRound = (roundNumber: number, resetSession: boolean) => {
    const rd = getRound(rounds, roundNumber);

    if (!rd) {
      Alert.alert("Ingen indhold", "Ingen Word-runder til denne uge endnu.");
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

  const handleStart = () => {
    if (!lock.loaded) {
      Alert.alert("Indlæser", "Tjekker spilstatus...");
      return;
    }
    if (!packLoaded) {
      Alert.alert("Indlæser", "Henter Word pack...");
      return;
    }
    if (isLocked) {
      Alert.alert(
        "Spillet er låst",
        "Du har allerede spillet denne uges Word of The Week.",
      );
      return;
    }
    if (!rounds || rounds.length === 0) {
      Alert.alert(
        "Ingen indhold",
        devWeekKey
          ? `Ingen Word-runder for ${devWeekKey}.`
          : "Ingen Word-runder til denne uge endnu.",
      );
      return;
    }

    const firstRound =
      rounds.slice().sort((a, b) => a.round - b.round)[0]?.round ?? 1;

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
    setWeeklyWordLocked(true);

    if (!lock.ignoreLocks) {
      try {
        await lock.lock();
      } catch (err) {
        console.error("Failed to lock Word game on finish", err);
      }
    }

    try {
      const uid = await ensureAuthUid();
      await saveWeeklyResult({
        uid,
        nickname: profileNickname ?? "Ukendt",
        weekKey: effectiveWeekKey,
        wordScore: finalScore,
      });
    } catch (err) {
      console.error("Failed to save Word weekly result", err);
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

  // ---- Letter boxes math ----
  const scrambledLetters = (wordScrambled || "").split("");
  const MAX_LETTER_ROW_WIDTH = 500;
  const availableWidth = Math.min(width, MAX_LETTER_ROW_WIDTH) - 32;

  const boxSize =
    scrambledLetters.length > 0
      ? Math.max(
          26,
          Math.floor(
            (availableWidth - (scrambledLetters.length - 1) * 8) /
              scrambledLetters.length,
          ),
        )
      : 40;

  const LETTER_GAP = 8;
  const totalRowWidth =
    scrambledLetters.length > 0
      ? scrambledLetters.length * boxSize +
        (scrambledLetters.length - 1) * LETTER_GAP
      : 0;

  const timeLabel = formatSeconds(secondsLeft);
  const isTimeUp = secondsLeft <= 0;
  const guessLocked = finished;

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
              Henter Word pack...
            </Text>
          </View>
        )}

        {packLoaded && !started && !finished && (
          <View style={styles.weeklyGameCenter}>
            <Text style={styles.weeklyGameTitle}>Word of The Week</Text>

            <Text
              style={[
                styles.weeklyPlaceholderText,
                { textAlign: "left", alignSelf: "flex-start", marginTop: 16 },
              ]}
            >
              Gæt et blandet, ambulance-relevant ord på dansk, før tiden løber
              ud.
            </Text>

            <View
              style={{
                marginTop: 16,
                width: "100%",
                maxWidth: 700,
                alignSelf: "flex-start",
              }}
            >
              <Text style={styles.statsLabel}>Sådan fungerer spillet:</Text>
              <Text style={styles.drugTheoryText}>
                {"\n"}• Der spilles {maxRounds} runder
                {"\n"}• 30 sekunders nedtælling pr. runde
                {"\n"}• Skriv dit gæt i feltet og tryk “Gæt ord”
                {"\n\n"}Point:
                {"\n"}• Korrekt svar inden for 5 sekunder: 5000 point
                {"\n"}• Derefter mister du 160 point pr. ekstra sekund
                {"\n"}• Minimumscore for korrekt svar: 1000 point
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
                {devWeekKey
                  ? `Preview uge: ${devWeekKey}`
                  : "Denne uges emner:"}
              </Text>

              <Text
                style={[
                  styles.weeklyPlaceholderText,
                  { textAlign: "left", lineHeight: 24 },
                ]}
              >
                {weeklyTopicsBullets}
              </Text>
            </View>
          </View>
        )}

        {(started || finished) && (
          <>
            <View style={styles.weeklyTimerBar}>
              <Text style={styles.weeklyTimerText}>
                Tid tilbage: {timeLabel} · Runde {round} / {maxRounds}
              </Text>
            </View>

            <View style={styles.weeklyGameCenter}>
              <Text style={styles.weeklyGameTitle}>Word of The Week</Text>

              <Text
                style={[
                  styles.weeklyPlaceholderText,
                  {
                    marginTop: 4,
                    textAlign: "center",
                    alignSelf: "center",
                    fontStyle: "italic",
                  },
                ]}
              >
                Runde {round}: {currentRoundData?.topic ?? "Ugens emne"}
              </Text>

              <View
                style={{ marginTop: 24, width: "100%", alignItems: "center" }}
              >
                <View
                  style={{
                    width: totalRowWidth,
                    maxWidth: 500,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {scrambledLetters.length > 0 ? (
                    scrambledLetters.map((ch, idx) => (
                      <View
                        key={`${ch}-${idx}`}
                        style={{
                          width: boxSize,
                          height: Math.floor(boxSize * 1.3),
                          borderRadius: 6,
                          borderWidth: 2,
                          borderColor: "#f8f9fa",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#343a40dd",
                        }}
                      >
                        <Text
                          style={{
                            color: "#f8f9fa",
                            fontSize: Math.max(18, Math.floor(boxSize * 0.6)),
                            fontWeight: "700",
                          }}
                        >
                          {ch}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.weeklyPlaceholderText}>
                      Tryk START for at se ugens ord.
                    </Text>
                  )}
                </View>
              </View>

              <View
                style={{
                  marginTop: 24,
                  width: "100%",
                  maxWidth: 500,
                  alignSelf: "center",
                }}
              >
                <Text
                  style={[
                    styles.statsLabel,
                    { marginBottom: 8, textAlign: "center" },
                  ]}
                >
                  Skriv dit gæt:
                </Text>
                <TextInput
                  value={guess}
                  onChangeText={(text) => {
                    if (!guessLocked && !isTimeUp) {
                      setGuess(text.toUpperCase());
                      setResult("idle");
                    }
                  }}
                  placeholder="FX RESPIRATION"
                  placeholderTextColor="#adb5bd"
                  autoCapitalize="none"
                  editable={!guessLocked && !isTimeUp}
                  style={[
                    styles.textInput,
                    {
                      textAlign: "center",
                      fontSize: 26,
                      letterSpacing: 4,
                      textTransform: "uppercase",
                      borderWidth: 0,
                      borderBottomWidth: 3,
                      borderBottomColor: "#f8f9fa",
                      backgroundColor: "#212529dd",
                      paddingVertical: 10,
                      color: "#ffffff",
                    },
                  ]}
                />
              </View>

              <View
                style={{
                  marginTop: 24,
                  width: "100%",
                  maxWidth: 500,
                  alignSelf: "center",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Pressable
                  style={[
                    styles.bigButton,
                    styles.primaryButton,
                    {
                      backgroundColor:
                        guessLocked || isTimeUp ? "#495057" : "#1c7ed6",
                      alignSelf: "stretch",
                    },
                  ]}
                  disabled={guessLocked || isTimeUp}
                  onPress={handleGuess}
                >
                  <Text style={styles.bigButtonText}>
                    {isTimeUp ? "TIDEN ER GÅET" : "GÆT ORD"}
                  </Text>
                </Pressable>

                {(guessLocked || isTimeUp) && (
                  <Pressable
                    style={[
                      styles.bigButton,
                      styles.secondaryButton,
                      { backgroundColor: "#2b8a3e", alignSelf: "stretch" },
                    ]}
                    onPress={handleShowResults}
                  >
                    <Text style={styles.bigButtonText}>VIS SVAR</Text>
                  </Pressable>
                )}
              </View>

              {finished && (
                <View style={{ marginTop: 16, alignItems: "center" }}>
                  <Text
                    style={
                      result === "correct"
                        ? styles.weeklyWordFeedbackCorrect
                        : styles.weeklyWordFeedbackWrong
                    }
                  >
                    {result === "correct"
                      ? `Korrekt! Du fik ${roundScore} point.`
                      : "Forkert eller for langsom – 0 point denne runde."}
                  </Text>
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
                Resultat – Word of The Week
              </Text>

              <Text style={[styles.statsLabel, { marginTop: 8 }]}>
                Runde {round} af {maxRounds}
              </Text>

              <Text style={[styles.statsLabel, { marginTop: 12 }]}>
                Korrekt ord:{" "}
                <Text style={styles.statsAccuracy}>
                  {wordOriginal.toUpperCase()}
                </Text>
              </Text>

              <Text style={styles.statsLabel}>
                Dit gæt:{" "}
                <Text style={styles.subjectStatsSub}>
                  {guess || "(ingen gæt)"}
                </Text>
              </Text>

              <Text style={styles.statsLabel}>
                Point denne runde:{" "}
                <Text style={styles.statsAccuracy}>{roundScore}</Text>
              </Text>

              <Text style={styles.statsLabel}>
                Samlede point (alle runder):{" "}
                <Text style={styles.statsAccuracy}>{totalScore}</Text>
              </Text>

              {round < maxRounds && (
                <Pressable
                  style={[
                    styles.bigButton,
                    styles.primaryButton,
                    { marginTop: 24, backgroundColor: "#1c7ed6" },
                  ]}
                  onPress={handleNextRound}
                >
                  <Text style={styles.bigButtonText}>
                    Næste runde ({round + 1} / {maxRounds})
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={[styles.modalCloseButton, { marginTop: 16 }]}
                onPress={handleCloseResults}
              >
                <Text style={styles.modalCloseText}>
                  {round >= maxRounds ? "Afslut ugens spil" : "Tilbage"}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}

export default WeeklyWordScreen;
