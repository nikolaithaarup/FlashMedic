import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import {
  Borders,
  ColorTokens,
  Interaction,
  Radii,
  Spacing,
  Typography,
} from "../../../constants/theme";
import { ekgImageLookup } from "../../data/ekg/imageLookup";
import type { Flashcard } from "../../types/Flashcard";
import FullscreenEkgImageModal from "../flashcards/components/FullscreenEkgImageModal";
import {
  Card,
  EmptyState,
  NoticeCard,
  PrimaryButton,
  Screen,
  SecondaryButton,
  ToolPageHeader,
} from "../../ui/primitives";
import {
  buildEkgImageAssessment,
  selectEkgImageDrillCards,
  type EkgImageAssessment,
} from "./ekgImageDrills";

type Props = {
  cards: Flashcard[];
  loadingCards: boolean;
  onBack: () => void;
};

type AssessmentRowProps = {
  label: string;
  value: string;
};

function makeDeckSeed() {
  return `${Date.now()}-${Math.random()}`;
}

function AssessmentRow({ label, value }: AssessmentRowProps) {
  return (
    <View style={styles.assessmentRow}>
      <Text style={styles.assessmentLabel}>{label}</Text>
      <Text style={styles.assessmentValue}>{value}</Text>
    </View>
  );
}

function AssessmentBlock({
  assessment,
}: {
  assessment: EkgImageAssessment;
}) {
  const sourceText =
    assessment.source === "structured"
      ? "Vurderingen bruger struktureret EKG-metadata."
      : "Vurderingen bruger eksisterende flashcard-svar og evt. forklaring. Felter uden metadata er markeret som ikke angivet.";

  return (
    <Card variant="subtle" style={styles.assessmentCard}>
      <Text style={styles.sectionTitle}>Vurdering</Text>
      <Text style={styles.sourceText}>{sourceText}</Text>

      <View style={styles.assessmentList}>
        <AssessmentRow label="Frekvens" value={assessment.rateDescription} />
        <AssessmentRow label="Regelmæssighed" value={assessment.regularity} />
        <AssessmentRow label="P-takker" value={assessment.pWaveDescription} />
        <AssessmentRow label="PR-interval" value={assessment.prDescription} />
        <AssessmentRow label="QRS-bredde" value={assessment.qrsDescription} />
        <AssessmentRow label="Rytmeforslag" value={assessment.likelyRhythm} />
        <AssessmentRow
          label="Ambulancefaglig betydning"
          value={assessment.ambulanceRelevance}
        />
        <AssessmentRow
          label="Typiske faldgruber"
          value={assessment.commonPitfall}
        />
      </View>

      {assessment.explanation ? (
        <View style={styles.explanationBlock}>
          <Text style={styles.explanationLabel}>Forklaring</Text>
          <Text style={styles.bodyText}>{assessment.explanation}</Text>
        </View>
      ) : null}

      <View style={styles.explanationBlock}>
        <Text style={styles.explanationLabel}>Annotationer</Text>
        <Text style={styles.bodyText}>
          Der er ingen billedannotationer til dette kort endnu. Fremtidig
          metadata kan koble markeringer til rytmetrin uden at ændre drillen.
        </Text>
      </View>
    </Card>
  );
}

