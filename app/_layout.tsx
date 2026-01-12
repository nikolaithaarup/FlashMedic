import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { StatsProvider } from "../src/features/stats/StatsContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <StatsProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Gate/redirect */}
          <Stack.Screen name="index" />

          {/* Main routes */}
          <Stack.Screen name="login" />
          <Stack.Screen name="home" />

          {/* Grouped routes (folders) */}
          <Stack.Screen name="weekly/index" />
          <Stack.Screen name="weekly/mcq" />
          <Stack.Screen name="weekly/match" />
          <Stack.Screen name="weekly/word" />

          <Stack.Screen name="flashcards/index" />
          <Stack.Screen name="flashcards/quiz" />

          <Stack.Screen name="stats" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="contact" />

          <Stack.Screen name="drugcalc/index" />
          <Stack.Screen name="drugcalc/practice" />
          <Stack.Screen name="drugcalc/theory" />

          {/* Existing modal */}
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </StatsProvider>
  );
}
