// src/features/weekly/WeeklyHomeScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

// adjust this path if your styles file lives somewhere else
import { styles } from "../../../app/flashmedicStyles";

type WeeklyHomeScreenProps = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  weeklyMcqLocked: boolean;
  weeklyMatchLocked: boolean;
  weeklyWordLocked: boolean;
  onBackToHome: () => void;
  onOpenMcq: () => void;
  onOpenMatch: () => void;
  onOpenWord: () => void;
};

export function WeeklyHomeScreen({
  headingFont,
  subtitleFont,
  buttonFont,
  weeklyMcqLocked,
  weeklyMatchLocked,
  weeklyWordLocked,
  onBackToHome,
  onOpenMcq,
  onOpenMatch,
  onOpenWord,
}: WeeklyHomeScreenProps) {
  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>
            Weekly Challenges
          </Text>
          <Pressable
            style={[styles.smallButton, { borderColor: "#fff" }]}
            onPress={onBackToHome}
            hitSlop={8}
          >
            <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
              Home
            </Text>
          </Pressable>
        </View>

        <Text
          style={[
            styles.subtitle,
            {
              fontSize: subtitleFont,
              color: "#e9ecef",
              textAlign: "left",
              alignSelf: "flex-start",
            },
          ]}
        >
          Ugens spiltyper – frit valg, én gang pr. spil når backend er klar.
        </Text>

        <View style={styles.homeButtonsContainer}>
          {/* MCQ */}
          <Pressable
            style={[styles.homeNavButton, weeklyMcqLocked && { opacity: 0.5 }]}
            onPress={onOpenMcq}
          >
            <Text style={styles.homeNavButtonText}>
              Multiple Choice Game{weeklyMcqLocked ? " ✓ (låst til næste uge)" : ""}
            </Text>
          </Pressable>

          {/* Match */}
          <Pressable
            style={[styles.homeNavButton, weeklyMatchLocked && { opacity: 0.5 }]}
            onPress={onOpenMatch}
          >
            <Text style={styles.homeNavButtonText}>
              Match Game {weeklyMatchLocked ? " ✓ (låst til næste uge)" : ""}
            </Text>
          </Pressable>

          {/* Word */}
          <Pressable
            style={[styles.homeNavButton, weeklyWordLocked && { opacity: 0.5 }]}
            onPress={onOpenWord}
          >
            <Text style={styles.homeNavButtonText}>
              Word of the Week {weeklyWordLocked ? " ✓ (låst til næste uge)" : ""}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
export default WeeklyHomeScreen;
