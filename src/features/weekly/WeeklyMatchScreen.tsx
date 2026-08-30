// src/features/weekly/WeeklyMatchScreen.tsx

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

  profileNickname?: string | null;
  onAttemptLocked: () => void;
  onBack: () => void;

  devWeekKey?: string | null;
};

export function WeeklyMatchScreen({
  headingFont,
  buttonFont,
  profileNickname,
  onAttemptLocked,
  onBack,
  devWeekKey = null,
}: WeeklyMatchScreenProps) {
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
  const [rounds, setRounds] = useState<WeeklyMatchRound[]>([]);

  const maxRounds = rounds.length > 0 ? rounds.length : 1;

  const effectiveWeekKey =
    resolution?.canonicalWeekKey ?? devWeekKey ?? weekKey ?? null;

  // ---- Week lock ----
  const lockKey = effectiveWeekKey
    ? getWeeklyLockKey("match", effectiveWeekKey)
    : "weekly_lock_match_unknown";
  const lock = useWeeklyLock(lockKey);

  // local immediate lock so UI locks instantly on quit/finish
  const [forceLocked, setForceLocked] = useState(false);

  const isLocked = (lock.locked || forceLocked) && !lock.ignoreLocks;

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
      setLoadStatus("loading");
      setLoadMessage("");

      try {
        const res = devWeekKey
          ? await loadMatchPackByWeekKey(devWeekKey)
          : await loadThisWeeksMatchPack();

        if (cancelled) return;

        if (!res) {
          setWeekKey(devWeekKey ?? null);
          setTopicTitle(
            devWeekKey ? `Ingen matchindhold for ${devWeekKey}` : "Ugens emne",
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
        console.error("Failed to load weekly Match pack", e);
        if (!cancelled) {
          setRounds([]);
          setLoadStatus(
            e instanceof WeeklyPackValidationError ? "invalid" : "error",
          );
          setLoadMessage(
            e instanceof Error ? e.message : "Ugens matchopgave kunne ikke hentes.",
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
    if (!lock.ignoreLocks) {
      try {
        await lock.lock();
        onAttemptLocked();
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
    const rd = rounds[roundNumber - 1];
    const pairs = rd?.pairs ?? [];

    if (!rd || pairs.length === 0) {
      Alert.alert("Intet indhold", `Runde ${roundNumber} har ingen par endnu.`);
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

  const handleStart = async () => {
    if (!lock.loaded) {
      Alert.alert("Indlæser", "Tjekker spilstatus...");
      return;
    }
    if (!packLoaded) {
      Alert.alert("Indlæser", "Henter ugens matchopgave…");
      return;
    }
    if (isLocked) {
      Alert.alert(
        "Spillet er låst",
        "Du har allerede spillet denne uges matchopgave.",
      );
      return;
    }
    if (!rounds || rounds.length === 0) {
      Alert.alert(
        "Intet indhold",
        devWeekKey
          ? `Ingen Match-runder for ${devWeekKey}.`
          : "Ingen Match-runder til denne uge endnu.",
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
        console.error("Failed to lock Match attempt on start", err);
        Alert.alert("Kunne ikke starte", "Forsøget kunne ikke gemmes sikkert. Prøv igen.");
        return;
      }
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
    if (!lock.ignoreLocks) {
      try {
        await lock.lock();
        onAttemptLocked();
      } catch (err) {
        console.error("Failed to lock match game on finish", err);
      }
    }

    try {
      const uid = await ensureAuthUid();
      const activeResolution =
        resolution ??
        createDirectWeeklyBundle(effectiveWeekKey ?? "unknown", "match");
      const upload = await submitWeeklyResultReliably({
        uid,
        nickname: profileNickname ?? "Ukendt",
        resolution: activeResolution,
        game: "match",
        score: finalScore,
      });
      setUploadPending(upload.status === "pending");
    } catch (err) {
      console.error("Failed to save Match weekly result", err);
      setUploadPending(true);
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
    <WeeklyGameFrame
      onBack={handleBack}
      subtitle="Forbind begreber og forklaringer"
      title="Match parrene"
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
          <LoadingState title="Henter ugens matchopgave" />
        ) : null}

        {loadStatus === "missing" ? (
          <EmptyState
            message="Der er endnu ikke udgivet Match-indhold til den valgte uge."
            title="Ingen Match-runder denne uge"
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
                : "Ugens matchopgave kunne ikke hentes"
            }
          />
        ) : null}

        {packLoaded && loadStatus === "ready" && !started && !finished ? (
          <WeeklyGameIntro
            description="Find de par, der hører sammen – fx præparat og virkning, organ og hormon, eller suffiks og lægemiddeltype."
            eyebrow="UGENS UDFORDRING"
            locked={isLocked}
            onStart={handleStart}
            rules={[
              "Tryk først venstre og derefter højre for at danne et par",
              "Samme nummer viser hvilke to felter der er forbundet",
              "Tryk Aflever, når alle par er valgt",
              "Hvert korrekt par giver 1000 point",
              "Der trækkes 50 point pr. sekund i hver runde",
              "Spillet kan kun gennemføres én gang pr. uge",
            ]}
            title="Match parrene"
            topic={weeklyTopicsBullets}
            topicLabel={
              devWeekKey ? `FORHÅNDSVISNING · ${devWeekKey}` : "UGENS EMNER"
            }
          />
        ) : null}

        {started ? (
          <>
            <WeeklyGameStatus
              current={round}
              label="RUNDE"
              total={maxRounds}
              value={`Tid brugt: ${timeLabel}`}
            />
            <View style={styles.gameStack}>
              <Surface elevated tone="elevated" style={styles.questionCard}>
                <Text style={styles.eyebrow}>{topicTitle}</Text>
                <Text style={styles.title}>{currentTopic}</Text>
                <Text style={styles.body}>
                  Find alle {totalPairs} par, og tryk derefter på Aflever.
                </Text>
              </Surface>
              <View style={styles.matchHeader}>
                <Text style={styles.matchHeaderText}>VENSTRE</Text>
                <Text style={styles.matchHeaderText}>HØJRE</Text>
              </View>
              <View style={styles.choiceList}>
                {leftItemsToShow.map((leftPair, idx) => {
                  const rightPair = rightItemsToShow[idx];
                  const matchedRightId = matches[leftPair.id];
                  const leftColorIndex = matchColorMap[leftPair.id];
                  const leftSelected = selectedLeftId === leftPair.id;
                  const matchedLeftEntry = rightPair
                    ? Object.entries(matches).find(([, id]) => id === rightPair.id)
                    : undefined;
                  const matchedLeftId = matchedLeftEntry?.[0];
                  const rightColorIndex = matchedLeftId
                    ? matchColorMap[matchedLeftId]
                    : undefined;
                  const rightSelected = rightPair
                    ? selectedRightId === rightPair.id
                    : false;

                  return (
                    <View key={leftPair.id} style={styles.matchRow}>
                      <SelectableChoice
                        indicator={
                          leftColorIndex != null
                            ? String(leftColorIndex + 1)
                            : leftSelected
                              ? "•"
                              : undefined
                        }
                        label={leftPair.left}
                        onPress={() => handleSelectLeft(leftPair.id)}
                        state={
                          matchedRightId != null || leftSelected
                            ? "selected"
                            : "default"
                        }
                        style={styles.matchChoice}
                      />
                      {rightPair ? (
                        <SelectableChoice
                          indicator={
                            rightColorIndex != null
                              ? String(rightColorIndex + 1)
                              : rightSelected
                                ? "•"
                                : undefined
                          }
                          label={rightPair.right}
                          onPress={() => handleSelectRight(rightPair.id)}
                          state={
                            matchedLeftId || rightSelected
                              ? "selected"
                              : "default"
                          }
                          style={styles.matchChoice}
                        />
                      ) : (
                        <View style={styles.matchChoice} />
                      )}
                    </View>
                  );
                })}
              </View>
              <PrimaryButton
                label="Aflever"
                onPress={() => void handleSubmit()}
              />
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
            { label: "Korrekte par", value: `${correctCount} / ${totalPairs}` },
            { label: "Forkerte / manglende", value: String(wrongCount) },
            {
              label: "Tidsforbrug",
              value: `${timeLabel} (−50 point pr. sekund)`,
            },
            { label: "Samlede point", value: String(totalScore) },
          ]}
          title="Resultat · Match parrene"
          value={`${lastRoundScore} point`}
          visible={showResults}
        />
    </WeeklyGameFrame>
  );
}

export default WeeklyMatchScreen;
