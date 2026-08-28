import React, { type ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";

type AccordionProps = {
  title: string;
  subtitle?: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  eyebrow?: string;
  trailing?: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function Accordion({
  title,
  subtitle,
  expanded,
  onToggle,
  children,
  eyebrow,
  trailing,
  style,
}: AccordionProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Pressable
        accessibilityLabel={`${title}. ${expanded ? "Skjul" : "Vis"}`}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.header,
          (hovered || focused) && styles.interactive,
          focused && styles.focused,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.copy}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {trailing}
        <Text accessibilityElementsHidden style={styles.icon}>
          {expanded ? "⌃" : "⌄"}
        </Text>
      </Pressable>
      {expanded ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: Radii.lg,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.divider,
    backgroundColor: ColorTokens.surface.tool,
  },
  header: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  interactive: { backgroundColor: "rgba(255,255,255,0.04)" },
  focused: { borderColor: ColorTokens.accent.focus, borderWidth: 2 },
  pressed: { opacity: Interaction.pressedOpacity },
  copy: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: ColorTokens.accent.focus,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.55,
  },
  title: {
    color: ColorTokens.text.primary,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  subtitle: {
    color: ColorTokens.text.secondary,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    marginTop: 2,
  },
  icon: {
    color: ColorTokens.accent.focus,
    fontSize: Typography.sizes.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  content: {
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
    padding: Spacing.md,
  },
});
