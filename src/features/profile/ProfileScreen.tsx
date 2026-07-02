import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  SemanticStates,
  Spacing,
  Typography,
} from "../../../constants/theme";
import {
  Card,
  NoticeCard,
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";
import {
  clearStoredProfile,
  saveStoredProfile,
  type StoredUserProfile,
} from "../../services/userService";

function makeRandomAnonName() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `Bruger${n}`;
}

type UserProfile = {
  userId: string | null;
  nickname: string;
  isAnonymous: boolean;
};

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  firebaseUid: string | null;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  onBack: () => void;
};

export default function ProfileScreen({
  firebaseUid,
  profile,
  setProfile,
  onBack,
}: Props) {
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setNickname(profile?.nickname ?? "");
  }, [profile?.nickname]);

  const save = useCallback(async () => {
    const name = nickname.trim();
    if (!name) {
      Alert.alert(
        "Navn mangler",
        "Skriv et kaldenavn (eller nulstil til anonym).",
      );
      return;
    }
    if (!firebaseUid) {
      Alert.alert("Ingen userId endnu", "Vent et øjeblik og prøv igen.");
      return;
    }

    const updated: UserProfile = {
      userId: firebaseUid,
      nickname: name,
      isAnonymous: false,
    };
    setProfile(updated);

    const toStore: StoredUserProfile = {
      userId: firebaseUid,
      nickname: name,
      isAnonymous: false,
    };
    await saveStoredProfile(toStore);

    Alert.alert("Gemt ✅", "Dit kaldenavn er opdateret.");
    onBack();
  }, [firebaseUid, nickname, onBack, setProfile]);

  const resetLocalProfile = useCallback(() => {
    Alert.alert(
      "Nulstil profil?",
      "Dette sletter din lokale profil og laver en ny anonym profil med nyt navn.",
      [
        { text: "Annuller", style: "cancel" },
        {
          text: "Nulstil",
          style: "destructive",
          onPress: async () => {
            await clearStoredProfile();
            const newNick = makeRandomAnonName();
            const next: UserProfile = {
              userId: firebaseUid,
              nickname: newNick,
              isAnonymous: true,
            };
            setProfile(next);
            setNickname(newNick);

            const toStore: StoredUserProfile = {
              userId: firebaseUid,
              nickname: newNick,
              isAnonymous: true,
            };
            await saveStoredProfile(toStore);
            Alert.alert("Nulstil ✅", `Ny anonym profil: ${newNick}`);
          },
        },
      ],
    );
  }, [firebaseUid, setProfile]);

  return (
    <Screen>
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBack}
        subtitle="Identitet og lokal profil"
        title="Profil"
      />

      <NoticeCard title="Sådan bruges din profil">
        Dit officielle Firebase-ID forbinder resultater med global statistik.
        Kaldenavnet er det navn, andre kan se.
      </NoticeCard>

      <Text style={styles.sectionLabel}>PROFILOPLYSNINGER</Text>
      <Card variant="subtle" style={styles.profileCard}>
        <Text style={styles.identityLabel}>Official User ID</Text>
        <Text selectable style={styles.identityValue}>
          {firebaseUid ?? "—"}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.inputLabel}>Nickname (valgfri)</Text>
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
        <Text style={styles.inputHelp}>
          Navnet gemmes lokalt og bruges fremover på leaderboardet.
        </Text>
        <PrimaryButton label="Gem nickname" onPress={save} />

        <SecondaryButton
          label="Nulstil profil"
          onPress={resetLocalProfile}
          style={styles.resetButton}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.8,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  profileCard: { gap: Spacing.sm, marginBottom: Spacing.lg },
  identityLabel: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
  },
  identityValue: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.mono,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.body,
  },
  divider: {
    height: Borders.hairline,
    backgroundColor: ColorTokens.border.divider,
    marginVertical: Spacing.xs,
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
  inputHelp: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    marginBottom: Spacing.xs,
  },
  resetButton: {
    borderColor: SemanticStates.danger.foreground,
    backgroundColor: "rgba(250,82,82,0.12)",
  },
});
