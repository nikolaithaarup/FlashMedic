import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ColorTokens, Spacing, Typography } from "../../../constants/theme";
import {
  Chip,
  EmptyState,
  NavigationCard,
  PrimaryButton,
  Screen,
  SectionHeader,
  SecondaryButton,
  Surface,
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
type SetupView = "modes" | "subjects" | "topics";

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
  const [setupView, setSetupView] = useState<SetupView>(
    selectedSubject ? "topics" : "modes",
  );
  const toggleKey = (key: string) => {
    setSelectedKeys((current) =>
      current.includes(key)
        ? current.filter((candidate) => candidate !== key)
        : [...current, key],
    );
  };

  const handleBack = () => {
    if (setupView === "topics") {
      setSetupView("subjects");
      return;
    }
    if (setupView === "subjects") {
      setSetupView("modes");
      return;
    }
    onBack();
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel={setupView === "modes" ? "Tilbage til forsiden" : "Tilbage"}
        onBack={handleBack}
        subtitle="Flashcard-træning til ambulancefag, eksamen og faglig genopfriskning."
        title="FlashMedic"
      />

      {setupView === "modes" ? (
        <>
          <SectionHeader
            description="Vælg den træning, der passer til dit mål lige nu."
            label="TRÆNING"
            title="Hvordan vil du træne?"
          />
          <View style={styles.modeList}>
            <NavigationCard
              description="Blandede kort fra alle fag."
              disabled={disableAllSubjectsQuiz}
              eyebrow="HURTIG START"
              onPress={onStartAllSubjectsQuiz}
              title="Blandede kort"
            />
            <NavigationCard
              description={
                pendingMistakeCount === 0
                  ? "Ingen kort venter på repetition."
                  : `${pendingMistakeCount} kort venter på repetition.`
              }
              disabled={pendingMistakeCount === 0 || loadingCards}
              eyebrow="PERSONLIG"
              onPress={onStartMistakeReview}
              title="Forkerte svar"
            />
            <NavigationCard
              description={
                weakestTopics.length === 0
                  ? "Ikke nok data endnu."
                  : `${weakestTopics.length} svage emner er klar.`
              }
              disabled={weakestTopics.length === 0 || loadingCards}
              eyebrow="PERSONLIG"
              onPress={onStartWeakTopics}
              title="Svage emner"
            />
            <NavigationCard
              description="Vælg fag og et eller flere emner."
              eyebrow="MÅLRETTET"
              onPress={() => setSetupView(selectedSubject ? "topics" : "subjects")}
              title="Vælg selv"
            />
          </View>
        </>
      ) : null}

      {setupView === "subjects" ? (
        <>
          <SectionHeader
            description="Når du vælger et fag, går du videre til fagets emner."
            label="TRIN 1 AF 2"
            title="Vælg fag"
          />
          <Surface style={styles.sectionCard}>
            <View style={styles.chipList}>
              {subjects.map((subject) => (
                <Chip
                  key={subject}
                  label={subject}
                  onPress={() => {
                    if (selectedSubject !== subject) {
                      setSelectedSubject(subject);
                      setSelectedKeys([]);
                    }
                    setSetupView("topics");
                  }}
                  selected={selectedSubject === subject}
                />
              ))}
            </View>
          </Surface>
        </>
      ) : null}

      {setupView === "topics" && selectedSubject ? (
        <>
          <SectionHeader
            description="Vælg et eller flere emner, og start træningen."
            label="TRIN 2 AF 2"
            title="Vælg emner"
          />
          <Surface tone="accent" style={styles.subjectSummary}>
            <View style={styles.subjectSummaryCopy}>
              <Text style={styles.cardTitle}>{selectedSubject} ✓</Text>
              <Text style={styles.cardDescription}>Valgt fag</Text>
            </View>
            <SecondaryButton
              label="Skift fag"
              onPress={() => setSetupView("subjects")}
              style={styles.changeSubjectButton}
            />
          </Surface>
          <Surface style={styles.sectionCard}>
            {topicGroupsForSelectedSubject.length === 0 ? (
              <EmptyState
                message="Der er endnu ingen emner tilgængelige i dette fag."
                title="Ingen emner fundet"
              />
            ) : (
              <>
                <View style={styles.selectionHeader}>
                  <Text style={styles.selectionCount}>
                    {selectedKeys.length === 0
                      ? "Ingen emner valgt"
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
                {selectedKeys.length > 0 ? (
                  <PrimaryButton
                    disabled={loadingCards}
                    label="Træn valgte emner"
                    loading={loadingCards}
                    onPress={onStartQuiz}
                  />
                ) : null}
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
          </Surface>
        </>
      ) : null}

      {setupView === "topics" && !selectedSubject ? (
        <Surface style={styles.sectionCard}>
          <EmptyState
            message="Vælg et fag, før du vælger emner."
            title="Intet fag valgt"
          />
          <SecondaryButton
            label="Vælg fag"
            onPress={() => setSetupView("subjects")}
          />
        </Surface>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  modeList: { gap: Spacing.sm },
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
  subjectSummary: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  subjectSummaryCopy: { flex: 1, minWidth: 150 },
  changeSubjectButton: { minWidth: 112 },
});
