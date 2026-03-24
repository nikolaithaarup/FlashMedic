// src/features/weekly/WeeklyDevScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { styles } from "../../ui/flashmedicStyles";
import { useWeeklyLock } from "./useWeeklyLock";

type WeeklyKind = "mcq" | "match" | "word";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function clampInt(value: string, fallback: number, min: number, max: number) {
  const n = parseInt(value || "", 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function weekKeyFrom(year: number, isoWeek: number) {
  return `${year}-W${pad2(isoWeek)}`;
}

function lockKeyFor(kind: WeeklyKind, weekKey: string) {
  return `weekly_lock_${kind}_${weekKey}`;
}

// keep only digits (helps on some Android keyboards)
function digitsOnly(s: string) {
  return s.replace(/[^\d]/g, "");
}

export default function WeeklyDevScreen({
  headingFont,
  buttonFont,
  onBack,
  onStartGame,
  onClearDevOverride,
}: {
  headingFont: number;
  buttonFont: number;
  onBack: () => void;

  // ✅ NEW: start the selected game (navigate + override)
  onStartGame: (args: {
    kind: WeeklyKind;
    weekKey: string;
    round?: number;
  }) => void;

  // ✅ NEW: let user clear override when done
  onClearDevOverride: () => void;
}) {
  // Numeric “committed” values (used by logic)
  const [devYear, setDevYear] = useState(2026);
  const [devWeek, setDevWeek] = useState(6);

  // Text being edited (prevents snapping while deleting/typing)
  const [devYearText, setDevYearText] = useState(String(2026));
  const [devWeekText, setDevWeekText] = useState(String(6));

  const [devKind, setDevKind] = useState<WeeklyKind>("mcq");
  const [devSlot, setDevSlot] = useState(1);

  const [devGame, setDevGame] = useState<any>(null);
  const [devErr, setDevErr] = useState<string | null>(null);
  const [devLoading, setDevLoading] = useState(false);
  const [devShowJson, setDevShowJson] = useState(false);

  // ✅ Global dev toggle (ignore locks) — assumes useWeeklyLock shares ignoreLocks globally
  const globalLock = useWeeklyLock("weekly_dev_dummy_key");

  const wk = weekKeyFrom(devYear, devWeek);
  const thisKindLock = useWeeklyLock(lockKeyFor(devKind, wk));
  const effectiveLocked = thisKindLock.locked;

  const slotChoices = useMemo(() => {
    if (devKind === "mcq") return [1];
    if (devKind === "match") return [1, 2];
    return [1, 2, 3];
  }, [devKind]);

  const validate = (kind: WeeklyKind, game: any): string | null => {
    if (!game) return "Game er tom (null/undefined).";

    if (kind === "mcq") {
      if (!Array.isArray(game.questions)) return "MCQ: pack.questions mangler.";
      if (game.questions.length < 1)
        return "MCQ: pack.questions er tom (0 spørgsmål).";

      for (const q of game.questions) {
        if (!q?.id || !q?.text) return "MCQ: spørgsmål mangler id/text.";
        if (!Array.isArray(q.options) || q.options.length < 2)
          return "MCQ: et spørgsmål mangler options (min 2).";
        const correct = q.options.filter((o: any) => !!o?.isCorrect);
        if (correct.length !== 1)
          return "MCQ: et spørgsmål har ikke præcis 1 korrekt option.";
      }
      return null;
    }

    if (kind === "match") {
      if (!Array.isArray(game.pairs)) return "MATCH: round.pairs mangler.";
      if (game.pairs.length < 1) return "MATCH: round.pairs er tom.";
      for (const p of game.pairs) {
        if (!p?.id || typeof p.left !== "string" || typeof p.right !== "string")
          return "MATCH: et par mangler id/left/right.";
      }
      return null;
    }

    // word
    if (!Array.isArray(game.words)) return "WORD: round.words mangler.";
    if (game.words.length < 1) return "WORD: round.words er tom.";
    return null;
  };

  const load = async () => {
    setDevErr(null);
    setDevGame(null);
    setDevLoading(true);

    try {
      const weekKey = wk;

      if (devKind === "mcq") {
        const ref = doc(db, "weekly_mcq_packs", weekKey);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setDevErr("Ingen MCQ pack fundet for denne uge.");
          return;
        }
        const pack = snap.data() as any;
        const maybeErr = validate("mcq", pack);
        if (maybeErr) setDevErr(maybeErr);

        setDevGame({
          kind: "mcq",
          weekKey,
          title: pack.topicTitle ?? "(ingen topicTitle)",
          timeLimitSec: pack.timeLimitSec ?? 30,
          questions: pack.questions ?? [],
        });
        return;
      }

      if (devKind === "match") {
        const ref = doc(db, "weekly_match_packs", weekKey);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setDevErr("Ingen Match pack fundet for denne uge.");
          return;
        }
        const pack = snap.data() as any;
        const rd = (pack.rounds ?? [])[devSlot - 1];
        if (!rd) {
          setDevErr(`Ingen runde ${devSlot} i denne Match pack.`);
          return;
        }

        const maybeErr = validate("match", { pairs: rd.pairs ?? [] });
        if (maybeErr) setDevErr(maybeErr);

        setDevGame({
          kind: "match",
          weekKey,
          title: pack.topicTitle ?? "(ingen topicTitle)",
          round: devSlot,
          topic: rd.topic ?? "(ingen topic)",
          pairs: rd.pairs ?? [],
        });
        return;
      }

      // word
      const ref = doc(db, "weekly_word_packs", weekKey);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setDevErr("Ingen Word pack fundet for denne uge.");
        return;
      }
      const pack = snap.data() as any;
      const rd = (pack.rounds ?? [])[devSlot - 1];
      if (!rd) {
        setDevErr(`Ingen runde ${devSlot} i denne Word pack.`);
        return;
      }

      const maybeErr = validate("word", { words: rd.words ?? [] });
      if (maybeErr) setDevErr(maybeErr);

      setDevGame({
        kind: "word",
        weekKey,
        title: pack.topicTitle ?? "(ingen topicTitle)",
        round: devSlot,
        topic: rd.topic ?? "(ingen topic)",
        minLength: rd.minLength ?? 4,
        maxLength: rd.maxLength ?? rd.minLength ?? 4,
        words: rd.words ?? [],
      });
    } catch (e: any) {
      setDevErr(e?.message ?? "Kunne ikke hente pack.");
    } finally {
      setDevLoading(false);
    }
  };

  const unlockThisKindThisWeek = async () => {
    try {
      await thisKindLock.unlock();
      Alert.alert("OK", `Låsen er fjernet for ${devKind.toUpperCase()} ${wk}.`);
    } catch (e: any) {
      Alert.alert("Fejl", e?.message ?? "Kunne ikke fjerne lås.");
    }
  };

  const startSelectedGame = () => {
    if (!devGame) {
      Alert.alert("Ingen preview", "Hent en pack først.");
      return;
    }
    if (thisKindLock.locked && !globalLock.ignoreLocks) {
      Alert.alert(
        "Låst",
        "Denne uge/type er låst. Slå DEV locks OFF til eller fjern låsen.",
      );
      return;
    }

    onStartGame({
      kind: devKind,
      weekKey: wk,
      round: devKind === "mcq" ? undefined : devSlot,
    });
  };

  return (
    <LinearGradient
      colors={["#0e91a8ff", "#5e6e7eff"]}
      style={styles.homeBackground}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.homeContainer, styles.safeTopContainer]}
      >
        {/* ✅ FIX: make header wrap so buttons never go off-screen */}
        <View
          style={[
            styles.headerRow,
            {
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              rowGap: 10,
              columnGap: 10,
            },
          ]}
        >
          <Text
            style={[
              styles.appTitle,
              {
                fontSize: headingFont,
                color: "#f8f9fa",
                flexShrink: 1,
                minWidth: 180,
              },
            ]}
          >
            Weekly Dev Preview
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <Pressable
              style={[styles.smallButton, { borderColor: "#fff" }]}
              onPress={() => setDevShowJson((p) => !p)}
            >
              <Text
                style={[
                  styles.smallButtonText,
                  { color: "#fff", fontSize: buttonFont * 0.9 },
                ]}
              >
                {devShowJson ? "Skjul JSON" : "Vis JSON"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.smallButton, { borderColor: "#fff" }]}
              onPress={() => {
                onClearDevOverride();
                onBack();
              }}
            >
              <Text
                style={[
                  styles.smallButtonText,
                  { color: "#fff", fontSize: buttonFont * 0.9 },
                ]}
              >
                Home
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsSectionTitle}>Dev tools</Text>

          <Pressable
            style={[
              styles.bigButton,
              {
                marginTop: 10,
                backgroundColor: globalLock.ignoreLocks ? "#2b8a3e" : "#495057",
              },
            ]}
            onPress={() => globalLock.setIgnore(!globalLock.ignoreLocks)}
          >
            <Text style={styles.bigButtonText}>
              {globalLock.ignoreLocks
                ? "DEV MODE: Locks OFF ✅"
                : "DEV MODE: Locks ON 🔒"}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.bigButton,
              {
                marginTop: 10,
                backgroundColor: "#c92a2a",
                opacity: effectiveLocked ? 1 : 0.8,
              },
            ]}
            onPress={unlockThisKindThisWeek}
          >
            <Text style={styles.bigButtonText}>
              Fjern lås for {devKind.toUpperCase()} ({wk}){" "}
              {effectiveLocked ? "🔓" : "(allerede åben)"}
            </Text>
          </Pressable>

          <Text style={[styles.statsSectionTitle, { marginTop: 16 }]}>
            Vælg hvad du vil previewe
          </Text>

          <Text style={styles.statsLabel}>År</Text>
          <TextInput
            value={devYearText}
            onChangeText={(t) => {
              const clean = digitsOnly(t);
              setDevYearText(clean);
              if (clean.length > 0) {
                const next = clampInt(clean, devYear, 2020, 2100);
                setDevYear(next);
              }
            }}
            onBlur={() => {
              const committed = clampInt(devYearText, devYear, 2020, 2100);
              setDevYear(committed);
              setDevYearText(String(committed));
            }}
            keyboardType="numeric"
            style={styles.textInput}
          />

          <Text style={[styles.statsLabel, { marginTop: 12 }]}>
            ISO uge (1–53)
          </Text>
          <TextInput
            value={devWeekText}
            onChangeText={(t) => {
              const clean = digitsOnly(t);
              setDevWeekText(clean);
              if (clean.length > 0) {
                const next = clampInt(clean, devWeek, 1, 53);
                setDevWeek(next);
              }
            }}
            onBlur={() => {
              const committed = clampInt(devWeekText, devWeek, 1, 53);
              setDevWeek(committed);
              setDevWeekText(String(committed));
            }}
            keyboardType="numeric"
            style={styles.textInput}
          />

          <Text style={[styles.statsLabel, { marginTop: 12 }]}>Type</Text>
          <View style={styles.classList}>
            {(["mcq", "match", "word"] as WeeklyKind[]).map((k) => {
              const selected = devKind === k;
              return (
                <Pressable
                  key={k}
                  onPress={() => {
                    setDevKind(k);
                    setDevSlot(1);
                    setDevGame(null);
                    setDevErr(null);
                  }}
                  style={[
                    styles.classChip,
                    selected && styles.classChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.classChipText,
                      selected && styles.classChipTextSelected,
                    ]}
                  >
                    {k.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.statsLabel, { marginTop: 12 }]}>
            Slot / Runde
          </Text>
          <View style={styles.classList}>
            {slotChoices.map((s) => {
              const selected = devSlot === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => {
                    setDevSlot(s);
                    setDevGame(null);
                    setDevErr(null);
                  }}
                  style={[
                    styles.classChip,
                    selected && styles.classChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.classChipText,
                      selected && styles.classChipTextSelected,
                    ]}
                  >
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={[
              styles.bigButton,
              {
                backgroundColor: "#1c7ed6",
                marginTop: 16,
                opacity: devLoading ? 0.7 : 1,
              },
            ]}
            onPress={load}
            disabled={devLoading}
          >
            <Text style={styles.bigButtonText}>
              {devLoading ? "Henter..." : `Hent (${wk})`}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.bigButton,
              {
                backgroundColor: "#2f9e44",
                marginTop: 10,
                opacity: devGame ? 1 : 0.5,
              },
            ]}
            onPress={startSelectedGame}
            disabled={!devGame}
          >
            <Text style={styles.bigButtonText}>
              Start {devKind.toUpperCase()} ({wk})
              {devKind === "mcq" ? "" : ` · Runde ${devSlot}`}
            </Text>
          </Pressable>

          {!!devErr && (
            <Text
              style={[styles.statsLabel, { marginTop: 12, color: "#ffdddd" }]}
            >
              {devErr}
            </Text>
          )}

          {!!devGame && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.statsSectionTitle}>
                {devGame.title ?? "(ingen title)"}
              </Text>
              <Text style={styles.statsLabel}>
                {devGame.weekKey} · {String(devGame.kind).toUpperCase()}
                {devGame.round ? ` · Runde ${devGame.round}` : ""}
              </Text>

              {devShowJson && (
                <View style={{ marginTop: 14 }}>
                  <Text style={[styles.statsLabel, { opacity: 0.85 }]}>
                    Raw JSON:
                  </Text>
                  <Text
                    style={[
                      styles.statsLabel,
                      {
                        marginTop: 6,
                        fontFamily:
                          Platform.OS === "ios" ? "Menlo" : "monospace",
                        fontSize: 12,
                        lineHeight: 16,
                        opacity: 0.9,
                      },
                    ]}
                  >
                    {JSON.stringify(devGame, null, 2)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {devLoading && (
          <View style={{ marginTop: 10 }}>
            <ActivityIndicator />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
