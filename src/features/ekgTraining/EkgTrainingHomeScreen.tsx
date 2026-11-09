import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import { EkgRhythmGameScreen } from "./game/EkgRhythmGameScreen";
import { ekgImageLookup } from "../../data/ekg/imageLookup";
import { additionalEkgReferences } from "./ekgReferenceExtras";
import FullscreenEkgImageModal from "../flashcards/components/FullscreenEkgImageModal";
import {
  Accordion,
  NavigationCard,
  Screen,
  ToolPageHeader,
} from "../../ui/primitives";

type Props = {
  onBack: () => void;
  onStartRhythmTrainer: () => void;
  onStartImageDrill: () => void;
  imageDrillCount: number;
  imageDrillLoading: boolean;
};

type AcuteRhythmInfo = {
  key: string;
  title: string;
  shortDefinition: string;
  physiology?: string;
  pathophysiology?: string;
  ekgClues?: string;
  recognition?: {
    whatIsIt: string;
    lookFor: string;
    distinctions: string;
  };
  ambulanceRelevance: string;
  commonPitfalls: string;
  exampleImageKey?: string;
  sourceNote?: string;
};

const acuteRhythms: AcuteRhythmInfo[] = [
  {
    key: "vf",
    title: "VF",
    shortDefinition: "Kaotisk ventrikulær elektrisk aktivitet uden effektivt hjerteminutvolumen.",
    physiology: "Ventriklerne aktiveres ukoordineret i stedet for at lave et samlet pumpeslag.",
    pathophysiology: "Den elektriske uro betyder, at der ikke dannes organiserede QRS-komplekser eller effektiv cirkulation.",
    ekgClues: "Uorganiseret, kaotisk kurve uden genkendelige P-takker eller QRS-komplekser.",
    ambulanceRelevance: "En umiddelbart kritisk rytmebeskrivelse; patientens kliniske tilstand og pulsvurdering er afgørende.",
    commonPitfalls: "Artefakt eller løs elektrode kan ligne kaos. Tjek altid patient, elektroder og signal.",
    exampleImageKey: "ekg_img_vf_1",
  },
  {
    key: "vt",
    title: "VT",
    shortDefinition: "Hurtig bredkomplekset rytme fra ventrikulær oprindelse eller behandlet som farlig, indtil andet er sikkert.",
    physiology: "Ventriklerne styrer rytmen, så depolarisationen bliver bredere og mindre effektiv.",
    pathophysiology: "Kan opstå ved irritabelt eller iskæmisk myokardium og kan hurtigt påvirke cirkulationen.",
    ekgClues: "Hurtig rytme med brede QRS-komplekser; P-takker er ofte ikke sikre.",
    ambulanceRelevance: "Kan være med eller uden puls og kan forværres hurtigt. Patientens stabilitet er central.",
    commonPitfalls: "At antage at en bred takykardi er ufarlig SVT med aberration uden at tænke mulig VT.",
    exampleImageKey: "ekg_img_monomorphic_vt_1",
  },
  {
    key: "asystole",
    title: "Asystoli",
    shortDefinition: "Fravær af genkendelig elektrisk hjerteaktivitet på monitor/EKG.",
    physiology: "Der ses ingen organiseret elektrisk aktivering, der kan udløse pumpeslag.",
    pathophysiology: "Rytmebilledet er ekstremt alvorligt, men skal altid holdes op mod teknik og patient.",
    ekgClues: "Næsten flad linje uden sikre P-takker eller QRS-komplekser.",
    ambulanceRelevance: "Ekstremt alvorlig rytmebeskrivelse; undgå at forveksle teknisk svigt med asystoli.",
    commonPitfalls: "Løse elektroder, lav gain eller forkert visning kan give falsk indtryk af asystoli.",
  },
  {
    key: "pea",
    title: "PEA",
    shortDefinition: "Organiseret elektrisk aktivitet uden palpabel puls.",
    physiology: "Hjertets elektriske aktivitet kan se organiseret ud, men mekanisk cirkulation mangler.",
    pathophysiology: "Problemet er ikke kun rytmen; årsagen ligger ofte i en underliggende kritisk tilstand.",
    ekgClues: "Kan ligne organiseret rytme på monitor, men patienten har ingen effektiv puls.",
    ambulanceRelevance: "Rytmen alene kan være misvisende. Klinisk vurdering af puls og cirkulation er afgørende.",
    commonPitfalls: "At tro at en organiseret monitorrytme betyder, at patienten har cirkulation.",
  },
  {
    key: "svt",
    title: "SVT",
    shortDefinition: "Regelmæssig smalkomplekset takykardi, ofte med meget høj frekvens.",
    physiology: "Rytmen udgår over ventriklerne og ledes typisk hurtigt gennem AV-systemet.",
    pathophysiology: "Høj frekvens kan reducere fyldningstid og give symptomer hos påvirkede patienter.",
    ekgClues: "Regelmæssig hurtig rytme, smalt QRS og P-takker der ofte er skjulte.",
    ambulanceRelevance: "Vurder stabilitet, symptomer og påvirkning. Fokuser ikke kun på frekvensen.",
    commonPitfalls: "At overse patientens kliniske tilstand eller at glemme QRS-bredden i vurderingen.",
    exampleImageKey: "ekg_img_svt_1",
  },
  {
    key: "bradycardia",
    title: "Bradykardi",
    shortDefinition: "Langsom rytme, som kan være ufarlig eller alvorlig afhængigt af perfusion og symptomer.",
    physiology: "Hjertet aktiveres langsomt, men rytmens betydning afhænger af om minutvolumen er tilstrækkeligt.",
    pathophysiology: "Kan skyldes normal variation, medicin, iskæmi, ledningsforstyrrelse eller anden påvirkning.",
    ekgClues: "Lav frekvens; se samtidig efter P-takker, PR-interval, QRS-bredde og pauser.",
    ambulanceRelevance: "Se efter hypotension, bevidsthedspåvirkning, brystsmerter, dyspnø eller shocktegn.",
    commonPitfalls: "At reagere på frekvensen alene uden at vurdere patientens perfusion.",
    exampleImageKey: "ekg_img_sinus_brady_1deg_av",
  },
  {
    key: "av-block",
    title: "AV-blok",
    shortDefinition: "Forsinket eller afbrudt ledning mellem atrier og ventrikler.",
    physiology: "Impulser fra atrierne når ventriklerne langsomt, sporadisk eller slet ikke afhængigt af bloktype.",
    pathophysiology: "Højgradige blok kan give langsom ventrikelfrekvens og dårlig perfusion.",
    ekgClues: "PR-forlængelse, droppede QRS-komplekser eller AV-dissociation afhængigt af typen.",
    ambulanceRelevance: "Vurder frekvens, symptomer, blodtryk og bevidsthed. Højgradige blok kan forværres.",
    commonPitfalls: "At kalde alle langsomme rytmer sinusbradykardi uden at undersøge P-QRS relationen.",
    exampleImageKey: "ekg_img_complete_heart_block",
  },
  {
    key: "lbbb",
    title: "Venstresidigt grenblok (LBBB)",
    shortDefinition:
      "Forsinket aktivering gennem venstre gren med bredt QRS og et karakteristisk, men variabelt, ledningsmønster.",
    recognition: {
      whatIsIt:
        "Ved LBBB aktiveres venstre ventrikel forsinket. Det ændrer QRS-morfologien og giver sekundære repolarisationsforandringer.",
      lookFor:
        "Se efter bredt QRS. Hvor mønstret er typisk, kan der være brede eller hakkede overvejende positive komplekser lateralt, overvejende negativ morfologi højreprækordialt og ST-T-forandringer modsat QRS-hovedretningen.",
      distinctions:
        "LBBB og RBBB adskilles på morfologien, ikke kun QRS-bredden. Bredt QRS er heller ikke automatisk VT: vurder frekvens, regelmæssighed og P-QRS relation. Ved samtidig AF bevares både den uregelmæssige atrierytme og LBBB-fundet.",
    },
    ambulanceRelevance:
      "Beskriv QRS-bredde, sandsynligt mønster, symptomer og om fundet er kendt fra tidligere EKG. Sammenhold altid med klinik og øvrige 12-afledningsfund.",
    commonPitfalls:
      "At gøre morfologien til en absolut skabelon, overse den underliggende rytme eller tolke sekundære ST-T-forandringer uden grenblokkontekst.",
    exampleImageKey: "ekg_img_lbbb_1",
  },
  {
    key: "rbbb",
    title: "Højresidigt grenblok (RBBB)",
    shortDefinition:
      "Forsinket aktivering gennem højre gren med bredt QRS og terminale højresidige ledningsfund, hvor de er til stede.",
    recognition: {
      whatIsIt:
        "Ved RBBB aktiveres højre ventrikel forsinket, mens den underliggende rytme fortsat skal analyseres uafhængigt.",
      lookFor:
        "Se efter bredt QRS. Hvor mønstret er typisk, kan der ses terminal positivitet eller rSR'-lignende morfologi højreprækordialt, bred eller sløret terminal S-tak lateralt og sekundære repolarisationsforandringer.",
      distinctions:
        "RBBB adskilles fra LBBB ved morfologien. Ved bredkomplekset takykardi må RBBB-udseende ikke få mulig VT til at blive afvist. Når LAFB også er angivet, bevares begge ledningsfund og aksemønstret vurderes særskilt.",
    },
    ambulanceRelevance:
      "Beskriv QRS-bredde, sandsynligt RBBB-mønster, symptomer og samtidige ledningsfund. Sammenlign med tidligere EKG, hvis det er tilgængeligt.",
    commonPitfalls:
      "At bruge rSR'-udseende alene som diagnose, overse laterale terminale S-takker eller reducere RBBB med LAFB til rent RBBB.",
    exampleImageKey: "ekg_img_rbbb",
  },
  ...additionalEkgReferences,
];

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.infoBlock}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.bodyText}>{text}</Text>
    </View>
  );
}

