import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  SemanticStates,
  Spacing,
  Typography,
} from "../../../constants/theme";

export type SelectableChoiceState =
  | "default"
  | "selected"
  | "correct"
  | "incorrect";

type SelectableChoiceProps = {
  label: string;
  description?: string;
  state?: SelectableChoiceState;
  onPress: () => void;
  disabled?: boolean;
  dimWhenDisabled?: boolean;
  indicator?: string;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function SelectableChoice({
  label,
  description,
  state = "default",
  onPress,
  disabled = false,
  dimWhenDisabled = true,
  indicator,
  style,
  testID,
}: SelectableChoiceProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const selected = state !== "default";
  const accessibilityStatus =
    state === "correct"
      ? "Korrekt"
      : state === "incorrect"
        ? "Forkert"
        : state === "selected"
          ? "Valgt"
          : null;
  const glyph =
    indicator ??
    (state === "correct"
      ? "✓"
      : state === "incorrect"
        ? "!"
        : selected
          ? "✓"
          : "");

  return (
    <Pressable
      accessibilityLabel={[label, description, accessibilityStatus]
        .filter(Boolean)
        .join(". ")}
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
        state === "selected" && styles.selected,
        state === "correct" && styles.correct,
        state === "incorrect" && styles.incorrect,
        hovered && !disabled && styles.hovered,
        focused && !disabled && styles.focused,
        pressed && !disabled && styles.pressed,
        disabled && dimWhenDisabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.copy}>
        <Text style={[styles.label, selected && styles.strongLabel]}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {glyph ? (
        <View style={styles.indicator}>
          <Text style={styles.indicatorText}>{glyph}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.tool,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  selected: {
    borderColor: ColorTokens.accent.selectedBorder,
    backgroundColor: ColorTokens.accent.selected,
  },
  correct: {
    borderColor: SemanticStates.success.foreground,
    backgroundColor: ColorTokens.surface.success,
  },
  incorrect: {
    borderColor: SemanticStates.danger.foreground,
    backgroundColor: ColorTokens.surface.danger,
  },
  hovered: { borderColor: ColorTokens.accent.focus },
  focused: { borderColor: ColorTokens.accent.focus, borderWidth: 2 },
  pressed: {
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.controlPressedScale }],
  },
  disabled: { opacity: Interaction.disabledOpacity },
  copy: { flex: 1, minWidth: 0 },
  label: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
  },
  strongLabel: { fontWeight: Typography.weights.bold },
  description: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    marginTop: 2,
  },
  indicator: {
    width: 26,
    height: 26,
    borderRadius: Radii.circular,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorTokens.accent.primary,
  },
  indicatorText: {
    color: ColorTokens.text.onAccent,
    fontSize: Typography.sizes.label,
    fontWeight: Typography.weights.heavy,
  },
});
