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
import {
  Card,
  NoticeCard,
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";
import { COMMON_PITFALLS, DRUG_TOPICS, WORKED_EXAMPLES } from "./drugCalcContent";

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
  const selectedCount = selectedTopicIds.length;
  const selectedLabel = useMemo(
    () =>
      selectedCount === 0
        ? "Vælg mindst ét emne"
        : `Start ${selectedCount} valgte ${selectedCount === 1 ? "emne" : "emner"}`,
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
    <Screen contentContainerStyle={styles.content} testID="drug-calc-home-screen">
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBackHome}
        subtitle="Metoder, gennemregnede eksempler og genererede træningsopgaver."
        title="Lægemiddelregning"
      />

      <NoticeCard title="Uddannelsestræning" tone="info" style={styles.section}>
        <Text style={styles.noticeText}>
          Opgaverne træner beregning og enhedskontrol. De erstatter ikke klinisk
          vurdering, præparatkontrol eller lokale instrukser.
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
        <Text style={styles.bodyText}>
          Vælg et eller flere emner til fokuseret træning, eller start en blandet
          runde med alle emner.
        </Text>

        <View style={styles.topicGrid}>
          {DRUG_TOPICS.map((topic) => {
            const selected = selectedTopicIds.includes(topic.id);
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={topic.id}
                onPress={() => toggleTopic(topic.id)}
                style={({ pressed }) => [
                  styles.topicButton,
                  selected && styles.topicButtonSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.topicTitle, selected && styles.topicTitleSelected]}>
                  {topic.title}
                </Text>
                <Text style={styles.topicDescription}>{topic.desc}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.buttonStack}>
          <PrimaryButton
            disabled={selectedCount === 0}
            label={selectedLabel}
            onPress={() => onStartPractice(selectedTopicIds)}
          />
          <SecondaryButton
            label="Start blandet træning"
            onPress={() => onStartPractice([])}
          />
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
          <SecondaryButton label="Se gennemregnede eksempler" onPress={onOpenTheory} />
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
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.sm },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: Radii.circular,
    backgroundColor: ColorTokens.accent.muted,
    marginTop: 8,
  },
  topicGrid: { gap: Spacing.sm },
  topicButton: {
    minHeight: Interaction.minimumTouchTarget,
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  topicButtonSelected: {
    borderColor: ColorTokens.accent.muted,
    backgroundColor: ColorTokens.accent.surface,
  },
  topicTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  topicTitleSelected: { color: ColorTokens.accent.muted },
  topicDescription: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  pressed: { opacity: Interaction.pressedOpacity },
  buttonStack: { gap: Spacing.sm },
});
