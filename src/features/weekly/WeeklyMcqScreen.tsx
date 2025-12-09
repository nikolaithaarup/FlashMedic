// src/features/weekly/WeeklyMcqScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../../app/flashmedicStyles";

// ---------- Types & data ----------

export type WeeklyMcqOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type WeeklyMcqQuestion = {
  id: string;
  text: string;
  options: WeeklyMcqOption[];
};

const WEEKLY_MCQ_TIME_LIMIT = 30; // seconds per question

// TODO: Later: load from backend
const WEEKLY_MCQ_QUESTIONS: WeeklyMcqQuestion[] = [
  {
    id: "q1",
    text: "Du ankommer til en 65-årig mand med pludseligt opstået åndenød. Hvad er dit første fokus i ABCDE?",
    options: [
      { id: "q1a", text: " Sikre frie luftveje", isCorrect: true },
      { id: "q1b", text: " Måle saturation og frekvens", isCorrect: false },
      { id: "q1c", text: " Måle blodtryk", isCorrect: false },
      { id: "q1d", text: " GCS og pupilreaktion", isCorrect: false },
    ],
  },
  {
    id: "q2",
    text: "Hvad er den mest alvorlige mistanke ved pludselig, skarp, ensidig brystsmerte og åndenød hos en yngre patient?",
    options: [
      { id: "q2a", text: "Gastroøsofageal refluks", isCorrect: false },
      { id: "q2b", text: "Pneumoni", isCorrect: false },
      { id: "q2c", text: "Pneumothorax", isCorrect: true },
      { id: "q2d", text: "Muskelstræk", isCorrect: false },
    ],
  },
  {
    id: "q3",
    text: "En diabetiker er vågen, kold-svedende og konfus. Blodsukkeret er 2,1 mmol/L. Første tiltager?",
    options: [
      { id: "q3a", text: "Give insulin", isCorrect: false },
      { id: "q3b", text: "Give hurtigtvirkende kulhydrat per os", isCorrect: true },
      { id: "q3c", text: "Give væske intravenøst uden kulhydrat", isCorrect: false },
      { id: "q3d", text: "Intubere med det samme", isCorrect: false },
    ],
  },
  {
    id: "q4",
    text: "Ved mistanke om apopleksi (stroke) er det vigtigste præhospitale fokus:",
    options: [
      { id: "q4a", text: "Smertedækning til VAS 0", isCorrect: false },
      {
        id: "q4b",
        text: "Tidlig tidstagning og hurtig transport til stroke-center",
        isCorrect: true,
      },
      { id: "q4c", text: "At tage fuld medicinliste før afgang", isCorrect: false },
      { id: "q4d", text: "At starte antibiotika præhospitalt", isCorrect: false },
    ],
  },
  {
    id: "q5",
    text: "En patient klager over trykkende brystsmerter med udstråling til venstre arm og kæbe. Hvad er mest korrekt?",
    options: [
      { id: "q5a", text: "Tænk først muskelsmerter fra skulder", isCorrect: false },
      { id: "q5b", text: "Mistænk akut koronart syndrom", isCorrect: true },
      { id: "q5c", text: "Tænk primært galdesten", isCorrect: false },
      { id: "q5d", text: "Afvent og se om det går over", isCorrect: false },
    ],
  },
];

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

