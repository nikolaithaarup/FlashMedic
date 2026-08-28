import React, { type ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  Borders,
  ColorTokens,
  SemanticStates,
  Spacing,
} from "../../../constants/theme";

export type SurfaceTone =
  | "default"
  | "elevated"
  | "accent"
  | "success"
  | "warning"
  | "danger";

type SurfaceProps = {
  children: ReactNode;
  tone?: SurfaceTone;
  padding?: "none" | "sm" | "md" | "lg";
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const toneStyles: Record<SurfaceTone, ViewStyle> = {
  default: {
    backgroundColor: ColorTokens.surface.tool,
    borderColor: ColorTokens.border.divider,
  },
  elevated: {
    backgroundColor: ColorTokens.surface.toolElevated,
    borderColor: ColorTokens.border.default,
  },
  accent: {
    backgroundColor: ColorTokens.surface.accent,
    borderColor: ColorTokens.accent.selectedBorder,
  },
  success: {
    backgroundColor: ColorTokens.surface.success,
    borderColor: SemanticStates.success.foreground,
  },
  warning: {
    backgroundColor: ColorTokens.surface.warning,
    borderColor: SemanticStates.warning.foreground,
  },
  danger: {
    backgroundColor: ColorTokens.surface.danger,
    borderColor: SemanticStates.danger.foreground,
  },
};

const paddingStyles = {
  none: { padding: 0 },
  sm: { padding: Spacing.sm },
  md: { padding: Spacing.md },
  lg: { padding: Spacing.lg },
} satisfies Record<NonNullable<SurfaceProps["padding"]>, ViewStyle>;

export function Surface({
  children,
  tone = "default",
  padding = "md",
  elevated = false,
  style,
  testID,
}: SurfaceProps) {
  return (
    <View
      style={[
        styles.base,
        toneStyles[tone],
        paddingStyles[padding],
        elevated && styles.elevated,
        style,
      ]}
      testID={testID}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 17,
    borderWidth: Borders.hairline,
  },
  elevated: {
    ...(Platform.OS === "web"
      ? ({ boxShadow: "0 5px 16px rgba(0,0,0,0.18)" } as any)
      : {
          shadowColor: ColorTokens.shadow.color,
          shadowOpacity: 0.16,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 5 },
          elevation: 2,
        }),
  },
});
