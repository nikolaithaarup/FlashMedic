import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import * as MailComposer from "expo-mail-composer";
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
  contactName: string;
  setContactName: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  contactMessage: string;
  setContactMessage: (value: string) => void;
  onBack: () => void;
};

const SUPPORT_EMAIL = "nikolai_91@live.com";

export function ContactScreen({
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
      Alert.alert("Fejl", "Skriv en besked først.");
      return;
    }

    const subject = `[${appName}] Kontakt fra appen`;
    const body = [
      contactName.trim() ? `Navn: ${contactName.trim()}` : null,
      contactEmail.trim() ? `E-mail: ${contactEmail.trim()}` : null,
      "",
      contactMessage.trim(),
      "",
      `${appName} · v${appVersion} · ${Platform.OS}`,
      deviceInfo || null,
    ]
      .filter((line) => line !== null)
      .join("\n");

    try {
      if (await MailComposer.isAvailableAsync()) {
        const result = await MailComposer.composeAsync({
          recipients: [SUPPORT_EMAIL],
          subject,
          body,
        });
        if (result.status === MailComposer.MailComposerStatus.SENT) {
          setContactName("");
          setContactEmail("");
          setContactMessage("");
        }
        return;
      }

      const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      await Linking.openURL(mailtoUrl);
      Alert.alert(
        "E-mail åbnet",
        "Send beskeden fra din e-mailapp. Din tekst bliver stående i FlashMedic, indtil du vender tilbage.",
      );
    } catch (error) {
      console.warn("Could not open support email", error);
      Alert.alert(
        "Kunne ikke åbne e-mail",
        `Skriv direkte til ${SUPPORT_EMAIL}. Din besked er ikke blevet slettet.`,
      );
    }
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBack}
        subtitle="Spørgsmål, ris og ros"
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
        <Text selectable style={styles.metaText}>
          Support: {SUPPORT_EMAIL}
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
