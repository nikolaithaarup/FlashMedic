// src/features/weekly/WeeklyDevScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { getWeeklyGame, type WeeklyKind } from "../../services/weeklyGames";

// Reuse your existing FlashMedic styles (same look)
import { styles } from "../../../app/flashmedicStyles";

export default function WeeklyDevScreen({
  headingFont,
  buttonFont,
  onBack,
}: {
  headingFont: number;
  buttonFont: number;
  onBack: () => void;
}) {
  const [devYear, setDevYear] = useState(2026);
  const [devWeek, setDevWeek] = useState(1);
  const [devKind, setDevKind] = useState<WeeklyKind>("mcq");
  const [devSlot, setDevSlot] = useState(1);

  const [devGame, setDevGame] = useState<any>(null);
  const [devErr, setDevErr] = useState<string | null>(null);
  const [devLoading, setDevLoading] = useState(false);
  const [devShowJson, setDevShowJson] = useState(false);

  const clampInt = (value: string, fallback: number, min: number, max: number) => {
    const n = parseInt(value || "", 10);
    if (Number.isNaN(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  };

  const slotsForKind = (k: WeeklyKind): number[] => {
    if (k === "mcq") return [1];
    if (k === "match") return [1, 2];
    return [1, 2, 3]; // word
  };

  const validateGame = (kind: WeeklyKind, game: any): string | null => {
    if (!game) return "Game er tom (null/undefined).";
    if (!Array.isArray(game.items)) return "Game.items mangler eller er ikke en liste.";

    if (kind === "mcq") {
      for (const q of game.items) {
        if (!q?.id || !q?.text) return "MCQ-fejl: et spørgsmål mangler id eller text.";
        if (!Array.isArray(q.options) || q.options.length < 2)
          return "MCQ-fejl: et spørgsmål mangler options (min 2).";

        const correct = q.options.filter((o: any) => o?.isCorrect);
        if (correct.length !== 1)
          return "MCQ-datafejl: et spørgsmål har ikke præcis 1 korrekt mulighed.";

        for (const o of q.options) {
          if (!o?.id || typeof o?.text !== "string")
            return "MCQ-fejl: en option mangler id eller text.";
          if (typeof o.isCorrect !== "boolean")
            return "MCQ-fejl: en option mangler boolean isCorrect.";
        }
      }
      return null;
    }

    if (kind === "match") {
      const ids = new Set<string>();
      for (const p of game.items) {
        if (!p?.id || typeof p.left !== "string" || typeof p.right !== "string")
          return "MATCH-fejl: et par mangler id/left/right.";
        if (ids.has(p.id)) return "MATCH-fejl: duplicate pair id fundet.";
        ids.add(p.id);
        if (!p.left.trim() || !p.right.trim())
          return "MATCH-fejl: left/right må ikke være tom.";
      }
      if (game.items.length !== 5) {
        return `MATCH-advarsel: der er ${game.items.length} par (UI forventer ofte 5).`;
      }
      return null;
    }

    // kind === "word"
    for (const w of game.items) {
      if (!w?.id) return "WORD-fejl: item mangler id.";
      if (typeof w.word !== "string" || !w.word.trim()) return "WORD-fejl: item mangler word.";
      if (w.accepted && !Array.isArray(w.accepted)) return "WORD-fejl: accepted skal være en liste.";
      if (w.accepted && w.accepted.some((x: any) => typeof x !== "string"))
        return "WORD-fejl: accepted må kun indeholde strings.";
    }
    if (game.items.length !== 3) {
      return `WORD-advarsel: der er ${game.items.length} items (UI forventer ofte 3 runder).`;
    }
    return null;
  };

  const slotChoices = useMemo(() => slotsForKind(devKind), [devKind]);

  const load = async () => {
    setDevErr(null);
    setDevGame(null);
    setDevLoading(true);

    try {
      const game = await getWeeklyGame({
        year: devYear,
        isoWeek: devWeek,
        kind: devKind,
        slot: devSlot,
      });

      if (!game) {
        setDevErr("Ingen game fundet for det valg.");
        return;
      }

      const maybeErr = validateGame(devKind, game);
      if (maybeErr) setDevErr(maybeErr);

      setDevGame(game);
    } catch (e: any) {
      setDevErr(e?.message ?? "Kunne ikke hente game.");
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>
            Weekly Dev Preview
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              style={[styles.smallButton, { borderColor: "#fff" }]}
              onPress={() => setDevShowJson((p) => !p)}
            >
              <Text style={[styles.smallButtonText, { color: "#fff" }]}>
                {devShowJson ? "Skjul JSON" : "Vis JSON"}
              </Text>
            </Pressable>

            <Pressable style={[styles.smallButton, { borderColor: "#fff" }]} onPress={onBack}>
              <Text style={[styles.smallButtonText, { color: "#fff" }]}>Home</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsSectionTitle}>Vælg hvad du vil teste</Text>

          <Text style={styles.statsLabel}>År</Text>
          <TextInput
            value={String(devYear)}
            onChangeText={(t) => setDevYear(clampInt(t, 2026, 2020, 2100))}
            keyboardType="numeric"
            style={styles.textInput}
          />

          <Text style={[styles.statsLabel, { marginTop: 12 }]}>ISO uge (1–53)</Text>
          <TextInput
            value={String(devWeek)}
            onChangeText={(t) => setDevWeek(clampInt(t, 1, 1, 53))}
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
                  style={[styles.classChip, selected && styles.classChipSelected]}
                >
                  <Text style={[styles.classChipText, selected && styles.classChipTextSelected]}>
                    {k.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.statsLabel, { marginTop: 12 }]}>Slot</Text>
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
                  style={[styles.classChip, selected && styles.classChipSelected]}
                >
                  <Text style={[styles.classChipText, selected && styles.classChipTextSelected]}>
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={[
              styles.bigButton,
              { backgroundColor: "#1c7ed6", marginTop: 16, opacity: devLoading ? 0.7 : 1 },
            ]}
            onPress={load}
            disabled={devLoading}
          >
            <Text style={styles.bigButtonText}>{devLoading ? "Henter..." : "Hent game"}</Text>
          </Pressable>

          {!!devErr && (
            <Text style={[styles.statsLabel, { marginTop: 12, color: "#ffdddd" }]}>{devErr}</Text>
          )}

          {!!devGame && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.statsSectionTitle}>{devGame.title ?? "(ingen title)"}</Text>
              <Text style={styles.statsLabel}>
                {devGame.subjectSlug ?? "(ingen subjectSlug)"} · uge {devGame.isoWeek ?? devWeek} ·{" "}
                {devKind.toUpperCase()} slot {devSlot}
              </Text>

              <Text style={[styles.statsLabel, { marginTop: 10, opacity: 0.9 }]}>
                Items: {(devGame.items ?? []).length}
              </Text>

              {/* MCQ preview */}
              {devKind === "mcq" &&
                (devGame.items ?? []).map((q: any) => {
                  const correct = (q.options ?? []).find((o: any) => o?.isCorrect);
                  return (
                    <View key={q.id} style={{ marginTop: 12 }}>
                      <Text style={styles.statsLabel}>Q: {q.text}</Text>
                      <Text style={[styles.statsLabel, { opacity: 0.9, marginTop: 4 }]}>
                        ✅ Korrekt: {correct?.text ?? "(mangler)"}
                      </Text>
                      <Text style={[styles.statsLabel, { opacity: 0.8, marginTop: 6 }]}>
                        Muligheder:
                      </Text>
                      {(q.options ?? []).map((o: any) => (
                        <Text key={o.id} style={[styles.statsLabel, { opacity: 0.85 }]}>
                          - {o.text} {o.isCorrect ? "✅" : ""}
                        </Text>
                      ))}
                    </View>
                  );
                })}

              {/* MATCH preview */}
              {devKind === "match" &&
                (devGame.items ?? []).map((p: any) => (
                  <View key={p.id} style={{ marginTop: 12 }}>
                    <Text style={styles.statsLabel}>🟦 {p.left}</Text>
                    <Text style={[styles.statsLabel, { opacity: 0.9 }]}>🟩 {p.right}</Text>
                  </View>
                ))}

              {/* WORD preview */}
              {devKind === "word" &&
                (devGame.items ?? []).map((w: any) => (
                  <View key={w.id} style={{ marginTop: 12 }}>
                    <Text style={styles.statsLabel}>🧠 Ord: {String(w.word ?? "").toUpperCase()}</Text>
                    {!!w.explanation && (
                      <Text style={[styles.statsLabel, { opacity: 0.9, marginTop: 4 }]}>
                        Forklaring: {w.explanation}
                      </Text>
                    )}
                    <Text style={[styles.statsLabel, { opacity: 0.85, marginTop: 4 }]}>
                      Accepted: {(w.accepted ?? []).join(", ") || "(ingen)"}
                    </Text>
                  </View>
                ))}

              {/* Raw JSON */}
              {devShowJson && (
                <View style={{ marginTop: 14 }}>
                  <Text style={[styles.statsLabel, { opacity: 0.85 }]}>Raw JSON:</Text>
                  <Text
                    style={[
                      styles.statsLabel,
                      {
                        marginTop: 6,
                        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
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
      </ScrollView>
    </LinearGradient>
  );
}
