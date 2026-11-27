import React, { type ReactNode } from "react";
import {
  Keyboard,
  TextInput,
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
  keyboardAware?: boolean;
};

// Web horizontal/vertical insets are handled once by app/+html.tsx.
// Do not apply the same insets again inside a web route.
const ContentSafeArea = Platform.OS === "web" ? View : SafeAreaView;

export function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  scrollViewProps,
  testID,
  width: contentWidth = "reading",
  keyboardAware = false,
}: ScreenProps) {
  const { width } = useWindowDimensions();
  const scrollRef = React.useRef<ScrollView>(null);
  const [keyboardSpace, setKeyboardSpace] = React.useState(0);
  React.useEffect(() => {
    if (!keyboardAware || !scroll) return;
    if (Platform.OS !== "web") {
      const reveal = () => {
        const input = TextInput.State.currentlyFocusedInput();
        if (input) scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard(input, 24, true);
      };
      const show = Keyboard.addListener("keyboardDidShow", reveal);
      const change = Keyboard.addListener("keyboardDidChangeFrame", reveal);
      return () => { show.remove(); change.remove(); };
    }
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const viewport = window.visualViewport;
    let frame = 0;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const focused = () => {
      const el = document.activeElement;
      return el instanceof HTMLElement && el.matches("input, textarea") &&
        el.closest('[data-testid="' + testID + '"]') ? el : null;
    };
    const reveal = () => {
      const el = focused();
      if (!el) { setKeyboardSpace(0); return; }
      const top = viewport?.offsetTop ?? 0;
      const height = viewport?.height ?? window.innerHeight;
      const bottom = top + height;
      const inset = Math.max(0, window.innerHeight - bottom);
      setKeyboardSpace(inset > 60 ? inset + 64 : 0);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (focused() !== el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < top + 12 || rect.bottom > bottom - 64) {
          el.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
          const overflow = el.getBoundingClientRect().bottom - bottom + 64;
          if (overflow > 0) {
            let parent = el.parentElement;
            while (parent && parent !== document.body) {
              if (/(auto|scroll)/.test(window.getComputedStyle(parent).overflowY) && parent.scrollHeight > parent.clientHeight) {
                parent.scrollTop += overflow;
                break;
              }
              parent = parent.parentElement;
            }
          }
        }
      });
    };
    const schedule = () => {
      timers.forEach(clearTimeout);
      reveal();
      timers = [80, 260, 500].map(delay => setTimeout(reveal, delay));
    };
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    viewport?.addEventListener("resize", schedule);
    window.addEventListener("resize", schedule);
    return () => {
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
      viewport?.removeEventListener("resize", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
    };
  }, [keyboardAware, scroll, testID]);
  // On asymmetric foldable displays, the content width can be smaller
  // than the window width due to the right-hand safe-area inset.
  const [availableWidth, setAvailableWidth] = React.useState<number | null>(null);
  const layoutWidth = Platform.OS === "web" && availableWidth !== null ? availableWidth : width;
  const horizontalPadding = layoutWidth < 480
    ? Spacing.md
    : layoutWidth < 840
      ? Spacing.lg
      : Spacing.xl;
  const maxWidth = contentWidth === "wide" ? 1120 : 900;

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.fill}
      >
        <ContentSafeArea
          style={styles.safeArea}
          testID={testID}
          onLayout={Platform.OS === "web" ? (event) => {
            const measured = event.nativeEvent.layout.width;
            if (measured > 0) {
              setAvailableWidth((current) =>
                current === null || Math.abs(current - measured) > 1 ? measured : current,
              );
            }
          } : undefined}
        >
          {scroll ? (
            <ScrollView
              ref={scrollRef}
              automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
              contentInsetAdjustmentBehavior="automatic"
              keyboardDismissMode={keyboardAware ? "none" : Platform.OS === "ios" ? "interactive" : "on-drag"}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              {...scrollViewProps}
              contentContainerStyle={[
                styles.content,
                { maxWidth, paddingHorizontal: horizontalPadding },
                contentContainerStyle,
                keyboardAware && keyboardSpace > 0 ? { paddingBottom: keyboardSpace + Spacing.lg } : undefined,
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
        </ContentSafeArea>
      </KeyboardAvoidingView>
    </Background>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    minWidth: 0,
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
