import { StatusBar } from "expo-status-bar";
import React, {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  Alert,
  Platform,
  Share,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

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
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";
import {
  saveStoredProfile,
  type StoredUserProfile,
} from "../../services/userService";
import type { UserProfile } from "./useProfile";
import type { Flashcard } from "../../types/Flashcard";
import { useStats } from "../stats/StatsContext";
import { deriveTopicStats } from "../flashcards/learningSelectors";
import { updatePendingWeeklyNickname } from "../../storage/weeklyPendingResults";
import {
  createProgressBackupImportIdentity,
  createProgressBackup,
  parseProgressBackup,
  rebindProgressBackupUser,
  restoreProgressBackup,
} from "../../storage/progressTransfer";
import { auth } from "../../firebase/firebase";
import { signOutSynapseAccount } from "../../services/synapseAuth";
import {
  prepareImportedProgressForSync,
  type ProgressSyncState,
} from "../../sync/progressSync";
import { SynapseEmailLogin } from "./SynapseEmailLogin";

function makeRandomAnonName() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `Bruger${n}`;
}

function formatActivityDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tidspunkt ikke tilgængeligt";
  return new Intl.DateTimeFormat("da-DK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function syncStatusTitle(status: ProgressSyncState["status"]) {
  switch (status) {
    case "synced": return "Synkroniseret";
    case "syncing": return "Synkroniserer";
    case "pending": return "Afventer synkronisering";
    case "offline": return "Offline";
    case "error": return "Synkronisering mislykkedes";
    default: return "Konto forbundet";
  }
}

function syncStatusMessage(state: ProgressSyncState) {
  if (state.status === "synced" && state.lastSyncedAt) {
    return `Opdateret ${formatActivityDate(state.lastSyncedAt)}`;
  }
  if (state.status === "syncing") return "Opdaterer din fremgang…";
  if (state.status === "pending") return `${state.pendingCount} ændring${state.pendingCount === 1 ? "" : "er"} afventer.`;
  if (state.status === "offline") return "Fremgangen gemmes på enheden.";
  if (state.status === "error") return "Fremgangen er gemt. Prøv igen senere.";
  return "";
}

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  firebaseUid: string | null;
  profile: UserProfile | null;
  cards: readonly Flashcard[];
  setProfile: Dispatch<SetStateAction<UserProfile | null>>;
  onBack: () => void;
};

