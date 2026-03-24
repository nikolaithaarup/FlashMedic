import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { styles } from "../../ui/flashmedicStyles";

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
  headingFont,
  subtitleFont,
  buttonFont,
  suggestedAnonName,
  onContinueAnonymous,
  onCreateProfile,
}: Props) {
  const defaultAnon = useMemo(
    () => suggestedAnonName ?? makeRandomAnonName(),
    [suggestedAnonName],
  );
  const [nickname, setNickname] = useState("");

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
    <LinearGradient
      colors={["#0e91a8ff", "#5e6e7eff"]}
      style={styles.homeBackground}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <Text
          style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}
        >
          FlashMedic
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontSize: subtitleFont,
              color: "#e9ecef",
              textAlign: "left",
              alignSelf: "flex-start",
              marginTop: 8,
            },
          ]}
        >
          Vælg en simpel profil. Ingen email. Du får et userId til global
          statistik.
        </Text>

        {/* Continue anonymously */}
        <View
          style={[styles.statsCard, { alignSelf: "stretch", marginTop: 14 }]}
        >
          <Text style={styles.statsSectionTitle}>Fortsæt anonymt</Text>
          <Text style={[styles.statsLabel, { marginTop: 6 }]}>
            Du får et tilfældigt navn: {defaultAnon}
          </Text>

          <Pressable
            style={[
              styles.bigButton,
              {
                backgroundColor: "#1c7ed6",
                marginTop: 12,
                alignSelf: "stretch",
              },
            ]}
            onPress={handleAnon}
          >
            <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>
              Fortsæt anonymt
            </Text>
          </Pressable>
        </View>

        {/* Create profile */}
        <View
          style={[styles.statsCard, { alignSelf: "stretch", marginTop: 14 }]}
        >
          <Text style={styles.statsSectionTitle}>Opret profil</Text>
          <Text style={[styles.statsLabel, { marginTop: 6 }]}>
            Vælg dit kaldenavn (vises på leaderboard).
          </Text>

          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="Fx ParamedNick"
            placeholderTextColor="#adb5bd"
            style={styles.textInput}
            autoCapitalize="none"
          />

          <Pressable
            style={[
              styles.bigButton,
              {
                backgroundColor: "#2f9e44",
                marginTop: 12,
                alignSelf: "stretch",
              },
            ]}
            onPress={handleCreate}
          >
            <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>
              Opret profil
            </Text>
          </Pressable>

          <Text style={[styles.statsLabel, { marginTop: 10 }]}>
            Du kan altid ændre navn senere under “Profil”.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
