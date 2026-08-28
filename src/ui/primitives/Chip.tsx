import React, { useState } from "react";
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
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityLabel={selected ? `${label}. Valgt` : label}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        selected && styles.selected,
        hovered && !disabled && styles.hovered,
        focused && !disabled && styles.focused,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
      {selected ? (
        <Text accessibilityElementsHidden style={styles.indicator}>
          ✓
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: Interaction.minimumTouchTarget,
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.tool,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  selected: {
    borderColor: ColorTokens.accent.selectedBorder,
    backgroundColor: ColorTokens.accent.selected,
  },
  pressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.controlPressedScale }],
  },
  hovered: {
    borderColor: ColorTokens.accent.focus,
  },
  focused: {
    borderColor: ColorTokens.accent.focus,
    borderWidth: 2,
  },
  disabled: {
    opacity: Interaction.disabledOpacity,
  },
  label: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.medium,
    textAlign: "center",
  },
  selectedLabel: {
    color: ColorTokens.text.primary,
    fontWeight: Typography.weights.semibold,
  },
  indicator: {
    color: ColorTokens.accent.focus,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.heavy,
  },
});
