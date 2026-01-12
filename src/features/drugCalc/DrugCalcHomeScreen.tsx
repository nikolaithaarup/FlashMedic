import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../../app/flashmedicStyles";

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;

  onBackHome: () => void; // usually setScreen("home")
  onStartPractice: () => void; // your startDrugCalcPractice
  onOpenTheory: () => void; // setScreen("drugCalcTheory")
};

export function DrugCalcHomeScreen({
  headingFont,
  subtitleFont,
  buttonFont,
  onBackHome,
  onStartPractice,
  onOpenTheory,
}: Props) {
  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Lægemiddelregning
          </Text>
          <Pressable
            style={[styles.smallButton, { borderColor: "#fff" }]}
            onPress={onBackHome}
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
          Træn doser, styrker, mængder og procentregning.
        </Text>

        <View style={styles.homeButtonsContainer}>
          <Pressable style={styles.homeNavButton} onPress={onStartPractice}>
            <Text style={styles.homeNavButtonText}>Opgaver</Text>
          </Pressable>
          <Pressable style={styles.homeNavButton} onPress={onOpenTheory}>
            <Text style={styles.homeNavButtonText}>Teori</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default DrugCalcHomeScreen;
