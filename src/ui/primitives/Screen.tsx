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

export function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  scrollViewProps,
  testID,
  width: contentWidth = "reading",
}: ScreenProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = width < 480
    ? Spacing.md
    : width < 840
      ? Spacing.lg
      : Spacing.xl;
  const maxWidth = contentWidth === "wide" ? 1120 : 900;

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.fill}
      >
        <SafeAreaView style={styles.safeArea} testID={testID}>
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
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
