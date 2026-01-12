import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../../app/flashmedicStyles";

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
  setSelectedSubject: (s: string | null) => void;

  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;

  topicGroupsForSelectedSubject: TopicGroup[];
  allSelectableKeys: string[];
  allTopicsSelected: boolean;

  cardsForSelectedSubjectCount: number;

  // Actions
  onBack: () => void;
  onStartQuiz: () => void;
};

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
  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}>
            Flashcards
          </Text>
          <Pressable style={[styles.smallButton, { borderColor: "#fff" }]} onPress={onBack} hitSlop={8}>
            <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
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
          <Text style={[styles.statsSectionTitle, { color: "#f8f9fa" }]}>Sådan bruger du Flashcards</Text>

          <Text style={[styles.statsLabel, { color: "#e9ecef", marginTop: 8, lineHeight: 20 }]}>
            • Vælg et fag for at se emner og underemner.{"\n"}
            • Vælg ét eller flere emner (eller tryk “Vælg alle”).{"\n"}
            • Start en quiz – du får spørgsmål fra de valgte emner.{"\n"}
            • Under quizzen: “Jeg kunne den” = tæller korrekt. “Jeg kunne den ikke” = kortet kommer igen.
          </Text>

          <Text style={[styles.statsLabel, { color: "#e9ecef", marginTop: 10, lineHeight: 20 }]}>
            Tip: Hvis du vil træne bredt, så vælg alle emner. Hvis du crammer til skole (vi dømmer ikke), så vælg
            et enkelt underemne.
          </Text>
        </View>

        {/* Subjects */}
        <View style={styles.subjectGrid}>
          {subjects.map((subject) => (
            <Pressable
              key={subject}
              onPress={() => {
                setSelectedSubject(selectedSubject === subject ? null : subject);
                setSelectedKeys([]);
              }}
            >
              <Text
                style={[
                  styles.homeNavButtonText,
                  selectedSubject === subject ? { textDecorationLine: "underline" } : undefined,
                ]}
              >
                {subject}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Topics */}
        {selectedSubject && (
          <View style={styles.topicSection}>
            <View style={styles.topicHeaderRow}>
              <Text style={[styles.topicTitle, { fontSize: metaFont }]}>Emner i {selectedSubject}</Text>

              {topicGroupsForSelectedSubject.length > 0 && (
                <Pressable
                  onPress={() => (allTopicsSelected ? setSelectedKeys([]) : setSelectedKeys(allSelectableKeys))}
                  hitSlop={8}
                >
                  <Text style={styles.topicLink}>{allTopicsSelected ? "Fravælg alle" : "Vælg alle"}</Text>
                </Pressable>
              )}
            </View>

            {topicGroupsForSelectedSubject.length === 0 ? (
              <Text style={styles.topicEmptyText}>Ingen emner fundet for dette fag.</Text>
            ) : (
              <View style={styles.topicGroupList}>
                {topicGroupsForSelectedSubject.map((group) => {
                  const groupKeys =
                    group.subtopics.length === 0
                      ? [`${group.topic}::<ALL>`]
                      : group.subtopics.map((sub) => `${group.topic}::${sub}`);

                  const groupSelected = groupKeys.every((k) => selectedKeys.includes(k));

                  return (
                    <View key={group.topic} style={styles.topicGroup}>
                      {/* Group title toggles all subtopics */}
                      {group.subtopics.length > 0 && (
                        <Text
                          style={[
                            styles.topicGroupTitle,
                            groupSelected && styles.topicGroupTitleSelected,
                          ]}
                          onPress={() => {
                            if (groupSelected) {
                              setSelectedKeys((prev) => prev.filter((k) => !groupKeys.includes(k)));
                            } else {
                              setSelectedKeys((prev) => Array.from(new Set([...prev, ...groupKeys])));
                            }
                          }}
                        >
                          {group.topic}
                        </Text>
                      )}

                      <View style={styles.subtopicRow}>
                        {group.subtopics.length === 0 ? (
                          <Pressable
                            onPress={() =>
                              setSelectedKeys((prev) =>
                                prev.includes(`${group.topic}::<ALL>`)
                                  ? prev.filter((k) => k !== `${group.topic}::<ALL>`)
                                  : [...prev, `${group.topic}::<ALL>`],
                              )
                            }
                            style={[
                              styles.topicChip,
                              selectedKeys.includes(`${group.topic}::<ALL>`) && styles.topicChipSelected,
                            ]}
                          >
                            <Text
                              style={[
                                styles.topicChipText,
                                selectedKeys.includes(`${group.topic}::<ALL>`) && styles.topicChipTextSelected,
                              ]}
                            >
                              {group.topic}
                            </Text>
                          </Pressable>
                        ) : (
                          group.subtopics.map((sub) => {
                            const key = `${group.topic}::${sub}`;
                            const selected = selectedKeys.includes(key);

                            const isNested = sub.includes("::");
                            const displayName = isNested ? sub.split("::")[1] : sub;

                            return (
                              <Pressable
                                key={key}
                                onPress={() =>
                                  setSelectedKeys((prev) =>
                                    prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
                                  )
                                }
                                style={[
                                  styles.topicChip,
                                  selected && styles.topicChipSelected,
                                  isNested && { marginLeft: 24, backgroundColor: "#f1f3f5" },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.topicChipText,
                                    selected && styles.topicChipTextSelected,
                                    isNested && { fontSize: 13, color: "#495057" },
                                  ]}
                                >
                                  {displayName}
                                </Text>
                              </Pressable>
                            );
                          })
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            <Pressable
              style={[styles.bigButton, { backgroundColor: "#1c7ed6", marginTop: 20 }]}
              onPress={onStartQuiz}
              disabled={loadingCards || cardsForSelectedSubjectCount === 0}
            >
              <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>
                {selectedKeys.length === 0 ? "Start quiz i alle emner" : "Start quiz i valgte emner"}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