// simple shuffle helper
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type WeeklyMcqScreenProps = {
  headingFont: number;
  buttonFont: number;
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
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(WEEKLY_MCQ_TIME_LIMIT);

  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [timerRunning, setTimerRunning] = useState(false);

  // keep shuffled options per question so order is stable while answering
  const [shuffledOptions, setShuffledOptions] = useState<WeeklyMcqOption[]>([]);

  const currentQuestion = WEEKLY_MCQ_QUESTIONS[index];
  const totalQuestions = WEEKLY_MCQ_QUESTIONS.length;
  const questionNumber = index + 1;
  const timeLabel = formatSeconds(secondsLeft);
  const playerRank = 15; // placeholder til backend

  // keep options shuffled per question
  useEffect(() => {
    if (currentQuestion) {
      setShuffledOptions(shuffle(currentQuestion.options));
    } else {
      setShuffledOptions([]);
    }
  }, [index, started, currentQuestion]);

  // Countdown
  useEffect(() => {
    if (!timerRunning) return;
    if (!started || showFeedback || finished) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Time out on this question: 0 points, count as wrong
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

  // Handlers
  const handleBack = () => {
    setTimerRunning(false);
    setStarted(false);
    setFinished(false);
    setShowFeedback(false);
    setSecondsLeft(WEEKLY_MCQ_TIME_LIMIT);
    setSelectedId(null);
    setLastPoints(0);
    onBack();
  };

  const handleStart = () => {
    if (weeklyMcqLocked) {
      Alert.alert("Spillet er låst", "Du har allerede spillet denne uges Multiple Choice Game.");
      return;
    }

    if (!WEEKLY_MCQ_QUESTIONS || WEEKLY_MCQ_QUESTIONS.length === 0) {
      Alert.alert("Ingen spørgsmål", "Ingen MCQ-spørgsmål til denne uge endnu.");
      return;
    }

    setStarted(true);
    setFinished(false);
    setIndex(0);
    setSecondsLeft(WEEKLY_MCQ_TIME_LIMIT);
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
      const elapsed = WEEKLY_MCQ_TIME_LIMIT - secondsLeft;
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
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const nextIndex = index + 1;

    if (nextIndex >= totalQuestions) {
      // done – tell parent to lock MCQ for this week
      setStarted(false);
      setFinished(true);
      setShowFeedback(false);
      setSelectedId(null);
      setSecondsLeft(WEEKLY_MCQ_TIME_LIMIT);
      setWeeklyMcqLocked(true); // ⬅️ pattern to copy for Match/Word
      setShowResults(true);
      return;
    }

    setIndex(nextIndex);
    setSelectedId(null);
    setShowFeedback(false);
    setLastPoints(0);
    setSecondsLeft(WEEKLY_MCQ_TIME_LIMIT);
    setTimerRunning(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setFinished(true);
    setStarted(false);
    setSelectedId(null);
    setShowFeedback(false);
    setSecondsLeft(WEEKLY_MCQ_TIME_LIMIT);
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

        {/* Intro screen */}
        {!started && !finished && (
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
                {"\n"}• {totalQuestions} spørgsmål om et præhospitalt emne
                {"\n"}• 30 sekunder pr. spørgsmål
                {"\n"}• Korrekt svar inden for de første 5 sekunder: 1000 point
                {"\n"}• Derefter falder scoren med ca. 32 point pr. sekund
                {"\n"}• Minimum 200 point for et korrekt svar
                {"\n"}• Forkert svar eller timeout: 0 point
                {"\n\n"}
                Du kan kun spille dette spil én gang pr. uge, når backend er koblet på.
              </Text>
            </View>

            <Pressable
              style={[
                styles.bigButton,
                styles.weeklyStartButton,
                { marginTop: 24 },
                weeklyMcqLocked && { opacity: 0.5 },
              ]}
              onPress={handleStart}
            >
              <Text style={[styles.bigButtonText, styles.weeklyStartButtonText]}>
                {weeklyMcqLocked ? "LÅST (allerede spillet)" : "START SPILLET"}
              </Text>
            </Pressable>
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
                      if (opt.isCorrect) {
                        backgroundColor = "#2b8a3e"; // green
                      } else if (isSelected && !opt.isCorrect) {
                        backgroundColor = "#c92a2a"; // red
                      } else {
                        backgroundColor = "#495057";
                      }
                    } else if (isSelected) {
                      backgroundColor = "#1c7ed6";
                    }

                    return (
                      <Pressable
                        key={opt.id}
                        style={[
                          styles.bigButton,
                          {
                            alignSelf: "stretch",
                            marginTop: 8,
                            backgroundColor,
                          },
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
                      {questionNumber === totalQuestions ? "Se resultat" : "Næste spørgsmål"}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </>
        )}

        {/* Result modal */}
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
