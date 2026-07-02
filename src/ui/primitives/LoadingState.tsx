import React, { type ReactNode } from "react";
import { ActivityIndicator } from "react-native";

import { ColorTokens } from "../../../constants/theme";
import { StateView } from "./StateView";

type LoadingStateProps = {
  title?: string;
  message?: string;
  action?: ReactNode;
  testID?: string;
};

export function LoadingState({
  title = "Indlæser",
  message,
  action,
  testID,
}: LoadingStateProps) {
  return (
    <StateView
      action={action}
      message={message}
      title={title}
      testID={testID}
    >
      <ActivityIndicator
        accessibilityLabel={title}
        color={ColorTokens.accent.muted}
      />
    </StateView>
  );
}
