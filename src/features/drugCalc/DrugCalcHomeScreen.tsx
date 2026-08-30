import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text } from "react-native";

import {
  ColorTokens,
  Spacing,
  Typography,
} from "../../../constants/theme";
import {
  Card,
  NavigationCard,
  PrimaryButton,
  Screen,
  ToolPageHeader,
} from "../../ui/primitives";

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  onBackHome: () => void;
  onStartPractice: (topicIds: string[]) => void;
  onOpenTheory?: () => void;
};

export default function DrugCalcHomeScreen({
  onBackHome,
  onStartPractice,
  onOpenTheory,
}: Props) {
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

      <Card variant="subtle" style={styles.section}>
        <Text style={styles.eyebrow}>PRAKSIS</Text>
        <Text style={styles.sectionTitle}>Træn beregninger</Text>
        <Text style={styles.bodyText}>
          Start med blandede opgaver. Du kan vælge bestemte emner inde i
          træningen.
        </Text>
        <PrimaryButton
          label="Start blandet træning"
          onPress={() => onStartPractice([])}
        />
      </Card>

      {onOpenTheory ? (
        <NavigationCard
          description="Formler, enhedskontrol, afrunding, eksempler og typiske fejl."
          eyebrow="METODE OG REFERENCE"
          onPress={onOpenTheory}
          title="Lær metoden"
        />
      ) : null}
    </Screen>
  );
}

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
  bodyText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    flex: 1,
  },
});
