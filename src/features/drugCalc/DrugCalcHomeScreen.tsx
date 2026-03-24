// src/features/drugCalc/DrugCalcHomeScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "../../ui/flashmedicStyles";
import { DRUG_TOPICS } from "./drugCalcContent";

// Accept both strings and objects like {id,title,desc}
type TopicLike =
  | string
  | {
      id: string;
      title: string;
      desc?: string;
    };

type Props = {
  headingFont: number;
  subtitleFont: number;
  buttonFont: number;

  onBackHome: () => void;

  // IMPORTANT: we pass topic IDs (strings) back up
  onStartPractice: (topicIds: string[]) => void;

  onOpenTheory?: () => void;
};

type TheorySection = {
  id: string;
  title: string;
  body: string;
};

function TopicPill({
  label,
  selected,
  onPress,
  subLabel,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  subLabel?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.topicChip,
        selected && styles.topicChipSelected,
        { marginBottom: 8 },
      ]}
    >
      <Text
        style={[styles.topicChipText, selected && styles.topicChipTextSelected]}
      >
        {label}
      </Text>
      {subLabel ? (
        <Text
          style={[
            styles.topicChipText,
            {
              fontSize: 11,
              marginTop: 2,
              opacity: selected ? 1 : 0.75,
            },
            selected && { color: "#ffffff" },
          ]}
        >
          {subLabel}
        </Text>
      ) : null}
    </Pressable>
  );
}

function Collapsible({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Pressable
        onPress={onToggle}
        style={[
          styles.statsCard,
          {
            alignSelf: "stretch",
            paddingVertical: 14,
            paddingHorizontal: 16,
            backgroundColor: "rgba(0,0,0,0.12)",
          },
        ]}
      >
        <Text style={[styles.statsSectionTitle, { color: "#f8f9fa" }]}>
          {open ? "▼ " : "▶︎ "}
          {title}
        </Text>
      </Pressable>

      {open ? (
        <View
          style={[styles.statsCard, { alignSelf: "stretch", marginTop: 8 }]}
        >
          {children}
        </View>
      ) : null}
    </View>
  );
}

