import type { Flashcard } from "../../types/Flashcard";

export const akutMedicinCards: Flashcard[] = [
  {
    id: "akut_001",
    question: "Hvad er formålet med ABCDE-princippet i akut medicin?",
    answer:
      "At sikre struktureret vurdering og behandling, hvor de mest livstruende problemer (airway, breathing, circulation osv.) håndteres først.",
    difficulty: "easy",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["ABCDE", "struktur"]
  },
  {
    id: "akut_002",
    question: "Hvad er forskellen på et primært og et sekundært survey?",
    answer:
      "Primært survey (ABCDE) fokuserer på livstruende tilstande. Sekundært survey er en mere detaljeret helkropsundersøgelse og anamnese, når patienten er stabiliseret.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["survey", "vurdering"]
  },
  {
    id: "akut_003",
    question: "Hvad forstås ved 'time critical' patient i præhospital sammenhæng?",
    answer:
      "En patient med tilstand hvor forsinkelse i behandling eller transport markant øger risiko for død eller alvorlig skade, fx STEMI, stroke, sepsis, alvorligt traume.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["tidkritisk", "prioritering"]
  },
  {
    id: "akut_004",
    question: "Nævn mindst 4 typiske tegn på kredsløbsshock.",
    answer:
      "Takykardi, hypotension, kold/klam hud, forlænget kapillærrespons, mental påvirkning (uro, konfusion), oliguri.",
    difficulty: "easy",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["shock", "kredsløb"]
  },
  {
    id: "akut_005",
    question: "Hvad er forskellen på hypovolæmisk og distributivt shock?",
    answer:
      "Hypovolæmisk: tab af blod/væske → nedsat preload. Distributivt (fx sepsis, anafylaksi): perifer vasodilatation og omfordeling af blod trods normal/blodvolumen.",
    difficulty: "hard",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["shocktyper"]
  },
  {
    id: "akut_006",
    question: "Hvilke ABC-tiltag er centrale ved anafylaktisk reaktion?",
    answer:
      "A: sikring af luftvej, evt. lejring. B: høj-flow ilt, vurdering af stridor/bronkokonstriktion. C: adrenalin i.m., væskebehandling, monitorering.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["anafylaksi", "ABC"]
  },
  {
    id: "akut_007",
    question: "Hvordan adskiller sepsis sig fra ukompliceret infektion?",
    answer:
      "Sepsis er livstruende organdysfunktion forårsaget af dysreguleret værtsrespons på infektion, ofte med påvirkede vitalparametre og mental tilstand.",
    difficulty: "hard",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["sepsis", "infektion"]
  },
  {
    id: "akut_008",
    question: "Nævn mindst 3 tegn, der kan give mistanke om sepsis præhospitalt.",
    answer:
      "Feber eller hypotermi, takykardi, takypnø, hypotension, påvirket bevidsthed, kulderystelser, marmorering/kold periferi.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["sepsis", "vitalparametre"]
  },
  {
    id: "akut_009",
    question: "Hvad er målet med præhospital behandling af stroke (AKS)?",
    answer:
      "At identificere symptomer hurtigt, sikre ABC, måle vitale værdier, tage blodsukker/EKG og transportere hurtigt til stroke-center for evt. trombolyse/trombektomi.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["stroke", "tid"]
  },
  {
    id: "akut_010",
    question: "Hvilke symptomer indgår typisk i en stroke-screening (fx FAST)?",
    answer:
      "Ansigtsasymmetri, nedsat kraft i arm/ben, påvirket tale, pludselig opståen.",
    difficulty: "easy",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["FAST", "neurologi"]
  },
  {
    id: "akut_011",
    question: "Hvad er vigtigste første tiltag ved hypoglykæmi med bevidsthedspåvirkning præhospitalt?",
    answer:
      "ABCDE, verificere lavt blodsukker, give glukose i.v. eller glukagon i.m., monitorering og revurdering.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["hypoglykæmi"]
  },
  {
    id: "akut_012",
    question: "Hvad er forskellen på respirationssvigt type 1 og type 2?",
    answer:
      "Type 1: hypoksæmi uden hyperkapni (fx pneumoni, lungeødem). Type 2: hypoksæmi med hyperkapni pga. ventilationssvigt (fx KOL, neuromuskulær sygdom).",
    difficulty: "hard",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["respiration", "svigt"]
  },
  {
    id: "akut_013",
    question: "Hvilke farlige årsager skal overvejes ved pludselig brystsmerte?",
    answer:
      "AMI, lungeemboli, aortadissektion, pneumothorax, perikardtamponade, øvre GI-perforation.",
    difficulty: "hard",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["brystsmerter", "differentialdiagnoser"]
  },
  {
    id: "akut_014",
    question: "Hvad er målet med smertebehandling i akutmedicin præhospitalt?",
    answer:
      "At reducere smerte og stressrespons, forbedre respiration og samarbejde, uden at kompromittere kredsløb og bevidsthed unødigt.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["smertebehandling"]
  },
  {
    id: "akut_015",
    question: "Hvorfor er lejring vigtig ved akut dyspnø?",
    answer:
      "Oprejst eller høj-Fowler-leje mindsker venøst tilbageløb, letter diaphragmas arbejde og forbedrer respirationsmekanik.",
    difficulty: "easy",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["dyspnø", "lejring"]
  },
  {
    id: "akut_016",
    question: "Hvad forstås ved 'red flags' i akutmedicin?",
    answer:
      "Symptomer eller fund, der tyder på alvorlig eller livstruende sygdom, fx blod i afføring, pludselig svær hovedpine, nakketilpasning, brystsmerter med trykken.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["red flags"]
  },
  {
    id: "akut_017",
    question: "Hvordan kan en NEWS- eller tidlig warning score bruges præhospitalt?",
    answer:
      "Ved at kombinere vitalparametre til en samlet score, som hjælper med at identificere klinisk forværring og behov for højere behandlingsniveau.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["NEWS", "scoringssystem"]
  },
  {
    id: "akut_018",
    question: "Hvorfor er gentagen ABCDE-vurdering vigtig under transport?",
    answer:
      "Patientens tilstand kan ændre sig hurtigt; løbende revurdering fanger forværring og sikrer rettidig intervention.",
    difficulty: "easy",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["monitorering", "revurdering"]
  },
  {
    id: "akut_019",
    question: "Hvilke elementer indgår i en god præhospital overlevering på akutstuen?",
    answer:
      "Kort, struktureret SBAR/ISBAR med årsag til kontakt, ABCDE-fund, vitalparametre, tidsforløb, behandlinger og respons på behandling.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["overlevering", "kommunikation"]
  },
  {
    id: "akut_020",
    question: "Hvorfor er tidlig ilt ikke altid gavnligt i akutmedicin?",
    answer:
      "Overiltning kan være skadelig ved fx KOL, AMI og post-ROSC; målet er ofte Sat 94–98 % fremfor 100 %.",
    difficulty: "hard",
    subject: "Sygdomslære",
    topic: "Akut medicin",
    tags: ["ilt", "sat"]
  }
];
