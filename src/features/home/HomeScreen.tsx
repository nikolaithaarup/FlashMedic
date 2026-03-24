// src/features/home/HomeScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { styles } from "../../ui/flashmedicStyles";

// ✅ Title logo (wordmark) from /assets
const titleLogo = require("../../../assets/flashmedic-logo.png");

function getAssetUri(asset: any): string | null {
  // On native/Expo, require(...) often has a .uri or can be coerced to an object with uri.
  // On web, sometimes it's a string URL, sometimes an object. We'll handle both.
  if (!asset) return null;
  if (typeof asset === "string") return asset;
  if (typeof asset === "object" && typeof asset.uri === "string")
    return asset.uri;
  return null;
}

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
  // --- Auto aspect ratio for titleLogo (web-safe) ---
  const [titleRatio, setTitleRatio] = React.useState<number>(3); // fallback

  React.useEffect(() => {
    // Try to obtain a URI for getSize()
    const maybeUri = getAssetUri(titleLogo);

    if (maybeUri) {
      Image.getSize(
        maybeUri,
        (w, h) => {
          if (w > 0 && h > 0) setTitleRatio(w / h);
        },
        () => {
          // keep fallback ratio if getSize fails
        },
      );
      return;
    }

    // If we don't have a URI (some bundler edge cases), we just keep fallback.
  }, []);

  // --- Sizing based on device width (reliable) ---
  const screenWidth = Dimensions.get("window").width;

  // 🔧 Tweak this number for size:
  const titleWidth = Math.round(screenWidth * 0.8); // 0.6–0.95 feels sane for phones/tablets
  const titleHeight = Math.max(24, Math.round(titleWidth / titleRatio));

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
              profileIsAnonymous && styles.profileBadgeAnon,
            ]}
            onPress={onOpenProfile}
            hitSlop={16}
          >
            <Text style={styles.profileBadgeText}>
              {profileNickname ?? "Profil"}
            </Text>

            {!profileIsAnonymous && classLabel ? (
              <Text style={styles.profileBadgeSub}>{classLabel}</Text>
            ) : null}
          </Pressable>
        </View>

        {/* Icon + title */}
        <Image source={appLogo} style={styles.appLogo} />

        {/* ✅ Replace FlashMedic text with the logo title image (auto aspect ratio) */}
        <Image
          source={titleLogo}
          resizeMode="contain"
          accessibilityLabel="FlashMedic"
          style={{
            width: titleWidth,
            height: titleHeight,
            alignSelf: "center",
            marginTop: 6,
            marginBottom: 6,
          }}
        />

        {loadingCards ? (
          <Text
            style={[
              styles.subtitle,
              { fontSize: subtitleFont, color: "#e9ecef" },
            ]}
          >
            Indlæser kort fra serveren…
          </Text>
        ) : loadError ? (
          <Text
            style={[
              styles.subtitle,
              { fontSize: subtitleFont, color: "#ffdddd" },
            ]}
          >
            {loadError}
          </Text>
        ) : (
          <Text
            style={[
              styles.subtitle,
              { fontSize: subtitleFont, color: "#e9ecef" },
            ]}
          >
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

          <Pressable
            style={styles.homeNavButton}
            onPress={onOpenFlashcardsHome}
          >
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
        <Text style={styles.madeByText}>
          Made by Nikolai Louis Kleftås Thaarup
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}