export function EkgTrainingHomeScreen({
  onBack,
  onStartImageDrill,
  imageDrillCount,
  imageDrillLoading,
}: Props) {
  const [view, setView] = useState<"landing" | "reference" | "game">(
    "landing",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRhythmKey, setExpandedRhythmKey] = useState<string | null>(
    null,
  );
  const [modalImageKey, setModalImageKey] = useState<string | null>(null);
  const modalImageSource = modalImageKey ? ekgImageLookup[modalImageKey] : null;
  const visibleRhythms = acuteRhythms
    .filter((rhythm) =>
      `${rhythm.title} ${rhythm.shortDefinition}`.toLocaleLowerCase("da-DK").includes(searchQuery.trim().toLocaleLowerCase("da-DK")),
    )
    .sort((a, b) => a.title.localeCompare(b.title, "da-DK"));
  const handleBack = () => {
    if (view !== "landing") {
      setView("landing");
      return;
    }
    onBack();
  };

  if (view === "game") {
    return <EkgRhythmGameScreen onBack={() => setView("landing")} />;
  }

  return (
    <>
      <Screen contentContainerStyle={styles.content} testID="ekg-training-screen">
        <StatusBar style="light" />
        <ToolPageHeader
          backLabel={
            view === "landing"
              ? "Tilbage til forsiden"
              : "Tilbage til EKG-træning"
          }
          onBack={handleBack}
          title="EKG-træning"
        />

        {view === "landing" ? (
          <View style={styles.secondaryList}>
            <NavigationCard
              onPress={() => setView("game")}
              style={styles.destinationCard}
              title="Rytmespil"
            />
            <NavigationCard
              disabled={imageDrillLoading || imageDrillCount === 0}
              onPress={onStartImageDrill}
              style={styles.destinationCard}
              testID="start-ekg-image-drill-button"
              title="EKG-analyse"
            />
            <NavigationCard
              onPress={() => setView("reference")}
              style={styles.destinationCard}
              title="Opslagsværk"
            />
          </View>
        ) : null}

        {view === "reference" ? (
          <View style={styles.referenceSection}>
            <SectionTitle>Rytmer og ledningsfund</SectionTitle>
            <TextInput
              accessibilityLabel="Søg i EKG-opslagsværket"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setSearchQuery}
              placeholder="Søg efter rytme eller fund"
              placeholderTextColor="#91afb4"
              style={styles.searchInput}
              value={searchQuery}
            />
            <View style={styles.rhythmList}>
              {visibleRhythms.map((rhythm) => {
                const expanded = expandedRhythmKey === rhythm.key;
                const imageSource = rhythm.exampleImageKey
                  ? ekgImageLookup[rhythm.exampleImageKey]
                  : null;
                return (
                  <Accordion
                    expanded={expanded}
                    key={rhythm.key}
                    onToggle={() => setExpandedRhythmKey(expanded ? null : rhythm.key)}
                    style={styles.rhythmItem}
                    title={rhythm.title}
                  >
                    <View style={styles.rhythmPanel}>
                      <Text style={styles.bodyText}>{rhythm.shortDefinition}</Text>
                      {rhythm.recognition ? (
                        <>
                          <InfoBlock title="Hvad er det?" text={rhythm.recognition.whatIsIt} />
                          <InfoBlock title="EKG-tegn" text={rhythm.recognition.lookFor} />
                          <InfoBlock title="Skelnen" text={rhythm.recognition.distinctions} />
                        </>
                      ) : (
                        <>
                          {rhythm.physiology ? <InfoBlock title="Fysiologi" text={rhythm.physiology} /> : null}
                          {rhythm.pathophysiology ? <InfoBlock title="Patofysiologi" text={rhythm.pathophysiology} /> : null}
                          {rhythm.ekgClues ? <InfoBlock title="EKG-tegn" text={rhythm.ekgClues} /> : null}
                        </>
                      )}
                      <InfoBlock title="Præhospital betydning" text={rhythm.ambulanceRelevance} />
                      <InfoBlock title="Faldgrube" text={rhythm.commonPitfalls} />
                      {imageSource && rhythm.exampleImageKey ? (
                        <Pressable
                          accessibilityLabel={`Åbn eksempel-EKG for ${rhythm.title}`}
                          accessibilityRole="button"
                          onPress={() => setModalImageKey(rhythm.exampleImageKey ?? null)}
                          style={({ pressed }) => [styles.previewButton, pressed && styles.rhythmPressed]}
                        >
                          <Image resizeMode="contain" source={imageSource} style={styles.previewImage} />
                          <Text style={styles.imageHint}>Tryk for at forstørre EKG</Text>
                        </Pressable>
                      ) : null}
                      {rhythm.sourceNote ? <Text style={styles.sourceNote}>{rhythm.sourceNote}</Text> : null}
                    </View>
                  </Accordion>
                );
              })}
              {visibleRhythms.length === 0 ? (
                <Text style={styles.bodyText}>Ingen fund matcher søgningen.</Text>
              ) : null}
            </View>
          </View>
        ) : null}
      </Screen>

      {modalImageSource ? (
        <FullscreenEkgImageModal
          imageSource={modalImageSource}
          onClose={() => setModalImageKey(null)}
          rotate={false}
          visible={!!modalImageSource}
        />
      ) : null}
    </>
  );
}

