import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  SemanticStates,
  Spacing,
  Typography,
} from "../../../constants/theme";
import type { Flashcard } from "../../types/Flashcard";
import type { ExamSummary } from "../../types/Learning";
import {
  Card,
  EmptyState,
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";

type ExamSummaryScreenProps = {
  summary: ExamSummary;
  incorrectCards: Flashcard[];
  onBackToFlashcards: () => void;
  onRetry: () => void;
  onTrainMistakes: () => void;
};

function formatAccuracy(value: number): string {
  return Number.isFinite(value) ? `${value.toFixed(1)}%` : "0.0%";
}

export default function ExamSummaryScreen({
  summary,
  incorrectCards,
  onBackToFlashcards,
  onRetry,
  onTrainMistakes,
}: ExamSummaryScreenProps) {
  return (
    <Screen>
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til flashcards"
        onBack={onBackToFlashcards}
        subtitle="Feedback vises samlet efter din besvarelse"
        title="Eksamensmode gennemført"
      />

      <Card variant="subtle" style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Samlet resultat</Text>
        <Text style={styles.summaryValue}>{formatAccuracy(summary.accuracy)}</Text>
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Besvaret</Text>
            <Text style={styles.metricValue}>{summary.totalAnswered}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Korrekte</Text>
            <Text style={[styles.metricValue, styles.success]}>{summary.correct}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Forkerte</Text>
            <Text style={[styles.metricValue, styles.danger]}>{summary.incorrect}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.actions}>
        <PrimaryButton
          disabled={summary.incorrect === 0}
          label="Træn forkerte svar"
          onPress={onTrainMistakes}
          style={styles.actionButton}
        />
        <SecondaryButton
          label="Prøv igen"
          onPress={onRetry}
          style={styles.actionButton}
        />
      </View>
      <SecondaryButton
        label="Tilbage til flashcards"
        onPress={onBackToFlashcards}
        style={styles.backButton}
      />

      <Text style={styles.sectionLabel}>FORDELING</Text>
      <Card variant="subtle" style={styles.breakdownCard}>
        {summary.bySubject.slice(0, 6).map((row) => (
          <View key={row.key} style={styles.breakdownRow}>
            <View style={styles.breakdownCopy}>
              <Text style={styles.breakdownTitle}>{row.label}</Text>
              <Text style={styles.breakdownMeta}>{row.answered} besvarelser</Text>
            </View>
            <Text style={styles.breakdownAccuracy}>
              {formatAccuracy(row.accuracy)}
            </Text>
          </View>
        ))}
      </Card>

      <Text style={styles.sectionLabel}>FORKERTE SVAR</Text>
      <Card variant="subtle" style={styles.incorrectCard}>
        {incorrectCards.length === 0 ? (
          <EmptyState
            message="Der er ingen forkerte svar i denne eksamen."
            title="Flot runde"
          />
        ) : (
          incorrectCards.map((card) => (
            <View key={card.id} style={styles.reviewItem}>
              <Text style={styles.reviewMeta}>
                {card.subject}
                {card.topic ? ` · ${card.topic}` : ""}
                {card.subtopic ? ` · ${card.subtopic}` : ""}
              </Text>
              <Text style={styles.reviewQuestion}>{card.question}</Text>
              <Text style={styles.reviewAnswer}>{card.answer}</Text>
              {card.explanation ? (
                <Text style={styles.reviewDetail}>{card.explanation}</Text>
              ) : null}
              {card.rationale ? (
                <Text style={styles.reviewDetail}>{card.rationale}</Text>
              ) : null}
              {card.prehospitalRelevance ? (
                <Text style={styles.reviewDetail}>
                  {card.prehospitalRelevance}
                </Text>
              ) : null}
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryCard: { padding: Spacing.lg },
  summaryLabel: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.label,
  },
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
  metricLabel: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
  },
  metricValue: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  success: { color: SemanticStates.success.foreground },
  danger: { color: SemanticStates.danger.foreground },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  actionButton: { flex: 1, minWidth: 190 },
  backButton: { marginTop: Spacing.sm },
  sectionLabel: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.8,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  breakdownCard: { gap: Spacing.sm },
  breakdownRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  breakdownCopy: { flex: 1, minWidth: 0 },
  breakdownTitle: {
    color: ColorTokens.text.primary,
    fontWeight: Typography.weights.semibold,
  },
  breakdownMeta: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
  },
  breakdownAccuracy: {
    color: ColorTokens.accent.muted,
    fontWeight: Typography.weights.bold,
  },
  incorrectCard: { gap: Spacing.md },
  reviewItem: {
    borderBottomWidth: Borders.hairline,
    borderBottomColor: ColorTokens.border.divider,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  reviewMeta: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.caption,
  },
  reviewQuestion: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
  },
  reviewAnswer: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
  },
  reviewDetail: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
});
