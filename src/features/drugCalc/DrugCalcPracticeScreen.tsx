import { StatusBar } from "expo-status-bar";
import React from "react";
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
        subtitle="Fokuseret eller blandet beregningstræning uden scoring."
        title="Træn beregninger"
      />

      <Card variant="subtle" style={styles.section}>
        <Text style={styles.sectionTitle}>Emner</Text>
        <Text style={styles.bodyText}>
          Ingen valgte emner betyder blandet træning med hele opgavebanken.
        </Text>
        <View style={styles.topicGrid}>
          {availableTopics.map((topic) => {
            const selected = selectedTopics.includes(topic.id);
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={topic.id}
                onPress={() => toggleTopic(topic.id)}
                style={({ pressed }) => [
                  styles.topicButton,
                  selected && styles.topicButtonSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.topicText, selected && styles.topicTextSelected]}>
                  {topic.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <SecondaryButton
          label={selectedTopics.length === 0 ? "Start blandet træning" : "Start med valgte emner"}
          onPress={() => onStartWithTopics(selectedTopics)}
        />
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
          <Text style={styles.bodyText}>Vælg træningsform ovenfor for at begynde.</Text>
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
  topicButton: {
    minHeight: Interaction.compactTouchTarget,
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  topicButtonSelected: {
    borderColor: ColorTokens.accent.muted,
    backgroundColor: ColorTokens.accent.surface,
  },
  topicText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
  },
  topicTextSelected: { color: ColorTokens.text.primary },
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
