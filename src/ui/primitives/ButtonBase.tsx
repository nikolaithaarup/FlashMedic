import React, { type ReactNode } from "react";
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

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
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
    borderRadius: Radii.md,
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
  label: {
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    fontWeight: Typography.weights.bold,
    textAlign: "center",
  },
});
