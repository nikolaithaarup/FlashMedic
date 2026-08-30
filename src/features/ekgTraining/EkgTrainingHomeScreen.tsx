import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import {
  Borders,
  ColorTokens,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import { ekgImageLookup } from "../../data/ekg/imageLookup";
import FullscreenEkgImageModal from "../flashcards/components/FullscreenEkgImageModal";
import {
  Accordion,
  Card,
  NavigationCard,
  PrimaryButton,
  ProgressHeader,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";

type Props = {
  onBack: () => void;
  onStartRhythmTrainer: () => void;
  onStartImageDrill: () => void;
  imageDrillCount: number;
  imageDrillLoading: boolean;
};

type StepItem = {
  label: string;
  text: string;
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

const rhythmSteps: StepItem[] = [
  {
    label: "Frekvens",
    text: "Vurder om rytmen er langsom, normal eller hurtig.",
  },
  {
    label: "Regelmæssighed",
    text: "Se om RR-intervallerne er regelmæssige eller uregelmæssige.",
  },
  {
    label: "P-takker",
    text: "Find P-takker, og vurder om de hænger sammen med QRS.",
  },
  {
    label: "PR-interval",
    text: "Vurder om overledningen er normal, forlænget eller varierende.",
  },
  {
    label: "QRS-bredde",
    text: "Skeln mellem smalle og brede komplekser.",
  },
  {
    label: "Rytmeforslag",
    text: "Saml fundene til et sandsynligt rytmeforslag.",
  },
  {
    label: "Ambulancefaglig betydning",
    text: "Kobl rytmen til patientens tilstand og behov for handling.",
  },
];

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
];

const ambulanceFocus = [
  "Patientens kliniske tilstand er vigtigere end rytmen alene.",
  "Se efter tegn på kredsløbspåvirkning som BT-fald, bevidsthedspåvirkning, brystsmerter, dyspnø eller shocktegn.",
  "Skeln mellem monitorrytme og 12-afledning, så du ikke overfortolker et enkelt billede.",
  "Vurder hvornår rytmen ændrer behandlingshastighed eller behov for hjælp.",
  "Overlever rytme, symptomer, vitale værdier, ændringer og given behandling tydeligt.",
];

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function BulletText({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bullet} />
      <Text style={styles.bodyText}>{children}</Text>
    </View>
  );
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
  onStartRhythmTrainer,
  onStartImageDrill,
  imageDrillCount,
  imageDrillLoading,
}: Props) {
  const [view, setView] = useState<"landing" | "method" | "reference">(
    "landing",
  );
  const [methodStep, setMethodStep] = useState(0);
  const [expandedRhythmKey, setExpandedRhythmKey] = useState<string | null>(
    null,
  );
  const [modalImageKey, setModalImageKey] = useState<string | null>(null);
  const modalImageSource = modalImageKey ? ekgImageLookup[modalImageKey] : null;
  const activeMethodStep = rhythmSteps[methodStep];
  const handleBack = () => {
    if (view !== "landing") {
      setView("landing");
      return;
    }
    onBack();
  };

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
          subtitle="Systematisk rytmeanalyse til ambulancefaglig vurdering."
          title="EKG-træning"
        />

        {view === "landing" ? (
          <>
            <Card variant="subtle" style={styles.introCard}>
              <Text style={styles.eyebrow}>BILLEDTRÆNING</Text>
              <Text style={styles.introTitle}>Vurder EKG-billeder</Text>
              <Text style={styles.bodyText}>
                Træn frekvens, regelmæssighed, P-takker, PR-interval,
                QRS-bredde og rytmeforslag.
              </Text>
              <Text style={styles.learningMeta}>
                {imageDrillLoading
                  ? "EKG-billederne hentes."
                  : imageDrillCount > 0
                    ? `${imageDrillCount} EKG-billeder klar til træning`
                    : "Ingen EKG-billeder er tilgængelige lige nu."}
              </Text>
              <PrimaryButton
                disabled={imageDrillLoading || imageDrillCount === 0}
                label="Start billedtræning"
                onPress={onStartImageDrill}
                testID="start-ekg-image-drill-button"
              />
            </Card>
            <Card variant="subtle" style={styles.introCard}>
              <Text style={styles.eyebrow}>GUIDET TRÆNING</Text>
              <Text style={styles.introTitle}>
                Analysér en rytme trin for trin
              </Text>
              <Text style={styles.bodyText}>
                Brug den samme systematik, før du samler fundene til et
                rytmeforslag.
              </Text>
              <PrimaryButton
                label="Start guidet rytmeanalyse"
                onPress={onStartRhythmTrainer}
              />
            </Card>
            <View style={styles.secondaryList}>
              <NavigationCard
                description="Gennemgå de syv analysetrin ét ad gangen."
                eyebrow="METODE"
                onPress={() => {
                  setMethodStep(0);
                  setView("method");
                }}
                title="Lær EKG-metoden"
              />
              <NavigationCard
                description="Akutte rytmer, EKG-tegn og ambulancefokus."
                eyebrow="REFERENCE"
                onPress={() => setView("reference")}
                title="Opslagsværk"
              />
            </View>
          </>
        ) : null}

        {view === "method" && activeMethodStep ? (
          <>
            <ProgressHeader
              current={methodStep + 1}
              label="EKG-METODE"
              total={rhythmSteps.length}
            />
            <Card variant="subtle" style={styles.methodCard}>
              <View style={styles.stepIndex}>
                <Text style={styles.stepIndexText}>{methodStep + 1}</Text>
              </View>
              <Text style={styles.introTitle}>{activeMethodStep.label}</Text>
              <Text style={styles.bodyText}>{activeMethodStep.text}</Text>
            </Card>
            <View style={styles.stepActions}>
              <SecondaryButton
                disabled={methodStep === 0}
                label="Forrige"
                onPress={() =>
                  setMethodStep((current) => Math.max(0, current - 1))
                }
                style={styles.stepAction}
              />
              {methodStep < rhythmSteps.length - 1 ? (
                <PrimaryButton
                  label="Næste trin"
                  onPress={() =>
                    setMethodStep((current) =>
                      Math.min(rhythmSteps.length - 1, current + 1),
                    )
                  }
                  style={styles.stepAction}
                />
              ) : (
                <PrimaryButton
                  label="Se opslagsværk"
                  onPress={() => setView("reference")}
                  style={styles.stepAction}
                />
              )}
            </View>
          </>
        ) : null}

        {view === "reference" ? (
          <>
            <Card variant="subtle" style={styles.sectionCard}>
          <SectionTitle>Rytmer og ledningsfund</SectionTitle>
          <Text style={styles.bodyText}>
            Tryk på en rytme for en kort forklaring. Rytmen skal altid vurderes
            sammen med patientens kliniske tilstand.
          </Text>
          <View style={styles.rhythmList}>
            {acuteRhythms.map((rhythm) => {
              const expanded = expandedRhythmKey === rhythm.key;
              const imageSource = rhythm.exampleImageKey
                ? ekgImageLookup[rhythm.exampleImageKey]
                : null;
              return (
                <Accordion
                  expanded={expanded}
                  key={rhythm.key}
                  onToggle={() =>
                    setExpandedRhythmKey(expanded ? null : rhythm.key)
                  }
                  style={styles.rhythmItem}
                  subtitle={rhythm.shortDefinition}
                  title={rhythm.title}
                >
                    <View style={styles.rhythmPanel}>
                      {rhythm.recognition ? (
                        <>
                          <InfoBlock
                            title="Hvad er det?"
                            text={rhythm.recognition.whatIsIt}
                          />
                          <InfoBlock
                            title="Hvad skal jeg se efter?"
                            text={rhythm.recognition.lookFor}
                          />
                          <InfoBlock
                            title="Nyttige skel"
                            text={rhythm.recognition.distinctions}
                          />
                        </>
                      ) : (
                        <>
                          <InfoBlock title="Fysiologi" text={rhythm.physiology ?? ""} />
                          <InfoBlock
                            title="Patofysiologi"
                            text={rhythm.pathophysiology ?? ""}
                          />
                          <InfoBlock title="EKG-tegn" text={rhythm.ekgClues ?? ""} />
                        </>
                      )}
                      <InfoBlock
                        title="Ambulancefaglig relevans"
                        text={rhythm.ambulanceRelevance}
                      />
                      <InfoBlock
                        title="Typiske faldgruber"
                        text={rhythm.commonPitfalls}
                      />
                      {imageSource && rhythm.exampleImageKey ? (
                        <Pressable
                          accessibilityLabel={`Åbn eksempelbillede for ${rhythm.title}`}
                          accessibilityRole="button"
                          onPress={() => setModalImageKey(rhythm.exampleImageKey ?? null)}
                          style={({ pressed }) => [
                            styles.previewButton,
                            pressed && styles.rhythmPressed,
                          ]}
                        >
                          <Image
                            resizeMode="contain"
                            source={imageSource}
                            style={styles.previewImage}
                          />
                          <Text style={styles.imageHint}>
                            Tryk for at åbne eksempelbilledet
                          </Text>
                        </Pressable>
                      ) : null}
                      {rhythm.sourceNote ? (
                        <Text style={styles.sourceNote}>{rhythm.sourceNote}</Text>
                      ) : null}
                    </View>
                </Accordion>
              );
            })}
          </View>
            </Card>
            <Card variant="subtle" style={styles.sectionCard}>
              <SectionTitle>Ambulancefokus</SectionTitle>
              <View style={styles.bulletList}>
                {ambulanceFocus.map((item) => (
                  <BulletText key={item}>{item}</BulletText>
                ))}
              </View>
            </Card>
          </>
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
  secondaryList: { gap: Spacing.sm },
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
  rhythmList: {
    gap: Spacing.sm,
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
