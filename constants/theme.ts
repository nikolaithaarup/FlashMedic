import { Platform, type TextStyle, type ViewStyle } from "react-native";

/**
 * FlashMedic's semantic design tokens.
 *
 * Screens are intentionally not migrated in Phase 1. These values organize the
 * existing visual language so later component work can replace one-off values
 * without changing product behavior or importing another product's palette.
 */

const palette = {
  teal: {
    50: "#e6fcf5",
    400: "#0e91a8",
    500: "#0a7ea4",
  },
  blue: {
    400: "#4dabf7",
    500: "#1c7ed6",
    600: "#4c6ef5",
    700: "#364fc7",
  },
  slate: {
    50: "#f8f9fa",
    100: "#f1f3f5",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#868e96",
    700: "#5e6e7e",
    800: "#495057",
    900: "#343a40",
    950: "#212529",
  },
  green: {
    50: "#e6fcf5",
    500: "#12b886",
    600: "#2f9e44",
    700: "#2b8a3e",
  },
  amber: {
    50: "#fff4e6",
    500: "#f08c00",
  },
  red: {
    50: "#ffe3e3",
    500: "#fa5252",
    600: "#e03131",
    700: "#c92a2a",
  },
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
} as const;

export const ColorTokens = {
  background: {
    base: palette.slate[950],
    top: palette.teal[400],
    bottom: palette.slate[700],
    scrim: "rgba(0,0,0,0.55)",
  },
  surface: {
    default: palette.white,
    elevated: "rgba(255,255,255,0.95)",
    subtle: "rgba(0,0,0,0.12)",
    inverse: "rgba(0,0,0,0.18)",
  },
  text: {
    primary: palette.slate[50],
    secondary: palette.slate[200],
    muted: palette.slate[600],
    onSurface: palette.slate[950],
    onAccent: palette.white,
    disabled: palette.slate[500],
  },
  accent: {
    default: palette.teal[400],
    action: palette.blue[500],
    muted: palette.blue[400],
    surface: "rgba(14,145,168,0.16)",
    border: palette.teal[500],
  },
  border: {
    default: "rgba(255,255,255,0.20)",
    strong: "rgba(255,255,255,0.80)",
    onSurface: palette.slate[400],
    divider: "rgba(255,255,255,0.12)",
  },
  interaction: {
    pressed: "rgba(0,0,0,0.18)",
    selected: palette.blue[600],
    selectedBorder: palette.blue[700],
    focus: palette.blue[400],
    disabled: "rgba(173,181,189,0.42)",
    disabledSurface: "rgba(73,80,87,0.48)",
  },
  semantic: {
    success: palette.green[500],
    successStrong: palette.green[700],
    successSurface: palette.green[50],
    warning: palette.amber[500],
    warningSurface: palette.amber[50],
    danger: palette.red[500],
    dangerStrong: palette.red[700],
    dangerSurface: palette.red[50],
    info: palette.blue[500],
    infoSurface: "rgba(28,126,214,0.14)",
  },
} as const;

export const Spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 40,
} as const;

export const Radii = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const Borders = {
  hairline: 1,
  emphasized: 1.5,
  colors: ColorTokens.border,
} as const;

const fontFamilies = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  default: {
    sans: "sans-serif",
    serif: "serif",
    rounded: "sans-serif",
    mono: "monospace",
  },
})!;

export const Typography = {
  families: fontFamilies,
  sizes: {
    caption: 12,
    label: 14,
    body: 16,
    cardTitle: 18,
    sectionTitle: 20,
    pageTitle: 28,
    heroTitle: 36,
  },
  lineHeights: {
    caption: 16,
    label: 20,
    body: 24,
    cardTitle: 24,
    sectionTitle: 28,
    pageTitle: 34,
    heroTitle: 42,
  },
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    heavy: "800",
  } satisfies Record<string, NonNullable<TextStyle["fontWeight"]>>,
} as const;

export const Interaction = {
  minimumTouchTarget: 48,
  compactTouchTarget: 44,
  pressedOpacity: 0.88,
  disabledOpacity: 0.5,
  cardPressedScale: 0.99,
  controlPressedScale: 0.97,
  colors: ColorTokens.interaction,
} as const;

export const SemanticStates = {
  success: {
    foreground: ColorTokens.semantic.success,
    strong: ColorTokens.semantic.successStrong,
    surface: ColorTokens.semantic.successSurface,
  },
  warning: {
    foreground: ColorTokens.semantic.warning,
    surface: ColorTokens.semantic.warningSurface,
  },
  danger: {
    foreground: ColorTokens.semantic.danger,
    strong: ColorTokens.semantic.dangerStrong,
    surface: ColorTokens.semantic.dangerSurface,
  },
  info: {
    foreground: ColorTokens.semantic.info,
    surface: ColorTokens.semantic.infoSurface,
  },
} as const;

export const FlashMedicTheme = {
  colors: ColorTokens,
  spacing: Spacing,
  typography: Typography,
  radii: Radii,
  borders: Borders,
  interaction: Interaction,
  states: SemanticStates,
} as const;

export type FlashMedicThemeTokens = typeof FlashMedicTheme;
export type SemanticState = keyof typeof SemanticStates;

/**
 * Compatibility map for the Expo template helpers that remain in the repo.
 * Production screens are not switched to these tokens until a later phase.
 */
export const Colors = {
  light: {
    text: ColorTokens.text.onSurface,
    background: ColorTokens.surface.default,
    tint: ColorTokens.accent.default,
    icon: palette.slate[600],
    tabIconDefault: palette.slate[600],
    tabIconSelected: ColorTokens.accent.default,
  },
  dark: {
    text: ColorTokens.text.primary,
    background: ColorTokens.background.base,
    tint: ColorTokens.accent.muted,
    icon: palette.slate[500],
    tabIconDefault: palette.slate[500],
    tabIconSelected: ColorTokens.accent.muted,
  },
} as const;

/** @deprecated Prefer Typography.families for new code. */
export const Fonts = fontFamilies;

// Type checks for consumers composing token values into React Native styles.
const _viewStyleTokenCheck: Pick<ViewStyle, "borderRadius" | "borderWidth"> = {
  borderRadius: Radii.md,
  borderWidth: Borders.hairline,
};
void _viewStyleTokenCheck;
