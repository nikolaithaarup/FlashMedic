import React, { type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  View,
  type ViewStyle,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Spacing } from "../../../constants/theme";
import { Background } from "./Background";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentContainerStyle?: ViewStyle | ViewStyle[];
  scrollViewProps?: Omit<ScrollViewProps, "contentContainerStyle">;
  testID?: string;
  width?: "reading" | "wide";
};

// Web horizontal/vertical insets are handled once by app/+html.tsx.
// Do not apply the same insets again inside a web route.
const ContentSafeArea = Platform.OS === "web" ? View : SafeAreaView;

export function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  scrollViewProps,
  testID,
  width: contentWidth = "reading",
}: ScreenProps) {
  const { width } = useWindowDimensions();
  // On asymmetric foldable displays, the content width can be smaller
  // than the window width due to the right-hand safe-area inset.
  const [availableWidth, setAvailableWidth] = React.useState<number | null>(null);
  const layoutWidth = Platform.OS === "web" && availableWidth !== null ? availableWidth : width;
  const horizontalPadding = layoutWidth < 480
    ? Spacing.md
    : layoutWidth < 840
      ? Spacing.lg
      : Spacing.xl;
  const maxWidth = contentWidth === "wide" ? 1120 : 900;

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.fill}
      >
        <ContentSafeArea
          style={styles.safeArea}
          testID={testID}
          onLayout={Platform.OS === "web" ? (event) => {
            const measured = event.nativeEvent.layout.width;
            if (measured > 0) {
              setAvailableWidth((current) =>
                current === null || Math.abs(current - measured) > 1 ? measured : current,
              );
            }
          } : undefined}
        >
          {scroll ? (
            <ScrollView
              automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
              contentInsetAdjustmentBehavior="automatic"
              keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              {...scrollViewProps}
              contentContainerStyle={[
                styles.content,
                { maxWidth, paddingHorizontal: horizontalPadding },
                contentContainerStyle,
              ]}
            >
              {children}
            </ScrollView>
          ) : (
            <View
              style={[
                styles.content,
                styles.fill,
                { maxWidth, paddingHorizontal: horizontalPadding },
                contentContainerStyle,
              ]}
            >
              {children}
            </View>
          )}
        </ContentSafeArea>
      </KeyboardAvoidingView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    backgroundColor: "transparent",
  },
  content: {
    width: "100%",
    alignSelf: "center",
    paddingVertical: Spacing.md,
  },
  fill: {
    flex: 1,
  },
});
