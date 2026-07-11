export type BloodGasAnalyte = {
  id: string;
  name: string;
  unit: string;
  reflects: string;
  prehospitalRelevance: string;
  commonPitfall: string;
  limitations: string;
};

export type BloodGasPattern = {
  id: string;
  title: string;
  summary: string;
  directions: string[];
  supportingValues: string;
  prehospitalRelevance: string;
  commonPitfall: string;
};

export type BloodGasValueDirection =
  | "low"
  | "reference"
  | "high"
  | "uncertain";

export type BloodGasExampleValue = {
  analyteId: string;
  label: string;
  value: string;
  unit: string;
  direction: BloodGasValueDirection;
  note?: string;
};

export type BloodGasPatternExample = {
  id: string;
  title: string;
  oneLineSummary: string;
  clinicalContext: string;
  values: BloodGasExampleValue[];
  interpretation: string;
  reasoning: string[];
  commonPitfall: string;
  prehospitalRelevance: string;
  limitation: string;
};

export const acidBaseMethodSteps = [
  {
    label: "1. Start med pH",
    text: "Acidæmi, referenceområde eller alkalæmi?",
  },
  {
    label: "2. Se på pCO₂",
    text: "Vurder det respiratoriske bidrag; prøven er venøs.",
  },
  {
    label: "3. Se på HCO₃⁻ og BE",
    text: "Vurder det metaboliske bidrag.",
  },
  {
    label: "4. Overvej kompensation",
    text: "Bevæger den anden komponent sig forventeligt?",
  },
  {
    label: "5. Find støtteværdier",
    text: "Se på laktat, glukose, elektrolytter, renalmarkører og CRP.",
  },
  {
    label: "6. Sammenhold med patienten",
    text: "Kobl fund til ABCDE, symptomer, vitalparametre og forløb.",
  },
  {
    label: "7. Kontrollér begrænsninger",
    text: "Tjek prøvetype, kvalitet, trends og lokale referenceområder.",
  },
] as const;

