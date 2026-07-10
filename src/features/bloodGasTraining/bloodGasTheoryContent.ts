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

export const acidBaseMethodSteps = [
  {
    label: "1. Start med pH",
    text: "Vurder om prøven viser acidæmi, ligger i apparatets referenceområde eller viser alkalæmi.",
  },
  {
    label: "2. Se på pCO₂",
    text: "Vurder om CO₂-retningen kan bidrage respiratorisk til pH-forandringen. Husk at prøven er venøs.",
  },
  {
    label: "3. Se på HCO₃⁻ og BE",
    text: "Brug bicarbonat og base excess som støtte til den metaboliske del af syre-base-billedet.",
  },
  {
    label: "4. Overvej kompensation",
    text: "Spørg om den anden komponent bevæger sig i en forventelig retning, uden at antage at kompensation gør patienten upåvirket.",
  },
  {
    label: "5. Find støtteværdier",
    text: "Se på laktat, glukose, elektrolytter, urea, kreatinin og CRP for at beskrive det samlede mønster.",
  },
  {
    label: "6. Sammenhold med patienten",
    text: "Kobl fundene til symptomer, ABCDE, vitale værdier, tidsforløb og årsager der stadig skal undersøges.",
  },
  {
    label: "7. Kontrollér begrænsninger",
    text: "Notér prøvetype, prøvekvalitet, apparatets referenceområder, trends og lokal vejledning før du konkluderer noget.",
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

export const ambulanceFocusPoints = [
  "Fortolk værdier sammen med ABCDE, symptomer og vitale parametre.",
  "Trends og gentagne målinger kan være mere informative end én isoleret prøve.",
  "Prøvekvalitet, prøvetagningstidspunkt og venøs prøvetype kan ændre fortolkningen.",
  "CRP er ikke infektionsspecifik og ændrer sig over tid.",
  "Overlever prøvetype, væsentlige afvigelser, klinisk kontekst og kendte trends.",
  "Brug altid apparatets referenceområder, lokal vejledning og relevante kliniske procedurer.",
] as const;
