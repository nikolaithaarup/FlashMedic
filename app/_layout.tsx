// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { StatsProvider } from "../src/features/stats/StatsContext";
import { PwaManager } from "../src/pwa/PwaManager";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <StatsProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {/* Let expo-router auto-discover whatever exists in /app */}
        <Stack screenOptions={{ headerShown: false }} />
        <PwaManager />
        <StatusBar style="auto" />
      </ThemeProvider>
    </StatsProvider>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={errorStyles.root}>
      <View style={errorStyles.card}>
        <Text accessibilityRole="header" style={errorStyles.title}>
          FlashMedic kunne ikke starte
        </Text>
        <Text style={errorStyles.message}>{error.message}</Text>
        <Pressable accessibilityRole="button" onPress={retry} style={errorStyles.button}>
          <Text style={errorStyles.buttonText}>Prøv igen</Text>
        </Pressable>
      </View>
    </View>
  );
}

const errorStyles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: "100vh" as never,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#10161c",
  },
  card: { width: "100%", maxWidth: 520, gap: 16 },
  title: { color: "#f8f9fa", fontSize: 28, fontWeight: "700" },
  message: { color: "#e9ecef", fontSize: 16, lineHeight: 24 },
  button: {
    minHeight: 48,
    alignSelf: "flex-start",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 18,
  },
  buttonText: { color: "#ffffff", fontWeight: "700" },
});