export default function DrugCalcHomeScreen({
  headingFont,
  subtitleFont,
  buttonFont,
  onBackHome,
  onStartPractice,
  onOpenTheory,
}: Props) {
  // Normalize DRUG_TOPICS into {id,label,desc?}
  const topics = useMemo(() => {
    const raw = (DRUG_TOPICS as unknown as TopicLike[]) ?? [];
    return raw.map((t) => {
      if (typeof t === "string") {
        return { id: t, label: t, desc: "" };
      }
      return { id: t.id, label: t.title, desc: t.desc ?? "" };
    });
  }, []);

  const [selectedPracticeTopicIds, setSelectedPracticeTopicIds] = useState<
    string[]
  >([]);

  const allSelected = useMemo(() => {
    if (!topics.length) return false;
    return selectedPracticeTopicIds.length === topics.length;
  }, [selectedPracticeTopicIds, topics.length]);

  const toggleTopic = (id: string) => {
    setSelectedPracticeTopicIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedPracticeTopicIds(allSelected ? [] : topics.map((t) => t.id));
  };

  const theorySections: TheorySection[] = useMemo(
    () => [
      {
        id: "core",
        title: "Grundformler (D, S, V)",
        body:
          "Tre størrelser går igen i næsten al lægemiddelregning:\n\n" +
          // CHANGED: mcg/µg -> ug
          "• D = dosis (mg, ug, IE, mmol osv.)\n" +
          "• S = styrke (mg/mL, ug/mL, IE/mL, % osv.)\n" +
          "• V = volumen (mL) eller antal enheder\n\n" +
          "Formler:\n" +
          "• D = S × V\n" +
          "• V = D / S\n" +
          "• S = D / V\n\n" +
          // CHANGED: µg -> ug
          "Eksempel: Ordineret 100 ug, styrke 50 ug/mL → V = 100/50 = 2 mL.",
      },
      {
        id: "percent",
        title: "Procentopløsninger (glukose, NaCl)",
        body:
          "X% betyder X gram pr. 100 mL.\n\n" +
          "Eksempel:\n" +
          "• Glukose 10% = 10 g/100 mL\n" +
          "• I 250 mL er der (10/100)×250 = 25 g\n\n" +
          "Glukose 50%: 50 g/100 mL = 0.5 g/mL.\n" +
          "Så 20 mL indeholder 10 g.",
      },
      {
        id: "drops",
        // CHANGED: Dråber title uses dr
        title: "Dråber (20 dr = 1 mL)",
        body:
          // CHANGED: dråber -> dr
          "I jeres standard: 20 dr = 1 mL.\n\n" +
          "• mL = dr / 20\n" +
          "• dr = mL × 20\n\n" +
          // CHANGED: dråber/min -> dr/min
          "Hvis du har dr/min → mL/min → mL/time.",
      },
      {
        id: "infusion",
        title: "Infusion og tid (mL/time, mg/time)",
        body:
          "Først: find hastighed i mL/time.\n" +
          "• mL/time = total mL / timer\n\n" +
          "Hvis du skal have dosis pr. tid:\n" +
          "• mg/time = (mg/mL) × (mL/time)\n\n" +
          "Eksempel: 5 mg/mL og 12 mL/time → 60 mg/time.",
      },
    ],
    [],
  );

  const [openSectionId, setOpenSectionId] = useState<string>("");

  return (
    <LinearGradient
      colors={["#0e91a8ff", "#5e6e7eff"]}
      style={styles.homeBackground}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.appTitle,
              { fontSize: headingFont, color: "#f8f9fa" },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Lægemiddelregning
          </Text>

          <Pressable
            style={[styles.smallButton, { borderColor: "#fff" }]}
            onPress={onBackHome}
            hitSlop={8}
          >
            <Text
              style={[
                styles.smallButtonText,
                { color: "#fff", fontSize: buttonFont * 0.9 },
              ]}
            >
              Home
            </Text>
          </Pressable>
        </View>

        <Text
          style={[
            styles.subtitle,
            {
              fontSize: subtitleFont,
              color: "#e9ecef",
              textAlign: "left",
              alignSelf: "flex-start",
            },
          ]}
        >
          Træn doser, styrker, mængder, procent, dr og infusioner.
        </Text>

        {/* PRACTICE */}
        <View style={[styles.statsCard, { alignSelf: "stretch" }]}>
          <Text style={styles.statsSectionTitle}>Opgaver</Text>
          <Text style={[styles.statsLabel, { marginTop: 6 }]}>
            Vælg emner (valgfrit) — eller start med alt.
          </Text>

          <View style={[styles.subtopicRow, { marginTop: 10, marginLeft: 0 }]}>
            <Pressable
              onPress={toggleAll}
              style={[
                styles.topicChip,
                allSelected && styles.topicChipSelected,
              ]}
            >
              <Text
                style={[
                  styles.topicChipText,
                  allSelected && styles.topicChipTextSelected,
                ]}
              >
                {allSelected ? "Fravælg alle" : "Vælg alle"}
              </Text>
            </Pressable>

            {topics.map((t) => (
              <TopicPill
                key={t.id}
                label={t.label}
                subLabel={t.desc}
                selected={selectedPracticeTopicIds.includes(t.id)}
                onPress={() => toggleTopic(t.id)}
              />
            ))}
          </View>

          <Pressable
            style={[
              styles.bigButton,
              styles.primaryButton,
              { backgroundColor: "#1c7ed6", marginTop: 12 },
            ]}
            onPress={() => onStartPractice(selectedPracticeTopicIds)}
          >
            <Text style={[styles.bigButtonText, { fontSize: buttonFont }]}>
              Start opgaver
            </Text>
          </Pressable>
        </View>

        {/* THEORY */}
        <View style={{ height: 14 }} />

        <View
          style={[
            styles.statsCard,
            {
              alignSelf: "stretch",
              backgroundColor: "rgba(0,0,0,0.12)",
            },
          ]}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={[styles.statsSectionTitle, { color: "#f8f9fa" }]}>
              Teori
            </Text>

            {onOpenTheory ? (
              <Pressable onPress={onOpenTheory} hitSlop={8}>
                <Text style={[styles.topicLink, { color: "#e9ecef" }]}>
                  Åbn fuld teori
                </Text>
              </Pressable>
            ) : null}
          </View>

          <Text style={[styles.statsLabel, { color: "#e9ecef", marginTop: 8 }]}>
            Tryk for at folde ud.
          </Text>
        </View>

        <View style={{ marginTop: 10, alignSelf: "stretch" }}>
          {theorySections.map((sec) => {
            const open = openSectionId === sec.id;
            return (
              <Collapsible
                key={sec.id}
                title={sec.title}
                open={open}
                onToggle={() => setOpenSectionId(open ? "" : sec.id)}
              >
                <Text style={styles.drugTheoryText}>{sec.body}</Text>
              </Collapsible>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
