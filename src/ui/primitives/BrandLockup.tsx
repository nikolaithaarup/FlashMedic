import React from "react";
import { Image, StyleSheet, View, type ViewStyle } from "react-native";

// Original SynapseStudio artwork: same visual dimensions as AmbuAssist home.
const infinityMark = require("../../../assets/synapse-icon.png");
const wordmark = require("../../../public/icons/flashmedic-wordmark-trim.png");

type BrandLockupProps = {
  compact?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export function BrandLockup({ compact = false, style }: BrandLockupProps) {
  return (
    <View accessible accessibilityLabel="FlashMedic" style={[styles.container, style]}>
      <Image
        testID="home-brand-icon"
        accessibilityElementsHidden
        resizeMode="cover"
        source={infinityMark}
        style={compact ? styles.markCompact : styles.mark}
      />
      <Image
        accessibilityElementsHidden
        resizeMode="contain"
        source={wordmark}
        style={compact ? styles.wordmarkCompact : styles.wordmark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center", gap: 0 },
  mark: { width: 160, height: 80, overflow: "hidden" },
  markCompact: { width: 136, height: 68, overflow: "hidden" },
  wordmark: { width: "100%", maxWidth: 360, height: 48, marginTop: -3 },
  wordmarkCompact: { width: "100%", maxWidth: 300, height: 40, marginTop: -3 },
});
