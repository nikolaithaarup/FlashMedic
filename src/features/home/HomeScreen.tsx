import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
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

export default function HomeScreen({
  subtitleFont: _subtitleFont,
  loadingCards,
  loadError,
  profileNickname,
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
  const isPhone = width < 700;
  const twoColumns = width >= 900;
  const moduleWidth = twoColumns ? "48%" : "100%";

  return (
    <Background variant="home">
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileRow}>
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
              <Feather name="user" size={22} color={ColorTokens.text.primary} />
            </Pressable>
          </View>

          <View style={styles.hero}>
            <BrandLockup compact={isPhone} />
          </View>

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

          <SectionHeader label="MERE" />

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

          <Text style={styles.attribution}>
            Udviklet af Nikolai Louis Kleftås Thaarup
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  profileRow: {
    minHeight: Interaction.minimumTouchTarget,
    alignItems: "flex-end",
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  profileButton: {
    width: Interaction.minimumTouchTarget,
    height: Interaction.minimumTouchTarget,
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
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: Spacing.xs,
  },
  trainingHeader: { marginTop: Spacing.xs, marginBottom: Spacing.sm },
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
    gap: Spacing.sm,
  },
  destinationCard: { minWidth: 0, flexGrow: 1, flexShrink: 1, minHeight: 52 },
  supportList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: Spacing.xs,
  },
  supportCard: { minWidth: 0, flexGrow: 1, flexShrink: 1, minHeight: 52 },
  attribution: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    textAlign: "center",
    opacity: 0.7,
    marginTop: Spacing.xl,
  },
});
