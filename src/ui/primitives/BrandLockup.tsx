import React from "react";
import { Image, StyleSheet, View, type ViewStyle } from "react-native";

// Header-only crop of the existing infinity icon. Installation icons are unchanged.
const infinityMark = require("../../../public/icons/flashmedic-brand-mark.png");
const wordmark = require("../../../public/icons/flashmedic-wordmark-trim.png");

type BrandLockupProps = {
  compact?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export function BrandLockup({ compact = false, style }: BrandLockupProps) {
  return (
    <View
      accessibilityLabel="FlashMedic"
      accessible
      style={[styles.container, compact && styles.containerCompact, style]}
    >
      <Image
        accessibilityElementsHidden
        resizeMode="contain"
        source={infinityMark}
        style={[styles.mark, compact && styles.markCompact]}
      />
      <Image
        accessibilityElementsHidden
        resizeMode="contain"
        source={wordmark}
        style={[styles.wordmark, compact && styles.wordmarkCompact]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: 3,
  },
  containerCompact: { gap: 2 },
  // Source image is cropped to its visible bounds, so these dimensions
  // describe the mark itself instead of mostly transparent square padding.
  mark: { width: 138, height: 62 },
  markCompact: { width: 116, height: 52 },
  wordmark: {
    width: "100%",
    maxWidth: 360,
    height: 48,
  },
  wordmarkCompact: { maxWidth: 300, height: 40 },
});
