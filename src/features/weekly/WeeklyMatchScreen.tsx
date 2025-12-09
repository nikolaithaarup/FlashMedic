// src/features/weekly/WeeklyMatchScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../../app/flashmedicStyles";

type WeeklyMatchPair = {
  id: string;
  left: string;
  right: string;
};

// TODO: Later: hent fra backend
const WEEKLY_MATCH_PAIRS: WeeklyMatchPair[] = [
  {
    id: "m1",
    left: "Fentanyl",
    right: "Stærkt opioid-analgetikum",
  },
  {
    id: "m2",
    left: "Ondansetron",
    right: "Antiemetikum (kvalmestillende)",
  },
  {
    id: "m3",
    left: "Buccolam (midazolam)",
    right: "Benzodiazepin mod kramper",
  },
  {
    id: "m4",
    left: "Heparin",
    right: "Antikoagulans (blodfortyndende)",
  },
  {
    id: "m5",
    left: "Adrenalin",
    right: "Katekolamin ved hjertestop/anafylaksi",
  },
];

const WEEKLY_MATCH_COLORS: Record<string, string> = {
  m1: "#ff6b6b", // rød
  m2: "#fcc419", // gul
  m3: "#40c057", // grøn
  m4: "#4dabf7", // blå
  m5: "#9775fa", // lilla
};

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type WeeklyMatchScreenProps = {
  headingFont: number;
  buttonFont: number;
  weeklyMatchLocked: boolean;
  setWeeklyMatchLocked: (locked: boolean) => void;
  profileNickname?: string | null;
  onBack: () => void;
};

