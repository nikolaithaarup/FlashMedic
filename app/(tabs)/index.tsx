import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { allFlashcards } from "../../src/data/flashcards";
import type { Flashcard } from "../../src/types/Flashcard";

type Screen = "home" | "quiz";

export default function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // -------- Subject list (automatically from flashcards) ------
  const subjects = useMemo(
    () => Array.from(new Set(allFlashcards.map((c) => c.subject))),
    []
  );

  // Flashcards filtered by selected subject
  const cardsForSelectedSubject = useMemo(() => {
    if (!selectedSubject) return [];
    return allFlashcards.filter((c) => c.subject === selectedSubject);
  }, [selectedSubject]);

  const pickRandomCard = () => {
    if (!selectedSubject) return;
    const cards = cardsForSelectedSubject;
    if (cards.length === 0) return;

    let next: Flashcard = cards[Math.floor(Math.random() * cards.length)];

    if (currentCard && cards.length > 1) {
      let tries = 0;
      while (next.id === currentCard.id && tries < 10) {
        next = cards[Math.floor(Math.random() * cards.length)];
        tries++;
      }
    }
    setCurrentCard(next);
    setShowAnswer(false);
  };

  const handleStartQuiz = () => {
    if (!selectedSubject) {
      Alert.alert("Vælg fag", "Du skal vælge et fag først.");
      return;
    }
    pickRandomCard();
    setScreen("quiz");
  };

  const handleNextQuestion = () => {
    pickRandomCard();
  };

  const handleHome = () => {
    setScreen("home");
    setCurrentCard(null);
    setShowAnswer(false);
  };

  const handleReportError = () => {
    if (!currentCard) return;
    Alert.alert(
      "Rapportér fejl",
      `Her ville vi sende en fejlrapport til dig for kort: ${currentCard.id}.`
    );
  };

  // 🌈 Gradient color mapping
  const getSubjectGradient = (subject: string) => {
    switch (subject) {
      case "Kredsløb":
      case "Cardiology":
        return ["#ff4d4d", "#ff6b6b"];
      case "Respiration":
      case "Lungesygdomme":
        return ["#4dabf7", "#228be6"];
      case "Nervesystemet":
      case "Neurologi":
        return ["#9775fa", "#5f3dc4"];
      case "Infektion":
        return ["#fab005", "#f59f00"];
      case "Farmakologi":
        return ["#12b886", "#20c997"];
      case "Traumatologi":
        return ["#ff922b", "#fd7e14"];
      default:
        return ["#4c6ef5", "#364fc7"];
    }
  };

  // ------------------ QUIZ SCREEN --------------------
  if (screen === "quiz" && currentCard) {
    return (
      <View style={styles.quizContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.appTitle}>FlashMedic 💉📚</Text>
          <Pressable style={styles.smallButton} onPress={handleHome}>
            <Text style={styles.smallButtonText}>Home</Text>
          </Pressable>
        </View>

        <Text style={styles.subjectLabel}>
          {currentCard.subject} · {currentCard.topic}
        </Text>

        <View style={styles.cardContainer}>
          <View style={styles.cardBox}>
            <Text style={styles.questionText}>{currentCard.question}</Text>
          </View>

          <View style={styles.cardBox}>
            {showAnswer ? (
              <Text style={styles.answerText}>{currentCard.answer}</Text>
            ) : (
              <Text style={styles.placeholderText}>
                Tryk på 'Vis svar' for at se svaret.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.buttonRow}>
          {!showAnswer ? (
            <Pressable
              style={[styles.bigButton, styles.primaryButton]}
              onPress={() => setShowAnswer(true)}
            >
              <Text style={styles.bigButtonText}>Vis svar</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.bigButton, styles.secondaryButton]}
              onPress={handleNextQuestion}
            >
              <Text style={styles.bigButtonText}>Næste spørgsmål</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          style={[styles.bigButton, styles.outlineButton]}
          onPress={handleReportError}
        >
          <Text style={styles.outlineButtonText}>Rapportér fejl</Text>
        </Pressable>
      </View>
    );
  }

  // ------------------ HOME SCREEN --------------------
  return (
    <ScrollView contentContainerStyle={styles.homeContainer}>
      <Text style={styles.appTitle}>FlashMedic 💉📚</Text>
      <Text style={styles.subtitle}>Vælg et fag for at træne medicinsk viden.</Text>

      <View style={styles.subjectGrid}>
        {subjects.map((subject) => (
          <Pressable
            key={subject}
            onPress={() => setSelectedSubject(subject)}
          >
            <LinearGradient
              colors={getSubjectGradient(subject)}
              style={[
                styles.subjectTile,
                selectedSubject === subject && styles.subjectTileSelected,
              ]}
            >
              <Text style={styles.subjectTileText}>{subject}</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </View>

      {selectedSubject && (
        <Pressable
          style={[styles.bigButton, styles.primaryButton, { marginTop: 20 }]}
          onPress={handleStartQuiz}
        >
          <Text style={styles.bigButtonText}>Start quiz i {selectedSubject}</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flexGrow: 1,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  quizContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
    alignItems: "center", 
    backgroundColor: "#f8f9fa",
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#495057",
    marginBottom: 20,
  },
  subjectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  subjectTile: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  subjectTileSelected: {
    borderWidth: 3,
    borderColor: "#212529",
  },
  cardContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
  },
  cardBox: {
    minHeight: 120,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dee2e6",
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: { fontSize: 20, fontWeight: "600", textAlign: "center" },
  answerText: { fontSize: 18, textAlign: "center" },
  placeholderText: { fontSize: 15, color: "#868e96", textAlign: "center" },
  bigButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 150,
    alignItems: "center",
    marginVertical: 10,
  },
  primaryButton: { backgroundColor: "#12b886" },
  secondaryButton: { backgroundColor: "#4c6ef5" },
  smallButton: {
    borderWidth: 1,
    borderColor: "#343a40",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#343a40",
    backgroundColor: "transparent",
  },
  bigButtonText: { color: "#fff", fontWeight: "600" },
  outlineButtonText: { color: "#343a40", fontWeight: "600" },
  subjectTileText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  subjectLabel: { fontSize: 16, fontWeight: "500", marginBottom: 20 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 10,
  },
});
