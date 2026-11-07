import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Spacing,
  Typography,
} from "../../../constants/theme";
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  NavigationCard,
  NoticeCard,
  PrimaryButton,
  Screen,
  ToolPageHeader,
} from "../../ui/primitives";
import { useStats } from "../stats/StatsContext";
import { getWeeklyLockKey, useWeeklyLock } from "./useWeeklyLock";

type WeeklyHomeScreenProps = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  lockRefreshToken: number;
  onBackToHome: () => void;
  onOpenMcq: () => void;
  onOpenMatch: () => void;
  onOpenWord: () => void;
};

type GameCardProps = {
  title: string;
  locked: boolean;
  onPress: () => void;
};

function GameCard({ title, locked, onPress }: GameCardProps) {
  return (
    <NavigationCard
      description={locked ? "Gennemført" : undefined}
      disabled={locked}
      onPress={onPress}
      secondary
      style={styles.gameCard}
      title={title}
      trailing={locked ? "✓" : "›"}
    />
  );
}

export function WeeklyHomeScreen({
  onBackToHome,
  onOpenMcq,
  onOpenMatch,
  onOpenWord,
  lockRefreshToken,
}: WeeklyHomeScreenProps) {
  const {
    weeklyGlobal,
    loadingWeekly,
    weeklyError,
    pendingWeeklyUploads,
    refreshWeeklyGlobal,
  } = useStats();

  useEffect(() => {
    if (!weeklyGlobal) refreshWeeklyGlobal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const weekId = weeklyGlobal?.week?.weekId ?? null;
  const lockWeekKey = weekId ?? "unknown";
  const mcqLock = useWeeklyLock(getWeeklyLockKey("mcq", lockWeekKey), {
    refreshToken: lockRefreshToken,
  });
  const matchLock = useWeeklyLock(getWeeklyLockKey("match", lockWeekKey), {
    refreshToken: lockRefreshToken,
  });
  const wordLock = useWeeklyLock(getWeeklyLockKey("word", lockWeekKey), {
    refreshToken: lockRefreshToken,
  });
  const topics = weeklyGlobal?.week?.topics ?? null;

  return (
    <Screen>
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBackToHome}
        title="Ugens udfordringer"
      />

      {pendingWeeklyUploads > 0 ? (
        <NoticeCard title="Resultat afventer" tone="warning">
          Gemmes på enheden.
        </NoticeCard>
      ) : null}
      <View style={styles.gameList}>
        <GameCard
          locked={mcqLock.locked}
          onPress={onOpenMcq}
          title="Ugens quiz"
        />
        <GameCard
          locked={matchLock.locked}
          onPress={onOpenMatch}
          title="Match parrene"
        />
        <GameCard
          locked={wordLock.locked}
          onPress={onOpenWord}
          title="Ugens ord"
        />
      </View>

      {weeklyError ? (
        <Card variant="subtle" style={styles.statusCard}>
          <ErrorState
            action={
              <PrimaryButton
                label="Prøv igen"
                onPress={refreshWeeklyGlobal}
              />
            }
            message={weeklyError}
            title="Kunne ikke hente ugens indhold"
          />
        </Card>
      ) : loadingWeekly && !weeklyGlobal ? (
        <LoadingState title="Henter ugens indhold" />
      ) : !weeklyGlobal?.week ? (
        <Card variant="subtle" style={styles.statusCard}>
          <EmptyState
            message="Kom tilbage senere."
            title="Intet indhold denne uge"
          />
        </Card>
      ) : null}

      {topics ? (
        <Card variant="subtle" style={styles.topicSummary}>
          <Text style={styles.topicSummaryTitle}>Ugens emner</Text>
          <Text style={styles.topicSummaryText}>Quiz · {topics.mcq ?? "—"}</Text>
          <Text style={styles.topicSummaryText}>Match · {topics.match ?? "—"}</Text>
          <Text style={styles.topicSummaryText}>Ord · {topics.word ?? "—"}</Text>
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
  },
  sectionTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  gameList: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  gameCard: { flexGrow: 1, flexBasis: 240, minWidth: 0 },
  statusCard: { marginTop: Spacing.md },
  leaderboardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  headerCopy: { flex: 1, minWidth: 0 },
  refreshButton: { minWidth: 112 },
  rankRow: {
    minHeight: Interaction.minimumTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    borderBottomWidth: Borders.hairline,
    borderBottomColor: ColorTokens.border.divider,
  },
  rankPosition: {
    width: 28,
    color: ColorTokens.accent.muted,
    fontWeight: Typography.weights.bold,
  },
  rankIdentity: { flex: 1, minWidth: 0 },
  rankName: { color: ColorTokens.text.primary, fontWeight: Typography.weights.semibold },
  rankMeta: { color: ColorTokens.text.secondary, fontSize: Typography.sizes.caption },
  rankScore: { color: ColorTokens.accent.muted, fontWeight: Typography.weights.bold },
  topicSummary: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  topicSummaryTitle: { color: ColorTokens.text.primary, fontWeight: Typography.weights.bold },
  topicSummaryText: { color: ColorTokens.text.secondary },
});

export default WeeklyHomeScreen;
