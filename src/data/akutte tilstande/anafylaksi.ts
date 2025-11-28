import type { Flashcard } from "../../types/Flashcard";

export const anafylaksiCards: Flashcard[] = [
  {
    id: "anafy_001",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question: "Hvad er anafylaksi?",
    answer:
      "En akut, potentielt livstruende systemisk hypersensitivitetsreaktion, oftest IgE-medieret, hvor flere organsystemer påvirkes samtidig.",
    difficulty: "easy",
    tags: ["definition"]
  },
  {
    id: "anafy_002",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Nævn tre typiske udløsende årsager til anafylaksi.",
    answer:
      "Fødevarer (fx nødder, skaldyr), lægemidler (fx penicillin, NSAID) og insektstik (fx bi- og hvepsestik).",
    difficulty: "easy",
    tags: ["årsager", "triggere"]
  },
  {
    id: "anafy_003",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Forklar kort den immunologiske mekanisme bag IgE-medieret anafylaksi.",
    answer:
      "Allergen krydsbinder IgE-antistoffer på mastceller og basofile, hvilket udløser degranulering med frigivelse af histamin og andre mediatorer, som giver vasodilatation, øget karkapacitet og bronkokonstriktion.",
    difficulty: "hard",
    tags: ["patofysiologi", "IgE", "mastceller"]
  },
  {
    id: "anafy_004",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvad er de tidlige hud- og slimhindesymptomer ved anafylaksi?",
    answer:
      "Klopruritus, urticaria (nældefeber), erytem, angioødem i ansigt, læber eller øjenlåg og evt. hævelse i mund/svælg.",
    difficulty: "easy",
    tags: ["hud", "symptomer"]
  },
  {
    id: "anafy_005",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvilke luftvejssymptomer er alarmsymptomer ved anafylaksi?",
    answer:
      "Stridor, hæshed, inspiratorisk besvær, tung vejrtrækning, bronkospasme med hvæsende respiration og subjektiv følelse af at halsen snører sig sammen.",
    difficulty: "medium",
    tags: ["luftveje", "alarmsymptomer"]
  },
  {
    id: "anafy_006",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvordan påvirker anafylaksi kredsløbet?",
    answer:
      "Systemisk vasodilatation og øget kapillærpermeabilitet giver hypotension, takykardi, svimmelhed, synkope og risiko for obstruktivt/de distributivt shock.",
    difficulty: "medium",
    tags: ["cirkulation", "shock"]
  },
  {
    id: "anafy_007",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvad er forskellen på en mild allergisk reaktion og egentlig anafylaksi?",
    answer:
      "Ved anafylaksi er mindst to organsystemer påvirket (fx hud + luftveje eller kredsløb) og/eller der er tegn på respiratorisk eller cirkulatorisk påvirkning.",
    difficulty: "medium",
    tags: ["klassifikation", "diagnose"]
  },
  {
    id: "anafy_008",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvorfor er anafylaksi tidskritisk?",
    answer:
      "Tilstanden kan progrediere meget hurtigt til fulminant luftvejsobstruktion og cirkulatorisk kollaps med hjertestop inden for få minutter.",
    difficulty: "easy",
    tags: ["tidskritisk"]
  },
  {
    id: "anafy_009",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvad er førstevalg og vigtigste lægemiddel ved anafylaksi?",
    answer:
      "Adrenalin intramuskulært i låret (m. vastus lateralis) i korrekt vægtjusteret dosis.",
    difficulty: "easy",
    tags: ["adrenalin", "behandling"]
  },
  {
    id: "anafy_010",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Nævn mindst tre effekter af adrenalin, som er gavnlige ved anafylaksi.",
    answer:
      "Alfa-1: Vasokonstriktion og øget blodtryk, mindre ødem. Beta-1: Øget hjertets kontraktilitet og frekvens. Beta-2: Bronkodilatation og hæmning af mediatorfrigivelse.",
    difficulty: "hard",
    tags: ["farmakodynamik", "adrenalin"]
  },
  {
    id: "anafy_011",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvordan skal patienten lejres ved anafylaktisk shock, hvis der ikke er respiratorisk kompromis?",
    answer:
      "Fladt på ryggen med benene eleveret for at fremme venøst tilbageløb, med løbende vurdering af luftveje og komfort.",
    difficulty: "medium",
    tags: ["lejring", "shock"]
  },
  {
    id: "anafy_012",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvilke vitale parametre er særligt vigtige at monitorere kontinuerligt ved anafylaksi?",
    answer:
      "Blodtryk, puls, RF, saturation, bevidsthedsniveau (GCS) og evt. EKG-rytme.",
    difficulty: "easy",
    tags: ["vitalparametre", "monitorering"]
  },
  {
    id: "anafy_013",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvilken rolle spiller antihistaminer og steroid i behandlingen af anafylaksi præhospitalt?",
    answer:
      "De dæmper den allergiske reaktion og kan reducere senfase-symptomer, men virker langsomt og må aldrig erstatte adrenalin.",
    difficulty: "medium",
    tags: ["antihistamin", "steroid"]
  },
  {
    id: "anafy_014",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvorfor er høj-flow ilt en vigtig del af behandlingen ved moderat/svær anafylaksi?",
    answer:
      "Bronkokonstriktion og nedsat perfusion kan reducere ilttilbuddet til vævene; ilt maksimerer saturationen og modvirker hypoksi.",
    difficulty: "medium",
    tags: ["iltbehandling"]
  },
  {
    id: "anafy_015",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvilket ABCDE-fokus har særligt høj prioritet ved anafylaksi?",
    answer:
      "A og B: Sikring af frie luftveje og effektiv ventilation, da ødem og bronkospasme hurtigt kan kompromittere respirationen.",
    difficulty: "easy",
    tags: ["ABCDE", "luftveje"]
  },
  {
    id: "anafy_016",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvorfor kan der være behov for gentagne doser adrenalin ved anafylaksi?",
    answer:
      "Effekten af intramuskulært adrenalin aftager efter 5–10 minutter, og symptomer kan persistere eller forværres, hvilket kræver gentagelse efter retningslinjer.",
    difficulty: "medium",
    tags: ["adrenalin", "dosering"]
  },
  {
    id: "anafy_017",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvad forstås ved en bifasisk anafylaktisk reaktion?",
    answer:
      "En ny forværring af symptomer timer efter den initiale reaktion, selv om patienten først er blevet bedre. Kan opstå uden ny eksponering.",
    difficulty: "hard",
    tags: ["bifasisk reaktion"]
  },
  {
    id: "anafy_018",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvorfor skal alle patienter med moderat/svær anafylaksi observeres på hospital efter præhospital behandling?",
    answer:
      "På grund af risiko for bifasisk reaktion, sen forværring, behov for yderligere behandling og udredning for årsag og fremtidig profylakse.",
    difficulty: "medium",
    tags: ["observation", "prognose"]
  },
  {
    id: "anafy_019",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvilken information er vigtig at få i anamnesen ved mistanke om anafylaksi?",
    answer:
      "Udløsende faktor og eksponeringstidspunkt, tidligere allergiske reaktioner, kendt anafylaksi, medicinbrug (fx beta-blokkere), og udvikling af symptomer over tid.",
    difficulty: "medium",
    tags: ["anamnese"]
  },
  {
    id: "anafy_020",
    subject: "Akutte tilstande",
    topic: "Anafylaksi",
    question:
      "Hvad er den vigtigste præhospitale prioritet ved anafylaktisk shock?",
    answer:
      "Rask identifikation af tilstanden, straks intramuskulær adrenalin, ABCDE-stabilisering (luftveje, ilt, væske) og hurtig transport til hospital under tæt monitorering.",
    difficulty: "medium",
    tags: ["prioritering", "shock"]
  }
];
