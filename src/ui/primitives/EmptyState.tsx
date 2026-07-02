import React, { type ReactNode } from "react";

import { StateView } from "./StateView";

type EmptyStateProps = {
  title: string;
  message?: string;
  action?: ReactNode;
  testID?: string;
};

export function EmptyState(props: EmptyStateProps) {
  return <StateView {...props} />;
}
