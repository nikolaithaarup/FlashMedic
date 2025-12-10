// src/features/weekly/WeeklyWordScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { styles } from "../../../app/flashmedicStyles";
import { pickRandomWordOfWeek, scrambleWord } from "./weeklyData";

const WEEKLY_WORD_TIME_LIMIT = 30;
const WORD_MAX_ROUNDS = 3;

// ---------- Round config (easy → hard) ----------

type WordRoundConfig = {
  round: number;
  topic: string;
  minLength: number;
  maxLength: number;
  difficultyLabel: string;
};

// For now this is frontend-only. Later you can load this from backend.
const WORD_ROUND_CONFIGS: WordRoundConfig[] = [
  {
    round: 1,
    topic: "Let",
    minLength: 4,
    maxLength: 4,
    difficultyLabel: "let",
  },
  {
    round: 2,
    topic: "Mellem – 5–6 bogstaver",
    minLength: 5,
    maxLength: 6,
    difficultyLabel: "mellem",
  },
  {
    round: 3,
    topic: "Svær – 6–10 bogstaver",
    minLength: 6,
    maxLength: 10,
    difficultyLabel: "svær",
  },
];

function getRoundConfig(round: number): WordRoundConfig {
  return WORD_ROUND_CONFIGS.find((c) => c.round === round) ?? WORD_ROUND_CONFIGS[0];
}

// Keep using pickRandomWordOfWeek, but “filter” by length for each round.
function pickWordForRound(round: number): string {
  const { minLength, maxLength } = getRoundConfig(round);

  let attempts = 0;
  let word = pickRandomWordOfWeek();

  while (attempts < 50 && (word.length < minLength || word.length > maxLength)) {
    word = pickRandomWordOfWeek();
    attempts++;
  }

  // Fallback hvis der ikke er ord i den ønskede længde
  return word;
}

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

type WeeklyWordScreenProps = {
  headingFont: number;
  buttonFont: number;
  profileNickname?: string | null;
  weeklyWordLocked: boolean;
  setWeeklyWordLocked: (locked: boolean) => void;
  onBack: () => void;
};

