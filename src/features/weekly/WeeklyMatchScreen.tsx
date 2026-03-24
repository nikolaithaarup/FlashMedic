// src/features/weekly/WeeklyMatchScreen.tsx

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
  loadMatchPackByWeekKey,
  loadThisWeeksMatchPack,
  type WeeklyMatchPair,
  type WeeklyMatchRound,
} from "../../services/weeklyMatchService";

// ---------- Helpers ----------
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

const MATCH_COLORS = [
  "#1971c2",
  "#2b8a3e",
  "#e67700",
  "#9c36b5",
  "#c2255c",
  "#5f3dc4",
  "#0b7285",
  "#495057",
];

type WeeklyMatchScreenProps = {
  headingFont: number;
  buttonFont: number;

  weeklyMatchLocked: boolean;
  setWeeklyMatchLocked: (locked: boolean) => void;

  profileNickname?: string | null;
  onBack: () => void;

  devWeekKey?: string | null;
};

export function WeeklyMatchScreen({
  headingFont,
  buttonFont,
  weeklyMatchLocked,
  setWeeklyMatchLocked,
  profileNickname,
  onBack,
  devWeekKey = null,
}: WeeklyMatchScreenProps) {
  // ---- Pack state ----
  const [packLoaded, setPackLoaded] = useState(false);
  const [weekKey, setWeekKey] = useState<string | null>(null);
  const [topicTitle, setTopicTitle] = useState<string>("Ugens emne");
  const [rounds, setRounds] = useState<WeeklyMatchRound[]>([]);

  const maxRounds = rounds.length > 0 ? rounds.length : 1;

  const effectiveWeekKey = weekKey ?? devWeekKey ?? null;

  // ---- Week lock ----
  const lockKey = effectiveWeekKey
    ? `weekly_lock_match_${effectiveWeekKey}`
    : "weekly_lock_match_unknown";
  const lock = useWeeklyLock(lockKey);

  // local immediate lock so UI locks instantly on quit/finish
  const [forceLocked, setForceLocked] = useState(false);

  const isLocked =
    (weeklyMatchLocked || lock.locked || forceLocked) && !lock.ignoreLocks;

  // ---- Game state ----
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [leftItems, setLeftItems] = useState<WeeklyMatchPair[]>([]);
  const [rightItems, setRightItems] = useState<WeeklyMatchPair[]>([]);

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // leftId -> rightId

  // leftId -> color index, so matched left/right share same color
  const [matchColorMap, setMatchColorMap] = useState<Record<string, number>>(
    {},
  );

  // ---- Rounds + scoring ----
  const [round, setRound] = useState(1);
  const [lastRoundScore, setLastRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const timeLabel = formatSeconds(timerSeconds);

  // ---- Load pack ----
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setPackLoaded(false);

      try {
        const res = devWeekKey
          ? await loadMatchPackByWeekKey(devWeekKey)
          : await loadThisWeeksMatchPack();

        if (cancelled) return;

        if (!res) {
          setWeekKey(devWeekKey ?? null);
          setTopicTitle(
            devWeekKey ? `Ingen Match pack for ${devWeekKey}` : "Ugens emne",
          );
          setRounds([]);
          return;
        }

        setWeekKey(res.weekKey);
        setTopicTitle(res.pack.topicTitle || "Ugens emne");
        setRounds(res.pack.rounds || []);
      } catch (e) {
        console.error("Failed to load weekly Match pack", e);
        if (!cancelled) setRounds([]);
      } finally {
        if (!cancelled) setPackLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [devWeekKey]);

  // reset local force lock when week changes
  useEffect(() => {
    setForceLocked(false);
  }, [effectiveWeekKey]);

  // Timer per round
  useEffect(() => {
    if (!timerRunning) return;
    if (!started || finished) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, started, finished]);

  const currentRoundData = rounds[round - 1] ?? null;
  const currentTopic = currentRoundData?.topic ?? "Ugens emne";
  const currentPairs = currentRoundData?.pairs ?? [];
  const totalPairs = currentPairs.length;

  const weeklyTopicsBullets = useMemo(() => {
    if (rounds.length === 0) return "- (Ingen emner endnu)";
    return rounds.map((r) => `- ${r.topic}`).join("\n");
  }, [rounds]);

  const hardResetUi = () => {
    setTimerRunning(false);
    setStarted(false);
    setFinished(false);
    setShowResults(false);

    setRound(1);
    setTimerSeconds(0);

    setLeftItems([]);
    setRightItems([]);

    setSelectedLeftId(null);
    setSelectedRightId(null);
    setMatches({});
    setMatchColorMap({});

    setLastRoundScore(0);
    setTotalScore(0);
    setCorrectCount(0);
    setWrongCount(0);
  };

  const lockAndExit = async () => {
    setForceLocked(true);
    setWeeklyMatchLocked(true);

    if (!lock.ignoreLocks) {
      try {
        await lock.lock();
      } catch (err) {
        console.error("Failed to lock match game on exit", err);
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
    const rd = rounds[roundNumber - 1];
    const pairs = rd?.pairs ?? [];

    if (!rd || pairs.length === 0) {
      Alert.alert("Ingen indhold", `Runde ${roundNumber} har ingen par endnu.`);
      return;
    }

    if (resetSession) setTotalScore(0);

    setRound(roundNumber);

    setLeftItems(shuffle(pairs));
    setRightItems(shuffle(pairs));

    setStarted(true);
    setFinished(false);

    setMatches({});
    setMatchColorMap({});
    setSelectedLeftId(null);
    setSelectedRightId(null);

    setCorrectCount(0);
    setWrongCount(0);
    setLastRoundScore(0);

    setTimerSeconds(0);
    setTimerRunning(true);
    setShowResults(false);
  };

  const handleStart = () => {
    if (!packLoaded) {
      Alert.alert("Indlæser", "Henter ugens Match pack...");
      return;
    }
    if (isLocked) {
      Alert.alert(
        "Spillet er låst",
        "Du har allerede spillet denne uges Match Game.",
      );
      return;
    }
    if (!rounds || rounds.length === 0) {
      Alert.alert(
        "Ingen indhold",
        devWeekKey
          ? `Ingen Match-runder for ${devWeekKey}.`
          : "Ingen Match-runder til denne uge endnu.",
      );
      return;
    }

    startRound(1, true);
  };

  const handleSelectLeft = (leftId: string) => {
    setSelectedLeftId((prev) => (prev === leftId ? null : leftId));
  };

  const handleSelectRight = (rightId: string) => {
    if (!selectedLeftId) {
      const existingLeftId = Object.entries(matches).find(
        ([, r]) => r === rightId,
      )?.[0];

      if (existingLeftId) {
        setMatches((prev) => {
          const next = { ...prev };
          delete next[existingLeftId];
          return next;
        });

        setMatchColorMap((prev) => {
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

      if (currentRightForLeft === rightId) {
        const next = { ...prev };
        delete next[leftId];
        return next;
      }

      const next: Record<string, string> = { ...prev };

      const otherLeftId = Object.entries(next).find(
        ([, r]) => r === rightId,
      )?.[0];

      if (otherLeftId && otherLeftId !== leftId) {
        delete next[otherLeftId];
      }

      next[leftId] = rightId;
      return next;
    });

    setMatchColorMap((prev) => {
      const next = { ...prev };

      const currentRightForLeft = matches[leftId];
      if (currentRightForLeft === rightId) {
        delete next[leftId];
        return next;
      }

      const otherLeftId = Object.entries(matches).find(
        ([, r]) => r === rightId,
      )?.[0];
      if (otherLeftId && otherLeftId !== leftId) {
        delete next[otherLeftId];
      }

      if (next[leftId] == null) {
        const used = new Set(Object.values(next));
        const availableIndex = MATCH_COLORS.findIndex(
          (_, idx) => !used.has(idx),
        );
        next[leftId] = availableIndex >= 0 ? availableIndex : 0;
      }

      return next;
    });

    setSelectedLeftId(null);
    setSelectedRightId(null);
  };

  const finishRun = async (finalScore: number) => {
    setForceLocked(true);
    setWeeklyMatchLocked(true);

    if (!lock.ignoreLocks) {
      try {
        await lock.lock();
      } catch (err) {
        console.error("Failed to lock match game on finish", err);
      }
    }

    try {
      const uid = await ensureAuthUid();
      await saveWeeklyResult({
        uid,
        nickname: profileNickname ?? "Ukendt",
        weekKey: effectiveWeekKey,
        matchScore: finalScore,
      });
    } catch (err) {
      console.error("Failed to save Match weekly result", err);
    }
  };

  const handleSubmit = async () => {
    const pairs = currentPairs;
    const total = pairs.length;
    if (total === 0) return;

    let correct = 0;
    pairs.forEach((pair) => {
      const matchedRightId = matches[pair.id];
      if (matchedRightId === pair.id) correct += 1;
    });

    const wrong = total - correct;

    const baseScore = correct * 1000;
    const penalty = timerSeconds * 50;
    const finalScore = Math.max(0, baseScore - penalty);

    setCorrectCount(correct);
    setWrongCount(wrong);
    setLastRoundScore(finalScore);
    setTotalScore((prev) => prev + finalScore);

    setTimerRunning(false);
    setFinished(true);
    setShowResults(true);

    if (round >= maxRounds) {
      const finalTotal = totalScore + finalScore;
      await finishRun(finalTotal);
    }
  };

  const handleNextRound = () => {
    if (round >= maxRounds) return;
    startRound(round + 1, false);
  };

  const handleCloseResults = () => {
    setShowResults(false);

    if (round >= maxRounds) {
      hardResetUi();
      onBack();
      return;
    }
  };

  const rightItemsToShow =
    rightItems.length > 0 ? rightItems : shuffle(currentPairs);
  const leftItemsToShow = leftItems.length > 0 ? leftItems : currentPairs;

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
              Henter Match pack...
            </Text>
          </View>
        )}

        {packLoaded && !started && !finished && (
          <View style={styles.weeklyGameCenter}>
            <Text style={styles.weeklyGameTitle}>Match Game</Text>

            <Text
              style={[
                styles.weeklyPlaceholderText,
                { textAlign: "left", alignSelf: "flex-start", marginTop: 16 },
              ]}
            >
              Match elementer korrekt – fx præparat og virkning, organ og
              hormon, eller suffiks og lægemiddeltype.
            </Text>

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
                • Tryk først venstre, derefter højre for at lave et match{"\n"}•
                Farver viser hvilke to felter der hører sammen{"\n"}• Tryk
                “Aflever” når du er færdig{"\n\n"}Point:{"\n"}• 1000 point pr.
                korrekt match{"\n"}• −50 point pr. sekund (per runde)
                {"\n\n"}Du kan kun spille dette spil én gang pr. uge.
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

        {started && (
          <>
            <View style={styles.weeklyTimerBar}>
              <Text style={styles.weeklyTimerText}>
                Tid brugt: {timeLabel} · Runde {round} / {maxRounds}
              </Text>
            </View>

            <View style={[styles.weeklyGameCenter, { alignItems: "stretch" }]}>
              <Text style={styles.weeklyGameTitle}>Match Game</Text>

              <Text style={[styles.subjectStatsSub, { textAlign: "center" }]}>
                Emne: {topicTitle}
              </Text>

              <Text style={[styles.statsLabel, { marginTop: 8 }]}>
                Runde {round}: {currentTopic}
              </Text>

              <Text style={styles.statsLabel}>
                Match alle {totalPairs} par og tryk derefter på "Aflever".
              </Text>

              <View style={{ width: "100%", maxWidth: 800, marginTop: 16 }}>
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

                {leftItemsToShow.map((leftPair, idx) => {
                  const rightPair = rightItemsToShow[idx];

                  const isSelectedLeft = selectedLeftId === leftPair.id;
                  const matchedRightId = matches[leftPair.id];
                  const isMatchedLeft = matchedRightId != null;
                  const leftColorIndex =
                    matchColorMap[leftPair.id] != null
                      ? matchColorMap[leftPair.id]
                      : null;

                  let leftBackgroundColor = "#343a40";
                  if (isSelectedLeft) {
                    leftBackgroundColor = "#74c0fc";
                  } else if (isMatchedLeft && leftColorIndex != null) {
                    leftBackgroundColor =
                      MATCH_COLORS[leftColorIndex % MATCH_COLORS.length];
                  }

                  let rightBackgroundColor = "#343a40";
                  if (rightPair) {
                    const matchedLeftEntry = Object.entries(matches).find(
                      ([, r]) => r === rightPair.id,
                    );
                    const matchedLeftId = matchedLeftEntry?.[0];
                    const isSelectedRight = selectedRightId === rightPair.id;

                    if (matchedLeftId && matchColorMap[matchedLeftId] != null) {
                      rightBackgroundColor =
                        MATCH_COLORS[
                          matchColorMap[matchedLeftId] % MATCH_COLORS.length
                        ];
                    } else if (isSelectedRight) {
                      rightBackgroundColor = "#ffd43b";
                    }
                  }

                  return (
                    <View
                      key={leftPair.id}
                      style={{ flexDirection: "row", gap: 12, marginTop: 6 }}
                    >
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
                          <Text
                            style={[
                              styles.bigButtonText,
                              { fontSize: buttonFont * 0.9 },
                            ]}
                          >
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
                    alignSelf: "stretch",
                  },
                ]}
                onPress={() => void handleSubmit()}
              >
                <Text style={styles.bigButtonText}>Aflever</Text>
              </Pressable>
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
                Resultat – Match Game
              </Text>

              <Text style={[styles.statsLabel, { marginTop: 8 }]}>
                Runde {round} af {maxRounds}
              </Text>

              <Text style={[styles.statsLabel, { marginTop: 12 }]}>
                Point denne runde:{" "}
                <Text style={styles.statsAccuracy}>{lastRoundScore}</Text>
              </Text>

              <Text style={styles.statsLabel}>
                Korrekte matches: {correctCount} / {totalPairs}
              </Text>

              <Text style={styles.statsLabel}>
                Forkerte / manglende: {wrongCount}
              </Text>

              <Text style={styles.statsLabel}>
                Tidsforbrug: {timeLabel} (−50 point pr. sekund)
              </Text>

              <Text style={[styles.statsLabel, { marginTop: 8 }]}>
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

export default WeeklyMatchScreen;
