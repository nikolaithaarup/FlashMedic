import { Pressable, StyleSheet, Text, View } from "react-native";
import { Borders, ColorTokens, Interaction, Radii, Spacing } from "../../../constants/theme";

type Props = {
  onEmail: () => void;
  onReport: () => void;
  onStudio: () => void;
};

/** Mirrors AmbuAssist's contact actions with FlashMedic's existing accent colour. */
export function SupportQuickActions({ onEmail, onReport, onStudio }: Props) {
  return (
    <View testID="synapsestudio-support-identity" style={styles.container}>
      <View style={styles.brand}>
        <Text style={styles.studio}>FlashMedic · SynapseStudio</Text>
        <Text style={styles.creator}>Udviklet af Nikolai Louis Kleftås Thaarup</Text>
      </View>
      <Pressable
        testID="flash-support-email"
        accessibilityRole="link"
        accessibilityLabel="Skriv e-mail"
        onPress={onEmail}
        style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
      >
        <Text style={styles.primaryText}>Skriv e-mail</Text>
      </Pressable>
      <View style={styles.secondaryRow}>
        <Pressable
          testID="flash-support-report-error"
          accessibilityRole="link"
          accessibilityLabel="Rapportér fejl"
          onPress={onReport}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryText}>Rapportér fejl</Text>
        </Pressable>
        <Pressable
          testID="flash-support-studio"
          accessibilityRole="link"
          accessibilityLabel="SynapseStudio"
          onPress={onStudio}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        >
          <Text style={styles.secondaryText}>SynapseStudio</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  brand: { gap: 4, marginBottom: 2 },
  studio: { color: ColorTokens.accent.focus, fontSize: 13, fontWeight: "800" },
  creator: { color: ColorTokens.text.secondary, fontSize: 14, lineHeight: 20 },
  primary: {
    minHeight: 52,
    borderRadius: Radii.control,
    backgroundColor: ColorTokens.accent.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
  },
  primaryText: { color: ColorTokens.text.onAccent, fontSize: 16, fontWeight: "900" },
  secondaryRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  secondary: {
    flexBasis: "45%",
    minWidth: 130,
    flexGrow: 1,
    minHeight: Interaction.minimumTouchTarget,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    borderRadius: Radii.control,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
  },
  secondaryText: { color: ColorTokens.text.primary, fontSize: 14, fontWeight: "800" },
  pressed: { opacity: Interaction.pressedOpacity, backgroundColor: ColorTokens.accent.selected },
});
