import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { styles } from "../../../app/flashmedicStyles";

type DrugQuestion = {
  text: string;
  hint?: string | null;
  unit?: string | null;
};

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;

  currentDrugQuestion: DrugQuestion | null;

  drugAnswer: string;
  setDrugAnswer: (v: string) => void;

  drugAnswerStatus: "neutral" | "correct" | "incorrect";

  onCheckAnswer: () => void; // your checkDrugAnswer
  onNextQuestion: () => void; // your nextDrugQuestion
  onBack: () => void; // setScreen("drugCalcHome")
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
}: Props) {
  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Lægemiddelregning
            </Text>
            <View style={styles.subHeaderRow}>
              <Text style={[styles.subHeaderText, { fontSize: subtitleFont }]}>Opgaver</Text>
            </View>
          </View>

          <Pressable
            style={[styles.smallButton, { borderColor: "#fff" }]}
            onPress={onBack}
            hitSlop={8}
          >
            <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
              Tilbage
            </Text>
          </Pressable>
        </View>

        <View style={[styles.statsCard, { alignSelf: "stretch" }]}>
          <Text style={styles.statsSectionTitle}>Spørgsmål</Text>

          <Text style={styles.drugQuestionText}>
            {currentDrugQuestion?.text ?? "Ingen spørgsmål – tryk på Næste spørgsmål."}
          </Text>

          {currentDrugQuestion?.hint ? (
            <Text style={styles.drugHintText}>{currentDrugQuestion.hint}</Text>
          ) : null}

          <View
            style={[
              styles.drugAnswerBox,
              drugAnswerStatus === "correct" && styles.drugAnswerBoxCorrect,
              drugAnswerStatus === "incorrect" && styles.drugAnswerBoxIncorrect,
            ]}
          >
            <TextInput
              value={drugAnswer}
              onChangeText={setDrugAnswer}
              placeholder="Skriv dit svar"
              placeholderTextColor="#adb5bd"
              keyboardType="numeric"
              style={styles.textInput}
            />
            {currentDrugQuestion?.unit ? (
              <Text style={styles.drugUnitText}>{currentDrugQuestion.unit}</Text>
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
            >
              <Text style={styles.bigButtonText}>Tjek svar</Text>
            </Pressable>
          </View>

          {drugAnswerStatus !== "neutral" && (
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
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default DrugCalcPracticeScreen;
