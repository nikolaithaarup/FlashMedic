import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";

type NavigationCardProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  onPress: () => void;
  onLongPress?: () => void;
  delayLongPress?: number;
  disabled?: boolean;
  secondary?: boolean;
  trailing?: string;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function NavigationCard({
  title,
  description,
  eyebrow,
  onPress,
  onLongPress,
  delayLongPress,
  disabled = false,
  secondary = false,
  trailing = "›",
  style,
  testID,
}: NavigationCardProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityLabel={[title, description].filter(Boolean).join(". ")}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      delayLongPress={delayLongPress}
      disabled={disabled}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onLongPress={onLongPress}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        description ? styles.withDescription : styles.compact,
        secondary && styles.secondary,
        (hovered || focused) && !disabled && styles.interactive,
        focused && !disabled && styles.focused,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Text accessibilityElementsHidden style={styles.trailing}>
        {trailing}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: Radii.lg,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.toolElevated,
    paddingLeft: 17,
    paddingRight: Spacing.md,
    gap: Spacing.md,
    ...(Platform.OS === "web"
      ? ({ boxShadow: "0 6px 18px rgba(0,0,0,0.22)" } as any)
      : {
          shadowColor: ColorTokens.shadow.color,
          shadowOpacity: 0.2,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3,
        }),
  },
  compact: { minHeight: 56 },
  withDescription: { minHeight: 76, paddingVertical: Spacing.sm },
  secondary: {
    backgroundColor: ColorTokens.surface.tool,
    ...(Platform.OS === "web"
      ? ({ boxShadow: "0 3px 10px rgba(0,0,0,0.12)" } as any)
      : { shadowOpacity: 0.1, elevation: 1 }),
  },
  interactive: { backgroundColor: "rgba(15,63,74,0.94)" },
  focused: { borderColor: ColorTokens.accent.focus, borderWidth: 2 },
  pressed: {
    backgroundColor: ColorTokens.interaction.pressed,
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: 0.995 }],
  },
  disabled: { opacity: Interaction.disabledOpacity },
  copy: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: ColorTokens.accent.focus,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.65,
  },
  title: {
    color: ColorTokens.text.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: Typography.weights.heavy,
  },
  description: {
    color: ColorTokens.text.secondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  trailing: {
    color: ColorTokens.accent.focus,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: Typography.weights.medium,
  },
});
