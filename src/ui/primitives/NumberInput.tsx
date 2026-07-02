import React, { useId, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";

type NumberInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  unit?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  style?: ViewStyle | ViewStyle[];
  inputProps?: Omit<
    TextInputProps,
    "value" | "onChangeText" | "editable" | "keyboardType"
  >;
  testID?: string;
};

export function NumberInput({
  label,
  value,
  onChangeText,
  unit,
  helperText,
  error,
  disabled = false,
  readOnly = false,
  clearable = false,
  style,
  inputProps,
  testID,
}: NumberInputProps) {
  const helperId = useId();
  const [focused, setFocused] = useState(false);
  const editable = !disabled && !readOnly;
  const describedBy = error || helperText ? helperId : undefined;

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.field,
          focused && styles.focused,
          !!error && styles.invalid,
          disabled && styles.disabled,
          readOnly && styles.readOnly,
        ]}
      >
        <TextInput
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          aria-describedby={describedBy}
          keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
          {...inputProps}
          editable={editable}
          onBlur={(event) => {
            setFocused(false);
            inputProps?.onBlur?.(event);
          }}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setFocused(true);
            inputProps?.onFocus?.(event);
          }}
          placeholderTextColor={ColorTokens.text.muted}
          style={styles.input}
          value={value}
        />

        {unit ? <Text style={styles.unit}>{unit}</Text> : null}

        {clearable && editable && value.length > 0 ? (
          <Pressable
            accessibilityLabel={`Ryd ${label}`}
            accessibilityRole="button"
            hitSlop={Spacing.xs}
            onPress={() => onChangeText("")}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.clearButtonPressed,
            ]}
          >
            <Text style={styles.clearLabel} accessibilityElementsHidden>
              ×
            </Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text id={helperId} style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : helperText ? (
        <Text id={helperId} style={styles.helper}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: Spacing.xs,
  },
  label: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
  },
  field: {
    minHeight: Interaction.minimumTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.onSurface,
    backgroundColor: ColorTokens.surface.default,
    paddingLeft: Spacing.md,
  },
  focused: {
    borderColor: ColorTokens.interaction.focus,
    backgroundColor: ColorTokens.surface.elevated,
  },
  invalid: {
    borderColor: ColorTokens.semantic.danger,
  },
  disabled: {
    opacity: Interaction.disabledOpacity,
    backgroundColor: ColorTokens.interaction.disabledSurface,
  },
  readOnly: {
    backgroundColor: ColorTokens.surface.elevated,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: Interaction.minimumTouchTarget,
    color: ColorTokens.text.onSurface,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    paddingVertical: Spacing.sm,
  },
  unit: {
    color: ColorTokens.text.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
    paddingHorizontal: Spacing.sm,
  },
  clearButton: {
    width: Interaction.minimumTouchTarget,
    minHeight: Interaction.minimumTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonPressed: {
    opacity: Interaction.pressedOpacity,
  },
  clearLabel: {
    color: ColorTokens.text.muted,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
  },
  helper: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  error: {
    color: ColorTokens.semantic.danger,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.medium,
  },
});
