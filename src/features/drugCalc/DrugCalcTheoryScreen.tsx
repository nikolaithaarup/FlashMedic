import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import {
  Accordion,
  Card,
  Chip,
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";
import {
  COMMON_PITFALLS,
  DRUG_TOPICS,
  THEORY,
  type DrugCalcTopic,
  type WorkedExample,
} from "./drugCalcContent";

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  onBack: () => void;
};

function BulletText({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bullet} />
      <Text style={styles.bodyText}>{children}</Text>
    </View>
  );
}

function WorkedExampleCard({ example }: { example: WorkedExample }) {
  return (
    <Card variant="subtle" style={styles.section}>
      <Text style={styles.cardTitle}>{example.title}</Text>
      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>Problem</Text>
        <Text style={styles.bodyText}>{example.problem}</Text>
      </View>
      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>Formel</Text>
        <Text style={styles.formulaText}>{example.formula}</Text>
      </View>
      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>Beregning</Text>
        <View style={styles.bulletList}>
          {example.calculation.map((calculation) => (
            <BulletText key={calculation}>{calculation}</BulletText>
          ))}
        </View>
      </View>
      <View style={styles.answerBlock}>
        <Text style={styles.answerLabel}>Slutsvar</Text>
        <Text style={styles.answerText}>{example.finalAnswer}</Text>
      </View>
      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>Typisk faldgrube</Text>
        <Text style={styles.bodyText}>{example.commonPitfall}</Text>
      </View>
    </Card>
  );
}

export function DrugCalcTheoryScreen({ onBack }: Props) {
  const [topic, setTopic] = useState<DrugCalcTopic>("strength");
  const [topicsExpanded, setTopicsExpanded] = useState(false);
  const [moreExamplesExpanded, setMoreExamplesExpanded] = useState(false);
  const [pitfallsExpanded, setPitfallsExpanded] = useState(false);
  const section = useMemo(() => THEORY.find((item) => item.topic === topic), [topic]);
  const topicIndex = DRUG_TOPICS.findIndex((item) => item.id === topic);
  const selectedTopic = DRUG_TOPICS[topicIndex];
  const selectTopic = (nextTopic: DrugCalcTopic) => {
    setTopic(nextTopic);
    setTopicsExpanded(false);
    setMoreExamplesExpanded(false);
  };

  return (
    <Screen contentContainerStyle={styles.content} testID="drug-calc-theory-screen">
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til Lægemiddelregning"
        onBack={onBack}
        subtitle="Formler, enhedskontrol og gennemregnede eksempler."
        title="Lær metoden"
      />

      <Accordion
        expanded={topicsExpanded}
        onToggle={() => setTopicsExpanded((current) => !current)}
        style={styles.section}
        subtitle={selectedTopic?.title}
        title="Vælg emne"
      >
        <View style={styles.topicGrid}>
          {DRUG_TOPICS.map((item) => (
            <Chip
              key={item.id}
              label={item.title}
              onPress={() => selectTopic(item.id)}
              selected={item.id === topic}
            />
          ))}
        </View>
      </Accordion>

      {section ? (
        <>
          <Card variant="subtle" style={styles.section}>
            <Text style={styles.eyebrow}>LÆR METODEN</Text>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.bulletList}>
              {section.bullets.map((bullet) => (
                <BulletText key={bullet}>{bullet}</BulletText>
              ))}
            </View>
          </Card>

          <Text style={styles.groupTitle}>Eksempel trin for trin</Text>
          {section.workedExamples[0] ? (
            <WorkedExampleCard example={section.workedExamples[0]} />
          ) : null}
          {section.workedExamples.length > 1 ? (
            <Accordion
              expanded={moreExamplesExpanded}
              onToggle={() =>
                setMoreExamplesExpanded((current) => !current)
              }
              style={styles.section}
              subtitle={`${section.workedExamples.length - 1} ekstra`}
              title="Flere eksempler"
            >
              <View style={styles.exampleList}>
                {section.workedExamples.slice(1).map((example) => (
                  <WorkedExampleCard example={example} key={example.title} />
                ))}
              </View>
            </Accordion>
          ) : null}
          <View style={styles.topicActions}>
            <SecondaryButton
              disabled={topicIndex <= 0}
              label="Forrige emne"
              onPress={() => selectTopic(DRUG_TOPICS[topicIndex - 1].id)}
              style={styles.topicAction}
            />
            <PrimaryButton
              disabled={topicIndex >= DRUG_TOPICS.length - 1}
              label="Næste emne"
              onPress={() => selectTopic(DRUG_TOPICS[topicIndex + 1].id)}
              style={styles.topicAction}
            />
          </View>
        </>
      ) : null}

      <Accordion
        expanded={pitfallsExpanded}
        onToggle={() => setPitfallsExpanded((current) => !current)}
        style={styles.section}
        subtitle="Enheder, regneretning og plausibilitet"
        title="Typiske fejl"
      >
        <View style={styles.bulletList}>
          {COMMON_PITFALLS.map((pitfall) => (
            <BulletText key={pitfall}>{pitfall}</BulletText>
          ))}
        </View>
      </Accordion>
    </Screen>
  );
}

export default DrugCalcTheoryScreen;

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xl },
  section: { gap: Spacing.md, marginBottom: Spacing.md },
  eyebrow: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
  },
  sectionTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
  },
  groupTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  bodyText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    flex: 1,
  },
  topicGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  exampleList: { gap: Spacing.md },
  topicActions: { flexDirection: "row", gap: Spacing.sm },
  topicAction: { flex: 1 },
  bulletList: { gap: Spacing.sm },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.sm },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: Radii.circular,
    backgroundColor: ColorTokens.accent.muted,
    marginTop: 8,
  },
  infoBlock: { gap: Spacing.xs },
  infoLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  formulaText: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.mono,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.body,
  },
  answerBlock: {
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.accent.border,
    backgroundColor: ColorTokens.accent.surface,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  answerLabel: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
  },
  answerText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
  },
});
