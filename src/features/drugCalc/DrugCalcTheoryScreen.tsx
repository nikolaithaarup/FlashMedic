// src/features/drugCalc/DrugCalcTheoryScreen.tsx
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../ui/flashmedicStyles";
import { Background, ToolPageHeader } from "../../ui/primitives";
import { DRUG_TOPICS, THEORY, type DrugCalcTopic } from "./drugCalcContent";

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  onBack: () => void;
};

export function DrugCalcTheoryScreen({
  onBack,
}: Props) {
  const [topic, setTopic] = useState<DrugCalcTopic>("strength");

  const section = useMemo(() => THEORY.find((s) => s.topic === topic), [topic]);

  return (
    <Background style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.homeContainer, styles.safeTopContainer]}
      >
        <ToolPageHeader
          onBack={onBack}
          subtitle="Forklaringer og gennemregnede eksempler"
          title="Lægemiddelregning · Teori"
        />

        {/* Topic picker */}
        <View
          style={[styles.statsCard, { alignSelf: "stretch", marginBottom: 12 }]}
        >
          <Text style={styles.statsSectionTitle}>Vælg emne</Text>
          <View style={[styles.subtopicRow, { marginLeft: 0, marginTop: 10 }]}>
            {DRUG_TOPICS.map((t) => {
              const selected = t.id === topic;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setTopic(t.id as DrugCalcTopic)}
                  style={[
                    styles.topicChip,
                    selected && styles.topicChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.topicChipText,
                      selected && styles.topicChipTextSelected,
                    ]}
                  >
                    {t.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Theory content */}
        <View style={[styles.statsCard, { alignSelf: "stretch" }]}>
          <Text style={styles.statsSectionTitle}>
            {section?.title ?? "Teori"}
          </Text>

          {section?.bullets?.length ? (
            <Text style={[styles.drugTheoryText, { marginTop: 8 }]}>
              {section.bullets.map((b) => `• ${b}`).join("\n")}
            </Text>
          ) : null}

          {section?.workedExamples?.length ? (
            <>
              <Text style={[styles.statsSectionTitle, { marginTop: 18 }]}>
                Eksempler
              </Text>

              {section.workedExamples.map((ex) => (
                <View key={ex.title} style={{ marginTop: 10 }}>
                  <Text style={[styles.statsLabel, { fontWeight: "800" }]}>
                    {ex.title}
                  </Text>
                  <Text style={[styles.drugTheoryText, { marginTop: 6 }]}>
                    {ex.steps.map((s) => `- ${s}`).join("\n")}
                  </Text>
                </View>
              ))}
            </>
          ) : null}
        </View>
      </ScrollView>
    </Background>
  );
}

export default DrugCalcTheoryScreen;
