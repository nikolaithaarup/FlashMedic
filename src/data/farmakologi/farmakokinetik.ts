import type { Flashcard } from "../../types/Flashcard";

export const farmakokinetikCards: Flashcard[] = [
{
  id: "farmakokinetik_001",
  question: "Hvad handler farmakokinetik grundlæggende om?",
  answer: "Hvordan kroppen påvirker lægemidlet gennem absorption, distribution, metabolisme og elimination (ADME).",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "easy",
  tags: ["ADME", "definition"]
},
{
  id: "farmakokinetik_002",
  question: "Hvad betyder absorption?",
  answer: "Processen hvor et lægemiddel optages fra administrationsstedet og over i blodbanen.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "easy",
  tags: ["absorption"]
},
{
  id: "farmakokinetik_003",
  question: "Hvad er biotilgængelighed?",
  answer: "Den andel af et givet lægemiddel, der når frem til den systemiske cirkulation i aktiv form.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "medium",
  tags: ["biotilgængelighed"]
},
{
  id: "farmakokinetik_004",
  question: "Hvad er first-pass metabolisme?",
  answer: "Nedbrydning af et oralt lægemiddel i leveren, før det når blodbanen i aktiv form.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "medium",
  tags: ["first-pass", "lever"]
},
{
  id: "farmakokinetik_005",
  question: "Hvorfor har intravenøs administration 100% biotilgængelighed?",
  answer: "Fordi lægemidlet gives direkte i blodbanen uden absorptionstab eller first-pass effekt.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "easy",
  tags: ["IV", "biotilgængelighed"]
},
{
  id: "farmakokinetik_006",
  question: "Hvad betyder distribution i farmakokinetik?",
  answer: "Hvordan lægemidlet fordeles fra blodbanen ud i væv og organer.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "medium",
  tags: ["distribution"]
},
{
  id: "farmakokinetik_007",
  question: "Hvad betyder plasmaproteinbinding?",
  answer: "Når lægemidlet binder til proteiner i plasma (fx albumin), hvilket gør det inaktivt, men transportabelt.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "hard",
  tags: ["albumin", "binding"]
},
{
  id: "farmakokinetik_008",
  question: "Hvorfor kan hypoalbuminæmi øge bivirkninger fra visse lægemidler?",
  answer: "Mindre albumin betyder mere frit aktivt lægemiddel, hvilket øger risikoen for toksicitet.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "hard",
  tags: ["albumin", "toksicitet"]
},
{
  id: "farmakokinetik_009",
  question: "Hvad betyder fordelingsvolumen (Vd)?",
  answer: "Forholdet mellem mængden af lægemiddel i kroppen og koncentrationen i plasma – et mål for, hvor stoffet fordeler sig.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "hard",
  tags: ["Vd", "fordeling"]
},
{
  id: "farmakokinetik_010",
  question: "Hvad er forskellen på fase-1 og fase-2 metabolisme?",
  answer: "Fase 1: kemisk ændring (fx oxidation). Fase 2: konjugering, så lægemidlet bliver vandopløseligt.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "hard",
  tags: ["fase-1", "fase-2", "CYP450"]
},
{
  id: "farmakokinetik_011",
  question: "Hvilket organ står primært for lægemiddelmetabolisme?",
  answer: "Leveren via enzymsystemer som CYP450.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "easy",
  tags: ["lever", "CYP450"]
},
{
  id: "farmakokinetik_012",
  question: "Hvilket organ er vigtigst for elimination af lægemidler?",
  answer: "Nyrerne gennem filtration, sekretion og reabsorption.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "easy",
  tags: ["nyrer", "elimination"]
},
{
  id: "farmakokinetik_013",
  question: "Hvad betyder clearance?",
  answer: "Den volumen plasma, der renses for lægemiddel per tidsenhed.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "hard",
  tags: ["clearance"]
},
{
  id: "farmakokinetik_014",
  question: "Hvad betyder halveringstid (T½)?",
  answer: "Den tid det tager for koncentrationen af lægemiddel i plasma at halveres.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "medium",
  tags: ["T½", "tidsforløb"]
},
{
  id: "farmakokinetik_015",
  question: "Hvordan påvirker leverinsufficiens farmakokinetik?",
  answer: "Nedsat metabolisme, hvilket kan føre til ophobning og øget toksicitet.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "hard",
  tags: ["lever", "toksicitet"]
},
{
  id: "farmakokinetik_016",
  question: "Hvordan påvirker nyreinsufficiens eliminationen?",
  answer: "Nedsat udskillelse af lægemidler og deres metabolitter, hvilket kan kræve dosisjustering.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "medium",
  tags: ["nyresvigt", "dosis"]
},
{
  id: "farmakokinetik_017",
  question: "Hvad er enterohepatisk recirkulation?",
  answer: "Når lægemiddel udskilles i galden, optages igen i tarmen og cirkulerer tilbage til leveren.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "hard",
  tags: ["galde", "recirkulation"]
},
{
  id: "farmakokinetik_018",
  question: "Hvordan kan et lægemiddel krydse blod-hjerne-barrieren?",
  answer: "Det skal være lipofilt og småt, eller bruge aktiv transport.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "hard",
  tags: ["BBB", "lipofilt"]
},
{
  id: "farmakokinetik_019",
  question: "Hvorfor kan alderen påvirke farmakokinetikken?",
  answer: "Ældre har ofte nedsat lever- og nyrefunktion, ændret fedt/vand-forhold og mindre albumin.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "hard",
  tags: ["ældre", "dosis", "organfunktion"]
},
{
  id: "farmakokinetik_020",
  question: "Forklar kort hvad steady state betyder.",
  answer: "Når tilført dosis per tidsenhed svarer til elimination per tidsenhed, så koncentrationen bliver stabil.",
  subject: "Farmakologi",
  topic: "Farmakokinetik",
  difficulty: "hard",
  tags: ["steady-state", "koncentration"]
}
];