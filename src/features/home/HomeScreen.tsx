import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Image,
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
import { Background, Card } from "../../ui/primitives";

const titleLogo = require("../../../assets/flashmedic-logo.png");

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
  onOpenWeeklyDev: () => void;
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

type DestinationCardProps = {
  title: string;
  description: string;
  eyebrow: string;
  onPress: () => void;
  onLongPress?: () => void;
  delayLongPress?: number;
  disabled?: boolean;
};

function DestinationCard({
  title,
  description,
  eyebrow,
  onPress,
  onLongPress,
  delayLongPress,
  disabled = false,
}: DestinationCardProps) {
  return (
    <Pressable
      accessibilityLabel={`${title}. ${description}`}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      delayLongPress={delayLongPress}
      disabled={disabled}
      onLongPress={onLongPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.destinationPressable,
        pressed && !disabled && styles.destinationPressed,
        disabled && styles.disabled,
      ]}
    >
      <Card variant="subtle" style={styles.destinationCard}>
        <View style={styles.destinationCopy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.destinationTitle}>{title}</Text>
          <Text style={styles.destinationDescription}>{description}</Text>
        </View>
        <Text style={styles.chevron} accessibilityElementsHidden>
          ›
        </Text>
      </Card>
    </Pressable>
  );
}

export default function HomeScreen({
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
  onStartDailyTen,
  dailyTenDisabled,
  dailyTenCount,
  onOpenFlashcardsHome,
  onOpenDrugCalcHome,
  onOpenEkgTraining,
  onOpenBloodGasTraining,
  onOpenStats,
  onOpenContact,
}: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const titleWidth = Math.min(360, Math.max(220, width - Spacing.xl * 2));

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
              <View style={styles.profileText}>
                <Text style={styles.profileName}>
                  {profileNickname ?? "Profil"}
                </Text>
                {!profileIsAnonymous && classLabel ? (
                  <Text style={styles.profileMeta}>{classLabel}</Text>
                ) : null}
              </View>
              <Text style={styles.profileChevron} accessibilityElementsHidden>
                ›
              </Text>
            </Pressable>
          </View>

          <View style={styles.hero}>
            <Image
              accessibilityIgnoresInvertColors
              accessibilityLabel="FlashMedic ikon"
              source={appLogo}
              style={styles.appLogo}
            />
            <Image
              accessibilityLabel="FlashMedic"
              resizeMode="contain"
              source={titleLogo}
              style={[styles.wordmark, { width: titleWidth }]}
            />
            <Text style={[styles.subtitle, { fontSize: subtitleFont }]}>
              Ambulancefag, flashcards og klinisk repetition.
            </Text>
          </View>

          {loadingCards ? (
            <View style={styles.statusSurface}>
              <Text style={styles.statusText}>Indlæser kort fra serveren...</Text>
            </View>
          ) : loadError ? (
            <View style={[styles.statusSurface, styles.errorSurface]}>
              <Text style={styles.errorText}>{loadError}</Text>
            </View>
          ) : null}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>LÆRING</Text>
            <Text style={styles.sectionTitle}>Vælg din læringsvej</Text>
          </View>

          <View style={styles.destinationList}>
            <DestinationCard
              description="Træn ambulancefag, emner og svage punkter med flashcards."
              eyebrow="KERNETRÆNING"
              onPress={onOpenFlashcardsHome}
              title="FlashMedic"
            />
            <DestinationCard
              description={
                dailyTenCount >= 10
                  ? "Din daglige fokuserede repetition."
                  : `${dailyTenCount} kort klar i dag.`
              }
              disabled={dailyTenDisabled}
              eyebrow="DAGLIGT"
              onPress={onStartDailyTen}
              title="Daily10"
            />
            <DestinationCard
              description="Ugentlig tematræning og let konkurrence."
              delayLongPress={800}
              eyebrow="UGENTLIGT"
              onLongPress={onOpenWeeklyDev}
              onPress={onOpenWeeklyHome}
              title="Weekly Challenges"
            />
            <DestinationCard
              description="Træn doseringer, enheder og beregninger."
              eyebrow="BEREGNING"
              onPress={onOpenDrugCalcHome}
              title="Lægemiddelregning"
            />
            <DestinationCard
              description="Lær rytmeanalyse trin for trin og træn akutte rytmer."
              eyebrow="RYTME OG TEORI"
              onPress={onOpenEkgTraining}
              title="EKG-træning"
            />
            <DestinationCard
              description="Træn præhospital tolkning af syre-base, elektrolytter, laktat, glukose og inflammation."
              eyebrow="AVANCERET"
              onPress={onOpenBloodGasTraining}
              title="VGAS & CRP"
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEyebrow}>SUPPORT</Text>
            <Text style={styles.sectionTitle}>Progression og hjælp</Text>
          </View>

          <View style={styles.utilityRow}>
            <Pressable
              accessibilityRole="button"
              onPress={onOpenStats}
              style={({ pressed }) => [
                styles.utilityButton,
                pressed && styles.utilityPressed,
              ]}
            >
              <Text style={styles.utilityTitle}>Statistik</Text>
              <Text style={styles.utilityDescription}>Se din fremgang</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onOpenContact}
              style={({ pressed }) => [
                styles.utilityButton,
                pressed && styles.utilityPressed,
              ]}
            >
              <Text style={styles.utilityTitle}>Kontakt</Text>
              <Text style={styles.utilityDescription}>Ris, ros og hjælp</Text>
            </Pressable>
          </View>

          <Text style={styles.attribution}>
            Made by Nikolai Louis Kleftås Thaarup
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
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  profileRow: {
    minHeight: Interaction.minimumTouchTarget,
    alignItems: "flex-end",
    marginTop: Spacing.xs,
  },
  profileButton: {
    minHeight: Interaction.minimumTouchTarget,
    maxWidth: "75%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
  },
  profilePressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.controlPressedScale }],
  },
  profileText: { minWidth: 0, flexShrink: 1 },
  profileName: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  profileMeta: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  profileChevron: {
    color: ColorTokens.text.secondary,
    fontSize: 24,
    marginLeft: Spacing.xs,
  },
  hero: {
    alignItems: "center",
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  appLogo: { width: 88, height: 88, marginBottom: Spacing.sm },
  wordmark: { height: 76, maxWidth: "100%" },
  subtitle: {
    color: ColorTokens.text.secondary,
    lineHeight: Typography.lineHeights.body,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
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
  sectionHeader: { marginTop: Spacing.md, marginBottom: Spacing.sm },
  sectionEyebrow: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.9,
  },
  sectionTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  destinationList: { gap: Spacing.sm },
  destinationPressable: { width: "100%" },
  destinationPressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.cardPressedScale }],
  },
  disabled: { opacity: Interaction.disabledOpacity },
  destinationCard: {
    minHeight: 108,
    flexDirection: "row",
    alignItems: "center",
    borderColor: ColorTokens.border.default,
    padding: Spacing.lg,
  },
  destinationCopy: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.7,
  },
  destinationTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
    marginTop: 3,
  },
  destinationDescription: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    marginTop: Spacing.xs,
  },
  chevron: {
    color: ColorTokens.accent.muted,
    fontSize: 32,
    lineHeight: 34,
    marginLeft: Spacing.md,
  },
  utilityRow: { flexDirection: "row", gap: Spacing.sm },
  utilityButton: {
    flex: 1,
    minHeight: 84,
    justifyContent: "center",
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    padding: Spacing.md,
  },
  utilityPressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.cardPressedScale }],
  },
  utilityTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
  },
  utilityDescription: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    marginTop: 2,
  },
  attribution: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    textAlign: "center",
    opacity: 0.7,
    marginTop: Spacing.xl,
  },
});