export const bloodGasAnalytes: BloodGasAnalyte[] = [
  {
    id: "ph",
    name: "pH",
    unit: "Ingen enhed",
    reflects: "Den samlede syre-base-retning i prøven.",
    prehospitalRelevance: "Giver et hurtigt udgangspunkt for at beskrive acidæmi eller alkalæmi sammen med resten af blodgassen.",
    commonPitfall: "At stoppe ved pH og overse en kompenseret eller blandet forstyrrelse.",
    limitations: "Et pH-tal forklarer ikke årsagen og skal kobles til pCO₂, HCO₃⁻, BE, klinik og prøvetype.",
  },
  {
    id: "pco2",
    name: "pCO₂",
    unit: "kPa eller mmHg afhængigt af apparat",
    reflects: "CO₂-indholdets respiratoriske bidrag til syre-base-billedet.",
    prehospitalRelevance: "Kan støtte mistanke om ændret ventilation, når værdien ses sammen med pH, respirationsarbejde og øvrige fund.",
    commonPitfall: "At læse en venøs pCO₂ som om den var en præcis arteriel værdi.",
    limitations: "Venøse og arterielle værdier er ikke direkte udskiftelige; brug apparat, prøvetype og lokal vejledning.",
  },
  {
    id: "hco3",
    name: "HCO₃⁻",
    unit: "mmol/L",
    reflects: "Bicarbonat og dermed en vigtig del af den metaboliske syre-base-komponent.",
    prehospitalRelevance: "Støtter vurderingen af metabolisk bidrag og mulig kompensation.",
    commonPitfall: "At tolke bicarbonat isoleret uden pH, pCO₂ og BE.",
    limitations: "Kan være beregnet af apparatet og påvirkes af både primære processer og kompensation.",
  },
  {
    id: "be",
    name: "BE / base excess",
    unit: "mmol/L",
    reflects: "Et beregnet udtryk for metabolisk syre- eller baseoverskud.",
    prehospitalRelevance: "Kan gøre den metaboliske retning tydeligere sammen med pH og HCO₃⁻.",
    commonPitfall: "At bruge BE som en selvstændig diagnose eller som mål for én bestemt årsag.",
    limitations: "Er en beregnet støtteværdi og skal fortolkes i den samlede syre-base- og kliniske kontekst.",
  },
  {
    id: "lactate",
    name: "Lactate",
    unit: "mmol/L",
    reflects: "Balancen mellem laktatproduktion og kroppens omsætning eller elimination.",
    prehospitalRelevance: "En forhøjelse kan støtte mistanke om fysiologisk belastning eller hypoperfusion og kan være nyttig som trend.",
    commonPitfall: "At ligestille forhøjet laktat med én diagnose eller én mekanisme.",
    limitations: "Kan påvirkes af flere tilstande, medicin, muskelarbejde, prøvetagning og tid siden belastningen.",
  },
  {
    id: "glucose",
    name: "Glucose",
    unit: "mmol/L",
    reflects: "Aktuelt blodsukkerniveau i prøven.",
    prehospitalRelevance: "Er relevant ved blandt andet ændret bevidsthed og kan støtte et metabolisk mønster.",
    commonPitfall: "At forklare hele patientens tilstand ud fra glukose alene.",
    limitations: "Skal ses sammen med symptomer, syre-base, tidsforløb og andre relevante målinger.",
  },
  {
    id: "sodium",
    name: "Na⁺",
    unit: "mmol/L",
    reflects: "Natriumkoncentration og en del af kroppens væske- og osmolaritetsbalance.",
    prehospitalRelevance: "Markante afvigelser kan være relevante ved neurologiske symptomer eller ændret bevidsthed.",
    commonPitfall: "At vurdere natrium uden væskestatus, glukose, udvikling og kliniske symptomer.",
    limitations: "En enkelt måling viser ikke hastigheden af ændringen eller den underliggende årsag.",
  },
  {
    id: "potassium",
    name: "K⁺",
    unit: "mmol/L",
    reflects: "Kaliumkoncentration, som har betydning for blandt andet elektrisk aktivitet i hjertet.",
    prehospitalRelevance: "En tydelig afvigelse kan være relevant sammen med EKG, nyrefunktion, medicin og klinisk tilstand.",
    commonPitfall: "At overse hæmolyse eller anden prøvefejl som forklaring på et uventet resultat.",
    limitations: "Prøvekvalitet er afgørende, og værdien må ikke stå alene ved vurdering af rytme eller risiko.",
  },
  {
    id: "chloride",
    name: "Cl⁻",
    unit: "mmol/L",
    reflects: "Kloridkoncentration og dens relation til væske- og syre-base-balance.",
    prehospitalRelevance: "Kan støtte beskrivelsen af elektrolyt- og metaboliske mønstre.",
    commonPitfall: "At lægge stor vægt på klorid uden natrium, bicarbonat, væskehistorik og samlet klinik.",
    limitations: "Er oftest en støtteværdi og forklarer sjældent patientens tilstand alene.",
  },
  {
    id: "urea",
    name: "Urea",
    unit: "mmol/L",
    reflects: "Et affaldsstof påvirket af blandt andet nyrefunktion, væskestatus og proteinomsætning.",
    prehospitalRelevance: "Kan sammen med kreatinin, elektrolytter og klinik støtte mistanke om renal eller væskemæssig påvirkning.",
    commonPitfall: "At bruge en isoleret forhøjelse som sikker dokumentation for akut nyresvigt.",
    limitations: "Påvirkes af flere ikke-renale faktorer, og baseline samt udvikling er ofte ukendt præhospitalt.",
  },
  {
    id: "creatinine",
    name: "Creatinine",
    unit: "µmol/L",
    reflects: "En markør der bruges som støtte ved vurdering af nyrefunktion.",
    prehospitalRelevance: "Kan være relevant sammen med elektrolytter, væskestatus, medicin og kendt nyresygdom.",
    commonPitfall: "At kalde en enkelt værdi akut uden kendskab til patientens baseline eller trend.",
    limitations: "Kan ændre sig langsomt og påvirkes af blandt andet muskelmasse; én værdi beskriver ikke sikkert den aktuelle udvikling.",
  },
  {
    id: "crp",
    name: "CRP",
    unit: "mg/L",
    reflects: "En uspecifik markør for kroppens inflammatoriske respons.",
    prehospitalRelevance: "Kan støtte den samlede vurdering og overlevering, især når tidsforløb og øvrige fund er kendt.",
    commonPitfall: "At bruge CRP alene til at afgøre om en tilstand er infektiøs, bakteriel eller alvorlig.",
    limitations: "CRP ændrer sig over tid, er ikke infektionsspecifik og kan være lav tidligt i et sygdomsforløb.",
  },
];

