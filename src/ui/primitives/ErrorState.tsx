import React, { type ReactNode } from "react";
import { StyleSheet, Text } from "react-native";

import {
  SemanticStates,
  Typography,
} from "../../../constants/theme";
import { StateView } from "./StateView";

type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
  testID?: string;
};

export function ErrorState({
  title = "Noget gik galt",
  message,
  action,
  testID,
}: ErrorStateProps) {
  return (
    <StateView action={action} message={message} title={title} testID={testID}>
      <Text accessibilityElementsHidden style={styles.symbol}>
        !
      </Text>
    </StateView>
  );
}

const styles = StyleSheet.create({
  symbol: {
    color: SemanticStates.danger.foreground,
    fontSize: Typography.sizes.pageTitle,
    lineHeight: Typography.lineHeights.pageTitle,
    fontWeight: Typography.weights.heavy,
  },
});
