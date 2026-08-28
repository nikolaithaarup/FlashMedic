import React from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";

import { ColorTokens, Radii, Spacing, Typography } from "../../../constants/theme";

type ProgressHeaderProps = {
  current: number;
  total: number;
  label?: string;
  style?: ViewStyle | ViewStyle[];
};

export function ProgressHeader({ current, total, label, style }: ProgressHeaderProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(0, current), safeTotal);
  const percentage = (safeCurrent / safeTotal) * 100;

  return (
    <View
      accessibilityLabel={`${label ? `${label}. ` : ""}${safeCurrent} af ${total}`}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: safeCurrent }}
      style={[styles.container, style]}
    >
      <View style={styles.header}>
        <Text style={styles.label}>{label ?? "FREMSKRIDT"}</Text>
        <Text style={styles.count}>{safeCurrent} / {total}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", gap: Spacing.xs },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  label: {
    color: ColorTokens.accent.focus,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.65,
  },
  count: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.bold,
  },
  track: {
    height: 6,
    overflow: "hidden",
    borderRadius: Radii.circular,
    backgroundColor: ColorTokens.surface.inverse,
  },
  fill: {
    height: "100%",
    borderRadius: Radii.circular,
    backgroundColor: ColorTokens.accent.primary,
  },
});
