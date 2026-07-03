import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  ColorTokens,
  Spacing,
  Typography,
} from "../../../constants/theme";
import {
  Card,
  Chip,
  EmptyState,
  NoticeCard,
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";

type TopicGroup = { topic: string; subtopics: string[] };

type FlashcardsHomeScreenProps = {
  headingFont: number;
  buttonFont: number;
  metaFont: number;
  subjects: string[];
  loadingCards: boolean;
  selectedSubject: string | null;
  setSelectedSubject: React.Dispatch<React.SetStateAction<string | null>>;
  selectedKeys: string[];
  setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>;
  topicGroupsForSelectedSubject: TopicGroup[];
  allSelectableKeys: string[];
  allTopicsSelected: boolean;
  cardsForSelectedSubjectCount: number;
  onStartAllSubjectsQuiz: () => void;
  disableAllSubjectsQuiz: boolean;
  onBack: () => void;
  onStartQuiz: () => void;
};

type ChipItem = { key: string; label: string };

function buildChips(groups: TopicGroup[]): ChipItem[] {
  const result: ChipItem[] = [];

  for (const group of groups ?? []) {
    const topic = String(group?.topic ?? "").trim();
    const subtopics = Array.isArray(group?.subtopics)
      ? group.subtopics.map(String)
      : [];

    if (!topic) continue;
    if (subtopics.length === 0) {
      result.push({ key: `${topic}::<ALL>`, label: topic });
      continue;
    }

    for (const sub of subtopics) {
      if (!sub.trim()) continue;
      const displayName = sub.includes("::") ? sub.split("::")[1] : sub;
      result.push({ key: `${topic}::${sub}`, label: `${topic} – ${displayName}` });
    }
  }

  return result.sort((a, b) => a.label.localeCompare(b.label));
}

export default function FlashcardsHomeScreen({
  subjects,
  loadingCards,
  selectedSubject,
  setSelectedSubject,
  selectedKeys,
  setSelectedKeys,
  topicGroupsForSelectedSubject,
  allSelectableKeys,
  allTopicsSelected,
  cardsForSelectedSubjectCount,
  onStartAllSubjectsQuiz,
  disableAllSubjectsQuiz,
  onBack,
  onStartQuiz,
}: FlashcardsHomeScreenProps) {
  const topicChips = useMemo(
    () => (selectedSubject ? buildChips(topicGroupsForSelectedSubject) : []),
    [selectedSubject, topicGroupsForSelectedSubject],
  );
  const startDisabled =
    loadingCards ||
    (!!selectedSubject &&
      cardsForSelectedSubjectCount === 0 &&
      selectedKeys.length === 0);

  const toggleKey = (key: string) => {
    setSelectedKeys((current) =>
      current.includes(key)
        ? current.filter((candidate) => candidate !== key)
        : [...current, key],
    );
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBack}
        subtitle="Sammensæt din træning"
        title="Flashcards"
      />

      <NoticeCard title="Sådan kommer du i gang">
        Vælg først et fag og derefter de emner, du vil træne. Kort, du ikke kan,
        kommer igen i quizzen.
      </NoticeCard>

      <Card variant="subtle" style={styles.allSubjectsCard}>
        <View style={styles.allSubjectsCopy}>
          <Text style={styles.allSubjectsTitle}>Træn alle fag</Text>
          <Text style={styles.allSubjectsDescription}>
            Blandede flashcards fra hele FlashMedic.
          </Text>
        </View>
        <PrimaryButton
          disabled={disableAllSubjectsQuiz}
          label="Start blandet træning"
          onPress={onStartAllSubjectsQuiz}
          style={styles.allSubjectsButton}
        />
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>1 · FAG</Text>
        <Text style={styles.sectionTitle}>Hvad vil du træne?</Text>
      </View>

      <Card variant="subtle" style={styles.sectionCard}>
        <View style={styles.chipList}>
          {subjects.map((subject) => {
            const selected = selectedSubject === subject;
            return (
              <Chip
                key={subject}
                label={subject}
                onPress={() => {
                  setSelectedSubject(selected ? null : subject);
                  setSelectedKeys([]);
                }}
                selected={selected}
              />
            );
          })}
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>2 · EMNER</Text>
        <Text style={styles.sectionTitle}>
          {selectedSubject ? `Emner i ${selectedSubject}` : "Vælg et fag"}
        </Text>
      </View>

      <Card variant="subtle" style={styles.sectionCard}>
        {!selectedSubject ? (
          <EmptyState
            message="Emnerne vises her, når du har valgt et fag ovenfor."
            title="Intet fag valgt"
          />
        ) : topicGroupsForSelectedSubject.length === 0 ? (
          <EmptyState
            message="Der er endnu ingen emner tilgængelige i dette fag."
            title="Ingen emner fundet"
          />
        ) : (
          <>
            <View style={styles.selectionHeader}>
              <Text style={styles.selectionCount}>
                {selectedKeys.length === 0
                  ? "Alle emner bruges"
                  : `${selectedKeys.length} valgt`}
              </Text>
              <SecondaryButton
                label={allTopicsSelected ? "Fravælg alle" : "Vælg alle"}
                onPress={() =>
                  allTopicsSelected
                    ? setSelectedKeys([])
                    : setSelectedKeys(allSelectableKeys)
                }
                style={styles.selectAllButton}
              />
            </View>
            <View style={styles.chipList}>
              {topicChips.map((chip) => (
                <Chip
                  key={chip.key}
                  label={chip.label}
                  onPress={() => toggleKey(chip.key)}
                  selected={selectedKeys.includes(chip.key)}
                />
              ))}
            </View>
          </>
        )}
      </Card>

      <PrimaryButton
        disabled={startDisabled}
        label={
          selectedKeys.length === 0
            ? "Start quiz i alle emner"
            : "Start quiz i valgte emner"
        }
        loading={loadingCards}
        onPress={onStartQuiz}
        style={styles.startButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  allSubjectsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  allSubjectsCopy: { flex: 1, minWidth: 0 },
  allSubjectsTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  allSubjectsDescription: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    marginTop: 2,
  },
  allSubjectsButton: { minWidth: 176 },
  sectionHeader: { marginTop: Spacing.xl, marginBottom: Spacing.sm },
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
  sectionCard: { gap: Spacing.md },
  chipList: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  selectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  selectionCount: {
    flex: 1,
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
  },
  selectAllButton: { minWidth: 132 },
  startButton: { marginTop: Spacing.xl, marginBottom: Spacing.lg },
});
