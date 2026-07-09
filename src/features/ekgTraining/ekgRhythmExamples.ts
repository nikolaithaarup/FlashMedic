export type EkgRhythmExample = {
  id: string;
  title: string;
  shortDescription: string;
  rateDescription: string;
  regularity: string;
  pWaveDescription: string;
  prDescription: string;
  qrsDescription: string;
  likelyRhythm: string;
  ambulanceRelevance: string;
  commonPitfall: string;
  explanation: string;
};

export type EkgRhythmStepKey =
  | "rateDescription"
  | "regularity"
  | "pWaveDescription"
  | "prDescription"
  | "qrsDescription"
  | "likelyRhythm"
  | "ambulanceRelevance";

export type EkgRhythmStep = {
  key: EkgRhythmStepKey;
  title: string;
  prompt: string;
};

export const ekgRhythmSteps: EkgRhythmStep[] = [
  {
    key: "rateDescription",
    title: "Frekvens",
    prompt: "Start med tempoet. Er rytmen langsom, normal eller hurtig?",
  },
  {
    key: "regularity",
    title: "Regelmæssighed",
    prompt: "Kig på afstanden mellem komplekserne. Er rytmen regelmæssig?",
  },
  {
    key: "pWaveDescription",
    title: "P-takker",
    prompt: "Led efter P-takker. Er de synlige, ensartede og koblet til QRS?",
  },
  {
    key: "prDescription",
    title: "PR-interval",
    prompt: "Vurder overledningen fra atrier til ventrikler.",
  },
  {
    key: "qrsDescription",
    title: "QRS-bredde",
    prompt: "Er QRS smalt eller bredt, og ændrer det din mistanke?",
  },
  {
    key: "likelyRhythm",
    title: "Rytmeforslag",
    prompt: "Saml observationerne til et forsigtigt rytmeforslag.",
  },
  {
    key: "ambulanceRelevance",
    title: "Ambulancefaglig betydning",
    prompt: "Kobl rytmen til klinik, urgency og tydelig overlevering.",
  },
];

