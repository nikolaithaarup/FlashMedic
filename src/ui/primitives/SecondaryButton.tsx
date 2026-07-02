import React from "react";
import { StyleSheet } from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
} from "../../../constants/theme";
import { ButtonBase, type ButtonProps } from "./ButtonBase";

export function SecondaryButton(props: ButtonProps) {
  return (
    <ButtonBase
      {...props}
      containerStyle={styles.container}
      indicatorColor={ColorTokens.text.primary}
      labelStyle={styles.label}
      pressedStyle={styles.pressed}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ColorTokens.surface.inverse,
    borderColor: ColorTokens.border.strong,
    borderWidth: Borders.hairline,
  },
  pressed: {
    backgroundColor: ColorTokens.interaction.pressed,
    opacity: Interaction.pressedOpacity,
    transform: [{ scale: Interaction.controlPressedScale }],
  },
  label: {
    color: ColorTokens.text.primary,
  },
});
