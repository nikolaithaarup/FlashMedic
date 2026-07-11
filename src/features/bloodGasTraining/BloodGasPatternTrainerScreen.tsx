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
  buildBloodGasPatternTrainingDeck,
  type BloodGasPatternTrainingCase,
} from "./bloodGasPatternTrainingCases";
import {
  valueDirectionOptions,
  type BloodGasValueDirection,
} from "./bloodGasTrainingCases";

type Props = { onBack: () => void };
type FeedbackSection = "learning" | "pitfall" | "ambulance" | "limitation";
const choices = valueDirectionOptions.filter(
  (option) => option.id !== "not-assessed",
);
const labels = Object.fromEntries(
  valueDirectionOptions.map((option) => [option.id, option.label]),
) as Record<BloodGasValueDirection, string>;
const levelLabels: Record<BloodGasPatternTrainingCase["level"], string> = {
  intro: "Intro",
  intermediate: "Øvet",
  advanced: "Avanceret",
};

function Detail({
  title,
  expanded,
  onPress,
  children,
}: {
  title: string;
  expanded: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card variant="subtle" style={styles.detailCard}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onPress}
        style={({ pressed }) => [
          styles.detailHeader,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.detailTitle}>{title}</Text>
        <Text style={styles.icon}>{expanded ? "−" : "+"}</Text>
      </Pressable>
      {expanded ? (
        <View style={styles.detailContent}>
          <Text style={styles.body}>{children}</Text>
        </View>
      ) : null}
    </Card>
  );
}

