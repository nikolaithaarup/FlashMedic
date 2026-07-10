import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import { Card, NoticeCard, Screen, ToolPageHeader } from "../../ui/primitives";
import {
  acidBaseMethodSteps,
  ambulanceFocusPoints,
  bloodGasAnalytes,
  bloodGasPatterns,
  venousLimitations,
} from "./bloodGasTheoryContent";

type Props = {
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

function InfoBlock({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.infoBlock}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.bodyText}>{text}</Text>
    </View>
  );
}

export function BloodGasTrainingHomeScreen({ onBack }: Props) {
  const [expandedAnalyteId, setExpandedAnalyteId] = useState<string | null>(null);
  const [expandedPatternId, setExpandedPatternId] = useState<string | null>(null);

  return (
    <Screen contentContainerStyle={styles.content} testID="blood-gas-training-screen">
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBack}
        subtitle="Avanceret præhospital laboratorieforståelse til akutbil og faglig genopfriskning."
        title="VGAS & CRP"
      />

      <NoticeCard title="Avanceret uddannelsestræning" tone="info" style={styles.section}>
        <Text style={styles.noticeText}>
          Dette er ikke klinisk beslutningsstøtte. Værdier understøtter en
          vurdering, men diagnosticerer ikke alene. Sammenhold altid prøvetype,
          symptomer, vitale værdier, klinisk kontekst, trends, apparatets
          referenceområder og lokal vejledning.
        </Text>
      </NoticeCard>

      <Card variant="subtle" style={styles.section}>
        <Text style={styles.eyebrow}>METODE</Text>
        <Text style={styles.sectionTitle}>Syre-base trin for trin</Text>
        <Text style={styles.bodyText}>
          Brug samme rækkefølge hver gang, og beskriv mønstret før du overvejer
          mulige forklaringer.
        </Text>
        <View style={styles.stepList}>
          {acidBaseMethodSteps.map((step) => (
            <View key={step.label} style={styles.stepRow}>
              <Text style={styles.stepLabel}>{step.label}</Text>
              <Text style={styles.bodyText}>{step.text}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.eyebrow}>ANALYTTER</Text>
        <Text style={styles.sectionTitle}>Lær værdierne</Text>
        <Text style={styles.bodyText}>
          Enheder og referenceområder kan variere mellem apparater og lokale
          laboratorier. Åbn en værdi for praktisk betydning og begrænsninger.
        </Text>
      </View>

      <View style={styles.accordionList}>
        {bloodGasAnalytes.map((analyte) => {
          const expanded = expandedAnalyteId === analyte.id;
          return (
            <Card key={analyte.id} variant="subtle" style={styles.accordionCard}>
              <Pressable
                accessibilityLabel={`${analyte.name}. ${analyte.unit}`}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={() => setExpandedAnalyteId(expanded ? null : analyte.id)}
                style={({ pressed }) => [
                  styles.accordionHeader,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.headerCopy}>
                  <Text style={styles.cardTitle}>{analyte.name}</Text>
                  <Text style={styles.unitText}>{analyte.unit}</Text>
                </View>
                <Text style={styles.expandIcon} accessibilityElementsHidden>
                  {expanded ? "⌃" : "⌄"}
                </Text>
              </Pressable>

              {expanded ? (
                <View style={styles.expandedContent}>
                  <InfoBlock label="Hvad afspejler værdien?" text={analyte.reflects} />
                  <InfoBlock
                    label="Præhospital relevans"
                    text={analyte.prehospitalRelevance}
                  />
                  <InfoBlock label="Typisk faldgrube" text={analyte.commonPitfall} />
                  <InfoBlock label="Begrænsninger" text={analyte.limitations} />
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>

      <Card variant="subtle" style={styles.section}>
        <Text style={styles.eyebrow}>PRØVETYPE</Text>
        <Text style={styles.sectionTitle}>Venøse begrænsninger</Text>
        <View style={styles.bulletList}>
          {venousLimitations.map((limitation) => (
            <BulletText key={limitation}>{limitation}</BulletText>
          ))}
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={styles.eyebrow}>MØNSTERFORSTÅELSE</Text>
        <Text style={styles.sectionTitle}>Typiske mønstre</Text>
        <Text style={styles.bodyText}>
          Eksemplerne er statiske læringsmønstre. De kan støtte mistanke, men er
          ikke diagnoser eller behandlingsanvisninger.
        </Text>
      </View>

      <View style={styles.accordionList}>
        {bloodGasPatterns.map((pattern) => {
          const expanded = expandedPatternId === pattern.id;
          return (
            <Card key={pattern.id} variant="subtle" style={styles.accordionCard}>
              <Pressable
                accessibilityLabel={pattern.title}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={() => setExpandedPatternId(expanded ? null : pattern.id)}
                style={({ pressed }) => [
                  styles.accordionHeader,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.headerCopy}>
                  <Text style={styles.cardTitle}>{pattern.title}</Text>
                  <Text style={styles.bodyText}>{pattern.summary}</Text>
                </View>
                <Text style={styles.expandIcon} accessibilityElementsHidden>
                  {expanded ? "⌃" : "⌄"}
                </Text>
              </Pressable>

              {expanded ? (
                <View style={styles.expandedContent}>
                  <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>Typiske retninger</Text>
                    <View style={styles.directionList}>
                      {pattern.directions.map((direction) => (
                        <View key={direction} style={styles.directionTag}>
                          <Text style={styles.directionText}>{direction}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <InfoBlock label="Støtteværdier" text={pattern.supportingValues} />
                  <InfoBlock
                    label="Præhospital relevans"
                    text={pattern.prehospitalRelevance}
                  />
                  <InfoBlock label="Typisk faldgrube" text={pattern.commonPitfall} />
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>

      <Card variant="subtle" style={styles.section}>
        <Text style={styles.eyebrow}>PRAKTISK OVERBLIK</Text>
        <Text style={styles.sectionTitle}>Ambulancefokus</Text>
        <View style={styles.bulletList}>
          {ambulanceFocusPoints.map((point) => (
            <BulletText key={point}>{point}</BulletText>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

export default BloodGasTrainingHomeScreen;

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
    flexShrink: 1,
  },
  sectionHeader: { gap: Spacing.xs, marginBottom: Spacing.md },
  stepList: { gap: Spacing.sm },
  stepRow: {
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.divider,
    backgroundColor: ColorTokens.surface.inverse,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  stepLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  accordionList: { gap: Spacing.sm, marginBottom: Spacing.md },
  accordionCard: { padding: 0, overflow: "hidden" },
  accordionHeader: {
    minHeight: Interaction.minimumTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
  },
  headerCopy: { flex: 1, minWidth: 0, gap: 2 },
  unitText: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.semibold,
  },
  expandIcon: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  pressed: { opacity: Interaction.pressedOpacity },
  expandedContent: {
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  infoBlock: { gap: Spacing.xs },
  infoLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
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
  directionList: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  directionTag: {
    borderRadius: Radii.sm,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.accent.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  directionText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.semibold,
  },
});