export function WeeklyMatchScreen({
  headingFont,
  buttonFont,
  weeklyMatchLocked,
  setWeeklyMatchLocked,
  profileNickname,
  onBack,
}: WeeklyMatchScreenProps) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [rightItems, setRightItems] = useState<WeeklyMatchPair[]>([]);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // leftId -> rightId

  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const playerRank = 21; // placeholder til backend
  const totalPairs = WEEKLY_MATCH_PAIRS.length;
  const timeLabel = formatSeconds(timerSeconds);

  // Timer til hele spillet
  useEffect(() => {
    if (!timerRunning) return;
    if (!started || finished) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, started, finished]);

  const handleBack = () => {
    setTimerRunning(false);
    setStarted(false);
    setFinished(false);
    setShowResults(false);
    setMatches({});
    setSelectedLeftId(null);
    setSelectedRightId(null);
    setTimerSeconds(0);
    onBack();
  };

  const handleStart = () => {
    if (weeklyMatchLocked) {
      Alert.alert("Spillet er låst", "Du har allerede spillet denne uges Match Game.");
      return;
    }

    setStarted(true);
    setFinished(false);
    setMatches({});
    setSelectedLeftId(null);
    setSelectedRightId(null);
    setRightItems(shuffle(WEEKLY_MATCH_PAIRS));
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTimerSeconds(0);
    setTimerRunning(true);
  };

  const handleSelectLeft = (leftId: string) => {
    setSelectedLeftId((prev) => (prev === leftId ? null : leftId));
  };

  const handleSelectRight = (rightId: string) => {
    // Ingen venstre valgt → brug tryk på højre til at ophæve eksisterende match
    if (!selectedLeftId) {
      const existingLeftId = Object.entries(matches).find(([, r]) => r === rightId)?.[0];

      if (existingLeftId) {
        setMatches((prev) => {
          const next = { ...prev };
          delete next[existingLeftId];
          return next;
        });
      }

      setSelectedRightId((prev) => (prev === rightId ? null : rightId));
      return;
    }

    const leftId = selectedLeftId;

    setMatches((prev) => {
      const currentRightForLeft = prev[leftId];

      // Tryk på samme højre igen → fjern match
      if (currentRightForLeft === rightId) {
        const next = { ...prev };
        delete next[leftId];
        return next;
      }

      const next: Record<string, string> = { ...prev };

      // Hvis denne højre allerede er brugt, frigør det tidligere venstre
      const otherLeftId = Object.entries(next).find(([, r]) => r === rightId)?.[0];
      if (otherLeftId && otherLeftId !== leftId) {
        delete next[otherLeftId];
      }

      next[leftId] = rightId;
      return next;
    });

    setSelectedLeftId(null);
    setSelectedRightId(null);
  };

  const handleSubmit = () => {
    const total = WEEKLY_MATCH_PAIRS.length;
    let correct = 0;

    WEEKLY_MATCH_PAIRS.forEach((pair) => {
      const matchedRightId = matches[pair.id];
      if (matchedRightId === pair.id) {
        correct += 1;
      }
    });

    const wrong = total - correct;

    const baseScore = correct * 1000;
    const penalty = timerSeconds * 50;
    const finalScore = Math.max(0, baseScore - penalty);

    setCorrectCount(correct);
    setWrongCount(wrong);
    setScore(finalScore);

    setTimerRunning(false);
    setFinished(true);
    setWeeklyMatchLocked(true); // 🔒 lås via parent
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    onBack();
  };

  const rightItemsToShow = rightItems.length > 0 ? rightItems : shuffle(WEEKLY_MATCH_PAIRS);

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

        {/* Intro / regler – før start */}
        {!started && !finished && (
          <View style={styles.weeklyGameCenter}>
            <Text style={styles.weeklyGameTitle}>
              {weeklyMatchLocked ? "Match Game" : "Match Game"}
            </Text>

            <Text
              style={[
                styles.weeklyPlaceholderText,
                { textAlign: "left", alignSelf: "flex-start", marginTop: 16 },
              ]}
            >
              Match 5 elementer korrekt – fx præparat og virkning, organ og hormon, eller suffiks og
              lægemiddeltype.
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
                {"\n"}• Venstre kolonne er låst (fx præparatnavn)
                {"\n"}• Højre kolonne er blandet (fx virkninger)
                {"\n"}• Hvert felt i venstre kolonne har sin egen farve
                {"\n"}• Tryk først på et venstre felt, derefter på et højre
                {"\n"} → højre felt får samme farve = de er matchet
                {"\n"}• Vil du fortryde et match:
                {"\n"} – Tryk igen på samme kombination (venstre + samme højre)
                {"\n"} – eller tryk på et højre felt uden venstre valgt for at frigøre det
                {"\n"}• Når du er tilfreds, trykker du på "Aflever"
                {"\n"}• Point:
                {"\n"} – 1000 point for hvert korrekt match
                {"\n"} – minus 50 point for hvert sekund, du bruger i alt
              </Text>
            </View>

            <Pressable
              style={[
                styles.bigButton,
                styles.weeklyStartButton,
                { marginTop: 24 },
                weeklyMatchLocked && { opacity: 0.5 },
              ]}
              onPress={handleStart}
            >
              <Text style={[styles.bigButtonText, styles.weeklyStartButtonText]}>
                {weeklyMatchLocked ? "LÅST (allerede spillet)" : "START SPILLET"}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Aktivt spil */}
        {started && (
          <>
            <View style={styles.weeklyTimerBar}>
              <Text style={styles.weeklyTimerText}>Tid brugt: {timeLabel}</Text>
            </View>

            <View style={[styles.weeklyGameCenter, { alignItems: "stretch" }]}>
              <Text style={styles.weeklyGameTitle}>Match Game</Text>
              <Text style={styles.statsLabel}>
                Match alle {totalPairs} par og tryk derefter på "Aflever".
              </Text>

              {/* Ny grid: 2 kolonner × 5 rækker */}
              <View
                style={{
                  width: "100%",
                  maxWidth: 800,
                  marginTop: 16,
                }}
              >
                {/* Kolonne-headere */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 4,
                    gap: 12,
                  }}
                >
                  <Text style={[styles.statsLabel, { flex: 1 }]}>Venstre</Text>
                  <Text style={[styles.statsLabel, { flex: 1 }]}>Højre</Text>
                </View>

                {/* Rækkerne */}
                {WEEKLY_MATCH_PAIRS.map((leftPair, index) => {
                  const rightPair = rightItemsToShow[index];

                  // Venstre knap tilstand
                  const isSelectedLeft = selectedLeftId === leftPair.id;
                  const isMatchedLeft = matches[leftPair.id] != null;
                  const baseLeftColor = WEEKLY_MATCH_COLORS[leftPair.id] ?? "#1c7ed6";

                  const leftBackgroundColor = isSelectedLeft
                    ? baseLeftColor
                    : isMatchedLeft
                    ? baseLeftColor
                    : "#343a40";

                  // Højre knap tilstand
                  let rightBackgroundColor = "#343a40";
                  if (rightPair) {
                    const matchedLeftEntry = Object.entries(matches).find(
                      ([, r]) => r === rightPair.id,
                    );
                    const matchedLeftId = matchedLeftEntry?.[0];
                    const isSelectedRight = selectedRightId === rightPair.id;

                    if (matchedLeftId) {
                      const color = WEEKLY_MATCH_COLORS[matchedLeftId] ?? "#1c7ed6";
                      rightBackgroundColor = color;
                    } else if (isSelectedRight) {
                      rightBackgroundColor = "#1c7ed6";
                    }
                  }

                  return (
                    <View
                      key={leftPair.id}
                      style={{
                        flexDirection: "row",
                        gap: 12,
                        marginTop: 6,
                      }}
                    >
                      {/* Venstre felt */}
                      <Pressable
                        style={[
                          styles.bigButton,
                          {
                            flex: 1,
                            backgroundColor: leftBackgroundColor,
                            justifyContent: "center",
                          },
                        ]}
                        onPress={() => handleSelectLeft(leftPair.id)}
                      >
                        <Text
                          style={[
                            styles.bigButtonText,
                            { fontSize: buttonFont * 0.9, textAlign: "center" },
                          ]}
                        >
                          {leftPair.left}
                        </Text>
                      </Pressable>

                      {/* Højre felt */}
                      {rightPair ? (
                        <Pressable
                          style={[
                            styles.bigButton,
                            {
                              flex: 1,
                              backgroundColor: rightBackgroundColor,
                              justifyContent: "center",
                            },
                          ]}
                          onPress={() => handleSelectRight(rightPair.id)}
                        >
                          <Text style={[styles.bigButtonText, { fontSize: buttonFont * 0.9 }]}>
                            {rightPair.right}
                          </Text>
                        </Pressable>
                      ) : (
                        <View style={{ flex: 1 }} />
                      )}
                    </View>
                  );
                })}
              </View>

              <Pressable
                style={[
                  styles.bigButton,
                  styles.primaryButton,
                  {
                    marginTop: 24,
                    backgroundColor: "#2b8a3e",
                    alignSelf: "flex-start",
                  },
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.bigButtonText}>Aflever</Text>
              </Pressable>
            </View>
          </>
        )}

        {/* Resultat-modal */}
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
              <Text style={styles.statsSectionTitle}>Resultat – Match Game</Text>

              <Text style={[styles.statsLabel, { marginTop: 12 }]}>
                Point i alt: <Text style={styles.statsAccuracy}>{score}</Text>
              </Text>
              <Text style={styles.statsLabel}>
                Korrekte matches: {correctCount} / {totalPairs}
              </Text>
              <Text style={styles.statsLabel}>Forkerte / manglende: {wrongCount}</Text>
              <Text style={styles.statsLabel}>Tidsforbrug: {timeLabel} (−50 point pr. sekund)</Text>

              <Text style={[styles.statsLabel, { marginTop: 16 }]}>
                Foreløbig global rangliste (placeholder – backend kommer):
              </Text>

              <View style={{ marginTop: 8 }}>
                <Text style={styles.subjectStatsSub}>1. MatchMaster · 5000 pts</Text>
                <Text style={styles.subjectStatsSub}>2. NeuroNurse · 4820 pts</Text>
                <Text style={styles.subjectStatsSub}>3. ShockDoc · 4710 pts</Text>
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

export default WeeklyMatchScreen;
