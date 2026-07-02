import React, { type ReactNode } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";

import {
  ColorTokens,
  Spacing,
  Typography,
} from "../../../constants/theme";

type StateViewProps = {
  title: string;
  message?: string;
  action?: ReactNode;
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function StateView({
  title,
  message,
  action,
  children,
  style,
  testID,
}: StateViewProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {children}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  title: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
    textAlign: "center",
  },
  message: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  action: {
    width: "100%",
    marginTop: Spacing.lg,
  },
});
