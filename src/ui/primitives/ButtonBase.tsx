import React, { type ReactNode, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import {
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";

export type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
  icon?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

type ButtonBaseProps = ButtonProps & {
  containerStyle: ViewStyle;
  pressedStyle: ViewStyle;
  labelStyle: TextStyle;
  indicatorColor: string;
};

export function ButtonBase({
  label,
  onPress,
  disabled = false,
  loading = false,
  accessibilityHint,
  icon,
  style,
  testID,
  containerStyle,
  pressedStyle,
  labelStyle,
  indicatorColor,
}: ButtonBaseProps) {
  const unavailable = disabled || loading;
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
        hovered && !unavailable && styles.hovered,
        focused && !unavailable && styles.focused,
        pressed && !unavailable && pressedStyle,
        unavailable && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: Interaction.minimumTouchTarget,
    borderRadius: Radii.control,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  disabled: {
    opacity: Interaction.disabledOpacity,
    backgroundColor: ColorTokens.interaction.disabledSurface,
  },
  hovered: {
    opacity: 0.94,
  },
  focused: {
    borderColor: ColorTokens.interaction.focus,
    borderWidth: 2,
  },
  label: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
    textAlign: "center",
  },
});
