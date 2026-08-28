import React from "react";
import { StyleSheet } from "react-native";

import {
  ColorTokens,
  Interaction,
} from "../../../constants/theme";
import { ButtonBase, type ButtonProps } from "./ButtonBase";

export function PrimaryButton(props: ButtonProps) {
  return (
    <ButtonBase
      {...props}
      containerStyle={styles.container}
      indicatorColor={ColorTokens.text.onAccent}
      labelStyle={styles.label}
      pressedStyle={styles.pressed}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorTokens.accent.primary,
  },
  pressed: {
    backgroundColor: ColorTokens.accent.primaryPressed,
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.controlPressedScale }],
  },
  label: {
    color: ColorTokens.text.onAccent,
  },
});
