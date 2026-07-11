import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import {
  Card,
  Chip,
  NoticeCard,
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";
import {
  COMMON_PITFALLS,
  DRUG_TOPICS,
  WORKED_EXAMPLES,
} from "./drugCalcContent";

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  onBackHome: () => void;
  onStartPractice: (topicIds: string[]) => void;
  onOpenTheory?: () => void;
};

function BulletText({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bullet} />
      <Text style={styles.bodyText}>{children}</Text>
    </View>
  );
}

export default function DrugCalcHomeScreen({
  onBackHome,
  onStartPractice,
  onOpenTheory,
}: Props) {
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [topicsExpanded, setTopicsExpanded] = useState(false);
  const selectedCount = selectedTopicIds.length;
  const selectionSummary = useMemo(
    () =>
      selectedCount === 0
        ? "Alle emner"
        : `${selectedCount} ${selectedCount === 1 ? "emne" : "emner"} valgt`,
    [selectedCount],
  );

  const toggleTopic = (id: string) => {
    setSelectedTopicIds((current) =>
      current.includes(id)
        ? current.filter((topicId) => topicId !== id)
        : [...current, id],
    );
  };

  return (
    <Screen
      contentContainerStyle={styles.content}
      testID="drug-calc-home-screen"
    >
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBackHome}
        subtitle="Metoder, gennemregnede eksempler og genererede træningsopgaver."
        title="Lægemiddelregning"
      />

      <NoticeCard title="Uddannelsestræning" tone="info" style={styles.section}>
        <Text style={styles.noticeText}>
          Opgaverne træner beregning og enhedskontrol.
        </Text>
      </NoticeCard>

      <Card variant="subtle" style={styles.section}>
        <Text style={styles.eyebrow}>TEORI</Text>
        <Text style={styles.sectionTitle}>Lær metoden</Text>
        <Text style={styles.bodyText}>
          Arbejd systematisk med formel, enheder, mellemregninger, afrunding og
          plausibilitetskontrol.
        </Text>
        <View style={styles.bulletList}>
          <BulletText>Dosis = styrke × volumen</BulletText>
          <BulletText>Volumen = dosis ÷ styrke</BulletText>
          <BulletText>Styrke = dosis ÷ volumen</BulletText>
          <BulletText>Behold enhederne, og afrund først til sidst</BulletText>
        </View>
        {onOpenTheory ? (
          <SecondaryButton label="Åbn teori" onPress={onOpenTheory} />
        ) : null}
      </Card>

      <Card variant="subtle" style={styles.section}>
        <Text style={styles.eyebrow}>PRAKSIS</Text>
        <Text style={styles.sectionTitle}>Træn beregninger</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: topicsExpanded }}
          onPress={() => setTopicsExpanded((current) => !current)}
          style={({ pressed }) => [
            styles.selectorHeader,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.selectorText}>
            <Text style={styles.selectorTitle}>Vælg emner</Text>
            <Text style={styles.selectorSummary}>{selectionSummary}</Text>
          </View>
          <Text style={styles.selectorAction}>
            {topicsExpanded ? "Skjul −" : "Vælg +"}
          </Text>
        </Pressable>

        {topicsExpanded ? (
          <View style={styles.topicGrid}>
            {DRUG_TOPICS.map((topic) => (
              <Chip
                key={topic.id}
                label={topic.title}
                onPress={() => toggleTopic(topic.id)}
                selected={selectedTopicIds.includes(topic.id)}
              />
            ))}
          </View>
        ) : null}

        <View style={styles.buttonStack}>
          <PrimaryButton
            label="Start blandet træning"
            onPress={() => onStartPractice([])}
          />
          {selectedCount > 0 ? (
            <SecondaryButton
              label="Træn valgte emner"
              onPress={() => onStartPractice(selectedTopicIds)}
            />
          ) : null}
        </View>
      </Card>

      <Card variant="subtle" style={styles.section}>
        <Text style={styles.eyebrow}>GENNEMREGNET</Text>
        <Text style={styles.sectionTitle}>Eksempler trin for trin</Text>
        <Text style={styles.bodyText}>
          {WORKED_EXAMPLES.length} løste eksempler viser problem, formel,
          mellemregning, slutsvar og typisk faldgrube.
        </Text>
        {onOpenTheory ? (
          <SecondaryButton
            label="Se gennemregnede eksempler"
            onPress={onOpenTheory}
          />
        ) : null}
      </Card>

      <Card variant="subtle" style={styles.section}>
        <Text style={styles.eyebrow}>KONTROL</Text>
        <Text style={styles.sectionTitle}>Typiske fejl</Text>
        <View style={styles.bulletList}>
          {COMMON_PITFALLS.map((pitfall) => (
            <BulletText key={pitfall}>{pitfall}</BulletText>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xl },
  section: { gap: Spacing.md, marginBottom: Spacing.md },
  noticeText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
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
  bodyText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    flex: 1,
  },
  bulletList: { gap: Spacing.sm },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: Radii.circular,
    backgroundColor: ColorTokens.accent.muted,
    marginTop: 8,
  },
  selectorHeader: {
    minHeight: Interaction.minimumTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  selectorText: { flex: 1, gap: Spacing.xs },
  selectorTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  selectorSummary: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  selectorAction: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  topicGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  pressed: { opacity: Interaction.pressedOpacity },
  buttonStack: { gap: Spacing.sm },
});
