// src/features/stats/StatsScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { Flashcard } from "../../types/Flashcard";
import { styles } from "../../ui/flashmedicStyles";
import { useStats, type StatsMap } from "./StatsContext"; // ✅ import StatsMap
import { getPersonalTotals } from "./statsSelectors";

type Props = {
  headingFont: number;
  buttonFont: number;
  subtitleFont: number;
  cards: Flashcard[];
  onBack: () => void;
};

function asStatsMap(value: unknown): StatsMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as StatsMap;
}

export default function StatsScreen({
  headingFont,
  buttonFont,
  subtitleFont,
  cards,
  onBack,
}: Props) {
  const { personalStats, resetPersonalStats } = useStats();

  const statsMap = useMemo(() => asStatsMap(personalStats), [personalStats]);

  const { totalSeen, totalCorrect, totalIncorrect, accuracy } = useMemo(
    () => getPersonalTotals(statsMap),
    [statsMap],
  );

  const subjectStats = useMemo(() => {
    const cardById = new Map<string, Flashcard>();
    for (const c of cards ?? []) cardById.set(c.id, c);

    const map = new Map<string, { seen: number; correct: number }>();

    for (const [cardId, s] of Object.entries(statsMap)) {
      const card = cardById.get(cardId);
      if (!card) continue;

      const subject = card.subject || "Ukendt";
      const entry = map.get(subject) ?? { seen: 0, correct: 0 };

      const seen = Number(s?.seen ?? 0) || 0;
      const correct = Number(s?.correct ?? 0) || 0;

      entry.seen += seen;
      entry.correct += correct;

      map.set(subject, entry);
    }

    return Array.from(map.entries())
      .map(([subject, { seen, correct }]) => ({
        subject,
        seen,
        correct,
        accuracy: seen > 0 ? (correct / seen) * 100 : 0,
      }))
      .sort((a, b) => a.subject.localeCompare(b.subject));
  }, [statsMap, cards]);

  const handleReset = () => {
    resetPersonalStats();
  };

  const safeAccuracy = Number.isFinite(accuracy) ? accuracy : 0;

  return (
    <LinearGradient
      colors={["#0e91a8ff", "#5e6e7eff"]}
      style={styles.homeBackground}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.appTitle,
              { fontSize: headingFont, color: "#f8f9fa" },
            ]}
          >
            Statistik
          </Text>
          <Pressable
            style={[styles.smallButton, { borderColor: "#fff" }]}
            onPress={onBack}
            hitSlop={8}
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

        <View style={[styles.statsCard, { marginTop: 20 }]}>
          <Text style={styles.statsSectionTitle}>
            Personlig statistik – samlet
          </Text>

          <Text style={styles.statsLabel}>Antal besvarede spørgsmål</Text>
          <Text style={styles.statsValue}>{totalSeen}</Text>

          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statsLabel}>Korrekte</Text>
              <Text style={styles.statsGood}>{totalCorrect}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statsLabel}>Forkerte</Text>
              <Text style={styles.statsBad}>{totalIncorrect}</Text>
            </View>
          </View>

          <Text style={[styles.statsLabel, { marginTop: 16 }]}>
            Samlet træfsikkerhed
          </Text>
          <Text style={styles.statsAccuracy}>{safeAccuracy.toFixed(1)}%</Text>
        </View>

        <View style={[styles.statsCard, { marginTop: 20 }]}>
          <Text style={styles.statsSectionTitle}>
            Personlig statistik – pr. fag
          </Text>

          {subjectStats.length === 0 ? (
            <Text style={styles.statsLabel}>Ingen data endnu.</Text>
          ) : (
            subjectStats.map((s) => (
              <View key={s.subject} style={styles.subjectStatsRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.subjectStatsTitle}>{s.subject}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subjectStatsSub}>Set: {s.seen}</Text>
                  <Text style={styles.subjectStatsSub}>
                    Treff:{" "}
                    {Number.isFinite(s.accuracy)
                      ? s.accuracy.toFixed(1)
                      : "0.0"}
                    %
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <Pressable
          style={[
            styles.bigButton,
            { backgroundColor: "#c92a2a", alignSelf: "stretch", marginTop: 24 },
          ]}
          onPress={handleReset}
        >
          <Text
            style={[
              styles.bigButtonText,
              { fontSize: buttonFont, color: "#fff" },
            ]}
          >
            Nulstil statistik
          </Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
