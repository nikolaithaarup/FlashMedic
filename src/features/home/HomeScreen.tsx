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
import {
  Background,
  NavigationCard,
  SectionHeader,
} from "../../ui/primitives";

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
  const isPhone = width < 600;
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

          <View style={[styles.hero, isPhone && styles.heroPhone]}>
            <Image
              accessibilityIgnoresInvertColors
              accessibilityLabel="FlashMedic ikon"
              resizeMode="contain"
              source={appLogo}
              style={[styles.appLogo, isPhone && styles.appLogoPhone]}
            />
            <Image
              accessibilityLabel="FlashMedic"
              resizeMode="contain"
              source={titleLogo}
              style={[
                styles.wordmark,
                isPhone && styles.wordmarkPhone,
                { width: titleWidth },
              ]}
            />
            <Text style={[styles.subtitle, { fontSize: subtitleFont }]}>
              Ambulancefag, flashcards og klinisk repetition.
            </Text>
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
            label="LÆRING"
            title="Hvad vil du træne?"
          />

          <View style={styles.destinationList}>
            <NavigationCard
              description="Træn ambulancefag og de emner, du har sværest ved."
              eyebrow="KERNETRÆNING"
              onPress={onOpenFlashcardsHome}
              title="FlashMedic"
            />
            <NavigationCard
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
            <NavigationCard
              description="Ugentlig tematræning og let konkurrence."
              delayLongPress={onOpenWeeklyDev ? 800 : undefined}
              eyebrow="UGENTLIGT"
              onLongPress={onOpenWeeklyDev}
              onPress={onOpenWeeklyHome}
              title="Ugens udfordringer"
            />
            <NavigationCard
              description="Træn doseringer, enheder og beregninger."
              eyebrow="BEREGNING"
              onPress={onOpenDrugCalcHome}
              title="Lægemiddelregning"
            />
            <NavigationCard
              description="Lær rytmeanalyse trin for trin og træn akutte rytmer."
              eyebrow="RYTME OG TEORI"
              onPress={onOpenEkgTraining}
              title="EKG-træning"
            />
            <NavigationCard
              description="Træn tolkning af VGAS, elektrolytter, laktat og CRP."
              eyebrow="AVANCERET"
              onPress={onOpenBloodGasTraining}
              title="VGAS & CRP"
            />
          </View>

          <SectionHeader label="SUPPORT" title="Din fremgang og hjælp" />

          <View style={styles.supportList}>
            <NavigationCard
              description="Se din fremgang"
              onPress={onOpenStats}
              secondary
              title="Statistik"
            />
            <NavigationCard
              description="Ris, ros og hjælp"
              onPress={onOpenContact}
              secondary
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
  heroPhone: {
    paddingTop: 2,
    paddingBottom: Spacing.sm,
  },
  appLogo: { width: 140, height: 64, marginBottom: Spacing.sm },
  appLogoPhone: { width: 104, height: 46, marginBottom: 2 },
  wordmark: { height: 76, maxWidth: "100%" },
  wordmarkPhone: { height: 38 },
  subtitle: {
    color: ColorTokens.text.secondary,
    lineHeight: Typography.lineHeights.body,
    textAlign: "center",
    marginTop: 2,
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
  destinationList: { gap: Spacing.sm },
  supportList: { gap: Spacing.xs },
  attribution: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    textAlign: "center",
    opacity: 0.7,
    marginTop: Spacing.xl,
  },
});
