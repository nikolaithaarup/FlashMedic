import { Asset } from "expo-asset";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
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
import type { FlashcardTrainingMode } from "../../types/Learning";
import FullscreenEkgImageModal from "../flashcards/components/FullscreenEkgImageModal";
import {
  ProgressHeader,
  PrimaryButton,
  ResultSummary,
  Screen,
  SecondaryButton,
  SelectableChoice,
  Surface,
  ToolPageHeader,
} from "../../ui/primitives";

type QuizScreenProps = {
  currentCard: Flashcard;
  completed: boolean;
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
  trainingMode?: FlashcardTrainingMode;
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
  completed,
  historyCount,
  upcomingCount,
  showAnswer,
  setShowAnswer,
  subjectFont,
  metaFont,
  questionFont,
  answerFont,
  trainingMode = "normal",
  onPrevious,
  onHome,
  onMarkKnown,
  onMarkUnknown,
  onReportError,
}: QuizScreenProps) {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const totalQuestions = historyCount + 1 + upcomingCount;
  const currentIndex = historyCount + 1;
  const isExamMode = trainingMode === "exam";
  const isDailyTen = trainingMode === "daily-10";
  const sessionTitle = isDailyTen
    ? "Daily10"
    : isExamMode
      ? "Eksamensmode"
      : "FlashMedic";
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
            historyCount > 0 && !completed && !isExamMode ? (
              <SecondaryButton
                label="Forrige"
                onPress={onPrevious}
                style={styles.previousButton}
              />
            ) : undefined
          }
          backLabel="Afslut træningen"
          onBack={onHome}
          subtitle={
            isDailyTen
              ? "Dagens korte, fokuserede session"
              : `Spørgsmål ${currentIndex} af ${totalQuestions}`
          }
          title={sessionTitle}
        />

        <ProgressHeader
          current={currentIndex}
          label={isDailyTen ? "DAGENS SESSION" : "FREMSKRIDT"}
          style={styles.progress}
          total={totalQuestions}
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
        <Surface elevated tone="elevated" style={styles.questionCard}>
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
        </Surface>

        {showAnswer ? (
          <>
            <Text style={[styles.semanticLabel, styles.answerLabel]}>SVAR</Text>
            <Surface tone="accent" style={styles.answerCard}>
            <Text
              style={[
                styles.answer,
                { fontSize: answerFont, lineHeight: answerFont * 1.4 },
              ]}
            >
              {currentCard.answer}
            </Text>
            </Surface>
          </>
        ) : (
          <Text style={styles.answerPlaceholder}>
              {isExamMode
                ? "Tænk dit svar igennem, og vis facit når du er klar til at vurdere dig selv."
                : "Svaret er skjult, indtil du er klar til at kontrollere dig selv."}
          </Text>
        )}

        {completed ? (
          <ResultSummary
            message="Det sidste kort er registreret. Du kan nu vende tilbage til forsiden."
            style={styles.completionCard}
            title={isDailyTen ? "Dagens 10 er gennemført" : "Træningen er gennemført"}
          >
            <PrimaryButton label="Tilbage til forsiden" onPress={onHome} />
          </ResultSummary>
        ) : !showAnswer ? (
          <PrimaryButton
            label="Vis svar"
            onPress={() => setShowAnswer(true)}
            style={styles.primaryAction}
          />
        ) : (
          <View style={styles.assessmentSection}>
            <Text style={styles.assessmentTitle}>Hvordan gik det?</Text>
            {isExamMode ? (
              <Text style={styles.assessmentHelp}>
                Dit valg gemmes til den samlede gennemgang. Statistik opdateres først, når eksamen afsluttes.
              </Text>
            ) : null}
            <Text style={[styles.assessmentHelp, isExamMode && styles.hidden]}>
              Dit svar opdaterer statistikken og vælger det næste kort.
            </Text>
            <View style={styles.assessmentActions}>
              <SelectableChoice
                description="Markér som korrekt"
                indicator="✓"
                label="Jeg kunne den"
                onPress={onMarkKnown}
                style={styles.assessmentButton}
              />
              <SelectableChoice
                description="Vis kortet igen"
                indicator="↺"
                label="Jeg kunne den ikke"
                onPress={onMarkUnknown}
                style={styles.assessmentButton}
              />
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
        <FullscreenEkgImageModal
          imageSource={imageSource}
          onClose={() => setImageModalVisible(false)}
          visible={imageModalVisible}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  previousButton: { minWidth: 104 },
  progress: { marginBottom: Spacing.lg },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    marginBottom: Spacing.md,
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
  questionCard: { minHeight: 150, justifyContent: "center" },
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
    color: ColorTokens.text.primary,
    fontWeight: Typography.weights.bold,
    textAlign: "left",
  },
  answerLabel: { marginTop: Spacing.lg },
  answerCard: { justifyContent: "center" },
  completionCard: { marginTop: Spacing.lg },
  answer: {
    color: ColorTokens.text.primary,
    textAlign: "left",
  },
  answerPlaceholder: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    textAlign: "center",
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
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
  assessmentActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  assessmentButton: {
    flex: 1,
    flexBasis: 150,
  },
  reportButton: { marginTop: Spacing.lg, marginBottom: Spacing.lg },
  hidden: { display: "none" },
});
