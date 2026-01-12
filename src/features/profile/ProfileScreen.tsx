import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { styles } from "../../../app/flashmedicStyles";

export type UserRole = "student" | "ambulancebehandler" | "paramediciner" | "laegeassistent";
export type Region =
  | "hovedstaden"
  | "sjaelland"
  | "syddanmark"
  | "midtjylland"
  | "nordjylland"
  | "oestdanmark";
export type Gender = "male" | "female" | "not_specified";

export type UserProfile = {
  userId: string;
  nickname: string;
  role: UserRole;
  gender: Gender;
  region: Region;
  classId: number | null;
  isAnonymous: boolean;
};

export type StoredUserProfile = {
  userId: string;
  nickname: string;
  classId: number | null;
  isAnonymous: boolean;
};

type Props = {
  headingFont: number;
  buttonFont: number;

  // Firebase uid (pass auth.currentUser?.uid from index.tsx)
  firebaseUid: string | null;

  // Existing profile state setters from your index.tsx
  setProfile: (p: UserProfile) => void;

  // AsyncStorage/local persistence function you already have
  saveStoredProfile: (p: StoredUserProfile) => Promise<void>;

  // Form state (kept in index.tsx for now)
  profileEditNickname: string;
  setProfileEditNickname: (v: string) => void;

  profileEditRole: UserRole;
  setProfileEditRole: (v: UserRole) => void;

  profileEditClassId: number | null;
  setProfileEditClassId: (v: number | null) => void;

  profileEditRegion: Region;
  setProfileEditRegion: (v: Region) => void;

  profileEditGender: Gender;
  setProfileEditGender: (v: Gender) => void;

  STUDENT_CLASSES: number[];

  onBack: () => void; // back to home
};

export function ProfileScreen({
  headingFont,
  buttonFont,
  firebaseUid,
  setProfile,
  saveStoredProfile,
  profileEditNickname,
  setProfileEditNickname,
  profileEditRole,
  setProfileEditRole,
  profileEditClassId,
  setProfileEditClassId,
  profileEditRegion,
  setProfileEditRegion,
  profileEditGender,
  setProfileEditGender,
  STUDENT_CLASSES,
  onBack,
}: Props) {
  const saveProfile = useCallback(async () => {
    const nickname = profileEditNickname.trim();

    if (!nickname) {
      Alert.alert("Navn mangler", "Vælg et kaldenavn.");
      return;
    }

    // 🔒 GUARD: students must choose a class
    if (profileEditRole === "student" && !profileEditClassId) {
      Alert.alert("Hold mangler", "Vælg venligst dit hold.");
      return;
    }

    try {
      if (!firebaseUid) {
        Alert.alert("Fejl", "Bruger er ikke logget ind korrekt.");
        return;
      }

      const updated: UserProfile = {
        userId: firebaseUid,
        nickname,
        role: profileEditRole,
        gender: profileEditGender,
        region: profileEditRegion,
        classId: profileEditRole === "student" ? profileEditClassId : null,
        isAnonymous: false,
      };

      setProfile(updated);

      const toStore: StoredUserProfile = {
        userId: firebaseUid,
        nickname,
        classId: profileEditRole === "student" ? profileEditClassId : null,
        isAnonymous: false,
      };

      await saveStoredProfile(toStore);

      Alert.alert(
        "Profil gemt ✅",
        `userId:\n${firebaseUid}\n\nNavn: ${nickname}\nHold: ${profileEditClassId ?? "—"}`,
      );

      onBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Fejl", "Kunne ikke oprette profil på serveren. Tjek internet og prøv igen.");
    }
  }, [
    firebaseUid,
    onBack,
    profileEditClassId,
    profileEditGender,
    profileEditNickname,
    profileEditRegion,
    profileEditRole,
    saveStoredProfile,
    setProfile,
  ]);

  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>Profil</Text>

          <Pressable style={[styles.smallButton, { borderColor: "#fff" }]} onPress={onBack} hitSlop={8}>
            <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
              Home
            </Text>
          </Pressable>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsSectionTitle}>Vælg kaldenavn</Text>
          <TextInput
            value={profileEditNickname}
            onChangeText={setProfileEditNickname}
            placeholder="Fx ParamedNick"
            placeholderTextColor="#adb5bd"
            style={styles.textInput}
          />

          <Text style={[styles.statsSectionTitle, { marginTop: 16 }]}>Rolle</Text>

          <View style={styles.classList}>
            {[
              { id: "student", label: "Studerende" },
              { id: "ambulancebehandler", label: "Ambulancebehandler" },
              { id: "paramediciner", label: "Paramediciner" },
              { id: "laegeassistent", label: "Lægeassistent" },
            ].map((r) => {
              const selected = profileEditRole === r.id;

              return (
                <Pressable
                  key={r.id}
                  onPress={() => setProfileEditRole(r.id as UserRole)}
                  style={[styles.classChip, selected && styles.classChipSelected]}
                >
                  <Text style={[styles.classChipText, selected && styles.classChipTextSelected]}>
                    {r.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {profileEditRole === "student" && (
            <>
              <Text style={[styles.statsSectionTitle, { marginTop: 16 }]}>Vælg hold / klasse</Text>

              <View style={styles.classList}>
                {STUDENT_CLASSES.map((num) => {
                  const selected = profileEditClassId === num;

                  return (
                    <Pressable
                      key={num}
                      onPress={() => setProfileEditClassId(num)}
                      style={[styles.classChip, selected && styles.classChipSelected]}
                    >
                      <Text style={[styles.classChipText, selected && styles.classChipTextSelected]}>
                        {num}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          <Text style={[styles.statsSectionTitle, { marginTop: 16 }]}>Region</Text>

          <View style={styles.classList}>
            {[
              { id: "hovedstaden", label: "Hovedstaden" },
              { id: "sjaelland", label: "Sjælland" },
              { id: "syddanmark", label: "Syddanmark" },
              { id: "midtjylland", label: "Midtjylland" },
              { id: "nordjylland", label: "Nordjylland" },
              { id: "oestdanmark", label: "Østdanmark" },
            ].map((r) => {
              const selected = profileEditRegion === r.id;

              return (
                <Pressable
                  key={r.id}
                  onPress={() => setProfileEditRegion(r.id as Region)}
                  style={[styles.classChip, selected && styles.classChipSelected]}
                >
                  <Text style={[styles.classChipText, selected && styles.classChipTextSelected]}>
                    {r.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.statsSectionTitle, { marginTop: 16 }]}>Køn (valgfri)</Text>

          <View style={styles.classList}>
            {[
              { id: "male", label: "Mand" },
              { id: "female", label: "Kvinde" },
              { id: "not_specified", label: "Ønsker ikke at oplyse" },
            ].map((g) => {
              const selected = profileEditGender === g.id;

              return (
                <Pressable
                  key={g.id}
                  onPress={() => setProfileEditGender(g.id as Gender)}
                  style={[styles.classChip, selected && styles.classChipSelected]}
                >
                  <Text style={[styles.classChipText, selected && styles.classChipTextSelected]}>
                    {g.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={[
              styles.bigButton,
              { backgroundColor: "#1c7ed6", marginTop: 24, alignSelf: "stretch" },
            ]}
            onPress={saveProfile}
          >
            <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>Gem profil</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default ProfileScreen;
