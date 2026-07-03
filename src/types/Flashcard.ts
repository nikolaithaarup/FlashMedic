import type { ImageSourcePropType } from "react-native";
import type {
  CardKind,
  ContentReviewStatus,
  FlashcardMedia,
  ScenarioVitals,
  SourceReference,
} from "./Learning";

export type Difficulty = "easy" | "medium" | "hard";

export type Flashcard = {
  id: string;

  subject: string;       // fx "Akutte tilstande", "EKG"
  topic?: string;
  subtopic?: string;

  question: string;
  answer: string;
  difficulty: Difficulty;

  tags?: string[];
  explanation?: string;

  // image support
  imageKey?: string;              // JSON-safe key
  image?: ImageSourcePropType;    // actual require() image
  imageCaption?: string;
  imageOrientation?: "portrait" | "landscape" | "rotate-90";

  schemaVersion?: 1 | 2;
  kind?: CardKind;
  learningObjectiveId?: string;
  rationale?: string;
  commonMistakes?: string[];
  prehospitalRelevance?: string;
  examTip?: string;
  redFlag?: string;
  references?: SourceReference[];
  media?: FlashcardMedia;
  scenario?: {
    presentation: string;
    ageGroup?: "child" | "adult" | "older-adult" | "pregnant";
    history?: string[];
    vitals?: ScenarioVitals;
  };
  reviewStatus?: ContentReviewStatus;
  reviewedAt?: string;
  contentRevision?: number;
};

export type FlashcardV2 = Flashcard & { schemaVersion: 2 };