export function BloodGasPatternTrainerScreen({ onBack }: Props) {
  const [deck, setDeck] = useState(() => buildBloodGasPatternTrainingDeck());
  const [caseIndex, setCaseIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, BloodGasValueDirection>
  >({});
  const [checked, setChecked] = useState(false);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<FeedbackSection | null>(null);
  const currentCase = deck[caseIndex];

  const reset = () => {
    setAnswers({});
    setChecked(false);
    setPrompt(null);
    setExpanded(null);
  };
  const restart = () => {
    setDeck(buildBloodGasPatternTrainingDeck());
    setCaseIndex(0);
    reset();
  };
  const check = () => {
    if (!currentCase) return;
    const missing = currentCase.valuesToPredict.filter(
      (item) => !answers[item.analyteId],
    );
    if (missing.length) {
      setPrompt(
        `Vælg en retning for alle værdier. Der mangler ${missing.length}.`,
      );
      return;
    }
    setPrompt(null);
    setChecked(true);
  };
  const isCorrect = (analyteId: string, expected: BloodGasValueDirection) =>
    answers[analyteId] === expected ||
    (currentCase?.acceptedAlternatives?.[analyteId] ?? []).includes(
      answers[analyteId],
    );

  if (!currentCase)
    return (
      <Screen
        contentContainerStyle={styles.content}
        testID="blood-gas-pattern-trainer-empty"
      >
        <StatusBar style="light" />
        <ToolPageHeader
          title="Forudsig værdier"
          subtitle="VGAS & CRP"
          onBack={onBack}
        />
        <NoticeCard
          title={deck.length ? "Runden er færdig" : "Ingen cases tilgængelige"}
          tone="info"
        >
          {deck.length
            ? "Du har gennemgået alle cases uden gentagelser i denne runde."
            : "Der er ingen lokale mønstercases at vise lige nu."}
        </NoticeCard>
        {deck.length ? (
          <PrimaryButton
            label="Start forfra"
            onPress={restart}
            testID="restart-blood-gas-pattern-trainer"
          />
        ) : null}
        <SecondaryButton label="Tilbage til VGAS & CRP" onPress={onBack} />
      </Screen>
    );

  const correctCount = currentCase.valuesToPredict.filter((item) =>
    isCorrect(item.analyteId, item.expectedDirection),
  ).length;
  return (
    <Screen
      contentContainerStyle={styles.content}
      testID="blood-gas-pattern-trainer-screen"
    >
      <StatusBar style="light" />
      <ToolPageHeader
        title="Forudsig værdier"
        subtitle={`Case ${caseIndex + 1} af ${deck.length}`}
        onBack={onBack}
      />
      <NoticeCard title="Til faglig træning" tone="info">
        Brug resultatet som træning og ikke som grundlag for patientbehandling.
      </NoticeCard>
      <Card variant="subtle" style={styles.caseCard}>
        <View style={styles.badges}>
          <Text style={styles.badge}>
            {currentCase.neutralTitle} {caseIndex + 1}
          </Text>
          <Text style={styles.badge}>{levelLabels[currentCase.level]}</Text>
        </View>
        <Text style={styles.title}>{currentCase.scenario}</Text>
        <Text style={styles.body}>{currentCase.taskPrompt}</Text>
      </Card>
      <View style={styles.list}>
        {currentCase.valuesToPredict.map((item) => {
          const selected = answers[item.analyteId];
          const correct =
            checked && isCorrect(item.analyteId, item.expectedDirection);
          return (
            <Card
              key={item.analyteId}
              variant="subtle"
              style={styles.valueCard}
            >
              <View style={styles.valueHeader}>
                <Text style={styles.valueLabel}>{item.label}</Text>
                <Text style={styles.unit}>{item.unit}</Text>
              </View>
              <View style={styles.options}>
                {choices.map((option) => (
                  <Pressable
                    key={option.id}
                    accessibilityRole="radio"
                    accessibilityLabel={`${item.label}: ${option.label}`}
                    accessibilityState={{
                      checked: selected === option.id,
                      disabled: checked,
                    }}
                    disabled={checked}
                    onPress={() =>
                      setAnswers((old) => ({
                        ...old,
                        [item.analyteId]: option.id,
                      }))
                    }
                    style={({ pressed }) => [
                      styles.option,
                      selected === option.id && styles.selected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected === option.id && styles.selectedText,
                      ]}
                    >
                      {selected === option.id
                        ? `✓ ${option.label}`
                        : option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {checked ? (
                <View style={styles.rowFeedback}>
                  <Text
                    style={[
                      styles.feedback,
                      correct ? styles.correct : styles.incorrect,
                    ]}
                  >
                    {correct
                      ? "Korrekt"
                      : `Ikke helt · forventet: ${labels[item.expectedDirection]}`}
                  </Text>
                  {currentCase.acceptedAlternatives?.[item.analyteId]
                    ?.length ? (
                    <Text style={styles.alternatives}>
                      {currentCase.acceptedAlternatives[item.analyteId]
                        .map(
                          (direction) =>
                            `${labels[direction]} kan også være rimeligt i denne case.`,
                        )
                        .join(" ")}
                    </Text>
                  ) : null}
                  <Text style={styles.body}>{item.explanation}</Text>
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>
      {prompt ? (
        <NoticeCard title="Mangler svar" tone="warning">
          {prompt}
        </NoticeCard>
      ) : null}
      {!checked ? (
        <PrimaryButton
          label="Tjek svar"
          onPress={check}
          testID="blood-gas-pattern-check-answer"
        />
      ) : (
        <View style={styles.list} testID="blood-gas-pattern-feedback">
          <NoticeCard
            title="Kort feedback"
            tone="info"
          >{`Du vurderede ${correctCount} af ${currentCase.valuesToPredict.length} værdier korrekt. Resultatet gemmes ikke.`}</NoticeCard>
          <Detail
            title="Forklaring"
            expanded={expanded === "learning"}
            onPress={() =>
              setExpanded(expanded === "learning" ? null : "learning")
            }
          >
            {currentCase.keyLearningPoint}
          </Detail>
          <Detail
            title="Faldgrube"
            expanded={expanded === "pitfall"}
            onPress={() =>
              setExpanded(expanded === "pitfall" ? null : "pitfall")
            }
          >
            {currentCase.commonPitfall}
          </Detail>
          <Detail
            title="Ambulancefokus"
            expanded={expanded === "ambulance"}
            onPress={() =>
              setExpanded(expanded === "ambulance" ? null : "ambulance")
            }
          >
            {currentCase.prehospitalRelevance}
          </Detail>
          <Detail
            title="Begrænsning"
            expanded={expanded === "limitation"}
            onPress={() =>
              setExpanded(expanded === "limitation" ? null : "limitation")
            }
          >
            {currentCase.limitation}
          </Detail>
          <PrimaryButton
            label={
              caseIndex === deck.length - 1 ? "Afslut runde" : "Næste case"
            }
            onPress={() => {
              setCaseIndex((index) => index + 1);
              reset();
            }}
            testID="next-blood-gas-pattern-case"
          />
        </View>
      )}
      <SecondaryButton label="Tilbage til VGAS & CRP" onPress={onBack} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.sm, paddingBottom: Spacing.xl },
  list: { gap: Spacing.xs },
  caseCard: { gap: Spacing.xs, padding: Spacing.sm },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  badge: {
    color: ColorTokens.accent.muted,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.accent.border,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
  },
  title: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  body: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
  },
  valueCard: { gap: Spacing.xs, padding: Spacing.sm },
  valueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: Spacing.sm,
  },
  valueLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
  },
  unit: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
  },
  options: { flexDirection: "row", gap: 4 },
  option: {
    flex: 1,
    minWidth: 0,
    minHeight: Interaction.compactTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radii.sm,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingHorizontal: 2,
  },
  selected: {
    borderColor: ColorTokens.interaction.selectedBorder,
    backgroundColor: ColorTokens.interaction.selected,
  },
  optionText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    textAlign: "center",
  },
  selectedText: {
    color: ColorTokens.text.onAccent,
    fontWeight: Typography.weights.bold,
  },
  rowFeedback: { gap: 2 },
  feedback: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.bold,
  },
  correct: { color: ColorTokens.semantic.success },
  incorrect: { color: ColorTokens.semantic.warning },
  alternatives: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
  },
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
    fontWeight: Typography.weights.bold,
  },
  icon: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.sectionTitle,
  },
  detailContent: {
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
    padding: Spacing.sm,
  },
  pressed: { opacity: Interaction.pressedOpacity },
});
