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
    { id: "flutter-waves", label: "Flutterbølger / savtaksmønster" },
    { id: "more-p-than-qrs", label: "Flere P-takker end QRS-komplekser" },
    { id: "variable-relation", label: "P-takker ses, men relationen varierer" },
    { id: "uncertain", label: "Kan ikke vurderes sikkert" },
  ],
  prInterval: [
    { id: "normal", label: "Normalt" },
    { id: "prolonged", label: "Forlænget" },
    { id: "constant-conducted", label: "Konstant ved overledte slag" },
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
  "Lokal EKG-4C metadata baseret på eksisterende billedkorttitel og konservativ rytmefortolkning.";

function step(
  stepName: EkgAssessmentStep,
  correctOptionId: string,
  explanation: string,
): EkgStepAssessment {
  return { step: stepName, correctOptionId, explanation };
}

type AssessmentOptionId = string;

function makeAtrialFibrillationAssessment({
  cardId,
  title,
  rate,
  rateExplanation,
  clinicalMeaning = "clinical-context",
}: {
  cardId: string;
  title: string;
  rate: AssessmentOptionId;
  rateExplanation: string;
  clinicalMeaning?: AssessmentOptionId;
}): EkgInteractiveAssessment {
  return {
    cardId,
    imageKey: cardId,
    title,
    rhythmName: "Atrieflimren",
    sourceNote,
    steps: {
      rate: step("rate", rate, rateExplanation),
      regularity: step(
        "regularity",
        "irregularly-irregular",
        "RR-intervallerne varierer uden et gentaget mønster, hvilket er klassisk for atrieflimren.",
      ),
      pWaves: step(
        "pWaves",
        "none-clear",
        "Der ses ikke sikre, ensartede P-takker før hvert QRS.",
      ),
      prInterval: step(
        "prInterval",
        "not-assessable",
        "PR-intervallet kan ikke vurderes sikkert, fordi der ikke ses stabile P-takker med fast relation til QRS.",
      ),
      qrsWidth: step(
        "qrsWidth",
        "narrow",
        "QRS-komplekserne fremstår smalle i dette atrieflimren-eksempel.",
      ),
      rhythm: step(
        "rhythm",
        "atrial-fibrillation",
        "Uregelmæssigt uregelmæssige RR-intervaller uden sikre P-takker støtter atrieflimren.",
      ),
      clinicalMeaning: step(
        "clinicalMeaning",
        clinicalMeaning,
        "Rytmen skal vurderes sammen med frekvens, symptomer, perfusion og patientens udvikling.",
      ),
    },
    keyFindings: [
      "Uregelmæssigt uregelmæssige RR-intervaller",
      "Ingen sikre P-takker",
      "PR-interval kan ikke vurderes sikkert",
    ],
    commonPitfall:
      "At kalde enhver uregelmæssig rytme atrieflimren uden at kontrollere P-takker og RR-mønster.",
    ambulanceRelevance:
      "Overlever rytme, ventrikelfrekvens, symptomer, vitale værdier og tegn på kredsløbspåvirkning.",
  };
}

function makeAtrialFlutterAssessment({
  cardId,
  title,
  rate,
  rateExplanation,
  regularity,
  regularityExplanation,
  clinicalMeaning = "clinical-context",
}: {
  cardId: string;
  title: string;
  rate: AssessmentOptionId;
  rateExplanation: string;
  regularity: AssessmentOptionId;
  regularityExplanation: string;
  clinicalMeaning?: AssessmentOptionId;
}): EkgInteractiveAssessment {
  return {
    cardId,
    imageKey: cardId,
    title,
    rhythmName: "Atrieflagren",
    sourceNote,
    steps: {
      rate: step("rate", rate, rateExplanation),
      regularity: step("regularity", regularity, regularityExplanation),
      pWaves: step(
        "pWaves",
        "flutter-waves",
        "Der ses organiserede flutterbølger med et savtakslignende mønster frem for normale P-takker.",
      ),
      prInterval: step(
        "prInterval",
        "not-assessable",
        "Et normalt PR-interval kan ikke måles, fordi atrieaktiviteten består af gentagne flutterbølger.",
      ),
      qrsWidth: step(
        "qrsWidth",
        "narrow",
        "De overledte QRS-komplekser fremstår smalle i dette flutter-eksempel.",
      ),
      rhythm: step(
        "rhythm",
        "atrial-flutter",
        "Flutterbølger og det beskrevne overledningsmønster peger på atrieflagren.",
      ),
      clinicalMeaning: step(
        "clinicalMeaning",
        clinicalMeaning,
        "Betydningen afhænger af ventrikelfrekvens, symptomer, perfusion og øvrige kliniske fund.",
      ),
    },
    keyFindings: [
      "Flutterbølger / savtaksmønster",
      "Flere atriale impulser end QRS-komplekser",
      "Overledningsforholdet bestemmer ventrikelrytmen",
    ],
    commonPitfall:
      "At forveksle flutter med atrieflimren uden at lede efter organiserede, gentagne flutterbølger.",
    ambulanceRelevance:
      "Beskriv ventrikelfrekvens, regelmæssighed, symptomer og klinisk påvirkning ved overlevering.",
  };
}

function makeSvtAssessment(cardId: string, title: string): EkgInteractiveAssessment {
  return {
    cardId,
    imageKey: cardId,
    title,
    rhythmName: "Supraventrikulær takykardi (AVNRT)",
    sourceNote,
    steps: {
      rate: step(
        "rate",
        "fast",
        "Frekvensen vurderes som høj, fordi RR-intervallerne er korte og rytmen ligger tydeligt over normalområdet.",
      ),
      regularity: step(
        "regularity",
        "regular",
        "RR-intervallerne er ensartede, så rytmen fremstår regelmæssig.",
      ),
      pWaves: step(
        "pWaves",
        "none-clear",
        "Der ses ikke sikre P-takker før hvert QRS; ved AVNRT kan atrieaktiviteten være skjult i eller tæt på QRS.",
      ),
      prInterval: step(
        "prInterval",
        "not-assessable",
        "PR-intervallet kan ikke vurderes sikkert, når P-takkerne ikke kan afgrænses.",
      ),
      qrsWidth: step(
        "qrsWidth",
        "narrow",
        "QRS-komplekserne fremstår smalle, hvilket støtter en supraventrikulær takykardi.",
      ),
      rhythm: step(
        "rhythm",
        "svt",
        "En hurtig, regelmæssig smalkomplekset rytme uden sikre P-takker passer med SVT/AVNRT.",
      ),
      clinicalMeaning: step(
        "clinicalMeaning",
        "potentially-unstable",
        "En hurtig SVT kan være symptomgivende; vurder perfusion, bevidsthed, blodtryk og øvrige symptomer.",
      ),
    },
    keyFindings: ["Hurtig frekvens", "Regelmæssig rytme", "Smalle QRS-komplekser"],
    commonPitfall:
      "At navngive den hurtige rytme uden først at kontrollere regelmæssighed og QRS-bredde.",
    ambulanceRelevance:
      "Overlever debut, frekvens, QRS-bredde, symptomer, vitale værdier og ændringer under observation.",
  };
}

function makeVtAssessment(cardId: string, title: string): EkgInteractiveAssessment {
  return {
    cardId,
    imageKey: cardId,
    title,
    rhythmName: "Monomorf ventrikulær takykardi",
    sourceNote,
    steps: {
      rate: step("rate", "fast", "De korte RR-intervaller viser en hurtig ventrikulær rytme."),
      regularity: step(
        "regularity",
        "regular",
        "Komplekserne gentages med ensartede RR-intervaller, som ved monomorf VT.",
      ),
      pWaves: step(
        "pWaves",
        "none-clear",
        "Der ses ikke sikre P-takker med fast relation til hvert bredt QRS-kompleks.",
      ),
      prInterval: step(
        "prInterval",
        "not-assessable",
        "PR-intervallet kan ikke vurderes sikkert uden en stabil P-QRS relation.",
      ),
      qrsWidth: step(
        "qrsWidth",
        "wide",
        "QRS-komplekserne er tydeligt brede sammenlignet med et normalt smalt QRS.",
      ),
      rhythm: step(
        "rhythm",
        "ventricular-tachycardia",
        "Kortets eksisterende diagnose og den hurtige, regelmæssige bredkomplekse rytme støtter monomorf VT.",
      ),
      clinicalMeaning: step(
        "clinicalMeaning",
        "life-threatening",
        "VT er en højrisikorytme; rytmefundet skal straks kobles til puls, perfusion og patientens kliniske tilstand.",
      ),
    },
    keyFindings: ["Hurtig frekvens", "Regelmæssig bredkomplekset rytme", "Ingen sikker P-QRS relation"],
    commonPitfall:
      "At antage at en bred takykardi er ufarlig uden at betragte mulig VT som en central forklaring.",
    ambulanceRelevance:
      "Kommuniker rytme, frekvens, QRS-bredde, puls, perfusion og patientens kliniske påvirkning tydeligt.",
  };
}

function makeVfAssessment(cardId: string, title: string): EkgInteractiveAssessment {
  return {
    cardId,
    imageKey: cardId,
    title,
    rhythmName: "Ventrikelflimren",
    sourceNote,
    steps: {
      rate: step("rate", "uncertain", "Der er ingen organiserede komplekser, så en meningsfuld frekvens kan ikke beregnes."),
      regularity: step("regularity", "irregular", "Aktiviteten er kaotisk uden et organiseret RR-mønster."),
      pWaves: step("pWaves", "none-clear", "Der ses ingen sikre P-takker i den kaotiske aktivitet."),
      prInterval: step("prInterval", "not-assessable", "PR-intervallet kan ikke vurderes uden organiserede P-takker og QRS-komplekser."),
      qrsWidth: step("qrsWidth", "uncertain", "Der er ingen sikre, organiserede QRS-komplekser at måle bredden på."),
      rhythm: step("rhythm", "ventricular-fibrillation", "Kaotisk aktivitet uden organiserede QRS-komplekser passer med ventrikelflimren."),
      clinicalMeaning: step("clinicalMeaning", "life-threatening", "VF er en livstruende rytmebeskrivelse, men signalet skal altid sammenholdes med patienten og teknisk kvalitet."),
    },
    keyFindings: ["Kaotisk elektrisk aktivitet", "Ingen organiserede QRS-komplekser", "Ingen målbar PR-relation"],
    commonPitfall: "At forveksle bevægelsesartefakt eller dårlig elektrodekontakt med VF uden at kontrollere patient og signal.",
    ambulanceRelevance: "Bekræft patienttilstand og signalets troværdighed, og overlever rytmefundet og den kliniske situation klart.",
  };
}

function makeCompleteHeartBlockAssessment(cardId: string, title: string): EkgInteractiveAssessment {
  return {
    cardId,
    imageKey: cardId,
    title,
    rhythmName: "3. grads AV-blok",
    sourceNote,
    steps: {
      rate: step("rate", "slow", "Den ventrikulære escape-rytme fremstår langsom i dette komplette AV-blok-eksempel."),
      regularity: step("regularity", "regular", "Ventrikulernes escape-rytme kan være regelmæssig, selv om atrier og ventrikler arbejder uafhængigt."),
      pWaves: step("pWaves", "variable-relation", "P-takker ses, men deres placering i forhold til QRS varierer, hvilket viser AV-dissociation."),
      prInterval: step("prInterval", "variable", "PR-forholdet varierer, fordi P-takker og QRS-komplekser ikke har fast relation."),
      qrsWidth: step("qrsWidth", "uncertain", "QRS-bredden afhænger af escape-rytmens oprindelse og skal vurderes særskilt på strimlen."),
      rhythm: step("rhythm", "third-degree-av-block", "Uafhængig atrie- og ventrikelaktivitet støtter 3. grads AV-blok."),
      clinicalMeaning: step("clinicalMeaning", "rapid-assessment", "Komplet AV-blok kræver hurtig vurdering af frekvens, perfusion, blodtryk, bevidsthed og symptomer."),
    },
    keyFindings: ["AV-dissociation", "P-takker og QRS følges ikke ad", "Langsom ventrikulær escape-rytme"],
    commonPitfall: "At beskrive rytmen som simpel bradykardi uden systematisk at undersøge P-QRS relationen.",
    ambulanceRelevance: "Overlever frekvens, tegn på AV-dissociation, symptomer, blodtryk, bevidsthed og klinisk udvikling.",
  };
}

function makeMobitzIAssessment(cardId: string, title: string): EkgInteractiveAssessment {
  return {
    cardId,
    imageKey: cardId,
    title,
    rhythmName: "2. grads AV-blok type I (Mobitz I)",
    sourceNote,
    steps: {
      rate: step("rate", "slow", "Droppede QRS-komplekser reducerer den samlede ventrikelfrekvens."),
      regularity: step("regularity", "irregular", "Det droppede QRS giver en pause og gør ventrikelrytmen uregelmæssig."),
      pWaves: step("pWaves", "more-p-than-qrs", "Der ses flere P-takker end QRS-komplekser, fordi en atrial impuls ikke overledes."),
      prInterval: step("prInterval", "variable", "PR-intervallet forlænges gradvist før det droppede QRS, som ved Mobitz I."),
      qrsWidth: step("qrsWidth", "narrow", "De overledte QRS-komplekser fremstår smalle i dette eksempel."),
      rhythm: step("rhythm", "mobitz-i", "Gradvis PR-forlængelse efterfulgt af et droppet QRS passer med Mobitz I."),
      clinicalMeaning: step("clinicalMeaning", "clinical-context", "Betydningen afhænger af ventrikelfrekvens, symptomer, perfusion og patientens udvikling."),
    },
    keyFindings: ["Tiltagende PR-interval", "Droppet QRS-kompleks", "Flere P-takker end QRS-komplekser"],
    commonPitfall: "At se pausen, men overse den gradvise PR-forlængelse før udfaldet.",
    ambulanceRelevance: "Beskriv frekvens, pauser, AV-ledningsmønster, symptomer og tegn på kredsløbspåvirkning.",
  };
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
  makeAtrialFibrillationAssessment({
    cardId: "ekg_img_af_slow_vr",
    title: "Atrieflimren med langsom ventrikelrespons",
    rate: "slow",
    rateExplanation:
      "Frekvensen vurderes som langsom, hvilket stemmer med kortets eksisterende beskrivelse af langsom ventrikelrespons.",
  }),
  makeAtrialFibrillationAssessment({
    cardId: "ekg_img_atrial_fib_2",
    title: "Atrieflimren 2",
    rate: "uncertain",
    rateExplanation:
      "Atrieflimren fastlægger ikke i sig selv ventrikelfrekvensen; den skal beregnes på den konkrete strimmel.",
  }),
  makeAtrialFibrillationAssessment({
    cardId: "ekg_img_atrial_fib_3",
    title: "Atrieflimren 3",
    rate: "uncertain",
    rateExplanation:
      "Ventrikelfrekvensen kan variere ved atrieflimren og skal vurderes konkret frem for at udledes af rytmenavnet.",
  }),
  makeAtrialFlutterAssessment({
    cardId: "ekg_img_aflutter_2_1",
    title: "Atrieflagren med 2:1-overledning",
    rate: "fast",
    rateExplanation:
      "Ved 2:1-overledning når hver anden flutterimpuls ventriklerne, hvilket typisk giver en hurtig ventrikelfrekvens.",
    regularity: "regular",
    regularityExplanation:
      "Fast 2:1-overledning giver typisk ensartede RR-intervaller og en regelmæssig ventrikelrytme.",
    clinicalMeaning: "potentially-unstable",
  }),
  makeAtrialFlutterAssessment({
    cardId: "ekg_img_aflutter_4_1",
    title: "Atrieflagren med 4:1-overledning",
    rate: "normal",
    rateExplanation:
      "Ved fast 4:1-overledning er ventrikelfrekvensen ofte omkring normalområdet, selv om atriefrekvensen er høj.",
    regularity: "regular",
    regularityExplanation:
      "Fast 4:1-overledning giver et gentaget mønster med regelmæssige RR-intervaller.",
  }),
  makeAtrialFlutterAssessment({
    cardId: "ekg_img_aflutter_variable",
    title: "Atrieflagren med varierende overledning",
    rate: "uncertain",
    rateExplanation:
      "Når overledningsforholdet varierer, kan ventrikelfrekvensen ikke udledes sikkert uden at tælle på strimlen.",
    regularity: "irregular",
    regularityExplanation:
      "Varierende AV-overledning giver skiftende RR-intervaller og dermed en uregelmæssig ventrikelrytme.",
  }),
  {
    cardId: "ekg_img_normal_sinus_1deg_av",
    imageKey: "ekg_img_normal_sinus_1deg_av",
    title: "Sinusrytme med 1. grads AV-blok",
    rhythmName: "Sinusrytme med 1. grads AV-blok",
    sourceNote,
    steps: {
      rate: step(
        "rate",
        "normal",
        "Kortets eksisterende beskrivelse angiver normal sinusrytme, så frekvensen ligger i normalområdet.",
      ),
      regularity: step(
        "regularity",
        "regular",
        "Sinusrytmen fremstår regelmæssig med ensartede RR-intervaller.",
      ),
      pWaves: step(
        "pWaves",
        "visible-before-qrs",
        "Der ses en P-tak før hvert QRS, hvilket støtter sinusrytme med bevaret 1:1-overledning.",
      ),
      prInterval: step(
        "prInterval",
        "prolonged",
        "PR-intervallet er forlænget og stabilt, hvilket er det centrale fund ved 1. grads AV-blok.",
      ),
      qrsWidth: step(
        "qrsWidth",
        "narrow",
        "QRS-komplekserne fremstår smalle i dette eksempel med forsinkelse på AV-ledningsniveau.",
      ),
      rhythm: step(
        "rhythm",
        "first-degree-av-block",
        "Sinusrytme med fast, forlænget PR-interval passer med 1. grads AV-blok.",
      ),
      clinicalMeaning: step(
        "clinicalMeaning",
        "not-acute-alone",
        "Et isoleret 1. grads AV-blok-fund er ikke nødvendigvis akut; vurder symptomer, øvrige EKG-fund og klinisk sammenhæng.",
      ),
    },
    keyFindings: [
      "Normal og regelmæssig sinusrytme",
      "P-tak før hvert QRS",
      "Fast forlænget PR-interval",
    ],
    commonPitfall:
      "At overse det forlængede PR-interval, fordi hvert QRS stadig følger efter en P-tak.",
    ambulanceRelevance:
      "Overlever rytme, frekvens, PR-fund, symptomer og eventuelle samtidige lednings- eller iskæmiforandringer.",
  },
  makeSvtAssessment("ekg_img_svt_avnrt_1", "SVT / AVNRT 1"),
  makeSvtAssessment("ekg_img_svt_avnrt_2", "SVT / AVNRT 2"),
  makeVtAssessment("ekg_img_monomorphic_vt_2", "Monomorf ventrikulær takykardi 2"),
  makeVtAssessment("ekg_img_monomorphic_vt_3", "Monomorf ventrikulær takykardi 3"),
  makeVfAssessment("ekg_img_vf_2", "Ventrikelflimren 2"),
  makeCompleteHeartBlockAssessment("ekg_img_chb_2", "3. grads AV-blok 2"),
  makeCompleteHeartBlockAssessment("ekg_img_chb_3", "3. grads AV-blok 3"),
  makeMobitzIAssessment("ekg_img_mobitz1_2", "2. grads AV-blok type I 2"),
  {
    cardId: "ekg_img_mobitz2",
    imageKey: "ekg_img_mobitz2",
    title: "2. grads AV-blok type II",
    rhythmName: "2. grads AV-blok type II (Mobitz II)",
    sourceNote,
    steps: {
      rate: step(
        "rate",
        "slow",
        "Ikke-overledte P-takker reducerer den samlede ventrikelfrekvens og giver en langsom rytme.",
      ),
      regularity: step(
        "regularity",
        "irregular",
        "Et pludseligt droppet QRS skaber en pause og gør ventrikelrytmen uregelmæssig.",
      ),
      pWaves: step(
        "pWaves",
        "more-p-than-qrs",
        "Der ses flere P-takker end QRS-komplekser, fordi enkelte atriale impulser ikke overledes.",
      ),
      prInterval: step(
        "prInterval",
        "constant-conducted",
        "PR-intervallet er konstant ved de overledte slag og forlænges ikke gradvist før udfaldet.",
      ),
      qrsWidth: step(
        "qrsWidth",
        "uncertain",
        "QRS-bredden skal vurderes særskilt; Mobitz II-navnet alene fastlægger ikke bredden sikkert.",
      ),
      rhythm: step(
        "rhythm",
        "mobitz-ii",
        "Konstant PR ved overledte slag med pludseligt droppet QRS passer med Mobitz II.",
      ),
      clinicalMeaning: step(
        "clinicalMeaning",
        "rapid-assessment",
        "Mobitz II kan være klinisk betydende; vurder frekvens, perfusion, bevidsthed, blodtryk og symptomer hurtigt.",
      ),
    },
    keyFindings: [
      "Flere P-takker end QRS-komplekser",
      "Konstant PR ved overledte slag",
      "Pludseligt droppet QRS uden gradvis PR-forlængelse",
    ],
    commonPitfall:
      "At forveksle Mobitz II med Mobitz I uden at sammenligne PR-intervallerne før det droppede slag.",
    ambulanceRelevance:
      "Overlever frekvens, ledningsmønster, pauser, symptomer, perfusion og patientens udvikling.",
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
