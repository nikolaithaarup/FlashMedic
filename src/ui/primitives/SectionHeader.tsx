import React from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";

import { ColorTokens, Spacing, Typography } from "../../../constants/theme";

type SectionHeaderProps = {
  label: string;
  title?: string;
  description?: string;
  compact?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export function SectionHeader({
  label,
  title,
  description,
  compact = false,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, compact && styles.compact, style]}>
      <Text style={styles.label}>{label}</Text>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: { marginTop: Spacing.xl, marginBottom: Spacing.sm },
  compact: { marginTop: Spacing.md, marginBottom: Spacing.xs },
  label: {
    color: ColorTokens.accent.focus,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.75,
  },
  title: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  description: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    marginTop: Spacing.xs,
  },
});