export const venousLimitations = [
  "VGAS er en venøs prøve og må ikke læses som en arteriel blodgas.",
  "Venøs pH og HCO₃⁻ kan ofte støtte en praktisk syre-base-vurdering, men skal stadig ses i kontekst.",
  "Venøs pCO₂ kræver forsigtig fortolkning og kan ikke uden videre erstatte en arteriel værdi.",
  "Venøs pO₂ og cSO₂ må ikke behandles som mål for arteriel iltning.",
  "Vurder iltning med patientens kliniske tilstand, SpO₂, prøvetype og relevante lokale metoder.",
] as const;

export const bloodGasPatterns: BloodGasPattern[] = [
  {
    id: "normal-ish",
    title: "Normal-ish VGAS",
    summary: "Et mønster uden en tydelig større syre-base-afvigelse i de viste værdier.",
    directions: ["pH: referenceområde", "pCO₂: ingen tydelig hovedafvigelse", "HCO₃⁻/BE: ingen tydelig hovedafvigelse"],
    supportingValues: "Laktat, glukose, elektrolytter, renalmarkører og CRP kan stadig være afvigende.",
    prehospitalRelevance: "Kan gøre en udtalt syre-base-forstyrrelse mindre sandsynlig i prøven, men siger ikke at patienten er upåvirket.",
    commonPitfall: "At sidestille en blodgas tæt på referenceområdet med en rask eller stabil patient.",
  },
  {
    id: "metabolic-acidosis",
    title: "Primær metabolisk acidose",
    summary: "Et mønster som kan være konsistent med et primært metabolisk syreoverskud.",
    directions: ["pH: lav", "HCO₃⁻: lav", "BE: negativ", "pCO₂: ofte lavere ved respiratorisk kompensation"],
    supportingValues: "Laktat, glukose, klorid, kalium og renalmarkører kan hjælpe med at beskrive mulige sammenhænge.",
    prehospitalRelevance: "Understreger behovet for at koble syre-base-forstyrrelsen til perfusion, respiration, metabolik og sygdomshistorie.",
    commonPitfall: "At udpege én årsag uden klinik eller at antage at kompensation normaliserer risikoen.",
  },
  {
    id: "respiratory-acidosis",
    title: "Respiratorisk acidose",
    summary: "Et mønster som kan støtte mistanke om et primært respiratorisk CO₂-bidrag.",
    directions: ["pH: lav", "pCO₂: høj", "HCO₃⁻/BE: kan variere med varighed og kompensation"],
    supportingValues: "Respirationsarbejde, frekvens, bevidsthed, SpO₂ og kendt sygdom er centrale støttefund.",
    prehospitalRelevance: "Sammenhold blodgassen med ventilation og klinisk udvikling; prøven afgør ikke årsagen alene.",
    commonPitfall: "At behandle venøs pCO₂ som en præcis arteriel værdi eller overse et blandet billede.",
  },
  {
    id: "respiratory-alkalosis",
    title: "Respiratorisk alkalose",
    summary: "Et mønster som kan støtte mistanke om et primært respiratorisk lavt CO₂-bidrag.",
    directions: ["pH: høj", "pCO₂: lav", "HCO₃⁻/BE: kan variere med varighed og kompensation"],
    supportingValues: "Respirationsmønster, smerter, temperatur, kredsløb og øvrige symptomer kan være relevante.",
    prehospitalRelevance: "Beskriv mønsteret og find den kliniske sammenhæng frem for at antage én årsag.",
    commonPitfall: "At forklare et højt pH med hyperventilation uden at undersøge hvorfor patienten hyperventilerer.",
  },
  {
    id: "hyperglycaemic-acidosis",
    title: "Hyperglykæmi med metabolisk-acidose-mønster",
    summary: "Et kombineret mønster der kan støtte mistanke om en alvorlig metabolisk forstyrrelse.",
    directions: ["Glukose: høj", "pH: lav", "HCO₃⁻: lav", "BE: negativ", "pCO₂: kan være lav ved kompensation"],
    supportingValues: "Kalium, natrium, laktat, renalmarkører, ketonmåling hvis tilgængelig og klinisk kontekst er vigtige.",
    prehospitalRelevance: "Mønstret er relevant ved dehydrering, påvirket bevidsthed eller anden metabolisk påvirkning, men er ikke en diagnose alene.",
    commonPitfall: "At kalde mønsteret DKA uden ketoner, klinik og relevante differentialdiagnoser.",
  },
  {
    id: "hypoperfusion-lactate",
    title: "Hypoperfusion / forhøjet-laktat-mønster",
    summary: "Forhøjet laktat kan støtte mistanke om fysiologisk belastning eller utilstrækkelig perfusion.",
    directions: ["Laktat: høj", "pH/HCO₃⁻/BE: kan vise metabolisk acidose, men kan også være mindre påvirket"],
    supportingValues: "Blodtryk, hud, kapillærrespons, bevidsthed, puls, temperatur og trend er afgørende.",
    prehospitalRelevance: "En trend kan være mere informativ end én måling, og fundet skal indgå i den samlede kredsløbsvurdering.",
    commonPitfall: "At antage at alle laktatstigninger skyldes shock eller at et normalt laktat udelukker alvorlig sygdom.",
  },
  {
    id: "inflammation-crp",
    title: "Inflammation / forhøjet-CRP-mønster",
    summary: "En forhøjet CRP kan støtte at der foregår en inflammatorisk proces.",
    directions: ["CRP: høj", "VGAS: kan være normal-ish eller vise andre samtidige forstyrrelser"],
    supportingValues: "Temperatur, symptomer, tidsforløb, vitalparametre, laktat og klinisk fokus er vigtigere end CRP alene.",
    prehospitalRelevance: "CRP kan bidrage til overleveringen, men kan hverken alene bekræfte infektion eller graduere hele patientens risiko.",
    commonPitfall: "At fortolke høj CRP som sikkert bakteriel infektion eller lav CRP som sikkert fravær af alvorlig sygdom.",
  },
  {
    id: "renal-electrolyte",
    title: "Renal påvirkning / elektrolyt-mønster",
    summary: "Et mønster med renalmarkører og elektrolytter som kan støtte mistanke om nyre- eller væskerelateret påvirkning.",
    directions: ["Creatinine/urea: kan være høje", "K⁺/Na⁺/Cl⁻: kan være afvigende", "HCO₃⁻/BE: kan vise metabolisk bidrag"],
    supportingValues: "Baseline, diurese, væskestatus, medicin, EKG og sygdomsforløb er vigtige.",
    prehospitalRelevance: "Beskriv de konkrete afvigelser og klinikken; prøven afgør ikke om påvirkningen er akut eller kronisk.",
    commonPitfall: "At kalde en ukendt kreatininværdi akut eller forklare alle elektrolytafvigelser med nyresvigt.",
  },
];

