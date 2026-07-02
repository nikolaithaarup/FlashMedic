import { Asset } from "expo-asset";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Image,
  Modal,
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
import type { Difficulty, Flashcard } from "../../types/Flashcard";
import {
  Card,
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";

type QuizScreenProps = {
  currentCard: Flashcard;
  historyCount: number;
  upcomingCount: number;
  showAnswer: boolean;
  setShowAnswer: (value: boolean) => void;
  headingFont: number;
  buttonFont: number;
  subjectFont: number;
  metaFont: number;
  questionFont: number;
  answerFont: number;
  onPrevious: () => void;
  onHome: () => void;
  onMarkKnown: () => void;
  onMarkUnknown: () => void;
  onReportError: () => void;
};

const difficultyText: Record<Difficulty, string> = {
  easy: "Let",
  medium: "Mellem",
  hard: "Svær",
};

const difficultyColors: Record<Difficulty, string> = {
  easy: SemanticStates.success.foreground,
  medium: SemanticStates.warning.foreground,
  hard: SemanticStates.danger.foreground,
};

function toImageUri(source: any): string | null {
  if (!source) return null;
  if (typeof source === "string") return source;
  if (typeof source === "number") return Asset.fromModule(source)?.uri ?? null;
  if (typeof source === "object" && typeof source.uri === "string") {
    return source.uri;
  }
  return (Image as any)?.resolveAssetSource?.(source)?.uri ?? null;
}

export default function QuizScreen({
  currentCard,
  historyCount,
  upcomingCount,
  showAnswer,
  setShowAnswer,
  subjectFont,
  metaFont,
  questionFont,
  answerFont,
  onPrevious,
  onHome,
  onMarkKnown,
  onMarkUnknown,
  onReportError,
}: QuizScreenProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const totalQuestions = historyCount + 1 + upcomingCount;
  const currentIndex = historyCount + 1;
  const imageUri = useMemo(
    () => toImageUri((currentCard as any).image),
    [currentCard],
  );
  const imageSource = useMemo(
    () =>
      imageUri
        ? ({ uri: imageUri } as any)
        : ((currentCard.image as any) ?? null),
    [currentCard.image, imageUri],
  );

  return (
    <>
      <Screen>
        <StatusBar style="light" />
        <ToolPageHeader
          action={
            historyCount > 0 ? (
              <SecondaryButton
                label="Forrige"
                onPress={onPrevious}
                style={styles.previousButton}
              />
            ) : undefined
          }
          backLabel="Afslut quiz og gå til forsiden"
          onBack={onHome}
          subtitle={`Spørgsmål ${currentIndex} af ${totalQuestions}`}
          title="FlashMedic"
        />

        <View style={styles.metaRow}>
          <View style={styles.metaCopy}>
            <Text style={[styles.subject, { fontSize: subjectFont }]}>
              {currentCard.subject ?? "Ukendt"}
            </Text>
            <Text style={[styles.topic, { fontSize: metaFont }]}>
              {currentCard.topic ?? "Ukendt"}
              {currentCard.subtopic ? ` · ${currentCard.subtopic}` : ""}
            </Text>
          </View>
          <View
            style={[
              styles.difficulty,
              { borderColor: difficultyColors[currentCard.difficulty] },
            ]}
          >
            <View
              style={[
                styles.difficultyDot,
                { backgroundColor: difficultyColors[currentCard.difficulty] },
              ]}
            />
            <Text style={styles.difficultyText}>
              {difficultyText[currentCard.difficulty]}
            </Text>
          </View>
        </View>

        <Text style={styles.semanticLabel}>SPØRGSMÅL</Text>
        <Card variant="elevated" style={styles.questionCard}>
          {currentCard.image ? (
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
                style={styles.questionImage}
              />
              <Text style={styles.imageHint}>Tryk for at se billedet stort</Text>
            </Pressable>
          ) : null}
          <Text
            style={[
              styles.question,
              { fontSize: questionFont, lineHeight: questionFont * 1.35 },
            ]}
          >
            {currentCard.question}
          </Text>
        </Card>

        <Text style={[styles.semanticLabel, styles.answerLabel]}>SVAR</Text>
        <Card variant={showAnswer ? "elevated" : "subtle"} style={styles.answerCard}>
          {showAnswer ? (
            <Text
              style={[
                styles.answer,
                { fontSize: answerFont, lineHeight: answerFont * 1.4 },
              ]}
            >
              {currentCard.answer}
            </Text>
          ) : (
            <Text style={styles.answerPlaceholder}>
              Svaret er skjult, indtil du er klar til at kontrollere dig selv.
            </Text>
          )}
        </Card>

        {!showAnswer ? (
          <PrimaryButton
            label="Vis svar"
            onPress={() => setShowAnswer(true)}
            style={styles.primaryAction}
          />
        ) : (
          <View style={styles.assessmentSection}>
            <Text style={styles.assessmentTitle}>Hvordan gik det?</Text>
            <Text style={styles.assessmentHelp}>
              Dit svar opdaterer statistikken og vælger det næste kort.
            </Text>
            <View style={styles.assessmentActions}>
              <Pressable
                accessibilityRole="button"
                onPress={onMarkKnown}
                style={({ pressed }) => [
                  styles.assessmentButton,
                  styles.knownButton,
                  pressed && styles.assessmentPressed,
                ]}
              >
                <Text style={styles.assessmentButtonTitle}>Jeg kunne den</Text>
                <Text style={styles.assessmentButtonMeta}>Markér som korrekt</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onMarkUnknown}
                style={({ pressed }) => [
                  styles.assessmentButton,
                  styles.unknownButton,
                  pressed && styles.assessmentPressed,
                ]}
              >
                <Text style={styles.assessmentButtonTitle}>
                  Jeg kunne den ikke
                </Text>
                <Text style={styles.assessmentButtonMeta}>Vis kortet igen</Text>
              </Pressable>
            </View>
          </View>
        )}

        <SecondaryButton
          label="Rapportér fejl"
          onPress={onReportError}
          style={styles.reportButton}
        />
      </Screen>

      {currentCard.image ? (
        <Modal
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}
          presentationStyle="fullScreen"
          transparent={false}
          visible={imageModalVisible}
        >
          <View style={styles.modal}>
            <Pressable
              accessibilityLabel="Luk billede"
              accessibilityRole="button"
              hitSlop={Spacing.sm}
              onPress={() => setImageModalVisible(false)}
              style={({ pressed }) => [
                styles.modalClose,
                pressed && styles.modalClosePressed,
              ]}
            >
              <Text style={styles.modalCloseText} accessibilityElementsHidden>
                ×
              </Text>
            </Pressable>
            <Image
              resizeMode="contain"
              source={imageSource}
              style={{
                width: screenHeight * 0.94,
                height: screenWidth * 0.94,
                transform: [{ rotate: "90deg" }],
              }}
            />
          </View>
        </Modal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  previousButton: { minWidth: 104 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  metaCopy: { flex: 1, minWidth: 0 },
  subject: {
    color: ColorTokens.text.primary,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  topic: {
    color: ColorTokens.text.secondary,
    lineHeight: Typography.lineHeights.label,
    marginTop: 2,
  },
  difficulty: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  difficultyDot: { width: 8, height: 8, borderRadius: Radii.circular },
  difficultyText: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
  },
  semanticLabel: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.9,
    marginBottom: Spacing.xs,
  },
  questionCard: { minHeight: 160, justifyContent: "center" },
  imageButton: { alignItems: "center", marginBottom: Spacing.md },
  imagePressed: { opacity: Interaction.pressedOpacity },
  questionImage: { width: "100%", height: 210 },
  imageHint: {
    color: ColorTokens.text.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    marginTop: Spacing.xs,
  },
  question: {
    color: ColorTokens.text.onSurface,
    fontWeight: Typography.weights.bold,
    textAlign: "left",
  },
  answerLabel: { marginTop: Spacing.lg },
  answerCard: { minHeight: 120, justifyContent: "center" },
  answer: {
    color: ColorTokens.text.onSurface,
    textAlign: "left",
  },
  answerPlaceholder: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    textAlign: "center",
  },
  primaryAction: { marginTop: Spacing.lg },
  assessmentSection: { marginTop: Spacing.xl },
  assessmentTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
  },
  assessmentHelp: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  assessmentActions: { flexDirection: "row", gap: Spacing.sm },
  assessmentButton: {
    flex: 1,
    minHeight: 84,
    justifyContent: "center",
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    padding: Spacing.md,
  },
  knownButton: {
    borderColor: SemanticStates.success.foreground,
    backgroundColor: SemanticStates.success.surface,
  },
  unknownButton: {
    borderColor: SemanticStates.warning.foreground,
    backgroundColor: SemanticStates.warning.surface,
  },
  assessmentPressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.controlPressedScale }],
  },
  assessmentButtonTitle: {
    color: ColorTokens.text.onSurface,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  assessmentButtonMeta: {
    color: ColorTokens.text.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    marginTop: 2,
  },
  reportButton: { marginTop: Spacing.lg, marginBottom: Spacing.lg },
  modal: {
    flex: 1,
    backgroundColor: ColorTokens.background.base,
    alignItems: "center",
    justifyContent: "center",
  },
  modalClose: {
    position: "absolute",
    top: 56,
    right: 18,
    zIndex: 50,
    width: Interaction.minimumTouchTarget,
    height: Interaction.minimumTouchTarget,
    borderRadius: Radii.control,
    backgroundColor: ColorTokens.background.scrim,
    alignItems: "center",
    justifyContent: "center",
  },
  modalClosePressed: { opacity: Interaction.pressedOpacity },
  modalCloseText: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.pageTitle,
    lineHeight: Typography.lineHeights.pageTitle,
    fontWeight: Typography.weights.heavy,
  },
});
