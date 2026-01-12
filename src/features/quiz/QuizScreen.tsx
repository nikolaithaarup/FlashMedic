import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Image, Modal, Pressable, Text, View, useWindowDimensions } from "react-native";

import { styles } from "../../../app/flashmedicStyles";
import type { Difficulty, Flashcard } from "../../types/Flashcard";

type QuizScreenProps = {
  // Data
  currentCard: Flashcard;
  historyCount: number;
  upcomingCount: number;

  // UI state
  showAnswer: boolean;
  setShowAnswer: (v: boolean) => void;

  // Fonts
  headingFont: number;
  buttonFont: number;
  subjectFont: number;
  metaFont: number;
  questionFont: number;
  answerFont: number;

  // Actions
  onPrevious: () => void;
  onHome: () => void;
  onMarkKnown: () => void;
  onMarkUnknown: () => void;
  onReportError: () => void;
};

// --- Local maps (keeps this screen self-contained) ---
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
  // Keep your current simple theme. Expand later if you want per-subject gradients.
  return ["#343a40", "#1c7ed6"];
}

function getDifficultyColor(difficulty: Difficulty): string {
  return difficultyColorMap[difficulty] ?? "#868e96";
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

  // Image zoom modal (moved out of index.tsx)
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  const difficultyText = difficultyTextMap[currentCard.difficulty];
  const gradient = getSubjectGradient(currentCard.subject);

  const totalQuestions = historyCount + 1 + upcomingCount;
  const currentIndex = historyCount + 1;

  // Compute zoom style based on real image size
  const zoomImageStyle = useMemo(() => {
    let zoomStyle: any = styles.zoomImage;

    if (!imageSize) return zoomStyle;

    const sw = screenWidth;
    const sh = screenHeight;

    const { width: iw, height: ih } = imageSize;

    // Fit within screen
    const fitScale = Math.min(sw / iw, sh / ih);

    // Shrink slightly so edges are clearly visible
    const marginScale = 0.94;
    const finalScale = fitScale * marginScale;

    const displayWidth = iw * finalScale;
    const displayHeight = ih * finalScale;

    return [styles.zoomImage, { width: displayWidth, height: displayHeight }];
  }, [imageSize, screenWidth, screenHeight]);

  const openImageModal = () => {
    const imgSource = currentCard.image as any;
    const resolved = Image.resolveAssetSource(imgSource);

    // Bundled asset: width/height available
    if (resolved?.width && resolved?.height) {
      setImageSize({ width: resolved.width, height: resolved.height });
      setImageModalVisible(true);
      return;
    }

    // URI or unknown: use Image.getSize
    Image.getSize(
      resolved?.uri ?? imgSource,
      (width, height) => {
        setImageSize({ width, height });
        setImageModalVisible(true);
      },
      () => {
        // fallback guess if we can't get size
        setImageSize({ width: 1600, height: 1000 });
        setImageModalVisible(true);
      },
    );
  };

  return (
    <LinearGradient colors={gradient} style={styles.quizBackground}>
      <StatusBar style="light" />
      <View style={styles.quizContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.appTitle, { color: "#fff", marginBottom: 0, fontSize: headingFont }]}>
            FlashMedic
          </Text>

          <View style={styles.headerButtons}>
            {historyCount > 0 && (
              <Pressable
                style={[styles.smallButton, { borderColor: "#fff" }]}
                onPress={onPrevious}
                hitSlop={8}
              >
                <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
                  Tilbage
                </Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.smallButton, { borderColor: "#fff" }]}
              onPress={onHome}
              hitSlop={8}
            >
              <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
                Home
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View>
            <Text style={[styles.subjectLabel, { color: "#f8f9fa", fontSize: subjectFont }]}>
              {currentCard.subject ?? "Ukendt"}
            </Text>
            <Text style={[styles.topicLabel, { color: "#e9ecef", fontSize: metaFont }]}>
              {currentCard.topic ?? "Ukendt"}
              {currentCard.subtopic ? ` · ${currentCard.subtopic}` : ""}
            </Text>
            <Text style={[styles.progressText, { color: "#e9ecef", fontSize: metaFont }]}>
              Spørgsmål {currentIndex} af {totalQuestions}
            </Text>
          </View>

          <View style={[styles.difficultyPill, { backgroundColor: getDifficultyColor(currentCard.difficulty) }]}>
            <Text style={[styles.difficultyText, { fontSize: buttonFont * 0.9 }]}>{difficultyText}</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.cardBox}>
            {currentCard.image && (
              <Pressable onPress={openImageModal}>
                <Image source={currentCard.image} style={styles.questionImage} resizeMode="contain" />
                <Text style={styles.tapToZoomText}>Tryk for at se stort</Text>
              </Pressable>
            )}

            <Text style={[styles.questionText, { fontSize: questionFont }]}>{currentCard.question}</Text>
          </View>

          <View style={styles.cardBox}>
            {showAnswer ? (
              <Text style={[styles.answerText, { fontSize: answerFont }]}>{currentCard.answer}</Text>
            ) : (
              <Text style={styles.placeholderText}>Tryk på &apos;Vis svar&apos; for at se svaret.</Text>
            )}
          </View>
        </View>

        {!showAnswer && (
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.bigButton, styles.primaryButton, { backgroundColor: "#1c7ed6" }]}
              onPress={() => setShowAnswer(true)}
            >
              <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>Vis svar</Text>
            </Pressable>
          </View>
        )}

        {showAnswer && (
          <View style={styles.ratingRow}>
            <Pressable style={[styles.ratingButton, styles.knownButton]} onPress={onMarkKnown}>
              <Text style={[styles.ratingButtonText, { fontSize: buttonFont }]}>Jeg kunne den</Text>
            </Pressable>

            <Pressable style={[styles.ratingButton, styles.unknownButton]} onPress={onMarkUnknown}>
              <Text style={[styles.ratingButtonText, { fontSize: buttonFont }]}>Jeg kunne den ikke</Text>
            </Pressable>
          </View>
        )}

        <Pressable style={[styles.bigButton, styles.outlineButton]} onPress={onReportError}>
          <Text style={styles.outlineButtonText}>Rapportér fejl</Text>
        </Pressable>
      </View>

      {currentCard.image && (
        <Modal
          visible={imageModalVisible}
          transparent={false}
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Image source={currentCard.image} style={zoomImageStyle} resizeMode="contain" />

              <Pressable style={styles.modalCloseButton} onPress={() => setImageModalVisible(false)}>
                <Text style={styles.modalCloseText}>Luk</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
}
