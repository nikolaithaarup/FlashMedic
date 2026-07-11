import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
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
import {
  Card,
  Chip,
  NumberInput,
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";
import {
  formatDrugAnswer,
  type DrugCalcQuestion,
  type DrugCalcTopic,
} from "./drugCalcContent";

type TopicMeta = { id: DrugCalcTopic; title: string; desc: string };

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  currentDrugQuestion: DrugCalcQuestion | null;
  drugAnswer: string;
  setDrugAnswer: (value: string) => void;
  drugAnswerStatus: "neutral" | "correct" | "incorrect";
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onBack: () => void;
  availableTopics: TopicMeta[];
  selectedTopics: DrugCalcTopic[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<DrugCalcTopic[]>>;
  onStartWithTopics: (topics: DrugCalcTopic[]) => void;
};

function DetailBlock({ label, children }: { label: string; children: string }) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.bodyText}>{children}</Text>
    </View>
  );
}

export function DrugCalcPracticeScreen({
  currentDrugQuestion,
  drugAnswer,
  setDrugAnswer,
  drugAnswerStatus,
  onCheckAnswer,
  onNextQuestion,
  onBack,
  availableTopics,
  selectedTopics,
  setSelectedTopics,
  onStartWithTopics,
}: Props) {
  const hasStarted = currentDrugQuestion !== null;
  const feedbackVisible = drugAnswerStatus !== "neutral" && currentDrugQuestion;
  const [topicsExpanded, setTopicsExpanded] = useState(false);
  const selectionSummary = useMemo(() => {
    if (selectedTopics.length === 0) return "Alle emner";
    if (selectedTopics.length === 1) {
      return (
        availableTopics.find((topic) => topic.id === selectedTopics[0])?.title ??
        "1 emne valgt"
      );
    }
    return `${selectedTopics.length} emner valgt`;
  }, [availableTopics, selectedTopics]);

  const toggleTopic = (id: DrugCalcTopic) => {
    setSelectedTopics((current) =>
      current.includes(id)
        ? current.filter((topic) => topic !== id)
        : [...current, id],
    );
  };

  return (
    <Screen
      contentContainerStyle={styles.content}
      scrollViewProps={{ keyboardShouldPersistTaps: "handled" }}
      testID="drug-calc-practice-screen"
    >
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til Lægemiddelregning"
        onBack={onBack}
        subtitle="Træn ét eller flere regneemner."
        title="Træn beregninger"
      />

      <Card variant="subtle" style={styles.section}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: topicsExpanded }}
          onPress={() => setTopicsExpanded((current) => !current)}
          style={({ pressed }) => [styles.selectorHeader, pressed && styles.pressed]}
        >
          <View style={styles.selectorText}>
            <Text style={styles.selectorTitle}>Du træner</Text>
            <Text style={styles.selectorSummary}>{selectionSummary}</Text>
          </View>
          <Text style={styles.selectorAction}>
            {topicsExpanded ? "Skjul −" : "Skift emner +"}
          </Text>
        </Pressable>
        {topicsExpanded ? (
          <>
            <View style={styles.topicGrid}>
              {availableTopics.map((topic) => (
                <Chip
                  key={topic.id}
                  label={topic.title}
                  onPress={() => toggleTopic(topic.id)}
                  selected={selectedTopics.includes(topic.id)}
                />
              ))}
            </View>
            {hasStarted ? (
              <Text style={styles.changeHint}>Ændringer gælder næste opgave.</Text>
            ) : (
              <SecondaryButton
                label={selectedTopics.length === 0 ? "Start blandet træning" : "Træn valgte emner"}
                onPress={() => onStartWithTopics(selectedTopics)}
              />
            )}
          </>
        ) : null}
      </Card>

      {currentDrugQuestion ? (
        <>
          <Card variant="subtle" style={styles.section}>
            <Text style={styles.eyebrow}>OPGAVE</Text>
            <Text style={styles.questionText}>{currentDrugQuestion.text}</Text>

            <View style={styles.unitCallout}>
              <Text style={styles.unitLabel}>SVARENHED</Text>
              <Text style={styles.unitValue}>{currentDrugQuestion.unit}</Text>
            </View>

            {currentDrugQuestion.hint ? (
              <DetailBlock label="Hjælp">{currentDrugQuestion.hint}</DetailBlock>
            ) : null}

            <NumberInput
              clearable
              helperText={currentDrugQuestion.roundingNote}
              inputProps={{ placeholder: "Skriv kun tallet" }}
              label={`Dit svar i ${currentDrugQuestion.unit}`}
              onChangeText={setDrugAnswer}
              unit={currentDrugQuestion.unit}
              value={drugAnswer}
            />

            <PrimaryButton
              disabled={!hasStarted || drugAnswer.trim().length === 0}
              label="Tjek svar"
              onPress={onCheckAnswer}
            />
          </Card>

          {feedbackVisible ? (
            <Card
              variant="subtle"
              style={[
                styles.section,
                styles.feedbackCard,
                drugAnswerStatus === "correct"
                  ? styles.feedbackCorrect
                  : styles.feedbackIncorrect,
              ]}
            >
              <View style={styles.feedbackContent}>
                <Text
                  style={[
                    styles.feedbackTitle,
                    drugAnswerStatus === "correct"
                      ? styles.feedbackTitleCorrect
                      : styles.feedbackTitleIncorrect,
                  ]}
                >
                  {drugAnswerStatus === "correct"
                    ? "Korrekt beregnet"
                    : "Gennemgå beregningen"}
                </Text>
                <Text style={styles.feedbackAnswer}>
                  Korrekt svar: {formatDrugAnswer(currentDrugQuestion)} {currentDrugQuestion.unit}
                </Text>
                <DetailBlock label="Formel">{currentDrugQuestion.formula}</DetailBlock>
                <View style={styles.detailBlock}>
                  <Text style={styles.detailLabel}>Beregning trin for trin</Text>
                  {currentDrugQuestion.calculationSteps.map((step, index) => (
                    <Text key={`${step}-${index}`} style={styles.bodyText}>
                      {index + 1}. {step}
                    </Text>
                  ))}
                </View>
                <DetailBlock label="Forklaring">
                  {currentDrugQuestion.explanation}
                </DetailBlock>
                <DetailBlock label="Typisk faldgrube">
                  {currentDrugQuestion.commonPitfall}
                </DetailBlock>
                <DetailBlock label="Plausibilitetskontrol">
                  {currentDrugQuestion.plausibilityCheck}
                </DetailBlock>
                <DetailBlock label="Afrunding">
                  {currentDrugQuestion.roundingNote}
                </DetailBlock>
              </View>
            </Card>
          ) : null}

          {feedbackVisible ? (
            <View style={styles.buttonStack}>
              <PrimaryButton label="Næste opgave" onPress={onNextQuestion} />
              <SecondaryButton label="Tilbage til Lægemiddelregning" onPress={onBack} />
            </View>
          ) : null}
        </>
      ) : (
        <Card variant="subtle" style={styles.section}>
          <Text style={styles.bodyText}>Vælg emner, og start træningen.</Text>
        </Card>
      )}
    </Screen>
  );
}

export default DrugCalcPracticeScreen;

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xxl },
  section: { gap: Spacing.md, marginBottom: Spacing.md },
  eyebrow: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
  },
  sectionTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
  },
  questionText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.semibold,
  },
  bodyText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  topicGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  selectorHeader: {
    minHeight: Interaction.minimumTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  selectorText: { flex: 1, gap: Spacing.xs },
  selectorTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
  },
  selectorSummary: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  selectorAction: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  changeHint: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  pressed: { opacity: Interaction.pressedOpacity },
  unitCallout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.accent.border,
    backgroundColor: ColorTokens.accent.surface,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  unitLabel: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
  },
  unitValue: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  detailBlock: { gap: Spacing.xs },
  detailLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  feedbackContent: { gap: Spacing.md },
  feedbackCard: { borderWidth: Borders.emphasized },
  feedbackCorrect: { borderColor: SemanticStates.success.foreground },
  feedbackIncorrect: { borderColor: SemanticStates.danger.foreground },
  feedbackTitle: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  feedbackTitleCorrect: { color: SemanticStates.success.foreground },
  feedbackTitleIncorrect: { color: SemanticStates.danger.foreground },
  feedbackAnswer: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  buttonStack: { gap: Spacing.sm },
});
