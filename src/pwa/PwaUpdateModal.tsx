import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ColorTokens, Radii } from "../../constants/theme";

type Props = {
  updating: boolean;
  failed: boolean;
  onUpdate: () => void;
  onLater: () => void;
};

export function PwaUpdateModal({ updating, failed, onUpdate, onLater }: Props) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onLater}>
      <View testID="flashmedic-update-modal" accessibilityViewIsModal style={styles.backdrop}>
        <View style={styles.dialog}>
          <Text accessibilityRole="header" style={styles.title}>Ny version klar</Text>
          <Text style={styles.description}>
            {failed
              ? "Opdateringen kunne ikke gennemføres. Du kan prøve igen."
              : "Opdatér FlashMedic for at få den nyeste version."}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Opdatér FlashMedic"
            disabled={updating}
            onPress={onUpdate}
            style={({ pressed }) => [styles.action, { opacity: pressed || updating ? 0.72 : 1 }]}
          >
            <Text style={styles.actionText}>{updating ? "Opdaterer…" : failed ? "Prøv igen" : "Opdatér nu"}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Senere"
            onPress={onLater}
            style={styles.dismiss}
          >
            <Text style={styles.dismissText}>Senere</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    minHeight: "100dvh" as never,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "rgba(3, 12, 18, 0.67)",
    backdropFilter: "blur(12px)" as never,
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.toolElevated,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.42)" as never,
  },
  title: {
    color: ColorTokens.text.primary,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    color: ColorTokens.text.secondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  action: {
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Radii.control,
    backgroundColor: ColorTokens.accent.action,
    paddingHorizontal: 20,
  },
  actionText: {
    color: ColorTokens.text.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  dismiss: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  dismissText: {
    color: ColorTokens.text.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
});
