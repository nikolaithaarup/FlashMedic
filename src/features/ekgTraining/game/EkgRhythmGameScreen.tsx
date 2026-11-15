import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  findNodeHandle,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
  useWindowDimensions,
} from "react-native";

import { ColorTokens, Spacing, Typography } from "../../../../constants/theme";
import { Screen, ToolPageHeader } from "../../../ui/primitives";
import { EkgLiveMonitor } from "./EkgLiveMonitor";
import { createAnswerOptions, type RhythmGameDifficulty } from "./ekgRhythmGameLogic";
import { RHYTHMS, getRhythm, type RhythmId } from "./rhythmModel";

type Props = { onBack: () => void };
type Mode = "rounds" | "timed";
type Phase = "intro" | "playing" | "summary";
type Difficulty = RhythmGameDifficulty;
const ALL_RHYTHM_IDS = RHYTHMS.map((rhythm) => rhythm.id);
const ROUND_LIMIT = 10;
const DURATION = 60;

function shuffle<T>(source: readonly T[]): T[] {
  const items = [...source];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function ModeButton({ title, subtitle, equal, primary, onPress, testID }: {
  title: string; subtitle: string; equal?: boolean; primary?: boolean; onPress: () => void; testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [styles.modeButton, equal && styles.modeButtonEqual, primary ? styles.modePrimary : styles.modeSecondary, pressed && styles.pressed]}
    >
      <View style={styles.modeText}>
        <Text style={styles.modeTitle}>{title}</Text>
        <Text style={styles.modeSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.modeArrow} accessibilityElementsHidden>›</Text>
    </Pressable>
  );
}

