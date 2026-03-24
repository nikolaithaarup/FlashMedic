// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
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
        {/* Let expo-router auto-discover whatever exists in /app */}
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </ThemeProvider>
    </StatsProvider>
  );
}
