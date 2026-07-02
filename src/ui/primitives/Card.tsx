import React, { type ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import {
  Borders,
  ColorTokens,
  Radii,
  Spacing,
} from "../../../constants/theme";

type CardVariant = "default" | "elevated" | "subtle";

type CardProps = {
  children: ReactNode;
  variant?: CardVariant;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function Card({
  children,
  variant = "default",
  style,
  testID,
}: CardProps) {
  return (
    <View style={[styles.base, styles[variant], style]} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.lg,
    borderWidth: Borders.hairline,
    padding: Spacing.md,
  },
  default: {
    backgroundColor: ColorTokens.surface.default,
    borderColor: ColorTokens.border.onSurface,
  },
  elevated: {
    backgroundColor: ColorTokens.surface.elevated,
    borderColor: ColorTokens.border.default,
  },
  subtle: {
    backgroundColor: ColorTokens.surface.subtle,
    borderColor: ColorTokens.border.divider,
  },
});
