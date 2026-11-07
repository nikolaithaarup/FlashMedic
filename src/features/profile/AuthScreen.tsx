import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import {
  Spacing,
} from "../../../constants/theme";
import {
  BrandLockup,
  SecondaryButton,
  Screen,
} from "../../ui/primitives";
import { SynapseEmailLogin } from "./SynapseEmailLogin";

function makeRandomAnonName() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `Bruger${n}`;
}

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  suggestedAnonName?: string;
  onContinueAnonymous: (nickname: string) => void;
  onAuthenticated: (nickname: string, syncConfirmed: boolean) => void | Promise<void>;
};

export default function AuthScreen({
  suggestedAnonName,
  onContinueAnonymous,
  onAuthenticated,
}: Props) {
  const defaultAnon = useMemo(
    () => suggestedAnonName ?? makeRandomAnonName(),
    [suggestedAnonName],
  );
  return (
    <Screen contentContainerStyle={styles.content}>
      <StatusBar style="light" />

      <View style={styles.hero}>
        <BrandLockup compact />
      </View>

      <View style={styles.form}>
        <SynapseEmailLogin
          onAuthenticated={({ syncConfirmed }) => onAuthenticated(defaultAnon, syncConfirmed)}
        />
      </View>

      <SecondaryButton
        label="Fortsæt som gæst"
        onPress={() => onContinueAnonymous(defaultAnon)}
        style={styles.guestAction}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", paddingTop: Spacing.sm },
  hero: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: Spacing.sm,
  },
  form: { gap: Spacing.sm, maxWidth: 420, width: "100%" },
  guestAction: { marginTop: Spacing.sm, maxWidth: 420, width: "100%" },
});
