import type { EkgImageAnnotation } from "./ekgImageDrills";

export type EkgAssessmentStep =
  | "rate"
  | "regularity"
  | "pWaves"
  | "prInterval"
  | "qrsWidth"
  | "rhythm"
  | "clinicalMeaning";

export type EkgStepOption = {
  id: string;
  label: string;
};

export type EkgStepAssessment = {
  step: EkgAssessmentStep;
  correctOptionId: string;
  explanation: string;
};

export type EkgInteractiveAssessment = {
  cardId: string;
  imageKey?: string;
  title: string;
  rhythmName: string;
  steps: Record<EkgAssessmentStep, EkgStepAssessment>;
  keyFindings: string[];
  commonPitfall?: string;
  ambulanceRelevance: string;
  sourceNote?: string;
  annotations?: EkgImageAnnotation[];
};

export const ekgStepLabels: Record<EkgAssessmentStep, string> = {
  rate: "Frekvens",
  regularity: "Regelmæssighed",
  pWaves: "P-takker",
  prInterval: "PR-interval",
  qrsWidth: "QRS-bredde",
  rhythm: "Gæt rytmen",
  clinicalMeaning: "Ambulancefaglig betydning",
};

export const ekgAssessmentStepOrder: EkgAssessmentStep[] = [
  "rate",
  "regularity",
  "pWaves",
  "prInterval",
  "qrsWidth",
  "rhythm",
  "clinicalMeaning",
];

export const ekgStepOptions: Record<EkgAssessmentStep, EkgStepOption[]> = {
  rate: [
    { id: "slow", label: "Langsom / bradykard" },
    { id: "normal", label: "Normal frekvens" },
    { id: "fast", label: "Hurtig / takykard" },
    { id: "uncertain", label: "Kan ikke vurderes sikkert" },
  ],
  regularity: [
    { id: "regular", label: "Regelmæssig" },
    { id: "irregular", label: "Uregelmæssig" },
    { id: "irregularly-irregular", label: "Uregelmæssigt uregelmæssig" },
    { id: "uncertain", label: "Kan ikke vurderes sikkert" },
  ],
  pWaves: [
    { id: "visible-before-qrs", label: "Synlige P-takker før hvert QRS" },
    { id: "none-clear", label: "Ingen sikre P-takker" },
    { id: "more-p-than-qrs", label: "Flere P-takker end QRS-komplekser" },
    { id: "variable-relation", label: "P-takker ses, men relationen varierer" },
    { id: "uncertain", label: "Kan ikke vurderes sikkert" },
  ],
  prInterval: [
    { id: "normal", label: "Normalt" },
    { id: "prolonged", label: "Forlænget" },
    { id: "variable", label: "Varierende" },
    { id: "not-assessable", label: "Ikke relevant / kan ikke vurderes" },
  ],
  qrsWidth: [
    { id: "narrow", label: "Smalt QRS" },
    { id: "wide", label: "Bredt QRS" },
    { id: "uncertain", label: "Kan ikke vurderes sikkert" },
  ],
  rhythm: [
    { id: "sinus-rhythm", label: "Sinusrytme" },
    { id: "sinus-bradycardia", label: "Sinusbradykardi" },
    { id: "sinus-tachycardia", label: "Sinustakykardi" },
    { id: "atrial-fibrillation", label: "Atrieflimren" },
    { id: "atrial-flutter", label: "Atrieflagren" },
    { id: "svt", label: "SVT" },
    { id: "ventricular-tachycardia", label: "Ventrikulær takykardi" },
    { id: "ventricular-fibrillation", label: "Ventrikelflimren" },
    { id: "asystole", label: "Asystoli" },
    { id: "pea", label: "PEA / organiseret rytme uden puls" },
    { id: "first-degree-av-block", label: "1. grads AV-blok" },
    { id: "mobitz-i", label: "2. grads AV-blok type I" },
    { id: "mobitz-ii", label: "2. grads AV-blok type II" },
    { id: "third-degree-av-block", label: "3. grads AV-blok" },
    { id: "wide-complex-tachycardia", label: "Bredkomplekset takykardi" },
    { id: "narrow-complex-tachycardia", label: "Smalkomplekset takykardi" },
    { id: "extrasystoles", label: "Ekstrasystoler" },
    { id: "stemi-pattern", label: "STEMI-mønster" },
    { id: "not-enough-information", label: "Ikke nok information" },
  ],
  clinicalMeaning: [
    { id: "not-acute-alone", label: "Ikke akut rytme i sig selv, vurder patienten" },
    { id: "potentially-unstable", label: "Potentielt ustabil rytme" },
    { id: "life-threatening", label: "Livstruende rytme" },
    {
      id: "rapid-assessment",
      label: "Kræver hurtig klinisk vurdering/eskalation",
    },
    {
      id: "needs-12-lead",
      label: "Kræver 12-afledning/videre vurdering",
    },
    {
      id: "clinical-context",
      label: "Kan ikke vurderes ud fra rytmen alene",
    },
  ],
};

