import { LinearGradient } from "expo-linear-gradient";
import React, { type PropsWithChildren } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { ColorTokens } from "../../../constants/theme";

type BackgroundProps = PropsWithChildren<{
  variant?: "default" | "home";
  style?: StyleProp<ViewStyle>;
  /** Transitional compatibility for screens migrating from LinearGradient. */
  colors?: readonly string[];
}>;

export function Background({
  children,
  variant = "default",
  style,
}: BackgroundProps) {
  return (
    <View style={[styles.root, style]}>
      <LinearGradient
        colors={[
          ColorTokens.background.base,
          "#16262d",
          ColorTokens.background.base,
        ]}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={[styles.swirlLayer, variant === "home" && styles.homeSwirls]}
      >
        <View style={[styles.swirl, styles.swirlOne]} />
        <View style={[styles.swirl, styles.swirlTwo]} />
        <View style={[styles.swirl, styles.swirlThree]} />
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ColorTokens.background.base,
    ...(Platform.OS === "web" ? ({ minHeight: "100vh" } as any) : null),
  },
  content: { flex: 1, backgroundColor: "transparent" },
  swirlLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    opacity: 0.58,
  },
  homeSwirls: { opacity: 1 },
  swirl: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(77,171,247,0.11)",
    borderRadius: 999,
  },
  swirlOne: {
    width: 620,
    height: 170,
    top: 64,
    left: -170,
    transform: [{ rotate: "12deg" }],
  },
  swirlTwo: {
    width: 560,
    height: 150,
    top: 108,
    right: -230,
    borderColor: "rgba(14,145,168,0.13)",
    transform: [{ rotate: "-17deg" }],
  },
  swirlThree: {
    width: 470,
    height: 115,
    top: 150,
    left: -40,
    borderColor: "rgba(77,171,247,0.07)",
    transform: [{ rotate: "5deg" }],
  },
});
