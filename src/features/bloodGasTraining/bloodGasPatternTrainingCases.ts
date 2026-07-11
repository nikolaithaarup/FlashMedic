import type { BloodGasPatternId, BloodGasValueDirection } from "./bloodGasTrainingCases";

export type BloodGasPatternTrainingValue = {
  analyteId: string;
  label: string;
  unit: string;
  expectedDirection: BloodGasValueDirection;
  explanation: string;
};

export type BloodGasPatternTrainingCase = {
  id: string;
  title: string;
  neutralTitle: string;
  level: "intro" | "intermediate" | "advanced";
  patternId: BloodGasPatternId;
  scenario: string;
  taskPrompt: string;
  valuesToPredict: BloodGasPatternTrainingValue[];
  acceptedAlternatives?: Record<string, BloodGasValueDirection[]>;
  keyLearningPoint: string;
  commonPitfall: string;
  prehospitalRelevance: string;
  limitation: string;
};

const value = (analyteId: string, label: string, unit: string, expectedDirection: BloodGasValueDirection, explanation: string): BloodGasPatternTrainingValue => ({ analyteId, label, unit, expectedDirection, explanation });

export const bloodGasPatternTrainingCases: BloodGasPatternTrainingCase[] = [
  {
    id: "pattern-primary-metabolic-acidosis", title: "Primær metabolisk acidose", neutralTitle: "Mønstercase", level: "intro", patternId: "primary-metabolic-acidosis",
    scenario: "Patienten er alment påvirket med hurtig respiration. Du overvejer en metabolisk syre-base-påvirkning, men årsagen er endnu uklar.", taskPrompt: "Hvad forventer du? Vælg retning for hver værdi.",
    valuesToPredict: [
      value("ph", "pH", "uden enhed", "low", "Ved metabolisk acidose er pH typisk lav."),
      value("hco3", "HCO₃⁻", "mmol/L", "low", "HCO₃⁻ er ofte lav og støtter den metaboliske påvirkning."),
      value("be", "BE", "mmol/L", "low", "BE er typisk negativ ved metabolisk acidose."),
      value("pco2", "pCO₂", "kPa", "uncertain", "pCO₂ kan falde ved respiratorisk kompensation, men afhænger af timing og ventilation."),
      value("lactate", "Lactate", "mmol/L", "uncertain", "Metabolisk acidose fortæller ikke i sig selv, om laktat er forhøjet."),
    ], acceptedAlternatives: { pco2: ["low"] },
    keyLearningPoint: "Lav HCO₃⁻ og negativ BE støtter en metabolisk påvirkning. pCO₂ kan falde som kompensation.", commonPitfall: "At tolke en lav pCO₂ som en selvstændig respiratorisk alkalose.", prehospitalRelevance: "Sammenhold prøven med respiration, perfusion og udvikling over tid.", limitation: "Årsag og graden af kompensation kan ikke vurderes sikkert ud fra mønstret alene.",
  },
  {
    id: "pattern-respiratory-acidosis", title: "Respiratorisk acidose", neutralTitle: "Mønstercase", level: "intermediate", patternId: "respiratory-acidosis",
    scenario: "Patient med flere dages hoste og tiltagende åndenød er nu træt og respiratorisk presset. Du overvejer CO₂-retention, men kender ikke patientens normale niveau.", taskPrompt: "Hvad vil du typisk forvente, når varighed og kompensation er ukendt?",
    valuesToPredict: [value("ph", "pH", "uden enhed", "low", "pH er ofte lav, men kan ligge tættere på forventet område ved kompensation."), value("pco2", "pCO₂", "kPa", "high", "Ved CO₂-retention er pCO₂ typisk forhøjet."), value("hco3", "HCO₃⁻", "mmol/L", "uncertain", "HCO₃⁻ kan ligge i forventet område eller være forhøjet afhængigt af varigheden."), value("be", "BE", "mmol/L", "uncertain", "BE kan variere med kompensation og samtidige processer.")],
    acceptedAlternatives: { ph: ["reference"], hco3: ["reference", "high"] }, keyLearningPoint: "Høj pCO₂ er det centrale fund. pH og HCO₃⁻ kan variere med varigheden.", commonPitfall: "At afgøre, om tilstanden er akut eller kronisk, ud fra én prøve.", prehospitalRelevance: "Vurder ventilation, bevidsthed og ændringer undervejs.", limitation: "Kompensation og patientens normale niveau kan ikke vurderes sikkert ud fra én venøs prøve.",
  },
  {
    id: "pattern-respiratory-alkalosis", title: "Respiratorisk alkalose", neutralTitle: "Mønstercase", level: "intermediate", patternId: "respiratory-alkalosis",
    scenario: "Patienten trækker vejret hurtigt og dybt. Årsagen til den øgede ventilation er endnu uklar, og du overvejer en respiratorisk alkalotisk påvirkning.", taskPrompt: "Hvad forventer du at se i prøven?",
    valuesToPredict: [value("ph", "pH", "uden enhed", "high", "Lav pCO₂ trækker typisk pH i alkalotisk retning."), value("pco2", "pCO₂", "kPa", "low", "Ved øget ventilation er pCO₂ typisk lav."), value("hco3", "HCO₃⁻", "mmol/L", "uncertain", "HCO₃⁻ kan ligge i forventet område eller være lav afhængigt af varigheden."), value("be", "BE", "mmol/L", "uncertain", "BE kan ikke vurderes sikkert uden flere oplysninger.")],
    acceptedAlternatives: { ph: ["reference"], hco3: ["reference", "low"] }, keyLearningPoint: "Lav pCO₂ trækker pH i alkalotisk retning. HCO₃⁻ afhænger blandt andet af varigheden.", commonPitfall: "At tro, at blodgassen også forklarer, hvorfor patienten hyperventilerer.", prehospitalRelevance: "Sammenhold med respirationsmønster, smerter, temperatur og kredsløb.", limitation: "Årsagen til den øgede ventilation kan ikke afgøres ud fra blodgassen alene.",
  },
  {
    id: "pattern-hyperglycaemic-acidosis", title: "Svær hyperglykæmi med metabolisk-acidose-mønster", neutralTitle: "Mønstercase", level: "intermediate", patternId: "hyperglycaemia-metabolic-acidosis",
    scenario: "Patient med kendt diabetes har gennem et døgn været tørstig, haft hyppig vandladning og er nu alment påvirket. Du mistænker udtalt hyperglykæmi med metabolisk syre-base-påvirkning.", taskPrompt: "Vælg den retning, du oftest vil forvente for hver værdi.",
    valuesToPredict: [value("glucose", "Glucose", "mmol/L", "high", "Ved udtalt hyperglykæmi er glukose forhøjet."), value("ph", "pH", "uden enhed", "low", "Den metaboliske syrepåvirkning giver typisk lav pH."), value("hco3", "HCO₃⁻", "mmol/L", "low", "Ved metabolisk acidose er HCO₃⁻ ofte lav."), value("be", "BE", "mmol/L", "low", "BE er ofte negativ."), value("potassium", "K⁺", "mmol/L", "uncertain", "Kalium kan være forhøjet eller ligge anderledes end forventet og siger ikke alene noget sikkert om kroppens samlede kalium.")],
    acceptedAlternatives: { potassium: ["high"] }, keyLearningPoint: "Høj glukose sammen med et metabolisk acidosemønster kan støtte mistanken om en betydelig metabolisk påvirkning.", commonPitfall: "At antage en bestemt kaliumretning eller konkludere en diagnose uden flere oplysninger.", prehospitalRelevance: "Se værdierne sammen med symptomer, væskestatus og udvikling.", limitation: "Ketoner, årsag og alvorlighed kan ikke afgøres sikkert ud fra mønstret alene.",
  },
  {
    id: "pattern-elevated-lactate", title: "Forhøjet laktat / belastningsmønster", neutralTitle: "Mønstercase", level: "intermediate", patternId: "hypoperfusion-elevated-lactate",
    scenario: "Patienten er kold og klam med hurtig puls og nedsat perifer perfusion. Du forventer forhøjet laktat, men ved ikke endnu, hvor tydeligt syre-base-balancen er påvirket.", taskPrompt: "Hvilke værdier er sandsynlige, og hvilke kan stadig variere?",
    valuesToPredict: [value("lactate", "Lactate", "mmol/L", "high", "Ved det beskrevne belastningsbillede forventes laktat at være forhøjet."), value("ph", "pH", "uden enhed", "uncertain", "pH kan være lav eller fortsat ligge i forventet område."), value("be", "BE", "mmol/L", "uncertain", "BE kan være negativ, men afhænger af påvirkningens omfang og andre samtidige processer."), value("pco2", "pCO₂", "kPa", "uncertain", "pCO₂ kan variere med patientens ventilation og andre samtidige processer.")],
    acceptedAlternatives: { ph: ["low", "reference"], be: ["low"] }, keyLearningPoint: "Laktat kan være forhøjet, uden at pH endnu er tydeligt påvirket.", commonPitfall: "At bruge en pH inden for forventet område til at overse laktatstigningen – eller knytte laktat til én bestemt årsag.", prehospitalRelevance: "Følg perfusion, klinisk udvikling og eventuelle nye målinger.", limitation: "Laktat er uspecifikt og skal altid ses sammen med patienten og prøvetidspunktet.",
  },
  {
    id: "pattern-inflammation-crp", title: "Forhøjet CRP / inflammationsmønster", neutralTitle: "Mønstercase", level: "intro", patternId: "inflammation-elevated-crp",
    scenario: "Patienten har haft feber og påvirket almen tilstand gennem et par dage. CRP forventes forhøjet, men der er ikke oplysninger om en tydelig syre-base-påvirkning.", taskPrompt: "Hvad kan du forvente, og hvad kan ikke vurderes sikkert?",
    valuesToPredict: [value("crp", "CRP", "mg/L", "high", "Efter flere dages symptomer forventes CRP at være forhøjet i denne case."), value("ph", "pH", "uden enhed", "uncertain", "CRP fortæller ikke, om pH er påvirket."), value("pco2", "pCO₂", "kPa", "uncertain", "pCO₂ afhænger af patientens ventilation og øvrige tilstand."), value("hco3", "HCO₃⁻", "mmol/L", "uncertain", "CRP alene siger ikke noget sikkert om HCO₃⁻."), value("lactate", "Lactate", "mmol/L", "uncertain", "CRP alene siger ikke noget sikkert om laktat eller akut alvorlighed.")],
    keyLearningPoint: "CRP kan støtte mistanken om inflammation, men siger ikke alene noget sikkert om årsag eller akut alvorlighed.", commonPitfall: "At lade CRP stå alene i vurderingen af patienten.", prehospitalRelevance: "Videregiv CRP sammen med vitalparametre, symptomer og sygdomsvarighed.", limitation: "CRP er uspecifik, ændrer sig over tid og skal ses sammen med patienten.",
  },
  {
    id: "pattern-renal-electrolyte", title: "Nyrepåvirkning / elektrolytmønster", neutralTitle: "Mønstercase", level: "advanced", patternId: "renal-electrolyte-disturbance",
    scenario: "Patient med kendt nedsat nyrefunktion er tiltagende sløv og utilpas. Du forventer påvirkede nyretal, mens elektrolytter og syre-base-status kan variere.", taskPrompt: "Hvilke retninger er sandsynlige, og hvilke kræver konkrete målinger?",
    valuesToPredict: [value("creatinine", "Creatinine", "µmol/L", "high", "Nyrepåvirkningsmønstret omfatter forhøjet creatinine."), value("urea", "Urea", "mmol/L", "high", "Urea er ofte forhøjet, men påvirkes også af andre forhold."), value("potassium", "K⁺", "mmol/L", "uncertain", "Kalium kan være høj, men prøvekvalitet og den konkrete situation betyder meget."), value("hco3", "HCO₃⁻", "mmol/L", "uncertain", "HCO₃⁻ kan være lav ved metabolisk acidose, men det er ikke givet."), value("ph", "pH", "uden enhed", "uncertain", "pH afhænger af sværhedsgrad og samtidige processer.")],
    acceptedAlternatives: { potassium: ["high"], hco3: ["low"], ph: ["low"] }, keyLearningPoint: "Nyretallene kan være forhøjede, mens kalium og syre-base-status afhænger af den konkrete situation.", commonPitfall: "At kalde påvirkningen akut uden baseline eller overse mulig prøvefejl.", prehospitalRelevance: "Sammenhold med EKG, prøvekvalitet, kendte værdier og den kliniske udvikling.", limitation: "En enkelt prøve kan ikke sikkert vise årsag, varighed eller ændring fra patientens normale niveau.",
  },
  {
    id: "pattern-hyponatraemia", title: "Hyponatriæmi-fokuseret mønster", neutralTitle: "Mønstercase", level: "intro", patternId: "renal-electrolyte-disturbance",
    scenario: "Patienten er svimmel og konfus. Du forventer lavt natrium, men har ingen sikre holdepunkter for en samtidig syre-base-forstyrrelse eller glukosepåvirkning.", taskPrompt: "Vælg retning for hver værdi ud fra de oplysninger, du har.",
    valuesToPredict: [value("sodium", "Na⁺", "mmol/L", "low", "Ved hyponatriæmi er natrium lavt."), value("ph", "pH", "uden enhed", "reference", "Uden tegn på syre-base-forstyrrelse forventes pH at ligge inden for forventet område."), value("hco3", "HCO₃⁻", "mmol/L", "reference", "Isoleret hyponatriæmi påvirker ikke nødvendigvis HCO₃⁻."), value("glucose", "Glucose", "mmol/L", "uncertain", "Glukose kan påvirke fortolkningen af natrium, men niveauet er ikke oplyst.")],
    keyLearningPoint: "Lavt natrium kan være hovedfundet, selv om syre-base-værdierne ligger inden for forventet område.", commonPitfall: "At fortolke natrium uden at kende glukose, væskestatus og udvikling.", prehospitalRelevance: "Sammenhold natrium med neurologiske symptomer, væskestatus og glukose.", limitation: "Årsag, varighed og ændringshastighed kan ikke vurderes sikkert ud fra én måling.",
  },
  {
    id: "pattern-broadly-unremarkable", title: "Bredt upåfaldende VGAS", neutralTitle: "Mønstercase", level: "intro", patternId: "normalish",
    scenario: "Patienten er utilpas, men de målte værdier forventes ikke at vise en tydelig syre-base- eller elektrolytforstyrrelse.", taskPrompt: "Hvordan vil værdierne typisk ligge?",
    valuesToPredict: [value("ph", "pH", "uden enhed", "reference", "pH forventes i apparatets referenceområde."), value("pco2", "pCO₂", "kPa", "reference", "Der er ingen oplyst respiratorisk hovedafvigelse."), value("hco3", "HCO₃⁻", "mmol/L", "reference", "Der er ingen oplyst metabolisk hovedafvigelse."), value("be", "BE", "mmol/L", "reference", "BE forventes omkring referenceområdet."), value("lactate", "Lactate", "mmol/L", "reference", "Der er ingen oplyst laktatstigning i mønstret.")],
    keyLearningPoint: "Værdier inden for forventet område er ikke det samme som en upåvirket patient.", commonPitfall: "At lade en upåfaldende prøve overskygge symptomer eller unormale vitalparametre.", prehospitalRelevance: "Patientens tilstand, vitalparametre og udvikling vejer fortsat tungt.", limitation: "En upåfaldende venøs prøve udelukker ikke alvorlig sygdom. Lokale referenceområder gælder.",
  },
  {
    id: "pattern-mixed-uncertain", title: "Blandet eller usikkert billede", neutralTitle: "Mønstercase", level: "advanced", patternId: "mixed-or-uncertain",
    scenario: "Patienten er både respiratorisk og kredsløbsmæssigt påvirket. Flere samtidige processer kan trække værdierne i hver sin retning, og du har endnu ingen konkrete målinger.", taskPrompt: "Hvad kan vurderes sikkert ud fra oplysningerne alene?",
    valuesToPredict: [value("ph", "pH", "uden enhed", "uncertain", "Processer, der trækker i hver sin retning, kan give lav, normal eller høj pH."), value("pco2", "pCO₂", "kPa", "uncertain", "Uden konkrete målinger kan pCO₂ ikke vurderes sikkert."), value("hco3", "HCO₃⁻", "mmol/L", "uncertain", "Uden konkrete målinger kan HCO₃⁻ ikke vurderes sikkert."), value("be", "BE", "mmol/L", "uncertain", "BE kan ikke vurderes sikkert uden konkrete oplysninger."), value("lactate", "Lactate", "mmol/L", "uncertain", "Et blandet syre-base-billede siger ikke i sig selv noget sikkert om laktat.")],
    keyLearningPoint: "Usikker er det rigtige svar, når oplysningerne ikke peger sikkert i én retning.", commonPitfall: "At presse et komplekst patientbillede ind i ét enkelt syre-base-mønster.", prehospitalRelevance: "Prioritér patientens tilstand, vitalparametre, prøvekvalitet og udvikling over tid.", limitation: "De enkelte processer kan ikke vurderes sikkert uden konkrete værdier og mere klinisk kontekst.",
  },
  {
    id: "pattern-metabolic-acidosis-compensation", title: "Metabolisk acidose med respiratorisk kompensation", neutralTitle: "Mønstercase", level: "intermediate", patternId: "primary-metabolic-acidosis",
    scenario: "Patienten er alment påvirket med tydeligt øget respirationsarbejde. Du forventer en metabolisk syrepåvirkning, hvor den hurtige vejrtrækning kan trække pCO₂ ned.", taskPrompt: "Hvilke retninger passer typisk til dette samlede billede?",
    valuesToPredict: [value("ph", "pH", "uden enhed", "low", "pH er typisk lav, men kan være tæt på reference ved udtalt kompensation."), value("hco3", "HCO₃⁻", "mmol/L", "low", "Lav HCO₃⁻ er den centrale metaboliske afvigelse."), value("be", "BE", "mmol/L", "low", "BE er typisk negativ ved metabolisk syrepåvirkning."), value("pco2", "pCO₂", "kPa", "low", "Øget ventilation sænker ofte pCO₂ som respiratorisk kompensation.")],
    acceptedAlternatives: { ph: ["reference"], pco2: ["uncertain"] }, keyLearningPoint: "Lav pCO₂ kan være kompensation for en metabolisk acidose og er ikke nødvendigvis en selvstændig respiratorisk alkalose.", commonPitfall: "At vurdere den lave pCO₂ uden samtidig at se på HCO₃⁻ og BE.", prehospitalRelevance: "Se respirationsmønstret sammen med perfusion, bevidsthed og udvikling.", limitation: "Kompensationens omfang og årsagen til syrepåvirkningen kan ikke vurderes sikkert ud fra scenariet alene.",
  },
  {
    id: "pattern-hyperglycaemia-without-acidosis", title: "Hyperglykæmi uden tydeligt acidosemønster", neutralTitle: "Mønstercase", level: "intro", patternId: "normalish",
    scenario: "Patient med kendt diabetes er tørstig og utilpas. Glukose forventes forhøjet, men respiration og almen tilstand giver ikke mistanke om en tydelig metabolisk acidose.", taskPrompt: "Hvad forventer du typisk i denne afgrænsede situation?",
    valuesToPredict: [value("glucose", "Glucose", "mmol/L", "high", "Glukose forventes forhøjet i denne case."), value("ph", "pH", "uden enhed", "reference", "Uden et acidotisk billede forventes pH ofte i referenceområdet."), value("hco3", "HCO₃⁻", "mmol/L", "reference", "HCO₃⁻ forventes ofte i referenceområdet, når der ikke er tegn på metabolisk acidose."), value("be", "BE", "mmol/L", "reference", "BE forventes uden tydelig negativ forskydning."), value("potassium", "K⁺", "mmol/L", "uncertain", "Kalium kan variere og kan ikke forudsiges ud fra høj glukose alene.")],
    acceptedAlternatives: { ph: ["uncertain"], hco3: ["uncertain"], be: ["uncertain"] }, keyLearningPoint: "Høj glukose alene er ikke det samme som et metabolisk acidosemønster.", commonPitfall: "At antage lav pH eller lav HCO₃⁻ alene på baggrund af hyperglykæmi.", prehospitalRelevance: "Sammenhold glukose med respiration, væskestatus, symptomer og øvrige målinger.", limitation: "Scenariet beviser ikke årsagen til hyperglykæmien og udelukker ikke senere udvikling.",
  },
  {
    id: "pattern-crp-with-unremarkable-vgas", title: "Forhøjet CRP med bredt upåfaldende VGAS", neutralTitle: "Mønstercase", level: "intermediate", patternId: "inflammation-elevated-crp",
    scenario: "Patienten har haft feber og nedsat almen tilstand i flere dage. CRP forventes forhøjet, mens der ikke er tydelige tegn på respiratorisk eller kredsløbsmæssig påvirkning.", taskPrompt: "Hvilke værdier vil ofte være upåfaldende trods den forhøjede CRP?",
    valuesToPredict: [value("crp", "CRP", "mg/L", "high", "CRP forventes forhøjet efter flere dages inflammatorisk påvirkning."), value("ph", "pH", "uden enhed", "reference", "pH kan fortsat ligge i referenceområdet."), value("pco2", "pCO₂", "kPa", "reference", "Uden tegn på ændret ventilation forventes pCO₂ ofte i referenceområdet."), value("hco3", "HCO₃⁻", "mmol/L", "reference", "HCO₃⁻ forventes ofte i referenceområdet uden metabolisk påvirkning."), value("be", "BE", "mmol/L", "reference", "BE forventes ofte uden tydelig forskydning."), value("lactate", "Lactate", "mmol/L", "uncertain", "CRP kan ikke afgøre, om laktat er påvirket.")],
    acceptedAlternatives: { ph: ["uncertain"], pco2: ["uncertain"], hco3: ["uncertain"], be: ["uncertain"] }, keyLearningPoint: "CRP kan støtte mistanken om inflammation, selv om VGAS ellers er bredt upåfaldende.", commonPitfall: "At bruge CRP alene som mål for årsag eller akut alvorlighed.", prehospitalRelevance: "Videregiv CRP sammen med sygdomsvarighed, vitalparametre og klinisk udvikling.", limitation: "CRP er uspecifik og en upåfaldende VGAS udelukker ikke en klinisk påvirket patient.",
  },
  {
    id: "pattern-lactate-after-strain", title: "Laktatstigning uden tydelig acidæmi", neutralTitle: "Mønstercase", level: "intermediate", patternId: "hypoperfusion-elevated-lactate",
    scenario: "Patienten vurderes kort efter en episode med kraftigt muskelarbejde og er nu vågen med bedring i respiration og kredsløb. Laktat kan fortsat være forhøjet.", taskPrompt: "Hvilke retninger er forenelige med tidspunktet efter belastningen?",
    valuesToPredict: [value("lactate", "Lactate", "mmol/L", "high", "Laktat kan fortsat være forhøjet kort efter kraftigt muskelarbejde."), value("ph", "pH", "uden enhed", "reference", "pH kan være i referenceområdet, selv om laktat er forhøjet."), value("be", "BE", "mmol/L", "uncertain", "BE kan være let negativ eller ligge i referenceområdet."), value("pco2", "pCO₂", "kPa", "uncertain", "pCO₂ afhænger af ventilationen på prøvetidspunktet.")],
    acceptedAlternatives: { ph: ["low"], be: ["low", "reference"], pco2: ["low", "reference"] }, keyLearningPoint: "Laktat kan være forhøjet uden at pH endnu er tydeligt påvirket, og fundet er ikke årsagsspecifikt.", commonPitfall: "At tolke en enkelt laktatværdi uden tidspunkt, klinisk udvikling og prøvekvalitet.", prehospitalRelevance: "Se målingen sammen med hændelsesforløb, perfusion og ændringer undervejs.", limitation: "Én prøve kan ikke sikkert afgøre årsagen eller vise, om laktat er på vej op eller ned.",
  },
  {
    id: "pattern-renal-hyperkalaemia", title: "Hyperkaliæmi ved nyrepåvirkning", neutralTitle: "Mønstercase", level: "advanced", patternId: "renal-electrolyte-disturbance",
    scenario: "Patient med kendt nedsat nyrefunktion er svag og tiltagende utilpas. Du forventer forhøjet kalium og påvirkede nyretal, men kender ikke patientens baseline.", taskPrompt: "Hvilke retninger passer til det beskrevne nyre- og elektrolytbillede?",
    valuesToPredict: [value("potassium", "K⁺", "mmol/L", "high", "Kalium forventes forhøjet i denne case."), value("creatinine", "Creatinine", "µmol/L", "high", "Creatinine forventes forhøjet ved den beskrevne nyrepåvirkning."), value("urea", "Urea", "mmol/L", "high", "Urea er ofte forhøjet, men påvirkes også af andre forhold."), value("hco3", "HCO₃⁻", "mmol/L", "uncertain", "HCO₃⁻ kan være lav, men afhænger af graden og varigheden af nyrepåvirkningen."), value("ph", "pH", "uden enhed", "uncertain", "pH kan være lav eller ligge i referenceområdet afhængigt af samtidige processer.")],
    acceptedAlternatives: { hco3: ["low"], ph: ["low", "reference"] }, keyLearningPoint: "Kalium og nyretal kan være forhøjede, mens syre-base-påvirkningen afhænger af baseline, varighed og samtidige processer.", commonPitfall: "At overse prøvekvalitet eller kalde nyrepåvirkningen akut uden tidligere værdier.", prehospitalRelevance: "Kalium skal ses sammen med EKG, medicin, prøvekvalitet og klinisk udvikling.", limitation: "En enkelt prøve kan ikke sikkert vise varighed, årsag eller ændring fra patientens normale niveau.",
  },
  {
    id: "pattern-mixed-respiratory-circulatory-strain", title: "Samtidig respiratorisk og kredsløbsmæssig belastning", neutralTitle: "Mønstercase", level: "advanced", patternId: "mixed-or-uncertain",
    scenario: "Patienten er takypnøisk, kold og klamtsvedende med hurtig puls. Både ventilation og perfusion kan påvirke prøven, og processerne kan trække pH i hver sin retning.", taskPrompt: "Hvad kan forventes, uden at det blandede billede tvinges i én retning?",
    valuesToPredict: [value("lactate", "Lactate", "mmol/L", "high", "Det kredsløbsmæssige belastningsbillede gør forhøjet laktat sandsynligt."), value("ph", "pH", "uden enhed", "uncertain", "Lav HCO₃⁻ og lav pCO₂ kan trække pH i hver sin retning."), value("pco2", "pCO₂", "kPa", "low", "Takypnø med øget ventilation sænker ofte pCO₂."), value("hco3", "HCO₃⁻", "mmol/L", "uncertain", "HCO₃⁻ kan være lav ved metabolisk påvirkning, men kan ikke forudsiges sikkert."), value("be", "BE", "mmol/L", "uncertain", "BE kan være negativ ved metabolisk påvirkning, men graden er ukendt.")],
    acceptedAlternatives: { ph: ["low", "reference"], pco2: ["uncertain"], hco3: ["low"], be: ["low"] }, keyLearningPoint: "I et blandet billede kan pH skjule modsatrettede processer, så de enkelte værdier skal vurderes hver for sig.", commonPitfall: "At kalde en næsten normal pH for en normal syre-base-status.", prehospitalRelevance: "Sammenhold prøven med ventilation, perfusion, vitalparametre og udvikling over tid.", limitation: "Årsag og bidraget fra hver proces kan ikke vurderes sikkert ud fra én venøs prøve.",
  },
];

export function buildBloodGasPatternTrainingDeck(cases = bloodGasPatternTrainingCases, random: () => number = Math.random) {
  const deck = [...cases];
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }
  return deck;
}