export function EkgImageDrillScreen({ cards, loadingCards, onBack }: Props) {
  const { width } = useWindowDimensions();
  const [deckSeed, setDeckSeed] = useState(makeDeckSeed);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const deck = useMemo(
    () =>
      selectEkgImageDrillCards(cards, {
        imageLookup: ekgImageLookup,
        seed: deckSeed,
      }),
    [cards, deckSeed],
  );

  const currentCard = currentIndex < deck.length ? deck[currentIndex] : null;
  const assessment = useMemo(
    () => (currentCard ? buildEkgImageAssessment(currentCard) : null),
    [currentCard],
  );
  const imageHeight = Math.min(280, Math.max(170, width * 0.52));
  const isComplete = deck.length > 0 && currentIndex >= deck.length;

  const restartSameOrder = () => {
    setCurrentIndex(0);
    setRevealed(false);
  };

  const reshuffle = () => {
    setDeckSeed(makeDeckSeed());
    setCurrentIndex(0);
    setRevealed(false);
  };

  const goNext = () => {
    setRevealed(false);
    setCurrentIndex((index) => index + 1);
  };

  return (
    <>
      <Screen
        contentContainerStyle={styles.content}
        testID="ekg-image-drill-screen"
      >
        <StatusBar style="light" />
        <ToolPageHeader
          backLabel="Tilbage til EKG-træning"
          onBack={onBack}
          subtitle="Billedbaseret rytmetræning uden scoring."
          title="EKG-billedtræning"
        />

        <NoticeCard title="Uddannelsestræning" tone="info" style={styles.notice}>
          <Text style={styles.noticeText}>
            Brug billedet til at tænke systematisk: frekvens, regelmæssighed,
            P-takker, PR-interval, QRS-bredde og samlet rytmeforslag.
          </Text>
        </NoticeCard>

        {loadingCards ? (
          <Card variant="subtle" style={styles.sectionCard}>
            <EmptyState
              message="Billedkortene hentes fra kortbanken."
              title="Indlæser EKG-billeder"
            />
          </Card>
        ) : deck.length === 0 ? (
          <Card variant="subtle" style={styles.sectionCard}>
            <EmptyState
              message="Der blev ikke fundet EKG-kort med gyldige billednøgler."
              title="Ingen EKG-billeder klar"
            />
            <SecondaryButton label="Tilbage til EKG-træning" onPress={onBack} />
          </Card>
        ) : isComplete ? (
          <Card variant="subtle" style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Runden er færdig</Text>
            <Text style={styles.bodyText}>
              Du har været gennem alle {deck.length} EKG-billeder i denne
              blanding.
            </Text>
            <PrimaryButton label="Bland igen" onPress={reshuffle} />
            <SecondaryButton label="Start forfra" onPress={restartSameOrder} />
            <SecondaryButton label="Tilbage til EKG-træning" onPress={onBack} />
          </Card>
        ) : currentCard && assessment ? (
          <>
            <Card variant="subtle" style={styles.imageCard}>
              <View style={styles.imageHeader}>
                <View style={styles.imageHeaderCopy}>
                  <Text style={styles.eyebrow}>
                    BILLEDE {currentIndex + 1} AF {deck.length}
                  </Text>
                  <Text style={styles.sectionTitle}>
                    {currentCard.imageCaption ?? currentCard.topic ?? "EKG"}
                  </Text>
                  {currentCard.subtopic ? (
                    <Text style={styles.bodyText}>{currentCard.subtopic}</Text>
                  ) : null}
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {currentIndex + 1}/{deck.length}
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityLabel="Åbn EKG-billede i fuld skærm"
                accessibilityRole="button"
                onPress={() => setImageModalVisible(true)}
                style={({ pressed }) => [
                  styles.imageButton,
                  pressed && styles.imagePressed,
                ]}
              >
                <Image
                  resizeMode="contain"
                  source={currentCard.image as any}
                  style={[styles.ekgImage, { height: imageHeight }]}
                />
                <Text style={styles.imageHint}>Tryk for at åbne billedet</Text>
              </Pressable>
            </Card>

            <Card variant="subtle" style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Systematisk gennemgang</Text>
              <Text style={styles.bodyText}>
                Vurder billedet trin for trin, før du viser vurderingen.
              </Text>
              <View style={styles.stepGrid}>
                {[
                  "Frekvens",
                  "Regelmæssighed",
                  "P-takker",
                  "PR-interval",
                  "QRS-bredde",
                  "Rytmeforslag",
                  "Ambulancefaglig betydning",
                ].map((step) => (
                  <View key={step} style={styles.stepChip}>
                    <Text style={styles.stepChipText}>{step}</Text>
                  </View>
                ))}
              </View>
            </Card>

            {revealed ? <AssessmentBlock assessment={assessment} /> : null}

            <View style={styles.buttonStack}>
              {revealed ? (
                <PrimaryButton label="Næste billede" onPress={goNext} />
              ) : (
                <PrimaryButton
                  label="Vis vurdering"
                  onPress={() => setRevealed(true)}
                />
              )}
              <SecondaryButton label="Bland igen" onPress={reshuffle} />
              <SecondaryButton label="Tilbage til EKG-træning" onPress={onBack} />
            </View>
          </>
        ) : null}
      </Screen>

      {currentCard ? (
        <FullscreenEkgImageModal
          imageSource={currentCard.image}
          onClose={() => setImageModalVisible(false)}
          rotate={currentCard.imageOrientation === "rotate-90"}
          visible={imageModalVisible}
        />
      ) : null}
    </>
  );
}

export default EkgImageDrillScreen;

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.xl,
  },
  notice: {
    marginBottom: Spacing.md,
  },
  noticeText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  sectionCard: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  imageCard: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  imageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  imageHeaderCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.heavy,
    letterSpacing: 0.7,
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
  countBadge: {
    minHeight: 34,
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingHorizontal: Spacing.sm,
  },
  countBadgeText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.caption,
    lineHeight: Typography.lineHeights.caption,
    fontWeight: Typography.weights.bold,
  },
  imageButton: {
    borderRadius: Radii.md,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.divider,
    backgroundColor: ColorTokens.surface.inverse,
    overflow: "hidden",
  },
  imagePressed: {
    opacity: Interaction.pressedOpacity,
  },
  ekgImage: {
    width: "100%",
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
  stepGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  stepChip: {
    minHeight: 34,
    justifyContent: "center",
    borderRadius: Radii.control,
    borderWidth: Borders.hairline,
    borderColor: ColorTokens.border.default,
    backgroundColor: ColorTokens.surface.inverse,
    paddingHorizontal: Spacing.sm,
  },
  stepChipText: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.semibold,
  },
  assessmentCard: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  sourceText: {
    color: ColorTokens.accent.muted,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
  },
  assessmentList: {
    borderTopWidth: Borders.hairline,
    borderTopColor: ColorTokens.border.divider,
  },
  assessmentRow: {
    gap: Spacing.xs,
    borderBottomWidth: Borders.hairline,
    borderBottomColor: ColorTokens.border.divider,
    paddingVertical: Spacing.sm,
  },
  assessmentLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  assessmentValue: {
    color: ColorTokens.text.secondary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeights.body,
  },
  explanationBlock: {
    gap: Spacing.xs,
  },
  explanationLabel: {
    color: ColorTokens.text.primary,
    fontFamily: Typography.families.sans,
    fontSize: Typography.sizes.label,
    lineHeight: Typography.lineHeights.label,
    fontWeight: Typography.weights.bold,
  },
  buttonStack: {
    gap: Spacing.sm,
  },
});
