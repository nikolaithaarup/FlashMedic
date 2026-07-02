import Constants from "expo-constants";
import * as Device from "expo-device";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { Alert, Platform, StyleSheet, Text, TextInput } from "react-native";

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
  PrimaryButton,
  Screen,
  ToolPageHeader,
} from "../../ui/primitives";

type Props = {
  headingFont: number;
  buttonFont: number;
  apiBaseUrl: string;
  contactName: string;
  setContactName: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  contactMessage: string;
  setContactMessage: (value: string) => void;
  onBack: () => void;
};

export function ContactScreen({
  apiBaseUrl,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactMessage,
  setContactMessage,
  onBack,
}: Props) {
  const appName = Constants.expoConfig?.name ?? "FlashMedic";
  const appVersion = Constants.expoConfig?.version ?? "ukendt version";
  const deviceInfo = useMemo(
    () =>
      [
        Device.manufacturer,
        Device.modelName,
        Device.osName,
        Device.osVersion,
      ]
        .filter(Boolean)
        .join(" "),
    [],
  );

  const handleSend = async () => {
    if (!contactMessage.trim()) {
      Alert.alert("Fejl", "Skriv venligst en besked.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/contact/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.trim() || null,
          email: contactEmail.trim() || null,
          message: contactMessage.trim(),
          appName,
          appVersion,
          platform: Platform.OS,
          deviceInfo,
        }),
      });

      if (!response.ok) throw new Error("Serverfejl");

      Alert.alert("Tak!", "Din besked er sendt til serveren.");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch {
      Alert.alert("Fejl", "Kunne ikke sende beskeden. Prøv igen.");
    }
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBack}
        subtitle="Ris, ros og konstruktiv feedback"
        title="Kontakt os"
      />

      <Card variant="subtle" style={styles.introCard}>
        <Text style={styles.introTitle}>Hjælp med at gøre FlashMedic bedre</Text>
        <Text style={styles.introText}>
          Appen er udviklet af en ambulancebehandlerelev til elever og
          færdiguddannede, der vil træne anatomi, medicin, EKG og mere.
        </Text>
        <Text style={styles.metaText}>
          {appName} · v{appVersion} · {deviceInfo || "Ukendt enhed"} ({Platform.OS})
        </Text>
      </Card>

      <Text style={styles.sectionLabel}>DIN BESKED</Text>
      <Card variant="subtle" style={styles.formCard}>
        <Text style={styles.label}>Navn (valgfrit)</Text>
        <TextInput
          onChangeText={setContactName}
          placeholder="Fx Nikolai"
          placeholderTextColor={ColorTokens.text.muted}
          style={styles.input}
          value={contactName}
        />

        <Text style={styles.label}>E-mail (valgfri)</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setContactEmail}
          placeholder="Fx nikolai@example.com"
          placeholderTextColor={ColorTokens.text.muted}
          style={styles.input}
          value={contactEmail}
        />

        <Text style={styles.label}>Besked</Text>
        <TextInput
          multiline
          onChangeText={setContactMessage}
          placeholder="Skriv din besked her…"
          placeholderTextColor={ColorTokens.text.muted}
          style={[styles.input, styles.messageInput]}
          textAlignVertical="top"
          value={contactMessage}
        />

        <PrimaryButton label="Send besked" onPress={handleSend} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  introCard: { gap: Spacing.sm },
  introTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  introText: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  metaText: {
    color: ColorTokens.text.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
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
  formCard: { gap: Spacing.sm, marginBottom: Spacing.lg },
  label: {
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
  messageInput: { minHeight: 150 },
});

export default ContactScreen;