const sourceNote =
  "Lokal EKG-4B metadata baseret på eksisterende billedkorttitel og konservativ rytmefortolkning.";

function step(
  stepName: EkgAssessmentStep,
  correctOptionId: string,
  explanation: string,
): EkgStepAssessment {
  return { step: stepName, correctOptionId, explanation };
}

export const ekgInteractiveAssessments: EkgInteractiveAssessment[] = [
  {
    cardId: "ekg_img_atrial_fib_1",
    imageKey: "ekg_img_atrial_fib_1",
    title: "Atrieflimren 1",
    rhythmName: "Atrieflimren",
    sourceNote,
    steps: {
      rate: step("rate", "uncertain", "Frekvensen kan variere ved atrieflimren og bør vurderes konkret på strimlen."),
      regularity: step("regularity", "irregularly-irregular", "Atrieflimren er klassisk uregelmæssigt uregelmæssig."),
      pWaves: step("pWaves", "none-clear", "Der ses typisk ingen sikre, ensartede P-takker."),
      prInterval: step("prInterval", "not-assessable", "PR-interval kan ikke vurderes sikkert uden tydelige P-takker."),
      qrsWidth: step("qrsWidth", "narrow", "Atrieflimren har ofte smalle QRS-komplekser, medmindre der er anden ledningspåvirkning."),
      rhythm: step("rhythm", "atrial-fibrillation", "Uregelmæssigt uregelmæssig rytme uden sikre P-takker peger på atrieflimren."),
      clinicalMeaning: step("clinicalMeaning", "clinical-context", "Betydningen afhænger af frekvens, symptomer, varighed og kredsløbspåvirkning."),
    },
    keyFindings: ["Uregelmæssigt uregelmæssig rytme", "Ingen sikre P-takker", "Rytmen skal kobles til patientens klinik"],
    commonPitfall: "At kalde enhver uregelmæssig rytme atrieflimren uden at lede efter P-takker og mønster.",
    ambulanceRelevance: "Overlever rytme, frekvens, symptomer, vitale værdier og om patienten virker påvirket.",
  },
  {
    cardId: "ekg_img_af_rvr",
    imageKey: "ekg_img_af_rvr",
    title: "Atrieflimren med hurtig ventrikelrespons",
    rhythmName: "Atrieflimren med hurtig frekvens",
    sourceNote,
    steps: {
      rate: step("rate", "fast", "Korttitlen angiver hurtig ventrikelrespons, altså takykard frekvens."),
      regularity: step("regularity", "irregularly-irregular", "Atrieflimren har uregelmæssigt uregelmæssige RR-intervaller."),
      pWaves: step("pWaves", "none-clear", "Organiserede P-takker er ikke sikre ved atrieflimren."),
      prInterval: step("prInterval", "not-assessable", "PR-interval er ikke meningsfuldt uden sikre P-takker."),
      qrsWidth: step("qrsWidth", "narrow", "Ved AF med hurtig respons er QRS typisk smalt, medmindre anden ledningsforstyrrelse ses."),
      rhythm: step("rhythm", "atrial-fibrillation", "Hurtig, uregelmæssigt uregelmæssig rytme uden sikre P-takker passer med AF."),
      clinicalMeaning: step("clinicalMeaning", "potentially-unstable", "Hurtig AF kan være klinisk betydende; vurder patientens kredsløb og symptomer."),
    },
    keyFindings: ["Hurtig ventrikelrespons", "Uregelmæssigt uregelmæssig rytme", "Ingen sikre P-takker"],
    commonPitfall: "At fokusere på rytmen uden at vurdere om frekvensen påvirker patienten.",
    ambulanceRelevance: "Beskriv frekvens, stabilitet, symptomer og ændringer under observation.",
  },
  {
    cardId: "ekg_img_sinus_tachy_1",
    imageKey: "ekg_img_sinus_tachy_1",
    title: "Sinustakykardi",
    rhythmName: "Sinustakykardi",
    sourceNote,
    steps: {
      rate: step("rate", "fast", "Sinustakykardi betyder sinusrytme med hurtig frekvens."),
      regularity: step("regularity", "regular", "Sinusrytmer er typisk regelmæssige."),
      pWaves: step("pWaves", "visible-before-qrs", "Ved sinusrytme forventes P-tak før hvert QRS."),
      prInterval: step("prInterval", "normal", "Sinustakykardi har ofte stabilt PR-interval, hvis der ikke er AV-ledningsproblem."),
      qrsWidth: step("qrsWidth", "narrow", "QRS er typisk smalt ved sinusudløst rytme."),
      rhythm: step("rhythm", "sinus-tachycardia", "Hurtig regelmæssig rytme med sinusmønster passer med sinustakykardi."),
      clinicalMeaning: step("clinicalMeaning", "clinical-context", "Sinustakykardi er ofte et tegn på belastning; årsagen findes i patientens tilstand."),
    },
    keyFindings: ["Hurtig frekvens", "Regelmæssig rytme", "Sinusmønster med P før QRS"],
    commonPitfall: "At behandle tallet som diagnosen i stedet for at finde årsagen til takykardien.",
    ambulanceRelevance: "Vurder smerte, feber, hypovolæmi, angst, hypoksi og andre forklaringer i konteksten.",
  },
  {
    cardId: "ekg_img_sinus_brady_1deg_av",
    imageKey: "ekg_img_sinus_brady_1deg_av",
    title: "Sinusbradykardi med 1. grads AV-blok",
    rhythmName: "Sinusbradykardi med 1. grads AV-blok",
    sourceNote,
    steps: {
      rate: step("rate", "slow", "Sinusbradykardi betyder sinusrytme med langsom frekvens."),
      regularity: step("regularity", "regular", "Sinusbradykardi er typisk regelmæssig."),
      pWaves: step("pWaves", "visible-before-qrs", "Der forventes P-tak før hvert QRS ved sinusrytme."),
      prInterval: step("prInterval", "prolonged", "1. grads AV-blok defineres ved forlænget PR-interval."),
      qrsWidth: step("qrsWidth", "narrow", "QRS er typisk smalt ved AV-knude-forsinkelse uden grenblok."),
      rhythm: step("rhythm", "first-degree-av-block", "Titlen angiver 1. grads AV-blok oveni sinusbradykardi."),
      clinicalMeaning: step("clinicalMeaning", "clinical-context", "Bradykardiens betydning afhænger af symptomer og kredsløbspåvirkning."),
    },
    keyFindings: ["Langsom sinusrytme", "P før QRS", "Forlænget PR-interval"],
    commonPitfall: "At kalde alle langsomme rytmer simpel sinusbradykardi uden at måle PR-forholdet.",
    ambulanceRelevance: "Overlever frekvens, PR-fund hvis set, symptomer, blodtryk og bevidsthedsniveau.",
  },
  {
    cardId: "ekg_img_svt_1",
    imageKey: "ekg_img_svt_1",
    title: "SVT",
    rhythmName: "Supraventrikulær takykardi",
    sourceNote,
    steps: {
      rate: step("rate", "fast", "SVT er en hurtig rytme."),
      regularity: step("regularity", "regular", "SVT er typisk regelmæssig."),
      pWaves: step("pWaves", "none-clear", "P-takker kan være skjulte i den hurtige rytme."),
      prInterval: step("prInterval", "not-assessable", "PR-interval kan ofte ikke vurderes sikkert ved SVT."),
      qrsWidth: step("qrsWidth", "narrow", "SVT er typisk smalkomplekset."),
      rhythm: step("rhythm", "svt", "Hurtig regelmæssig smalkomplekset rytme passer med SVT."),
      clinicalMeaning: step("clinicalMeaning", "potentially-unstable", "SVT kan være symptomgivende; vurder klinisk påvirkning og stabilitet."),
    },
    keyFindings: ["Hurtig rytme", "Regelmæssig", "Typisk smalt QRS"],
    commonPitfall: "At overse QRS-bredden og patientens stabilitet ved en hurtig rytme.",
    ambulanceRelevance: "Beskriv debut, symptomer, frekvens, stabilitet og ændringer over tid.",
  },
  {
    cardId: "ekg_img_monomorphic_vt_1",
    imageKey: "ekg_img_monomorphic_vt_1",
    title: "Monomorf ventrikulær takykardi",
    rhythmName: "Ventrikulær takykardi",
    sourceNote,
    steps: {
      rate: step("rate", "fast", "VT er en hurtig ventrikulær rytme."),
      regularity: step("regularity", "regular", "Monomorf VT er ofte regelmæssig."),
      pWaves: step("pWaves", "none-clear", "P-takker er ofte ikke tydelige eller ikke sikkert koblet til QRS."),
      prInterval: step("prInterval", "not-assessable", "PR-interval kan ikke vurderes sikkert uden normal P-QRS relation."),
      qrsWidth: step("qrsWidth", "wide", "VT er en bredkomplekset takykardi."),
      rhythm: step("rhythm", "ventricular-tachycardia", "Hurtig bredkomplekset rytme skal give mistanke om VT."),
      clinicalMeaning: step("clinicalMeaning", "life-threatening", "VT kan være livstruende; vurder patientens tilstand hurtigt og overlever tydeligt."),
    },
    keyFindings: ["Hurtig rytme", "Bredt QRS", "Mulig ventrikulær oprindelse"],
    commonPitfall: "At antage bred takykardi er ufarlig SVT med aberration uden at tænke mulig VT.",
    ambulanceRelevance: "Rytmen er højrisiko; kommuniker frekvens, QRS-bredde og patientens kliniske påvirkning.",
  },
  {
    cardId: "ekg_img_vf_1",
    imageKey: "ekg_img_vf_1",
    title: "Ventrikelflimren",
    rhythmName: "Ventrikelflimren",
    sourceNote,
    steps: {
      rate: step("rate", "uncertain", "Ved VF kan en organiseret frekvens ikke vurderes meningsfuldt."),
      regularity: step("regularity", "irregular", "VF er kaotisk uden organiseret regelmæssighed."),
      pWaves: step("pWaves", "none-clear", "Der ses ingen sikre P-takker."),
      prInterval: step("prInterval", "not-assessable", "PR-interval kan ikke vurderes uden organiserede komplekser."),
      qrsWidth: step("qrsWidth", "uncertain", "Der er ingen sikre organiserede QRS-komplekser at måle."),
      rhythm: step("rhythm", "ventricular-fibrillation", "Kaotisk rytme uden organiserede QRS-komplekser passer med VF."),
      clinicalMeaning: step("clinicalMeaning", "life-threatening", "VF er en livstruende rytmebeskrivelse og skal kobles til patientens kliniske tilstand."),
    },
    keyFindings: ["Kaotisk elektrisk aktivitet", "Ingen organiserede QRS-komplekser", "Ingen sikre P-takker"],
    commonPitfall: "At overse tekniske fejl eller artefakt; signal og patient skal altid kontrolleres.",
    ambulanceRelevance: "Overlever rytmefund, patienttilstand og om signalet virker teknisk troværdigt.",
  },
  {
    cardId: "ekg_img_complete_heart_block",
    imageKey: "ekg_img_complete_heart_block",
    title: "3. grads AV-blok",
    rhythmName: "Complete heart block",
    sourceNote,
    steps: {
      rate: step("rate", "slow", "Komplet AV-blok giver ofte langsom ventrikulær escape-rytme."),
      regularity: step("regularity", "regular", "Escape-rytmen kan være relativt regelmæssig, selv om P og QRS ikke hænger sammen."),
      pWaves: step("pWaves", "variable-relation", "P-takker ses, men relationen til QRS er ophævet eller varierer."),
      prInterval: step("prInterval", "variable", "PR-forholdet er varierende, fordi atrier og ventrikler arbejder uafhængigt."),
      qrsWidth: step("qrsWidth", "uncertain", "QRS-bredden afhænger af escape-rytmen og skal vurderes på billedet."),
      rhythm: step("rhythm", "third-degree-av-block", "Uafhængighed mellem P-takker og QRS passer med 3. grads AV-blok."),
      clinicalMeaning: step("clinicalMeaning", "rapid-assessment", "Komplet AV-blok kræver hurtig klinisk vurdering af påvirkning og stabilitet."),
    },
    keyFindings: ["AV-dissociation", "P-takker og QRS følges ikke ad", "Ofte langsom ventrikulær rytme"],
    commonPitfall: "At kalde rytmen simpel bradykardi uden at undersøge P-QRS relationen.",
    ambulanceRelevance: "Overlever frekvens, stabilitet, bevidsthed, blodtryk og observation om AV-dissociation.",
  },
  {
    cardId: "ekg_img_mobitz1_1",
    imageKey: "ekg_img_mobitz1_1",
    title: "2. grads AV-blok type I",
    rhythmName: "Mobitz I",
    sourceNote,
    steps: {
      rate: step("rate", "slow", "AV-blok med droppede komplekser kan give langsom samlet ventrikelfrekvens."),
      regularity: step("regularity", "irregular", "Droppede QRS-komplekser giver uregelmæssighed eller pauser."),
      pWaves: step("pWaves", "more-p-than-qrs", "Der er flere P-takker end QRS, fordi enkelte impulser ikke overledes."),
      prInterval: step("prInterval", "variable", "Mobitz I kendetegnes ved gradvis PR-forlængelse før udfald."),
      qrsWidth: step("qrsWidth", "narrow", "Mobitz I er ofte nodal og kan have smalt QRS."),
      rhythm: step("rhythm", "mobitz-i", "Gradvis PR-forlængelse med droppet QRS passer med Mobitz I."),
      clinicalMeaning: step("clinicalMeaning", "clinical-context", "Betydningen afhænger af frekvens, symptomer og kredsløbspåvirkning."),
    },
    keyFindings: ["Flere P-takker end QRS", "Varierende/tiltagende PR", "Droppet QRS-kompleks"],
    commonPitfall: "At overse P-takkerne og kun beskrive rytmen som uregelmæssig bradykardi.",
    ambulanceRelevance: "Beskriv pauser, frekvens, symptomer og om patienten er kredsløbspåvirket.",
  },
  {
    cardId: "ekg_img_inferior_stemi_1",
    imageKey: "ekg_img_inferior_stemi_1",
    title: "Inferiort STEMI-mønster",
    rhythmName: "STEMI-mønster",
    sourceNote,
    steps: {
      rate: step("rate", "uncertain", "STEMI-billedkortet handler primært om iskæmimønster; rytmefrekvens er ikke hovedfundet her."),
      regularity: step("regularity", "uncertain", "Regelmæssighed er ikke det centrale læringspunkt i dette billede."),
      pWaves: step("pWaves", "uncertain", "P-takker kan ikke vurderes som hovedfund ud fra kortets titel alene."),
      prInterval: step("prInterval", "not-assessable", "PR-interval er ikke det centrale fund ved dette billedkort."),
      qrsWidth: step("qrsWidth", "uncertain", "QRS-bredde er ikke angivet som hovedfund for dette billede."),
      rhythm: step("rhythm", "stemi-pattern", "Korttitlen angiver inferiort STEMI-mønster."),
      clinicalMeaning: step("clinicalMeaning", "needs-12-lead", "STEMI-mønster kræver 12-afledningsforståelse og videre klinisk vurdering."),
    },
    keyFindings: ["ST-elevationsmønster i inferior fordeling", "Rytme alene er ikke nok", "12-afledning og klinik er centrale"],
    commonPitfall: "At kalde dette en rytmediagnose; det er primært et iskæmi-/STEMI-mønster.",
    ambulanceRelevance: "Overlever EKG-mønster, symptomer, vitale værdier, debut og udvikling uden at gøre rytmen til eneste fokus.",
  },
];

export const ekgInteractiveAssessmentByCardId = new Map(
  ekgInteractiveAssessments.map((assessment) => [assessment.cardId, assessment]),
);

export function getEkgInteractiveAssessment(cardId: string) {
  return ekgInteractiveAssessmentByCardId.get(cardId) ?? null;
}

export function getEkgStepOptionLabel(
  stepName: EkgAssessmentStep,
  optionId: string,
) {
  return (
    ekgStepOptions[stepName].find((option) => option.id === optionId)?.label ??
    optionId
  );
}
