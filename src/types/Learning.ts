export type ContentReviewStatus = "draft" | "reviewed" | "retired";
export type CardKind = "recall" | "applied" | "scenario" | "media";

export interface SourceReference {
  title: string;
  publisher?: string;
  url?: string;
  editionOrDate?: string;
  accessedAt?: string;
  note?: string;
}

export interface FlashcardMedia {
  kind: "image" | "ekg";
  imageKey: string;
  altText: string;
  caption?: string;
  orientation?: "portrait" | "landscape" | "rotate-90";
  sourceNote?: string;
  licenseNote?: string;
  annotatedImageKey?: string;
}

export interface ScenarioVitals {
  pulse?: number;
  systolicBp?: number;
  diastolicBp?: number;
  respiratoryRate?: number;
  spo2?: number;
  temperatureC?: number;
  gcs?: number;
  bloodGlucoseMmolL?: number;
  freeText?: string[];
}

export interface LearningObjective {
  id: string;
  subject: string;
  topic: string;
  subtopic?: string;
  title: string;
  description?: string;
  priority: "core" | "important" | "advanced";
  tags: string[];
  reviewStatus: ContentReviewStatus;
}

export interface TaxonomyTopic {
  id: string;
  label: string;
  subtopics?: readonly { id: string; label: string }[];
}

export interface TaxonomySubject {
  id: string;
  label: string;
  topics: readonly TaxonomyTopic[];
}

const topics = (labels: readonly string[]): TaxonomyTopic[] =>
  labels.map((label) => ({
    id: label
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    label,
  }));

export const CONTENT_TAXONOMY: readonly TaxonomySubject[] = [
  { id: "akutte-tilstande", label: "Akutte tilstande", topics: topics(["Akut abdomen", "Akut binyrebarkinsufficiens", "Akut cerebral apopleksi", "Akut koronart syndrom", "Akutte obstetriske tilstande", "Anafylaksi", "Aortaaneurisme", "Diabetes mellitus", "Ebola og blødningsfebervirus", "Forgiftninger", "Grovreponering", "Hjertestop", "Hovedtraume", "Kramper", "Meningitis og meningokoksyndrom", "Tonsillektomi efterblødning"]) },
  { id: "anatomi-fysiologi", label: "Anatomi og fysiologi", topics: topics(["Bevægeapparatet", "Celler og væv", "Endokrine system", "Fordøjelse", "Graviditet", "Kredsløb", "Nervesystemet", "Nyrer og væskebalance", "Respiration"]) },
  { id: "ekg", label: "EKG", topics: topics(["Avancerede diagnoser", "Billeder", "Grundlæggende EKG"]) },
  { id: "farmakologi", label: "Farmakologi", topics: topics(["Administration", "Bivirkninger", "Farmakodynamik", "Farmakokinetik", "Lægemiddelregning"]) },
  { id: "kliniske-parametre", label: "Kliniske parametre", topics: topics(["Cirkulation, perfusion & acidose/alkalose", "Differentialdiagnoser", "Farmakologi & sepsis", "Infektion & neurologi", "Klinisk integration", "Shock", "VGAS, CRP og blodprøver"]) },
  { id: "korekort", label: "Kørekort", topics: topics(["Lastbil", "Taxa/chauffør", "Udrykningskørsel"]) },
  { id: "mikrobiologi", label: "Mikrobiologi", topics: topics(["Bakterier", "Sepsis og immunrespons", "Smitteveje og isolation", "Svampe og parasitter", "Virus"]) },
  { id: "psykologi", label: "Psykologi", topics: topics(["Angst", "Grupper, Kultur og Magt", "Identitet og Udviklingspsykologi", "Krise og Sorg", "Læring og Motivation", "Stress og Coping"]) },
  { id: "sygdomslaere", label: "Sygdomslære", topics: topics(["Akut medicin", "Endokrinologi", "Gastroenterologi", "Geriatri", "Hjertesygdomme", "Hæmatologi", "Infektion", "Introduktion", "Karsygdomme", "Lungesygdomme", "Neurologi", "Nyrer og urinveje", "Pædiatri"]) },
  { id: "traumatologi-itls", label: "Traumatologi og ITLS", topics: topics(["ITLS Primary Survey", "Sekundær vurdering og kliniske beslutninger", "Shock og cirkulation i traume", "Skademekanisme & energi", "Thoraxtraumer", "Traumatisk hjerneskade og neurologi", "Traumatisk hjertestop"]) },
] as const;

export const LEARNING_OBJECTIVES: readonly LearningObjective[] =
  CONTENT_TAXONOMY.flatMap((subject) =>
    subject.topics.map((topic) => {
      const id = `lo.${subject.id}.${topic.id}.grundlag`;
      const reviewed = id === "lo.anatomi-fysiologi.respiration.grundlag" ||
        id === "lo.anatomi-fysiologi.nervesystemet.grundlag" ||
        id === "lo.kliniske-parametre.shock.grundlag" ||
        id === "lo.kliniske-parametre.differentialdiagnoser.grundlag" ||
        id === "lo.sygdomslaere.lungesygdomme.grundlag" ||
        id === "lo.traumatologi-itls.traumatisk-hjerneskade-og-neurologi.grundlag";
      return {
      id,
      subject: subject.label,
      topic: topic.label,
      title: reviewed ? `Vurdér og forklar ${topic.label.toLowerCase()} præhospitalt` : `Forstå grundlaget i ${topic.label}`,
      description: reviewed ? "Anvend ABCDE, kliniske fund og udvikling over tid til at begrunde en sikker præhospital vurdering." : undefined,
      priority: "core" as const,
      tags: [subject.id, topic.id],
      reviewStatus: reviewed ? "reviewed" as const : "draft" as const,
    };}),
  );

export function findTaxonomySubject(label: string): TaxonomySubject | undefined {
  return CONTENT_TAXONOMY.find((subject) => subject.label === label);
}

export function findTaxonomyTopic(
  subjectLabel: string,
  topicLabel: string,
): TaxonomyTopic | undefined {
  return findTaxonomySubject(subjectLabel)?.topics.find(
    (topic) => topic.label === topicLabel,
  );
}
