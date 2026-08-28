import React, { type ReactNode } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";

import {
  Borders,
  ColorTokens,
  Radii,
  SemanticStates,
  Spacing,
  Typography,
  type SemanticState,
} from "../../../constants/theme";

type NoticeCardProps = {
  title: string;
  children: ReactNode;
  tone?: SemanticState;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

const stateLabels: Record<SemanticState, string> = {
  success: "STATUS",
  warning: "BEMÆRK",
  danger: "ADVARSEL",
  info: "INFORMATION",
};

export function NoticeCard({
  title,
  children,
  tone = "info",
  style,
  testID,
}: NoticeCardProps) {
  const state = SemanticStates[tone];
  const foreground =
    tone === "info" ? ColorTokens.accent.focus : state.foreground;
  const backgroundColor =
    tone === "success"
      ? ColorTokens.surface.success
      : tone === "warning"
        ? ColorTokens.surface.warning
        : tone === "danger"
          ? ColorTokens.surface.danger
          : ColorTokens.surface.accent;

  return (
    <View
      accessibilityRole={tone === "danger" ? "alert" : undefined}
      style={[
        styles.container,
        { borderColor: foreground, backgroundColor },
        style,
      ]}
      testID={testID}
    >
      <Text style={[styles.semanticLabel, { color: foreground }]}>
        {stateLabels[tone]}
      </Text>
      <Text style={styles.title}>{title}</Text>
      {typeof children === "string" ? (
        <Text style={styles.body}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  semanticLabel: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.6,
  },
  title: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  body: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
});
