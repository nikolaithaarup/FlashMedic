// src/features/weekly/WeeklyHomeScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../ui/flashmedicStyles";
import { useStats } from "../stats/StatsContext";

type WeeklyHomeScreenProps = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  weeklyMcqLocked: boolean;
  weeklyMatchLocked: boolean;
  weeklyWordLocked: boolean;
  onBackToHome: () => void;
  onOpenMcq: () => void;
  onOpenMatch: () => void;
  onOpenWord: () => void;
};

export function WeeklyHomeScreen({
  headingFont,
  subtitleFont,
  buttonFont,
  weeklyMcqLocked,
  weeklyMatchLocked,
  weeklyWordLocked,
  onBackToHome,
  onOpenMcq,
  onOpenMatch,
  onOpenWord,
}: WeeklyHomeScreenProps) {
  const { weeklyGlobal, loadingWeekly, refreshWeeklyGlobal } = useStats();

  // Fetch weekly global stats when this screen mounts
  useEffect(() => {
    // avoid spamming if it already exists
    if (!weeklyGlobal) refreshWeeklyGlobal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const weekId = weeklyGlobal?.week?.weekId ?? null;
  const top10 = weeklyGlobal?.leaderboard ?? [];
  const topics = weeklyGlobal?.week?.topics ?? null;

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
            Weekly Challenges
          </Text>
          <Pressable
            style={[styles.smallButton, { borderColor: "#fff" }]}
            onPress={onBackToHome}
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
          Ugens spiltyper – én gang pr. spil.
        </Text>

        {/* ✅ Global weekly leaderboard card */}
        <View
          style={[styles.statsCard, { alignSelf: "stretch", marginTop: 14 }]}
        >
          <View style={styles.headerRow}>
            <Text style={styles.statsSectionTitle}>
              Global statistik – Weekly Challenge{weekId ? ` (${weekId})` : ""}
            </Text>

            <Pressable
              style={[styles.smallButton, { borderColor: "#dee2e6" }]}
              onPress={refreshWeeklyGlobal}
              disabled={loadingWeekly}
            >
              <Text style={[styles.smallButtonText, { color: "#343a40" }]}>
                {loadingWeekly ? "..." : "Opdatér"}
              </Text>
            </Pressable>
          </View>

          {loadingWeekly ? (
            <Text style={[styles.statsLabel, { marginTop: 8 }]}>
              Henter leaderboard…
            </Text>
          ) : top10.length === 0 ? (
            <Text style={[styles.statsLabel, { marginTop: 8 }]}>
              Ingen data endnu.
            </Text>
          ) : (
            top10.slice(0, 5).map((r: any, i: number) => (
              <View key={r.userId ?? String(i)} style={styles.statsRankRow}>
                <Text style={styles.statsRankPosition}>{i + 1}.</Text>
                <Text style={styles.statsRankName}>
                  {r.nickname}
                  {r.classId ? (
                    <Text style={styles.statsRankClass}>
                      {" "}
                      · Behandler {r.classId}
                    </Text>
                  ) : null}
                </Text>
                <Text style={styles.statsRankScore}>{r.points} pts</Text>
              </View>
            ))
          )}

          {/* Optional: show topics from the active week */}
          {topics ? (
            <Text style={[styles.statsLabel, { marginTop: 12 }]}>
              Ugens emner:{"\n"}• MCQ: {topics.mcq ?? "—"}
              {"\n"}• Match: {topics.match ?? "—"}
              {"\n"}• Word: {topics.word ?? "—"}
            </Text>
          ) : null}
        </View>

        <View style={styles.homeButtonsContainer}>
          {/* MCQ */}
          <Pressable
            style={[styles.homeNavButton, weeklyMcqLocked && { opacity: 0.5 }]}
            onPress={onOpenMcq}
          >
            <Text style={styles.homeNavButtonText}>
              Multiple Choice Game
              {weeklyMcqLocked ? " ✓ (låst til næste uge)" : ""}
            </Text>
          </Pressable>

          {/* Match */}
          <Pressable
            style={[
              styles.homeNavButton,
              weeklyMatchLocked && { opacity: 0.5 },
            ]}
            onPress={onOpenMatch}
          >
            <Text style={styles.homeNavButtonText}>
              Match Game {weeklyMatchLocked ? " ✓ (låst til næste uge)" : ""}
            </Text>
          </Pressable>

          {/* Word */}
          <Pressable
            style={[styles.homeNavButton, weeklyWordLocked && { opacity: 0.5 }]}
            onPress={onOpenWord}
          >
            <Text style={styles.homeNavButtonText}>
              Word of the Week{" "}
              {weeklyWordLocked ? " ✓ (låst til næste uge)" : ""}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default WeeklyHomeScreen;
