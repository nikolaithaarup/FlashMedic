import React from "react";
import { Text, View } from "react-native";
import type { RhythmId } from "./rhythmModel";

// Preserves native compilation. The moving Canvas monitor is PWA-only for this first release.
export function EkgLiveMonitor(props: { rhythmId: RhythmId; seed: number; paused: boolean }) {
  void props;
  return (
    <View style={{ backgroundColor: "#061c25", borderRadius: 12, padding: 20 }}>
      <Text style={{ color: "#e9ecef", textAlign: "center" }}>
        Den animerede monitor er forelÃ¸big tilgÃ¦ngelig i FlashMedic-webappen.
      </Text>
    </View>
  );
}
