import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  clearStoredProfile,
  saveStoredProfile,
  type StoredUserProfile,
} from "../../services/userService";
import { styles } from "../../ui/flashmedicStyles";

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
  setProfile: (p: UserProfile) => void;

  onBack: () => void;
};

export default function ProfileScreen({
  headingFont,
  subtitleFont,
  buttonFont,
  firebaseUid,
  profile,
  setProfile,
  onBack,
}: Props) {
  const [nickname, setNickname] = useState(profile?.nickname ?? "");

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
    <LinearGradient
      colors={["#0e91a8ff", "#5e6e7eff"]}
      style={styles.homeBackground}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.appTitle,
              { fontSize: headingFont, color: "#f8f9fa" },
            ]}
          >
            Profil
          </Text>

          <Pressable
            style={[styles.smallButton, { borderColor: "#fff" }]}
            onPress={onBack}
            hitSlop={8}
          >
            <Text
              style={[
                styles.smallButtonText,
                { color: "#fff", fontSize: buttonFont * 0.9 },
              ]}
            >
              Home
            </Text>
          </Pressable>
        </View>

        <Text
          style={[
            styles.subtitle,
            {
              fontSize: subtitleFont,
              color: "#e9ecef",
              textAlign: "left",
              alignSelf: "flex-start",
            },
          ]}
        >
          Dit officielle userId (Firebase UID) bruges i global statistik.
          Nickname er frivilligt og kan ændres.
        </Text>

        <View
          style={[styles.statsCard, { alignSelf: "stretch", marginTop: 14 }]}
        >
          <Text style={styles.statsSectionTitle}>Official User ID</Text>
          <Text style={[styles.statsLabel, { marginTop: 6 }]}>
            {firebaseUid ?? "—"}
          </Text>

          <Text style={[styles.statsSectionTitle, { marginTop: 16 }]}>
            Nickname (valgfri)
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
                backgroundColor: "#1c7ed6",
                marginTop: 14,
                alignSelf: "stretch",
              },
            ]}
            onPress={save}
          >
            <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>
              Gem nickname
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.bigButton,
              {
                backgroundColor: "#e03131",
                marginTop: 10,
                alignSelf: "stretch",
              },
            ]}
            onPress={resetLocalProfile}
          >
            <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>
              Nulstil profil
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
