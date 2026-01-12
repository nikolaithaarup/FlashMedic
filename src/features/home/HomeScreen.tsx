// src/features/home/HomeScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../../app/flashmedicStyles";

export default function HomeScreen({
  headingFont,
  subtitleFont,
  loadingCards,
  loadError,
  profileNickname,
  profileIsAnonymous,
  classLabel,
  appLogo,

  onOpenProfile,
  onOpenWeeklyHome,
  onOpenWeeklyDev,
  onOpenFlashcardsHome,
  onStartAllSubjectsQuiz,
  onOpenDrugCalcHome,
  onOpenStats,
  onOpenContact,
  disableAllSubjectsQuiz,
}: {
  headingFont: number;
  subtitleFont: number;

  loadingCards: boolean;
  loadError: string | null;

  profileNickname: string | null;
  profileIsAnonymous: boolean;
  classLabel: string;

  appLogo: any;

  onOpenProfile: () => void;
  onOpenWeeklyHome: () => void;
  onOpenWeeklyDev: () => void;
  onOpenFlashcardsHome: () => void;
  onStartAllSubjectsQuiz: () => void;
  onOpenDrugCalcHome: () => void;
  onOpenStats: () => void;
  onOpenContact: () => void;

  disableAllSubjectsQuiz: boolean;
}) {
  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        {/* Top row: profile badge */}
        <View style={styles.homeTopRow}>
          <View style={{ flex: 1 }} />
          <Pressable
            style={[styles.profileBadge, profileIsAnonymous && styles.profileBadgeAnon]}
            onPress={onOpenProfile}
            hitSlop={16}
          >
            <Text style={styles.profileBadgeText}>
              {profileIsAnonymous ? "Opret profil" : profileNickname ?? "Profil"}
            </Text>

            {!profileIsAnonymous && classLabel ? (
              <Text style={styles.profileBadgeSub}>{classLabel}</Text>
            ) : null}
          </Pressable>
        </View>

        {/* Icon + title */}
        <Image source={appLogo} style={styles.appLogo} />
        <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>
          FlashMedic
        </Text>

        {loadingCards ? (
          <Text style={[styles.subtitle, { fontSize: subtitleFont, color: "#e9ecef" }]}>
            Indlæser kort fra serveren…
          </Text>
        ) : loadError ? (
          <Text style={[styles.subtitle, { fontSize: subtitleFont, color: "#ffdddd" }]}>
            {loadError}
          </Text>
        ) : (
          <Text style={[styles.subtitle, { fontSize: subtitleFont, color: "#e9ecef" }]}>
            Træn medicin, anatomi, EKG og meget mere.
          </Text>
        )}

        {/* Big centered nav buttons */}
        <View style={styles.homeButtonsContainer}>
          <Pressable
            style={styles.homeNavButton}
            onPress={onOpenWeeklyHome}
            onLongPress={onOpenWeeklyDev}
            delayLongPress={800}
          >
            <Text style={styles.homeNavButtonText}>Weekly Challenges</Text>
          </Pressable>

          <Pressable style={styles.homeNavButton} onPress={onOpenFlashcardsHome}>
            <Text style={styles.homeNavButtonText}>Flashcards</Text>
          </Pressable>

          <Pressable
            style={styles.homeNavButton}
            onPress={onStartAllSubjectsQuiz}
            disabled={disableAllSubjectsQuiz}
          >
            <Text style={styles.homeNavButtonText}>Flashcards i alle fag</Text>
          </Pressable>

          <Pressable style={styles.homeNavButton} onPress={onOpenDrugCalcHome}>
            <Text style={styles.homeNavButtonText}>Lægemiddelregning</Text>
          </Pressable>

          <Pressable style={styles.homeNavButton} onPress={onOpenStats}>
            <Text style={styles.homeNavButtonText}>Statistik</Text>
          </Pressable>

          <Pressable style={styles.homeNavButton} onPress={onOpenContact}>
            <Text style={styles.homeNavButtonText}>Kontakt</Text>
          </Pressable>
        </View>

        {/* Made by – ONLY on home */}
        <Text style={styles.madeByText}>Made by Nikolai Louis Kleftås Thaarup</Text>
      </ScrollView>
    </LinearGradient>
  );
}
