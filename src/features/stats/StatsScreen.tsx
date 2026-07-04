import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  SemanticStates,
  Spacing,
  Typography,
} from "../../../constants/theme";
import type { Flashcard } from "../../types/Flashcard";
import { deriveTopicStats, selectMistakeReviewCards } from "../flashcards/learningSelectors";
import { Card, EmptyState, PrimaryButton, Screen, SecondaryButton, ToolPageHeader } from "../../ui/primitives";
import { useStats, type StatsMap } from "./StatsContext";
import { getPersonalTotals } from "./statsSelectors";

type Props = {
  headingFont: number;
  buttonFont: number;
  subtitleFont: number;
  cards: Flashcard[];
  onBack: () => void;
  onTrainMistakes: () => void;
  onTrainWeakTopics: () => void;
};

function asStatsMap(value: unknown): StatsMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as StatsMap;
}

export default function StatsScreen({ cards, onBack, onTrainMistakes, onTrainWeakTopics }: Props) {
  const { personalStats, resetPersonalStats, mistakes } = useStats();
  const statsMap = useMemo(() => asStatsMap(personalStats), [personalStats]);
  const { totalSeen, totalCorrect, totalIncorrect, accuracy } = useMemo(
    () => getPersonalTotals(statsMap),
    [statsMap],
  );
  const subjectStats = useMemo(() => {
    const cardById = new Map<string, Flashcard>();
    for (const card of cards ?? []) cardById.set(card.id, card);
    const totals = new Map<string, { seen: number; correct: number }>();
    for (const [cardId, stats] of Object.entries(statsMap)) {
      const card = cardById.get(cardId);
      if (!card) continue;
      const subject = card.subject || "Ukendt";
      const entry = totals.get(subject) ?? { seen: 0, correct: 0 };
      entry.seen += Number(stats?.seen ?? 0) || 0;
      entry.correct += Number(stats?.correct ?? 0) || 0;
      totals.set(subject, entry);
    }
    return Array.from(totals.entries())
      .map(([subject, values]) => ({
        subject,
        ...values,
        accuracy: values.seen > 0 ? (values.correct / values.seen) * 100 : 0,
      }))
      .sort((a, b) => a.subject.localeCompare(b.subject));
  }, [cards, statsMap]);

  const safeAccuracy = Number.isFinite(accuracy) ? accuracy : 0;
  const pendingMistakes = useMemo(
    () => selectMistakeReviewCards(mistakes, cards).cards.length,
    [mistakes, cards],
  );
  const weakTopics = useMemo(
    () => deriveTopicStats(statsMap, cards).filter(({ dataQuality }) => dataQuality === "usable").slice(0, 3),
    [statsMap, cards],
  );

  return (
    <Screen>
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBack}
        subtitle="Din træning på tværs af fag"
        title="Statistik"
      />

      <Text style={styles.sectionLabel}>SAMLET</Text>
      <Card variant="subtle" style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Besvarede spørgsmål</Text>
        <Text style={styles.summaryValue}>{totalSeen}</Text>
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Korrekte</Text>
            <Text style={[styles.metricValue, styles.success]}>{totalCorrect}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Forkerte</Text>
            <Text style={[styles.metricValue, styles.danger]}>{totalIncorrect}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Træfsikkerhed</Text>
            <Text style={[styles.metricValue, styles.info]}>
              {safeAccuracy.toFixed(1)}%
            </Text>
          </View>
        </View>
      </Card>

      <Text style={[styles.sectionLabel, styles.subjectLabel]}>REPETITION</Text>
      <Card variant="subtle" style={styles.learningCard}>
        <View style={styles.learningRow}>
          <View style={styles.subjectCopy}>
            <Text style={styles.subjectTitle}>Forkerte svar</Text>
            <Text style={styles.subjectMeta}>{pendingMistakes} kort venter på repetition</Text>
          </View>
          <PrimaryButton
            disabled={pendingMistakes === 0}
            label="Træn"
            onPress={onTrainMistakes}
            style={styles.learningButton}
          />
        </View>
        <View style={styles.learningDivider} />
        <Text style={styles.subjectTitle}>Svage emner</Text>
        {weakTopics.length === 0 ? (
          <Text style={styles.subjectMeta}>
            Ikke nok data endnu. Der kræves mindst fem besvarelser i et emne.
          </Text>
        ) : (
          weakTopics.map((topic) => (
            <Text key={topic.key} style={styles.subjectMeta}>
              {topic.subject} · {topic.topic}{topic.subtopic ? ` · ${topic.subtopic}` : ""} · {Math.round(topic.accuracy * 100)}%
            </Text>
          ))
        )}
        <SecondaryButton
          disabled={weakTopics.length === 0}
          label="Træn svage emner"
          onPress={onTrainWeakTopics}
          style={styles.weakButton}
        />
      </Card>

      <Text style={[styles.sectionLabel, styles.subjectLabel]}>PR. FAG</Text>
      <Card variant="subtle">
        {subjectStats.length === 0 ? (
          <EmptyState
            message="Besvar flashcards for at se statistik fordelt på fag."
            title="Ingen data endnu"
          />
        ) : (
          subjectStats.map((subject) => (
            <View key={subject.subject} style={styles.subjectRow}>
              <View style={styles.subjectCopy}>
                <Text style={styles.subjectTitle}>{subject.subject}</Text>
                <Text style={styles.subjectMeta}>{subject.seen} besvarelser</Text>
              </View>
              <Text style={styles.subjectAccuracy}>
                {Number.isFinite(subject.accuracy)
                  ? subject.accuracy.toFixed(1)
                  : "0.0"}
                %
              </Text>
            </View>
          ))
        )}
      </Card>

      <Pressable
        accessibilityRole="button"
        onPress={resetPersonalStats}
        style={({ pressed }) => [
          styles.resetButton,
          pressed && styles.resetPressed,
        ]}
      >
        <Text style={styles.resetText}>Nulstil statistik</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  summaryCard: { padding: Spacing.lg },
  summaryLabel: { color: ColorTokens.text.secondary, fontSize: Typography.sizes.label },
  summaryValue: {
    color: ColorTokens.text.primary,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: Typography.weights.heavy,
  },
  metricRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
  metric: {
    flex: 1,
    minWidth: 0,
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
    paddingTop: Spacing.sm,
  },
  metricLabel: { color: ColorTokens.text.secondary, fontSize: Typography.sizes.caption },
  metricValue: { fontSize: Typography.sizes.cardTitle, fontWeight: Typography.weights.bold },
  success: { color: SemanticStates.success.foreground },
  danger: { color: SemanticStates.danger.foreground },
  info: { color: SemanticStates.info.foreground },
  subjectLabel: { marginTop: Spacing.xl },
  subjectRow: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: Borders.hairline,
    borderBottomColor: ColorTokens.border.divider,
  },
  subjectCopy: { flex: 1, minWidth: 0 },
  subjectTitle: { color: ColorTokens.text.primary, fontWeight: Typography.weights.semibold },
  subjectMeta: { color: ColorTokens.text.secondary, fontSize: Typography.sizes.caption },
  subjectAccuracy: { color: ColorTokens.accent.muted, fontWeight: Typography.weights.bold },
  resetButton: {
    minHeight: Interaction.minimumTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: SemanticStates.danger.foreground,
    backgroundColor: SemanticStates.danger.surface,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  resetPressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.controlPressedScale }],
  },
  resetText: { color: ColorTokens.text.onSurface, fontWeight: Typography.weights.bold },
  learningCard: { gap: Spacing.sm },
  learningRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  learningButton: { minWidth: 96 },
  learningDivider: { height: Borders.hairline, backgroundColor: ColorTokens.border.divider },
  weakButton: { marginTop: Spacing.xs },
});
