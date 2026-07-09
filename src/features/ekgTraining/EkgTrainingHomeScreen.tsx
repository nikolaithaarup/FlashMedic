import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import { Card, Screen, ToolPageHeader } from "../../ui/primitives";

type Props = {
  onBack: () => void;
};

type StepItem = {
  label: string;
  text: string;
};

const rhythmSteps: StepItem[] = [
  {
    label: "Frekvens",
    text: "Vurder om rytmen er langsom, normal eller hurtig.",
  },
  {
    label: "Regelmæssighed",
    text: "Se om RR-intervallerne er regelmæssige eller uregelmæssige.",
  },
  {
    label: "P-takker",
    text: "Find P-takker, og vurder om de hænger sammen med QRS.",
  },
  {
    label: "PR-interval",
    text: "Vurder om overledningen er normal, forlænget eller varierende.",
  },
  {
    label: "QRS-bredde",
    text: "Skeln mellem smalle og brede komplekser.",
  },
  {
    label: "Rytmeforslag",
    text: "Saml fundene til et sandsynligt rytmeforslag.",
  },
  {
    label: "Ambulancefaglig betydning",
    text: "Kobl rytmen til patientens tilstand og behov for handling.",
  },
];

const acuteRhythms = [
  "VF",
  "VT",
  "Asystoli",
  "PEA",
  "SVT",
  "Bradykardi",
  "AV-blok",
];

const ambulanceFocus = [
  "Patientens kliniske tilstand er vigtigere end rytmen alene.",
  "Se efter tegn på kredsløbspåvirkning som BT-fald, bevidsthedspåvirkning, brystsmerter, dyspnø eller shocktegn.",
  "Skeln mellem monitorrytme og 12-afledning, så du ikke overfortolker et enkelt billede.",
  "Vurder hvornår rytmen ændrer behandlingshastighed eller behov for hjælp.",
  "Overlever rytme, symptomer, vitale værdier, ændringer og given behandling tydeligt.",
];

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function BulletText({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bullet} />
      <Text style={styles.bodyText}>{children}</Text>
    </View>
  );
}

export function EkgTrainingHomeScreen({ onBack }: Props) {
  return (
    <Screen contentContainerStyle={styles.content} testID="ekg-training-screen">
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBack}
        subtitle="Systematisk rytmeanalyse til ambulancefaglig vurdering."
        title="EKG-træning"
      />

      <Card variant="subtle" style={styles.introCard}>
        <Text style={styles.eyebrow}>RYTME OG TEORI</Text>
        <Text style={styles.introTitle}>Et fast blik før rytmeforslaget</Text>
        <Text style={styles.bodyText}>
          Start med den samme metode hver gang. Det gør rytmevurderingen mere
          rolig, mere præcis og lettere at overlevere.
        </Text>
      </Card>

      <Card style={styles.sectionCard}>
        <SectionTitle>Lær rytmeanalyse</SectionTitle>
        <Text style={styles.bodyText}>
          Gå systematisk gennem rytmen, før du beslutter hvad den betyder.
        </Text>
        <View style={styles.stepList}>
          {rhythmSteps.map((step, index) => (
            <View key={step.label} style={styles.stepRow}>
              <View style={styles.stepIndex}>
                <Text style={styles.stepIndexText}>{index + 1}</Text>
              </View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <SectionTitle>Rytmetræning</SectionTitle>
        <Text style={styles.bodyText}>
          Næste trin bliver en guidet rytmetræner, hvor du vurderer rytmen trin
          for trin.
        </Text>
      </Card>

      <Card style={styles.sectionCard}>
        <SectionTitle>Akutte rytmer</SectionTitle>
        <Text style={styles.bodyText}>
          Hold særligt øje med rytmer, der hurtigt kan ændre behandling,
          alarmering eller behov for ekstra hænder.
        </Text>
        <View style={styles.rhythmGrid}>
          {acuteRhythms.map((rhythm) => (
            <View key={rhythm} style={styles.rhythmPill}>
              <Text style={styles.rhythmPillText}>{rhythm}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <SectionTitle>Ambulancefokus</SectionTitle>
        <View style={styles.bulletList}>
          {ambulanceFocus.map((item) => (
            <BulletText key={item}>{item}</BulletText>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

export default EkgTrainingHomeScreen;

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.xl,
  },
  introCard: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  sectionCard: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  eyebrow: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.7,
  },
  introTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
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
  },
  stepList: {
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
  stepRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "flex-start",
  },
  stepIndex: {
    width: 30,
    height: 30,
    borderRadius: Radii.circular,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorTokens.surface.subtle,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
  },
  stepIndexText: {
    color: ColorTokens.accent.default,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
  },
  stepCopy: {
    flex: 1,
    minWidth: 0,
  },
  stepLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  stepText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    marginTop: 2,
  },
  rhythmGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  rhythmPill: {
    minHeight: 34,
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.subtle,
    paddingHorizontal: Spacing.sm,
  },
  rhythmPillText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  bulletList: {
    gap: Spacing.sm,
  },
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
});
