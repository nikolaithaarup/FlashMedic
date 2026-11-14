import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
import {
  useWeeklyLeaderboard,
  type LeaderboardRow,
  type LeaderboardScope,
} from "../../services/weeklyLeaderboardService";
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

function RankMarker({ rank }: { rank: number }) {
  const medalColor = rank === 1 ? "#D4A017" : rank === 2 ? "#9AA0A6" : "#B87333";
  return rank <= 3 ? (
    <MaterialCommunityIcons
      accessibilityLabel={`Placering ${rank}`}
      color={medalColor}
      name="medal-outline"
      size={20}
    />
  ) : (
    <Text style={styles.rankPosition}>{rank}</Text>
  );
}

function RankRow({ item, current }: { item: LeaderboardRow; current: boolean }) {
  return (
    <View style={[styles.rankRow, current && styles.currentRankRow]}>
      <View style={styles.rankMarker}><RankMarker rank={item.rank} /></View>
      <Text numberOfLines={1} style={styles.rankName}>{item.nickname}</Text>
      <Text style={styles.rankScore}>{item.totalPoints.toLocaleString("da-DK")}</Text>
    </View>
  );
}

export function WeeklyHomeScreen({
  onBackToHome,
  onOpenMcq,
  onOpenMatch,
  onOpenWord,
  lockRefreshToken,
}: WeeklyHomeScreenProps) {
  const [scope, setScope] = useState<LeaderboardScope>("week");
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleOnline = () => void refreshWeeklyGlobal();
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [refreshWeeklyGlobal]);

  useEffect(() => {
    const now = new Date();
    const isoDay = now.getDay() || 7;
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + (8 - isoDay));
    nextWeek.setHours(0, 0, 1, 0);
    const timer = setTimeout(() => void refreshWeeklyGlobal(), nextWeek.getTime() - now.getTime());
    return () => clearTimeout(timer);
  }, [refreshWeeklyGlobal]);

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
  const leaderboard = useWeeklyLeaderboard(scope, weekId);
  const currentUid = leaderboard.current?.uid ?? null;
  const currentInTop = currentUid
    ? leaderboard.top.some((row) => row.uid === currentUid)
    : false;

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

      <View style={styles.leaderboardHeader}>
        <Text style={styles.sectionTitle}>Rangliste</Text>
        <View accessibilityRole="tablist" style={styles.tabs}>
          {(["week", "all-time"] as const).map((value) => (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: scope === value }}
              key={value}
              onPress={() => setScope(value)}
              style={[styles.tab, scope === value && styles.tabActive]}
            >
              <Text style={[styles.tabText, scope === value && styles.tabTextActive]}>
                {value === "week" ? "Denne uge" : "Alle tider"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {leaderboard.loading && leaderboard.top.length === 0 ? (
        <Text style={styles.leaderboardState}>Henter rangliste…</Text>
      ) : leaderboard.error && leaderboard.top.length === 0 ? (
        <Text style={styles.leaderboardState}>Ranglisten er ikke tilgængelig.</Text>
      ) : leaderboard.top.length === 0 ? (
        <Text style={styles.leaderboardState}>Ingen resultater endnu.</Text>
      ) : (
        <View>
          {leaderboard.top.map((row) => (
            <RankRow current={row.uid === currentUid} item={row} key={row.uid} />
          ))}
          {leaderboard.current && !currentInTop && leaderboard.current.rank > 0 ? (
            <View style={styles.personalRank}>
              <RankRow current item={leaderboard.current} />
            </View>
          ) : null}
        </View>
      )}

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
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  tabs: { flexDirection: "row", gap: Spacing.xs },
  tab: {
    minHeight: Interaction.minimumTouchTarget,
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: ColorTokens.accent.muted },
  tabText: { color: ColorTokens.text.secondary, fontWeight: Typography.weights.semibold },
  tabTextActive: { color: ColorTokens.text.primary },
  rankRow: {
    minHeight: Interaction.minimumTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    borderBottomWidth: Borders.hairline,
    borderBottomColor: ColorTokens.border.divider,
  },
  rankMarker: { width: 28, alignItems: "center" },
  rankPosition: {
    color: ColorTokens.accent.muted,
    fontWeight: Typography.weights.bold,
  },
  rankName: { flex: 1, minWidth: 0, color: ColorTokens.text.primary, fontWeight: Typography.weights.semibold },
  rankScore: { color: ColorTokens.accent.muted, fontWeight: Typography.weights.bold },
  currentRankRow: { backgroundColor: ColorTokens.surface.subtle },
  personalRank: {
    marginTop: Spacing.sm,
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
  },
  leaderboardState: { color: ColorTokens.text.secondary, paddingVertical: Spacing.md },
  topicSummary: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  topicSummaryTitle: { color: ColorTokens.text.primary, fontWeight: Typography.weights.bold },
  topicSummaryText: { color: ColorTokens.text.secondary },
});

export default WeeklyHomeScreen;
