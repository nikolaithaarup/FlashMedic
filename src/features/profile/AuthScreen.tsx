import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import {
  Card,
  NoticeCard,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from "../../ui/primitives";

function makeRandomAnonName() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `Bruger${n}`;
}

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  suggestedAnonName?: string;
  onContinueAnonymous: (nickname: string) => void;
  onCreateProfile: (nickname: string) => void;
};

export default function AuthScreen({
  suggestedAnonName,
  onContinueAnonymous,
  onCreateProfile,
}: Props) {
  const defaultAnon = useMemo(
    () => suggestedAnonName ?? makeRandomAnonName(),
    [suggestedAnonName],
  );
  const [nickname, setNickname] = useState("");
  const [focused, setFocused] = useState(false);

  const handleAnon = () => {
    onContinueAnonymous(defaultAnon);
  };

  const handleCreate = () => {
    const name = nickname.trim();
    if (!name) {
      Alert.alert("Navn mangler", "Skriv et kaldenavn (fx ParamedNick).");
      return;
    }
    onCreateProfile(name);
  };

  return (
    <Screen>
      <StatusBar style="light" />

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>VELKOMMEN TIL</Text>
        <Text style={styles.title}>FlashMedic</Text>
        <Text style={styles.subtitle}>
          Vælg, hvordan du vil fremstå i statistik og på leaderboardet.
        </Text>
      </View>

      <NoticeCard title="En enkel lokal profil">
        Ingen e-mail er nødvendig. Din profil knyttes til et anonymt Firebase-ID
        på enheden.
      </NoticeCard>

      <Text style={styles.sectionLabel}>FORTSÆT HURTIGT</Text>
      <Card variant="subtle" style={styles.card}>
        <View style={styles.cardCopy}>
          <Text style={styles.cardTitle}>Fortsæt anonymt</Text>
          <Text style={styles.cardDescription}>
            Du får automatisk navnet {defaultAnon}. Det kan ændres senere.
          </Text>
        </View>
        <SecondaryButton
          label="Fortsæt anonymt"
          onPress={handleAnon}
          style={styles.cardAction}
        />
      </Card>

      <Text style={styles.sectionLabel}>VÆLG DIT NAVN</Text>
      <Card variant="subtle" style={styles.card}>
        <Text style={styles.cardTitle}>Opret profil</Text>
        <Text style={styles.cardDescription}>
          Kaldenavnet vises på leaderboardet og kan altid ændres under Profil.
        </Text>

        <Text style={styles.inputLabel}>Kaldenavn</Text>
        <TextInput
          accessibilityLabel="Kaldenavn"
          autoCapitalize="none"
          onBlur={() => setFocused(false)}
          onChangeText={setNickname}
          onFocus={() => setFocused(true)}
          placeholder="Fx ParamedNick"
          placeholderTextColor={ColorTokens.text.muted}
          returnKeyType="done"
          style={[styles.input, focused && styles.inputFocused]}
          value={nickname}
        />

        <PrimaryButton
          label="Opret profil"
          onPress={handleCreate}
          style={styles.cardAction}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: Spacing.xl, paddingBottom: Spacing.xl },
  eyebrow: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 1,
  },
  title: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.heroTitle,
    lineHeight: Typography.lineHeights.heroTitle,
    fontWeight: Typography.weights.heavy,
    marginTop: Spacing.xs,
  },
  subtitle: {
    maxWidth: 560,
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    marginTop: Spacing.sm,
  },
  sectionLabel: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.8,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  card: { gap: Spacing.sm },
  cardCopy: { gap: Spacing.xs },
  cardTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  cardDescription: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  inputLabel: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
    marginTop: Spacing.xs,
  },
  input: {
    minHeight: Interaction.minimumTouchTarget,
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.body,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputFocused: {
    borderColor: ColorTokens.interaction.focus,
    backgroundColor: ColorTokens.accent.surface,
  },
  cardAction: { marginTop: Spacing.sm },
});
