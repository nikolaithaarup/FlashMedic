import type { Flashcard } from "../../../types/Flashcard";

export const amiCards: Flashcard[] = [
  {
    id: "ami_001",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    question: "Hvad er AMI (Akut Myokardieinfarkt)?",
    answer:
      "Irreversibel skade på hjertemusklen pga. længerevarende iskæmi, som skyldes blokering af en koronararterie.",
    difficulty: "easy",
    tags: ["AMI", "iskæmi"]
  },
  {
    id: "ami_002",
    question: "Hvad er forskellen på STEMI og NSTEMI?",
    answer:
      "STEMI har fuldt karokkluderet koronarkar og ST-elevation. NSTEMI har delvis blokering og ingen ST-elevation, men troponinforhøjelse.",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    difficulty: "medium",
    tags: ["STEMI", "NSTEMI"]
  },
  {
    id: "ami_003",
    question: "Forklar patofysiologien bag AMI.",
    answer:
      "Rift i ateromatøs plaque → trombedannelse → fuld eller delvis blokering af koronararterie → iskæmi → nekrose.",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    difficulty: "hard",
    tags: ["aterosklerose", "trombe"]
  },
  {
    id: "ami_004",
    question: "Hvorfor gør AMI ondt, og hvor mærkes smerten?",
    answer:
      "Iskæmisk skade udløser inflammation og frigivelse af smertefremkaldende stoffer. Smerten kan stråle til arm, kæbe, ryg og epigastrium.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["brystsmerter"]
  },
  {
    id: "ami_005",
    question: "Nævn typiske symptomer på AMI.",
    answer:
      "Trykken i brystet >20 min, åndenød, kvalme, koldsved, bleghed, angst og ubehag i arm, hals eller mave.",
    difficulty: "easy",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["symptomer"]
  },
  {
    id: "ami_006",
    question: "Hvad er atypiske symptomer på AMI?",
    answer:
      "Mavesmerter, træthed, dyspnø, svimmelhed, synkope, kvalme uden brystsmerter. Ses især hos ældre og diabetikere.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["atypisk"]
  },
  {
    id: "ami_007",
    question: "Hvorfor kan AMI udløse kvalme og opkast?",
    answer:
      "Iskæmi kan aktivere vagusnerven og give kvalme, sved og opkast — især ved inferior infarkt.",
    difficulty: "hard",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["vagus", "inferior infarkt"]
  },
  {
    id: "ami_008",
    question: "Hvilke vitale tegn ses ofte ved AMI?",
    answer:
      "Takykardi, evt. bradykardi, koldsved, dyspnø, lavt BT ved kardiel påvirkning, angst og uro.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["vitalparametre"]
  },
  {
    id: "ami_009",
    question: "Hvad er MONA-behandling?",
    answer:
      "Morphin, Oxygen (kun hvis Sat < 90), Nitro og ASA (trombehæmning). Bruges som initial behandling af infarkt.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["MONA", "ASA"]
  },
  {
    id: "ami_010",
    question: "Hvorfor må nitroglycerin ikke gives ved lavt blodtryk?",
    answer:
      "Nitro giver vasodilatation og sænker preload, hvilket kan føre til kollaps ved hypotension.",
    difficulty: "hard",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["nitro", "hypotension"]
  },
  {
    id: "ami_011",
    question: "Hvad er forskellen på stabil og ustabil angina?",
    answer:
      "Stabil: kommer ved anstrengelse og lindres i hvile. Ustabil: opstår også i hvile, varer længere og kan være forstadie til AMI.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["angina"]
  },
  {
    id: "ami_012",
    question: "Hvorfor kan AMI føre til hjertestop?",
    answer:
      "Infarkt kan udløse livstruende arytmier som VF, VT eller AV-blok, som stopper perfusionen.",
    difficulty: "hard",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["hjertestop", "arytmi"]
  },
  {
    id: "ami_013",
    question: "Hvad måles troponin for?",
    answer:
      "Troponin frigives ved myokardienekrose og bruges til at bekræfte AMI.",
    difficulty: "easy",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["troponin"]
  },
  {
    id: "ami_014",
    question: "Hvorfor ser man ST-elevation ved STEMI?",
    answer:
      "Transmural myokardieiskæmi påvirker repolarisation og giver ST-elevation på EKG.",
    difficulty: "hard",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["EKG", "STEMI"]
  },
  {
    id: "ami_015",
    question: "Hvad betyder 'time is myocardium'?",
    answer:
      "Jo længere tid uden blodforsyning, jo større bliver den irreversible myokardieskade.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["myokardieskade"]
  },
  {
    id: "ami_016",
    question: "Hvordan vurderer du præhospitalt, om patienten har AMI?",
    answer:
      "Anamnese (smerte, varighed, debut), ABCDE, vitalparametre, EKG, smerteradiation, risikofaktorer.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["prehospital", "EKG"]
  },
  {
    id: "ami_017",
    question: "Nævn modifiable risikofaktorer for AMI.",
    answer:
      "Rygestop, overvægt, hypertension, diabetes, hyperkolesterolæmi, inaktivitet, stress.",
    difficulty: "easy",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["risikofaktorer"]
  },
  {
    id: "ami_018",
    question: "Hvorfor er AMI hos diabetikere ofte overset?",
    answer:
      "Diabetikere kan have neuropati og mærker ikke klassiske smerter—ofte asymptomatisk eller atypisk.",
    difficulty: "hard",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["diabetes", "atypisk"]
  },
  {
    id: "ami_019",
    question: "Hvordan håndteres AMI præhospitalt?",
    answer:
      "ABC, smertelindring, EKG, ASA, nitro hvis BT > 100, monitorering, vurdering af transport til PCI-center.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["prehospital", "PCI"]
  },
  {
    id: "ami_020",
    question: "Hvorfor skal STEMI-patienter ofte til PCI og ikke trombolyse?",
    answer:
      "PCI er mere effektiv og har færre komplikationer. Trombolyse bruges hvis PCI ikke kan nås inden for tidsgrænsen.",
    difficulty: "medium",
    subject: "Sygdomslære",
    topic: "Akut Myokardieinfarkt",
    tags: ["PCI", "trombolyse"]
  }
];