export function EkgRhythmGameScreen({ onBack }: Props) {
  const { width } = useWindowDimensions();
  const narrow = width < 350;
  const compactSetup = width < 350;
  const wideAnswers = width >= 760;
  const [phase, setPhase] = useState<Phase>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [mode, setMode] = useState<Mode>("rounds");
  const [setupMode, setSetupMode] = useState<Mode | null>(null);
  const [setupVisible, setSetupVisible] = useState(false);
  const [rhythmId, setRhythmId] = useState<RhythmId>("sinus");
  const [seed, setSeed] = useState(1);
  const [round, setRound] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [selected, setSelected] = useState<RhythmId | null>(null);
  const [options, setOptions] = useState<RhythmId[]>(["sinus", "af", "sinus_tachy", "sinus_brady"]);
  const [paused, setPaused] = useState(false);
  const [remaining, setRemaining] = useState(DURATION);
  const queue = useRef<RhythmId[]>([]);
  const deadline = useRef<number | null>(null);
  const feedbackOpenedAt = useRef<number | null>(null);
  const setupHeading = useRef<View>(null);

  useEffect(() => {
    if (!setupVisible) return;
    const timeout = setTimeout(() => {
      const node = findNodeHandle(setupHeading.current);
      if (node) AccessibilityInfo.setAccessibilityFocus(node);
    }, 100);
    return () => clearTimeout(timeout);
  }, [setupVisible]);

  useEffect(() => {
    if (phase !== "playing" || mode !== "timed") return;
    const interval = setInterval(() => {
      if (feedbackOpenedAt.current !== null) return;
      const left = Math.max(0, Math.ceil(((deadline.current ?? 0) - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) setPhase("summary");
    }, 250);
    return () => clearInterval(interval);
  }, [phase, mode]);

  // Both difficulties draw from the same complete rhythm library.
  // Only the number of visible answers changes.
  const active = ALL_RHYTHM_IDS;
  const nextFromQueue = (pool: readonly RhythmId[]) => {
    if (!queue.current.length) queue.current = shuffle(pool);
    return queue.current.shift()!;
  };

  const start = (gameMode: Mode, gameDifficulty: Difficulty) => {
    const pool = ALL_RHYTHM_IDS;
    queue.current = shuffle(pool);
    const nextId = nextFromQueue(pool);
    deadline.current = gameMode === "timed" ? Date.now() + DURATION * 1000 : null;
    feedbackOpenedAt.current = null;
    setMode(gameMode);
    setDifficulty(gameDifficulty);
    setRound(1);
    setCorrect(0);
    setAnswered(0);
    setRemaining(DURATION);
    setSelected(null);
    setPaused(false);
    setRhythmId(nextId);
    setOptions(createAnswerOptions(nextId, gameDifficulty, pool));
    setSeed((value) => value + 1);
    setPhase("playing");
  };

  const chooseMode = (gameMode: Mode) => {
    setSetupMode(gameMode);
    setDifficulty(null);
    setSetupVisible(true);
  };

  const closeSetup = () => setSetupVisible(false);

  const startSelectedGame = () => {
    if (!setupMode || !difficulty) return;
    setSetupVisible(false);
    start(setupMode, difficulty);
  };

  const answer = (choice: RhythmId) => {
    if (phase !== "playing" || selected !== null || (mode === "timed" && remaining === 0)) return;
    if (mode === "timed") feedbackOpenedAt.current = Date.now();
    setSelected(choice);
    setAnswered((n) => n + 1);
    if (choice === rhythmId) {
      setCorrect((n) => n + 1);
    }
  };

  const next = () => {
    if (phase !== "playing" || selected === null) return;
    if (feedbackOpenedAt.current !== null) {
      deadline.current = (deadline.current ?? Date.now()) + Date.now() - feedbackOpenedAt.current;
      feedbackOpenedAt.current = null;
    }
    if (mode === "rounds" && round >= ROUND_LIMIT) { setPhase("summary"); return; }
    const nextId = nextFromQueue(active);
    setRhythmId(nextId);
    setOptions(createAnswerOptions(nextId, difficulty ?? "behandler", active));
    setSelected(null);
    setPaused(false);
    setRound((n) => n + 1);
    setSeed((n) => n + 1);
  };

  const answerButtons = options.map((id) => {
    const value = getRhythm(id);
    const right = selected !== null && id === rhythmId;
    const wrong = selected === id && id !== rhythmId;
    return (
      <Pressable
        key={id}
        accessibilityRole="button"
        accessibilityLabel={value.label}
        accessibilityState={{ disabled: selected !== null }}
        disabled={selected !== null}
        onPress={() => answer(id)}
        style={({ pressed }) => [
          styles.answer,
          difficulty === "paramediciner" && wideAnswers && styles.answerMany,
          narrow && styles.answerCompact,
          right && styles.answerCorrect,
          wrong && styles.answerWrong,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.answerText}>{value.label}</Text>
      </Pressable>
    );
  });

  const correctRhythm = getRhythm(rhythmId);
  const scorePercent = answered ? Math.round(100 * correct / answered) : 0;
  const progress = mode === "rounds" ? (round - (selected ? 0 : 1)) / ROUND_LIMIT : (DURATION - remaining) / DURATION;

  return (
    <Screen contentContainerStyle={styles.page} width="wide" testID="ekg-rhythm-game-screen">
      <StatusBar style="light" />
      <ToolPageHeader backLabel="Tilbage til EKG-træning" onBack={onBack} title="Rytmespil" />

      {phase === "intro" ? (
        <View style={styles.startWrap}>
          <View style={styles.heroText}>
            <Text style={styles.overline}>EKG · RYTMEGENKENDELSE</Text>
            <Text style={styles.heroTitle}>Klar til start?</Text>
          </View>
          <EkgLiveMonitor rhythmId="sinus" seed={10} paused={false} />
          <View style={[styles.modeGrid, compactSetup && styles.modeGridCompact]}>
            <ModeButton title="10 rytmer" subtitle="Uden tidspres" equal onPress={() => chooseMode("rounds")} testID="rhythm-mode-rounds" />
            <ModeButton title="60 sekunder" subtitle="Flest mulige rigtige" equal onPress={() => chooseMode("timed")} testID="rhythm-mode-timed" />
          </View>
          <Text style={styles.disclaimer}>Kurverne er skematiske og ikke klinisk validerede.</Text>
        </View>
      ) : null}

      {phase === "playing" ? (
        <View style={styles.gameWrap}>
          <View style={styles.scoreBar}>
            <Text style={styles.scorePrimary}>{difficulty === "behandler" ? "Behandler" : "Paramediciner"} · {mode === "rounds" ? `Rytme ${round} / ${ROUND_LIMIT}` : `${remaining} sek. tilbage`}</Text>
            <Text style={styles.scoreSecondary}>{correct} / {answered} rigtige</Text>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, progress * 100))}%` as `${number}%` }]} /></View>
          <EkgLiveMonitor rhythmId={rhythmId} seed={seed} paused={paused || selected !== null} />
          <View style={styles.questionRow}>
            <Text style={styles.question}>Hvilken rytme ser du?</Text>
            {mode === "rounds" ? (
              <Pressable style={styles.pauseButton} onPress={() => setPaused((x) => !x)} accessibilityRole="button">
                <Text style={styles.pauseText}>{paused ? "Afspil" : "Pause"}</Text>
              </Pressable>
            ) : null}
          </View>
          {difficulty === "paramediciner" ? (
            <>
              <Text style={styles.optionHint}>Alle {RHYTHMS.length} svarmuligheder · Rul i listen</Text>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator
                style={styles.optionScroll}
                contentContainerStyle={[styles.answerGrid, narrow && styles.answerGridCompact]}
                testID="rhythm-answer-scroll"
              >
                {answerButtons}
              </ScrollView>
            </>
          ) : (
            <View style={[styles.answerGrid, narrow && styles.answerGridCompact]}>
              {answerButtons}
            </View>
          )}
        </View>
      ) : null}

      {phase === "summary" ? (
        <View style={styles.summary}>
          <Text style={styles.overline}>RUNDE AFSLUTTET</Text>
          <Text style={styles.heroTitle}>Resultat</Text>
          <Text style={styles.bigScore}>{correct} <Text style={styles.bigScoreUnit}>/ {answered}</Text></Text>
          <Text style={styles.helper}>{difficulty === "behandler" ? "Behandler" : "Paramediciner"} · {scorePercent}% korrekte</Text>
          <View style={styles.modeStack}>
            <ModeButton title="Spil igen" subtitle={mode === "rounds" ? "Ny runde med 10 rytmer" : "Ny runde på 60 sekunder"} primary onPress={() => start(mode, difficulty ?? "behandler")} />
            <ModeButton title="Skift niveau eller spiltype" subtitle="Tilbage til start" onPress={() => setPhase("intro")} />
          </View>
        </View>
      ) : null}
      <Modal
        visible={phase === "intro" && setupVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSetup}
      >
        <Pressable
          accessible={false}
          onPress={closeSetup}
          style={[styles.setupOverlay, setupBackdropBlur]}
          testID="difficulty-modal-backdrop"
        >
          <Pressable
            accessibilityViewIsModal
            onPress={(event) => event.stopPropagation()}
            style={styles.setupDialog}
            testID="difficulty-modal"
          >
            <View style={styles.setupHeader}>
              <View ref={setupHeading} accessible accessibilityRole="header" style={styles.setupTitleWrap}>
                <Text style={styles.setupTitle}>Vælg sværhedsgrad</Text>
                <Text style={styles.setupModeLabel}>{setupMode === "timed" ? "60 sekunder" : "10 rytmer"}</Text>
              </View>
              <Pressable
                accessibilityLabel="Luk"
                accessibilityRole="button"
                hitSlop={8}
                onPress={closeSetup}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>
            <View style={styles.levelBar}>
              {(["behandler", "paramediciner"] as const).map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityLabel={`${value === "behandler" ? "Behandler" : "Paramediciner"}, ${value === "behandler" ? "4" : RHYTHMS.length} svarmuligheder`}
                  accessibilityState={{ selected: difficulty === value }}
                  onPress={() => setDifficulty(value)}
                  style={[styles.levelButton, difficulty === value && styles.levelSelected]}
                  testID={`difficulty-${value}`}
                >
                  <Text style={[styles.levelText, difficulty === value && styles.levelSelectedText]}>
                    {value === "behandler" ? "Behandler" : "Paramediciner"}
                  </Text>
                  <Text style={styles.levelHint}>
                    {value === "behandler" ? "4 svarmuligheder" : `Alle ${RHYTHMS.length} rytmer`}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: difficulty === null }}
              disabled={difficulty === null}
              onPress={startSelectedGame}
              style={({ pressed }) => [styles.startButton, difficulty === null && styles.startButtonDisabled, pressed && styles.pressed]}
              testID="difficulty-start"
            >
              <Text style={[styles.startButtonText, difficulty === null && styles.startButtonTextDisabled]}>Start spil</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
      <Modal
        visible={phase === "playing" && selected !== null}
        transparent
        animationType="fade"
        onRequestClose={next}
      >
        <View style={styles.resultOverlay}>
          <View style={styles.resultDialog} accessibilityViewIsModal>
            <ScrollView bounces={false} contentContainerStyle={styles.resultBody}>
              <Text style={[styles.resultTitle, { color: selected === rhythmId ? "#67efd4" : "#ffb0a0" }]}>
                {selected === rhythmId ? "Korrekt!" : "Ikke helt"}
              </Text>
              <Text style={styles.resultRhythm}>
                {selected === rhythmId ? correctRhythm.label : `Rigtigt svar: ${correctRhythm.label}`}
              </Text>
              <Text style={styles.resultClue}>{correctRhythm.clue}</Text>
              <Text style={styles.resultScore}>{correct} / {answered} rigtige i alt</Text>
              <Pressable accessibilityRole="button" onPress={next} style={styles.nextButton}>
                <Text style={styles.nextText}>
                  {mode === "rounds" && round >= ROUND_LIMIT ? "Se resultat" : "Næste rytme"}
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const font = Typography.families.sans;
type WebBackdropStyle = ViewStyle & { backdropFilter?: string; WebkitBackdropFilter?: string };
const setupBackdropBlur = Platform.select<WebBackdropStyle>({
  web: { backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" },
  default: {},
});
const styles = StyleSheet.create({
  page: { paddingBottom: Spacing.xl, gap: 12 },
  startWrap: { width: "100%", gap: 13 },
  gameWrap: { width: "100%", gap: 12 },
  heroText: { flex: 1, minWidth: 0, gap: 3 },
  overline: { fontFamily: font, fontWeight: "800", color: "#67efd4", fontSize: 11, letterSpacing: 1.0 },
  heroTitle: { fontFamily: font, color: "#f8f9fa", fontSize: 29, fontWeight: "800" },
  helper: { fontFamily: font, fontSize: 14, color: "#dae7e9", lineHeight: 20 },
  modeGrid: { flexDirection: "row", alignItems: "stretch", gap: 10, width: "100%" },
  modeGridCompact: { flexDirection: "column" },
  levelBar: { flexDirection: "row", gap: 10 },
  levelButton: { flex: 1, minWidth: 0, minHeight: 64, alignItems: "center", justifyContent: "center", gap: 3, paddingHorizontal: 5, borderWidth: 1, borderColor: ColorTokens.border.default, borderRadius: 12, backgroundColor: "rgba(5,31,39,0.45)" },
  levelSelected: { borderColor: "#67efd4", backgroundColor: "rgba(35,147,151,0.25)" },
  levelText: { fontFamily: font, color: "#d0e2e4", fontSize: 15, fontWeight: "700" },
  levelSelectedText: { color: "#f7ffff" },
  levelHint: { fontFamily: font, color: "#b9d8da", fontSize: 11, textAlign: "center" },
  modeStack: { gap: 10, marginTop: 3 },
  modeButton: { minWidth: 0, minHeight: 68, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, borderWidth: 1 },
  modeButtonEqual: { flex: 1 },
  modePrimary: { backgroundColor: "#0f9cae", borderColor: "#6af3dd" },
  modeSecondary: { backgroundColor: "rgba(5,31,39,0.68)", borderColor: ColorTokens.border.strong },
  modeText: { flex: 1, minWidth: 0, gap: 2 },
  modeTitle: { fontFamily: font, color: "#fff", fontWeight: "800", fontSize: 16 },
  modeSubtitle: { fontFamily: font, color: "#e2f2f2", fontSize: 12 },
  modeArrow: { fontFamily: font, color: "#fff", fontSize: 28 },
  pressed: { opacity: 0.78 },
  disclaimer: { fontFamily: font, color: "#b9c9cd", fontSize: 11, lineHeight: 16 },
  scoreBar: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", gap: 8 },
  scorePrimary: { fontFamily: font, fontSize: 15, fontWeight: "800", color: "#eaf9f8" },
  scoreSecondary: { fontFamily: font, fontSize: 13, fontWeight: "700", color: "#67efd4" },
  progressTrack: { height: 5, borderRadius: 10, overflow: "hidden", backgroundColor: "rgba(164,222,225,0.18)" },
  progressFill: { height: "100%", backgroundColor: "#65dfd5" },
  questionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  question: { fontFamily: font, flex: 1, color: "#fff", fontSize: 19, fontWeight: "800" },
  pauseButton: { minHeight: 44, paddingHorizontal: 13, justifyContent: "center", borderWidth: 1, borderColor: ColorTokens.border.default, borderRadius: 10 },
  pauseText: { fontFamily: font, fontSize: 13, fontWeight: "700", color: "#fff" },
  answerGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, width: "100%" },
  answerGridCompact: { flexDirection: "column", alignItems: "stretch" },
  optionHint: { fontFamily: font, color: "#c2d6d8", fontSize: 12 },
  optionScroll: { width: "100%", maxHeight: 310 },
  answer: { flexGrow: 1, flexBasis: "47%", minWidth: 0, minHeight: 44, justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.29)", backgroundColor: "rgba(4,29,37,0.69)", paddingHorizontal: 12, paddingVertical: 9 },
  answerMany: { flexBasis: "30%" },
  answerCompact: { flexGrow: 0, flexBasis: "auto", width: "100%" },
  answerCorrect: { backgroundColor: "rgba(41,169,119,0.30)", borderColor: "#67efd4" },
  answerWrong: { backgroundColor: "rgba(184,58,55,0.3)", borderColor: "#ff9c90" },
  answerText: { fontFamily: font, fontSize: 14, lineHeight: 18, fontWeight: "700", color: "#fff" },
  setupOverlay: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "rgba(0, 13, 20, 0.76)" },
  setupDialog: { width: "100%", maxWidth: 520, gap: 18, padding: 20, borderRadius: 18, borderWidth: 1, borderColor: "rgba(119,225,214,0.52)", backgroundColor: "#092c35" },
  setupHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  setupTitleWrap: { flex: 1, minWidth: 0, gap: 3 },
  setupTitle: { fontFamily: font, color: "#fff", fontSize: 22, fontWeight: "800" },
  setupModeLabel: { fontFamily: font, color: "#9fc8ca", fontSize: 13, fontWeight: "600" },
  closeButton: { width: 44, height: 44, marginTop: -8, marginRight: -8, alignItems: "center", justifyContent: "center", borderRadius: 22 },
  closeText: { fontFamily: font, color: "#d7e8e9", fontSize: 30, lineHeight: 32 },
  startButton: { minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: 11, backgroundColor: "#1099a9" },
  startButtonDisabled: { backgroundColor: "rgba(159,200,202,0.15)" },
  startButtonText: { fontFamily: font, color: "#fff", fontSize: 15, fontWeight: "800" },
  startButtonTextDisabled: { color: "#86a2a5" },
  resultOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 13, 20, 0.80)", paddingHorizontal: 14, paddingVertical: 20 },
  resultDialog: { width: "100%", maxWidth: 460, maxHeight: "90%", overflow: "hidden", borderRadius: 18, borderWidth: 1, borderColor: "rgba(119,225,214,0.52)", backgroundColor: "#092c35" },
  resultBody: { padding: 20, gap: 12 },
  resultTitle: { fontFamily: font, fontSize: 30, fontWeight: "800" },
  resultRhythm: { fontFamily: font, fontSize: 18, fontWeight: "800", color: "#fff" },
  resultClue: { fontFamily: font, fontSize: 14, lineHeight: 21, color: "#dae7e9" },
  resultScore: { fontFamily: font, fontSize: 17, fontWeight: "800", color: "#67efd4", marginTop: 4 },
  nextButton: { backgroundColor: "#1099a9", minHeight: 48, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  nextText: { fontFamily: font, color: "#fff", fontSize: 15, fontWeight: "800" },
  summary: { borderRadius: 16, borderWidth: 1, borderColor: ColorTokens.border.default, backgroundColor: ColorTokens.surface.tool, padding: 18, gap: 11 },
  bigScore: { fontFamily: font, fontWeight: "800", color: "#67efd4", fontSize: 46 },
  bigScoreUnit: { fontFamily: font, color: "#dcebec", fontSize: 24 },
});
