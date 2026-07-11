import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
  EmptyState,
  ErrorState,
  LoadingState,
  NoticeCard,
  PrimaryButton,
  Screen,
  SecondaryButton,
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
  description: string;
  locked: boolean;
  onPress: () => void;
};

function GameCard({ title, description, locked, onPress }: GameCardProps) {
  return (
    <Pressable
      accessibilityLabel={`${title}. ${locked ? "Låst til næste uge" : description}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      disabled={locked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.gameCard,
        pressed && styles.gameCardPressed,
        locked && styles.gameCardLocked,
      ]}
    >
      <View style={styles.gameCopy}>
        <Text style={styles.gameTitle}>{title}</Text>
        <Text style={styles.gameDescription}>
          {locked ? "Allerede spillet · låst til næste uge" : description}
        </Text>
      </View>
      <Text style={styles.gameArrow} accessibilityElementsHidden>
        {locked ? "✓" : "›"}
      </Text>
    </Pressable>
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
  const top10 = weeklyGlobal?.leaderboard ?? [];
  const topics = weeklyGlobal?.week?.topics ?? null;
  const resolution = weeklyGlobal?.week?.resolution ?? null;

  return (
    <Screen>
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBackToHome}
        subtitle="Tre udfordringer · én deltagelse pr. spil"
        title="Ugens udfordringer"
      />

      <Text style={styles.sectionLabel}>UGENS SPIL</Text>
      {resolution?.isFallback ? (
        <NoticeCard title="Kompatibilitetsindhold" tone="info">
          Ugens spil bruger en ældre version af indholdet. Du kan stadig spille
          og gemme dit resultat.
        </NoticeCard>
      ) : null}
      {pendingWeeklyUploads > 0 ? (
        <NoticeCard title="Resultat venter på at blive sendt" tone="warning">
          {`${pendingWeeklyUploads} resultat${pendingWeeklyUploads === 1 ? "" : "er"} er gemt sikkert på enheden. Tryk Opdatér for at prøve igen.`}
        </NoticeCard>
      ) : null}
      <View style={styles.gameList}>
        <GameCard
          description="Vælg det korrekte svar."
          locked={mcqLock.locked}
          onPress={onOpenMcq}
          title="Ugens quiz"
        />
        <GameCard
          description="Forbind begreber og forklaringer."
          locked={matchLock.locked}
          onPress={onOpenMatch}
          title="Match parrene"
        />
        <GameCard
          description="Find ugens medicinske ord."
          locked={wordLock.locked}
          onPress={onOpenWord}
          title="Ugens ord"
        />
      </View>

      <View style={styles.leaderboardHeader}>
        <View style={styles.headerCopy}>
          <Text style={styles.sectionLabel}>FÆLLES STATISTIK</Text>
          <Text style={styles.sectionTitle}>
            Rangliste{weekId ? ` · ${weekId}` : ""}
          </Text>
        </View>
        <SecondaryButton
          disabled={loadingWeekly}
          label="Opdatér"
          loading={loadingWeekly}
          onPress={refreshWeeklyGlobal}
          style={styles.refreshButton}
        />
      </View>

      <Card variant="subtle">
        {loadingWeekly ? (
          <LoadingState title="Henter rangliste" />
        ) : weeklyError ? (
          <ErrorState
            action={
              <PrimaryButton
                label="Prøv igen"
                onPress={refreshWeeklyGlobal}
              />
            }
            message={weeklyError}
            title="Ugens udfordringer er ikke tilgængelige"
          />
        ) : !weeklyGlobal?.week ? (
          <EmptyState
            message="Der er endnu ikke udgivet indhold til denne uge."
            title="Intet indhold denne uge"
          />
        ) : top10.length === 0 ? (
          <EmptyState title="Ingen resultater endnu" />
        ) : (
          top10.slice(0, 5).map((result: any, index: number) => (
            <View
              key={result.userId ?? String(index)}
              style={styles.rankRow}
            >
              <Text style={styles.rankPosition}>{index + 1}</Text>
              <View style={styles.rankIdentity}>
                <Text style={styles.rankName}>{result.nickname}</Text>
                {result.classId ? (
                  <Text style={styles.rankMeta}>Behandler {result.classId}</Text>
                ) : null}
              </View>
              <Text style={styles.rankScore}>{result.points} point</Text>
            </View>
          ))
        )}

        {topics ? (
          <View style={styles.topicSummary}>
            <Text style={styles.topicSummaryTitle}>Ugens emner</Text>
            <Text style={styles.topicSummaryText}>Quiz · {topics.mcq ?? "—"}</Text>
            <Text style={styles.topicSummaryText}>
              Match · {topics.match ?? "—"}
            </Text>
            <Text style={styles.topicSummaryText}>Ord · {topics.word ?? "—"}</Text>
          </View>
        ) : null}
      </Card>
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
  gameList: { gap: Spacing.sm, marginTop: Spacing.sm },
  gameCard: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radii.lg,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.subtle,
    padding: Spacing.lg,
  },
  gameCardPressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.cardPressedScale }],
  },
  gameCardLocked: { opacity: Interaction.disabledOpacity },
  gameCopy: { flex: 1, minWidth: 0 },
  gameTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  gameDescription: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    marginTop: 2,
  },
  gameArrow: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.pageTitle,
    marginLeft: Spacing.md,
  },
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
    paddingTop: Spacing.md,
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
    gap: Spacing.xs,
  },
  topicSummaryTitle: { color: ColorTokens.text.primary, fontWeight: Typography.weights.bold },
  topicSummaryText: { color: ColorTokens.text.secondary },
});

export default WeeklyHomeScreen;