export function WeeklyWordScreen({
  headingFont,
  buttonFont,
  profileNickname,
  weeklyWordLocked,
  setWeeklyWordLocked,
  onBack,
}: WeeklyWordScreenProps) {
  const [wordOriginal, setWordOriginal] = useState("");
  const [wordScrambled, setWordScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<"idle" | "correct" | "wrong">("idle");

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(WEEKLY_WORD_TIME_LIMIT);

  // Rounds + scoring
  const [round, setRound] = useState(1);
  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const [showResults, setShowResults] = useState(false);

  // Skærmbredde til auto-shrink bokse
  const { width } = useWindowDimensions();

  const scrambledLetters = (wordScrambled || "").split("");

  // Tilgængelig bredde (minus padding), men maks ca. samme bredde som tekstfeltet
  const MAX_LETTER_ROW_WIDTH = 500;
  const availableWidth = Math.min(width, MAX_LETTER_ROW_WIDTH) - 32;

  // Dynamisk boksstørrelse så ordet kan være på én linje
  const boxSize =
    scrambledLetters.length > 0
      ? Math.max(
          26,
          Math.floor(
            (availableWidth - (scrambledLetters.length - 1) * 8) / scrambledLetters.length,
          ),
        )
      : 40;
  const LETTER_GAP = 8;
  const totalRowWidth =
    scrambledLetters.length > 0
      ? scrambledLetters.length * boxSize + (scrambledLetters.length - 1) * LETTER_GAP
      : 0;

  // Timer
  useEffect(() => {
    if (!started) return;

    if (secondsLeft <= 0) {
      // Tiden er gået for denne runde
      setStarted(false);
      setFinished(true);
      setResult("wrong");
      setRoundScore(0);
      // totalScore ændres ikke (0 point for runden)
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, secondsLeft]);

  const startRound = (roundNumber: number) => {
    const word = pickWordForRound(roundNumber);
    setRound(roundNumber);
    setWordOriginal(word);
    setWordScrambled(scrambleWord(word).toUpperCase());
    setGuess("");
    setResult("idle");
    setSecondsLeft(WEEKLY_WORD_TIME_LIMIT);
    setRoundScore(0);
    setStarted(true);
    setFinished(false);
  };

  const handleStart = () => {
    if (weeklyWordLocked) {
      Alert.alert("Spillet er låst", "Du har allerede spillet denne uges Word of The Week.");
      return;
    }

    // Ny 3-runders session
    setTotalScore(0);
    startRound(1);
  };

  const handleGuess = () => {
    if (!started) return;
    if (secondsLeft <= 0) return;

    const trimmed = guess.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert("Manglende gæt", "Skriv dit gæt, før du afleverer.");
      return;
    }

    const target = wordOriginal.toLowerCase();
    let s = 0;

    if (trimmed === target) {
      const elapsed = WEEKLY_WORD_TIME_LIMIT - secondsLeft;

      if (elapsed <= 5) {
        s = 5000;
      } else {
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

  const handleShowResults = () => {
    if (!finished) return;
    setShowResults(true);
  };

  const handleNextRound = () => {
    if (round >= WORD_MAX_ROUNDS) return;

    const nextRound = round + 1;
    setShowResults(false);
    startRound(nextRound);
  };

  const handleCloseResults = () => {
    setShowResults(false);

    // Efter sidste runde låses spillet
    if (round >= WORD_MAX_ROUNDS) {
      setWeeklyWordLocked(true);
    }

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
            onPress: () => {
              setWeeklyWordLocked(true);
              setStarted(false);
              setFinished(true);
              setShowResults(false);
              onBack();
            },
          },
        ],
      );
      return;
    }

    // normal exit when not mid-game
    onBack();
  };

  const timeLabel = formatSeconds(secondsLeft);
  const isTimeUp = secondsLeft <= 0;
  const guessLocked = finished;
  const playerRank = 37; // placeholder til backend

  const currentRoundConfig = getRoundConfig(round);

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

        {/* Intro screen */}
        {!started && !finished && (
          <View style={styles.weeklyGameCenter}>
            <Text style={styles.weeklyGameTitle}>Word of The Week</Text>

            <Text
              style={[
                styles.weeklyPlaceholderText,
                { textAlign: "left", alignSelf: "flex-start", marginTop: 16 },
              ]}
            >
              Gæt et blandet, ambulance-relevant ord på dansk, før tiden løber ud.
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
                {"\n"}• Der spilles {WORD_MAX_ROUNDS} runder med stigende sværhedsgrad
                {"\n"}• Runde 1: 4 bogstaver (let)
                {"\n"}• Runde 2: 5–6 bogstaver (mellem)
                {"\n"}• Runde 3: 6–10 bogstaver (svær)
                {"\n"}• 30 sekunders nedtælling pr. runde
                {"\n"}• Bogstaverne vises i store bogstaver i små bokse (Countdown-style)
                {"\n"}• Skriv dit gæt i feltet nedenunder
                {"\n"}• Tryk på "Gæt ord" for at låse dit svar
                {"\n"}• Når svaret er låst, kan du ikke ændre det
                {"\n"}• Derefter kan du trykke "Vis svar" og se facit + point
                {"\n\n"}Point:
                {"\n"}• Korrekt svar inden for de første 5 sekunder: 5000 point
                {"\n"}• Herefter mister du 160 point pr. ekstra sekund
                {"\n"}• Minimumscore for korrekt svar: 1000 point
                {"\n"}• Forkert svar eller timeout: 0 point
                {"\n\n"}Der spilles {WORD_MAX_ROUNDS} runder, og pointene lægges sammen.
              </Text>
            </View>

            <Pressable
              style={[
                styles.bigButton,
                styles.weeklyStartButton,
                { marginTop: 24 },
                weeklyWordLocked && { opacity: 0.5 },
              ]}
              onPress={handleStart}
            >
              <Text style={[styles.bigButtonText, styles.weeklyStartButtonText]}>
                {weeklyWordLocked ? "LÅST (allerede spillet)" : "START SPILLET"}
              </Text>
            </Pressable>

            {/* Weekly topics summary under START – unified style */}
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
              {/* Larger label */}
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
                Denne ugens emner er:
              </Text>

              {/* Per-round topics as bullets */}
              {WORD_ROUND_CONFIGS.map((config) => {
                const lengthText =
                  config.minLength === config.maxLength
                    ? `${config.minLength} bogstaver`
                    : `${config.minLength}-${config.maxLength} bogstaver`;

                return (
                  <Text
                    key={config.round}
                    style={[
                      styles.weeklyPlaceholderText,
                      { marginTop: 4, textAlign: "left", lineHeight: 22 },
                    ]}
                  >
                    - {config.topic} ({config.difficultyLabel}: {lengthText})
                  </Text>
                );
              })}
            </View>
          </View>
        )}

        {/* Game / locked state */}
        {(started || finished) && (
          <>
            <View style={styles.weeklyTimerBar}>
              <Text style={styles.weeklyTimerText}>
                Tid tilbage: {timeLabel} · Runde {round} / {WORD_MAX_ROUNDS}
              </Text>
            </View>

            <View style={styles.weeklyGameCenter}>
              <Text style={styles.weeklyGameTitle}>Word of The Week</Text>

              {/* Subtitle with topic per round */}
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
                Runde {round}: {currentRoundConfig.topic}
              </Text>

              {/* Letter boxes */}
              <View
                style={{
                  marginTop: 24,
                  width: "100%",
                  alignItems: "center",
                }}
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

              {/* Answer field */}
              <View
                style={{
                  marginTop: 24,
                  width: "100%",
                  maxWidth: 500,
                  alignSelf: "center",
                }}
              >
                <Text style={[styles.statsLabel, { marginBottom: 8, textAlign: "center" }]}>
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

              {/* Buttons */}
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
                      backgroundColor: guessLocked || isTimeUp ? "#495057" : "#1c7ed6",
                      alignSelf: "stretch",
                    },
                  ]}
                  disabled={guessLocked || isTimeUp}
                  onPress={handleGuess}
                >
                  <Text style={styles.bigButtonText}>{isTimeUp ? "TIDEN ER GÅET" : "GÆT ORD"}</Text>
                </Pressable>

                {(guessLocked || isTimeUp) && (
                  <Pressable
                    style={[
                      styles.bigButton,
                      styles.secondaryButton,
                      {
                        backgroundColor: "#2b8a3e",
                        alignSelf: "stretch",
                      },
                    ]}
                    onPress={handleShowResults}
                  >
                    <Text style={styles.bigButtonText}>VIS SVAR</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </>
        )}

        {/* Results modal */}
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
              <Text style={styles.statsSectionTitle}>Resultat – Word of The Week</Text>

              <Text style={[styles.statsLabel, { marginTop: 8 }]}>
                Runde {round} af {WORD_MAX_ROUNDS}
              </Text>

              <Text style={[styles.statsLabel, { marginTop: 12 }]}>
                Korrekt ord: <Text style={styles.statsAccuracy}>{wordOriginal.toUpperCase()}</Text>
              </Text>
              <Text style={styles.statsLabel}>
                Dit gæt: <Text style={styles.subjectStatsSub}>{guess || "(ingen gæt)"}</Text>
              </Text>
              <Text style={styles.statsLabel}>
                Point denne runde: <Text style={styles.statsAccuracy}>{roundScore}</Text>
              </Text>
              <Text style={styles.statsLabel}>
                Samlede point (alle runder): <Text style={styles.statsAccuracy}>{totalScore}</Text>
              </Text>

              <Text style={[styles.statsLabel, { marginTop: 16 }]}>
                Foreløbig global rangliste (placeholder – ægte ranking kommer med backend):
              </Text>

              <View style={{ marginTop: 8 }}>
                <Text style={styles.subjectStatsSub}>1. CountdownKing · 5000 pts</Text>
                <Text style={styles.subjectStatsSub}>2. NeuroLex · 4820 pts</Text>
                <Text style={styles.subjectStatsSub}>3. ShockSpell · 4710 pts</Text>
                <Text style={styles.subjectStatsSub}>...</Text>
                <Text style={styles.subjectStatsSub}>
                  {playerRank}. {profileNickname ?? "Dig"} · {totalScore} pts
                </Text>
              </View>

              {round < WORD_MAX_ROUNDS && (
                <Pressable
                  style={[
                    styles.bigButton,
                    styles.primaryButton,
                    { marginTop: 24, backgroundColor: "#1c7ed6" },
                  ]}
                  onPress={handleNextRound}
                >
                  <Text style={styles.bigButtonText}>
                    Næste runde ({round + 1} / {WORD_MAX_ROUNDS})
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={[styles.modalCloseButton, { marginTop: 16 }]}
                onPress={handleCloseResults}
              >
                <Text style={styles.modalCloseText}>
                  {round >= WORD_MAX_ROUNDS ? "Afslut ugens spil" : "Tilbage til Weekly"}
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
// --------------------------------------- End of WeeklyWordScreen.tsx ---------------------------------------