export const ekgRhythmExamples: EkgRhythmExample[] = [
  {
    id: "sinus-rhythm",
    title: "Sinusrytme",
    shortDescription:
      "Regelmæssig rytme hos en vågen patient uden tydelige alarmsymptomer.",
    rateDescription: "Frekvensen ligger omtrent i normalområdet.",
    regularity: "Rytmen er regelmæssig med jævne RR-intervaller.",
    pWaveDescription:
      "Der ses P-takker før hvert QRS, og P-takkerne ligner hinanden.",
    prDescription: "PR-intervallet virker stabilt og uden tydelig forlængelse.",
    qrsDescription: "QRS-komplekserne er smalle.",
    likelyRhythm: "Fundene passer bedst med sinusrytme.",
    ambulanceRelevance:
      "Rytmen er ofte et roligt udgangspunkt; vurder stadig patientens symptomer, vitale værdier og udvikling.",
    commonPitfall:
      "At kalde en rytme normal uden at sammenholde den med patientens kliniske tilstand.",
    explanation:
      "Sinusrytme beskriver en organiseret rytme fra sinusknuden. Det er ikke det samme som at patienten er rask.",
  },
  {
    id: "sinus-tachycardia",
    title: "Sinustakykardi",
    shortDescription:
      "Hurtig, regelmæssig rytme hos en patient med mulig smerte, feber, angst, hypovolæmi eller anden belastning.",
    rateDescription: "Frekvensen er hurtig.",
    regularity: "Rytmen er regelmæssig.",
    pWaveDescription:
      "Der ses P-takker før QRS, hvilket taler for sinusudløst rytme.",
    prDescription: "PR-intervallet er stabilt.",
    qrsDescription: "QRS er smalt, medmindre der er anden ledningspåvirkning.",
    likelyRhythm: "Fundene passer med sinustakykardi.",
    ambulanceRelevance:
      "Fokus er at vurdere hvorfor patienten er takykard, og om der er tegn på kredsløbspåvirkning.",
    commonPitfall:
      "At fokusere på rytmen alene og overse den udløsende årsag eller patientens samlede tilstand.",
    explanation:
      "Sinustakykardi er ofte en fysiologisk reaktion. Den skal forstås sammen med kontekst, symptomer og vitale værdier.",
  },
  {
    id: "sinus-bradycardia",
    title: "Sinusbradykardi",
    shortDescription:
      "Langsom, regelmæssig rytme med bevaret sinusmønster.",
    rateDescription: "Frekvensen er langsom.",
    regularity: "Rytmen er regelmæssig.",
    pWaveDescription: "Der ses P-takker før QRS-komplekserne.",
    prDescription: "PR-intervallet virker stabilt.",
    qrsDescription: "QRS er typisk smalt.",
    likelyRhythm: "Fundene passer med sinusbradykardi.",
    ambulanceRelevance:
      "Vurder om patienten er påvirket, og om den langsomme rytme hænger sammen med symptomer eller kredsløb.",
    commonPitfall:
      "At reagere på tallet alene uden at vurdere bevidsthed, blodtryk, respiration og symptomer.",
    explanation:
      "En langsom sinusrytme kan være benign i nogle situationer og alvorlig i andre. Klinikken afgør tyngden.",
  },
  {
    id: "atrial-fibrillation",
    title: "Atrieflimren",
    shortDescription:
      "Uregelmæssig rytme uden tydelige ensartede P-takker.",
    rateDescription: "Frekvensen kan være normal, hurtig eller langsom.",
    regularity: "Rytmen er uregelmæssig uden fast mønster.",
    pWaveDescription: "Der ses ikke tydelige, ensartede P-takker før hvert QRS.",
    prDescription:
      "PR-intervallet kan ikke vurderes sikkert, fordi P-takker ikke er tydelige.",
    qrsDescription: "QRS er ofte smalt, medmindre der er anden ledningspåvirkning.",
    likelyRhythm: "Fundene taler for atrieflimren.",
    ambulanceRelevance:
      "Beskriv frekvens, symptomer, varighed hvis kendt, og tegn på kredsløbspåvirkning ved overlevering.",
    commonPitfall:
      "At kalde enhver uregelmæssig rytme atrieflimren uden at lede efter P-takker og mønster.",
    explanation:
      "Atrieflimren genkendes især på uregelmæssig rytme og manglende organiserede P-takker.",
  },
  {
    id: "svt",
    title: "SVT",
    shortDescription:
      "Meget hurtig og regelmæssig smalkomplekset rytme.",
    rateDescription: "Frekvensen er tydeligt hurtig.",
    regularity: "Rytmen er regelmæssig.",
    pWaveDescription: "P-takker kan være skjulte eller svære at adskille.",
    prDescription: "PR-intervallet kan ofte ikke vurderes sikkert.",
    qrsDescription: "QRS er smalt.",
    likelyRhythm:
      "Fundene kan passe med supraventrikulær takykardi, afhængigt af klinik og optagelse.",
    ambulanceRelevance:
      "Vurder patientens påvirkning og kommuniker debut, symptomer, frekvens og stabilitet klart.",
    commonPitfall:
      "At overse at hurtige regelmæssige rytmer skal vurderes sammen med QRS-bredde og patientens tilstand.",
    explanation:
      "SVT bruges ofte som praktisk betegnelse for hurtige rytmer over ventriklerne, typisk med smalt QRS.",
  },
  {
    id: "wide-complex-tachycardia",
    title: "Bredkomplekset takykardi / mulig VT",
    shortDescription:
      "Hurtig rytme med brede QRS-komplekser og potentiel alvorlig betydning.",
    rateDescription: "Frekvensen er hurtig.",
    regularity: "Rytmen er ofte regelmæssig, men vurder optagelsen nøje.",
    pWaveDescription: "P-takker er ofte ikke tydelige eller ikke sikkert koblet til QRS.",
    prDescription: "PR-intervallet kan ikke vurderes pålideligt.",
    qrsDescription: "QRS-komplekserne er brede.",
    likelyRhythm:
      "Fundene skal give mistanke om bredkomplekset takykardi, herunder mulig VT.",
    ambulanceRelevance:
      "Dette er en rytme, hvor klinisk påvirkning, hurtig vurdering og tydelig overlevering er særligt vigtig.",
    commonPitfall:
      "At antage at en bred takykardi er ufarlig SVT med aberration uden at tænke mulig VT.",
    explanation:
      "Bred QRS ved takykardi er et alvorligt fund. I træning bør rytmen håndteres konservativt og beskrives præcist.",
  },
  {
    id: "asystole",
    title: "Asystoli / ekstremt alvorlig rytme",
    shortDescription:
      "Ingen tydelig organiseret elektrisk aktivitet i en kritisk situation.",
    rateDescription: "Der ses ingen egentlig ventrikulær frekvens.",
    regularity: "Der er ingen organiseret rytme at vurdere.",
    pWaveDescription: "Der ses ingen brugbare P-takker.",
    prDescription: "PR-interval kan ikke vurderes.",
    qrsDescription: "Der ses ingen tydelige QRS-komplekser.",
    likelyRhythm: "Fundene passer med asystoli, hvis optagelsen er teknisk valid.",
    ambulanceRelevance:
      "Bekræft altid kontekst, patienttilstand og teknisk signal; overlever fund og usikkerhed tydeligt.",
    commonPitfall:
      "At overse tekniske årsager som løs elektrode, lav amplitude eller forkert visning.",
    explanation:
      "Asystoli er en ekstremt alvorlig rytmebeskrivelse, men den skal altid holdes op mod patient og signalteknik.",
  },
  {
    id: "av-block",
    title: "AV-blok som genkendelseseksempel",
    shortDescription:
      "Langsom rytme hvor forholdet mellem P-takker og QRS kræver ekstra opmærksomhed.",
    rateDescription: "Frekvensen kan være langsom.",
    regularity:
      "Rytmen kan virke regelmæssig eller have pauser afhængigt af bloktypen.",
    pWaveDescription:
      "P-takker kan ses, men de leder ikke nødvendigvis til hvert QRS.",
    prDescription:
      "PR-intervallet kan være forlænget, varierende eller have manglende overledning.",
    qrsDescription: "QRS kan være smalt eller bredt afhængigt af blokniveau.",
    likelyRhythm:
      "Fundene bør give mistanke om AV-ledningsforstyrrelse frem for simpel sinusbradykardi.",
    ambulanceRelevance:
      "Vurder påvirkning, pauser, frekvens og overledningsmønster, og overlever observationerne tydeligt.",
    commonPitfall:
      "At kalde alle langsomme rytmer sinusbradykardi uden at undersøge P-takker og PR-forhold.",
    explanation:
      "AV-blok handler om overledning. Derfor er P-takker, PR-interval og sammenhængen med QRS centrale.",
  },
];
