import { StatusBar } from "expo-status-bar";
import React, { type ReactNode, useState } from "react";
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
  ToolPageHeader,
} from "../../ui/primitives";
import {
  acidBaseMethodSteps,
  ambulanceFocusPoints,
  bloodGasAnalytes,
  type BloodGasExampleValue,
  bloodGasPatternExamples,
  type BloodGasValueDirection,
  venousLimitations,
} from "./bloodGasTheoryContent";

type Props = {
  onBack: () => void;
  onStartValueTrainer: () => void;
  onStartPatternTrainer: () => void;
};

type SectionId = "analytes" | "venous" | "patterns" | "ambulance";

type SectionAccordionProps = {
  id: SectionId;
  eyebrow: string;
  title: string;
  summary: string;
  expanded: boolean;
  onToggle: (id: SectionId) => void;
  children: ReactNode;
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
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

const directionLabels: Record<BloodGasValueDirection, string> = {
  low: "Lav",
  reference: "Reference",
  high: "Høj",
  uncertain: "Usikker / kontekstafhængig",
};

function ValueTile({ value }: { value: BloodGasExampleValue }) {
  const isReference = value.direction === "reference";
  const isAbnormal = value.direction === "low" || value.direction === "high";

  return (
    <View
      style={[
        styles.valueTile,
        isReference && styles.valueTileReference,
        isAbnormal && styles.valueTileAbnormal,
      ]}
    >
      <View style={styles.valueTileMain}>
        <Text style={styles.valueLabel}>{value.label}</Text>
        <View style={styles.valueReading}>
          <Text style={styles.valueNumber}>{value.value}</Text>
          {value.unit ? (
            <Text style={styles.valueUnit}>{value.unit}</Text>
          ) : null}
        </View>
        <Text
          style={[
            styles.valueDirection,
            isReference && styles.valueDirectionReference,
            isAbnormal && styles.valueDirectionAbnormal,
          ]}
        >
          {directionLabels[value.direction]}
        </Text>
      </View>
      {value.note ? <Text style={styles.valueNote}>{value.note}</Text> : null}
    </View>
  );
}

function SectionAccordion({
  id,
  eyebrow,
  title,
  summary,
  expanded,
  onToggle,
  children,
}: SectionAccordionProps) {
  return (
    <Card variant="subtle" style={styles.sectionAccordion}>
      <Pressable
        accessibilityLabel={`${title}. ${expanded ? "Skjul" : "Vis"}`}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => onToggle(id)}
        style={({ pressed }) => [
          styles.sectionHeader,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>
        <Text style={styles.expandIcon} accessibilityElementsHidden>
          {expanded ? "⌃" : "⌄"}
        </Text>
      </Pressable>
      {expanded ? <View style={styles.sectionContent}>{children}</View> : null}
    </Card>
  );
}

export function BloodGasTrainingHomeScreen({
  onBack,
  onStartValueTrainer,
  onStartPatternTrainer,
}: Props) {
  const [expandedSection, setExpandedSection] = useState<SectionId | null>(
    null,
  );
  const [expandedAnalyteId, setExpandedAnalyteId] = useState<string | null>(
    null,
  );
  const [expandedPatternId, setExpandedPatternId] = useState<string | null>(
    null,
  );

  const toggleSection = (sectionId: SectionId) => {
    setExpandedSection((current) => (current === sectionId ? null : sectionId));
  };

  return (
    <Screen
      contentContainerStyle={styles.content}
      testID="blood-gas-training-screen"
    >
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBack}
        subtitle="Praktisk træning i VGAS og CRP"
        title="VGAS & CRP"
      />

      <NoticeCard title="Til faglig træning" tone="info" style={styles.section}>
        <Text style={styles.noticeText}></Text>
      </NoticeCard>

      <Card variant="subtle" style={styles.trainerCard}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>INTERAKTIV TRÆNING</Text>
          <Text style={styles.sectionTitle}>Tolk en blodgas</Text>
          <Text style={styles.summaryText}>
            Vurder værdier trin for trin og vælg mønsteret, der passer bedst.
            Værdier alene er ikke en klinisk diagnose.
          </Text>
        </View>
        <PrimaryButton
          label="Start tolkning"
          onPress={onStartValueTrainer}
          testID="start-blood-gas-value-trainer"
        />
      </Card>

      <Card variant="subtle" style={styles.trainerCard}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>OMVENDT TRÆNING</Text>
          <Text style={styles.sectionTitle}>Forudsig værdier</Text>
          <Text style={styles.summaryText}>
            Se et mønster og vurder, hvilke værdier der typisk er lave, normale,
            høje eller usikre.
          </Text>
        </View>
        <PrimaryButton
          label="Start værdiforudsigelse"
          onPress={onStartPatternTrainer}
          testID="start-blood-gas-pattern-trainer"
        />
      </Card>

      <Card variant="subtle" style={styles.methodCard}>
        <Text style={styles.eyebrow}>METODE</Text>
        <Text style={styles.sectionTitle}>Syre-base trin for trin</Text>
        <View style={styles.methodList}>
          {acidBaseMethodSteps.map((step) => (
            <View key={step.label} style={styles.methodRow}>
              <Text style={styles.methodLabel}>{step.label}</Text>
              <Text style={styles.methodText}>{step.text}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.sectionList}>
        <SectionAccordion
          eyebrow="ANALYTTER"
          expanded={expandedSection === "analytes"}
          id="analytes"
          onToggle={toggleSection}
          summary="12 værdier med betydning, faldgruber og begrænsninger."
          title="Lær værdierne"
        >
          <Text style={styles.sectionHint}>
            Enheder og referenceområder afhænger af apparat og lokale forhold.
          </Text>
          <View style={styles.nestedList}>
            {bloodGasAnalytes.map((analyte) => {
              const expanded = expandedAnalyteId === analyte.id;
              return (
                <View key={analyte.id} style={styles.nestedItem}>
                  <Pressable
                    accessibilityLabel={`${analyte.name}. ${analyte.unit}`}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    onPress={() =>
                      setExpandedAnalyteId(expanded ? null : analyte.id)
                    }
                    style={({ pressed }) => [
                      styles.nestedHeader,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.headerCopy}>
                      <View style={styles.titleRow}>
                        <Text style={styles.cardTitle}>{analyte.name}</Text>
                        <Text style={styles.unitText}>{analyte.unit}</Text>
                      </View>
                      <Text style={styles.previewText}>{analyte.reflects}</Text>
                    </View>
                    <Text
                      style={styles.nestedExpandIcon}
                      accessibilityElementsHidden
                    >
                      {expanded ? "⌃" : "⌄"}
                    </Text>
                  </Pressable>

                  {expanded ? (
                    <View style={styles.nestedContent}>
                      <InfoBlock
                        label="Præhospital relevans"
                        text={analyte.prehospitalRelevance}
                      />
                      <InfoBlock
                        label="Faldgrube"
                        text={analyte.commonPitfall}
                      />
                      <InfoBlock
                        label="Begrænsning"
                        text={analyte.limitations}
                      />
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </SectionAccordion>

        <SectionAccordion
          eyebrow="PRØVETYPE"
          expanded={expandedSection === "venous"}
          id="venous"
          onToggle={toggleSection}
          summary="Hvad en venøs prøve kan og ikke kan vise."
          title="Venøse begrænsninger"
        >
          <View style={styles.bulletList}>
            {venousLimitations.map((limitation) => (
              <BulletText key={limitation}>{limitation}</BulletText>
            ))}
          </View>
        </SectionAccordion>

        <SectionAccordion
          eyebrow="MØNSTERFORSTÅELSE"
          expanded={expandedSection === "patterns"}
          id="patterns"
          onToggle={toggleSection}
          summary="8 statiske eksempler med konkrete værdier."
          title="Eksempler med værdier"
        >
          <View style={styles.nestedList}>
            {bloodGasPatternExamples.map((pattern) => {
              const expanded = expandedPatternId === pattern.id;
              return (
                <View key={pattern.id} style={styles.nestedItem}>
                  <Pressable
                    accessibilityLabel={pattern.title}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    onPress={() =>
                      setExpandedPatternId(expanded ? null : pattern.id)
                    }
                    style={({ pressed }) => [
                      styles.nestedHeader,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.headerCopy}>
                      <Text style={styles.cardTitle}>{pattern.title}</Text>
                      <Text style={styles.patternPreview}>
                        {pattern.oneLineSummary}
                      </Text>
                    </View>
                    <Text
                      style={styles.nestedExpandIcon}
                      accessibilityElementsHidden
                    >
                      {expanded ? "⌃" : "⌄"}
                    </Text>
                  </Pressable>

                  {expanded ? (
                    <View style={styles.nestedContent}>
                      <InfoBlock
                        label="Kontekst"
                        text={pattern.clinicalContext}
                      />
                      <View style={styles.valueList}>
                        {pattern.values.map((value) => (
                          <ValueTile
                            key={`${pattern.id}-${value.analyteId}`}
                            value={value}
                          />
                        ))}
                      </View>
                      <InfoBlock
                        label="Fortolkning"
                        text={pattern.interpretation}
                      />
                      <View style={styles.infoBlock}>
                        <Text style={styles.infoLabel}>
                          Hvorfor passer værdierne?
                        </Text>
                        <View style={styles.bulletList}>
                          {pattern.reasoning.map((reason) => (
                            <BulletText key={reason}>{reason}</BulletText>
                          ))}
                        </View>
                      </View>
                      <InfoBlock
                        label="Præhospital relevans"
                        text={pattern.prehospitalRelevance}
                      />
                      <InfoBlock
                        label="Faldgrube"
                        text={pattern.commonPitfall}
                      />
                      <InfoBlock
                        label="Begrænsning"
                        text={pattern.limitation}
                      />
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </SectionAccordion>

        <SectionAccordion
          eyebrow="PRAKTISK OVERBLIK"
          expanded={expandedSection === "ambulance"}
          id="ambulance"
          onToggle={toggleSection}
          summary="Klinik, trends, prøvekvalitet og overlevering."
          title="Ambulancefokus"
        >
          <View style={styles.bulletList}>
            {ambulanceFocusPoints.map((point) => (
              <BulletText key={point}>{point}</BulletText>
            ))}
          </View>
        </SectionAccordion>
      </View>
    </Screen>
  );
}

export default BloodGasTrainingHomeScreen;

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xl },
  section: { marginBottom: Spacing.md },
  trainerCard: { gap: Spacing.md, marginBottom: Spacing.md },
  noticeText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
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
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
  },
  bodyText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    flexShrink: 1,
  },
  detailText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
  },
  methodCard: { gap: Spacing.sm, marginBottom: Spacing.md },
  methodList: { gap: Spacing.xs },
  methodRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
    paddingTop: Spacing.xs,
  },
  methodLabel: {
    width: 118,
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.bold,
  },
  methodText: {
    flex: 1,
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  sectionList: { gap: Spacing.sm },
  sectionAccordion: { padding: 0, overflow: "hidden" },
  sectionHeader: {
    minHeight: Interaction.minimumTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
  },
  headerCopy: { flex: 1, minWidth: 0, gap: 2 },
  summaryText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  expandIcon: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  sectionContent: {
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  sectionHint: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    paddingHorizontal: Spacing.xs,
  },
  nestedList: { gap: Spacing.xs },
  nestedItem: {
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.divider,
    backgroundColor: ColorTokens.surface.inverse,
    overflow: "hidden",
  },
  nestedHeader: {
    minHeight: Interaction.minimumTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  unitText: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.semibold,
  },
  previewText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  patternPreview: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  nestedExpandIcon: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
  },
  pressed: { opacity: Interaction.pressedOpacity },
  nestedContent: {
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  infoBlock: { gap: 2 },
  infoLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.bold,
  },
  bulletList: { gap: Spacing.sm },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: Radii.circular,
    backgroundColor: ColorTokens.accent.muted,
    marginTop: 7,
  },
  valueList: { gap: Spacing.xs },
  valueTile: {
    borderRadius: Radii.sm,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.subtle,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  valueTileReference: { borderColor: ColorTokens.accent.border },
  valueTileAbnormal: { borderColor: ColorTokens.semantic.warning },
  valueTileMain: {
    minHeight: Interaction.compactTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  valueLabel: {
    width: 72,
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  valueReading: {
    minWidth: 88,
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: 4,
  },
  valueNumber: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
  },
  valueUnit: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  valueDirection: {
    flex: 1,
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.semibold,
    textAlign: "right",
  },
  valueDirectionReference: { color: ColorTokens.accent.muted },
  valueDirectionAbnormal: { color: ColorTokens.semantic.warning },
  valueNote: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
});
