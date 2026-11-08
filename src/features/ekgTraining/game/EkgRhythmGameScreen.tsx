import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { ColorTokens, Spacing, Typography } from "../../../../constants/theme";
import { Screen, ToolPageHeader } from "../../../ui/primitives";
import { EkgLiveMonitor } from "./EkgLiveMonitor";
import { RHYTHMS, getRhythm, type RhythmId } from "./rhythmModel";

type Props = { onBack: () => void };
type Mode = "rounds" | "timed";
type Phase = "intro" | "playing" | "summary";
type Difficulty = "behandler" | "paramediciner";
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

function pickOptions(correct: RhythmId, pool: readonly RhythmId[]): RhythmId[] {
  const group = getRhythm(correct).group;
  const others = pool.filter((id) => id !== correct);
  const related = shuffle(others.filter((id) => getRhythm(id).group === group));
  const rest = shuffle(others.filter((id) => getRhythm(id).group !== group));
  return shuffle([correct, ...[...related, ...rest].slice(0, 3)]);
}

function ModeButton({ title, subtitle, primary, onPress }: {
  title: string; subtitle: string; primary?: boolean; onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.modeButton, primary ? styles.modePrimary : styles.modeSecondary, pressed && styles.pressed]}
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
  const compact = width < 620;
  const [phase, setPhase] = useState<Phase>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("behandler");
  const [mode, setMode] = useState<Mode>("rounds");
  const [rhythmId, setRhythmId] = useState<RhythmId>("sinus");
  const [seed, setSeed] = useState(1);
  const [round, setRound] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState<RhythmId | null>(null);
  const [options, setOptions] = useState<RhythmId[]>(["sinus", "af", "sinus_tachy", "sinus_brady"]);
  const [paused, setPaused] = useState(false);
  const [remaining, setRemaining] = useState(DURATION);
  const queue = useRef<RhythmId[]>([]);
  const deadline = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "playing" || mode !== "timed") return;
    const interval = setInterval(() => {
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

  const start = (gameMode: Mode) => {
    const pool = ALL_RHYTHM_IDS;
    queue.current = shuffle(pool);
    const nextId = nextFromQueue(pool);
    deadline.current = gameMode === "timed" ? Date.now() + DURATION * 1000 : null;
    setMode(gameMode);
    setRound(1);
    setCorrect(0);
    setAnswered(0);
    setStreak(0);
    setBestStreak(0);
    setRemaining(DURATION);
    setSelected(null);
    setPaused(false);
    setRhythmId(nextId);
    setOptions(difficulty === "behandler" ? pickOptions(nextId, pool) : pool);
    setSeed((value) => value + 1);
    setPhase("playing");
  };

  const answer = (choice: RhythmId) => {
    if (phase !== "playing" || selected !== null || (mode === "timed" && remaining === 0)) return;
    setSelected(choice);
    setAnswered((n) => n + 1);
    if (choice === rhythmId) {
      setCorrect((n) => n + 1);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
    } else setStreak(0);
  };

  const next = () => {
    if (phase !== "playing" || selected === null) return;
    if (mode === "rounds" && round >= ROUND_LIMIT) { setPhase("summary"); return; }
    const nextId = nextFromQueue(active);
    setRhythmId(nextId);
    setOptions(difficulty === "behandler" ? pickOptions(nextId, active) : active);
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
          difficulty === "paramediciner" && !compact && styles.answerMany,
          compact && styles.answerCompact,
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
          <View style={styles.heroRow}>
            <View style={styles.heroText}>
              <Text style={styles.overline}>EKG · RYTMEGENKENDELSE</Text>
              <Text style={styles.heroTitle}>Klar til start?</Text>
              <Text style={styles.helper}>Se rytmen. Vælg svaret. Byg din stime.</Text>
            </View>
            <View style={styles.countPill}><Text style={styles.countText}>{active.length} rytmer</Text></View>
          </View>
          <EkgLiveMonitor rhythmId="sinus" seed={10} paused={false} />
          <Text style={styles.selectorLabel}>Vælg sværhedsgrad</Text>
          <View style={styles.levelBar}>
            {(["behandler", "paramediciner"] as const).map((value) => (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityLabel={`${value === "behandler" ? "Behandler" : "Paramediciner"}, ${value === "behandler" ? "4" : RHYTHMS.length} svarmuligheder`}
                accessibilityState={{ selected: difficulty === value }}
                onPress={() => setDifficulty(value)}
                style={[styles.levelButton, difficulty === value && styles.levelSelected]}
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
          <View style={styles.modeStack}>
            <ModeButton title="Spil 10 rytmer" subtitle="Uden tidspres" primary onPress={() => start("rounds")} />
            <ModeButton title="60 sekunders udfordring" subtitle="Flest rigtige før tiden løber ud" onPress={() => start("timed")} />
          </View>
          <Text style={styles.disclaimer}>Kurverne er skematiske og ikke klinisk validerede.</Text>
        </View>
      ) : null}

      {phase === "playing" ? (
        <View style={styles.gameWrap}>
          <View style={styles.scoreBar}>
            <Text style={styles.scorePrimary}>{difficulty === "behandler" ? "Behandler" : "Paramediciner"} · {mode === "rounds" ? `Rytme ${round} / ${ROUND_LIMIT}` : `${remaining} sek. tilbage`}</Text>
            <Text style={styles.scoreSecondary}>{correct} rigtige  ·  Stime {streak}</Text>
          </View>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, progress * 100))}%` as `${number}%` }]} /></View>
          <EkgLiveMonitor rhythmId={rhythmId} seed={seed} paused={paused} />
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
                contentContainerStyle={[styles.answerGrid, compact && styles.answerGridCompact]}
              >
                {answerButtons}
              </ScrollView>
            </>
          ) : (
            <View style={[styles.answerGrid, compact && styles.answerGridCompact]}>
              {answerButtons}
            </View>
          )}
          {selected !== null ? (
            <View style={styles.feedback} accessibilityLiveRegion="polite">
              <Text style={[styles.feedbackHeading, { color: selected === rhythmId ? "#67efd4" : "#ffb0a0" }]}>
                {selected === rhythmId ? "Korrekt!" : `Rigtigt svar: ${correctRhythm.label}`}
              </Text>
              <Text style={styles.clue}>{correctRhythm.clue}</Text>
              <Pressable accessibilityRole="button" onPress={next} style={styles.nextButton}>
                <Text style={styles.nextText}>{mode === "rounds" && round >= ROUND_LIMIT ? "Se resultat" : "Næste rytme"}</Text>
              </Pressable>
            </View>
          ) : null}
          <Text style={styles.disclaimer}>Simuleret EKG og hypotetisk pulskurve. Puls og perfusion kræver klinisk vurdering.</Text>
        </View>
      ) : null}

      {phase === "summary" ? (
        <View style={styles.summary}>
          <Text style={styles.overline}>RUNDE AFSLUTTET</Text>
          <Text style={styles.heroTitle}>Resultat</Text>
          <Text style={styles.bigScore}>{correct} <Text style={styles.bigScoreUnit}>/ {answered}</Text></Text>
          <Text style={styles.helper}>{difficulty === "behandler" ? "Behandler" : "Paramediciner"} · {scorePercent}% korrekte · Bedste stime {bestStreak}</Text>
          <View style={styles.modeStack}>
            <ModeButton title="Spil igen" subtitle={mode === "rounds" ? "Ny runde med 10 rytmer" : "Ny runde på 60 sekunder"} primary onPress={() => start(mode)} />
            <ModeButton title="Skift niveau eller spiltype" subtitle="Tilbage til start" onPress={() => setPhase("intro")} />
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const font = Typography.families.sans;
const styles = StyleSheet.create({
  page: { paddingBottom: Spacing.xl, gap: 12 },
  startWrap: { width: "100%", gap: 13 },
  gameWrap: { width: "100%", gap: 12 },
  heroRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  heroText: { flex: 1, minWidth: 0, gap: 3 },
  overline: { fontFamily: font, fontWeight: "800", color: "#67efd4", fontSize: 11, letterSpacing: 1.0 },
  heroTitle: { fontFamily: font, color: "#f8f9fa", fontSize: 29, fontWeight: "800" },
  helper: { fontFamily: font, fontSize: 14, color: "#dae7e9", lineHeight: 20 },
  countPill: { backgroundColor: "rgba(8,39,48,0.75)", paddingHorizontal: 12, paddingVertical: 9, borderRadius: 100, borderWidth: 1, borderColor: ColorTokens.border.default },
  countText: { fontFamily: font, color: "#67efd4", fontSize: 12, fontWeight: "700" },
  selectorLabel: { fontFamily: font, fontWeight: "700", color: "#d7e8e9", fontSize: 14, marginTop: 3 },
  levelBar: { flexDirection: "row", gap: 10 },
  levelButton: { flex: 1, minWidth: 0, minHeight: 64, alignItems: "center", justifyContent: "center", gap: 3, paddingHorizontal: 5, borderWidth: 1, borderColor: ColorTokens.border.default, borderRadius: 12, backgroundColor: "rgba(5,31,39,0.45)" },
  levelSelected: { borderColor: "#67efd4", backgroundColor: "rgba(35,147,151,0.25)" },
  levelText: { fontFamily: font, color: "#d0e2e4", fontSize: 15, fontWeight: "700" },
  levelSelectedText: { color: "#f7ffff" },
  levelHint: { fontFamily: font, color: "#b9d8da", fontSize: 11, textAlign: "center" },
  modeStack: { gap: 10, marginTop: 3 },
  modeButton: { minHeight: 68, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, borderWidth: 1 },
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
  answer: { flexGrow: 1, flexBasis: "47%", minWidth: 0, minHeight: 55, justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.29)", backgroundColor: "rgba(4,29,37,0.69)", paddingHorizontal: 14, paddingVertical: 12 },
  answerMany: { flexBasis: "30%" },
  answerCompact: { flexGrow: 0, flexBasis: "auto", width: "100%" },
  answerCorrect: { backgroundColor: "rgba(41,169,119,0.30)", borderColor: "#67efd4" },
  answerWrong: { backgroundColor: "rgba(184,58,55,0.3)", borderColor: "#ff9c90" },
  answerText: { fontFamily: font, fontSize: 15, fontWeight: "700", color: "#fff" },
  feedback: { padding: 14, gap: 9, borderRadius: 13, borderWidth: 1, borderColor: ColorTokens.border.default, backgroundColor: "rgba(0,0,0,0.19)" },
  feedbackHeading: { fontFamily: font, fontSize: 17, fontWeight: "800" },
  clue: { fontFamily: font, fontSize: 14, lineHeight: 20, color: "#e7f1f3" },
  nextButton: { backgroundColor: "#1099a9", minHeight: 48, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  nextText: { fontFamily: font, color: "#fff", fontSize: 15, fontWeight: "800" },
  summary: { borderRadius: 16, borderWidth: 1, borderColor: ColorTokens.border.default, backgroundColor: ColorTokens.surface.tool, padding: 18, gap: 11 },
  bigScore: { fontFamily: font, fontWeight: "800", color: "#67efd4", fontSize: 46 },
  bigScoreUnit: { fontFamily: font, color: "#dcebec", fontSize: 24 },
});
