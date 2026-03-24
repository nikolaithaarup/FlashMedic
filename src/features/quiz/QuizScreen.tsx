// src/features/quiz/QuizScreen.tsx
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import type { Difficulty, Flashcard } from "../../types/Flashcard";
import { styles } from "../../ui/flashmedicStyles";

type QuizScreenProps = {
  currentCard: Flashcard;
  historyCount: number;
  upcomingCount: number;
  showAnswer: boolean;
  setShowAnswer: (v: boolean) => void;
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

const difficultyTextMap: Record<Difficulty, string> = {
  easy: "Let",
  medium: "Mellem",
  hard: "Svær",
};

const difficultyColorMap: Record<Difficulty, string> = {
  easy: "#12b886",
  medium: "#fab005",
  hard: "#fa5252",
};

function getSubjectGradient(_subject?: string | null): [string, string] {
  return ["#343a40", "#1c7ed6"];
}

function getDifficultyColor(difficulty: Difficulty): string {
  return difficultyColorMap[difficulty] ?? "#868e96";
}

function toImageUri(src: any): string | null {
  if (!src) return null;
  if (typeof src === "string") return src;

  if (typeof src === "number") {
    const asset = Asset.fromModule(src);
    return asset?.uri ?? null;
  }

  if (typeof src === "object" && typeof src.uri === "string") {
    return src.uri;
  }

  const resolved = (Image as any)?.resolveAssetSource?.(src);
  return resolved?.uri ?? null;
}

export default function QuizScreen({
  currentCard,
  historyCount,
  upcomingCount,
  showAnswer,
  setShowAnswer,
  headingFont,
  buttonFont,
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

  const difficultyText = difficultyTextMap[currentCard.difficulty];
  const gradient = getSubjectGradient(currentCard.subject);

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
    [imageUri, currentCard.image],
  );

  const openImageModal = async () => {
    setImageModalVisible(true);
  };

  return (
    <LinearGradient colors={gradient} style={styles.quizBackground}>
      <StatusBar style="light" />
      <View style={styles.quizContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.appTitle,
              { color: "#fff", marginBottom: 0, fontSize: headingFont },
            ]}
          >
            FlashMedic
          </Text>

          <View style={styles.headerButtons}>
            {historyCount > 0 && (
              <Pressable
                style={[styles.smallButton, { borderColor: "#fff" }]}
                onPress={onPrevious}
                hitSlop={8}
              >
                <Text
                  style={[
                    styles.smallButtonText,
                    { color: "#fff", fontSize: buttonFont * 0.9 },
                  ]}
                >
                  Tilbage
                </Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.smallButton, { borderColor: "#fff" }]}
              onPress={onHome}
              hitSlop={8}
            >
              <Text
                style={[
                  styles.smallButtonText,
                  { color: "#fff", fontSize: buttonFont * 0.9 },
                ]}
              >
                Home
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View>
            <Text
              style={[
                styles.subjectLabel,
                { color: "#f8f9fa", fontSize: subjectFont },
              ]}
            >
              {currentCard.subject ?? "Ukendt"}
            </Text>
            <Text
              style={[
                styles.topicLabel,
                { color: "#e9ecef", fontSize: metaFont },
              ]}
            >
              {currentCard.topic ?? "Ukendt"}
              {currentCard.subtopic ? ` · ${currentCard.subtopic}` : ""}
            </Text>
            <Text
              style={[
                styles.progressText,
                { color: "#e9ecef", fontSize: metaFont },
              ]}
            >
              Spørgsmål {currentIndex} af {totalQuestions}
            </Text>
          </View>

          <View
            style={[
              styles.difficultyPill,
              { backgroundColor: getDifficultyColor(currentCard.difficulty) },
            ]}
          >
            <Text
              style={[styles.difficultyText, { fontSize: buttonFont * 0.9 }]}
            >
              {difficultyText}
            </Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.cardBox}>
            {currentCard.image && (
              <Pressable onPress={openImageModal}>
                <Image
                  source={currentCard.image as any}
                  style={styles.questionImage}
                  resizeMode="contain"
                />
                <Text style={styles.tapToZoomText}>Tryk for at se stort</Text>
              </Pressable>
            )}

            <Text style={[styles.questionText, { fontSize: questionFont }]}>
              {currentCard.question}
            </Text>
          </View>

          <View style={styles.cardBox}>
            {showAnswer ? (
              <Text style={[styles.answerText, { fontSize: answerFont }]}>
                {currentCard.answer}
              </Text>
            ) : (
              <Text style={styles.placeholderText}>
                Tryk på &apos;Vis svar&apos; for at se svaret.
              </Text>
            )}
          </View>
        </View>

        {!showAnswer && (
          <View style={styles.buttonRow}>
            <Pressable
              style={[
                styles.bigButton,
                styles.primaryButton,
                { backgroundColor: "#1c7ed6" },
              ]}
              onPress={() => setShowAnswer(true)}
            >
              <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>
                Vis svar
              </Text>
            </Pressable>
          </View>
        )}

        {showAnswer && (
          <View style={styles.ratingRow}>
            <Pressable
              style={[styles.ratingButton, styles.knownButton]}
              onPress={onMarkKnown}
            >
              <Text style={[styles.ratingButtonText, { fontSize: buttonFont }]}>
                Jeg kunne den
              </Text>
            </Pressable>

            <Pressable
              style={[styles.ratingButton, styles.unknownButton]}
              onPress={onMarkUnknown}
            >
              <Text style={[styles.ratingButtonText, { fontSize: buttonFont }]}>
                Jeg kunne den ikke
              </Text>
            </Pressable>
          </View>
        )}

        <Pressable
          style={[styles.bigButton, styles.outlineButton]}
          onPress={onReportError}
        >
          <Text style={styles.outlineButtonText}>Rapportér fejl</Text>
        </Pressable>
      </View>

      {currentCard.image && (
        <Modal
          visible={imageModalVisible}
          transparent={false}
          animationType="fade"
          presentationStyle="fullScreen"
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#000",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pressable
              onPress={() => setImageModalVisible(false)}
              hitSlop={12}
              style={{
                position: "absolute",
                top: 56,
                right: 18,
                zIndex: 50,
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 28,
                  fontWeight: "800",
                  lineHeight: 28,
                }}
              >
                ✕
              </Text>
            </Pressable>

            <Image
              source={imageSource}
              resizeMode="contain"
              style={{
                width: screenHeight * 0.94,
                height: screenWidth * 0.94,
                transform: [{ rotate: "90deg" }],
              }}
            />
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
}
