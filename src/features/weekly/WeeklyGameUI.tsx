import { StatusBar } from "expo-status-bar";
import React, { type ReactNode, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Borders,
  ColorTokens,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import {
  Accordion,
  PrimaryButton,
  ProgressHeader,
  ResultRow,
  ResultSummary,
  Screen,
  SecondaryButton,
  Surface,
  ToolPageHeader,
} from "../../ui/primitives";

type FrameProps = {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: ReactNode;
};

export function WeeklyGameFrame({ title, subtitle, onBack, children }: FrameProps) {
  return (
    <Screen contentContainerStyle={styles.screen}>
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til Ugens udfordringer"
        onBack={onBack}
        subtitle={subtitle}
        title={title}
      />
      {children}
    </Screen>
  );
}

type IntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  rules: string[];
  topicLabel: string;
  topic: string;
  locked: boolean;
  onStart: () => void;
};

export function WeeklyGameIntro({
  eyebrow,
  title,
  description,
  rules,
  topicLabel,
  topic,
  locked,
  onStart,
}: IntroProps) {
  const [rulesExpanded, setRulesExpanded] = useState(false);

  return (
    <View style={styles.introStack}>
      <Surface elevated tone="accent" style={styles.introCard}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{description}</Text>
        <PrimaryButton
          accessibilityHint={
            locked ? "Viser at ugens forsøg allerede er brugt" : undefined
          }
          label={locked ? "Allerede spillet" : "Start spil"}
          onPress={onStart}
        />
      </Surface>
      <Accordion
        expanded={rulesExpanded}
        onToggle={() => setRulesExpanded((current) => !current)}
        subtitle="Regler, tid og point"
        title="Sådan fungerer spillet"
      >
        <View style={styles.ruleList}>
          {rules.map((rule) => (
            <View key={rule} style={styles.ruleRow}>
              <View style={styles.bullet} />
              <Text style={styles.body}>{rule}</Text>
            </View>
          ))}
        </View>
      </Accordion>
      <Surface style={styles.topicCard}>
        <Text style={styles.eyebrow}>{topicLabel}</Text>
        <Text style={styles.topicText}>{topic}</Text>
      </Surface>
    </View>
  );
}

type StatusProps = {
  label: string;
  value: string;
  current?: number;
  total?: number;
};

export function WeeklyGameStatus({ label, value, current, total }: StatusProps) {
  return (
    <Surface tone="accent" style={styles.status}>
      {current != null && total != null ? (
        <ProgressHeader current={current} label={label} total={total} />
      ) : (
        <Text style={styles.eyebrow}>{label}</Text>
      )}
      <Text style={styles.statusValue}>{value}</Text>
    </Surface>
  );
}

type WeeklyResultModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  title: string;
  value: string;
  message?: string;
  tone?: "accent" | "success" | "warning" | "danger";
  rows: { label: string; value: string }[];
  primaryLabel?: string;
  onPrimary?: () => void;
  closeLabel: string;
};

export function WeeklyResultModal({
  visible,
  onRequestClose,
  title,
  value,
  message,
  tone = "accent",
  rows,
  primaryLabel,
  onPrimary,
  closeLabel,
}: WeeklyResultModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onRequestClose}
      transparent
      visible={visible}
    >
      <SafeAreaView style={styles.modalBackdrop}>
        <ScrollView
          contentContainerStyle={styles.modalScroll}
          keyboardShouldPersistTaps="handled"
        >
          <View accessibilityViewIsModal style={styles.modalPanel}>
            <ResultSummary
              message={message}
              title={title}
              tone={tone}
              value={value}
            >
              {rows.map((row, index) => (
                <ResultRow
                  key={row.label}
                  label={row.label}
                  last={index === rows.length - 1}
                  value={row.value}
                />
              ))}
            </ResultSummary>
            {primaryLabel && onPrimary ? (
              <PrimaryButton label={primaryLabel} onPress={onPrimary} />
            ) : null}
            <SecondaryButton label={closeLabel} onPress={onRequestClose} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export const weeklyGameStyles = StyleSheet.create({
  gameStack: { gap: Spacing.md },
  questionCard: { gap: Spacing.sm },
  eyebrow: {
    color: ColorTokens.accent.focus,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.7,
  },
  title: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.heavy,
  },
  body: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  meta: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  choiceList: { gap: Spacing.sm },
  feedback: { gap: Spacing.sm },
  matchHeader: { flexDirection: "row", gap: Spacing.sm },
  matchHeaderText: {
    flex: 1,
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.bold,
  },
  matchRow: { flexDirection: "row", gap: Spacing.sm },
  matchChoice: { flex: 1, minWidth: 0 },
  actionStack: { gap: Spacing.sm },
  wordLetters: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  letterTile: {
    minWidth: 36,
    height: 48,
    borderRadius: Radii.sm,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.accent.selectedBorder,
    backgroundColor: ColorTokens.accent.selected,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xs,
  },
  letterText: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.heavy,
  },
  inputLabel: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  input: {
    minHeight: 52,
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
    textAlign: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
});

const styles = StyleSheet.create({
  screen: { paddingBottom: Spacing.xxl },
  introStack: { gap: Spacing.sm },
  introCard: { gap: Spacing.sm },
  topicCard: { gap: Spacing.xs },
  eyebrow: {
    color: ColorTokens.accent.focus,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.7,
  },
  title: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.heavy,
  },
  body: {
    flex: 1,
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  ruleList: { gap: Spacing.sm },
  ruleRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.sm },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: Radii.circular,
    backgroundColor: ColorTokens.accent.primary,
    marginTop: 8,
  },
  topicText: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.semibold,
  },
  status: { gap: Spacing.xs, marginBottom: Spacing.md },
  statusValue: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  modalBackdrop: { flex: 1, backgroundColor: ColorTokens.background.scrim },
  modalScroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: Spacing.md,
  },
  modalPanel: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    borderRadius: Radii.lg,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.background.base,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
});
