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
  Card,
  NoticeCard,
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";
import {
  ekgRhythmExamples,
  ekgRhythmSteps,
  type EkgRhythmExample,
} from "./ekgRhythmExamples";

type Props = {
  onBack: () => void;
};

function getStepValue(example: EkgRhythmExample, stepIndex: number) {
  const step = ekgRhythmSteps[stepIndex];
  return example[step.key];
}

function KeyFinding({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.findingRow}>
      <Text style={styles.findingLabel}>{label}</Text>
      <Text style={styles.findingValue}>{value}</Text>
    </View>
  );
}

export function EkgRhythmTrainerScreen({ onBack }: Props) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const example = ekgRhythmExamples[exampleIndex];
  const isSummary = stepIndex >= ekgRhythmSteps.length;
  const currentStep = isSummary ? null : ekgRhythmSteps[stepIndex];
  const progressText = isSummary
    ? "Opsummering"
    : `${stepIndex + 1} af ${ekgRhythmSteps.length}`;

  const nextExampleLabel = useMemo(() => {
    const nextIndex = (exampleIndex + 1) % ekgRhythmExamples.length;
    return ekgRhythmExamples[nextIndex].title;
  }, [exampleIndex]);

  const handleContinue = () => {
    if (!revealed) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    setStepIndex((current) => current + 1);
  };

  const handleNextExample = () => {
    setExampleIndex((current) => (current + 1) % ekgRhythmExamples.length);
    setStepIndex(0);
    setRevealed(false);
  };

  return (
    <Screen
      contentContainerStyle={styles.content}
      testID="ekg-rhythm-trainer-screen"
    >
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til EKG-træning"
        onBack={onBack}
        subtitle="Guidet rytmeanalyse uden scoring."
        title="Rytmeanalyse"
      />

      <NoticeCard title="Uddannelsestræning" tone="info" style={styles.notice}>
        <Text style={styles.noticeText}>
          Dette er træning i systematisk vurdering, ikke klinisk
          beslutningsstøtte. Sammenhold altid rytmefund med patientens tilstand.
        </Text>
      </NoticeCard>

      <Card variant="subtle" style={styles.exampleCard}>
        <View style={styles.exampleHeader}>
          <View style={styles.exampleTitleGroup}>
            <Text style={styles.eyebrow}>RYTME {exampleIndex + 1}</Text>
            <Text style={styles.exampleTitle}>{example.title}</Text>
          </View>
          <View style={styles.progressPill}>
            <Text style={styles.progressText}>{progressText}</Text>
          </View>
        </View>
        <Text style={styles.bodyText}>{example.shortDescription}</Text>
      </Card>

      {isSummary ? (
        <Card variant="subtle" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Opsummering</Text>
          <Text style={styles.summaryRhythm}>{example.likelyRhythm}</Text>

          <View style={styles.findingList}>
            <KeyFinding label="Frekvens" value={example.rateDescription} />
            <KeyFinding label="Regelmæssighed" value={example.regularity} />
            <KeyFinding label="P-takker" value={example.pWaveDescription} />
            <KeyFinding label="PR-interval" value={example.prDescription} />
            <KeyFinding label="QRS-bredde" value={example.qrsDescription} />
          </View>

          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Ambulancefaglig betydning</Text>
            <Text style={styles.bodyText}>{example.ambulanceRelevance}</Text>
          </View>

          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Typisk faldgrube</Text>
            <Text style={styles.bodyText}>{example.commonPitfall}</Text>
          </View>

          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Forklaring</Text>
            <Text style={styles.bodyText}>{example.explanation}</Text>
          </View>
        </Card>
      ) : currentStep ? (
        <Card variant="subtle" style={styles.sectionCard}>
          <Text style={styles.eyebrow}>TRIN {stepIndex + 1}</Text>
          <Text style={styles.sectionTitle}>{currentStep.title}</Text>
          <Text style={styles.bodyText}>{currentStep.prompt}</Text>

          <View style={styles.thinkBox}>
            <Text style={styles.thinkLabel}>Tænk først</Text>
            <Text style={styles.bodyText}>
              Sig din observation for dig selv, før du viser vurderingen.
            </Text>
          </View>

          {revealed ? (
            <View style={styles.revealBox}>
              <Text style={styles.revealLabel}>Vurdering</Text>
              <Text style={styles.revealText}>
                {getStepValue(example, stepIndex)}
              </Text>
            </View>
          ) : null}
        </Card>
      ) : null}

      <View style={styles.buttonStack}>
        {isSummary ? (
          <>
            <PrimaryButton
              label="Næste rytme"
              onPress={handleNextExample}
              testID="ekg-next-rhythm-button"
            />
            <Text style={styles.nextHint}>Næste: {nextExampleLabel}</Text>
          </>
        ) : (
          <PrimaryButton
            label={revealed ? "Næste trin" : "Vis vurdering"}
            onPress={handleContinue}
            testID="ekg-step-action-button"
          />
        )}
        <SecondaryButton
          label="Tilbage til EKG-træning"
          onPress={onBack}
          testID="ekg-trainer-back-button"
        />
      </View>
    </Screen>
  );
}

export default EkgRhythmTrainerScreen;

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.xl,
  },
  notice: {
    marginBottom: Spacing.md,
  },
  noticeText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  exampleCard: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  exampleHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  exampleTitleGroup: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.7,
  },
  exampleTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  progressPill: {
    minHeight: 32,
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingHorizontal: Spacing.sm,
  },
  progressText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.bold,
  },
  sectionCard: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
  },
  bodyText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  thinkBox: {
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.divider,
    backgroundColor: ColorTokens.surface.subtle,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  thinkLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  revealBox: {
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.accent.border,
    backgroundColor: ColorTokens.accent.surface,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  revealLabel: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.6,
  },
  revealText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
  },
  summaryRhythm: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
  },
  findingList: {
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
    marginTop: Spacing.xs,
  },
  findingRow: {
    gap: Spacing.xs,
    borderBottomWidth: Borders.hairline,
    borderBottomColor: ColorTokens.border.divider,
    paddingVertical: Spacing.sm,
  },
  findingLabel: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.4,
  },
  findingValue: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
  },
  summaryBlock: {
    gap: Spacing.xs,
  },
  summaryLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  buttonStack: {
    gap: Spacing.sm,
  },
  nextHint: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    textAlign: "center",
  },
});
