// app/home.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import { useFlashcards } from "../features/flashcards/useFlashcards"; // <-- we’ll create
import { useProfile } from "../features/profile/useProfile"; // <-- we’ll create
import { styles } from "../ui/flashmedicStyles";

const APP_LOGO = require("../assets/her-icon.png");

export default function HomeScreen() {
  const router = useRouter();

  const { profile, classLabel } = useProfile();
  const { cards, loadingCards, loadError, startAllSubjectsQuiz } =
    useFlashcards();

  return (
    <LinearGradient
      colors={["#0e91a8ff", "#5e6e7eff"]}
      style={styles.homeBackground}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        {/* Top row: profile badge */}
        <View style={styles.homeTopRow}>
          <View style={{ flex: 1 }} />
          <Pressable
            style={[
              styles.profileBadge,
              profile?.isAnonymous && styles.profileBadgeAnon,
            ]}
            onPress={() => router.push("/profile")}
            hitSlop={16}
          >
            <Text style={styles.profileBadgeText}>
              {profile?.isAnonymous ? "Opret profil" : profile?.nickname}
            </Text>
            {!profile?.isAnonymous && classLabel ? (
              <Text style={styles.profileBadgeSub}>{classLabel}</Text>
            ) : null}
          </Pressable>
        </View>

        {/* Icon + title */}
        <Image source={APP_LOGO} style={styles.appLogo} />
        <Text style={[styles.appTitle, { color: "#f8f9fa" }]}>FlashMedic</Text>

        {loadingCards ? (
          <Text style={[styles.subtitle, { color: "#e9ecef" }]}>
            Indlæser kort fra serveren…
          </Text>
        ) : loadError ? (
          <Text style={[styles.subtitle, { color: "#ffdddd" }]}>
            {loadError}
          </Text>
        ) : (
          <Text style={[styles.subtitle, { color: "#e9ecef" }]}>
            Træn medicin, anatomi, EKG og meget mere.
          </Text>
        )}

        {/* Big centered nav buttons */}
        <View style={styles.homeButtonsContainer}>
          <Pressable
            style={styles.homeNavButton}
            onPress={() => router.push("/weekly")}
            onLongPress={() => router.push("/weekly-dev")}
            delayLongPress={800}
          >
            <Text style={styles.homeNavButtonText}>Weekly Challenges</Text>
          </Pressable>

          <Pressable
            style={styles.homeNavButton}
            onPress={() => router.push("/flashcards")}
          >
            <Text style={styles.homeNavButtonText}>Flashcards</Text>
          </Pressable>

          <Pressable
            style={styles.homeNavButton}
            onPress={startAllSubjectsQuiz}
            disabled={loadingCards || cards.length === 0}
          >
            <Text style={styles.homeNavButtonText}>Flashcards i alle fag</Text>
          </Pressable>

          <Pressable
            style={styles.homeNavButton}
            onPress={() => router.push("/drugcalc")}
          >
            <Text style={styles.homeNavButtonText}>Lægemiddelregning</Text>
          </Pressable>

          <Pressable
            style={styles.homeNavButton}
            onPress={() => router.push("/stats")}
          >
            <Text style={styles.homeNavButtonText}>Statistik</Text>
          </Pressable>

          <Pressable
            style={styles.homeNavButton}
            onPress={() => router.push("/contact")}
          >
            <Text style={styles.homeNavButtonText}>Kontakt</Text>
          </Pressable>
        </View>

        <Text style={styles.madeByText}>
          Made by Nikolai Louis Kleftås Thaarup
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}
