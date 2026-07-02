import React from "react";
import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function Chip({
  label,
  selected,
  onPress,
  disabled = false,
  style,
  testID,
}: ChipProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        selected && styles.selected,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: Interaction.minimumTouchTarget,
    justifyContent: "center",
    borderRadius: Radii.full,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.onSurface,
    backgroundColor: ColorTokens.surface.default,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  selected: {
    borderColor: ColorTokens.interaction.selectedBorder,
    backgroundColor: ColorTokens.interaction.selected,
  },
  pressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.controlPressedScale }],
  },
  disabled: {
    opacity: Interaction.disabledOpacity,
  },
  label: {
    color: ColorTokens.text.onSurface,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.medium,
    textAlign: "center",
  },
  selectedLabel: {
    color: ColorTokens.text.onAccent,
    fontWeight: Typography.weights.semibold,
  },
});