export default function ProfileScreen({
  firebaseUid,
  profile,
  cards,
  setProfile,
  onBack,
}: Props) {
  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [focused, setFocused] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(
    auth.currentUser && !auth.currentUser.isAnonymous
      ? (auth.currentUser.email ?? "SynapsePortal-konto")
      : null,
  );
  const { width } = useWindowDimensions();
  const {
    personalStats,
    progressSyncState,
    retryProgressSync,
  } = useStats();

  const dashboard = useMemo(() => {
    const entries = Object.values(personalStats);
    const answered = entries.reduce((total, item) => total + item.seen, 0);
    const correct = entries.reduce((total, item) => total + item.correct, 0);
    const topicStats = deriveTopicStats(personalStats, cards);
    return {
      answered,
      accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
      activeTopics: [...topicStats]
        .sort((left, right) => right.attempts - left.attempts)
        .slice(0, width >= 720 ? 6 : 4),
      weakTopics: topicStats
        .filter(({ dataQuality }) => dataQuality === "usable")
        .slice(0, 3),
      recentTopics: [...topicStats]
        .filter(({ lastPracticedAt }) => Boolean(lastPracticedAt))
        .sort((left, right) => (right.lastPracticedAt ?? "").localeCompare(left.lastPracticedAt ?? ""))
        .slice(0, 4),
    };
  }, [cards, personalStats, width]);
  const syncNeedsAttention = Boolean(
    signedInEmail &&
    progressSyncState.status !== "synced" &&
    progressSyncState.status !== "guest",
  );

  useEffect(() => {
    setNickname(profile?.nickname ?? "");
  }, [profile?.nickname]);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    setSignedInEmail(user && !user.isAnonymous
      ? (user.email ?? "SynapsePortal-konto")
      : null);
  }), []);

  const logout = useCallback(async () => {
    setAuthBusy(true);
    try {
      await signOutSynapseAccount();
      setProfile(null);
      setNickname("");
      setSignedInEmail(null);
      if (Platform.OS === "web") window.location.reload();
    } catch {
      Alert.alert("Kunne ikke logge ud", "Prøv igen om et øjeblik.");
    } finally {
      setAuthBusy(false);
    }
  }, [setProfile]);

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
      Alert.alert("Profilen er ikke klar endnu", "Vent et øjeblik og prøv igen.");
      return;
    }

    const updated: UserProfile = {
      userId: firebaseUid,
      nickname: name,
      classId: profile?.classId ?? null,
      role: profile?.role ?? null,
      gender: profile?.gender ?? null,
      region: profile?.region ?? null,
      isAnonymous: false,
    };
    const toStore: StoredUserProfile = {
      userId: firebaseUid,
      nickname: name,
      isAnonymous: false,
    };
    try {
      await saveStoredProfile(toStore);
      setProfile(updated);
      Alert.alert("Kaldenavn gemt", "Dit kaldenavn er opdateret.");
      onBack();
    } catch (error) {
      console.warn("Failed to save profile", error);
      Alert.alert(
        "Profilen kunne ikke gemmes",
        "Din eksisterende profil er bevaret. Prøv igen.",
      );
    }
  }, [firebaseUid, nickname, onBack, profile, setProfile]);

  const resetLocalProfile = useCallback(() => {
    Alert.alert(
      "Fjern kaldenavn?",
      "Dette erstatter dit lokale kaldenavn med et tilfældigt anonymt navn. Dit anonyme Firebase-ID og allerede indsendte ranglisteresultater slettes ikke.",
      [
        { text: "Annuller", style: "cancel" },
        {
          text: "Fjern kaldenavn",
          style: "destructive",
          onPress: async () => {
            const newNick = makeRandomAnonName();
            const next: UserProfile = {
              userId: firebaseUid,
              nickname: newNick,
              classId: profile?.classId ?? null,
              role: profile?.role ?? null,
              gender: profile?.gender ?? null,
              region: profile?.region ?? null,
              isAnonymous: true,
            };
            try {
              const toStore: StoredUserProfile = {
                userId: firebaseUid,
                nickname: newNick,
                isAnonymous: true,
              };
              if (firebaseUid) {
                await updatePendingWeeklyNickname(firebaseUid, newNick);
              }
              await saveStoredProfile(toStore);
              setProfile(next);
              setNickname(newNick);
              Alert.alert("Kaldenavn fjernet", `Du fortsætter som ${newNick}.`);
            } catch (error) {
              console.warn("Failed to reset profile", error);
              Alert.alert(
                "Profilen kunne ikke nulstilles",
                "Din eksisterende profil er bevaret. Prøv igen.",
              );
            }
          },
        },
      ],
    );
  }, [firebaseUid, profile, setProfile]);

  const exportProgress = useCallback(async () => {
    try {
      const backup = await createProgressBackup();
      const json = JSON.stringify(backup, null, 2);
      if (Platform.OS === "web") {
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `flashmedic-backup-${backup.exportedAt.slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        return;
      }
      await Share.share({
        title: "FlashMedic-backup",
        message: json,
      });
    } catch (error) {
      console.warn("Failed to export FlashMedic progress", error);
      Alert.alert("Backup mislykkedes", "Dine data er ikke blevet ændret. Prøv igen.");
    }
  }, []);

  const importProgress = useCallback(async () => {
    if (Platform.OS !== "web") return;
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json,.json";
      const file = await new Promise<File | null>((resolve) => {
        input.onchange = () => resolve(input.files?.[0] ?? null);
        input.click();
      });
      if (!file) return;
      if (!firebaseUid) {
        throw new Error("Firebase-profilen er ikke klar endnu. Prøv igen om et øjeblik.");
      }
      const backup = parseProgressBackup(await file.text());
      const rebound = rebindProgressBackupUser(backup, firebaseUid);
      await restoreProgressBackup(rebound);
      await prepareImportedProgressForSync(createProgressBackupImportIdentity(rebound));
      window.location.reload();
    } catch (error) {
      console.warn("Failed to import FlashMedic progress", error);
      Alert.alert(
        "Backup kunne ikke importeres",
        error instanceof Error ? error.message : "Filen er ugyldig.",
      );
    }
  }, [firebaseUid]);

  return (
    <Screen width="wide">
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBack}
        title="Min læring"
      />

      {syncNeedsAttention ? (
        <Card variant="subtle" style={styles.syncNotice}>
          <View style={styles.statusHeader}>
            <View style={[
              styles.statusDot,
              (progressSyncState.status === "offline" || progressSyncState.status === "pending") && styles.statusDotWarning,
              progressSyncState.status === "error" && styles.statusDotError,
            ]} />
            <View style={styles.statusCopy}>
              <Text style={styles.syncTitle}>{syncStatusTitle(progressSyncState.status)}</Text>
              <Text style={styles.topicMeta}>{syncStatusMessage(progressSyncState)}</Text>
            </View>
            {progressSyncState.status === "error" || progressSyncState.status === "offline" ? (
              <SecondaryButton
                label="Prøv igen"
                onPress={() => void retryProgressSync().catch(() => undefined)}
                style={styles.retryButton}
              />
            ) : null}
          </View>
        </Card>
      ) : null}

      <Text style={styles.sectionLabel}>OVERBLIK</Text>
      <View style={styles.metricGrid}>
        <Card variant="subtle" style={styles.metricCard}>
          <Text style={styles.metricValue}>{dashboard.answered}</Text>
          <Text style={styles.metricLabel}>besvarede spørgsmål</Text>
        </Card>
        <Card variant="subtle" style={styles.metricCard}>
          <Text style={styles.metricValue}>{dashboard.answered > 0 ? `${dashboard.accuracy}%` : "—"}</Text>
          <Text style={styles.metricLabel}>samlet træfsikkerhed</Text>
        </Card>
        <Card variant="subtle" style={styles.metricCard}>
          <Text style={styles.metricValue}>{dashboard.activeTopics.length}</Text>
          <Text style={styles.metricLabel}>øvede emner</Text>
        </Card>
      </View>

      <View style={styles.dashboardGrid}>
      {dashboard.activeTopics.length ? (
        <View style={styles.dashboardSection}>
          <Text style={styles.sectionLabel}>EMNER</Text>
          <Card variant="subtle" style={styles.profileCard}>
            {dashboard.activeTopics.map((topic) => (
          <View key={topic.key} style={styles.topicRow}>
            <View style={styles.topicCopy}>
              <Text style={styles.topicTitle}>{topic.topic}</Text>
              <Text style={styles.topicMeta}>{topic.subject} · {topic.attempts} svar</Text>
            </View>
            <Text style={styles.topicAccuracy}>{Math.round(topic.accuracy * 100)}%</Text>
          </View>
            ))}
          </Card>
        </View>
      ) : null}

      {dashboard.weakTopics.length ? (
        <View style={styles.dashboardSection}>
          <Text style={styles.sectionLabel}>FOKUSOMRÅDER</Text>
          <Card variant="subtle" style={styles.profileCard}>
            {dashboard.weakTopics.map((topic) => (
          <View key={topic.key} style={styles.topicRow}>
            <View style={styles.topicCopy}>
              <Text style={styles.topicTitle}>{topic.topic}</Text>
              <Text style={styles.topicMeta}>{topic.incorrect} af {topic.attempts} svar kan forbedres</Text>
            </View>
            <Text style={styles.topicAccuracy}>{Math.round(topic.accuracy * 100)}%</Text>
          </View>
            ))}
          </Card>
        </View>
      ) : null}

      {dashboard.recentTopics.length ? (
        <View style={styles.dashboardSection}>
          <Text style={styles.sectionLabel}>SENEST ØVET</Text>
          <Card variant="subtle" style={styles.profileCard}>
            {dashboard.recentTopics.map((topic) => (
              <View key={topic.key} style={styles.topicRow}>
                <View style={styles.topicCopy}>
                  <Text style={styles.topicTitle}>{topic.topic}</Text>
                  <Text style={styles.topicMeta}>{formatActivityDate(topic.lastPracticedAt!)}</Text>
                </View>
              </View>
            ))}
          </Card>
        </View>
      ) : null}
      </View>

      {!signedInEmail ? (
        <>
          <Text style={styles.sectionLabel}>KONTO</Text>
          <Card variant="subtle" style={styles.profileCard}>
            <Text style={styles.cardTitle}>Fortsæt på andre enheder</Text>
            <SynapseEmailLogin
              onAuthenticated={({ email, syncConfirmed }) => {
                setSignedInEmail(email);
                if (!syncConfirmed) Alert.alert("Logget ind", "Synkronisering afventer.");
              }}
            />
            <Text style={styles.topicMeta}>Som gæst gemmes fremgangen kun på denne enhed.</Text>
          </Card>
        </>
      ) : null}

      <SecondaryButton
        label={settingsOpen ? "Skjul indstillinger" : "Konto og indstillinger"}
        onPress={() => setSettingsOpen((current) => !current)}
        style={styles.settingsToggle}
      />
      {settingsOpen ? (
        <Card variant="subtle" style={styles.profileCard}>
          {signedInEmail ? (
            <>
              <Text style={styles.inputLabel}>Konto</Text>
              <Text style={styles.inputHelp}>{signedInEmail}</Text>
            </>
          ) : null}
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
          <PrimaryButton label="Gem" onPress={save} />
          <SecondaryButton label="Nulstil kaldenavn" onPress={resetLocalProfile} />
          <View style={styles.divider} />
          <Text style={styles.inputLabel}>Backup</Text>
          <SecondaryButton label="Eksportér backup" onPress={exportProgress} />
          {Platform.OS === "web" ? (
            <SecondaryButton label="Importér backup" onPress={importProgress} />
          ) : null}
          {signedInEmail ? (
            <SecondaryButton
              label="Log ud"
              loading={authBusy}
              onPress={logout}
              style={styles.resetButton}
            />
          ) : null}
        </Card>
      ) : null}
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
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  profileCard: { gap: Spacing.sm, marginBottom: Spacing.md },
  cardTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  statusHeader: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.sm },
  statusCopy: { flex: 1 },
  syncNotice: { marginBottom: Spacing.md },
  syncTitle: { color: ColorTokens.text.primary, fontSize: Typography.sizes.label, fontWeight: Typography.weights.bold },
  retryButton: { minWidth: 96 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginTop: Spacing.xs, backgroundColor: ColorTokens.accent.muted },
  statusDotSuccess: { backgroundColor: SemanticStates.success.foreground },
  statusDotWarning: { backgroundColor: SemanticStates.warning.foreground },
  statusDotError: { backgroundColor: SemanticStates.danger.foreground },
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, marginBottom: Spacing.sm },
  metricCard: { flexGrow: 1, flexBasis: 140, minWidth: 0, padding: Spacing.md },
  metricValue: { color: ColorTokens.text.primary, fontSize: 26, lineHeight: 32, fontWeight: Typography.weights.heavy },
  metricLabel: { color: ColorTokens.text.secondary, fontSize: Typography.sizes.caption, lineHeight: Typography.lineHeights.caption },
  topicRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md, paddingVertical: Spacing.xs, borderBottomWidth: Borders.hairline, borderBottomColor: ColorTokens.border.divider },
  topicCopy: { flex: 1 },
  topicTitle: { color: ColorTokens.text.primary, fontSize: Typography.sizes.body, lineHeight: Typography.lineHeights.body, fontWeight: Typography.weights.semibold },
  topicMeta: { color: ColorTokens.text.secondary, fontSize: Typography.sizes.caption, lineHeight: Typography.lineHeights.caption },
  topicAccuracy: { color: ColorTokens.accent.muted, fontSize: Typography.sizes.body, fontWeight: Typography.weights.bold },
  dashboardGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  dashboardSection: { flexGrow: 1, flexBasis: 300, minWidth: 0 },
  emptyText: { color: ColorTokens.text.secondary, fontSize: Typography.sizes.body, lineHeight: Typography.lineHeights.body },
  settingsToggle: { marginTop: Spacing.lg, marginBottom: Spacing.md },
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
