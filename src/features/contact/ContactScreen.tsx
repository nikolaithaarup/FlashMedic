import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import * as MailComposer from "expo-mail-composer";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Borders, ColorTokens, Interaction, Radii, Spacing, Typography } from "../../../constants/theme";
import { Screen, ToolPageHeader } from "../../ui/primitives";
import { SupportQuickActions } from "./SupportQuickActions";

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
const STUDIO_URL = "https://synapsestudio.dk";
const PRIVACY_URL = "https://synapsestudio.dk/da/privacy";
const DISCLAIMER_URL = "https://synapsestudio.dk/da/disclaimer";

export function ContactScreen({
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactMessage,
  setContactMessage,
  onBack,
}: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const appName = "FlashMedic";
  const appVersion = Constants.expoConfig?.version ?? "–";
  const deviceInfo = useMemo(
    () => [Device.manufacturer, Device.modelName, Device.osName, Device.osVersion]
      .filter(Boolean).join(" "),
    [],
  );

  const openSupportEmail = async (report = false) => {
    const subject = report ? "[FlashMedic] Fejlrapport" : "[FlashMedic] Kontakt";
    const reportedProblem = report
      ? "Hvor i appen?\n\nHvad skete der?\n\nHvad forventede du?\n\n"
      : "";
    const body = [
      "Hej Nikolai,",
      "",
      contactMessage.trim() || reportedProblem,
      "",
      contactName.trim() ? "Navn: " + contactName.trim() : null,
      contactEmail.trim() ? "Svar til: " + contactEmail.trim() : null,
      "",
      appName + " · v" + appVersion + " · " + Platform.OS,
      deviceInfo || null,
    ].filter((item) => item !== null).join("\n");

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
      const url = "mailto:" + SUPPORT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      await Linking.openURL(url);
      // A mailto link only opens the mail client. It does not confirm delivery.
    } catch (error) {
      console.warn("Could not open support email", error);
      Alert.alert("Kunne ikke åbne e-mail", "Du kan skrive direkte til " + SUPPORT_EMAIL + ". Din tekst er bevaret.");
    }
  };

  const openExternalPage = async (url: string, name: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) throw new Error("URL not supported");
      await Linking.openURL(url);
    } catch {
      Alert.alert("Kunne ikke åbne " + name, url);
    }
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <StatusBar style="light" />
      <ToolPageHeader title="Kontakt & support" backLabel="Tilbage" onBack={onBack} />

      <SupportQuickActions
        onEmail={() => void openSupportEmail()}
        onReport={() => void openSupportEmail(true)}
        onStudio={() => void openExternalPage(STUDIO_URL, "SynapseStudio")}
      />

      <Text style={styles.notice}>Skriv gerne, hvad der ikke virker. Undlad patientoplysninger.</Text>

      <View style={styles.section}>
        <Pressable
          testID="flash-contact-details-toggle"
          accessibilityRole="button"
          accessibilityLabel="Tilføj detaljer"
          accessibilityState={{ expanded: showDetails }}
          onPress={() => setShowDetails((value) => !value)}
          style={({ pressed }) => [styles.disclosure, pressed && styles.pressed]}
        >
          <Text style={styles.disclosureText}>Skriv en besked (valgfrit)</Text>
          <Text style={styles.chevron}>{showDetails ? "⌄" : "›"}</Text>
        </Pressable>
        {showDetails ? (
          <View style={styles.fields} testID="flash-contact-details">
            <Text style={styles.label}>Navn</Text>
            <TextInput
              accessibilityLabel="Navn"
              value={contactName}
              onChangeText={setContactName}
              placeholder="Valgfrit"
              placeholderTextColor={ColorTokens.text.muted}
              style={styles.input}
            />
            <Text style={styles.label}>E-mail til svar</Text>
            <TextInput
              accessibilityLabel="E-mail til svar"
              value={contactEmail}
              onChangeText={setContactEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Valgfrit"
              placeholderTextColor={ColorTokens.text.muted}
              style={styles.input}
            />
            <Text style={styles.label}>Besked</Text>
            <TextInput
              accessibilityLabel="Besked"
              value={contactMessage}
              onChangeText={setContactMessage}
              multiline
              textAlignVertical="top"
              placeholder="Hvad vil du gerne fortælle?"
              placeholderTextColor={ColorTokens.text.muted}
              style={[styles.input, styles.messageInput]}
            />
            <Pressable
              testID="flash-contact-send-details"
              accessibilityRole="button"
              onPress={() => void openSupportEmail()}
              style={({ pressed }) => [styles.send, pressed && styles.pressed]}
            >
              <Text style={styles.sendText}>Skriv e-mail med detaljer</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Om appen</Text>
        <Text style={styles.description}>FlashMedic er lavet af Nikolai / SynapseStudio til læring og repetition – ikke til kliniske beslutninger.</Text>
        <View style={styles.linkRow}>
          <Pressable
            testID="privacy-policy-link"
            accessibilityRole="link"
            onPress={() => void openExternalPage(PRIVACY_URL, "privatlivspolitik")}
            style={({ pressed }) => [styles.link, pressed && styles.pressed]}
          >
            <Text style={styles.linkText}>Privatliv</Text>
          </Pressable>
          <Pressable
            testID="disclaimer-link"
            accessibilityRole="link"
            onPress={() => void openExternalPage(DISCLAIMER_URL, "ansvarsfraskrivelse")}
            style={({ pressed }) => [styles.link, pressed && styles.pressed]}
          >
            <Text style={styles.linkText}>Ansvar og vilkår</Text>
          </Pressable>
        </View>
      </View>

      <Text selectable style={styles.footer}>SynapseStudio · FlashMedic v{appVersion}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md, paddingBottom: Spacing.xxl },
  notice: { color: ColorTokens.text.secondary, fontSize: 13, lineHeight: 19 },
  section: { borderTopWidth: Borders.hairline, borderTopColor: ColorTokens.border.divider, paddingTop: Spacing.md, gap: 8 },
  disclosure: { minHeight: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  disclosureText: { color: ColorTokens.text.primary, fontSize: 15, fontWeight: "800" },
  chevron: { color: ColorTokens.accent.focus, fontSize: 20 },
  fields: { gap: 8, paddingBottom: Spacing.sm },
  label: { color: ColorTokens.text.secondary, fontSize: 13, fontWeight: "700" },
  input: {
    minHeight: Interaction.minimumTouchTarget,
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    color: ColorTokens.text.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.body,
  },
  messageInput: { minHeight: 114 },
  send: {
    marginTop: Spacing.xs, minHeight: 50, backgroundColor: ColorTokens.accent.primary,
    borderRadius: Radii.control, justifyContent: "center", alignItems: "center",
  },
  sendText: { color: ColorTokens.text.onAccent, fontWeight: "800", fontSize: 15 },
  sectionTitle: { color: ColorTokens.text.primary, fontSize: 16, fontWeight: "800" },
  description: { color: ColorTokens.text.secondary, fontSize: 14, lineHeight: 20 },
  linkRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  link: {
    minHeight: 44, flexGrow: 1, flexBasis: "45%",
    borderWidth: Borders.hairline, borderColor: ColorTokens.border.default,
    borderRadius: Radii.control, alignItems: "center", justifyContent: "center",
    paddingHorizontal: Spacing.sm,
  },
  linkText: { color: ColorTokens.text.primary, fontWeight: "700", fontSize: 14 },
  footer: { textAlign: "center", color: ColorTokens.text.secondary, fontSize: 12, marginTop: Spacing.xs },
  pressed: { opacity: Interaction.pressedOpacity },
});

export default ContactScreen;