export default EkgTrainingHomeScreen;

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.xl,
  },
  introCard: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  sectionCard: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  secondaryList: { flexDirection: "column", width: "100%", gap: Spacing.sm },
  destinationCard: { width: "100%" },
  methodCard: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    alignItems: "flex-start",
  },
  stepActions: { flexDirection: "row", gap: Spacing.sm },
  stepAction: { flex: 1 },
  eyebrow: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.7,
  },
  introTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.cardTitle,
    lineHeight: Typography.lineHeights.cardTitle,
    fontWeight: Typography.weights.bold,
  },
  sectionTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.sectionTitle,
    lineHeight: Typography.lineHeights.sectionTitle,
    fontWeight: Typography.weights.bold,
  },
  bodyText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  stepList: {
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
  stepRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "flex-start",
  },
  stepIndex: {
    width: 30,
    height: 30,
    borderRadius: Radii.circular,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorTokens.surface.subtle,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
  },
  stepIndexText: {
    color: ColorTokens.accent.default,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
  },
  stepCopy: {
    flex: 1,
    minWidth: 0,
  },
  stepLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  stepText: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    marginTop: 2,
  },
  learningMeta: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  referenceSection: { width: "100%", gap: Spacing.sm },
  searchInput: { height: 48, borderRadius: 11, borderWidth: 1, borderColor: ColorTokens.border.default, color: ColorTokens.text.primary, backgroundColor: ColorTokens.surface.inverse, paddingHorizontal: Spacing.md, fontFamily: Typography.families.sans, fontSize: Typography.sizes.body },
  rhythmList: {    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  rhythmItem: {
    width: "100%",
  },
  rhythmPressed: {
    opacity: 0.88,
  },
  rhythmPanel: {
    gap: Spacing.md,
  },
  infoBlock: {
    gap: Spacing.xs,
  },
  infoTitle: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  previewButton: {
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.divider,
    backgroundColor: ColorTokens.surface.inverse,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 150,
    backgroundColor: ColorTokens.surface.inverse,
  },
  imageHint: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    textAlign: "center",
  },
  sourceNote: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
  },
  bulletList: {
    gap: Spacing.sm,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: Radii.circular,
    backgroundColor: ColorTokens.accent.muted,
    marginTop: 8,
  },
});
