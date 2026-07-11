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
import type { TopicStats } from "../../types/Learning";

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
  onStartAllSubjectsQuiz: () => void;
  disableAllSubjectsQuiz: boolean;
  onBack: () => void;
  onStartQuiz: () => void;
  pendingMistakeCount: number;
  weakestTopics: TopicStats[];
  onStartMistakeReview: () => void;
  onStartWeakTopics: () => void;
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
      result.push({ key: `${topic}::${sub}`, label: `${topic} - ${displayName}` });
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
  onStartAllSubjectsQuiz,
  disableAllSubjectsQuiz,
  onBack,
  onStartQuiz,
  pendingMistakeCount,
  weakestTopics,
  onStartMistakeReview,
  onStartWeakTopics,
}: FlashcardsHomeScreenProps) {
  const topicChips = useMemo(
    () => (selectedSubject ? buildChips(topicGroupsForSelectedSubject) : []),
    [selectedSubject, topicGroupsForSelectedSubject],
  );
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
        subtitle="Flashcard-træning til ambulancefag, eksamen og faglig genopfriskning."
        title="FlashMedic"
      />

      <NoticeCard title="Sådan træner du">
        Start blandet træning, eller vælg fag og emner længere nede.
      </NoticeCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>HURTIG START</Text>
        <Text style={styles.sectionTitle}>Kom i gang med det samme</Text>
      </View>

      <Card variant="subtle" style={styles.allSubjectsCard}>
        <View style={styles.allSubjectsCopy}>
          <Text style={styles.cardTitle}>Træn alle fag</Text>
          <Text style={styles.cardDescription}>
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
        <Text style={styles.sectionLabel}>PERSONLIG TRÆNING</Text>
        <Text style={styles.sectionTitle}>Træn ud fra dine svar</Text>
      </View>

      <View style={styles.learningGrid}>
        <Card variant="subtle" style={styles.learningCard}>
          <Text style={styles.cardTitle}>Forkerte svar</Text>
          <Text style={styles.cardDescription}>
            Gennemgå de kort, du tidligere har svaret forkert på.
          </Text>
          <Text style={styles.learningMeta}>
            {pendingMistakeCount === 0
              ? "Ingen kort venter på repetition"
              : `${pendingMistakeCount} kort venter`}
          </Text>
          <PrimaryButton
            disabled={pendingMistakeCount === 0 || loadingCards}
            label="Træn forkerte svar"
            onPress={onStartMistakeReview}
          />
        </Card>

        <Card variant="subtle" style={styles.learningCard}>
          <Text style={styles.cardTitle}>Svage emner</Text>
          <Text style={styles.cardDescription}>
            Træn de emner, hvor dine svar viser, at du har mest brug for repetition.
          </Text>
          {weakestTopics.length === 0 ? (
            <Text style={styles.learningMeta}>
              Ikke nok data endnu. Lav mindst fem besvarelser i et emne.
            </Text>
          ) : (
            <View style={styles.weakTopicList}>
              {weakestTopics.map((topic) => (
                <Text key={topic.key} style={styles.learningMeta}>
                  {topic.topic}
                  {topic.subtopic ? ` · ${topic.subtopic}` : ""} ·{" "}
                  {Math.round(topic.accuracy * 100)}%
                </Text>
              ))}
            </View>
          )}
          <SecondaryButton
            disabled={weakestTopics.length === 0 || loadingCards}
            label="Træn svage emner"
            onPress={onStartWeakTopics}
          />
        </Card>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>VÆLG FAG OG EMNER</Text>
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
        <Text style={styles.sectionLabel}>EMNER</Text>
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
                  ? "Vælg et eller flere emner for at starte en målrettet quiz."
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

      {selectedSubject && selectedKeys.length > 0 ? (
        <PrimaryButton
          disabled={loadingCards}
          label="Træn valgte emner"
          loading={loadingCards}
          onPress={onStartQuiz}
          style={styles.startButton}
        />
      ) : null}
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
  cardTitle: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  cardDescription: {
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
  learningGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  learningCard: { flex: 1, minWidth: 260, gap: Spacing.sm },
  learningMeta: {
    color: ColorTokens.accent.muted,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  weakTopicList: { gap: Spacing.xs },
});
