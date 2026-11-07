import React, { type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";

type ToolPageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  backLabel?: string;
  action?: ReactNode;
  testID?: string;
};

export function ToolPageHeader({
  title,
  subtitle,
  onBack,
  backLabel = "Tilbage",
  action,
  testID,
}: ToolPageHeaderProps) {
  return (
    <View style={styles.container} testID={testID}>
      <Pressable
        accessibilityLabel={backLabel}
        accessibilityRole="button"
        hitSlop={Spacing.xs}
        onPress={onBack}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
      >
        <Text style={styles.backSymbol} accessibilityElementsHidden>
          ‹
        </Text>
      </Pressable>

      <View style={styles.titleGroup}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: Interaction.minimumTouchTarget,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: Borders.hairline,
    borderBottomColor: ColorTokens.border.divider,
    marginBottom: Spacing.md,
  },
  backButton: {
    width: Interaction.minimumTouchTarget,
    height: Interaction.minimumTouchTarget,
    borderRadius: Radii.control,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorTokens.surface.inverse,
  },
  backButtonPressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.controlPressedScale }],
  },
  backSymbol: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: 34,
    lineHeight: 36,
  },
  titleGroup: {
    flex: 1,
    minWidth: 0,
    paddingTop: 4,
  },
  title: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: Typography.weights.bold,
  },
  subtitle: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    marginTop: 2,
  },
  action: {
    minWidth: Interaction.minimumTouchTarget,
    minHeight: Interaction.minimumTouchTarget,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
