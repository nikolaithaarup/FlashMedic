import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import {
  Accordion,
  Chip,
  NumberInput,
  PrimaryButton,
  ResultRow,
  ResultSummary,
  Screen,
  SecondaryButton,
  Surface,
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
  const [feedbackExpanded, setFeedbackExpanded] = useState(false);
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

      <Accordion
        expanded={topicsExpanded}
        onToggle={() => setTopicsExpanded((current) => !current)}
        style={styles.section}
        subtitle={selectionSummary}
        title="Du træner"
      >
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
      </Accordion>

      {currentDrugQuestion ? (
        <>
          <Surface elevated tone="elevated" style={styles.section}>
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
          </Surface>

          {feedbackVisible ? (
            <ResultSummary
              message={
                drugAnswerStatus === "correct"
                  ? "Din beregning ligger inden for det accepterede svarinterval."
                  : "Sammenlign dit svar med facit, og gennemgå beregningen."
              }
              style={styles.section}
              title={
                drugAnswerStatus === "correct"
                  ? "Korrekt beregnet"
                  : "Gennemgå beregningen"
              }
              tone={drugAnswerStatus === "correct" ? "success" : "danger"}
              value={`${formatDrugAnswer(currentDrugQuestion)} ${currentDrugQuestion.unit}`}
            >
              <ResultRow label="Formel" value={currentDrugQuestion.formula} />
              <ResultRow
                label="Afrunding"
                last
                value={currentDrugQuestion.roundingNote}
              />
              <Accordion
                expanded={feedbackExpanded}
                onToggle={() => setFeedbackExpanded((current) => !current)}
                style={styles.feedbackDetails}
                subtitle="Mellemregning, forklaring og kontrol"
                title="Se hele gennemgangen"
              >
                <View style={styles.feedbackContent}>
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
                </View>
              </Accordion>
            </ResultSummary>
          ) : null}

          {feedbackVisible ? (
            <View style={styles.buttonStack}>
              <PrimaryButton
                label="Næste opgave"
                onPress={() => {
                  setFeedbackExpanded(false);
                  onNextQuestion();
                }}
              />
              <SecondaryButton label="Tilbage til Lægemiddelregning" onPress={onBack} />
            </View>
          ) : null}
        </>
      ) : (
        <Surface style={styles.section}>
          <Text style={styles.bodyText}>Vælg emner, og start træningen.</Text>
        </Surface>
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
  changeHint: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
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
  feedbackDetails: { marginTop: Spacing.md },
  buttonStack: { gap: Spacing.sm },
});
