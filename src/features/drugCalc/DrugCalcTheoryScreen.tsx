import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../../app/flashmedicStyles";

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;
  onBack: () => void; // setScreen("drugCalcHome")
};

export function DrugCalcTheoryScreen({ headingFont, subtitleFont, buttonFont, onBack }: Props) {
  return (
    <LinearGradient colors={["#0e91a8ff", "#5e6e7eff"]} style={styles.homeBackground}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={[styles.homeContainer, styles.safeTopContainer]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.appTitle, { fontSize: headingFont, color: "#f8f9fa" }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Lægemiddelregning
            </Text>
            <View style={styles.subHeaderRow}>
              <Text style={[styles.subHeaderText, { fontSize: subtitleFont }]}>Teori</Text>
            </View>
          </View>

          <Pressable
            style={[styles.smallButton, { borderColor: "#fff" }]}
            onPress={onBack}
            hitSlop={8}
          >
            <Text style={[styles.smallButtonText, { color: "#fff", fontSize: buttonFont * 0.9 }]}>
              Tilbage
            </Text>
          </Pressable>
        </View>

        <View style={[styles.statsCard, { alignSelf: "stretch" }]}>
          <Text style={styles.statsSectionTitle}>Grundformler</Text>

          <Text style={styles.drugTheoryText}>
            Dosisregning handler i sin kerne om tre ting:
            {"\n"}
            {"\n"}• D = ordineret dosis (mg eller g){"\n"}• S = styrke (mg/mL, mg/tablet, % osv.){"\n"}
            • V = volumen (mL eller antal tabletter)
            {"\n"}
            {"\n"}
            De tre hænger altid sammen gennem formlerne:
            {"\n"}D = S × V{"\n"}V = D / S{"\n"}S = D / V{"\n"}
            {"\n"}
            Eksempel: Du skal give 300 mg, præparatet indeholder 100 mg/mL.
            {"\n"}V = 300 / 100 = 3 mL.
          </Text>

          <Text style={[styles.statsSectionTitle, { marginTop: 18 }]}>Tabletter</Text>
          <Text style={styles.drugTheoryText}>
            Antal tabletter = ordineret dosis / mg pr. tablet.
            {"\n"}
            {"\n"}
            Eksempel: Patienten skal have 225 mg Paracetamol, tabletter findes som 75 mg.
            {"\n"}
            Antal tabletter = 225 / 75 = 3 tabletter.
          </Text>

          <Text style={[styles.statsSectionTitle, { marginTop: 18 }]}>
            Stærke opløsninger (mg/mL)
          </Text>
          <Text style={styles.drugTheoryText}>
            Eksempel: 5 mg/mL og du skal give 20 mg → 20 / 5 = 4 mL.
          </Text>

          <Text style={[styles.statsSectionTitle, { marginTop: 18 }]}>
            Procentregning (glukose, NaCl osv.)
          </Text>
          <Text style={styles.drugTheoryText}>
            X% = X gram pr. 100 mL.
            {"\n"}
            {"\n"}
            Eksempel: 10% glukose = 10 g / 100 mL.
            {"\n"}
            {"\n"}
            500 mL 10% glukose = (10 g / 100 mL) × 500 mL = 50 g.
          </Text>

          <Text style={[styles.statsSectionTitle, { marginTop: 18 }]}>Dråber → mL</Text>
          <Text style={styles.drugTheoryText}>
            1 mL svarer typisk til 20 dråber (kan variere i praksis).
            {"\n"}
            {"\n"}
            Eksempel: 60 dråber = 60 / 20 = 3 mL.
          </Text>

          <Text style={[styles.statsSectionTitle, { marginTop: 18 }]}>Infusioner og hastigheder</Text>
          <Text style={styles.drugTheoryText}>
            mL/time = total volumen / antal timer.
            {"\n"}
            {"\n"}
            Eksempel: 1000 mL over 4 timer → 1000 / 4 = 250 mL/time.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default DrugCalcTheoryScreen;
