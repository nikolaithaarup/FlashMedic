import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Spacing,
  Typography,
} from "../../../constants/theme";

type ResultRowProps = {
  label: string;
  value: string;
  prominent?: boolean;
  last?: boolean;
};

export function ResultRow({
  label,
  value,
  prominent = false,
  last = false,
}: ResultRowProps) {
  return (
    <View style={[styles.row, last && styles.last]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, prominent && styles.prominent]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    borderBottomWidth: Borders.hairline,
    borderBottomColor: ColorTokens.border.divider,
    paddingVertical: Spacing.xs,
  },
  last: { borderBottomWidth: 0 },
  label: {
    flex: 1,
    minWidth: 0,
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
  },
  value: {
    maxWidth: "58%",
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
    textAlign: "right",
  },
  prominent: {
    color: ColorTokens.accent.focus,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
  },
});
