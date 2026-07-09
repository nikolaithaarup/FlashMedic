import type { ImageSourcePropType } from "react-native";

import type { Flashcard } from "../../types/Flashcard";

export type EkgAnnotationStep =
  | "rate"
  | "regularity"
  | "pWaves"
  | "prInterval"
  | "qrsWidth"
  | "rhythm"
  | "clinicalMeaning";

export type EkgImageAnnotation = {
  annotationId: string;
  label: string;
  description?: string;
  target: {
    type: "point" | "box" | "interval" | "wave" | "complex";
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  relatedStep?: EkgAnnotationStep;
};

export type EkgStructuredAssessment = {
  rateDescription?: string;
  regularity?: string;
  pWaveDescription?: string;
  prDescription?: string;
  qrsDescription?: string;
  likelyRhythm?: string;
  ambulanceRelevance?: string;
  commonPitfall?: string;
  explanation?: string;
  annotations?: EkgImageAnnotation[];
};

export type EkgImageDrillCard = Flashcard & {
  imageKey: string;
  image: ImageSourcePropType;
};

export type EkgImageAssessment = {
  source: "structured" | "flashcard-fallback";
  rateDescription: string;
  regularity: string;
  pWaveDescription: string;
  prDescription: string;
  qrsDescription: string;
  likelyRhythm: string;
  ambulanceRelevance: string;
  commonPitfall: string;
  explanation?: string;
  annotations: EkgImageAnnotation[];
};

type SelectOptions = {
  imageLookup?: Record<string, ImageSourcePropType>;
  seed?: string | number;
};

const missingStructuredField = "Ikke angivet i nuværende kortmetadata.";
const genericAmbulanceRelevance =
  "Sammenhold rytmefundet med patientens symptomer, vitale værdier og udvikling, og overlever fundet tydeligt.";

function getSeedValue(seed: string | number) {
  const input = String(seed);
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: string | number) {
  let state = getSeedValue(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getImageSource(
  card: Flashcard,
  imageLookup: Record<string, ImageSourcePropType>,
) {
  const key = card.imageKey?.trim();
  if (!key) return null;
  return card.image ?? imageLookup[key] ?? null;
}

function isEkgImageFocusedCard(card: Flashcard) {
  const subject = card.subject?.trim().toLowerCase();
  const topic = card.topic?.trim().toLowerCase();
  const tags = card.tags?.map((tag) => tag.trim().toLowerCase()) ?? [];
  return (
    subject === "ekg" &&
    (topic === "billeder" ||
      tags.includes("billede") ||
      card.kind === "media" ||
      card.media?.kind === "ekg" ||
      card.media?.kind === "image")
  );
}

export function shuffleEkgImageDrillCards<T>(
  cards: T[],
  seed: string | number = `${Date.now()}-${Math.random()}`,
) {
  const random = seededRandom(seed);
  const copy = [...cards];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function buildEkgImageDrillPool(
  cards: Flashcard[],
  options: Pick<SelectOptions, "imageLookup"> = {},
) {
  const imageLookup = options.imageLookup ?? {};
  const seenIds = new Set<string>();
  const pool: EkgImageDrillCard[] = [];

  for (const card of cards) {
    if (!card.id || seenIds.has(card.id)) continue;
    if (!isEkgImageFocusedCard(card)) continue;
    const imageKey = card.imageKey?.trim();
    if (!imageKey) continue;
    const image = getImageSource(card, imageLookup);
    if (!image) continue;
    seenIds.add(card.id);
    pool.push({ ...card, imageKey, image });
  }

  return pool;
}

export function selectEkgImageDrillCards(
  cards: Flashcard[],
  options: SelectOptions = {},
) {
  return shuffleEkgImageDrillCards(
    buildEkgImageDrillPool(cards, options),
    options.seed,
  );
}

function getStructuredAssessment(card: Flashcard) {
  return (card as Flashcard & { ekgAssessment?: EkgStructuredAssessment })
    .ekgAssessment;
}

export function buildEkgImageAssessment(
  card: Flashcard,
): EkgImageAssessment {
  const structured = getStructuredAssessment(card);
  if (structured) {
    return {
      source: "structured",
      rateDescription: structured.rateDescription ?? missingStructuredField,
      regularity: structured.regularity ?? missingStructuredField,
      pWaveDescription: structured.pWaveDescription ?? missingStructuredField,
      prDescription: structured.prDescription ?? missingStructuredField,
      qrsDescription: structured.qrsDescription ?? missingStructuredField,
      likelyRhythm: structured.likelyRhythm ?? card.answer,
      ambulanceRelevance:
        structured.ambulanceRelevance ?? genericAmbulanceRelevance,
      commonPitfall:
        structured.commonPitfall ?? "Ingen specifik faldgrube angivet endnu.",
      explanation:
        structured.explanation ??
        card.explanation ??
        card.rationale ??
        undefined,
      annotations: structured.annotations ?? [],
    };
  }

  return {
    source: "flashcard-fallback",
    rateDescription: missingStructuredField,
    regularity: missingStructuredField,
    pWaveDescription: missingStructuredField,
    prDescription: missingStructuredField,
    qrsDescription: missingStructuredField,
    likelyRhythm: card.answer,
    ambulanceRelevance:
      card.prehospitalRelevance ?? genericAmbulanceRelevance,
    commonPitfall:
      card.commonMistakes?.[0] ?? "Ingen specifik faldgrube angivet endnu.",
    explanation: card.explanation ?? card.rationale ?? undefined,
    annotations: [],
  };
}

export function isPercentageAnnotation(annotation: EkgImageAnnotation) {
  const { x, y, width, height } = annotation.target;
  const values = [x, y, width, height].filter(
    (value): value is number => typeof value === "number",
  );
  return values.every((value) => value >= 0 && value <= 100);
}
