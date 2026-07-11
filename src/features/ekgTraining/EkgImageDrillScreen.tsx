import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  SemanticStates,
  Spacing,
  Typography,
} from "../../../constants/theme";
import { ekgImageLookup } from "../../data/ekg/imageLookup";
import type { Flashcard } from "../../types/Flashcard";
import {
  Card,
  EmptyState,
  NoticeCard,
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";
import FullscreenEkgImageModal from "../flashcards/components/FullscreenEkgImageModal";
import {
  ekgAssessmentStepOrder,
  ekgStepLabels,
  ekgStepOptions,
  getEkgStepOptionLabel,
  type EkgAssessmentStep,
  type EkgInteractiveAssessment,
} from "./ekgInteractiveAssessments";
import { selectEkgInteractiveImageDrillCards } from "./ekgImageDrills";

type Props = {
  cards: Flashcard[];
  loadingCards: boolean;
  onBack: () => void;
};

type AnswerMap = Partial<Record<EkgAssessmentStep, string>>;

type StepCardProps = {
  stepName: EkgAssessmentStep;
  assessment: EkgInteractiveAssessment;
  selectedOptionId?: string;
  checked: boolean;
  expanded: boolean;
  onSelect: (stepName: EkgAssessmentStep, optionId: string) => void;
  onToggle: (stepName: EkgAssessmentStep) => void;
};

function makeDeckSeed() {
  return `${Date.now()}-${Math.random()}`;
}

function StepCard({
  stepName,
  assessment,
  selectedOptionId,
  checked,
  expanded,
  onSelect,
  onToggle,
}: StepCardProps) {
  const stepAssessment = assessment.steps[stepName];
  const correct = selectedOptionId === stepAssessment.correctOptionId;
  const missing = !selectedOptionId;
  const statusLabel = checked
    ? correct
      ? "Rigtig"
      : "Tjek"
    : selectedOptionId
      ? "Valgt"
      : "Åbn";

  return (
    <Card variant="subtle" style={styles.stepCard}>
      <Pressable
        accessibilityHint={
          expanded ? "Skjul svarmuligheder" : "Vis svarmuligheder"
        }
        accessibilityLabel={`${ekgStepLabels[stepName]}. ${
          selectedOptionId
            ? getEkgStepOptionLabel(stepName, selectedOptionId)
            : "Intet valg endnu"
        }`}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => onToggle(stepName)}
        style={({ pressed }) => [
          styles.stepHeader,
          pressed && styles.stepHeaderPressed,
        ]}
      >
        <View style={styles.stepHeaderCopy}>
          <Text style={styles.eyebrow}>{ekgStepLabels[stepName]}</Text>
          <Text style={styles.selectedText}>
            {selectedOptionId
              ? getEkgStepOptionLabel(stepName, selectedOptionId)
              : "Vælg observation"}
          </Text>
        </View>
        <View
          style={[
            styles.feedbackBadge,
            checked
              ? correct
                ? styles.correctBadge
                : styles.incorrectBadge
              : selectedOptionId
                ? styles.selectedBadge
                : styles.neutralBadge,
          ]}
        >
          <Text style={styles.feedbackBadgeText}>{statusLabel}</Text>
        </View>
        <Text style={styles.expandIcon} accessibilityElementsHidden>
          {expanded ? "⌃" : "⌄"}
        </Text>
      </Pressable>

      {expanded ? (
        <>
          <View style={styles.optionGrid}>
            {ekgStepOptions[stepName].map((option) => {
              const selected = selectedOptionId === option.id;
              const isCorrectOption =
                checked && option.id === stepAssessment.correctOptionId;
              const isWrongSelected = checked && selected && !isCorrectOption;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  disabled={checked}
                  key={option.id}
                  onPress={() => onSelect(stepName, option.id)}
                  style={({ pressed }) => [
                    styles.optionButton,
                    selected && styles.optionSelected,
                    isCorrectOption && styles.optionCorrect,
                    isWrongSelected && styles.optionIncorrect,
                    pressed && !checked && styles.optionPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      (selected || isCorrectOption || isWrongSelected) &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {checked ? (
            <View
              style={[
                styles.feedbackBox,
                correct ? styles.feedbackBoxCorrect : styles.feedbackBoxIncorrect,
              ]}
            >
              <Text style={styles.feedbackTitle}>
                {correct
                  ? "Korrekt observation"
                  : missing
                    ? "Intet valg angivet"
                    : "Andet svar end vurderingen"}
              </Text>
              <Text style={styles.feedbackText}>
                Korrekt svar:{" "}
                {getEkgStepOptionLabel(stepName, stepAssessment.correctOptionId)}
              </Text>
              <Text style={styles.feedbackText}>{stepAssessment.explanation}</Text>
            </View>
          ) : null}
        </>
      ) : null}
    </Card>
  );
}

function BulletText({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bullet} />
      <Text style={styles.bodyText}>{children}</Text>
    </View>
  );
}

export function EkgImageDrillScreen({ cards, loadingCards, onBack }: Props) {
  const { width } = useWindowDimensions();
  const [deckSeed, setDeckSeed] = useState(makeDeckSeed);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [checked, setChecked] = useState(false);
  const [expandedStep, setExpandedStep] = useState<EkgAssessmentStep | null>(
    null,
  );
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const deck = useMemo(
    () =>
      selectEkgInteractiveImageDrillCards(cards, {
        imageLookup: ekgImageLookup,
        seed: deckSeed,
      }),
    [cards, deckSeed],
  );

  const currentCard = currentIndex < deck.length ? deck[currentIndex] : null;
  const assessment = currentCard?.interactiveAssessment ?? null;
  const imageHeight = Math.min(280, Math.max(170, width * 0.52));
  const isComplete = deck.length > 0 && currentIndex >= deck.length;
  const answeredCount = ekgAssessmentStepOrder.filter((stepName) =>
    Boolean(answers[stepName]),
  ).length;
  const correctCount =
    assessment && checked
      ? ekgAssessmentStepOrder.filter(
          (stepName) =>
            answers[stepName] === assessment.steps[stepName].correctOptionId,
        ).length
      : 0;

  const updateAnswer = (stepName: EkgAssessmentStep, optionId: string) => {
    setAnswers((current) => ({ ...current, [stepName]: optionId }));
    const currentStepIndex = ekgAssessmentStepOrder.indexOf(stepName);
    setExpandedStep(ekgAssessmentStepOrder[currentStepIndex + 1] ?? null);
  };

  const toggleStep = (stepName: EkgAssessmentStep) => {
    setExpandedStep((current) => (current === stepName ? null : stepName));
  };

  const resetItemState = () => {
    setAnswers({});
    setChecked(false);
    setExpandedStep(null);
    setImageModalVisible(false);
  };

  const restartSameOrder = () => {
    setCurrentIndex(0);
    resetItemState();
  };

  const reshuffle = () => {
    setDeckSeed(makeDeckSeed());
    setCurrentIndex(0);
    resetItemState();
  };

  const goNext = () => {
    setCurrentIndex((index) => index + 1);
    resetItemState();
  };

  return (
    <>
      <Screen
        contentContainerStyle={styles.content}
        testID="ekg-image-drill-screen"
      >
        <StatusBar style="light" />
        <ToolPageHeader
          backLabel="Tilbage til EKG-træning"
          onBack={onBack}
          subtitle="Vurder rytmen systematisk ud fra EKG-billedet."
          title="EKG-billedtræning"
        />

        <NoticeCard title="Træn rytmetolkning" tone="info" style={styles.notice}>
          <Text style={styles.noticeText}>
            Vurder billedet trin for trin. Feedback vises først, når du tjekker
            svaret.
          </Text>
        </NoticeCard>

        {loadingCards ? (
          <Card variant="subtle" style={styles.sectionCard}>
            <EmptyState
              message="EKG-billederne hentes."
              title="Indlæser EKG-billeder"
            />
          </Card>
        ) : deck.length === 0 ? (
          <Card variant="subtle" style={styles.sectionCard}>
            <EmptyState
              message="Der er ingen EKG-billeder tilgængelige i billedtræningen lige nu."
              title="Ingen EKG-billeder klar"
            />
            <SecondaryButton label="Tilbage til EKG-træning" onPress={onBack} />
          </Card>
        ) : isComplete ? (
          <Card variant="subtle" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Runden er færdig</Text>
            <Text style={styles.bodyText}>
              Du har været gennem alle {deck.length} interaktive EKG-billeder i
              denne blanding.
            </Text>
            <PrimaryButton label="Bland igen" onPress={reshuffle} />
            <SecondaryButton label="Start forfra" onPress={restartSameOrder} />
            <SecondaryButton label="Tilbage til EKG-træning" onPress={onBack} />
          </Card>
        ) : currentCard && assessment ? (
          <>
            <Card variant="subtle" style={styles.imageCard}>
              <View style={styles.imageHeader}>
                <View style={styles.imageHeaderCopy}>
                  <Text style={styles.eyebrow}>
                    BILLEDE {currentIndex + 1} AF {deck.length}
                  </Text>
                  <Text style={styles.sectionTitle}>
                    Rytmecase {currentIndex + 1}
                  </Text>
                  <Text style={styles.bodyText}>
                    Vurder rytmen ud fra billedet og observationerne nedenfor.
                  </Text>
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {currentIndex + 1}/{deck.length}
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityLabel="Åbn EKG-billede i fuld skærm"
                accessibilityRole="button"
                onPress={() => setImageModalVisible(true)}
                style={({ pressed }) => [
                  styles.imageButton,
                  pressed && styles.imagePressed,
                ]}
              >
                <Image
                  resizeMode="contain"
                  source={currentCard.image as any}
                  style={[styles.ekgImage, { height: imageHeight }]}
                />
                <Text style={styles.imageHint}>Tryk for at åbne billedet</Text>
              </Pressable>
            </Card>

            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                {checked
                  ? `${correctCount} af ${ekgAssessmentStepOrder.length} rigtige`
                  : `${answeredCount} af ${ekgAssessmentStepOrder.length} valgt`}
              </Text>
            </View>

            {ekgAssessmentStepOrder.map((stepName) => (
              <StepCard
                assessment={assessment}
                checked={checked}
                expanded={expandedStep === stepName}
                key={stepName}
                onSelect={updateAnswer}
                onToggle={toggleStep}
                selectedOptionId={answers[stepName]}
                stepName={stepName}
              />
            ))}

            {checked ? (
              <Card variant="subtle" style={styles.summaryCard}>
                <Text style={styles.sectionTitle}>Opsummering</Text>
                <Text style={styles.summaryScore}>
                  {correctCount} af {ekgAssessmentStepOrder.length} rigtige
                </Text>
                <Text style={styles.summaryRhythm}>
                  Rytmen passer bedst med: {assessment.rhythmName}
                </Text>

                <View style={styles.summaryBlock}>
                  <Text style={styles.summaryLabel}>Nøglefund</Text>
                  <View style={styles.bulletList}>
                    {assessment.keyFindings.map((finding) => (
                      <BulletText key={finding}>{finding}</BulletText>
                    ))}
                  </View>
                </View>

                {assessment.commonPitfall ? (
                  <View style={styles.summaryBlock}>
                    <Text style={styles.summaryLabel}>Typisk faldgrube</Text>
                    <Text style={styles.bodyText}>{assessment.commonPitfall}</Text>
                  </View>
                ) : null}

                <View style={styles.summaryBlock}>
                  <Text style={styles.summaryLabel}>Ambulancefaglig relevans</Text>
                  <Text style={styles.bodyText}>
                    {assessment.ambulanceRelevance}
                  </Text>
                </View>

                {assessment.sourceNote ? (
                  <Text style={styles.sourceNote}>{assessment.sourceNote}</Text>
                ) : null}
              </Card>
            ) : null}

            <View style={styles.buttonStack}>
              {checked ? (
                <PrimaryButton label="Næste billede" onPress={goNext} />
              ) : (
                <PrimaryButton label="Tjek svar" onPress={() => setChecked(true)} />
              )}
              <SecondaryButton label="Bland igen" onPress={reshuffle} />
              <SecondaryButton label="Tilbage til EKG-træning" onPress={onBack} />
            </View>
          </>
        ) : null}
      </Screen>

      {currentCard ? (
        <FullscreenEkgImageModal
          imageSource={currentCard.image}
          onClose={() => setImageModalVisible(false)}
          rotate={currentCard.imageOrientation === "rotate-90"}
          visible={imageModalVisible}
        />
      ) : null}
    </>
  );
}

export default EkgImageDrillScreen;

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
  sectionCard: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  imageCard: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  imageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  imageHeaderCopy: {
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
  countBadge: {
    minHeight: 34,
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingHorizontal: Spacing.sm,
  },
  countBadgeText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.bold,
  },
  imageButton: {
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.divider,
    backgroundColor: ColorTokens.surface.inverse,
    overflow: "hidden",
  },
  imagePressed: {
    opacity: Interaction.pressedOpacity,
  },
  ekgImage: {
    width: "100%",
    backgroundColor: ColorTokens.surface.inverse,
  },
  imageHint: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    textAlign: "center",
  },
  progressRow: {
    minHeight: 40,
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  progressText: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
    textAlign: "center",
  },
  stepCard: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  stepHeaderPressed: {
    opacity: Interaction.pressedOpacity,
  },
  stepHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  selectedText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  optionButton: {
    minHeight: Interaction.minimumTouchTarget,
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  optionSelected: {
    borderColor: ColorTokens.accent.muted,
    backgroundColor: ColorTokens.accent.surface,
  },
  optionCorrect: {
    borderColor: SemanticStates.success.foreground,
    backgroundColor: "rgba(18,184,134,0.18)",
  },
  optionIncorrect: {
    borderColor: SemanticStates.danger.foreground,
    backgroundColor: "rgba(250,82,82,0.16)",
  },
  optionPressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.controlPressedScale }],
  },
  optionText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
  },
  optionTextSelected: {
    color: ColorTokens.text.primary,
  },
  feedbackBadge: {
    minHeight: 30,
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    paddingHorizontal: Spacing.sm,
  },
  correctBadge: {
    borderColor: SemanticStates.success.foreground,
    backgroundColor: "rgba(18,184,134,0.18)",
  },
  incorrectBadge: {
    borderColor: SemanticStates.danger.foreground,
    backgroundColor: "rgba(250,82,82,0.16)",
  },
  selectedBadge: {
    borderColor: ColorTokens.accent.muted,
    backgroundColor: ColorTokens.accent.surface,
  },
  neutralBadge: {
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
  },
  feedbackBadgeText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
  },
  expandIcon: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  feedbackBox: {
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  feedbackBoxCorrect: {
    borderColor: SemanticStates.success.foreground,
    backgroundColor: "rgba(18,184,134,0.12)",
  },
  feedbackBoxIncorrect: {
    borderColor: SemanticStates.danger.foreground,
    backgroundColor: "rgba(250,82,82,0.11)",
  },
  feedbackTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  feedbackText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
  },
  summaryCard: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  summaryScore: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  summaryRhythm: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
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
  bulletList: {
    gap: Spacing.sm,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: Radii.circular,
    backgroundColor: ColorTokens.accent.muted,
    marginTop: 8,
  },
  sourceNote: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  buttonStack: {
    gap: Spacing.sm,
  },
});
