import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";

import { Spacing } from "../../../constants/theme";
import {
  NavigationCard,
  Screen,
  ToolPageHeader,
} from "../../ui/primitives";

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  onBackHome: () => void;
  onStartPractice: (topicIds: string[]) => void;
  onOpenTheory?: () => void;
};

export default function DrugCalcHomeScreen({
  onBackHome,
  onStartPractice,
  onOpenTheory,
}: Props) {
  return (
    <Screen
      contentContainerStyle={styles.content}
      testID="drug-calc-home-screen"
    >
      <StatusBar style="light" />
      <ToolPageHeader
        backLabel="Tilbage til forsiden"
        onBack={onBackHome}
        title="Lægemiddelregning"
      />

      <View style={styles.list}>
        <NavigationCard
          onPress={() => onStartPractice([])}
          style={styles.destinationCard}
          title="Blandet træning"
        />

        {onOpenTheory ? (
          <NavigationCard
            onPress={onOpenTheory}
            style={styles.destinationCard}
            title="Metode og eksempler"
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: Spacing.xl },
  list: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  destinationCard: { flexGrow: 1, flexBasis: 300, minWidth: 0 },
});
