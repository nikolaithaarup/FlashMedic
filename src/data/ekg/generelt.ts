import type { Flashcard } from "../../types/Flashcard";

export const ekgGenereltCards: Flashcard[] = [
  {
    id: "ekg_001",
    question: "Hvad repræsenterer P-takken på EKG?",
    answer: "Depolarisation af atrierne.",
    difficulty: "easy",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    tags: ["P-tak", "basis"]
  },
  {
    id: "ekg_002",
    question: "Hvad repræsenterer QRS-komplekset?",
    answer: "Depolarisation af ventriklerne.",
    difficulty: "easy",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    tags: ["QRS"]
  },
  {
    id: "ekg_003",
    question: "Hvad er normal varighed af QRS-komplekset?",
    answer: "Normalt < 0,12 sekunder (under 3 små tern).",
    difficulty: "medium",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    tags: ["QRS", "normalværdier"]
  },
  {
    id: "ekg_004",
    question: "Hvorfor er ST-elevation centralt ved STEMI-diagnose?",
    answer:
      "ST-elevation tyder på transmural iskæmi i et specifikt koronarområde og bruges til at identificere STEMI og behov for akut PCI.",
    difficulty: "medium",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    tags: ["ST-elevation", "STEMI"],
    image: "stemi_inferior" // nøgle du selv mapper til et billede
  },
  {
    id: "ekg_005",
    question: "Hvordan ser atrieflimren typisk ud på EKG?",
    answer:
      "Uregelmæssig uregelmæssig rytme, fravær af tydelige P-takker, varierende RR-interval.",
    difficulty: "medium",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    tags: ["AFLI"],
    image: "afli_example"
  },
  {
    id: "ekg_006",
    question: "Hvad er forskellen på monofasisk og bifasisk defibrillator?",
    answer:
      "Monofasisk sender strøm i én retning; bifasisk sender frem og tilbage. Bifasisk kræver typisk lavere energi og er mere skånsom for myokardiet.",
    difficulty: "hard",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    tags: ["defibrillator"]
  },
  {
    id: "ekg_007",
    question: "Hvad beskriver P-takken på et EKG?",
    answer: "Depolarisation af atrierne, dvs. elektrisk aktivitet når atrierne trækker sig sammen.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "easy",
    tags: ["P-tak", "atrium"]
  },
  {
    id: "ekg_008",
    question: "Hvad repræsenterer QRS-komplekset?",
    answer: "Ventriklernes depolarisation og dermed elektrisk udløsning af ventrikelkontraktionen.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "easy",
    tags: ["QRS", "ventrikel"]
  },
  {
    id: "ekg_009",
    question: "Hvor lang bør et normalt PR-interval være?",
    answer: "Mellem 0,12 og 0,20 sekunder (3–5 små EKG-kvadrater).",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "medium",
    tags: ["PR-interval"]
  },
  {
    id: "ekg_010",
    question: "Hvad kan et forlænget PR-interval tyde på?",
    answer: "AV-blok (1. grads), hvor der er forsinket ledning gennem AV-knuden.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "medium",
    tags: ["AV-blok", "PR-interval"]
  },
  {
    id: "ekg_011",
    question: "Hvordan kan man genkende atrieflimren (AFLI) på EKG?",
    answer: "Uregelmæssigt uregelmæssig rytme, ingen P-takker, flimren i baseline og varierende RR-intervaller.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "medium",
    tags: ["AFLI", "arytmi"]
  },
  {
    id: "ekg_012",
    question: "Hvad er de klassiske EKG-tegn på atrieflagren (AFLA)?",
    answer: "Savtaks-mønster (F-bølger), ofte regelmæssig rytme med fast AV-overledning (2:1 eller 3:1).",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "hard",
    tags: ["AFLA", "savtak"]
  },
  {
    id: "ekg_013",
    question: "Hvordan ser ventrikulær takykardi typisk ud på EKG?",
    answer: "Breddeøget QRS-kompleks (> 120 ms), regelmæssig rytme, høj ventrikulær frekvens (120–250 bpm), ingen P-takker.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "hard",
    tags: ["VT", "takykardi"]
  },
  {
    id: "ekg_014",
    question: "Hvad er forskellen på ventrikelflimren og ventrikulær takykardi?",
    answer: "VF er kaotisk elektrisk aktivitet uden cirkulation. VT er hurtig, bred QRS-rytme, som kan være med eller uden puls.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "hard",
    tags: ["VF", "VT", "hjertestop"]
  },
  {
    id: "ekg_015",
    question: "Hvordan ser STEMI typisk ud på et EKG?",
    answer: "ST-elevation i mindst 2 sammenhængende afledninger i samme kargebist.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "medium",
    tags: ["STEMI", "iskæmi"]
  },
  {
    id: "ekg_016",
    question: "Hvilket fund skelner NSTEMI fra STEMI på EKG?",
    answer: "NSTEMI har ingen ST-elevation, men kan have ST-depression eller T-inversion.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "easy",
    tags: ["NSTEMI", "T-inversion"]
  },
  {
    id: "ekg_017",
    question: "Hvad er tegn på hyperkaliæmi på EKG?",
    answer: "Spidse T-takker, bred QRS og flade P-takker. Ved svær hyperkaliæmi asystoli eller VF.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "hard",
    tags: ["hyperkaliæmi"]
  },
  {
    id: "ekg_018",
    question: "Hvad tyder en forlænget QT-interval på?",
    answer: "Risiko for Torsades de Pointes og ventrikulær arytmi. Kan skyldes elektrolytmangel eller medicin.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "hard",
    tags: ["QT-forlængelse"]
  },
  {
    id: "ekg_019",
    question: "Hvad ses på EKG ved 3. grads AV-blok?",
    answer: "Total blokering mellem atrier og ventrikler. P-takker og QRS uafhængige af hinanden.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "hard",
    tags: ["AV-blok", "blok"]
  },
  {
    id: "ekg_020",
    question: "Hvordan kan du præhospitalt hurtigt vurdere rytme på EKG ved hjertestop?",
    answer: "Tjek om rytmen er stødbar (VF/VT) eller ikke-stødbar (PEA/asystoli). Det styrer behandlingsalgoritmen.",
    subject: "EKG",
    topic: "Grundlæggende EKG",
    difficulty: "medium",
    tags: ["hjertestop", "algoritme", "rytmevurdering"]
  }
];
