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
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Skærmbredde til auto-shrink bokse
  const { width } = useWindowDimensions();

  const scrambledLetters = (wordScrambled || "").split("");

  // Tilgængelig bredde (minus padding)
  const availableWidth = width - 32;

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

  // Timer
  useEffect(() => {
    if (!started) return;

    if (secondsLeft <= 0) {
      setStarted(false);
      setFinished(true);
      setResult("wrong");
      setScore(0);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, secondsLeft]);

  const handleStart = () => {
    if (weeklyWordLocked) {
      Alert.alert("Spillet er låst", "Du har allerede spillet denne uges Word of The Week.");
      return;
    }

    const word = pickRandomWordOfWeek();
    setWordOriginal(word);
    setWordScrambled(scrambleWord(word).toUpperCase());
    setGuess("");
    setResult("idle");
    setSecondsLeft(WEEKLY_WORD_TIME_LIMIT);
    setScore(0);
    setStarted(true);
    setFinished(false);
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

    setScore(s);
    setStarted(false);
    setFinished(true);
    setWeeklyWordLocked(true); // 🔒 lås via parent efter første spil
  };

  const handleShowResults = () => {
    if (!finished) return;
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    onBack();
  };

  const handleBack = () => {
    setStarted(false);
    setFinished(false);
    setSecondsLeft(WEEKLY_WORD_TIME_LIMIT);
    setResult("idle");
    setGuess("");
    setScore(0);
    onBack();
  };

  const timeLabel = formatSeconds(secondsLeft);
  const isTimeUp = secondsLeft <= 0;
  const guessLocked = finished;
  const playerRank = 37; // placeholder til backend

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
            <Text style={styles.weeklyGameTitle}>
              {weeklyWordLocked ? "Word of The Week" : "Word of The Week"}
            </Text>

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
                {"\n"}• Du får ét medicinsk ord (6–10 bogstaver), blandet
                {"\n"}• 30 sekunders nedtælling
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
          </View>
        )}

        {/* Game / locked state */}
        {(started || finished) && (
          <>
            <View style={styles.weeklyTimerBar}>
              <Text style={styles.weeklyTimerText}>Tid tilbage: {timeLabel}</Text>
            </View>

            <View style={styles.weeklyGameCenter}>
              <Text style={styles.weeklyGameTitle}>Word of The Week</Text>

              {/* Letter boxes */}
              <View style={{ marginTop: 24, width: "100%", alignItems: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 16,
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
                          marginHorizontal: 4,
                        }}
                      >
                        <Text
                          style={{
                            color: "#f8f9fa",
                            fontSize: Math.max(18, Math.floor(boxSize * 0.6)), // lidt større tekst
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

              <Text style={[styles.statsLabel, { marginTop: 12 }]}>
                Korrekt ord: <Text style={styles.statsAccuracy}>{wordOriginal.toUpperCase()}</Text>
              </Text>
              <Text style={styles.statsLabel}>
                Dit gæt: <Text style={styles.subjectStatsSub}>{guess || "(ingen gæt)"}</Text>
              </Text>
              <Text style={styles.statsLabel}>
                Point i alt: <Text style={styles.statsAccuracy}>{score}</Text>
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
                  {playerRank}. {profileNickname ?? "Dig"} · {score} pts
                </Text>
              </View>

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

export default WeeklyWordScreen;
