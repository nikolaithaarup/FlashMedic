// src/features/flashcards/components/FullscreenEkgImageModal.tsx

import React from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type FullscreenEkgImageModalProps = {
  visible: boolean;
  imageSource: any;
  onClose: () => void;
  rotate?: boolean;
};

export default function FullscreenEkgImageModal({
  visible,
  imageSource,
  onClose,
  rotate = true,
}: FullscreenEkgImageModalProps) {
  const { width, height } = useWindowDimensions();

  // After a 90° rotation, the image wrapper should use swapped dimensions.
  const rotatedBoxWidth = height;
  const rotatedBoxHeight = width;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <SafeAreaView style={styles.safeArea}>
          <Pressable onPress={onClose} style={styles.closeButton} hitSlop={12}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </SafeAreaView>

        <View style={styles.centerArea}>
          <View
            style={[
              styles.imageFrame,
              rotate && {
                width: rotatedBoxWidth,
                height: rotatedBoxHeight,
                transform: [{ rotate: "90deg" }],
              },
              !rotate && {
                width,
                height,
              },
            ]}
          >
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Optional tap-anywhere backdrop close */}
        <Pressable style={styles.backdropCloseZone} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    pointerEvents: "box-none",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginTop: Platform.OS === "android" ? 6 : 0,
    marginRight: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 24,
  },
  centerArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imageFrame: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  backdropCloseZone: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});
