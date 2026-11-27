import type {PatientCase} from './caseEngine';
export const targetedCases:PatientCase[]=[
  {
    "id": "target-cdiff-elev",
    "familyId": "target-cdiff",
    "title": "Diarré efter antibiotika",
    "category": "Infektion",
    "intro": "En 73-årig har fået vandig diarré og mavesmerter efter en antibiotikakur. Patienten er svimmel ved oprejsning.",
    "vitals": {
      "Temp": "38,1 °C",
      "Puls": "106/min",
      "BT": "106/68 mmHg"
    },
    "subjects": [
      "Mikrobiologi",
      "Immunologi",
      "Hygiejne",
      "Sygdomslære",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "difficulty": "Elev",
    "status": "draft",
    "sources": [
      {
        "title": "CDC – C. diff",
        "url": "https://www.cdc.gov/c-diff/hcp/clinical-overview/index.html"
      },
      {
        "title": "CDC – Hand hygiene",
        "url": "https://www.cdc.gov/clean-hands/hcp/clinical-safety/"
      }
    ],
    "takeaway": "Antibiotika kan ændre tarmens mikrobiota. C. difficile kan danne sporer og toksiner. Diarréens årsag skal afklares, og væsketab vurderes.",
    "objectives": [
      "Genkend sporer og smitteveje.",
      "Forstå væsketab."
    ],
    "steps": [
      {
        "id": "spore",
        "kind": "short",
        "prompt": "Hvad kaldes den modstandsdygtige hvileform, som C. difficile kan danne?",
        "correct": "Spore",
        "accepted": [
          "sporer",
          "endospore",
          "endosporer"
        ],
        "explanation": "Sporer kan overleve længe i miljøet; de er ikke en formeringsform."
      },
      {
        "id": "types",
        "kind": "classify",
        "prompt": "Sortér bakterielle former.",
        "categories": [
          {
            "id": "0",
            "text": "Vegetativ bakterie"
          },
          {
            "id": "1",
            "text": "Spore"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Aktivt stofskifte og vækst"
          },
          {
            "id": "1",
            "text": "Modstandsdygtig hvileform"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1"
        },
        "explanation": "En spore kan under passende forhold spire til en vegetativ bakterie."
      },
      {
        "id": "chain",
        "kind": "order",
        "prompt": "Byg en mulig indirekte smittekæde.",
        "options": [
          {
            "id": "3",
            "text": "Sporer når munden"
          },
          {
            "id": "2",
            "text": "Hænder forurenes"
          },
          {
            "id": "1",
            "text": "Kontaktflade forurenes"
          },
          {
            "id": "0",
            "text": "Sporer udskilles med afføring"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Fækal-oral overførsel kan ske via forurenede hænder og overflader."
      },
      {
        "id": "risk",
        "kind": "clues",
        "prompt": "Markér relevante oplysninger.",
        "options": [
          {
            "id": "0",
            "text": "Nylig antibiotika"
          },
          {
            "id": "1",
            "text": "Vandig diarré"
          },
          {
            "id": "2",
            "text": "Reduceret væskeindtag"
          },
          {
            "id": "3",
            "text": "Tidligere ukompliceret fingerbrud"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Anamnese og væskebalance er relevante; fundene bekræfter ikke årsagen."
      },
      {
        "id": "balance",
        "kind": "number",
        "prompt": "I et forenklet væskeregnskab er indtag 700 ml og diarrétab 1200 ml. Hvad er nettobalancen?",
        "answer": -500,
        "unit": "ml",
        "tolerance": 0.001,
        "explanation": "700 − 1200 = −500 ml. Andre tab er ikke medregnet."
      },
      {
        "id": "loss",
        "kind": "classify",
        "prompt": "Hvad kan ændres ved betydeligt væsketab?",
        "categories": [
          {
            "id": "0",
            "text": "↑ Stiger"
          },
          {
            "id": "1",
            "text": "↓ Falder"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Venøst tilbageløb"
          },
          {
            "id": "1",
            "text": "Kompensatorisk sympatisk aktivitet"
          },
          {
            "id": "2",
            "text": "Risiko for hypoperfusion"
          }
        ],
        "correct": {
          "0": "1",
          "1": "0",
          "2": "0"
        },
        "explanation": "Væsketab kan reducere fyldning og perfusion."
      }
    ]
  },
  {
    "id": "target-cdiff-behandler",
    "familyId": "target-cdiff",
    "title": "Diarré efter antibiotika",
    "category": "Infektion",
    "intro": "En 73-årig har fået vandig diarré og mavesmerter efter en antibiotikakur. Patienten er svimmel ved oprejsning.",
    "vitals": {
      "Temp": "38,1 °C",
      "Puls": "106/min",
      "BT": "106/68 mmHg"
    },
    "subjects": [
      "Mikrobiologi",
      "Immunologi",
      "Hygiejne",
      "Sygdomslære",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "difficulty": "Behandler",
    "status": "draft",
    "sources": [
      {
        "title": "CDC – C. diff",
        "url": "https://www.cdc.gov/c-diff/hcp/clinical-overview/index.html"
      },
      {
        "title": "CDC – Hand hygiene",
        "url": "https://www.cdc.gov/clean-hands/hcp/clinical-safety/"
      }
    ],
    "takeaway": "Antibiotika kan ændre tarmens mikrobiota. C. difficile kan danne sporer og toksiner. Diarréens årsag skal afklares, og væsketab vurderes.",
    "objectives": [
      "Forklar toksinmedieret sygdom og smitteforebyggelse.",
      "Skeln kolonisering fra infektion."
    ],
    "steps": [
      {
        "id": "microbiota",
        "kind": "order",
        "prompt": "Byg en mulig sygdomsmekanisme.",
        "options": [
          {
            "id": "3",
            "text": "Inflammation og diarré kan følge"
          },
          {
            "id": "2",
            "text": "Toksiner påvirker tarmepitelet"
          },
          {
            "id": "1",
            "text": "C. difficile får mulighed for vækst"
          },
          {
            "id": "0",
            "text": "Antibiotika ændrer mikrobiota"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Toksinproducerende C. difficile kan give colitis efter ændring i mikrobiota."
      },
      {
        "id": "mechanism",
        "kind": "match",
        "prompt": "Forbind begreb med funktion.",
        "left": [
          {
            "id": "0",
            "text": "Spore"
          },
          {
            "id": "1",
            "text": "Toksin"
          },
          {
            "id": "2",
            "text": "Normal mikrobiota"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Bidrager til koloniseringsresistens"
          },
          {
            "id": "1",
            "text": "Miljøoverlevelse"
          },
          {
            "id": "2",
            "text": "Kan skade værtsceller"
          }
        ],
        "correct": {
          "0": "1",
          "1": "2",
          "2": "0"
        },
        "explanation": "Sporer, toksiner og mikrobiota har forskellige roller."
      },
      {
        "id": "diagnosis",
        "kind": "classify",
        "prompt": "Skeln mellem kolonisering og mulig sygdom.",
        "categories": [
          {
            "id": "0",
            "text": "Kolonisering"
          },
          {
            "id": "1",
            "text": "Mulig symptomgivende infektion"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Bakterien påvises uden symptomer"
          },
          {
            "id": "1",
            "text": "Ny diarré med relevante kliniske og mikrobiologiske fund"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1"
        },
        "explanation": "En positiv prøve alene er ikke bevis for symptomgivende infektion."
      },
      {
        "id": "control",
        "kind": "clues",
        "prompt": "Markér relevante smitteforebyggende principper ved mulig sporesmitte.",
        "options": [
          {
            "id": "0",
            "text": "Korrekt brug og aftagning af handsker"
          },
          {
            "id": "1",
            "text": "Håndvask ved sandsynlig sporekontakt efter lokal instruks"
          },
          {
            "id": "2",
            "text": "Egnet sporicid rengøring efter instruks"
          },
          {
            "id": "3",
            "text": "Antag at håndsprit alene dræber alle sporer"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Alkohol dræber ikke pålideligt C. difficile-sporer. Følg lokal instruks."
      },
      {
        "id": "lossrate",
        "kind": "number",
        "prompt": "Der er registreret 900 ml væsketab over 3 timer. Beregn gennemsnitligt tab pr. time.",
        "answer": 300,
        "unit": "ml/time",
        "tolerance": 0.001,
        "explanation": "900 / 3 = 300 ml/time."
      },
      {
        "id": "colitis",
        "kind": "short",
        "prompt": "Hvad kaldes inflammation i tyktarmen?",
        "correct": "Colitis",
        "accepted": [
          "kolitis"
        ],
        "explanation": "Colitis kan skyldes infektion og andre inflammatoriske årsager."
      }
    ]
  },
  {
    "id": "target-cdiff-paramediciner",
    "familyId": "target-cdiff",
    "title": "Diarré efter antibiotika",
    "category": "Infektion",
    "intro": "En 73-årig har fået vandig diarré og mavesmerter efter en antibiotikakur. Patienten er svimmel ved oprejsning.",
    "vitals": {
      "Temp": "38,1 °C",
      "Puls": "106/min",
      "BT": "106/68 mmHg"
    },
    "subjects": [
      "Mikrobiologi",
      "Immunologi",
      "Hygiejne",
      "Sygdomslære",
      "Patofysiologi",
      "Klinisk vurdering"
    ],
    "difficulty": "Paramediciner",
    "status": "draft",
    "sources": [
      {
        "title": "CDC – C. diff",
        "url": "https://www.cdc.gov/c-diff/hcp/clinical-overview/index.html"
      },
      {
        "title": "CDC – Hand hygiene",
        "url": "https://www.cdc.gov/clean-hands/hcp/clinical-safety/"
      }
    ],
    "takeaway": "Antibiotika kan ændre tarmens mikrobiota. C. difficile kan danne sporer og toksiner. Diarréens årsag skal afklares, og væsketab vurderes.",
    "objectives": [
      "Relatér inflammation og væsketab til systemisk påvirkning.",
      "Forstå diagnostisk usikkerhed."
    ],
    "steps": [
      {
        "id": "systemic",
        "kind": "classify",
        "prompt": "Hvordan kan betydelig colitis med væsketab påvirke disse forhold?",
        "categories": [
          {
            "id": "0",
            "text": "↑ Stiger"
          },
          {
            "id": "1",
            "text": "↓ Falder"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Risiko for intravaskulær volumenmangel"
          },
          {
            "id": "1",
            "text": "Effektiv organperfusion ved dekompensation"
          },
          {
            "id": "2",
            "text": "Risiko for akut nyrepåvirkning"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "0"
        },
        "explanation": "Betydelig inflammation og væsketab kan påvirke flere organer."
      },
      {
        "id": "deterioration",
        "kind": "clues",
        "prompt": "Markér de nye fund, der er særligt bekymrende.",
        "options": [
          {
            "id": "0",
            "text": "Ny konfusion"
          },
          {
            "id": "1",
            "text": "Tiltagende abdominal distension og smerte"
          },
          {
            "id": "2",
            "text": "Blodtryk 82/50 mmHg"
          },
          {
            "id": "3",
            "text": "Uændret gammel nærsynethed"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Ny organ- og kredsløbspåvirkning eller svære mavesymptomer kræver hurtig revurdering.",
        "update": "Patienten er blevet mere sløv og maven mere spændt."
      },
      {
        "id": "renal",
        "kind": "order",
        "prompt": "Byg en mulig mekanisme bag prærenal nyrepåvirkning.",
        "options": [
          {
            "id": "3",
            "text": "Kreatinin kan senere stige"
          },
          {
            "id": "2",
            "text": "Filtration kan falde"
          },
          {
            "id": "1",
            "text": "Renal perfusion falder"
          },
          {
            "id": "0",
            "text": "Væsketab og reduceret effektivt volumen"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Prærenal påvirkning kan udvikles ved utilstrækkelig perfusion."
      },
      {
        "id": "test",
        "kind": "match",
        "prompt": "Forbind prøver med deres begrænsning.",
        "left": [
          {
            "id": "0",
            "text": "PCR for toksingen"
          },
          {
            "id": "1",
            "text": "Toksinpåvisning i fæces"
          },
          {
            "id": "2",
            "text": "Kreatinin"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Belyser nyrefunktion"
          },
          {
            "id": "1",
            "text": "Kan påvise genetisk potentiale uden at bevise sygdom"
          },
          {
            "id": "2",
            "text": "Belyser toksin i prøven"
          }
        ],
        "correct": {
          "0": "1",
          "1": "2",
          "2": "0"
        },
        "explanation": "Mikrobiologiske resultater fortolkes sammen med symptomer."
      },
      {
        "id": "map",
        "kind": "number",
        "prompt": "Estimér MAP ved BT 82/50 mmHg med (SBP + 2 × DBP)/3, afrundet til helt tal.",
        "answer": 61,
        "unit": "mmHg",
        "tolerance": 0.001,
        "explanation": "(82 + 100) / 3 ≈ 61 mmHg."
      },
      {
        "id": "complication",
        "kind": "short",
        "prompt": "Hvad kaldes akut svær udvidelse af colon med systemisk toksicitet?",
        "correct": "Toksisk megacolon",
        "accepted": [
          "toksisk megakolon",
          "toxic megacolon"
        ],
        "explanation": "Toksisk megacolon er en alvorlig komplikation til colitis; diagnosen kræver videre vurdering."
      }
    ]
  },
  {
    "id": "target-biofilm-elev",
    "familyId": "target-biofilm",
    "title": "Feber hos en patient med kateter",
    "category": "Infektion",
    "intro": "En 78-årig med længerevarende urinvejskateter har feber og er mere træt. Der er endnu ikke afklaret en årsag til symptomerne.",
    "vitals": {
      "Temp": "38,6 °C",
      "Puls": "104/min",
      "BT": "118/72 mmHg"
    },
    "subjects": [
      "Mikrobiologi",
      "Immunologi",
      "Hygiejne",
      "Sygdomslære",
      "Farmakologi",
      "Klinisk vurdering"
    ],
    "difficulty": "Elev",
    "status": "draft",
    "sources": [
      {
        "title": "CDC – Urinary catheter culture stewardship",
        "url": "https://www.cdc.gov/uti/hcp/clinical-guidance/index.html"
      },
      {
        "title": "CDC – Catheter pathogenesis",
        "url": "https://www.cdc.gov/infection-control/hcp/intravascular-catheter-related-infection/pathogenesis.html"
      }
    ],
    "takeaway": "Biofilm er et mikrobielt samfund med matrix. Kolonisering af kateter er ikke i sig selv bevis for symptomgivende infektion.",
    "objectives": [
      "Forstå biofilm og bakterietyper.",
      "Genkend hygiejneprincipper."
    ],
    "steps": [
      {
        "id": "biofilm",
        "kind": "short",
        "prompt": "Hvad kaldes et mikrobielt samfund, der er omgivet af en selvproduceret matrix?",
        "correct": "Biofilm",
        "accepted": [
          "biofilmen"
        ],
        "explanation": "Biofilm kan dannes på biologiske og kunstige overflader."
      },
      {
        "id": "shape",
        "kind": "match",
        "prompt": "Forbind form og navn.",
        "left": [
          {
            "id": "0",
            "text": "Kokker"
          },
          {
            "id": "1",
            "text": "Stave"
          },
          {
            "id": "2",
            "text": "Spiraler"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Aflange"
          },
          {
            "id": "1",
            "text": "Spiralformede"
          },
          {
            "id": "2",
            "text": "Runde"
          }
        ],
        "correct": {
          "0": "2",
          "1": "0",
          "2": "1"
        },
        "explanation": "Bakteriers morfologi kan beskrives som blandt andet kokker og stave."
      },
      {
        "id": "formation",
        "kind": "order",
        "prompt": "Byg en forenklet biofilmdannelse.",
        "options": [
          {
            "id": "3",
            "text": "Et organiseret mikrobielt samfund udvikles"
          },
          {
            "id": "2",
            "text": "Celler vokser og danner matrix"
          },
          {
            "id": "1",
            "text": "Celler hæfter sig"
          },
          {
            "id": "0",
            "text": "Mikroorganismer når en overflade"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Biofilmdannelse kan give vedvarende kolonisering."
      },
      {
        "id": "cell",
        "kind": "classify",
        "prompt": "Sortér strukturer efter organisme.",
        "categories": [
          {
            "id": "0",
            "text": "Bakterie"
          },
          {
            "id": "1",
            "text": "Virus"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Ribosomer"
          },
          {
            "id": "1",
            "text": "Kan have kapsid"
          },
          {
            "id": "2",
            "text": "Kan dele sig ved binær fission"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "0"
        },
        "explanation": "Bakterier er celler; virus kræver værtsceller."
      },
      {
        "id": "history",
        "kind": "clues",
        "prompt": "Markér relevante oplysninger.",
        "options": [
          {
            "id": "0",
            "text": "Hvor længe kateteret har ligget"
          },
          {
            "id": "1",
            "text": "Ny feber"
          },
          {
            "id": "2",
            "text": "Ændret almen tilstand"
          },
          {
            "id": "3",
            "text": "Patientens tidligere yndlingssport"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Kateter og ny almen påvirkning er relevante, men udelukker ikke andre årsager."
      },
      {
        "id": "urine",
        "kind": "short",
        "prompt": "Hvad kaldes bakterier i urinen?",
        "correct": "Bakteriuri",
        "accepted": [
          "bakteriurien",
          "bacteriuria"
        ],
        "explanation": "Bakteriuri kan forekomme uden symptomgivende infektion."
      }
    ]
  },
  {
    "id": "target-biofilm-behandler",
    "familyId": "target-biofilm",
    "title": "Feber hos en patient med kateter",
    "category": "Infektion",
    "intro": "En 78-årig med længerevarende urinvejskateter har feber og er mere træt. Der er endnu ikke afklaret en årsag til symptomerne.",
    "vitals": {
      "Temp": "38,6 °C",
      "Puls": "104/min",
      "BT": "118/72 mmHg"
    },
    "subjects": [
      "Mikrobiologi",
      "Immunologi",
      "Hygiejne",
      "Sygdomslære",
      "Farmakologi",
      "Klinisk vurdering"
    ],
    "difficulty": "Behandler",
    "status": "draft",
    "sources": [
      {
        "title": "CDC – Urinary catheter culture stewardship",
        "url": "https://www.cdc.gov/uti/hcp/clinical-guidance/index.html"
      },
      {
        "title": "CDC – Catheter pathogenesis",
        "url": "https://www.cdc.gov/infection-control/hcp/intravascular-catheter-related-infection/pathogenesis.html"
      }
    ],
    "takeaway": "Biofilm er et mikrobielt samfund med matrix. Kolonisering af kateter er ikke i sig selv bevis for symptomgivende infektion.",
    "objectives": [
      "Forklar matrix og kolonisering.",
      "Forstå antibiotikafølsomhed."
    ],
    "steps": [
      {
        "id": "gram",
        "kind": "match",
        "prompt": "Forbind struktur med bakterietype.",
        "left": [
          {
            "id": "0",
            "text": "Tykt peptidoglycanlag"
          },
          {
            "id": "1",
            "text": "Ydre membran med LPS"
          },
          {
            "id": "2",
            "text": "Tyndt peptidoglycanlag og ydre membran"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Gram-negativ cellevæg"
          },
          {
            "id": "1",
            "text": "Gram-negativt membrantræk"
          },
          {
            "id": "2",
            "text": "Gram-positiv cellevæg"
          }
        ],
        "correct": {
          "0": "2",
          "1": "1",
          "2": "0"
        },
        "explanation": "Gram-negative bakterier har ydre membran og et tyndere peptidoglycanlag."
      },
      {
        "id": "targets",
        "kind": "classify",
        "prompt": "Sortér målstrukturer.",
        "categories": [
          {
            "id": "0",
            "text": "Betalaktamer"
          },
          {
            "id": "1",
            "text": "Andre antibiotikagrupper"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Peptidoglycansyntese"
          },
          {
            "id": "1",
            "text": "Bakteriel proteinsyntese"
          },
          {
            "id": "2",
            "text": "Bakterielle topoisomeraser"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "1"
        },
        "explanation": "Betalaktamer hæmmer cellevægssyntese; andre grupper har andre mål."
      },
      {
        "id": "matrix",
        "kind": "order",
        "prompt": "Byg en mulig årsagskæde for vedvarende biofilm.",
        "options": [
          {
            "id": "3",
            "text": "Behandling kan have sværere ved at fjerne alle celler"
          },
          {
            "id": "2",
            "text": "Nogle celler vokser langsomt"
          },
          {
            "id": "1",
            "text": "Lokale vækstbetingelser varierer"
          },
          {
            "id": "0",
            "text": "Celler fastholdes i matrix"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Biofilm kan give ændrede fysiologiske tilstande og øget tolerance."
      },
      {
        "id": "free",
        "kind": "short",
        "prompt": "Hvad kaldes fritlevende bakterieceller i modsætning til biofilmbundne?",
        "correct": "Planktoniske celler",
        "accepted": [
          "planktoniske bakterier",
          "planktoniske",
          "planktonisk"
        ],
        "explanation": "Planktoniske og biofilmbundne celler kan have forskellig fysiologi."
      },
      {
        "id": "source",
        "kind": "clues",
        "prompt": "Markér oplysninger der er vigtige ved mistanke om symptomgivende infektion.",
        "options": [
          {
            "id": "0",
            "text": "Ny klinisk påvirkning"
          },
          {
            "id": "1",
            "text": "Relevante lokale symptomer"
          },
          {
            "id": "2",
            "text": "Andre mulige infektionsfoci"
          },
          {
            "id": "3",
            "text": "Positiv urindyrkning som eneste bevis"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Bakteriuri hos kateterbærere er almindelig; klinisk vurdering er nødvendig."
      },
      {
        "id": "defense",
        "kind": "classify",
        "prompt": "Sortér værtsforsvaret.",
        "categories": [
          {
            "id": "0",
            "text": "Medfødt"
          },
          {
            "id": "1",
            "text": "Adaptivt"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Neutrofil fagocytose"
          },
          {
            "id": "1",
            "text": "Antigenspecifikke antistoffer"
          },
          {
            "id": "2",
            "text": "Komplementaktivering"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "0"
        },
        "explanation": "De to dele af immunforsvaret samarbejder."
      }
    ]
  },
  {
    "id": "target-biofilm-paramediciner",
    "familyId": "target-biofilm",
    "title": "Feber hos en patient med kateter",
    "category": "Infektion",
    "intro": "En 78-årig med længerevarende urinvejskateter har feber og er mere træt. Der er endnu ikke afklaret en årsag til symptomerne.",
    "vitals": {
      "Temp": "38,6 °C",
      "Puls": "104/min",
      "BT": "118/72 mmHg"
    },
    "subjects": [
      "Mikrobiologi",
      "Immunologi",
      "Hygiejne",
      "Sygdomslære",
      "Farmakologi",
      "Klinisk vurdering"
    ],
    "difficulty": "Paramediciner",
    "status": "draft",
    "sources": [
      {
        "title": "CDC – Urinary catheter culture stewardship",
        "url": "https://www.cdc.gov/uti/hcp/clinical-guidance/index.html"
      },
      {
        "title": "CDC – Catheter pathogenesis",
        "url": "https://www.cdc.gov/infection-control/hcp/intravascular-catheter-related-infection/pathogenesis.html"
      }
    ],
    "takeaway": "Biofilm er et mikrobielt samfund med matrix. Kolonisering af kateter er ikke i sig selv bevis for symptomgivende infektion.",
    "objectives": [
      "Skeln tolerance og resistens.",
      "Relatér prøvesvar til patientens tilstand."
    ],
    "steps": [
      {
        "id": "tolerance",
        "kind": "classify",
        "prompt": "Skeln mellem resistens og tolerance.",
        "categories": [
          {
            "id": "0",
            "text": "Resistens"
          },
          {
            "id": "1",
            "text": "Tolerance"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Vækst ved højere antibiotikakoncentration"
          },
          {
            "id": "1",
            "text": "Langsommere drab uden nødvendig stigning i MIC"
          },
          {
            "id": "2",
            "text": "Arvelig ændring kan øge MIC"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "0"
        },
        "explanation": "Tolerance beskriver overlevelse under eksponering og er ikke det samme som øget MIC."
      },
      {
        "id": "mic",
        "kind": "short",
        "prompt": "Hvad forkortes minimum inhibitorisk koncentration normalt til?",
        "correct": "MIC",
        "accepted": [
          "minimum inhibitory concentration",
          "minimum inhibitorisk koncentration"
        ],
        "explanation": "MIC er den laveste koncentration som hæmmer synlig vækst under definerede testbetingelser."
      },
      {
        "id": "sample",
        "kind": "match",
        "prompt": "Forbind undersøgelse med hvad den belyser.",
        "left": [
          {
            "id": "0",
            "text": "Urindyrkning"
          },
          {
            "id": "1",
            "text": "Resistensbestemmelse"
          },
          {
            "id": "2",
            "text": "Klinisk vurdering"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Patientens aktuelle organfunktion"
          },
          {
            "id": "1",
            "text": "Dyrkbare mikroorganismer i prøven"
          },
          {
            "id": "2",
            "text": "Følsomhed under testbetingelser"
          }
        ],
        "correct": {
          "0": "1",
          "1": "2",
          "2": "0"
        },
        "explanation": "Ingen af disse kan alene besvare alle kliniske spørgsmål."
      },
      {
        "id": "inflammation",
        "kind": "order",
        "prompt": "Byg en mulig udvikling ved alvorlig infektion.",
        "options": [
          {
            "id": "3",
            "text": "Organdysfunktion kan følge"
          },
          {
            "id": "2",
            "text": "Karregulation og permeabilitet kan ændres"
          },
          {
            "id": "1",
            "text": "Inflammatoriske signaler frigives"
          },
          {
            "id": "0",
            "text": "Mikrobielle komponenter aktiverer værtsforsvaret"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Alvorlig infektion kan medføre dysreguleret værtsrespons."
      },
      {
        "id": "revision",
        "kind": "clues",
        "prompt": "Markér de fund der øger behovet for hurtig revurdering.",
        "options": [
          {
            "id": "0",
            "text": "Ny hypotension"
          },
          {
            "id": "1",
            "text": "Ny konfusion"
          },
          {
            "id": "2",
            "text": "Stigende respirationsarbejde"
          },
          {
            "id": "3",
            "text": "Tidligere asymptomatisk bakteriuri alene"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Nye organsymptomer er mere relevante for alvorlighed end et isoleret prøvesvar.",
        "update": "Patienten er nu mere konfus og blodtrykket er faldet."
      },
      {
        "id": "lps",
        "kind": "short",
        "prompt": "Hvad forkortes lipopolysakkarid i den gram-negative ydre membran til?",
        "correct": "LPS",
        "accepted": [
          "lipopolysakkarid",
          "lipopolysaccharid",
          "lipopolysaccharide"
        ],
        "explanation": "LPS kan aktivere det medfødte immunforsvar."
      }
    ]
  },
  {
    "id": "target-di-elev",
    "familyId": "target-di",
    "title": "Tørst og store urinmængder",
    "category": "Endokrinologi",
    "intro": "En 42-årig fortæller om voldsom tørst og store mængder lys urin efter tidligere hypofysekirurgi. Blodglukosen er 5,8 mmol/L.",
    "vitals": {
      "Puls": "102/min",
      "BT": "110/70 mmHg",
      "Glukose": "5,8 mmol/L"
    },
    "subjects": [
      "Endokrinologi",
      "Fysiologi",
      "Sygdomslære",
      "Patofysiologi",
      "Medicinregning",
      "Klinisk vurdering"
    ],
    "difficulty": "Elev",
    "status": "draft",
    "sources": [
      {
        "title": "NIDDK – Diabetes insipidus",
        "url": "https://www.niddk.nih.gov/health-information/kidney-disease/diabetes-insipidus"
      }
    ],
    "takeaway": "Vasopressin regulerer vandreabsorption. Diabetes insipidus kan give vandtab og hypernatriæmi, hvis indtag ikke kompenserer.",
    "objectives": [
      "Forstå tørst og ADH.",
      "Skeln sukker- og vandbalance."
    ],
    "steps": [
      {
        "id": "adh",
        "kind": "short",
        "prompt": "Hvad forkortes antidiuretisk hormon til?",
        "correct": "ADH",
        "accepted": [
          "vasopressin",
          "avp",
          "arginin vasopressin"
        ],
        "explanation": "ADH øger vandpermeabiliteten i nyrernes samlerør."
      },
      {
        "id": "roles",
        "kind": "match",
        "prompt": "Forbind hormon med funktion.",
        "left": [
          {
            "id": "0",
            "text": "ADH"
          },
          {
            "id": "1",
            "text": "Insulin"
          },
          {
            "id": "2",
            "text": "Glukagon"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Øger leverens glukosefrigivelse"
          },
          {
            "id": "1",
            "text": "Fremmer vandreabsorption"
          },
          {
            "id": "2",
            "text": "Fremmer glukoseoptag i muskel"
          }
        ],
        "correct": {
          "0": "1",
          "1": "2",
          "2": "0"
        },
        "explanation": "Hormonerne regulerer forskellige dele af homeostasen."
      },
      {
        "id": "loss",
        "kind": "classify",
        "prompt": "Hvad kan ske ved utilstrækkelig ADH-virkning?",
        "categories": [
          {
            "id": "0",
            "text": "↑ Stiger"
          },
          {
            "id": "1",
            "text": "↓ Falder"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Vandreabsorption i samlerør"
          },
          {
            "id": "1",
            "text": "Urinvolumen"
          },
          {
            "id": "2",
            "text": "Tørst ved stigende osmolalitet"
          }
        ],
        "correct": {
          "0": "1",
          "1": "0",
          "2": "0"
        },
        "explanation": "Mindre vandreabsorption kan øge vandtab og tørst."
      },
      {
        "id": "balance",
        "kind": "number",
        "prompt": "Patienten har drukket 1500 ml og haft 2400 ml urin. Beregn nettobalancen, uden andre tab.",
        "answer": -900,
        "unit": "ml",
        "tolerance": 0.001,
        "explanation": "1500 − 2400 = −900 ml."
      },
      {
        "id": "dehydration",
        "kind": "order",
        "prompt": "Byg en mulig udvikling ved utilstrækkeligt væskeindtag.",
        "options": [
          {
            "id": "3",
            "text": "Svimmelhed kan følge"
          },
          {
            "id": "2",
            "text": "Cirkulerende volumen kan falde"
          },
          {
            "id": "1",
            "text": "Netto vandtab"
          },
          {
            "id": "0",
            "text": "Stor urinproduktion"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Vandtab kan give kredsløbspåvirkning."
      },
      {
        "id": "polyuria",
        "kind": "short",
        "prompt": "Hvad kaldes unormalt stor urinproduktion?",
        "correct": "Polyuri",
        "accepted": [
          "polyuria",
          "polyurien"
        ],
        "explanation": "Polyuri er et symptom med flere mulige årsager."
      }
    ]
  },
  {
    "id": "target-di-behandler",
    "familyId": "target-di",
    "title": "Tørst og store urinmængder",
    "category": "Endokrinologi",
    "intro": "En 42-årig fortæller om voldsom tørst og store mængder lys urin efter tidligere hypofysekirurgi. Blodglukosen er 5,8 mmol/L.",
    "vitals": {
      "Puls": "102/min",
      "BT": "110/70 mmHg",
      "Glukose": "5,8 mmol/L"
    },
    "subjects": [
      "Endokrinologi",
      "Fysiologi",
      "Sygdomslære",
      "Patofysiologi",
      "Medicinregning",
      "Klinisk vurdering"
    ],
    "difficulty": "Behandler",
    "status": "draft",
    "sources": [
      {
        "title": "NIDDK – Diabetes insipidus",
        "url": "https://www.niddk.nih.gov/health-information/kidney-disease/diabetes-insipidus"
      }
    ],
    "takeaway": "Vasopressin regulerer vandreabsorption. Diabetes insipidus kan give vandtab og hypernatriæmi, hvis indtag ikke kompenserer.",
    "objectives": [
      "Forklar ADH og renal respons.",
      "Beregn væsketab."
    ],
    "steps": [
      {
        "id": "site",
        "kind": "short",
        "prompt": "I hvilken del af nefronet øger ADH vandpermeabiliteten?",
        "correct": "Samlerør",
        "accepted": [
          "samlerørene",
          "samlerøret",
          "collecting duct"
        ],
        "explanation": "ADH øger vandreabsorption i samlerørene."
      },
      {
        "id": "types",
        "kind": "classify",
        "prompt": "Skeln mellem to årsager til diabetes insipidus.",
        "categories": [
          {
            "id": "0",
            "text": "Central (AVP-mangel)"
          },
          {
            "id": "1",
            "text": "Nefrogen (AVP-resistens)"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Utilstrækkelig frigivelse af vasopressin"
          },
          {
            "id": "1",
            "text": "Nyrerne responderer utilstrækkeligt på vasopressin"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1"
        },
        "explanation": "Både utilstrækkeligt hormon og nedsat respons kan give fortyndet urin."
      },
      {
        "id": "feedback",
        "kind": "order",
        "prompt": "Byg den normale hormonrespons ved stigende plasmaosmolalitet.",
        "options": [
          {
            "id": "3",
            "text": "Vandtab via urin mindskes"
          },
          {
            "id": "2",
            "text": "Vandreabsorption i samlerør øges"
          },
          {
            "id": "1",
            "text": "ADH-frigivelse øges"
          },
          {
            "id": "0",
            "text": "Osmoreceptorer registrerer ændringen"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Negativ feedback bidrager til at begrænse ændringer i osmolalitet."
      },
      {
        "id": "rate",
        "kind": "number",
        "prompt": "Urinmængden er 1800 ml over 4 timer. Beregn gennemsnit pr. time.",
        "answer": 450,
        "unit": "ml/time",
        "tolerance": 0.001,
        "explanation": "1800 / 4 = 450 ml/time."
      },
      {
        "id": "history",
        "kind": "clues",
        "prompt": "Markér oplysninger der er særligt relevante.",
        "options": [
          {
            "id": "0",
            "text": "Tidligere hypofysekirurgi"
          },
          {
            "id": "1",
            "text": "Ny stor urinmængde og tørst"
          },
          {
            "id": "2",
            "text": "Medicinliste, herunder eventuel lithium"
          },
          {
            "id": "3",
            "text": "Gammel forstuvning uden aktuelle gener"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Kirurgi og visse lægemidler kan være relevante for ADH-systemet."
      },
      {
        "id": "comparison",
        "kind": "classify",
        "prompt": "Sortér de primære mekanismer.",
        "categories": [
          {
            "id": "0",
            "text": "Diabetes mellitus"
          },
          {
            "id": "1",
            "text": "Diabetes insipidus"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Hyperglykæmi med mulig glukosuri"
          },
          {
            "id": "1",
            "text": "Utilstrækkelig ADH-virkning"
          },
          {
            "id": "2",
            "text": "Primært problem med regulering af frit vand"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "1"
        },
        "explanation": "Polyuri ses ved begge, men mekanismerne er forskellige."
      }
    ]
  },
  {
    "id": "target-di-paramediciner",
    "familyId": "target-di",
    "title": "Tørst og store urinmængder",
    "category": "Endokrinologi",
    "intro": "En 42-årig fortæller om voldsom tørst og store mængder lys urin efter tidligere hypofysekirurgi. Blodglukosen er 5,8 mmol/L.",
    "vitals": {
      "Puls": "102/min",
      "BT": "110/70 mmHg",
      "Glukose": "5,8 mmol/L"
    },
    "subjects": [
      "Endokrinologi",
      "Fysiologi",
      "Sygdomslære",
      "Patofysiologi",
      "Medicinregning",
      "Klinisk vurdering"
    ],
    "difficulty": "Paramediciner",
    "status": "draft",
    "sources": [
      {
        "title": "NIDDK – Diabetes insipidus",
        "url": "https://www.niddk.nih.gov/health-information/kidney-disease/diabetes-insipidus"
      }
    ],
    "takeaway": "Vasopressin regulerer vandreabsorption. Diabetes insipidus kan give vandtab og hypernatriæmi, hvis indtag ikke kompenserer.",
    "objectives": [
      "Skeln central og nefrogen årsag.",
      "Relatér natrium og osmolalitet."
    ],
    "steps": [
      {
        "id": "osmo",
        "kind": "classify",
        "prompt": "Hvad kan ske ved frit vandtab uden tilstrækkeligt indtag?",
        "categories": [
          {
            "id": "0",
            "text": "↑ Stiger"
          },
          {
            "id": "1",
            "text": "↓ Falder"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Plasmaosmolalitet"
          },
          {
            "id": "1",
            "text": "Natriumkoncentration"
          },
          {
            "id": "2",
            "text": "Samlet kropsvand"
          }
        ],
        "correct": {
          "0": "0",
          "1": "0",
          "2": "1"
        },
        "explanation": "Tab af relativt rent vand kan koncentrere plasma."
      },
      {
        "id": "net",
        "kind": "number",
        "prompt": "I en model er vandindtag 2,1 L og urinproduktion 3,6 L. Beregn nettobalancen i ml.",
        "answer": -1500,
        "unit": "ml",
        "tolerance": 0.001,
        "explanation": "2,1 − 3,6 = −1,5 L = −1500 ml."
      },
      {
        "id": "drug",
        "kind": "match",
        "prompt": "Forbind begreb med funktion.",
        "left": [
          {
            "id": "0",
            "text": "Desmopressin"
          },
          {
            "id": "1",
            "text": "Lithium"
          },
          {
            "id": "2",
            "text": "V2-receptor"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Kan medføre renal vasopressinresistens"
          },
          {
            "id": "1",
            "text": "Mediator for ADH-virkning i samlerør"
          },
          {
            "id": "2",
            "text": "Vasopressinanalog"
          }
        ],
        "correct": {
          "0": "2",
          "1": "0",
          "2": "1"
        },
        "explanation": "Desmopressin kan erstatte manglende AVP-virkning ved central diabetes insipidus. Lithium kan påvirke nyrernes respons."
      },
      {
        "id": "sodium",
        "kind": "short",
        "prompt": "Hvad kaldes forhøjet natriumkoncentration i blodet?",
        "correct": "Hypernatriæmi",
        "accepted": [
          "hypernatremi",
          "hypernatriemi",
          "hypernatraemia",
          "hypernatremia"
        ],
        "explanation": "Hypernatriæmi kan udvikles ved relativt vandunderskud."
      },
      {
        "id": "changes",
        "kind": "clues",
        "prompt": "Markér de nye oplysninger som er særligt relevante for vurderingen.",
        "options": [
          {
            "id": "0",
            "text": "Ny konfusion"
          },
          {
            "id": "1",
            "text": "BT 88/54 mmHg"
          },
          {
            "id": "2",
            "text": "Patienten kan ikke længere drikke tilstrækkeligt"
          },
          {
            "id": "3",
            "text": "Normalt blodsukker som eneste sikkerhedstegn"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Neurologiske fund og kredsløbspåvirkning ved vandtab kræver hurtig vurdering.",
        "update": "Patienten er blevet mere sløv og kan ikke holde væskeindtaget oppe."
      },
      {
        "id": "cellwater",
        "kind": "order",
        "prompt": "Byg en forenklet osmotisk mekanisme.",
        "options": [
          {
            "id": "2",
            "text": "Cellevolumen kan falde"
          },
          {
            "id": "1",
            "text": "Vand bevæger sig ud af celler"
          },
          {
            "id": "0",
            "text": "Ekstracellulær tonicitet stiger"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Effektivt hypertonisk ekstracellulær væske kan trække vand ud af celler."
      }
    ]
  },
  {
    "id": "target-gi-elev",
    "familyId": "target-gi",
    "title": "Sort afføring og svimmelhed",
    "category": "Gastroenterologi",
    "intro": "En 65-årig med tidligere mavesår har sort, tjæreagtig afføring og svimmelhed. Patienten fortæller om brug af NSAID mod ledsmerter.",
    "vitals": {
      "Puls": "108/min",
      "BT": "104/68 mmHg",
      "RF": "22/min"
    },
    "subjects": [
      "Sygdomslære",
      "Anatomi",
      "Patofysiologi",
      "Farmakologi",
      "Medicinregning",
      "Klinisk vurdering"
    ],
    "difficulty": "Elev",
    "status": "draft",
    "sources": [
      {
        "title": "NIDDK – GI bleeding",
        "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gastrointestinal-bleeding/symptoms-causes"
      }
    ],
    "takeaway": "GI-blødning har flere mulige årsager. Klinisk perfusion og udvikling vurderes sammen med anamnese og prøver.",
    "objectives": [
      "Genkend GI-blødningssymptomer.",
      "Forstå kredsløbskompensation."
    ],
    "steps": [
      {
        "id": "melena",
        "kind": "short",
        "prompt": "Hvad kaldes sort tjæreagtig afføring ved fordøjet blod?",
        "correct": "Melæna",
        "accepted": [
          "melena",
          "melaena",
          "melæna"
        ],
        "explanation": "Melæna kan tyde på GI-blødning, ofte fra øvre GI-kanal."
      },
      {
        "id": "terms",
        "kind": "match",
        "prompt": "Forbind symptom og begreb.",
        "left": [
          {
            "id": "0",
            "text": "Hæmatemese"
          },
          {
            "id": "1",
            "text": "Melæna"
          },
          {
            "id": "2",
            "text": "Hæmatokesi"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Frisk rødt blod per rectum"
          },
          {
            "id": "1",
            "text": "Blodig opkast"
          },
          {
            "id": "2",
            "text": "Sort tjæreagtig afføring"
          }
        ],
        "correct": {
          "0": "1",
          "1": "2",
          "2": "0"
        },
        "explanation": "Symptomernes udseende giver spor om blødningskilden."
      },
      {
        "id": "sites",
        "kind": "classify",
        "prompt": "Sortér organerne.",
        "categories": [
          {
            "id": "0",
            "text": "Øvre GI-kanal"
          },
          {
            "id": "1",
            "text": "Nedre GI-kanal"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Ventrikel"
          },
          {
            "id": "1",
            "text": "Duodenum"
          },
          {
            "id": "2",
            "text": "Colon"
          }
        ],
        "correct": {
          "0": "0",
          "1": "0",
          "2": "1"
        },
        "explanation": "Øvre GI-blødninger omfatter blandt andet oesophagus, ventrikel og duodenum."
      },
      {
        "id": "history",
        "kind": "clues",
        "prompt": "Markér oplysninger relevante for mulig GI-blødning.",
        "options": [
          {
            "id": "0",
            "text": "Tidligere mavesår"
          },
          {
            "id": "1",
            "text": "NSAID-brug"
          },
          {
            "id": "2",
            "text": "Svimmelhed og sort afføring"
          },
          {
            "id": "3",
            "text": "Tidligere ukompliceret ankelbrud"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Anamnese og klinisk tilstand bidrager til mistanken."
      },
      {
        "id": "blood",
        "kind": "order",
        "prompt": "Byg en mulig kompensationskæde.",
        "options": [
          {
            "id": "3",
            "text": "Kompensatorisk pulsøgning kan følge"
          },
          {
            "id": "2",
            "text": "Reduceret slagvolumen"
          },
          {
            "id": "1",
            "text": "Reduceret venøst tilbageløb"
          },
          {
            "id": "0",
            "text": "Blodtab"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Takykardi kan kompensere for reduceret slagvolumen."
      },
      {
        "id": "pulse",
        "kind": "number",
        "prompt": "Beregn pulsstigningen fra 88 til 108/min.",
        "answer": 20,
        "unit": "/min",
        "tolerance": 0.001,
        "explanation": "108 − 88 = 20/min."
      }
    ]
  },
  {
    "id": "target-gi-behandler",
    "familyId": "target-gi",
    "title": "Sort afføring og svimmelhed",
    "category": "Gastroenterologi",
    "intro": "En 65-årig med tidligere mavesår har sort, tjæreagtig afføring og svimmelhed. Patienten fortæller om brug af NSAID mod ledsmerter.",
    "vitals": {
      "Puls": "108/min",
      "BT": "104/68 mmHg",
      "RF": "22/min"
    },
    "subjects": [
      "Sygdomslære",
      "Anatomi",
      "Patofysiologi",
      "Farmakologi",
      "Medicinregning",
      "Klinisk vurdering"
    ],
    "difficulty": "Behandler",
    "status": "draft",
    "sources": [
      {
        "title": "NIDDK – GI bleeding",
        "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gastrointestinal-bleeding/symptoms-causes"
      }
    ],
    "takeaway": "GI-blødning har flere mulige årsager. Klinisk perfusion og udvikling vurderes sammen med anamnese og prøver.",
    "objectives": [
      "Forstå ulcus og lægemiddelrisiko.",
      "Beregn og fortolk perfusionsmål."
    ],
    "steps": [
      {
        "id": "ulcus",
        "kind": "short",
        "prompt": "Hvad kaldes et sår i ventrikel- eller duodenalslimhinden?",
        "correct": "Ulcus",
        "accepted": [
          "peptisk ulcus",
          "mavesår",
          "ulcus ventriculi",
          "ulcus duodeni"
        ],
        "explanation": "Et peptisk ulcus kan medføre blødning."
      },
      {
        "id": "risk",
        "kind": "match",
        "prompt": "Forbind faktor med mekanisme.",
        "left": [
          {
            "id": "0",
            "text": "NSAID"
          },
          {
            "id": "1",
            "text": "H. pylori"
          },
          {
            "id": "2",
            "text": "Antikoagulation"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Kan fremme ulcus via kronisk inflammation"
          },
          {
            "id": "1",
            "text": "Kan øge blødningsrisiko"
          },
          {
            "id": "2",
            "text": "Kan hæmme beskyttende prostaglandiner"
          }
        ],
        "correct": {
          "0": "2",
          "1": "0",
          "2": "1"
        },
        "explanation": "Årsager til slimhindeskade og faktorer der øger blødning er ikke nødvendigvis de samme."
      },
      {
        "id": "barrier",
        "kind": "order",
        "prompt": "Byg en mulig mekanisme ved NSAID-relateret slimhindeskade.",
        "options": [
          {
            "id": "3",
            "text": "Ulcus og blødning kan opstå"
          },
          {
            "id": "2",
            "text": "Slimhindens forsvar svækkes"
          },
          {
            "id": "1",
            "text": "Beskyttende prostaglandiner reduceres"
          },
          {
            "id": "0",
            "text": "COX hæmmes"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Prostaglandiner bidrager til slimhindens beskyttelse."
      },
      {
        "id": "map",
        "kind": "number",
        "prompt": "Estimér MAP ved 104/68 mmHg, afrundet til helt tal.",
        "answer": 80,
        "unit": "mmHg",
        "tolerance": 0.001,
        "explanation": "(104 + 2 × 68) / 3 = 80 mmHg."
      },
      {
        "id": "worse",
        "kind": "clues",
        "prompt": "Markér fund der kan tyde på kredsløbsforværring.",
        "options": [
          {
            "id": "0",
            "text": "Ny konfusion"
          },
          {
            "id": "1",
            "text": "Bleg og kold hud"
          },
          {
            "id": "2",
            "text": "Faldende blodtryk"
          },
          {
            "id": "3",
            "text": "Uændret gammel ledømhed"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Flere perfusionsfund bør vurderes samlet.",
        "update": "Patienten bliver blegere og mere svimmel."
      },
      {
        "id": "drugs",
        "kind": "classify",
        "prompt": "Sortér lægemidler efter deres primære virkning.",
        "categories": [
          {
            "id": "0",
            "text": "Syrehæmning"
          },
          {
            "id": "1",
            "text": "Påvirker hæmostase"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Protonpumpehæmmer"
          },
          {
            "id": "1",
            "text": "Trombocythæmmer"
          },
          {
            "id": "2",
            "text": "Antikoagulans"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "1"
        },
        "explanation": "Syrehæmmere og antitrombotiske stoffer har forskellige mål."
      }
    ]
  },
  {
    "id": "target-gi-paramediciner",
    "familyId": "target-gi",
    "title": "Sort afføring og svimmelhed",
    "category": "Gastroenterologi",
    "intro": "En 65-årig med tidligere mavesår har sort, tjæreagtig afføring og svimmelhed. Patienten fortæller om brug af NSAID mod ledsmerter.",
    "vitals": {
      "Puls": "108/min",
      "BT": "104/68 mmHg",
      "RF": "22/min"
    },
    "subjects": [
      "Sygdomslære",
      "Anatomi",
      "Patofysiologi",
      "Farmakologi",
      "Medicinregning",
      "Klinisk vurdering"
    ],
    "difficulty": "Paramediciner",
    "status": "draft",
    "sources": [
      {
        "title": "NIDDK – GI bleeding",
        "url": "https://www.niddk.nih.gov/health-information/digestive-diseases/gastrointestinal-bleeding/symptoms-causes"
      }
    ],
    "takeaway": "GI-blødning har flere mulige årsager. Klinisk perfusion og udvikling vurderes sammen med anamnese og prøver.",
    "objectives": [
      "Relatér portal hypertension og hæmostase.",
      "Forstå begrænsninger ved laboratorietal."
    ],
    "steps": [
      {
        "id": "portal",
        "kind": "order",
        "prompt": "Byg en mulig mekanisme ved cirrose.",
        "options": [
          {
            "id": "3",
            "text": "Varicer kan bløde"
          },
          {
            "id": "2",
            "text": "Kollaterale vener kan udvides"
          },
          {
            "id": "1",
            "text": "Portaltryk kan stige"
          },
          {
            "id": "0",
            "text": "Modstand mod portal blodgennemstrømning stiger"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Portal hypertension kan føre til varicer, men ikke alle GI-blødninger skyldes varicer."
      },
      {
        "id": "hemostasis",
        "kind": "match",
        "prompt": "Forbind element med funktion.",
        "left": [
          {
            "id": "0",
            "text": "Trombocytter"
          },
          {
            "id": "1",
            "text": "Fibrin"
          },
          {
            "id": "2",
            "text": "Hæmoglobin"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Oxygentransport"
          },
          {
            "id": "1",
            "text": "Primær hæmostase"
          },
          {
            "id": "2",
            "text": "Stabiliserer koaglet"
          }
        ],
        "correct": {
          "0": "1",
          "1": "2",
          "2": "0"
        },
        "explanation": "Hæmostase og oxygentransport påvirkes forskelligt ved blødning."
      },
      {
        "id": "portal",
        "kind": "short",
        "prompt": "Hvad kaldes det venøse karsystem fra blandt andet tarm til lever?",
        "correct": "Portåresystemet",
        "accepted": [
          "portåren",
          "vena portae",
          "portalkredsløbet",
          "portalkredsløb",
          "portalvenesystemet"
        ],
        "explanation": "Portalvenen leder blod fra blandt andet mave-tarm-kanal til leveren."
      },
      {
        "id": "hb",
        "kind": "classify",
        "prompt": "Skeln mellem akut blodtab og efterfølgende væskeforskydning.",
        "categories": [
          {
            "id": "0",
            "text": "Akut før større væskeforskydning"
          },
          {
            "id": "1",
            "text": "Efter fortynding ved væskeforskydning"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Hæmoglobinkoncentration kan endnu være nær udgangspunktet"
          },
          {
            "id": "1",
            "text": "Hæmoglobinkoncentration kan falde ved fortynding"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1"
        },
        "explanation": "En tidlig normal hæmoglobinkoncentration udelukker ikke betydeligt akut blodtab."
      },
      {
        "id": "shock",
        "kind": "number",
        "prompt": "Ved puls 126/min og systolisk BT 90 mmHg: beregn shockindeks (puls/SBP) med én decimal.",
        "answer": 1.4,
        "unit": "",
        "tolerance": 0.001,
        "explanation": "126 / 90 = 1,4. Indekset er et supplement til klinisk vurdering."
      },
      {
        "id": "handover",
        "kind": "clues",
        "prompt": "Markér oplysninger der er centrale ved overlevering.",
        "options": [
          {
            "id": "0",
            "text": "Symptomdebut og mulig blødningsmængde"
          },
          {
            "id": "1",
            "text": "Ændringer i puls, blodtryk og bevidsthed"
          },
          {
            "id": "2",
            "text": "Antitrombotisk medicin og tidligere leversygdom"
          },
          {
            "id": "3",
            "text": "En tidlig normal Hb som bevis for fravær af blødning"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Forløb, perfusion og medicin er vigtige; Hb alene udelukker ikke akut blødning.",
        "update": "Ved revurdering er pulsen 126/min og BT 90/58 mmHg."
      }
    ]
  },
  {
    "id": "target-immunity-elev",
    "familyId": "target-immunity",
    "title": "Smitte i familien og vaccinationshistorik",
    "category": "Immunologi",
    "intro": "En 46-årig med feber og hoste fortæller, at flere familiemedlemmer har haft luftvejsinfektion. Patienten spørger, hvorfor tidligere vaccination ikke nødvendigvis forhindrer sygdom.",
    "vitals": {
      "Temp": "38,2 °C",
      "Puls": "96/min",
      "RF": "19/min"
    },
    "subjects": [
      "Immunologi",
      "Mikrobiologi",
      "Sygdomslære",
      "Farmakologi",
      "Klinisk vurdering"
    ],
    "difficulty": "Elev",
    "status": "draft",
    "sources": [
      {
        "title": "CDC – Understanding how vaccines work",
        "url": "https://www.cdc.gov/vaccines/basics/explaining-how-vaccines-work.html"
      },
      {
        "title": "OpenStax – Adaptive immune response",
        "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-3-the-adaptive-immune-response-t-lymphocytes-and-their-functional-types"
      }
    ],
    "takeaway": "Vaccination kan etablere immunologisk hukommelse og reducere risiko for sygdom eller alvorligt forløb. Beskyttelsen er ikke nødvendigvis fuldstændig.",
    "objectives": [
      "Skeln antigen og antistof.",
      "Forstå immunologisk hukommelse."
    ],
    "steps": [
      {
        "id": "antigen",
        "kind": "short",
        "prompt": "Hvad kaldes en struktur, som kan genkendes specifikt af det adaptive immunforsvar?",
        "correct": "Antigen",
        "accepted": [
          "antigenet",
          "antigener"
        ],
        "explanation": "Et antigen kan genkendes af antistoffer eller lymfocytter via relevante mekanismer."
      },
      {
        "id": "cells",
        "kind": "match",
        "prompt": "Forbind celletype med funktion.",
        "left": [
          {
            "id": "0",
            "text": "Neutrofil"
          },
          {
            "id": "1",
            "text": "Plasmacelle"
          },
          {
            "id": "2",
            "text": "Cytotoksisk T-celle"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Kan dræbe inficerede værtsceller"
          },
          {
            "id": "1",
            "text": "Fagocytose"
          },
          {
            "id": "2",
            "text": "Udskiller antistoffer"
          }
        ],
        "correct": {
          "0": "1",
          "1": "2",
          "2": "0"
        },
        "explanation": "Medfødt og adaptivt forsvar har komplementære funktioner."
      },
      {
        "id": "defense",
        "kind": "classify",
        "prompt": "Sortér forsvarsmekanismer.",
        "categories": [
          {
            "id": "0",
            "text": "Medfødt"
          },
          {
            "id": "1",
            "text": "Adaptivt"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Hudbarriere"
          },
          {
            "id": "1",
            "text": "Antigenspecifikke hukommelses-B-celler"
          },
          {
            "id": "2",
            "text": "Neutrofil fagocytose"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "0"
        },
        "explanation": "Medfødt forsvar reagerer hurtigt; adaptivt forsvar kan danne specifik hukommelse."
      },
      {
        "id": "memory",
        "kind": "order",
        "prompt": "Byg en forenklet vej til immunologisk hukommelse efter vaccination.",
        "options": [
          {
            "id": "3",
            "text": "Hukommelsesceller kan bestå"
          },
          {
            "id": "2",
            "text": "Lymfocytter formerer sig"
          },
          {
            "id": "1",
            "text": "Specifikke lymfocytter aktiveres"
          },
          {
            "id": "0",
            "text": "Relevant antigen præsenteres"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Vacciner kan etablere et adaptivt immunrespons og hukommelse."
      },
      {
        "id": "antibody",
        "kind": "short",
        "prompt": "Hvilken celletype udskiller store mængder antistof?",
        "correct": "Plasmaceller",
        "accepted": [
          "plasmacelle",
          "plasma celler"
        ],
        "explanation": "Plasmaceller udvikles fra aktiverede B-celler."
      },
      {
        "id": "clinical",
        "kind": "clues",
        "prompt": "Markér relevante oplysninger ved vurdering af en febril patient.",
        "options": [
          {
            "id": "0",
            "text": "Symptomernes varighed"
          },
          {
            "id": "1",
            "text": "Ændret respirationsarbejde"
          },
          {
            "id": "2",
            "text": "Immunsvækkende behandling"
          },
          {
            "id": "3",
            "text": "Vaccination som eneste bevis for fravær af infektion"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Vaccination udelukker ikke sygdom; patientens aktuelle tilstand er central."
      }
    ]
  },
  {
    "id": "target-immunity-behandler",
    "familyId": "target-immunity",
    "title": "Smitte i familien og vaccinationshistorik",
    "category": "Immunologi",
    "intro": "En 46-årig med feber og hoste fortæller, at flere familiemedlemmer har haft luftvejsinfektion. Patienten spørger, hvorfor tidligere vaccination ikke nødvendigvis forhindrer sygdom.",
    "vitals": {
      "Temp": "38,2 °C",
      "Puls": "96/min",
      "RF": "19/min"
    },
    "subjects": [
      "Immunologi",
      "Mikrobiologi",
      "Sygdomslære",
      "Farmakologi",
      "Klinisk vurdering"
    ],
    "difficulty": "Behandler",
    "status": "draft",
    "sources": [
      {
        "title": "CDC – Understanding how vaccines work",
        "url": "https://www.cdc.gov/vaccines/basics/explaining-how-vaccines-work.html"
      },
      {
        "title": "OpenStax – Adaptive immune response",
        "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-3-the-adaptive-immune-response-t-lymphocytes-and-their-functional-types"
      }
    ],
    "takeaway": "Vaccination kan etablere immunologisk hukommelse og reducere risiko for sygdom eller alvorligt forløb. Beskyttelsen er ikke nødvendigvis fuldstændig.",
    "objectives": [
      "Forbind immunceller og funktion.",
      "Skeln aktiv og passiv immunitet."
    ],
    "steps": [
      {
        "id": "immunity",
        "kind": "classify",
        "prompt": "Sortér former for immunbeskyttelse.",
        "categories": [
          {
            "id": "0",
            "text": "Aktiv"
          },
          {
            "id": "1",
            "text": "Passiv"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Vaccination med efterfølgende eget immunrespons"
          },
          {
            "id": "1",
            "text": "Tilførsel af specifikke antistoffer"
          },
          {
            "id": "2",
            "text": "Dannelse af hukommelsesceller efter immunisering"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "0"
        },
        "explanation": "Aktiv immunisering stimulerer eget respons; passiv immunisering tilfører antistoffer."
      },
      {
        "id": "functions",
        "kind": "match",
        "prompt": "Forbind antistoffunktion med eksempel.",
        "left": [
          {
            "id": "0",
            "text": "Neutralisering"
          },
          {
            "id": "1",
            "text": "Opsonisering"
          },
          {
            "id": "2",
            "text": "Komplementaktivering"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Letter fagocytters genkendelse"
          },
          {
            "id": "1",
            "text": "Kan aktivere klassisk komplementvej"
          },
          {
            "id": "2",
            "text": "Kan blokere en mikrobiel bindingsstruktur"
          }
        ],
        "correct": {
          "0": "2",
          "1": "0",
          "2": "1"
        },
        "explanation": "Antistoffer kan have forskellige funktioner."
      },
      {
        "id": "recall",
        "kind": "order",
        "prompt": "Byg et muligt sekundært immunrespons.",
        "options": [
          {
            "id": "3",
            "text": "Antistofrespons kan komme hurtigere"
          },
          {
            "id": "2",
            "text": "Specifikke celler ekspanderer"
          },
          {
            "id": "1",
            "text": "Hukommelsesceller aktiveres"
          },
          {
            "id": "0",
            "text": "Geneksponering for kendt antigen"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Immunologisk hukommelse kan give et hurtigere respons."
      },
      {
        "id": "bcell",
        "kind": "short",
        "prompt": "Hvilken lymfocyttype kan differentiere til plasmaceller?",
        "correct": "B-lymfocytter",
        "accepted": [
          "b lymfocyt",
          "b lymfocytter",
          "b celler",
          "b celle",
          "b-celle",
          "b-celler"
        ],
        "explanation": "B-celler kan differentiere til plasmaceller og hukommelses-B-celler."
      },
      {
        "id": "antigen",
        "kind": "classify",
        "prompt": "Sortér egenskaber.",
        "categories": [
          {
            "id": "0",
            "text": "Antigen"
          },
          {
            "id": "1",
            "text": "Antistof"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Kan genkendes af specifikt antistof"
          },
          {
            "id": "1",
            "text": "Immunglobulin udskilt af plasmaceller"
          },
          {
            "id": "2",
            "text": "Kan binde specifikt til et antigen"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "1"
        },
        "explanation": "Antigener og antistoffer er forskellige begreber."
      },
      {
        "id": "risk",
        "kind": "clues",
        "prompt": "Markér oplysninger der kan påvirke risikoen for et alvorligt infektiøst forløb.",
        "options": [
          {
            "id": "0",
            "text": "Immunsuppression"
          },
          {
            "id": "1",
            "text": "Høj alder"
          },
          {
            "id": "2",
            "text": "Relevant kronisk lungesygdom"
          },
          {
            "id": "3",
            "text": "Normalt tidligere syn"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Værtsfaktorer kan påvirke forløbet uanset vaccinationsstatus."
      }
    ]
  },
  {
    "id": "target-immunity-paramediciner",
    "familyId": "target-immunity",
    "title": "Smitte i familien og vaccinationshistorik",
    "category": "Immunologi",
    "intro": "En 46-årig med feber og hoste fortæller, at flere familiemedlemmer har haft luftvejsinfektion. Patienten spørger, hvorfor tidligere vaccination ikke nødvendigvis forhindrer sygdom.",
    "vitals": {
      "Temp": "38,2 °C",
      "Puls": "96/min",
      "RF": "19/min"
    },
    "subjects": [
      "Immunologi",
      "Mikrobiologi",
      "Sygdomslære",
      "Farmakologi",
      "Klinisk vurdering"
    ],
    "difficulty": "Paramediciner",
    "status": "draft",
    "sources": [
      {
        "title": "CDC – Understanding how vaccines work",
        "url": "https://www.cdc.gov/vaccines/basics/explaining-how-vaccines-work.html"
      },
      {
        "title": "OpenStax – Adaptive immune response",
        "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-3-the-adaptive-immune-response-t-lymphocytes-and-their-functional-types"
      }
    ],
    "takeaway": "Vaccination kan etablere immunologisk hukommelse og reducere risiko for sygdom eller alvorligt forløb. Beskyttelsen er ikke nødvendigvis fuldstændig.",
    "objectives": [
      "Forklar variation i immunbeskyttelse.",
      "Forstå vaccineplatforme på principniveau."
    ],
    "steps": [
      {
        "id": "platform",
        "kind": "match",
        "prompt": "Forbind vaccineprincip med beskrivelse.",
        "left": [
          {
            "id": "0",
            "text": "mRNA-vaccine"
          },
          {
            "id": "1",
            "text": "Proteinbaseret vaccine"
          },
          {
            "id": "2",
            "text": "Inaktiveret vaccine"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Tilfører et antigenprotein"
          },
          {
            "id": "1",
            "text": "Tilfører ikke-replikerende inaktiveret smitstof"
          },
          {
            "id": "2",
            "text": "Tilfører instruktion til midlertidig antigenproduktion"
          }
        ],
        "correct": {
          "0": "2",
          "1": "0",
          "2": "1"
        },
        "explanation": "Platforme præsenterer antigener på forskellige måder."
      },
      {
        "id": "protection",
        "kind": "classify",
        "prompt": "Skeln mellem forhold der kan svække eller styrke immunbeskyttelsen.",
        "categories": [
          {
            "id": "0",
            "text": "Kan svække"
          },
          {
            "id": "1",
            "text": "Kan styrke"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Relevant antigenændring"
          },
          {
            "id": "1",
            "text": "Relevant boosterrespons"
          },
          {
            "id": "2",
            "text": "Immunsuppression"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "0"
        },
        "explanation": "Beskyttelse afhænger af blandt andet antigenmatch, tid og værtsfaktorer."
      },
      {
        "id": "memory",
        "kind": "short",
        "prompt": "Hvad kaldes vedvarende evne til et hurtigere specifikt immunrespons ved geneksponering?",
        "correct": "Immunologisk hukommelse",
        "accepted": [
          "immunhukommelse",
          "immunologisk memory"
        ],
        "explanation": "Hukommelses-B- og T-celler kan bidrage."
      },
      {
        "id": "tcell",
        "kind": "order",
        "prompt": "Byg en forenklet cytotoksisk respons.",
        "options": [
          {
            "id": "3",
            "text": "Den inficerede celle kan elimineres"
          },
          {
            "id": "2",
            "text": "T-cellen aktiverer drabsmekanismer"
          },
          {
            "id": "1",
            "text": "Specifik cytotoksisk T-celle genkender det"
          },
          {
            "id": "0",
            "text": "Virusinficeret celle præsenterer antigen"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Cytotoksiske T-celler kan genkende og eliminere inficerede værtsceller."
      },
      {
        "id": "interpret",
        "kind": "clues",
        "prompt": "Markér udsagn, der er forenelige med vaccinebeskyttelse.",
        "options": [
          {
            "id": "0",
            "text": "Infektion kan forekomme trods vaccination"
          },
          {
            "id": "1",
            "text": "Risiko for alvorlig sygdom kan stadig være reduceret"
          },
          {
            "id": "2",
            "text": "Vacciner kan have forskellige effekter på infektion og alvorlighed"
          },
          {
            "id": "3",
            "text": "Alle vacciner giver altid fuldstændig steril immunitet"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Beskyttelse mod infektion og mod alvorlig sygdom er forskellige mål."
      },
      {
        "id": "neutral",
        "kind": "short",
        "prompt": "Hvad kaldes antistoffers blokering af et smitstofs funktion eller cellebinding?",
        "correct": "Neutralisering",
        "accepted": [
          "neutralisation",
          "neutralization"
        ],
        "explanation": "Neutraliserende antistoffer kan hindre blandt andet cellebinding."
      }
    ]
  },
  {
    "id": "target-dose-elev",
    "familyId": "target-dose",
    "title": "Medicinregning ved klargøring",
    "category": "Farmakologi",
    "intro": "Under en fiktiv undervisningscase skal et team kontrollere en række mærkede øvelsesopløsninger. Alle ordinationer er regneeksempler uden relation til faktiske lægemidler eller behandlingsmål.",
    "vitals": {},
    "subjects": [
      "Medicinregning",
      "Farmakologi",
      "Sygdomslære",
      "Klinisk vurdering"
    ],
    "difficulty": "Elev",
    "status": "draft",
    "sources": [
      {
        "title": "OpenStax – Units and measurement",
        "url": "https://openstax.org/books/chemistry-2e/pages/1-4-measurements"
      }
    ],
    "takeaway": "Kontrollér ordination, koncentration, enheder og samlet mængde. Regneøvelserne er ikke kliniske doseringsanbefalinger.",
    "objectives": [
      "Regn med mg, ml og koncentration.",
      "Kontrollér enheder."
    ],
    "steps": [
      {
        "id": "units",
        "kind": "match",
        "prompt": "Forbind enhed med størrelse.",
        "left": [
          {
            "id": "0",
            "text": "mg"
          },
          {
            "id": "1",
            "text": "ml"
          },
          {
            "id": "2",
            "text": "mg/ml"
          }
        ],
        "right": [
          {
            "id": "0",
            "text": "Koncentration"
          },
          {
            "id": "1",
            "text": "Masse"
          },
          {
            "id": "2",
            "text": "Volumen"
          }
        ],
        "correct": {
          "0": "1",
          "1": "2",
          "2": "0"
        },
        "explanation": "Masse, volumen og koncentration skal holdes adskilt."
      },
      {
        "id": "amount",
        "kind": "number",
        "prompt": "Øvelsesopløsning: 2 mg/ml. Hvor mange mg er der i 4 ml?",
        "answer": 8,
        "unit": "mg",
        "tolerance": 0.001,
        "explanation": "2 × 4 = 8 mg."
      },
      {
        "id": "convert",
        "kind": "number",
        "prompt": "Omregn 0,5 g til mg.",
        "answer": 500,
        "unit": "mg",
        "tolerance": 0.001,
        "explanation": "0,5 × 1000 = 500 mg."
      },
      {
        "id": "volume",
        "kind": "model",
        "model": "drugVolume",
        "prompt": "Indstil volumen så en øvelsesopløsning på 4 mg/ml indeholder 12 mg.",
        "fixed": 4,
        "min": 0,
        "max": 6,
        "increment": 0.5,
        "initial": 1,
        "target": 12,
        "correct": 3,
        "tolerance": 0.001,
        "explanation": "12 / 4 = 3 ml."
      },
      {
        "id": "checks",
        "kind": "classify",
        "prompt": "Sortér oplysninger ved klargøring.",
        "categories": [
          {
            "id": "0",
            "text": "Masse"
          },
          {
            "id": "1",
            "text": "Volumen"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Ordination 6 mg"
          },
          {
            "id": "1",
            "text": "Sprøjten indeholder 3 ml"
          },
          {
            "id": "2",
            "text": "Hætteglas indeholder i alt 10 mg"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "0"
        },
        "explanation": "Kontrollér at enhederne passer sammen."
      },
      {
        "id": "remaining",
        "kind": "number",
        "prompt": "Et øvelseshætteglas indeholder 10 ml. Der bruges 3,5 ml. Hvor meget er tilbage?",
        "answer": 6.5,
        "unit": "ml",
        "tolerance": 0.001,
        "explanation": "10 − 3,5 = 6,5 ml."
      }
    ]
  },
  {
    "id": "target-dose-behandler",
    "familyId": "target-dose",
    "title": "Medicinregning ved klargøring",
    "category": "Farmakologi",
    "intro": "Under en fiktiv undervisningscase skal et team kontrollere en række mærkede øvelsesopløsninger. Alle ordinationer er regneeksempler uden relation til faktiske lægemidler eller behandlingsmål.",
    "vitals": {},
    "subjects": [
      "Medicinregning",
      "Farmakologi",
      "Sygdomslære",
      "Klinisk vurdering"
    ],
    "difficulty": "Behandler",
    "status": "draft",
    "sources": [
      {
        "title": "OpenStax – Units and measurement",
        "url": "https://openstax.org/books/chemistry-2e/pages/1-4-measurements"
      }
    ],
    "takeaway": "Kontrollér ordination, koncentration, enheder og samlet mængde. Regneøvelserne er ikke kliniske doseringsanbefalinger.",
    "objectives": [
      "Omregn vægtbaseret mængde og fortynding.",
      "Beregn hastighed."
    ],
    "steps": [
      {
        "id": "weight",
        "kind": "number",
        "prompt": "Fiktiv øvelsesordination: 0,2 mg/kg. Vægt 60 kg. Beregn mængden.",
        "answer": 12,
        "unit": "mg",
        "tolerance": 0.001,
        "explanation": "0,2 × 60 = 12 mg."
      },
      {
        "id": "volume",
        "kind": "number",
        "prompt": "De 12 mg skal måles fra øvelsesopløsning 4 mg/ml. Beregn volumen.",
        "answer": 3,
        "unit": "ml",
        "tolerance": 0.001,
        "explanation": "12 / 4 = 3 ml."
      },
      {
        "id": "dilute",
        "kind": "number",
        "prompt": "En øvelsesmængde på 20 mg bringes til et samlet volumen på 10 ml. Beregn koncentrationen.",
        "answer": 2,
        "unit": "mg/ml",
        "tolerance": 0.001,
        "explanation": "20 / 10 = 2 mg/ml."
      },
      {
        "id": "sequence",
        "kind": "order",
        "prompt": "Sæt kontrollen af en vægtbaseret beregning i en logisk rækkefølge.",
        "options": [
          {
            "id": "3",
            "text": "Beregn volumen og verificér resultat"
          },
          {
            "id": "2",
            "text": "Kontrollér opløsningens koncentration"
          },
          {
            "id": "1",
            "text": "Beregn den samlede mængde i mg"
          },
          {
            "id": "0",
            "text": "Kontrollér ordination og vægt"
          }
        ],
        "correct": [
          "0",
          "1",
          "2",
          "3"
        ],
        "explanation": "Kontrol af alle led begrænser risiko for enhedsfejl."
      },
      {
        "id": "rate",
        "kind": "number",
        "prompt": "En fiktiv væskeøvelse på 120 ml fordeles over 2 timer. Beregn hastighed.",
        "answer": 60,
        "unit": "ml/time",
        "tolerance": 0.001,
        "explanation": "120 / 2 = 60 ml/time."
      },
      {
        "id": "conversion",
        "kind": "classify",
        "prompt": "Sortér omregningerne.",
        "categories": [
          {
            "id": "0",
            "text": "Korrekt"
          },
          {
            "id": "1",
            "text": "Forkert"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "1 mg = 1000 µg"
          },
          {
            "id": "1",
            "text": "1 L = 100 ml"
          },
          {
            "id": "2",
            "text": "0,25 g = 250 mg"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "0"
        },
        "explanation": "1 L = 1000 ml, og 1 g = 1000 mg."
      }
    ]
  },
  {
    "id": "target-dose-paramediciner",
    "familyId": "target-dose",
    "title": "Medicinregning ved klargøring",
    "category": "Farmakologi",
    "intro": "Under en fiktiv undervisningscase skal et team kontrollere en række mærkede øvelsesopløsninger. Alle ordinationer er regneeksempler uden relation til faktiske lægemidler eller behandlingsmål.",
    "vitals": {},
    "subjects": [
      "Medicinregning",
      "Farmakologi",
      "Sygdomslære",
      "Klinisk vurdering"
    ],
    "difficulty": "Paramediciner",
    "status": "draft",
    "sources": [
      {
        "title": "OpenStax – Units and measurement",
        "url": "https://openstax.org/books/chemistry-2e/pages/1-4-measurements"
      }
    ],
    "takeaway": "Kontrollér ordination, koncentration, enheder og samlet mængde. Regneøvelserne er ikke kliniske doseringsanbefalinger.",
    "objectives": [
      "Kombinér koncentration, vægt og tid.",
      "Kontrollér samlet dosis og regnefejl."
    ],
    "steps": [
      {
        "id": "microgram",
        "kind": "number",
        "prompt": "Fiktiv øvelsesordination: 5 µg/kg til 80 kg. Beregn mængden i mg.",
        "answer": 0.4,
        "unit": "mg",
        "tolerance": 0.001,
        "explanation": "5 × 80 = 400 µg = 0,4 mg."
      },
      {
        "id": "concentration",
        "kind": "number",
        "prompt": "Øvelsesopløsning med 2 mg bringes til 20 ml samlet volumen. Beregn koncentrationen i µg/ml.",
        "answer": 100,
        "unit": "µg/ml",
        "tolerance": 0.001,
        "explanation": "2 mg = 2000 µg; 2000 / 20 = 100 µg/ml."
      },
      {
        "id": "volume",
        "kind": "number",
        "prompt": "Hvor mange ml af øvelsesopløsningen på 100 µg/ml indeholder 400 µg?",
        "answer": 4,
        "unit": "ml",
        "tolerance": 0.001,
        "explanation": "400 / 100 = 4 ml."
      },
      {
        "id": "total",
        "kind": "number",
        "prompt": "I en separat øvelse gives 15 ml/time af en opløsning med 2 mg/ml i 40 minutter. Beregn samlet mængde i mg.",
        "answer": 20,
        "unit": "mg",
        "tolerance": 0.001,
        "explanation": "15 × 40/60 × 2 = 20 mg."
      },
      {
        "id": "errors",
        "kind": "classify",
        "prompt": "Sortér de mulige regnefejl.",
        "categories": [
          {
            "id": "0",
            "text": "Øger beregnet mængde"
          },
          {
            "id": "1",
            "text": "Mindsker beregnet mængde"
          }
        ],
        "items": [
          {
            "id": "0",
            "text": "Indtaster 10 gange for høj vægt ved mg/kg"
          },
          {
            "id": "1",
            "text": "Bruger 10 gange for lille volumen ved fast koncentration"
          },
          {
            "id": "2",
            "text": "Forveksler µg med samme tal i mg"
          }
        ],
        "correct": {
          "0": "0",
          "1": "1",
          "2": "0"
        },
        "explanation": "Enheds- og decimalfejl kan give store afvigelser."
      },
      {
        "id": "check",
        "kind": "clues",
        "prompt": "Markér oplysninger der skal stemme ved en koncentrations- og hastighedsberegning.",
        "options": [
          {
            "id": "0",
            "text": "Ordinationens enhed og tidsenhed"
          },
          {
            "id": "1",
            "text": "Samlet volumen og koncentration"
          },
          {
            "id": "2",
            "text": "Vægt når ordinationen er vægtbaseret"
          },
          {
            "id": "3",
            "text": "Antag at et tidligere regnestykke altid gælder"
          }
        ],
        "correct": [
          "0",
          "1",
          "2"
        ],
        "explanation": "Kontrollér hver beregning selvstændigt og følg relevante kliniske instrukser."
      }
    ]
  }
];
export const targetedCurriculum={
  "target-cdiff-elev": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "target-cdiff-behandler": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "target-cdiff-paramediciner": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "target-biofilm-elev": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "target-biofilm-behandler": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "target-biofilm-paramediciner": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "target-di-elev": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "target-di-behandler": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "target-di-paramediciner": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "target-gi-elev": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "target-gi-behandler": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "target-gi-paramediciner": {
    "page": 38,
    "topic": "Sundheds- og sygdomslære 3"
  },
  "target-immunity-elev": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "target-immunity-behandler": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "target-immunity-paramediciner": {
    "page": 35,
    "topic": "Sundheds- og sygdomslære 2"
  },
  "target-dose-elev": {
    "page": 29,
    "topic": "Farmakologi 1"
  },
  "target-dose-behandler": {
    "page": 29,
    "topic": "Farmakologi 1"
  },
  "target-dose-paramediciner": {
    "page": 29,
    "topic": "Farmakologi 1"
  }
};
