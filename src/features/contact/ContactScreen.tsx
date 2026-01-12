import Constants from "expo-constants";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { styles } from "../../../app/flashmedicStyles";

type Props = {
  headingFont: number;
  buttonFont: number;

  apiBaseUrl: string;

  contactName: string;
  setContactName: (v: string) => void;

  contactEmail: string;
  setContactEmail: (v: string) => void;

  contactMessage: string;
  setContactMessage: (v: string) => void;

  onBack: () => void; // go home
};

export function ContactScreen({
  headingFont,
  buttonFont,
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

  const deviceInfo = useMemo(() => {
    const deviceInfoParts = [
      Device.manufacturer,
      Device.modelName,
      Device.osName,
      Device.osVersion,
    ].filter(Boolean);

    return deviceInfoParts.join(" ");
  }, []);

  const handleSend = async () => {
    if (!contactMessage.trim()) {
      Alert.alert("Fejl", "Skriv venligst en besked.");
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/contact/send`, {
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

      if (!res.ok) {
        throw new Error("Serverfejl");
      }

      Alert.alert("Tak!", "Din besked er sendt til serveren.");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch (err) {
      Alert.alert("Fejl", "Kunne ikke sende beskeden. Prøv igen.");
    }
  };

  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={[
          styles.safeTopContainer ?? styles.homeContainer,
          {
            paddingTop: 80,
            paddingHorizontal: 16,
            paddingBottom: 40,
            alignItems: "flex-start",
          },
        ]}
      >
        <View style={{ width: "100%", maxWidth: 700 }}>
          <View style={styles.headerRow}>
            <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>
              Kontakt os
            </Text>
            <Pressable style={[styles.smallButton, { borderColor: "#ffffffdd" }]} onPress={onBack}>
              <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
                Tilbage
              </Text>
            </Pressable>
          </View>

          <Text
            style={[
              styles.statsLabel,
              {
                marginTop: 12,
                marginBottom: 8,
                color: "#f1f3f5",
              },
            ]}
          >
            Denne besked bliver sendt til FlashMedic-teamet via serveren.
            {"\n"}
            App: {appName} – v{appVersion}
            {"\n"}
            Enhed: {deviceInfo || "Ukendt enhed"} ({Platform.OS})
          </Text>

          <Text
            style={[
              styles.statsLabel,
              {
                marginBottom: 8,
                color: "#f8f9fa",
                fontSize: 24,
              },
            ]}
          >
            Denne app er lavet af en ambulancebehandlerelev og er rettet mod både elever og
            færdiguddannede, som vil øve sig i anatomi, medicin, EKG og meget mere.
            {"\n\n"}
            Ris, ros og konstruktiv kritik modtages meget gerne – det hjælper med at gøre appen bedre
            for alle.
          </Text>

          <Text style={[styles.statsLabel, { marginTop: 24 }]}>Navn (valgfri)</Text>
          <TextInput
            value={contactName}
            onChangeText={setContactName}
            style={[styles.textInput, { width: "100%" }]}
            placeholder="Fx Nikolai"
            placeholderTextColor="#adb5bd"
          />

          <Text style={[styles.statsLabel, { marginTop: 16 }]}>Email (valgfri)</Text>
          <TextInput
            value={contactEmail}
            onChangeText={setContactEmail}
            style={[styles.textInput, { width: "100%" }]}
            placeholder="Fx nikolai@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#adb5bd"
          />

          <Text style={[styles.statsLabel, { marginTop: 16 }]}>Besked</Text>
          <TextInput
            value={contactMessage}
            onChangeText={setContactMessage}
            style={[
              styles.textInput,
              {
                width: "100%",
                height: 140,
                textAlignVertical: "top",
              },
            ]}
            placeholder="Skriv din besked her..."
            placeholderTextColor="#adb5bd"
            multiline
          />

          <Pressable
            style={[
              styles.bigButton,
              styles.primaryButton,
              {
                marginTop: 24,
                alignSelf: "flex-start",
              },
            ]}
            onPress={handleSend}
          >
            <Text style={styles.bigButtonText}>SEND</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default ContactScreen;
