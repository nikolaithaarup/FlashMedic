import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "../../../app/flashmedicStyles";
import type { Flashcard } from "../../types/Flashcard";
import { useStats } from "./StatsContext";
import { getPersonalTotals } from "./statsSelectors";

type Props = {
  headingFont: number;
  buttonFont: number;
  subtitleFont: number;
  cards: Flashcard[];
  onBack: () => void;
};

type CardStats = { seen: number; correct: number; incorrect: number; lastSeen: string | null };
type StatsMap = Record<string, CardStats>;

export default function StatsScreen({
  headingFont,
  buttonFont,
  subtitleFont,
  cards,
  onBack,
}: Props) {
  const { personalStats, resetPersonalStats } = useStats();
  const statsMap = personalStats as StatsMap;

  const { totalSeen, totalCorrect, totalIncorrect, accuracy } = useMemo(
    () => getPersonalTotals(personalStats),
    [personalStats]
  );

  const subjectStats = useMemo(() => {
    const map = new Map<string, { seen: number; correct: number }>();

    for (const [cardId, s] of Object.entries(statsMap)) {
      const card = cards.find((c) => c.id === cardId);
      if (!card) continue;

      const subject = card.subject || "Ukendt";
      const entry = map.get(subject) ?? { seen: 0, correct: 0 };
      entry.seen += s.seen;
      entry.correct += s.correct;
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
    // Keep Alert in Index if you prefer; simple direct call here:
    resetPersonalStats();
  };

  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>
            Statistik
          </Text>
          <Pressable
            style={[styles.smallButton, { borderColor: "#fff" }]}
            onPress={onBack}
            hitSlop={8}
          >
            <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
              Home
            </Text>
          </Pressable>
        </View>

        <View style={[styles.statsCard, { marginTop: 20 }]}>
          <Text style={styles.statsSectionTitle}>Personlig statistik – samlet</Text>
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

          <Text style={[styles.statsLabel, { marginTop: 16 }]}>Samlet træfsikkerhed</Text>
          <Text style={styles.statsAccuracy}>{isNaN(accuracy) ? "0%" : `${accuracy.toFixed(1)}%`}</Text>
        </View>

        <View style={[styles.statsCard, { marginTop: 20 }]}>
          <Text style={styles.statsSectionTitle}>Personlig statistik – pr. fag</Text>
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
                    Treff: {isNaN(s.accuracy) ? "0%" : `${s.accuracy.toFixed(1)}%`}
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
          <Text style={[styles.bigButtonText, { fontSize: buttonFont, color: "#fff" }]}>
            Nulstil statistik
          </Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