export const bloodGasPatternExamples: BloodGasPatternExample[] = [
  {
    id: "normal-ish",
    title: "Ingen tydelig hovedafvigelse",
    oneLineSummary: "De viste syre-base-værdier ligger inden for forventet område.",
    clinicalContext: "En venøs prøve uden en tydelig syre-base-forstyrrelse. Patienten skal stadig vurderes ud fra symptomer og vitalparametre.",
    values: [
      { analyteId: "ph", label: "pH", value: "7,37", unit: "uden enhed", direction: "reference" },
      { analyteId: "pco2", label: "pCO₂", value: "5,8", unit: "kPa", direction: "reference" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "25", unit: "mmol/L", direction: "reference" },
      { analyteId: "be", label: "BE", value: "0", unit: "mmol/L", direction: "reference" },
      { analyteId: "lactate", label: "Lactate", value: "1,3", unit: "mmol/L", direction: "reference" },
    ],
    interpretation: "De viste værdier har ingen tydelig syre-base-hovedafvigelse.",
    reasoning: [
      "pH ligger inden for forventet område.",
      "pCO₂, HCO₃⁻ og BE peger ikke på én tydelig primær komponent.",
      "Laktat er ikke forhøjet i dette eksempel.",
    ],
    commonPitfall: "At tolke upåfaldende tal som tegn på, at patienten er upåvirket.",
    prehospitalRelevance: "Hold tallene op mod ABCDE, symptomer og vitalparametre.",
    limitation: "Referenceområder varierer, og prøven er kun et øjebliksbillede.",
  },
  {
    id: "metabolic-acidosis",
    title: "Primær metabolisk acidose",
    oneLineSummary: "Lav pH, lav HCO₃⁻, negativ BE og lav pCO₂ som mulig kompensation.",
    clinicalContext: "Venøs prøve med acidæmi og et tydeligt metabolisk bidrag.",
    values: [
      { analyteId: "ph", label: "pH", value: "7,22", unit: "uden enhed", direction: "low" },
      { analyteId: "pco2", label: "pCO₂", value: "4,0", unit: "kPa", direction: "low", note: "Kan passe med respiratorisk kompensation." },
      { analyteId: "hco3", label: "HCO₃⁻", value: "13", unit: "mmol/L", direction: "low" },
      { analyteId: "be", label: "BE", value: "-13", unit: "mmol/L", direction: "low", note: "Negativ base excess støtter metabolisk bidrag." },
      { analyteId: "lactate", label: "Lactate", value: "2,1", unit: "mmol/L", direction: "uncertain" },
    ],
    interpretation: "Værdierne er forenelige med overvejende metabolisk acidose.",
    reasoning: [
      "Lav pH viser acidæmi.",
      "Lav HCO₃⁻ og negativ BE støtter et metabolisk hovedbidrag.",
      "Lav pCO₂ kan være en respiratorisk kompensationsretning.",
    ],
    commonPitfall: "At udpege årsagen alene fra syre-base-mønstret.",
    prehospitalRelevance: "Se især på perfusion, respiration, glukose, laktat, elektrolytter og udvikling.",
    limitation: "Eksemplet vurderer ikke om kompensationen er tilstrækkelig eller om der findes en blandet forstyrrelse.",
  },
  {
    id: "respiratory-acidosis",
    title: "Respiratorisk acidose",
    oneLineSummary: "Lav pH og høj venøs pCO₂; HCO₃⁻ og BE afhænger blandt andet af varighed.",
    clinicalContext: "Venøs prøve med acidæmi og forhøjet pCO₂.",
    values: [
      { analyteId: "ph", label: "pH", value: "7,24", unit: "uden enhed", direction: "low" },
      { analyteId: "pco2", label: "pCO₂", value: "8,2", unit: "kPa", direction: "high", note: "Venøs pCO₂ skal fortolkes forsigtigt." },
      { analyteId: "hco3", label: "HCO₃⁻", value: "26", unit: "mmol/L", direction: "uncertain" },
      { analyteId: "be", label: "BE", value: "+1", unit: "mmol/L", direction: "uncertain" },
    ],
    interpretation: "Mønstret passer bedst med overvejende respiratorisk acidose.",
    reasoning: [
      "pH viser acidæmi.",
      "pCO₂ er høj i den venøse prøve og bevæger sig i acidotisk retning.",
      "HCO₃⁻ og BE kan ikke alene afgøre varighed eller årsag.",
    ],
    commonPitfall: "At læse venøs pCO₂ som en præcis arteriel værdi.",
    prehospitalRelevance: "Kobl mønstret til respirationsarbejde, frekvens, bevidsthed, SpO₂ og klinisk udvikling.",
    limitation: "Prøven beskriver ikke arteriel oxygenation og fastslår ikke årsagen til ændret ventilation.",
  },
  {
    id: "respiratory-alkalosis",
    title: "Respiratorisk alkalose",
    oneLineSummary: "Høj pH og lav pCO₂; HCO₃⁻ og BE kan variere med varigheden.",
    clinicalContext: "Venøs prøve med alkalæmi og lav pCO₂.",
    values: [
      { analyteId: "ph", label: "pH", value: "7,48", unit: "uden enhed", direction: "high" },
      { analyteId: "pco2", label: "pCO₂", value: "3,5", unit: "kPa", direction: "low" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "21", unit: "mmol/L", direction: "uncertain" },
      { analyteId: "be", label: "BE", value: "-2", unit: "mmol/L", direction: "uncertain" },
    ],
    interpretation: "Mønstret passer bedst med overvejende respiratorisk alkalose.",
    reasoning: [
      "pH er høj.",
      "Lav pCO₂ bevæger pH i alkalotisk retning.",
      "HCO₃⁻ og BE skal vurderes i forhold til varighed og øvrig klinik.",
    ],
    commonPitfall: "At antage én årsag til hyperventilation uden at undersøge patienten bredt.",
    prehospitalRelevance: "Sammenhold med respirationsmønster, kredsløb, temperatur, smerter og øvrige symptomer.",
    limitation: "Et enkelt prøvesæt viser ikke sikkert varighed eller om en blandet proces er til stede.",
  },
  {
    id: "hyperglycaemic-acidosis",
    title: "Svær hyperglykæmi med metabolisk-acidose-mønster",
    oneLineSummary: "Høj glukose sammen med lav pH, lav HCO₃⁻ og negativ BE.",
    clinicalContext: "Venøs prøve med svær hyperglykæmi og samtidig metabolisk syrepåvirkning.",
    values: [
      { analyteId: "glucose", label: "Glucose", value: "28", unit: "mmol/L", direction: "high" },
      { analyteId: "ph", label: "pH", value: "7,18", unit: "uden enhed", direction: "low" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "11", unit: "mmol/L", direction: "low" },
      { analyteId: "be", label: "BE", value: "-15", unit: "mmol/L", direction: "low" },
      { analyteId: "pco2", label: "pCO₂", value: "3,6", unit: "kPa", direction: "low" },
      { analyteId: "potassium", label: "K⁺", value: "5,3", unit: "mmol/L", direction: "uncertain", note: "Kalium skal ses i samlet metabolisk kontekst." },
    ],
    interpretation: "Mønstret kan støtte mistanke om metabolisk påvirkning ved svær hyperglykæmi.",
    reasoning: [
      "Glukose er markant forhøjet i eksemplet.",
      "Lav pH, lav HCO₃⁻ og negativ BE viser et metabolisk acidosebidrag.",
      "Lav pCO₂ kan passe med respiratorisk kompensation.",
    ],
    commonPitfall: "At konkludere en bestemt tilstand uden ketoner, klinik og differentialdiagnoser.",
    prehospitalRelevance: "Beskriv bevidsthed, væskestatus, vitalparametre, glukose, syre-base og elektrolytter ved overlevering.",
    limitation: "Værdierne kan ikke alene fastslå årsagen til hyperglykæmi eller acidose.",
  },
  {
    id: "hypoperfusion-lactate",
    title: "Hypoperfusion / forhøjet-laktat-mønster",
    oneLineSummary: "Højt laktat med mulig acidæmi og negativ BE; vitalparametre er afgørende.",
    clinicalContext: "Venøs prøve med forhøjet laktat og tegn på metabolisk syrepåvirkning.",
    values: [
      { analyteId: "lactate", label: "Lactate", value: "5,8", unit: "mmol/L", direction: "high" },
      { analyteId: "ph", label: "pH", value: "7,28", unit: "uden enhed", direction: "low" },
      { analyteId: "be", label: "BE", value: "-8", unit: "mmol/L", direction: "low" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "18", unit: "mmol/L", direction: "low" },
      { analyteId: "pco2", label: "pCO₂", value: "4,7", unit: "kPa", direction: "uncertain" },
    ],
    interpretation: "Mønstret kan passe med fysiologisk belastning og metabolisk syrepåvirkning.",
    reasoning: [
      "Laktat er forhøjet.",
      "Lav pH, lav HCO₃⁻ og negativ BE viser samtidig metabolisk påvirkning.",
      "Årsagen kan ikke udledes af laktat alene.",
    ],
    commonPitfall: "At sidestille ethvert forhøjet laktat med shock.",
    prehospitalRelevance: "Vurder trend sammen med blodtryk, hud, kapillærrespons, puls, bevidsthed og temperatur.",
    limitation: "Laktat påvirkes af flere mekanismer, medicin, muskelarbejde, prøvetagning og timing.",
  },
  {
    id: "inflammation-crp",
    title: "Inflammation / forhøjet-CRP-mønster",
    oneLineSummary: "Høj CRP med ellers variabel VGAS; tidsforløb og klinik vejer tungt.",
    clinicalContext: "Forhøjet CRP uden en samtidig tydelig syre-base-forstyrrelse.",
    values: [
      { analyteId: "crp", label: "CRP", value: "180", unit: "mg/L", direction: "high" },
      { analyteId: "ph", label: "pH", value: "7,38", unit: "uden enhed", direction: "reference" },
      { analyteId: "lactate", label: "Lactate", value: "1,8", unit: "mmol/L", direction: "uncertain" },
      { analyteId: "glucose", label: "Glucose", value: "7,5", unit: "mmol/L", direction: "uncertain" },
    ],
    interpretation: "Forhøjet CRP kan passe med inflammation, men fundet er uspecifikt.",
    reasoning: [
      "CRP er forhøjet i eksemplet.",
      "Syre-base-værdierne viser ikke samtidig en tydelig hovedforstyrrelse.",
      "CRP skal forstås ud fra symptomer, timing, vitalparametre og fokus.",
    ],
    commonPitfall: "At bruge CRP som bevis for bakteriel infektion eller som mål for hele patientens risiko.",
    prehospitalRelevance: "Overlever CRP sammen med prøvetidspunkt, klinisk fokus, vitalparametre og kendt udvikling.",
    limitation: "CRP er ikke infektionsspecifik, ændrer sig over tid og kan halte efter den kliniske tilstand.",
  },
  {
    id: "renal-electrolyte",
    title: "Renal påvirkning / elektrolyt-mønster",
    oneLineSummary: "Høj creatinine og urea, afvigende K⁺ og muligt metabolisk acidosebidrag.",
    clinicalContext: "Venøs prøve med påvirkede nyretal, forhøjet kalium og ukendt udgangspunkt.",
    values: [
      { analyteId: "creatinine", label: "Creatinine", value: "320", unit: "µmol/L", direction: "high" },
      { analyteId: "urea", label: "Urea", value: "22", unit: "mmol/L", direction: "high" },
      { analyteId: "potassium", label: "K⁺", value: "6,1", unit: "mmol/L", direction: "high", note: "Prøvekvalitet og EKG-kontekst er vigtige." },
      { analyteId: "ph", label: "pH", value: "7,25", unit: "uden enhed", direction: "low" },
      { analyteId: "hco3", label: "HCO₃⁻", value: "15", unit: "mmol/L", direction: "low" },
      { analyteId: "be", label: "BE", value: "-10", unit: "mmol/L", direction: "low" },
    ],
    interpretation: "Mønstret passer med nyrepåvirkning, elektrolytforstyrrelse og metabolisk syrepåvirkning.",
    reasoning: [
      "Creatinine og urea er forhøjede i eksemplet.",
      "Kalium er forhøjet og skal vurderes sammen med prøvekvalitet og EKG.",
      "Lav pH, lav HCO₃⁻ og negativ BE viser et metabolisk acidosebidrag.",
    ],
    commonPitfall: "At kalde påvirkningen akut uden baseline eller at forklare alle fund med nyresvigt.",
    prehospitalRelevance: "Overlever konkrete værdier, prøvekvalitet, EKG-fund, væskestatus, medicin og kendt nyrehistorik.",
    limitation: "Én prøve kan ikke afgøre om renal påvirkning er akut eller kronisk.",
  },
];

export const ambulanceFocusPoints = [
  "Fortolk værdier sammen med ABCDE, symptomer og vitale parametre.",
  "Trends og gentagne målinger kan være mere informative end én isoleret prøve.",
  "Prøvekvalitet, prøvetagningstidspunkt og venøs prøvetype kan ændre fortolkningen.",
  "CRP er ikke infektionsspecifik og ændrer sig over tid.",
  "Overlever prøvetype, væsentlige afvigelser, klinisk kontekst og kendte trends.",
  "Brug altid apparatets referenceområder, lokal vejledning og relevante kliniske procedurer.",
] as const;
