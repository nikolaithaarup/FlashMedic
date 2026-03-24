// src/features/drugCalc/DrugCalcPracticeScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { styles } from "../../ui/flashmedicStyles";
import type { DrugCalcQuestion, DrugCalcTopic } from "./drugCalcContent";

type TopicMeta = { id: DrugCalcTopic; title: string; desc: string };

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;

  currentDrugQuestion: DrugCalcQuestion | null;

  drugAnswer: string;
  setDrugAnswer: (v: string) => void;

  drugAnswerStatus: "neutral" | "correct" | "incorrect";

  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onBack: () => void;

  availableTopics: TopicMeta[];
  selectedTopics: DrugCalcTopic[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<DrugCalcTopic[]>>;
  onStartWithTopics: (topics: DrugCalcTopic[]) => void;
};

export function DrugCalcPracticeScreen({
  headingFont,
  subtitleFont,
  buttonFont,
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
  const allSelected = selectedTopics.length === availableTopics.length;
  const hasStarted = !!currentDrugQuestion;

  const toggleTopic = (id: DrugCalcTopic) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(availableTopics.map((t) => t.id));
    }
  };

  const answerBoxStyle = useMemo(
    () => [
      styles.drugAnswerBox,
      drugAnswerStatus === "correct" && styles.drugAnswerBoxCorrect,
      drugAnswerStatus === "incorrect" && styles.drugAnswerBoxIncorrect,
    ],
    [drugAnswerStatus],
  );

  return (
    <LinearGradient
      colors={["#0e91a8ff", "#5e6e7eff"]}
      style={styles.homeBackground}
    >
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.homeContainer,
            styles.safeTopContainer,
            { paddingBottom: 140 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
              <Text
                style={[
                  styles.appTitle,
                  {
                    fontSize: headingFont,
                    color: "#f8f9fa",
                    textAlign: "left",
                    marginBottom: 4,
                  },
                ]}
              >
                Lægemiddelregning
              </Text>

              <View style={styles.subHeaderRow}>
                <Text
                  style={[styles.subHeaderText, { fontSize: subtitleFont }]}
                  numberOfLines={1}
                >
                  Opgaver
                </Text>
              </View>
            </View>

            <Pressable
              style={[
                styles.smallButton,
                { borderColor: "#fff", alignSelf: "flex-start" },
              ]}
              onPress={onBack}
              hitSlop={8}
            >
              <Text
                style={[
                  styles.smallButtonText,
                  { color: "#fff", fontSize: buttonFont * 0.9 },
                ]}
                numberOfLines={1}
              >
                Tilbage
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.statsCard,
              { alignSelf: "stretch", marginBottom: 12 },
            ]}
          >
            <Text style={styles.statsSectionTitle}>Vælg emner</Text>

            <Text style={[styles.statsLabel, { marginTop: 6 }]}>
              Vælg ét eller flere emner. Hvis du ikke vælger noget, bruges alle
              emner.
            </Text>

            <Pressable
              onPress={toggleAll}
              hitSlop={8}
              style={[styles.smallButton, { marginTop: 10, marginLeft: 0 }]}
            >
              <Text style={styles.smallButtonText}>
                {allSelected ? "Fravælg alle" : "Vælg alle"}
              </Text>
            </Pressable>

            <View
              style={[styles.subtopicRow, { marginLeft: 0, marginTop: 10 }]}
            >
              {availableTopics.map((t) => {
                const selected = selectedTopics.includes(t.id);

                return (
                  <Pressable
                    key={t.id}
                    onPress={() => toggleTopic(t.id)}
                    style={[
                      styles.topicChip,
                      selected && styles.topicChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.topicChipText,
                        selected && styles.topicChipTextSelected,
                      ]}
                    >
                      {t.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[
                styles.bigButton,
                { backgroundColor: "#1c7ed6", marginTop: 14 },
              ]}
              onPress={() => onStartWithTopics(selectedTopics)}
            >
              <Text
                style={[styles.bigButtonText, { fontSize: buttonFont }]}
                numberOfLines={2}
              >
                {selectedTopics.length === 0
                  ? "Start (alle emner)"
                  : "Start (valgte emner)"}
              </Text>
            </Pressable>
          </View>

          <View style={[styles.statsCard, { alignSelf: "stretch" }]}>
            <Text style={styles.statsSectionTitle}>Spørgsmål</Text>

            <Text style={styles.drugQuestionText}>
              {hasStarted
                ? currentDrugQuestion?.text
                : "Tryk Start ovenfor for at begynde."}
            </Text>

            {currentDrugQuestion?.hint ? (
              <Text style={styles.drugHintText}>
                {currentDrugQuestion.hint}
              </Text>
            ) : null}

            <View style={answerBoxStyle}>
              <TextInput
                value={drugAnswer}
                onChangeText={setDrugAnswer}
                placeholder="Skriv dit svar"
                placeholderTextColor="#adb5bd"
                keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
                style={styles.textInput}
                editable={hasStarted}
                returnKeyType="done"
              />

              {currentDrugQuestion?.unit ? (
                <Text style={styles.drugUnitText}>
                  {currentDrugQuestion.unit}
                </Text>
              ) : null}
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                style={[
                  styles.bigButton,
                  styles.primaryButton,
                  { backgroundColor: "#1c7ed6", flex: 1 },
                ]}
                onPress={onCheckAnswer}
                disabled={!hasStarted}
              >
                <Text style={styles.bigButtonText}>Tjek svar</Text>
              </Pressable>
            </View>

            {drugAnswerStatus !== "neutral" && currentDrugQuestion && (
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.statsLabel, { marginTop: 6 }]}>
                  Korrekt svar:{" "}
                  <Text style={{ fontWeight: "800" }}>
                    {Number.isFinite(currentDrugQuestion.correctAnswer)
                      ? String(currentDrugQuestion.correctAnswer)
                      : ""}
                  </Text>{" "}
                  {currentDrugQuestion.unit}
                </Text>

                {currentDrugQuestion.explanation ? (
                  <Text style={[styles.drugHintText, { marginTop: 6 }]}>
                    {currentDrugQuestion.explanation}
                  </Text>
                ) : null}

                <View style={styles.buttonRow}>
                  <Pressable
                    style={[
                      styles.bigButton,
                      styles.secondaryButton,
                      { backgroundColor: "#495057", flex: 1 },
                    ]}
                    onPress={onNextQuestion}
                  >
                    <Text style={styles.bigButtonText}>Næste spørgsmål</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

export default DrugCalcPracticeScreen;
