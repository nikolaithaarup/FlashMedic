import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import {
  Background,
  BrandLockup,
  NavigationCard,
  SectionHeader,
} from "../../ui/primitives";

type HomeScreenProps = {
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
  onOpenWeeklyDev?: () => void;
  onStartDailyTen: () => void;
  dailyTenDisabled: boolean;
  dailyTenCount: number;
  onOpenFlashcardsHome: () => void;
  onOpenDrugCalcHome: () => void;
  onOpenEkgTraining: () => void;
  onOpenBloodGasTraining: () => void;
  onOpenStats: () => void;
  onOpenContact: () => void;
};

// Web safe areas are already applied in app/+html.tsx.
// Native screens still use react-native-safe-area-context.
const ContentSafeArea = Platform.OS === "web" ? View : SafeAreaView;

export default function HomeScreen({
  subtitleFont: _subtitleFont,
  loadingCards,
  loadError,
  profileNickname,
  profileIsAnonymous,
  onOpenProfile,
  onOpenWeeklyHome,
  onOpenWeeklyDev,
  onStartDailyTen,
  dailyTenDisabled,
  onOpenFlashcardsHome,
  onOpenDrugCalcHome,
  onOpenEkgTraining,
  onOpenBloodGasTraining,
  onOpenStats,
  onOpenContact,
}: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const [availableWidth, setAvailableWidth] = React.useState<number | null>(null);
  const layoutWidth = Platform.OS === "web" && availableWidth !== null ? availableWidth : width;
  const isPhone = layoutWidth < 700;
  const twoColumns = layoutWidth >= 900;
  const moduleWidth = twoColumns ? "48%" : "100%";

  return (
    <Background variant="home">
      <StatusBar style="light" />
      <ContentSafeArea
        style={styles.safeArea}
        onLayout={Platform.OS === "web" ? (event) => {
          const measured = event.nativeEvent.layout.width;
          if (measured > 0) {
            setAvailableWidth((current) =>
              current === null || Math.abs(current - measured) > 1 ? measured : current,
            );
          }
        } : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Pressable
              accessibilityLabel={`Åbn profil for ${profileNickname ?? "Profil"}`}
              accessibilityRole="button"
              hitSlop={Spacing.sm}
              onPress={onOpenProfile}
              style={({ pressed }) => [
                styles.profileButton,
                pressed && styles.profilePressed,
              ]}
            >
              <Feather name="user" size={19} color={ColorTokens.text.primary} />
            </Pressable>
            <BrandLockup compact={isPhone} />
            <Text testID="flash-home-tagline" style={styles.tagline}>
              Korte øvelser. Skarpere faglighed.
            </Text>
          </View>

          {profileIsAnonymous ? (
            <Pressable
              accessibilityLabel="Log ind med e-mail og synkroniser din fremgang"
              accessibilityRole="button"
              onPress={onOpenProfile}
              style={({ pressed }) => [
                styles.guestLoginAction,
                pressed && styles.profilePressed,
              ]}
            >
              <Feather name="cloud" size={20} color={ColorTokens.accent.focus} />
              <View style={styles.guestLoginCopy}>
                <Text style={styles.guestLoginTitle}>Log ind med e-mail</Text>
                <Text style={styles.guestLoginHint}>Gem din fremgang på tværs af enheder</Text>
              </View>
              <Feather name="chevron-right" size={20} color={ColorTokens.text.secondary} />
            </Pressable>
          ) : null}

          {loadingCards ? (
            <View style={styles.statusSurface}>
              <Text style={styles.statusText}>Henter kort…</Text>
            </View>
          ) : loadError ? (
            <View style={[styles.statusSurface, styles.errorSurface]}>
              <Text style={styles.errorText}>{loadError}</Text>
            </View>
          ) : null}

          <SectionHeader
            compact={isPhone}
            label="TRÆNING"
            style={styles.trainingHeader}
          />

          <View style={styles.destinationList}>
            <NavigationCard
              onPress={onOpenFlashcardsHome}
              style={[styles.destinationCard, { width: moduleWidth }]}
              title="Flashcards"
            />
            <NavigationCard
              disabled={dailyTenDisabled}
              onPress={onStartDailyTen}
              style={[styles.destinationCard, { width: moduleWidth }]}
              title="Daily10"
            />
            <NavigationCard
              delayLongPress={onOpenWeeklyDev ? 800 : undefined}
              onLongPress={onOpenWeeklyDev}
              onPress={onOpenWeeklyHome}
              style={[styles.destinationCard, { width: moduleWidth }]}
              title="Ugens udfordringer"
            />
            <NavigationCard
              onPress={onOpenDrugCalcHome}
              style={[styles.destinationCard, { width: moduleWidth }]}
              title="Lægemiddelregning"
            />
            <NavigationCard
              onPress={onOpenEkgTraining}
              style={[styles.destinationCard, { width: moduleWidth }]}
              title="EKG-træning"
            />
            <NavigationCard
              onPress={onOpenBloodGasTraining}
              style={[styles.destinationCard, { width: moduleWidth }]}
              title="VGAS & CRP"
            />
          </View>

          <SectionHeader label="APP & SUPPORT" compact={isPhone} style={styles.secondaryHeader} />

          <View style={styles.supportList}>
            <NavigationCard
              onPress={onOpenStats}
              secondary
              style={[styles.supportCard, { width: moduleWidth }]}
              title="Statistik"
            />
            <NavigationCard
              onPress={onOpenContact}
              secondary
              style={[styles.supportCard, { width: moduleWidth }]}
              title="Kontakt"
            />
          </View>

          <View testID="home-synapsestudio-footer" style={styles.attribution}>
            <Text style={styles.partOf}>Part of</Text>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Besøg SynapseStudio"
              hitSlop={8}
              onPress={() => { void Linking.openURL("https://synapsestudio.dk"); }}
              style={({ pressed }) => [styles.studioLink, pressed && { opacity: 0.75 }]}
            >
              <Image
                source={require("../../../assets/synapsestudio-logo-white.png")}
                resizeMode="contain"
                style={styles.studioLogo}
              />
            </Pressable>
          </View>
        </ScrollView>
      </ContentSafeArea>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, width: "100%", minWidth: 0 },
  content: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  profileButton: {
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 2,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
  },
  profilePressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.controlPressedScale }],
  },
  hero: {
    width: "100%",
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 4,
    gap: 0,
  },
  tagline: {
    marginTop: -3,
    textAlign: "center",
    color: ColorTokens.text.secondary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  guestLoginAction: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    minHeight: Interaction.minimumTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: Borders.hairline,
    borderBottomColor: ColorTokens.border.divider,
    marginBottom: Spacing.sm,
  },
  guestLoginCopy: { flex: 1, minWidth: 0 },
  guestLoginTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
  },
  guestLoginHint: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  trainingHeader: { marginTop: 12, marginBottom: 7 },
  secondaryHeader: { marginTop: 15, marginBottom: 7 },
  statusSurface: {
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.subtle,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorSurface: { borderColor: ColorTokens.semantic.danger },
  statusText: { color: ColorTokens.text.secondary, textAlign: "center" },
  errorText: { color: ColorTokens.text.primary, textAlign: "center" },
  destinationList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: 7,
  },
  destinationCard: { minWidth: 0, flexGrow: 1, flexShrink: 1, minHeight: 52 },
  supportList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: 7,
  },
  supportCard: { minWidth: 0, flexGrow: 1, flexShrink: 1, minHeight: 52 },
  attribution: {
    alignItems: "center",
    gap: 8,
    marginTop: Spacing.xl,
  },
  partOf: {
    color: ColorTokens.text.secondary,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.1,
    fontWeight: "600",
    textAlign: "center",
  },
  studioLink: {
    minHeight: 44,
    minWidth: 164,
    alignItems: "center",
    justifyContent: "center",
  },
  studioLogo: { width: 164, height: 44 },
});
