// src/features/flashcards/FlashcardsHomeScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../ui/flashmedicStyles";

type TopicGroup = {
  topic: string;
  subtopics: string[];
};

type FlashcardsHomeScreenProps = {
  // Fonts
  headingFont: number;
  buttonFont: number;
  metaFont: number;

  // Data
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

  // Actions
  onBack: () => void;
  onStartQuiz: () => void;
};

type ChipItem = {
  key: string; // topic::<ALL> or topic::sub
  label: string;
  topic: string;
  isTopicAll: boolean;
};

function buildChips(groups: TopicGroup[]): ChipItem[] {
  const out: ChipItem[] = [];

  for (const group of groups ?? []) {
    const topic = String((group as any)?.topic ?? "").trim();
    const subtopics = Array.isArray((group as any)?.subtopics)
      ? ((group as any).subtopics as unknown[]).map((s) => String(s))
      : [];

    if (!topic) continue;

    // Topic-only (no subtopics)
    if (subtopics.length === 0) {
      out.push({
        key: `${topic}::<ALL>`,
        label: topic,
        topic,
        isTopicAll: true,
      });
      continue;
    }

    // Subtopic chips
    for (const subRaw of subtopics) {
      const sub = String(subRaw ?? "");
      if (!sub.trim()) continue;

      const isNested = sub.includes("::");
      const displayName = isNested ? sub.split("::")[1] : sub;

      out.push({
        key: `${topic}::${sub}`,
        label: `${topic} – ${displayName}`,
        topic,
        isTopicAll: false,
      });
    }
  }

  out.sort((a, b) => a.label.localeCompare(b.label));
  return out;
}

export default function FlashcardsHomeScreen({
  headingFont,
  buttonFont,
  metaFont,
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
  onBack,
  onStartQuiz,
}: FlashcardsHomeScreenProps) {
  const chipsForSelectedSubject: ChipItem[] = useMemo(() => {
    if (!selectedSubject) return [];
    return buildChips(topicGroupsForSelectedSubject);
  }, [topicGroupsForSelectedSubject, selectedSubject]);

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const startDisabled =
    loadingCards ||
    (!!selectedSubject &&
      cardsForSelectedSubjectCount === 0 &&
      selectedKeys.length === 0);

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
            Flashcards
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

        {/* Help card */}
        <View
          style={[
            styles.statsCard,
            {
              marginTop: 14,
              marginBottom: 14,
              alignSelf: "stretch",
              backgroundColor: "rgba(0,0,0,0.12)",
            },
          ]}
        >
          <Text style={[styles.statsSectionTitle, { color: "#f8f9fa" }]}>
            Sådan bruger du Flashcards
          </Text>

          <Text
            style={[
              styles.statsLabel,
              { color: "#e9ecef", marginTop: 8, lineHeight: 20 },
            ]}
          >
            • Vælg et fag for at se emner og underemner.{"\n"}• Vælg ét eller
            flere emner (eller tryk “Vælg alle”).{"\n"}• Start en quiz – du får
            spørgsmål fra de valgte emner.{"\n"}• Under quizzen: “Jeg kunne den”
            = tæller korrekt. “Jeg kunne den ikke” = kortet kommer igen.
          </Text>
        </View>

        {/* Subjects */}
        <View style={styles.subjectGrid}>
          {subjects.map((subject) => (
            <Pressable
              key={subject}
              onPress={() => {
                setSelectedSubject(
                  selectedSubject === subject ? null : subject,
                );
                setSelectedKeys([]);
              }}
            >
              <Text
                style={[
                  styles.homeNavButtonText,
                  selectedSubject === subject
                    ? { textDecorationLine: "underline" }
                    : undefined,
                ]}
              >
                {subject}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Topics for selected subject */}
        <View style={styles.topicSection}>
          <View style={styles.topicHeaderRow}>
            <Text style={[styles.topicTitle, { fontSize: metaFont }]}>
              {selectedSubject
                ? `Emner i ${selectedSubject}`
                : "Vælg et fag for at se emner"}
            </Text>

            {!!selectedSubject && topicGroupsForSelectedSubject.length > 0 && (
              <Pressable
                onPress={() =>
                  allTopicsSelected
                    ? setSelectedKeys([])
                    : setSelectedKeys(allSelectableKeys)
                }
                hitSlop={8}
              >
                <Text style={styles.topicLink}>
                  {allTopicsSelected ? "Fravælg alle" : "Vælg alle"}
                </Text>
              </Pressable>
            )}
          </View>

          {!selectedSubject ? (
            <Text style={styles.topicEmptyText}>
              Vælg et fag for at browse.
            </Text>
          ) : topicGroupsForSelectedSubject.length === 0 ? (
            <Text style={styles.topicEmptyText}>
              Ingen emner fundet for dette fag.
            </Text>
          ) : (
            <View style={[styles.subtopicRow, { marginLeft: 0 }]}>
              {chipsForSelectedSubject.map((chip) => {
                const selected = selectedKeys.includes(chip.key);
                return (
                  <Pressable
                    key={chip.key}
                    onPress={() => toggleKey(chip.key)}
                    style={[
                      styles.topicChip,
                      selected && { backgroundColor: "#1c7ed6" },
                      selected && styles.topicChipSelected,
                      chip.isTopicAll &&
                        !selected && {
                          backgroundColor: "rgba(255,255,255,0.9)",
                        },
                    ]}
                  >
                    <Text
                      style={[
                        styles.topicChipText,
                        selected && { color: "#fff" },
                        selected && styles.topicChipTextSelected,
                      ]}
                    >
                      {chip.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Pressable
            style={[
              styles.bigButton,
              { backgroundColor: "#1c7ed6", marginTop: 20 },
            ]}
            onPress={onStartQuiz}
            disabled={startDisabled}
          >
            <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>
              {selectedKeys.length === 0
                ? "Start quiz i alle emner"
                : "Start quiz i valgte emner"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
