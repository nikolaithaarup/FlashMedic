import React, { type ReactNode } from "react";
import {
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  View,
  type ViewStyle,
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
};

export function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  scrollViewProps,
  testID,
}: ScreenProps) {
  return (
    <Background>
      <SafeAreaView style={styles.safeArea} testID={testID}>
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
          contentContainerStyle={[styles.content, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill, contentContainerStyle]}>
          {children}
        </View>
      )}
      </SafeAreaView>
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
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  fill: {
    flex: 1,
  },
});
