import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import { Card, Screen, ToolPageHeader } from "../../ui/primitives";
import { DRUG_TOPICS, THEORY, type DrugCalcTopic } from "./drugCalcContent";

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

export function DrugCalcTheoryScreen({ onBack }: Props) {
  const [topic, setTopic] = useState<DrugCalcTopic>("strength");
  const section = useMemo(() => THEORY.find((item) => item.topic === topic), [topic]);

  return (
    <Screen contentContainerStyle={styles.content} testID="drug-calc-theory-screen">
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til Lægemiddelregning"
        onBack={onBack}
        subtitle="Formler, enhedskontrol og gennemregnede eksempler."
        title="Lær metoden"
      />

      <Card variant="subtle" style={styles.section}>
        <Text style={styles.sectionTitle}>Vælg emne</Text>
        <View style={styles.topicGrid}>
          {DRUG_TOPICS.map((item) => {
            const selected = item.id === topic;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={item.id}
                onPress={() => setTopic(item.id)}
                style={({ pressed }) => [
                  styles.topicButton,
                  selected && styles.topicButtonSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.topicText, selected && styles.topicTextSelected]}>
                  {item.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

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

          <Text style={styles.groupTitle}>Eksempler trin for trin</Text>
          {section.workedExamples.map((example) => (
            <Card key={example.title} variant="subtle" style={styles.section}>
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
          ))}
        </>
      ) : null}
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
  topicButton: {
    minHeight: Interaction.compactTouchTarget,
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  topicButtonSelected: {
    borderColor: ColorTokens.accent.muted,
    backgroundColor: ColorTokens.accent.surface,
  },
  topicText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
  },
  topicTextSelected: { color: ColorTokens.text.primary },
  pressed: { opacity: Interaction.pressedOpacity },
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
