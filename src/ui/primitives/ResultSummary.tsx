import React, { type ReactNode } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";

import { ColorTokens, Spacing, Typography } from "../../../constants/theme";
import { Surface, type SurfaceTone } from "./Surface";

type ResultSummaryProps = {
  label?: string;
  title: string;
  value?: string;
  message?: string;
  tone?: Extract<SurfaceTone, "accent" | "success" | "warning" | "danger">;
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function ResultSummary({
  label = "RESULTAT",
  title,
  value,
  message,
  tone = "accent",
  children,
  style,
}: ResultSummaryProps) {
  return (
    <Surface elevated style={[styles.surface, style]} tone={tone}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.title}>{title}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {children ? <View style={styles.content}>{children}</View> : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: { gap: Spacing.xs },
  label: {
    color: ColorTokens.accent.focus,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.7,
  },
  title: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.heavy,
  },
  value: {
    color: ColorTokens.text.primary,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: Typography.weights.heavy,
  },
  message: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
  },
  content: { marginTop: Spacing.sm },
});
