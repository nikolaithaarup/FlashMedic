import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
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
  buildBloodGasTrainingDeck,
  patternOptions,
  phStatusOptions,
  primaryProcessOptions,
  valueDirectionOptions,
  type BloodGasPatternId,
  type BloodGasPhStatus,
  type BloodGasPrimaryProcess,
  type BloodGasTrainingCase,
  type BloodGasValueDirection,
} from "./bloodGasTrainingCases";

type Props = { onBack: () => void };
type DirectionAnswers = Record<string, BloodGasValueDirection>;
type FeedbackSection =
  | "reasoning"
  | "abnormalities"
  | "pitfall"
  | "ambulance"
  | "limitation";

const levelLabels: Record<BloodGasTrainingCase["level"], string> = {
  intro: "Intro",
  intermediate: "Øvet",
  advanced: "Avanceret",
};

function ChoiceGroup<T extends string>({
  label,
  options,
  selected,
  expected,
  accepted = [],
  checked,
  onSelect,
}: {
  label: string;
  options: { id: T; label: string }[];
  selected: T | null;
  expected: T;
  accepted?: T[];
  checked: boolean;
  onSelect: (id: T) => void;
}) {
  const correct =
    checked && selected !== null && [expected, ...accepted].includes(selected);
  return (
    <Card variant="subtle" style={styles.answerCard}>
      <Text style={styles.answerTitle}>{label}</Text>
      <View style={styles.optionList}>
        {options.map((option) => (
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{
              checked: selected === option.id,
              disabled: checked,
            }}
            disabled={checked}
            key={option.id}
            onPress={() => onSelect(option.id)}
            style={({ pressed }) => [
              styles.option,
              selected === option.id && styles.optionSelected,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selected === option.id && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {checked ? (
        <Text
          style={[
            styles.feedbackLabel,
            correct ? styles.correctText : styles.incorrectText,
          ]}
        >
          {correct
            ? "Det passer"
            : `Se især: ${options.find((item) => item.id === expected)?.label}`}
        </Text>
      ) : null}
    </Card>
  );
}

function FeedbackAccordion({
  id,
  title,
  expanded,
  onToggle,
  children,
}: {
  id: FeedbackSection;
  title: string;
  expanded: boolean;
  onToggle: (id: FeedbackSection) => void;
  children: React.ReactNode;
}) {
  return (
    <Card variant="subtle" style={styles.detailCard}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => onToggle(id)}
        style={({ pressed }) => [
          styles.detailHeader,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.detailTitle}>{title}</Text>
        <Text style={styles.detailIcon}>{expanded ? "−" : "+"}</Text>
      </Pressable>
      {expanded ? <View style={styles.detailContent}>{children}</View> : null}
    </Card>
  );
}

export function BloodGasValueTrainerScreen({ onBack }: Props) {
  const [deck, setDeck] = useState(() => buildBloodGasTrainingDeck());
  const [caseIndex, setCaseIndex] = useState(0);
  const [directions, setDirections] = useState<DirectionAnswers>({});
  const [phStatus, setPhStatus] = useState<BloodGasPhStatus | null>(null);
  const [primaryProcess, setPrimaryProcess] =
    useState<BloodGasPrimaryProcess | null>(null);
  const [patternId, setPatternId] = useState<BloodGasPatternId | null>(null);
  const [checked, setChecked] = useState(false);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [expandedFeedback, setExpandedFeedback] =
    useState<FeedbackSection | null>(null);

  const currentCase = deck[caseIndex];
  const resetAnswers = () => {
    setDirections({});
    setPhStatus(null);
    setPrimaryProcess(null);
    setPatternId(null);
    setChecked(false);
    setPrompt(null);
    setContextExpanded(false);
    setExpandedFeedback(null);
  };

  const checkAnswers = () => {
    if (!currentCase) return;
    const missingValues = currentCase.values.filter(
      (value) => !directions[value.analyteId],
    );
    if (missingValues.length || !phStatus || !primaryProcess || !patternId) {
      setPrompt(
        "Vurder alle værdier, og vælg et svar i de tre felter nedenfor.",
      );
      return;
    }
    setPrompt(null);
    setChecked(true);
  };

  const nextCase = () => {
    setCaseIndex((index) => index + 1);
    resetAnswers();
  };

  const restart = () => {
    setDeck(buildBloodGasTrainingDeck());
    setCaseIndex(0);
    resetAnswers();
  };

  if (!currentCase) {
    return (
      <Screen
        contentContainerStyle={styles.content}
        testID="blood-gas-value-trainer-empty"
      >
        <StatusBar style="light" />
        <ToolPageHeader
          title="Tolk en blodgas"
          subtitle="VGAS & CRP"
          onBack={onBack}
        />
        <NoticeCard
          title={deck.length ? "Runden er færdig" : "Ingen cases tilgængelige"}
          tone="info"
        >
          {deck.length
            ? "Du har gennemgået alle cases uden gentagelser i denne runde."
            : "Der er ingen lokale træningscases at vise lige nu."}
        </NoticeCard>
        {deck.length ? (
          <PrimaryButton label="Start forfra" onPress={restart} />
        ) : null}
        <SecondaryButton label="Tilbage til VGAS & CRP" onPress={onBack} />
      </Screen>
    );
  }

  return (
    <Screen
      contentContainerStyle={styles.content}
      testID="blood-gas-value-trainer-screen"
    >
      <StatusBar style="light" />
      <ToolPageHeader
        title="Tolk en blodgas"
        subtitle={`Case ${caseIndex + 1} af ${deck.length}`}
        onBack={onBack}
      />

      <NoticeCard title="Til faglig træning" tone="info"></NoticeCard>

      <Card variant="subtle" style={styles.caseCard}>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>Venøs prøve</Text>
          <Text style={styles.badge}>{levelLabels[currentCase.level]}</Text>
        </View>
        <Text style={styles.caseTitle}>{`VGAS-case ${caseIndex + 1}`}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: contextExpanded }}
          onPress={() => setContextExpanded((value) => !value)}
          style={({ pressed }) => [
            styles.contextToggle,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.contextLabel}>Kontekst</Text>
          <Text style={styles.detailIcon}>{contextExpanded ? "−" : "+"}</Text>
        </Pressable>
        {contextExpanded ? (
          <Text style={styles.bodyText}>{currentCase.clinicalContext}</Text>
        ) : null}
      </Card>

      <View style={styles.sectionGap}>
        <Text style={styles.sectionTitle}>1. Vurder værdier</Text>
        {currentCase.values.map((value) => {
          const selected = directions[value.analyteId];
          const correct =
            selected === currentCase.expected.valueDirections[value.analyteId];
          return (
            <Card
              key={value.analyteId}
              variant="subtle"
              style={styles.valueCard}
            >
              <View style={styles.valueHeader}>
                <Text style={styles.valueLabel}>{value.label}</Text>
                <Text style={styles.valueReading}>
                  {value.value} {value.unit}
                </Text>
              </View>
              <View style={styles.compactOptions}>
                {valueDirectionOptions.map((option) => (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{
                      checked: selected === option.id,
                      disabled: checked,
                    }}
                    disabled={checked}
                    key={option.id}
                    onPress={() =>
                      setDirections((answers) => ({
                        ...answers,
                        [value.analyteId]: option.id,
                      }))
                    }
                    style={({ pressed }) => [
                      styles.compactOption,
                      selected === option.id && styles.optionSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.compactOptionText,
                        selected === option.id && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {checked ? (
                <Text
                  style={[
                    styles.feedbackLabel,
                    correct ? styles.correctText : styles.incorrectText,
                  ]}
                >
                  {correct
                    ? "Korrekt retning"
                    : `Forventet: ${valueDirectionOptions.find((item) => item.id === currentCase.expected.valueDirections[value.analyteId])?.label}`}
                  {value.note ? ` · ${value.note}` : ""}
                </Text>
              ) : null}
            </Card>
          );
        })}
      </View>

      <ChoiceGroup
        label="2. pH-status"
        options={phStatusOptions}
        selected={phStatus}
        expected={currentCase.expected.phStatus}
        accepted={currentCase.acceptedAlternatives?.phStatus}
        checked={checked}
        onSelect={setPhStatus}
      />
      <ChoiceGroup
        label="3. Overvejende påvirkning"
        options={primaryProcessOptions}
        selected={primaryProcess}
        expected={currentCase.expected.primaryProcess}
        accepted={currentCase.acceptedAlternatives?.primaryProcess}
        checked={checked}
        onSelect={setPrimaryProcess}
      />
      <ChoiceGroup
        label="4. Mønsteret der passer bedst"
        options={patternOptions}
        selected={patternId}
        expected={currentCase.expected.patternId}
        accepted={currentCase.acceptedAlternatives?.patternId}
        checked={checked}
        onSelect={setPatternId}
      />

      {prompt ? (
        <NoticeCard title="Mangler svar" tone="warning">
          {prompt}
        </NoticeCard>
      ) : null}

      {!checked ? (
        <PrimaryButton
          label="Tjek svar"
          onPress={checkAnswers}
          testID="blood-gas-check-answer"
        />
      ) : null}

      {checked ? (
        <View style={styles.feedbackSection} testID="blood-gas-feedback">
          <NoticeCard title="Samlet vurdering" tone="info">
            {`Mønsteret der passer bedst: ${patternOptions.find((option) => option.id === currentCase.expected.patternId)?.label}. ${currentCase.keyAbnormalities.join(" · ")}. ${currentCase.limitation}`}
          </NoticeCard>
          <FeedbackAccordion
            id="reasoning"
            title="Se begrundelse"
            expanded={expandedFeedback === "reasoning"}
            onToggle={(id) =>
              setExpandedFeedback((value) => (value === id ? null : id))
            }
          >
            {currentCase.reasoning.map((item) => (
              <Text key={item} style={styles.bodyText}>
                • {item}
              </Text>
            ))}
          </FeedbackAccordion>
          <FeedbackAccordion
            id="abnormalities"
            title="Nøgleafvigelser"
            expanded={expandedFeedback === "abnormalities"}
            onToggle={(id) =>
              setExpandedFeedback((value) => (value === id ? null : id))
            }
          >
            {currentCase.keyAbnormalities.map((item) => (
              <Text key={item} style={styles.bodyText}>
                • {item}
              </Text>
            ))}
          </FeedbackAccordion>
          <FeedbackAccordion
            id="pitfall"
            title="Typisk faldgrube"
            expanded={expandedFeedback === "pitfall"}
            onToggle={(id) =>
              setExpandedFeedback((value) => (value === id ? null : id))
            }
          >
            <Text style={styles.bodyText}>{currentCase.commonPitfall}</Text>
          </FeedbackAccordion>
          <FeedbackAccordion
            id="ambulance"
            title="Ambulancefokus"
            expanded={expandedFeedback === "ambulance"}
            onToggle={(id) =>
              setExpandedFeedback((value) => (value === id ? null : id))
            }
          >
            <Text style={styles.bodyText}>
              {currentCase.prehospitalRelevance}
            </Text>
          </FeedbackAccordion>
          <FeedbackAccordion
            id="limitation"
            title="Begrænsning"
            expanded={expandedFeedback === "limitation"}
            onToggle={(id) =>
              setExpandedFeedback((value) => (value === id ? null : id))
            }
          >
            <Text style={styles.bodyText}>{currentCase.limitation}</Text>
          </FeedbackAccordion>
          <PrimaryButton
            label={
              caseIndex === deck.length - 1 ? "Afslut runde" : "Næste case"
            }
            onPress={nextCase}
          />
        </View>
      ) : null}

      <SecondaryButton label="Tilbage til VGAS & CRP" onPress={onBack} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.sm, paddingBottom: Spacing.xl },
  caseCard: { gap: Spacing.xs, padding: Spacing.sm },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  badge: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.bold,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.accent.border,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  caseTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
  },
  bodyText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
  },
  sectionGap: { gap: Spacing.sm },
  sectionTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  valueCard: { gap: Spacing.sm, padding: Spacing.sm },
  valueHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  valueLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
  },
  valueReading: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.semibold,
  },
  contextToggle: {
    minHeight: Interaction.compactTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contextLabel: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  compactOptions: { flexDirection: "row", gap: 4 },
  compactOption: {
    flex: 1,
    minWidth: 0,
    minHeight: Interaction.compactTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radii.sm,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingHorizontal: 4,
    paddingVertical: Spacing.xs,
  },
  compactOptionText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.semibold,
  },
  answerCard: { gap: Spacing.xs, padding: Spacing.sm },
  answerTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
  },
  optionList: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  option: {
    minHeight: Interaction.compactTouchTarget,
    flexGrow: 1,
    flexBasis: "46%",
    justifyContent: "center",
    borderRadius: Radii.sm,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  optionSelected: {
    borderColor: ColorTokens.interaction.selectedBorder,
    backgroundColor: ColorTokens.interaction.selected,
  },
  optionText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.medium,
  },
  optionTextSelected: {
    color: ColorTokens.text.onAccent,
    fontWeight: Typography.weights.bold,
  },
  feedbackLabel: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  correctText: { color: ColorTokens.semantic.success },
  incorrectText: { color: ColorTokens.semantic.warning },
  feedbackSection: { gap: Spacing.xs },
  detailCard: { padding: 0, overflow: "hidden" },
  detailHeader: {
    minHeight: Interaction.compactTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.sm,
  },
  detailTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  detailIcon: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
  },
  detailContent: {
    gap: Spacing.xs,
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
    padding: Spacing.sm,
  },
  pressed: { opacity: Interaction.pressedOpacity },
});
